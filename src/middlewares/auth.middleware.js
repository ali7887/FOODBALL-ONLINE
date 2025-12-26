/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

const authService = require('../services/auth.service');
const { User } = require('../../database/models');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Not authorized, no token provided');
    }

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      userId: user._id.toString(),
      user,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict to specific roles
 */
const restrictTo = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authorized'));
    }

    const user = await User.findById(req.user.userId);
    if (!roles.includes(user.role)) {
      return next(new UnauthorizedError('You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};

