const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow local tools/server-to-server requests without an Origin header.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed."));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Mini Task Manager API is running." });
});

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "Task text is required." });
  }

  const newTask = {
    id: nextId++,
    text: text.trim(),
    completed: false,
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.patch("/tasks/:id/toggle", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed,
  };

  return res.status(200).json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const initialLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json({ message: "Task deleted successfully." });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
