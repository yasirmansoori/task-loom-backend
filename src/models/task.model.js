// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    enum: ['To do', 'Doing', 'In Review', 'Done'],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

// create model
const Task = mongoose.model('Task', taskSchema);

// export model
module.exports = Task;
