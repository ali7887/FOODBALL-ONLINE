/**
 * Vote Routes
 */

const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protected routes
router.post('/players/:id/vote', protect, voteController.voteOnMarketValue);
router.get('/my-votes', protect, voteController.getMyVotes);

module.exports = router;

