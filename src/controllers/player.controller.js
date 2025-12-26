/**
 * Player Controller
 */

const playerService = require('../services/player.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   GET /api/players
 * @desc    Get all players with pagination
 * @access  Public
 */
const getPlayers = asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers(req.query);
  successResponse(res, 200, 'Players retrieved successfully', result);
});

/**
 * @route   GET /api/players/:id
 * @desc    Get player by ID
 * @access  Public
 */
const getPlayerById = asyncHandler(async (req, res) => {
  const player = await playerService.getPlayerById(req.params.id);
  successResponse(res, 200, 'Player retrieved successfully', { player });
});

/**
 * @route   POST /api/players
 * @desc    Create new player
 * @access  Private/Admin
 */
const createPlayer = asyncHandler(async (req, res) => {
  const player = await playerService.createPlayer(req.body);
  successResponse(res, 201, 'Player created successfully', { player });
});

/**
 * @route   PUT /api/players/:id
 * @desc    Update player
 * @access  Private/Admin
 */
const updatePlayer = asyncHandler(async (req, res) => {
  const player = await playerService.updatePlayer(req.params.id, req.body);
  successResponse(res, 200, 'Player updated successfully', { player });
});

/**
 * @route   DELETE /api/players/:id
 * @desc    Delete player
 * @access  Private/Admin
 */
const deletePlayer = asyncHandler(async (req, res) => {
  await playerService.deletePlayer(req.params.id);
  successResponse(res, 200, 'Player deleted successfully');
});

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};

