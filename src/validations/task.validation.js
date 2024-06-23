const Joi = require('joi');

const createTask = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': `Title cannot be empty`,
    'any.required': `Title is a required`
  }),
  description: Joi.string().required().messages({
    'string.empty': `Description cannot be empty`,
    'any.required': `Description is a required`
  }),
  status: Joi.string().valid('To do', 'Doing', 'In Review', 'Done').required().messages({
    'string.empty': `Status cannot be empty`,
    'any.required': `Status is a required`
  }),
})

const updateTask = Joi.object({
  title: Joi.string().messages({
    'string.empty': `Title cannot be empty`,
  }),
  description: Joi.string().messages({
    'string.empty': `Description cannot be empty`,
  }),
  status: Joi.string().valid('To do', 'Doing', 'In Review', 'Done').messages({
    'string.empty': `Status cannot be empty`,
  }),
})

module.exports = { createTask, updateTask }