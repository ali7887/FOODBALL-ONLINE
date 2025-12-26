/**
 * Gamification Routes
 */

const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/badges', gamificationController.getAllBadges);

// Protected routes
router.get('/activity-feed', protect, gamificationController.getActivityFeed);
router.get('/progress', protect, gamificationController.getProgress);
router.post('/check-badges', protect, gamificationController.checkBadges);
router.get('/my-badges', protect, gamificationController.getMyBadges);

module.exports = router;

