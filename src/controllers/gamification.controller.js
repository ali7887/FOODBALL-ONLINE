/**
 * Gamification Controller
 */

const gamificationService = require('../services/gamification.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   GET /api/gamification/leaderboard
 * @desc    Get points leaderboard
 * @access  Public
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const result = await gamificationService.getLeaderboard(req.query);
  successResponse(res, 200, 'Leaderboard retrieved successfully', result);
});

/**
 * @route   GET /api/gamification/activity-feed
 * @desc    Get current user's activity feed
 * @access  Private
 */
const getActivityFeed = asyncHandler(async (req, res) => {
  const result = await gamificationService.getUserActivityFeed(
    req.user.userId,
    req.query
  );
  successResponse(res, 200, 'Activity feed retrieved successfully', result);
});

/**
 * @route   GET /api/gamification/progress
 * @desc    Get current user's progress summary
 * @access  Private
 */
const getProgress = asyncHandler(async (req, res) => {
  const progress = await gamificationService.getUserProgress(req.user.userId);
  successResponse(res, 200, 'Progress retrieved successfully', progress);
});

/**
 * @route   POST /api/gamification/check-badges
 * @desc    Check and award badges for current user
 * @access  Private
 */
const checkBadges = asyncHandler(async (req, res) => {
  const awardedBadges = await gamificationService.checkAndAwardBadges(req.user.userId);
  successResponse(res, 200, 'Badge check completed', {
    awardedBadges,
    count: awardedBadges.length,
  });
});

/**
 * @route   GET /api/gamification/badges
 * @desc    Get all badges
 * @access  Public
 */
const getAllBadges = asyncHandler(async (req, res) => {
  const badges = await gamificationService.getAllBadges(req.query);
  successResponse(res, 200, 'Badges retrieved successfully', { badges });
});

/**
 * @route   GET /api/gamification/my-badges
 * @desc    Get current user's badges
 * @access  Private
 */
const getMyBadges = asyncHandler(async (req, res) => {
  const badges = await gamificationService.getUserBadges(req.user.userId);
  successResponse(res, 200, 'Badges retrieved successfully', { badges });
});

module.exports = {
  getLeaderboard,
  getActivityFeed,
  getProgress,
  checkBadges,
  getAllBadges,
  getMyBadges,
};

