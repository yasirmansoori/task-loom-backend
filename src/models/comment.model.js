// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Comment schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

// create model
const Comment = mongoose.model('Comment', commentSchema);

// export model
module.exports = Comment;
