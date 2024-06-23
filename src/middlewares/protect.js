// Dependencies
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// Module scaffolding
const protect = async (req, res, next) => {
  // Get token from Bearer token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  // Check token is valid 
  if (!token) {
    return next(createError.Unauthorized('You are not authenticated'));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      userId: decoded.aud,
      token: token,
    };
    next();
  } catch (error) {
    return next(createError.Unauthorized('You are not authenticated'));
  }
};

// Export module
module.exports = protect;