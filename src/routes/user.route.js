// Dependencies
const express = require('express');
const protect = require('../middlewares/protect');
// Controller
const userController = require("../controllers/user.controller");

// Module scaffolding
const userRouter = express.Router();

// register user
userRouter.post("/register", userController.register);
// login user
userRouter.post("/login", userController.login);
// get user deleted tasks
userRouter.get("/deleted-tasks", protect, userController.getDeletedTasks);

// Export module
module.exports = userRouter;
