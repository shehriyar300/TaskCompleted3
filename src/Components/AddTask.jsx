import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTask() {
  const [task, setTask] = useState({
    users: [],
    taskDetail: "",
    difficulty: "",
    completed: false,
  });
  const [userList, setUserList] = useState([]);
  const [local, setLocal] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users`)
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setTask((prev) => {
      if (checked) {
        // İşarələnən istifadəçini əlavə et (əgər yoxdursa)
        if (!prev.users.includes(value)) {
          return { ...prev, users: [...prev.users, value] };
        }
      } else {
        // İşarəni götürülən istifadəçini çıxar
        return { ...prev, users: prev.users.filter((u) => u !== value) };
      }
      return prev;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedTasks;

    if (id) {
      updatedTasks = local.map((t) =>
        t.id?.toString() === id ? { ...task, id: parseInt(id) } : t
      );
    } else {
      const newTask = { ...task, id: Date.now() ,image: `https://randomuser.me/api/portraits/men/${userList.length}.jpg`};
      updatedTasks = [...local, newTask];
    }
    console.log("salam");

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setLocal(updatedTasks);
    navigate("/");
  };

  return (
    <div>
      <h2>{id ? "Edit Task" : "Add Task"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Users:</label>
          <div>
            {userList.map((u) => (
              <label
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
                {console.log(u)
                }
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

          <label>Task Detail:</label>
          <input
            type="text"
            name="taskDetail"
            value={task.taskDetail.trimStart()}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit"  >{id ? "Update" : "Add"} </button>
      </form>
    </div>
  );
}
