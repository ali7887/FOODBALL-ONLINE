/**
 * Player Routes
 */

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const voteController = require('../controllers/vote.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayerById);

// Voting route
router.post('/:id/vote', protect, voteController.voteOnMarketValue);

// Protected routes (Admin only)
router.post('/', protect, restrictTo('admin'), playerController.createPlayer);
router.put('/:id', protect, restrictTo('admin'), playerController.updatePlayer);
router.delete('/:id', protect, restrictTo('admin'), playerController.deletePlayer);

module.exports = router;

