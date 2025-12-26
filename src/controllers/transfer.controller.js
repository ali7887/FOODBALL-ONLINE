/**
 * Transfer Controller
 */

const transferService = require('../services/transfer.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   GET /api/transfers
 * @desc    Get all transfers
 * @access  Public
 */
const getTransfers = asyncHandler(async (req, res) => {
  const result = await transferService.getTransfers(req.query);
  successResponse(res, 200, 'Transfers retrieved successfully', result);
});

/**
 * @route   GET /api/transfers/:id
 * @desc    Get transfer by ID
 * @access  Public
 */
const getTransferById = asyncHandler(async (req, res) => {
  const transfer = await transferService.getTransferById(req.params.id);
  successResponse(res, 200, 'Transfer retrieved successfully', { transfer });
});

/**
 * @route   POST /api/transfers
 * @desc    Create new transfer
 * @access  Private/Admin
 */
const createTransfer = asyncHandler(async (req, res) => {
  const transfer = await transferService.createTransfer(req.body, req.user.userId);
  successResponse(res, 201, 'Transfer created successfully', { transfer });
});

/**
 * @route   PUT /api/transfers/:id
 * @desc    Update transfer
 * @access  Private/Admin
 */
const updateTransfer = asyncHandler(async (req, res) => {
  const transfer = await transferService.updateTransfer(req.params.id, req.body);
  successResponse(res, 200, 'Transfer updated successfully', { transfer });
});

/**
 * @route   DELETE /api/transfers/:id
 * @desc    Delete transfer
 * @access  Private/Admin
 */
const deleteTransfer = asyncHandler(async (req, res) => {
  await transferService.deleteTransfer(req.params.id);
  successResponse(res, 200, 'Transfer deleted successfully');
});

module.exports = {
  getTransfers,
  getTransferById,
  createTransfer,
  updateTransfer,
  deleteTransfer,
};

