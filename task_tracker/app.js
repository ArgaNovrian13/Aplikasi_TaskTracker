const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Task = require("./models/task");
const app = express();

// Koneksi ke MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tasks")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// Menampilkan semua tugas
app.get("/api/task", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Menambahkan tugas baru
app.post("/api/task", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Memperbarui tugas
app.put("/api/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Menghapus tugas
app.delete("/api/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mengambil tugas berdasarkan ID
app.get("/api/task/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Memulai server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
