/**
 * Authentication Controller
 */

const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');
const { ValidationError } = require('../utils/errors');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;

  // Validation
  if (!username || !email || !password) {
    throw new ValidationError('Username, email, and password are required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  const result = await authService.register({
    username,
    email,
    password,
    displayName,
  });

  successResponse(res, 201, 'User registered successfully', result);
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const result = await authService.login({ email, password });

  successResponse(res, 200, 'Login successful', result);
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  successResponse(res, 200, 'User retrieved successfully', { user });
});

module.exports = {
  register,
  login,
  getMe,
};

