// Dependencies
const createError = require('http-errors');
const Comment = require('../models/comment.model');
require('dotenv').config('../../.env');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const { createComment } = require('../validations/comment.validation');

// Module scaffolding
const commentController = {};

// Create a new comment
commentController.createComment = async (req, res, next) => {
  try {
    // get userId from req.user
    const { userId } = req.user;

    // validate data
    const commentData = await createComment.validateAsync(req.body);
    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // check if task exists
    const task = await Task.findById(commentData.taskId);

    if (!task) {
      return next(createError(404, 'Task not found'));
    }

    // check if comment already exists
    const commentExists = await Comment.findOne({ text: commentData.text, user: userId, task: commentData.taskId });

    if (commentExists) {
      return next(createError(400, 'Comment already exists'));
    }

    // create new comment
    const comment = new Comment({
      text: commentData.text,
      user: userId,
      task: commentData.taskId,
    });

    // save comment
    await comment.save();

    // update task
    await Task.findByIdAndUpdate(commentData.taskId, { $push: { comments: comment._id } });

    // send response
    res.status(201).json({
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

// Delete a comment
commentController.deleteComment = async (req, res, next) => {
  try {
    // get userId from req.user
    const { userId } = req.user;

    // get comment id from req.body
    const { id } = req.params;

    // check if comment exists
    const comment = await Comment.findById(id);

    if (!comment) {
      return next(createError(404, 'Comment not found'));
    }

    // delete comment
    await Comment.findByIdAndDelete(id);

    // update task
    await Task.findByIdAndUpdate(comment.task, { $pull: { comments: id } });

    // send response
    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}


// Export module
module.exports = commentController;

