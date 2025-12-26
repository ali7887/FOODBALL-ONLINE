/**
 * Transfer Service
 * Business logic for transfer operations
 */

const { Transfer, Player, Club } = require('../../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');

class TransferService {
  /**
   * Get all transfers with pagination
   */
  async getTransfers(queryParams) {
    const {
      page = 1,
      limit = 20,
      player,
      fromClub,
      toClub,
      season,
      sortBy = 'transferDate',
      sortOrder = 'desc',
    } = queryParams;

    const query = {};

    if (player) query.player = player;
    if (fromClub) query.fromClub = fromClub;
    if (toClub) query.toClub = toClub;
    if (season) query.season = season;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [transfers, total] = await Promise.all([
      Transfer.find(query)
        .populate('player', 'fullName position photo')
        .populate('fromClub', 'name logo')
        .populate('toClub', 'name logo')
        .populate('confirmedBy', 'username displayName')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Transfer.countDocuments(query),
    ]);

    return {
      transfers,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get transfer by ID
   */
  async getTransferById(transferId) {
    const transfer = await Transfer.findById(transferId)
      .populate('player', 'fullName position photo dateOfBirth nationality')
      .populate('fromClub', 'name logo league')
      .populate('toClub', 'name logo league')
      .populate('confirmedBy', 'username displayName')
      .lean();

    if (!transfer) {
      throw new NotFoundError('Transfer');
    }

    return transfer;
  }

  /**
   * Create new transfer
   */
  async createTransfer(transferData, userId) {
    const { player, toClub, transferDate } = transferData;

    if (!player || !toClub || !transferDate) {
      throw new ValidationError('Player, toClub, and transferDate are required');
    }

    // Verify player exists
    const playerExists = await Player.findById(player);
    if (!playerExists) {
      throw new NotFoundError('Player');
    }

    // Verify clubs exist
    if (transferData.fromClub) {
      const fromClubExists = await Club.findById(transferData.fromClub);
      if (!fromClubExists) {
        throw new NotFoundError('From Club');
      }
    }

    const toClubExists = await Club.findById(toClub);
    if (!toClubExists) {
      throw new NotFoundError('To Club');
    }

    const transfer = await Transfer.create({
      ...transferData,
      confirmedBy: userId,
      isOfficial: true,
    });

    // Update player's current club
    await Player.findByIdAndUpdate(player, {
      currentClub: toClub,
    });

    return transfer.populate([
      { path: 'player', select: 'fullName position photo' },
      { path: 'fromClub', select: 'name logo' },
      { path: 'toClub', select: 'name logo' },
    ]);
  }

  /**
   * Update transfer
   */
  async updateTransfer(transferId, updateData) {
    const transfer = await Transfer.findById(transferId);
    if (!transfer) {
      throw new NotFoundError('Transfer');
    }

    Object.assign(transfer, updateData);
    await transfer.save();

    return transfer.populate([
      { path: 'player', select: 'fullName position photo' },
      { path: 'fromClub', select: 'name logo' },
      { path: 'toClub', select: 'name logo' },
    ]);
  }

  /**
   * Delete transfer
   */
  async deleteTransfer(transferId) {
    const transfer = await Transfer.findByIdAndDelete(transferId);
    if (!transfer) {
      throw new NotFoundError('Transfer');
    }
    return transfer;
  }
}

module.exports = new TransferService();

