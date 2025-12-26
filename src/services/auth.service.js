/**
 * Authentication Service
 * Handles user registration, login, and JWT token generation
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');
const { ValidationError, UnauthorizedError } = require('../utils/errors');
const config = require('../config');

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { username, email, password, displayName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ValidationError('Email already registered');
      }
      if (existingUser.username === username) {
        throw new ValidationError('Username already taken');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      displayName: displayName || username,
    });

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * Login user
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last active
    user.lastActiveAt = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return {
      user: userResponse,
      token,
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { userId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('favoriteClub', 'name logo');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }
}

module.exports = new AuthService();

