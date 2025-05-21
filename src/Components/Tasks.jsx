import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);
  };

  const handleComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated);
  };

  const handleEdit = (id) => {
    navigate(`/add/${id}`);
  };

  const filteredTasks = tasks
    .filter((task) => {
      return (
        task.taskDetail.toLowerCase().includes(search.toLowerCase()) ||
        task.users.join("").toLowerCase().includes(search.toLowerCase())||
        task.taskname.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((task) => {
      if (statusFilter === "completed") return task.completed;
      if (statusFilter === "incomplete") return !task.completed;
      return true;
    })
    .filter((task) => {
      if (difficultyFilter === "all") return true;
      return task.difficulty === difficultyFilter;
    });

  return (
    <div>
      <h2>All Tasks</h2>

      <div className="filtr">
        <input
          type="text"
          placeholder="Search..."
          value={search.trimStart()}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          onChange={(e) => setDifficultyFilter(e.target.value)}
          value={difficultyFilter}
        >
          <option value="all">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Very hard">Very hard</option>
        </select>
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>Not Found</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              className={task.completed ? "completed" : "incomplete"}
              key={task.id}
            >
              <strong>
                {task.users.join(", ").length > 20
                  ? task.users.join(", ").slice(0, 20) + "...." + (task.users.length - 1)
                  : task.users.join(", ")}
              </strong>
              <p>{task.taskname}</p>
              <p>
                {task.taskDetail.length > 20
                  ? task.taskDetail.trim().slice(0, 20) + "...."
                  : task.taskDetail}
              </p>
              <br />
              Difficulty: {task.difficulty || "Not specified"}
              <br />
              <span>Status: {task.completed ? "Completed" : "Incomplete"}</span>
              <div className="button-group">
                <button className="btn" onClick={() => handleEdit(task.id)}>
                  Edit
                </button>
                <button className="btn" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
                <button className="btn" onClick={() => handleComplete(task.id)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <br />
                <button
                  className="btn"
                  onClick={() =>
                    navigate(`/detailtask/${task.id}`, { state: task })
                  }
                >
                  {" "}
                  Read More{" "}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
