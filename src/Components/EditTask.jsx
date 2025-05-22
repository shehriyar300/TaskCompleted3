import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    users: [],
    taskname:"",
    taskDetail: "",
    difficulty: "",
    completed: false,
  });

  const [userList, setUserList] = useState([]);
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setLocalTasks(saved);
  }, []);

  useEffect(() => {
    if (id && localTasks.length > 0) {
      const found = localTasks.find((t) => t.id.toString() === id);
      if (found) {
        setTask(found);
      }
    }
  }, [id, localTasks]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setTask((prev) => {
      if (checked) {
        if (!prev.users.includes(value)) {
          return { ...prev, users: [...prev.users, value] };
        }
      } else {
        return { ...prev, users: prev.users.filter((u) => u !== value) };
      }
      return prev;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "completed") {
      setTask({ ...task, completed: value === "true" });
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTasks = localTasks.map((t) =>
      t.id.toString() === id ? { ...task, id: parseInt(id) } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Task</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Select Users:</label>
       <div style={{height:"250px" , overflowY: "scroll", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" , marginBottom: "10px"}}>
            {userList.map((u ,key) => (
              <label key={key}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="checkbox"
                  value={u.name}
                  checked={task.users.includes(u.name)}
                  onChange={handleCheckboxChange}
                  required={task.users.length === 0}
                />
                <img
                  src={
                    u.image ||
                    `https://randomuser.me/api/portraits/men/${u.id}.jpg`
                  }
                  alt={u.name}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
               
                <span>{u.name}</span>
              </label>
            ))}
          </div>

          <label>Task Name:</label>
          <input 
            type="text"
            name="taskname"
            maxLength={100}
            value={task.taskname}
            onChange={handleChange}
            required
          />
<label>Task Detail:</label>
          <textarea required value={task.taskDetail} onChange={handleChange} name="taskDetail" id="" maxLength={200} style={{ height: "100px" , width: "100%" }}></textarea>

          <label>Difficulty:</label>
          <select
            name="difficulty"
            value={task.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very hard">Very hard</option>
          </select>

          <label>Status:</label>
          <select
            name="completed"
            value={task.completed.toString()}
            onChange={handleChange}
          >
            <option value="false">Incomplete</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
}
