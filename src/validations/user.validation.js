const Joi = require('joi');

// Register validation schema
const authSchemaRegister = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': `Name cannot be empty`,
    'any.required': `Name is a required`
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': `Email must be a valid email`,
    'string.empty': `Email cannot be empty`,
    'any.required': `Email is a required`
  }),
  password: Joi.string().min(2).required().messages({
    'string.min': `Password must be at least 2 characters`,
    'string.empty': `Password cannot be empty`,
    'any.required': `Password is a required`
  }),
})

// Login validation schema
const authSchemaLogin = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required()
})

module.exports = { authSchemaRegister, authSchemaLogin }