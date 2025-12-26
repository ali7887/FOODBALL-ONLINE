/**
 * Middleware for handling vote-related calculations
 * 
 * This middleware automatically updates:
 * - Player.marketValue when marketValue votes are added/updated
 * - TransferRumor.probability when rumorProbability votes are added/updated
 */

const { Player, TransferRumor, Vote, ActivityLog } = require('../models');

/**
 * Calculate and update player market value based on all votes
 */
async function updatePlayerMarketValue(playerId) {
  try {
    const votes = await Vote.find({
      voteType: 'marketValue',
      player: playerId
    });

    if (votes.length === 0) {
      await Player.findByIdAndUpdate(playerId, {
        marketValue: 0,
        marketValueVoteCount: 0
      });
      return;
    }

    const totalValue = votes.reduce((sum, vote) => sum + vote.value, 0);
    const averageValue = totalValue / votes.length;

    await Player.findByIdAndUpdate(playerId, {
      marketValue: Math.round(averageValue),
      marketValueVoteCount: votes.length
    });
  } catch (error) {
    console.error('Error updating player market value:', error);
    throw error;
  }
}

/**
 * Calculate and update transfer rumor probability based on all votes
 */
async function updateRumorProbability(rumorId) {
  try {
    const votes = await Vote.find({
      voteType: 'rumorProbability',
      rumor: rumorId
    });

    if (votes.length === 0) {
      await TransferRumor.findByIdAndUpdate(rumorId, {
        probability: 0,
        voteCount: 0,
        upvotes: 0,
        downvotes: 0
      });
      return;
    }

    const totalProbability = votes.reduce((sum, vote) => sum + vote.value, 0);
    const averageProbability = totalProbability / votes.length;

    // Count upvotes (>= 50) and downvotes (< 50)
    const upvotes = votes.filter(v => v.value >= 50).length;
    const downvotes = votes.filter(v => v.value < 50).length;

    await TransferRumor.findByIdAndUpdate(rumorId, {
      probability: Math.round(averageProbability),
      voteCount: votes.length,
      upvotes,
      downvotes
    });
  } catch (error) {
    console.error('Error updating rumor probability:', error);
    throw error;
  }
}

/**
 * Log vote activity
 */
async function logVoteActivity(vote, isNew = true) {
  try {
    const activityType = vote.voteType === 'marketValue' 
      ? 'vote_market_value' 
      : 'vote_rumor_probability';

    const metadata = vote.voteType === 'marketValue'
      ? { voteType: 'marketValue', value: vote.value, playerId: vote.player }
      : { voteType: 'rumorProbability', value: vote.value, rumorId: vote.rumor };

    await ActivityLog.create({
      user: vote.user,
      activityType,
      action: isNew ? 'Voted on market value' : 'Updated market value vote',
      targetType: vote.voteType === 'marketValue' ? 'player' : 'rumor',
      targetId: vote.voteType === 'marketValue' ? vote.player : vote.rumor,
      metadata,
      pointsEarned: 5 // Award 5 points per vote
    });
  } catch (error) {
    console.error('Error logging vote activity:', error);
    // Don't throw - activity logging shouldn't break vote creation
  }
}

/**
 * Hook to run after vote is saved
 */
async function handleVoteSaved(vote) {
  try {
    // Update relevant entity
    if (vote.voteType === 'marketValue' && vote.player) {
      await updatePlayerMarketValue(vote.player);
    } else if (vote.voteType === 'rumorProbability' && vote.rumor) {
      await updateRumorProbability(vote.rumor);
    }

    // Log activity
    await logVoteActivity(vote, true);
  } catch (error) {
    console.error('Error in vote save hook:', error);
  }
}

/**
 * Hook to run after vote is updated
 */
async function handleVoteUpdated(vote) {
  try {
    // Update relevant entity
    if (vote.voteType === 'marketValue' && vote.player) {
      await updatePlayerMarketValue(vote.player);
    } else if (vote.voteType === 'rumorProbability' && vote.rumor) {
      await updateRumorProbability(vote.rumor);
    }

    // Log activity
    await logVoteActivity(vote, false);
  } catch (error) {
    console.error('Error in vote update hook:', error);
  }
}

module.exports = {
  updatePlayerMarketValue,
  updateRumorProbability,
  logVoteActivity,
  handleVoteSaved,
  handleVoteUpdated
};

