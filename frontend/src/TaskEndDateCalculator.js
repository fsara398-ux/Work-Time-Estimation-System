import React, { useState } from "react";
import axios from "axios";

function TaskEndDateCalculator({ taskId }) {
  const [startDate, setStartDate] = useState("");
  const [estimateDays, setEstimateDays] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const calculateEndDate = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) return setError("Please login first");

      const response = await axios.post(
        `http://localhost:4000/tasks/${taskId}/calculate-end`,
        { startDate, estimateDays: parseFloat(estimateDays) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEndDate(response.data.endDate);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error calculating end date");
    }
  };

  return (
  <div className="calculator-container">
    <div className="form-group">
      <label className="form-label">Start Date/Time:</label>
      <input
        type="datetime-local"
        className="form-input"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Estimate (days):</label>
      <input
        type="number"
        step="0.01"
        className="form-input"
        value={estimateDays}
        onChange={(e) => setEstimateDays(e.target.value)}
      />
    </div>

    <button className="calculate-btn" onClick={calculateEndDate}>
      Calculate End Date
    </button>

    {endDate && (
      <p className="result-text">
        <strong>Calculated End Date:</strong> {new Date(endDate).toLocaleString()}
      </p>
    )}

    {error && <p className="error-text">{error}</p>}
  </div>
);

}

export default TaskEndDateCalculator;
