// Dependencies
const express = require('express');
const protect = require('../middlewares/protect');
// Controller
const taskController = require("../controllers/task.controller");

// Module scaffolding
const taskRouter = express.Router();

// Create a new task
taskRouter.post("/create", protect, taskController.createTask);

// Get all tasks
taskRouter.get("/all", protect, taskController.getAllTasks);

// Get a single task
taskRouter.get("/single/:id", protect, taskController.getSingleTask);

// Update a task
taskRouter.put("/update/:id", protect, taskController.updateTask);

// Delete a task
taskRouter.delete("/delete/:id", protect, taskController.deleteTask);

// Export module
module.exports = taskRouter;
