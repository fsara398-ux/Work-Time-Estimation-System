const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const settingsRoutes = require("./routes/settings");


const app = express();
const cors = require("cors");

app.use(cors()); 
app.use(express.json());

const prisma = new PrismaClient();

app.use(express.json());

const JWT_SECRET = "supersecretkey";
app.use("/settings", settingsRoutes);

// --- AUTH ROUTES ---
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, userId } = req.body; // frontend sends "userId"
    
    // Only PM can create tasks
    if (req.user.role !== "PM") {
      return res.status(403).json({ error: "Only PM can create tasks" });
    }

    const engineerId = parseInt(userId);
    if (isNaN(engineerId)) {
      return res.status(400).json({ error: "Assigned userId must be a number" });
    }

    // Check if engineer exists
    const engineer = await prisma.user.findUnique({ where: { id: engineerId } });
    if (!engineer || engineer.role !== "ENG") {
      return res.status(400).json({ error: "Assigned user is not a valid engineer" });
    }

    const task = await prisma.task.create({
      data: { title, description, userId: engineerId },
    });

    res.json({ message: "Task created", task });
  } catch (err) {
    console.error("❌ Task creation error:", err);
    res.status(500).json({ error: "Error creating task", details: err.message });
  }
});



// Engineer views their tasks
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "PM") {
      // PM sees all tasks
      tasks = await prisma.task.findMany({
        include: { user: true },
      });
    } else {
      // Engineer sees only their tasks
      tasks = await prisma.task.findMany({
        where: { userId: req.user.userId },
      });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Engineer submits estimate
app.post("/tasks/:id/estimate", authMiddleware, async (req, res) => {
  try {
    const { estimateDays } = req.body;
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Only the assigned Engineer can submit
    if (task.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { estimatedHours: estimateDays },
    });

    res.json({ message: "Estimate submitted", task: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// routes/tasks.js (or wherever your endpoint is)

const { calculateEndDate } = require("./services/timeEstimator");

app.post("/tasks/:id/calculate-end", authMiddleware, async (req, res) => {
  try {
    const { startDate, estimateDays } = req.body;

    const workHours = { startHour: 8, endHour: 16 };

    // Fetch holidays from DB
    const recurringHolidays = (await prisma.recurringHoliday.findMany())
  .map(h => ({ day: h.day, month: h.month }));

const oneTimeHolidays = (await prisma.oneTimeHoliday.findMany())
  .map(h => ({ date: h.date.toISOString().split("T")[0] }));

    // Pass them to the function
    const endDate = calculateEndDate(
      new Date(startDate),
      estimateDays,
      workHours,
      recurringHolidays,
      oneTimeHolidays
    );

    res.json({ endDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







// routes/users.js or in your main server file
app.get("/users", async (req, res) => {
  try {
    const role = req.query.role; // ?role=ENG
    if (!role) return res.status(400).json({ error: "Role query required" });

    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true, email: true } // only send what you need
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// --- PROTECTED TEST ROUTE ---
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json(user);
});

// start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
