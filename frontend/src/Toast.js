
import React from "react";
import "./styles/global.css"; // make sure global.css is imported

function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
