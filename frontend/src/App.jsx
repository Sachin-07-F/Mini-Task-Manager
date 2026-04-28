import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function App() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingTaskIds, setDeletingTaskIds] = useState([]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );
  const notCompletedCount = tasks.length - completedCount;

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }
      const data = await response.json();
      setTasks(data);
    } catch (fetchError) {
      setError(fetchError.message || "Something went wrong while fetching.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!taskText.trim()) return;

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskText }),
      });

      if (!response.ok) {
        throw new Error("Unable to add task.");
      }

      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setTaskText("");
      toast.success("Task Added");
    } catch (addError) {
      setError(addError.message || "Failed to add task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete task.");
      }

      setDeletingTaskIds((prevIds) => [...prevIds, taskId]);
      setTimeout(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setDeletingTaskIds((prevIds) => prevIds.filter((id) => id !== taskId));
      }, 220);
      toast.success("Task Deleted");
    } catch (deleteError) {
      setDeletingTaskIds((prevIds) => prevIds.filter((id) => id !== taskId));
      setError(deleteError.message || "Failed to delete task.");
    }
  };

  const handleToggleTask = async (taskId) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to update task status.");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (toggleError) {
      setError(toggleError.message || "Failed to toggle task.");
    }
  };

  return (
    <main className="app-shell">
      <Toaster position="top-right" />
      <section className="task-layout">
        <h1>Mini Task Manager</h1>
        <p className="app-description">Track your daily work with a clean, focused flow.</p>
        <div className="dashboard-columns">
          <div className="left-column">
            <article className="ui-card add-card">
              <h2>Add New Task</h2>
              <form className="task-form" onSubmit={handleAddTask}>
                <input
                  type="text"
                  value={taskText}
                  onChange={(event) => setTaskText(event.target.value)}
                  placeholder="Enter a new task..."
                  aria-label="Task text"
                />
                <div className="add-task-action">
                  <button type="submit">Add Task</button>
                </div>
              </form>
            </article>

            <div className="stats-grid">
              <article className="ui-card stat-card stat-card-completed">
                <p className="subtitle">Completed Task Count</p>
                <strong>{completedCount}</strong>
              </article>

              <article className="ui-card stat-card stat-card-not-completed">
                <p className="subtitle">Not Completed Task Count</p>
                <strong>{notCompletedCount}</strong>
              </article>
            </div>
          </div>

          <article className="ui-card tasks-card">
            <h2>All Tasks</h2>
            {error ? <p className="error">{error}</p> : null}

            {isLoading ? (
              <p className="status">Loading tasks...</p>
            ) : (
              <ul className="task-list">
                {tasks.length === 0 ? (
                  <li className="empty-state">No tasks yet. Add your first task.</li>
                ) : (
                  tasks.map((task) => (
                    <li
                      key={task.id}
                      className={[
                        "task-item",
                        task.completed ? "task-item-completed" : "",
                        deletingTaskIds.includes(task.id) ? "task-item-deleting" : "",
                      ]
                        .join(" ")
                        .trim()}
                    >
                      <label className="task-left">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          aria-label={`Mark ${task.text} as complete`}
                        />
                        <span className={task.completed ? "task-text done" : "task-text"}>
                          {task.text}
                        </span>
                      </label>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
