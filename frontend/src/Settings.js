import React, { useEffect, useState } from "react";
import axios from "axios";

function Settings() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // State
  const [settings, setSettings] = useState({ startHour: 8, endHour: 16 });
  const [recurringHolidays, setRecurringHolidays] = useState([]);
  const [oneTimeHolidays, setOneTimeHolidays] = useState([]);
  const [newRecurring, setNewRecurring] = useState({ month: "", day: "", reason: "" });
  const [newOneTime, setNewOneTime] = useState({ date: "", reason: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"


  // Fetch settings and holidays
  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/settings", { headers });
      if (res.data) setSettings(res.data);

      const recRes = await axios.get("http://localhost:4000/settings/recurring-holidays", { headers });
      const oneRes = await axios.get("http://localhost:4000/settings/one-time-holidays", { headers });

      setRecurringHolidays(recRes.data || []);
      setOneTimeHolidays(oneRes.data || []);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update working hours
  const updateWorkingHours = async () => {
    try {
      const res = await axios.put(
        "http://localhost:4000/settings/working-hours",
        { startHour: parseInt(settings.startHour), endHour: parseInt(settings.endHour) },
        { headers }
      );
      setSettings(res.data);
      setMessage("Working hours updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
       setMessage("Failed to update working hours");
       setMessageType("error");
       setTimeout(() => setMessage(""), 3000);
    }
  };

  // Add recurring holiday
  const addRecurringHoliday = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/settings/recurring-holidays",
        { 
          month: parseInt(newRecurring.month), 
          day: parseInt(newRecurring.day), 
          reason: newRecurring.reason 
        },
        { headers }
      );
      setRecurringHolidays([...recurringHolidays, res.data]);
      setNewRecurring({ month: "", day: "", reason: "" });
      setMessage("Recurring holiday added successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
     // on error:
        setMessage("Failed to add recurring holiday");
          setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
    }
  };

  // Add one-time holiday
  const addOneTimeHoliday = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/settings/one-time-holidays",
        { date: newOneTime.date, reason: newOneTime.reason },
        { headers }
      );
      setOneTimeHolidays([...oneTimeHolidays, res.data]);
      setNewOneTime({ date: "", reason: "" });
      setMessage("One time holiday added successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add one time holiday");
          setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="settings-container">
      {message && (
  <div className={`message-box ${messageType}`}>
    {message}
  </div>
)}

      <h2>Company Settings</h2>

      {/* Working Hours */}
      <div className="settings-section">
        <h3>Working Hours</h3>
        <input
          type="number"
          value={settings.startHour}
          onChange={(e) => setSettings({ ...settings, startHour: e.target.value })}
          placeholder="Start Hour"
          className="form-input"
        />
        <input
          type="number"
          value={settings.endHour}
          onChange={(e) => setSettings({ ...settings, endHour: e.target.value })}
          placeholder="End Hour"
          className="form-input"
        />
        <button onClick={updateWorkingHours} className="submit-btn">Update</button>
      </div>

      {/* Recurring Holidays */}
      <div className="settings-section">
        <h3>Recurring Holidays</h3>
        <ul className="holiday-list">
          {recurringHolidays.map(h => (
            <li key={h.id}>{`${h.day}/${h.month} - ${h.reason || "No reason"}`}</li>
          ))}
        </ul>
        <input
          type="number"
          placeholder="Month"
          value={newRecurring.month}
          onChange={(e) => setNewRecurring({ ...newRecurring, month: e.target.value })}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Day"
          value={newRecurring.day}
          onChange={(e) => setNewRecurring({ ...newRecurring, day: e.target.value })}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Reason"
          value={newRecurring.reason}
          onChange={(e) => setNewRecurring({ ...newRecurring, reason: e.target.value })}
          className="form-input"
        />
        <button onClick={addRecurringHoliday} className="submit-btn">Add Recurring Holiday</button>
      </div>

      {/* One-Time Holidays */}
      <div className="settings-section">
        <h3>One-Time Holidays</h3>
        <ul className="holiday-list">
          {oneTimeHolidays.map(h => (
            <li key={h.id}>{`${new Date(h.date).toLocaleDateString()} - ${h.reason || "No reason"}`}</li>
          ))}
        </ul>
        <input
          type="date"
          value={newOneTime.date}
          onChange={(e) => setNewOneTime({ ...newOneTime, date: e.target.value })}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Reason"
          value={newOneTime.reason}
          onChange={(e) => setNewOneTime({ ...newOneTime, reason: e.target.value })}
          className="form-input"
        />
        <button onClick={addOneTimeHoliday} className="submit-btn">Add One-Time Holiday</button>
      </div>
    </div>
  );
}

export default Settings;
