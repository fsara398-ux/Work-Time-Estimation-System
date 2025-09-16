import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskEndDateCalculator from "./TaskEndDateCalculator";

function EngineerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [estimates, setEstimates] = useState({});
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const [messageType, setMessageType] = useState("");

  // Fetch tasks assigned to engineer
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Submit estimate for a task
  const submitEstimate = async (taskId, estimate) => {
    if (!estimate) return;

    try {
      await axios.post(
        `http://localhost:4000/tasks/${taskId}/estimate`,
        { estimateDays: parseFloat(estimate) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tasks after submission
      fetchTasks();
     setMessage("Estimation Submitted Succesfully !");
setMessageType("success");
setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error Submitting Estimation");
          setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard-container">
      {message && (
  <div className={`message-box ${messageType}`}>
    {message}
  </div>
)}

      <h2 className="dashboard-title">Engineer Dashboard</h2>

      {message && <p className="status-message">{message}</p>}

      {tasks.length === 0 && <p className="no-tasks">No tasks assigned</p>}

      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <p><strong>Task:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p>
            <strong>Current Estimate:</strong>{" "}
            {task.estimatedHours || "Not submitted"}
          </p>

          <div className="estimate-input-group">
            <input
              type="number"
              step="0.01"
              placeholder="Enter estimate (days)"
              value={estimates[task.id] || ""}
              onChange={(e) =>
                setEstimates({ ...estimates, [task.id]: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") submitEstimate(task.id, estimates[task.id]);
              }}
              className="estimate-input"
            />
            <button
              onClick={() => submitEstimate(task.id, estimates[task.id])}
              className="submit-btn"
            >
              Submit Estimate
            </button>
          </div>

          {/* End date calculator */}
          <TaskEndDateCalculator taskId={task.id} />
        </div>
      ))}
    </div>
  );
}

export default EngineerDashboard;
