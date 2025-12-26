/**
 * Player Service
 * Business logic for player operations
 */

const { Player } = require('../../database/models');
const { NotFoundError, ValidationError } = require('../utils/errors');

class PlayerService {
  /**
   * Get all players with pagination and filters
   */
  async getPlayers(queryParams) {
    const {
      page = 1,
      limit = 20,
      club,
      position,
      search,
      sortBy = 'marketValue',
      sortOrder = 'desc',
    } = queryParams;

    // Build query
    const query = {};

    if (club) {
      query.currentClub = club;
    }

    if (position) {
      query.position = position;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [players, total] = await Promise.all([
      Player.find(query)
        .populate('currentClub', 'name logo league')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Player.countDocuments(query),
    ]);

    return {
      players,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get player by ID
   */
  async getPlayerById(playerId) {
    const player = await Player.findById(playerId)
      .populate('currentClub', 'name logo league city stadium')
      .lean();

    if (!player) {
      throw new NotFoundError('Player');
    }

    return player;
  }

  /**
   * Create new player (admin only)
   */
  async createPlayer(playerData) {
    // Validate required fields
    if (!playerData.firstName || !playerData.lastName || !playerData.position) {
      throw new ValidationError('FirstName, lastName, and position are required');
    }

    // Auto-generate fullName
    const fullName = `${playerData.firstName} ${playerData.lastName}`.trim();

    const player = await Player.create({
      ...playerData,
      fullName,
    });

    return player.populate('currentClub', 'name logo');
  }

  /**
   * Update player
   */
  async updatePlayer(playerId, updateData) {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new NotFoundError('Player');
    }

    // Update fullName if name changed
    if (updateData.firstName || updateData.lastName) {
      const firstName = updateData.firstName || player.firstName;
      const lastName = updateData.lastName || player.lastName;
      updateData.fullName = `${firstName} ${lastName}`.trim();
    }

    Object.assign(player, updateData);
    await player.save();

    return player.populate('currentClub', 'name logo');
  }

  /**
   * Delete player
   */
  async deletePlayer(playerId) {
    const player = await Player.findByIdAndDelete(playerId);
    if (!player) {
      throw new NotFoundError('Player');
    }
    return player;
  }
}

module.exports = new PlayerService();

