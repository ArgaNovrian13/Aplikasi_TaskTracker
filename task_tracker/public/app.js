document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");
  let editingTaskId = null;

  // Fetch and display tasks on load
  fetchTasks();

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskTitle = document.getElementById("task-title").value;
    const taskDesc = document.getElementById("task-description").value;

    const task = {
      title: taskTitle,
      desc: taskDesc,
    };

    try {
      if (editingTaskId) {
        // Update task
        const response = await fetch(`/api/task/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const updatedTask = await response.json();
        document.querySelector(`[data-id="${editingTaskId}"]`).innerHTML = `
          <span>${updatedTask.title}: ${updatedTask.desc}</span>
          <span class="edit">✎</span>
          <span class="delete">✗</span>
        `;

        editingTaskId = null;
      } else {
        // Add new task
        const response = await fetch("/api/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const newTask = await response.json();
        addTaskToDOM(newTask);
      }

      taskForm.reset();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  });

  async function fetchTasks() {
    try {
      const response = await fetch("/api/task");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const tasks = await response.json();
      tasks.forEach(addTaskToDOM);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task._id; // Use _id from MongoDB
    li.innerHTML = `
      <span>${task.title}: ${task.desc}</span>
      <span class="edit">✎</span>
      <span class="delete">✗</span>
    `;
    taskList.appendChild(li);
  }

  taskList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete")) {
      const id = e.target.parentElement.dataset.id;
      try {
        const response = await fetch(`/api/task/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        e.target.parentElement.remove();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }

    if (e.target.classList.contains("edit")) {
      const id = e.target.parentElement.dataset.id;
      try {
        const response = await fetch(`/api/task/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const task = await response.json();
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-description").value = task.desc;

        editingTaskId = id; // Set the task ID for editing
      } catch (error) {
        console.error("Error fetching task for editing:", error);
      }
    }
  });
});
