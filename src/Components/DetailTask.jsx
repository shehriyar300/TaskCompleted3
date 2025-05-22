import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DetailTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        const found = parsedTasks.find((task) => task.id.toString() === id);
        setTask(found);
      } catch (error) {
        console.error("JSON parsing xətası:", error);
      }
    }
  }, [id]);

  if (!task)
    return (
      <div>
        <p>Task not found</p>
        <Link
          to="/"
          style={{
            textAlign: "center",
            display: "block",
            fontSize: "32px",
            margin: "30px",
            textDecoration: "none",
            color: "black",
          }}
        >
          Home
        </Link>
      </div>
    );

  return (
    <>
      <h2>Detail Task</h2>
      <div className="detail">
        <p>
          <strong>Task ID:</strong> {task.id}
        </p>
        <p>
          <strong>Task Name:</strong> {task.taskname}
        </p>
        <p>
          <strong>Task Detail:</strong> {task.taskDetail}
        </p>
        <p>
          <strong>Difficulty:</strong> {task.difficulty}
        </p>
        <div className="user-list">
          <strong>Users:</strong>{" "}
          <span className="user-info">
            {task.users.map((user, index) => (
              <React.Fragment key={index}>
                <p><img
                  src={`https://randomuser.me/api/portraits/men/${user.id}.jpg`}
                  alt={user.name}
                />
                <span>{user.name}</span></p>
              </React.Fragment>
            ))}
          </span>
        </div>
        <p>
          <strong>Status:</strong> {task.completed ? "Completed" : "Incomplete"}
        </p>
      </div>
    </>
  );
}

export default DetailTask;
