/**
 * Transfer Routes
 */

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', transferController.getTransfers);
router.get('/:id', transferController.getTransferById);

// Protected routes (Admin only)
router.post('/', protect, restrictTo('admin'), transferController.createTransfer);
router.put('/:id', protect, restrictTo('admin'), transferController.updateTransfer);
router.delete('/:id', protect, restrictTo('admin'), transferController.deleteTransfer);

module.exports = router;

