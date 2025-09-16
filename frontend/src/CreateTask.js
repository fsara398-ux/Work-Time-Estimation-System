import React, { useState,useEffect  } from "react";
import axios from "axios";
import Toast from "./Toast";

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users?role=ENG", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
         setToast({ message: "Failed to fetch engineers", type: "error" });
      }
    };
    fetchUsers();
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!title || !description || !userId) {
       setMessage("Please fill in all fields");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/tasks",
        { title, description, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear form
      setTitle("");
      setDescription("");
      setUserId("");
       setMessage("✅ Task created successfully!");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);

      // ✅ Let parent know a task was created
      if (onTaskCreated) {
        onTaskCreated(res.data);
      }
    } catch (err) {
       setMessage("❌ Failed to create task");
    setMessageType("error");
    setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
      <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    <form className="create-task-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>

     

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
        
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-textarea"
      />
       <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
        className="form-input"
      >
        <option value="">Select Engineer</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.id} - {user.email}
          </option>
        ))}
      </select>
      {/* <input
        type="number"
        placeholder="Assign to User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
        className="form-input"
      /> */}
      <button type="submit" className="submit-btn">
        Create Task
      </button>
      {message && (
  <div className={`message-box ${messageType}`}>
    {message}
  </div>
)}

    </form>
  </>
  );
}

export default CreateTask;
