const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const promisify = require("util").promisify;
const generateUniqueId = require("uuid").v4;
const cors = require("cors");

const db = new sqlite3.Database("./tasks.db");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const allAsync = promisify(db.all.bind(db));
const runAsync = promisify(db.run.bind(db));
const createTasksTable = async () => {
  try {
    await runAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'Pending'
      )
    `);
    console.log("Tasks table created successfully");
  } catch (error) {
    console.error("Error creating tasks table:", error);
  }
};

app.get("/tasks", async (req, res) => {
  try {
    console.log("hit");
    const tasks = await allAsync("SELECT * FROM tasks");
    console.log("my tasks", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-task", async (req, res) => {
  console.log("add task", await req.body);
  const newTask = await req.body;
  newTask.id = generateUniqueId();
  newTask.status = "Pending";
  try {
    await runAsync(
      `
        INSERT INTO tasks (id, name, description, status)
        VALUES (?, ?, ?, ?)
      `,
      [newTask.id, newTask.name, newTask.description, newTask.status],
    );
    res.json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete-task", async (req, res) => {
  const { taskId } = await req.body;
  console.log("🚀 ~ app.post ~ taskId:", taskId);

  try {
    await runAsync("DELETE FROM tasks WHERE id = ?", [taskId]);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update-status", async (req, res) => {
  const { taskId } = await req.body;
  console.log("🚀 ~ app.update-task ~ taskId:", taskId);

  try {
    await runAsync("UPDATE tasks SET status = ? WHERE id = ?", [
      "Completed",
      taskId,
    ]);
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  createTasksTable();
  console.log("[Server Running on http://localhost:5000]");
});
