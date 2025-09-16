import React, { useState, useEffect } from "react";
import Login from "./Login";
import PMDashboard from "./PMDashboard";
import EngineerDashboard from "./EngineerDashboard";
import Settings from "./Settings";
import axios from "axios";
import './styles/global.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard"); // dashboard or settings

  // After login, get user profile
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:4000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRole(res.data.role))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    setPage("dashboard");
  };

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  // PM view with navigation
  // Inside App.js

// PM view
if (role === "PM") {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Working Time Estimation</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn ${page === "settings" ? "active" : ""}`}
          onClick={() => setPage("settings")}
        >
          Settings
        </button>
      </nav>

      <main className="app-main">
        {page === "dashboard" && <PMDashboard />}
        {page === "settings" && <Settings />}
      </main>
    </div>
  );
}

// Engineer view
if (role === "ENG") {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Working Time Estimation</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="app-main">
        <EngineerDashboard />
      </main>
    </div>
  );
}


  return <p>Loading...</p>;
}

export default App;
