/**
 * Vote Controller
 */

const voteService = require('../services/vote.service');
const { successResponse } = require('../utils/response');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   POST /api/players/:id/vote
 * @desc    Vote on player market value
 * @access  Private
 */
const voteOnMarketValue = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const vote = await voteService.voteOnMarketValue(
    req.params.id,
    req.user.userId,
    value
  );
  successResponse(res, 200, 'Vote recorded successfully', { vote });
});

/**
 * @route   GET /api/votes/my-votes
 * @desc    Get current user's votes
 * @access  Private
 */
const getMyVotes = asyncHandler(async (req, res) => {
  const { voteType } = req.query;
  const votes = await voteService.getUserVotes(req.user.userId, voteType);
  successResponse(res, 200, 'Votes retrieved successfully', { votes });
});

module.exports = {
  voteOnMarketValue,
  getMyVotes,
};

