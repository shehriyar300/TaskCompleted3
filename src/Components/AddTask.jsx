import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTask() {
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
  const [local, setLocal] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setLocal(savedTasks);
  }, []);

  useEffect(() => {
    if (id) {
      const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const foundTask = savedTasks.find((t) => t.id?.toString() === id);
      if (foundTask) {
        setTask(foundTask);
      }
    }
  }, [id]);

  const handleCheckboxChange = (e, user) => {
    const { checked } = e.target;
    setTask((prev) => {
      if (checked) {
        if (!prev.users.some((u) => u.id === user.id)) {
          return { ...prev, users: [...prev.users, user] };
        }
      } else {
        return {
          ...prev,
          users: prev.users.filter((u) => u.id !== user.id),
        };
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
    let updatedTasks;

    if (id) {
      updatedTasks = local.map((t) =>
        t.id?.toString() === id ? { ...task, id: parseInt(id) } : t
      );
    } else {
      const newTask = {
        ...task,
        id: Date.now(),
      };
      updatedTasks = [...local, newTask];
    }

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setLocal(updatedTasks);
    navigate("/");
  };

  return (
    <div>
      <h2>{id ? "Edit Task" : "Add Task"}</h2>
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
          {userList.map((u) => (
            <label key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                required={task.users.length === 0}
                checked={task.users.some((usr) => usr.id === u.id)}
                onChange={(e) => handleCheckboxChange(e, { id: u.id, name: u.name })}
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

        <label>Task Name:</label>
        <input
          type="text"
          name="taskname"
          value={task.taskname}
          onChange={handleChange}
          required
          maxLength={25}
        />

        <label>Task Detail:</label>
        <textarea
          required
          name="taskDetail"
          value={task.taskDetail}
          onChange={handleChange}
          maxLength={2000}
          style={{ height: "100px", width: "100%" }}
        ></textarea>

        <label>Status:</label>
      

        <button type="submit">{id ? "Update" : "Add"}</button>
      </form>
    </div>
  );
}
