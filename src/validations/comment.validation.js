const Joi = require('joi');

const createComment = Joi.object({
  text: Joi.string().required().messages({
    'string.empty': `Comment cannot be empty`,
    'any.required': `Comment is a required`
  }),
  taskId: Joi.string().required().messages({
    'string.empty': `Task cannot be empty`,
    'any.required': `Task is a required`
  }),
})

module.exports = { createComment }