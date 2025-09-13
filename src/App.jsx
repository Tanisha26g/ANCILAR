import React, { useState, useEffect } from "react";
import "./App.css";

const LOCAL_STORAGE_KEY = "my-tasks";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    onAdd({
      id: Date.now(),
      title: title.trim(),
      category: category.trim(),
      dueDate,
      note: note.trim(),
      completed: false,
    });
    setTitle("");
    setCategory("");
    setDueDate("");
    setNote("");
    setError("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

function TaskList({ tasks, onToggle, onRemove }) {
  if (tasks.length === 0) {
    return <div className="empty">No tasks yet.</div>;
  }
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={task.completed ? "completed" : ""}
        >
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <span className="title">{task.title}</span>
            <span className="category">[{task.category}]</span>
            <span className="due">Due: {task.dueDate}</span>
            {task.note && <span className="note">({task.note})</span>}
          </div>
          <button className="remove" onClick={() => onRemove(task.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function Progress({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  if (total === 0) return null;
  return (
    <div className="progress">
      Progress: {completed} of {total} tasks completed
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{
            width: `${(completed / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks([task, ...tasks]);
  const toggleTask = (id) =>
    setTasks((tasks) =>
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  const removeTask = (id) =>
    setTasks((tasks) => tasks.filter((t) => t.id !== id));

  return (
    <div className="app-container">
      <h1>Personal Task Manager</h1>
      <TaskForm onAdd={addTask} />
      <Progress tasks={tasks} />
      <TaskList tasks={tasks} onToggle={toggleTask} onRemove={removeTask} />
    </div>
  );
}