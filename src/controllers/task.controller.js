// Dependencies
const createError = require('http-errors');
const Task = require('../models/task.model');
require('dotenv').config('../../.env');
const { createTask, updateTask } = require('../validations/task.validation');
const User = require('../models/user.model');

// Module scaffolding
const taskController = {};

// Create a new task
taskController.createTask = async (req, res, next) => {
  try {
    // get user id from protect middleware
    const { userId } = req.user;

    // Get data from client
    const taskData = await createTask.validateAsync(req.body);

    // check if same title, description and status exists, if exists then throw error
    const task = await Task.findOne({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      user: userId,
    });

    if (task) {
      throw new Error('Task already exists');
    }

    // Create a new task
    const newTask = new Task({
      ...taskData,
      user: userId,
    });

    // Save task
    const createdTask = await newTask.save();

    // update user
    await User.findOneAndUpdate({ _id: userId }, { $push: { tasks: createdTask._id } });

    // Send response
    const payload = {
      message: 'Task created successfully',
      task: createdTask,
    };

    res.status(201).json(payload);
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Get all tasks
taskController.getAllTasks = async (req, res, next) => {
  try {
    // get user id from protect middleware
    const { userId } = req.user;

    // Get all tasks
    const tasks = await Task.find({ user: userId }).populate('comments');

    // filter todo, doing, in review, done tasks
    const toDoTasks = {
      type: 'To do',
      bgColor: "#000",
      tasks: tasks.filter((task) => task.status === 'To do')
    }
    const doingTasks = {
      type: 'Doing',
      bgColor: "#F79009",
      tasks: tasks.filter((task) => task.status === 'Doing')
    }
    const inReviewTasks = {
      type: 'In review',
      bgColor: "#2E90FA",
      tasks: tasks.filter((task) => task.status === 'In Review')
    }
    const doneTasks = {
      type: 'Done',
      bgColor: "#11B769",
      tasks: tasks.filter((task) => task.status === 'Done')
    }


    // Send response
    const payload = {
      message: 'All tasks',
      data: [
        toDoTasks,
        doingTasks,
        inReviewTasks,
        doneTasks,
      ]
    };

    res.status(200).json(payload);
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Get a single task
taskController.getSingleTask = async (req, res, next) => {
  try {
    // get user id from protect middleware
    const { userId } = req.user;

    // Get task id from client
    const { id } = req.params;

    // Find task
    const task = await Task.findOne({ _id: id, user: userId });

    // Send response
    const payload = {
      message: 'Task',
      task,
    };

    res.status(200).json(payload);
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Update a task
taskController.updateTask = async (req, res, next) => {
  try {
    // get user id from protect middleware
    const { userId } = req.user;

    // Get task id from client
    const { id } = req.params;

    // Get data from client
    const taskData = await updateTask.validateAsync(req.body);

    // Find task and update
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      taskData,
      { new: true }
    );

    // Send response
    const payload = {
      message: 'Task updated successfully',
      task,
    };

    res.status(200).json(payload);
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Delete a task
taskController.deleteTask = async (req, res, next) => {
  try {
    // get user id from protect middleware
    const { userId } = req.user;

    // Get task id from client
    const { id } = req.params;

    // Find task and save it in deletedTasks array
    const task = await Task.findOne({ _id: id, user: userId });

    // Find user and update deletedTasks array
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { deletedTasks: task._id } }
    );

    // Find user and update tasks array
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { tasks: task._id } }
    );

    // Delete task
    await Task.findOneAndDelete({ _id: id, user: userId });

    // Send response
    const payload = {
      message: 'Task deleted successfully',
    };
    res.status(200).json(payload);
  } catch (error) {
    next(createError(400, error.message));
  }
};


// Export module
module.exports = taskController;

