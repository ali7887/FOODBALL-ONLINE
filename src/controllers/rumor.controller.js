/**
 * Transfer Rumor Controller
 */

const rumorService = require('../services/rumor.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   GET /api/rumors
 * @desc    Get all rumors
 * @access  Public
 */
const getRumors = asyncHandler(async (req, res) => {
  const result = await rumorService.getRumors(req.query);
  successResponse(res, 200, 'Rumors retrieved successfully', result);
});

/**
 * @route   GET /api/rumors/:id
 * @desc    Get rumor by ID
 * @access  Public
 */
const getRumorById = asyncHandler(async (req, res) => {
  const rumor = await rumorService.getRumorById(req.params.id);
  successResponse(res, 200, 'Rumor retrieved successfully', { rumor });
});

/**
 * @route   POST /api/rumors
 * @desc    Create new rumor
 * @access  Private
 */
const createRumor = asyncHandler(async (req, res) => {
  const rumor = await rumorService.createRumor(req.body, req.user.userId);
  successResponse(res, 201, 'Rumor created successfully', { rumor });
});

/**
 * @route   POST /api/rumors/:id/vote
 * @desc    Vote on rumor probability
 * @access  Private
 */
const voteOnRumor = asyncHandler(async (req, res) => {
  const { probability } = req.body;
  const vote = await rumorService.voteOnRumor(req.params.id, req.user.userId, probability);
  successResponse(res, 200, 'Vote recorded successfully', { vote });
});

/**
 * @route   PUT /api/rumors/:id/status
 * @desc    Update rumor status (admin only)
 * @access  Private/Admin
 */
const updateRumorStatus = asyncHandler(async (req, res) => {
  const { status, confirmedTransferId } = req.body;
  const rumor = await rumorService.updateRumorStatus(req.params.id, status, confirmedTransferId);
  successResponse(res, 200, 'Rumor status updated successfully', { rumor });
});

/**
 * @route   DELETE /api/rumors/:id
 * @desc    Delete rumor
 * @access  Private/Admin
 */
const deleteRumor = asyncHandler(async (req, res) => {
  await rumorService.deleteRumor(req.params.id);
  successResponse(res, 200, 'Rumor deleted successfully');
});

module.exports = {
  getRumors,
  getRumorById,
  createRumor,
  voteOnRumor,
  updateRumorStatus,
  deleteRumor,
};

