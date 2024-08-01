const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

// Mengatur nama koleksi sebagai 'task'
module.exports = mongoose.model("Task", TaskSchema, "task");
