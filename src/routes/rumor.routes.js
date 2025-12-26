/**
 * Transfer Rumor Routes
 */

const express = require('express');
const router = express.Router();
const rumorController = require('../controllers/rumor.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', rumorController.getRumors);
router.get('/:id', rumorController.getRumorById);

// Protected routes
router.post('/', protect, rumorController.createRumor);
router.post('/:id/vote', protect, rumorController.voteOnRumor);

// Admin routes
router.put('/:id/status', protect, restrictTo('admin'), rumorController.updateRumorStatus);
router.delete('/:id', protect, restrictTo('admin'), rumorController.deleteRumor);

module.exports = router;

