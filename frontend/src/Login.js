import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PM"); // default PM
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const response = await axios.post("http://localhost:4000/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      onLogin(token); // callback to parent
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>WORKING TIME ESTIMATION SYSTEM</h2>
        <h2>LOGIN</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button className="login-btn" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
}

export default Login;
