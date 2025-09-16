import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskEndDateCalculator from "./TaskEndDateCalculator";
import CreateTask from "./CreateTask";

function PMDashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

   return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">PM Dashboard - All Tasks</h2>

      {/* Create Task Form */}
      <CreateTask onTaskCreated={fetchTasks} />

      <div className="task-cards-container">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <p><strong>Task:</strong> {task.title}</p>
            <p><strong>Assigned To:  {task.userId} </strong>({task.user?.email || "No email"})</p>
            <p><strong>Estimate:</strong> {task.estimatedHours || "Not submitted"}</p>

            {/* End Date Calculator */}
            <TaskEndDateCalculator taskId={task.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PMDashboard;
