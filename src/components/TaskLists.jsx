import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { db } from '../firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import SignOut from './SignOut.jsx';

const TaskLists = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const fetchTask = async () => {
        setLoading(true);
        try {
            const collectionRef = collection(db, 'tasks');
            const querySnapshot = await getDocs(collectionRef);
            const taskList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(taskList);
        } catch (error) {
            console.error(error.message);
            setError("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    const TaskItem = ({ task }) => {
        const { id, title, description, status } = task;

        const handleStatusChange = async () => {
            const taskRef = doc(db, "tasks", id);
            try {
                await updateDoc(taskRef, {
                    status: status === "pending" ? "completed" : "pending",
                });
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === id ? { ...t, status: status === "pending" ? "completed" : "pending" } : t
                    )
                );
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        };

        const handleDelete = async () => {
            const taskRef = doc(db, "tasks", id);
            try {
                await deleteDoc(taskRef);
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
            } catch (error) {
                console.error("Error deleting task: ", error);
            }
        };

        return (
            <li className={`task-item ${status === "completed" ? "completed" : "pending"}`}>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Status:</strong> {status}</p>
                <button onClick={handleStatusChange} className="status-btn">
                    {status === "pending" ? "Mark as Completed" : "Mark as Pending"}
                </button>
                <button onClick={handleDelete} className="delete-btn">
                    <MdDelete /> Delete
                </button>
            </li>
        );
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setError("Both fields are required.");
            return;
        }
        try {
            await addDoc(collection(db, "tasks"), {
                title,
                description,
                status: "pending",
            });
            setTitle("");
            setDescription("");
            setError("");
            fetchTask(); // Optional: refresh tasks after adding one
        } catch (error) {
            console.error("Error adding task: ", error);
            setError("Failed to add task.");
        }
    };

    useEffect(() => {
        fetchTask();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="task-lists-container">
            <h1>Todo React App</h1>
            <h2>Task List</h2>
            <h3>Welcome, {user.displayName || user.email} </h3>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleAddTask} className="add-task-form">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="input-field"
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="textarea-field"
                />
                <button type="submit" className="add-btn"><MdAdd /> Add Task</button>
            </form>

            <ul className="task-list">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>

            <SignOut />
        </div>
    );
};

export default TaskLists;