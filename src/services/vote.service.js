/**
 * Vote Service
 * Handles voting on player market values
 */

const { Vote, Player } = require('../../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');

class VoteService {
  /**
   * Vote on player market value
   */
  async voteOnMarketValue(playerId, userId, value) {
    if (value <= 0) {
      throw new ValidationError('Market value must be greater than 0');
    }

    const player = await Player.findById(playerId);
    if (!player) {
      throw new NotFoundError('Player');
    }

    // Check if user already voted
    let vote = await Vote.findOne({
      user: userId,
      voteType: 'marketValue',
      player: playerId,
    });

    if (vote) {
      // Update existing vote
      vote.value = value;
      await vote.save();
    } else {
      // Create new vote
      vote = await Vote.create({
        user: userId,
        voteType: 'marketValue',
        player: playerId,
        value: value,
      });
    }

    // The voteMiddleware will automatically update player market value
    // via the post-save hook in Vote model

    return vote;
  }

  /**
   * Get user's votes
   */
  async getUserVotes(userId, voteType = null) {
    const query = { user: userId };
    if (voteType) {
      query.voteType = voteType;
    }

    const votes = await Vote.find(query)
      .populate('player', 'fullName position photo')
      .populate('rumor', 'player toClub')
      .sort({ createdAt: -1 })
      .lean();

    return votes;
  }
}

module.exports = new VoteService();

