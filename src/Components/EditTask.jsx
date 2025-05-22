import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    users: [],
    taskname: "",
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

  const handleCheckboxChange = (e, user) => {
    const { checked } = e.target;
    setTask((prev) => {
      if (checked) {
        // əgər istifadəçi yoxdursa, əlavə et
        if (!prev.users.some((u) => u.id === user.id)) {
          return { ...prev, users: [...prev.users, { id: user.id, name: user.name }] };
        }
      } else {
        // əgər checkbox çıxarılıbsa, sil
        return { ...prev, users: prev.users.filter((u) => u.id !== user.id) };
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
        <label>Select Users:</label>
        <div
          style={{
            height: "250px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          {userList.map((u, key) => (
            <label
              key={key}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}
            >
              <input
                type="checkbox"
                value={u.name}
                checked={task.users.some((user) => user.id === u.id)}
                onChange={(e) => handleCheckboxChange(e, u)}
              />
              <img
                src={`https://randomuser.me/api/portraits/men/${u.id}.jpg`}
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
        <textarea
          required
          value={task.taskDetail}
          onChange={handleChange}
          name="taskDetail"
          maxLength={200}
          style={{ height: "100px", width: "100%" }}
        ></textarea>

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

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
}
