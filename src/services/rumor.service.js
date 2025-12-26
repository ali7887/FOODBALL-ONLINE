/**
 * Transfer Rumor Service
 * Business logic for transfer rumor operations
 */

const { TransferRumor, Player, Club, Vote } = require('../../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { logTransferReported } = require('../../database/middleware/activityLogger');

class RumorService {
  /**
   * Get all rumors with pagination
   */
  async getRumors(queryParams) {
    const {
      page = 1,
      limit = 20,
      player,
      toClub,
      status = 'active',
      minProbability,
      sortBy = 'probability',
      sortOrder = 'desc',
    } = queryParams;

    const query = {};

    if (player) query.player = player;
    if (toClub) query.toClub = toClub;
    if (status) query.status = status;
    if (minProbability) {
      query.probability = { $gte: parseInt(minProbability) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [rumors, total] = await Promise.all([
      TransferRumor.find(query)
        .populate('player', 'fullName position photo currentClub')
        .populate('fromClub', 'name logo')
        .populate('toClub', 'name logo')
        .populate('reportedBy', 'username displayName')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      TransferRumor.countDocuments(query),
    ]);

    return {
      rumors,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get rumor by ID
   */
  async getRumorById(rumorId) {
    const rumor = await TransferRumor.findById(rumorId)
      .populate('player', 'fullName position photo currentClub')
      .populate('fromClub', 'name logo league')
      .populate('toClub', 'name logo league')
      .populate('reportedBy', 'username displayName avatar')
      .populate('confirmedTransfer')
      .lean();

    if (!rumor) {
      throw new NotFoundError('Transfer Rumor');
    }

    return rumor;
  }

  /**
   * Create new rumor
   */
  async createRumor(rumorData, userId) {
    const { player, toClub } = rumorData;

    if (!player || !toClub) {
      throw new ValidationError('Player and toClub are required');
    }

    // Verify player exists
    const playerExists = await Player.findById(player);
    if (!playerExists) {
      throw new NotFoundError('Player');
    }

    // Verify club exists
    const toClubExists = await Club.findById(toClub);
    if (!toClubExists) {
      throw new NotFoundError('To Club');
    }

    if (rumorData.fromClub) {
      const fromClubExists = await Club.findById(rumorData.fromClub);
      if (!fromClubExists) {
        throw new NotFoundError('From Club');
      }
    }

    const rumor = await TransferRumor.create({
      ...rumorData,
      reportedBy: userId,
      status: 'active',
    });

    // Log activity
    await logTransferReported(userId, rumor._id, player, toClub);

    return rumor.populate([
      { path: 'player', select: 'fullName position photo' },
      { path: 'fromClub', select: 'name logo' },
      { path: 'toClub', select: 'name logo' },
      { path: 'reportedBy', select: 'username displayName' },
    ]);
  }

  /**
   * Vote on rumor probability
   */
  async voteOnRumor(rumorId, userId, probability) {
    if (probability < 0 || probability > 100) {
      throw new ValidationError('Probability must be between 0 and 100');
    }

    const rumor = await TransferRumor.findById(rumorId);
    if (!rumor) {
      throw new NotFoundError('Transfer Rumor');
    }

    if (rumor.status !== 'active') {
      throw new ValidationError('Cannot vote on inactive rumor');
    }

    // Check if user already voted
    let vote = await Vote.findOne({
      user: userId,
      voteType: 'rumorProbability',
      rumor: rumorId,
    });

    if (vote) {
      // Update existing vote
      vote.value = probability;
      await vote.save();
    } else {
      // Create new vote
      vote = await Vote.create({
        user: userId,
        voteType: 'rumorProbability',
        rumor: rumorId,
        value: probability,
      });
    }

    // The voteMiddleware will automatically update rumor probability
    // via the post-save hook in Vote model

    return vote;
  }

  /**
   * Update rumor status
   */
  async updateRumorStatus(rumorId, status, confirmedTransferId = null) {
    const rumor = await TransferRumor.findById(rumorId);
    if (!rumor) {
      throw new NotFoundError('Transfer Rumor');
    }

    rumor.status = status;
    if (confirmedTransferId) {
      rumor.confirmedTransfer = confirmedTransferId;
    }

    await rumor.save();

    return rumor.populate([
      { path: 'player', select: 'fullName position photo' },
      { path: 'toClub', select: 'name logo' },
      { path: 'confirmedTransfer' },
    ]);
  }

  /**
   * Delete rumor
   */
  async deleteRumor(rumorId) {
    const rumor = await TransferRumor.findByIdAndDelete(rumorId);
    if (!rumor) {
      throw new NotFoundError('Transfer Rumor');
    }
    return rumor;
  }
}

module.exports = new RumorService();

