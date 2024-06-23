// Dependencies
const express = require('express');
const protect = require('../middlewares/protect');

// Controller
const commentController = require("../controllers/comment.controller");

// Module scaffolding
const commentRouter = express.Router();

// Create a new comment
commentRouter.post("/create", protect, commentController.createComment);
// delete a comment
commentRouter.delete("/delete/:id", protect, commentController.deleteComment);


// Export module
module.exports = commentRouter;
