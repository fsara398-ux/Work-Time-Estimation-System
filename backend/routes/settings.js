const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");
const prisma = new PrismaClient();

// --- GET company settings ---
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "PM") {
      return res.status(403).json({ error: "Only PM can access settings" });
    }

    // Get the first settings row
    let settings = await prisma.companySetting.findFirst();

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.companySetting.create({
        data: { startHour: 8, endHour: 16 },
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Update working hours ---
router.put("/working-hours", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "PM") {
      return res.status(403).json({ error: "Only PM can update working hours" });
    }

    const { startHour, endHour } = req.body;

    // Upsert the company setting
    const settings = await prisma.CompanySetting.upsert({
      where: { id: 1 },
      update: { startHour: parseInt(startHour), endHour: parseInt(endHour) },
      create: { startHour: parseInt(startHour), endHour: parseInt(endHour) },
    });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// --- Add recurring holiday ---
router.post("/recurring-holidays", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "PM") {
      return res.status(403).json({ error: "Only PM can add holidays" });
    }

    const { month, day, reason } = req.body;

    const holiday = await prisma.recurringHoliday.create({
      data: { month, day, reason },
    });

    res.json(holiday);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Add one-time holiday ---
router.post("/one-time-holidays", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "PM") {
      return res.status(403).json({ error: "Only PM can add holidays" });
    }

    const { date, reason } = req.body; // format: YYYY-MM-DD

    // Convert to proper Date object for Prisma
    const holiday = await prisma.oneTimeHoliday.create({
      data: { date: new Date(date), reason },
    });

    res.json(holiday);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
