import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function DetailTask() {
    const { id } = useParams(); // URL-dən id gəlir
    const [task, setTask] = useState(null);

    useEffect(() => {
        // localStorage-dan task list-i alırıq
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            try {
                const parsedTasks = JSON.parse(storedTasks);
                const found = parsedTasks.find(task => task.id.toString() === id);
                setTask(found);
            } catch (error) {
                console.error("JSON parsing xətası:", error);
            }
        }
    }, [id]);

   if (!task) return (
  <div>
    <p>Task not found</p>
    <Link style={{textAlign:"center" , display:"block" , fontSize:"32px", margin:"30px",textDecoration:"none", color:"black"}}  to="/">Home</Link>
  </div>
);

    return (
        <>
            <h2>Detail Task</h2>
            <div className='detail'>
                <p><strong>Task ID:</strong> {task.id}</p>
                <p><strong>Task Detail:</strong> {task.taskDetail}</p>
                <p><strong>Difficulty:</strong> {task.difficulty}</p>
                <p><strong>Users:</strong> {task.users.length ? task.users.join(', ') : "Yoxdur"}</p>
                <p><strong>Status:</strong> {task.completed ? "Completed" : "Incomplete"}</p>
            </div>
        </>
    );
}

export default DetailTask;

