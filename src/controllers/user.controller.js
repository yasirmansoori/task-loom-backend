// Dependencies
const bcrypt = require('bcrypt');
const { authSchemaRegister, authSchemaLogin } = require('../validations/user.validation');
const { signAccessToken } = require('../config/tokenGenerator')
const createError = require('http-errors');
const User = require('../models/user.model')
require('dotenv').config('../../.env');

// Module scaffolding
const userController = {};

// Register user 
userController.register = async (req, res, next) => {
  try {
    // Check if email already exists
    const result = await authSchemaRegister.validateAsync(req.body)
    await User.findOne({ email: result.email }).then((user) => {
      if (user) throw createError.Conflict("This email has already an account. Please login")
    })

    // Hash password 
    result.password = await hashPassword(result.password);

    // Create new user
    const user = new User({
      name: result.name,
      email: result.email,
      password: result.password,
      tasks: []
    });

    const savedUser = await user.save()

    // Generate tokens
    const accessToken = await signAccessToken(savedUser.id)

    // Send response
    const payload = {
      message: "User registered successfully",
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        tasks: savedUser.tasks,
        joined: savedUser.createdAt,
      },
      token: accessToken,
    };
    res.status(201).json(payload)
  } catch (error) {
    // Unprocessable Entity, means the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
    if (error.isJoi === true) error.status = 422
    next(error);
  }
};

// Login user controller
userController.login = async (req, res, next) => {
  try {
    const result = await authSchemaLogin.validateAsync(req.body)
    // Check if email exists
    const user = await User.findOne({ email: result.email })
    // If email not found
    if (!user) throw createError.NotFound("User not registered")

    // Check if password is valid
    const isMatch = await user.isValidPassword(result.password)
    if (!isMatch) throw createError.Unauthorized("Email/Password not valid")

    // Generate tokens
    const accessToken = await signAccessToken(user.id)

    // Send response
    const userDetails = {
      message: "User logged in successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        tasks: user.tasks,
        joined: user.createdAt,
      },
      token: accessToken,
    };
    res.send(userDetails)
  } catch (error) {
    if (error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"))
    next(error)
  }
};

// Get user deleted tasks
userController.getDeletedTasks = async (req, res, next) => {
  try {
    // get userId from req.user
    const { userId } = req.user

    // find user by userId
    const user = await User.findById(userId)

    // check if user exists
    if (!user) throw createError.NotFound("User not found")

    // send response

    const payload = {
      message: "User deleted tasks",
      data: user.deletedTasks,
    };

    res.status(200).json(payload)
  } catch (error) {
    next(error)
  }
}

// Helper Function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Export module
module.exports = userController;

