/**
 * Gamification Service
 * Handles leaderboards, activity feeds, badges, and user progress
 */

const { User, ActivityLog, Badge, UserBadge } = require('../../database/models');
const { NotFoundError } = require('../utils/errors');
const { logBadgeEarned } = require('../../database/middleware/activityLogger');

class GamificationService {
  /**
   * Get points leaderboard
   */
  async getLeaderboard(queryParams) {
    const {
      page = 1,
      limit = 50,
      sortBy = 'points',
      sortOrder = 'desc',
    } = queryParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find({})
        .select('username displayName avatar points level favoriteClub')
        .populate('favoriteClub', 'name logo')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments({}),
    ]);

    // Add rank
    const usersWithRank = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
    }));

    return {
      leaderboard: usersWithRank,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get user activity feed
   */
  async getUserActivityFeed(userId, queryParams) {
    const {
      page = 1,
      limit = 20,
      activityType,
    } = queryParams;

    const query = { user: userId };
    if (activityType) {
      query.activityType = activityType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    return {
      activities,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get user progress summary
   */
  async getUserProgress(userId) {
    const user = await User.findById(userId)
      .select('username displayName avatar points level favoriteClub')
      .populate('favoriteClub', 'name logo')
      .lean();

    if (!user) {
      throw new NotFoundError('User');
    }

    // Get user badges
    const userBadges = await UserBadge.find({ user: userId })
      .populate('badge', 'name icon category rarity')
      .sort({ earnedAt: -1 })
      .lean();

    // Get activity statistics
    const activityStats = await ActivityLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          totalPoints: { $sum: '$pointsEarned' },
        },
      },
    ]);

    // Get total activities count
    const totalActivities = await ActivityLog.countDocuments({ user: userId });

    // Calculate level (simple: every 100 points = 1 level)
    const calculatedLevel = Math.floor(user.points / 100) + 1;
    const pointsToNextLevel = 100 - (user.points % 100);

    return {
      user,
      badges: userBadges.map(ub => ub.badge),
      badgeCount: userBadges.length,
      activityStats: activityStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalPoints: stat.totalPoints,
        };
        return acc;
      }, {}),
      totalActivities,
      level: {
        current: user.level,
        calculated: calculatedLevel,
        points: user.points,
        pointsToNextLevel,
      },
    };
  }

  /**
   * Check and award badges based on user activity
   */
  async checkAndAwardBadges(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Get all active badges with requirements
    const badges = await Badge.find({
      isActive: true,
      'requirements.type': { $exists: true },
    });

    const awardedBadges = [];

    for (const badge of badges) {
      // Check if user already has this badge
      const existingBadge = await UserBadge.findOne({
        user: userId,
        badge: badge._id,
      });

      if (existingBadge) {
        continue; // User already has this badge
      }

      let shouldAward = false;

      switch (badge.requirements.type) {
        case 'votes':
          const voteCount = await ActivityLog.countDocuments({
            user: userId,
            activityType: { $in: ['vote_market_value', 'vote_rumor_probability'] },
          });
          shouldAward = voteCount >= badge.requirements.threshold;
          break;

        case 'quizzes':
          const quizCount = await ActivityLog.countDocuments({
            user: userId,
            activityType: 'quiz_completed',
          });
          shouldAward = quizCount >= badge.requirements.threshold;
          break;

        case 'rituals':
          const ritualCount = await ActivityLog.countDocuments({
            user: userId,
            activityType: 'ritual_created',
          });
          shouldAward = ritualCount >= badge.requirements.threshold;
          break;

        case 'points':
          shouldAward = user.points >= badge.requirements.threshold;
          break;

        case 'streak':
          // Simple streak: check last 7 days of activity
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const recentActivities = await ActivityLog.countDocuments({
            user: userId,
            timestamp: { $gte: sevenDaysAgo },
          });
          shouldAward = recentActivities >= badge.requirements.threshold;
          break;

        default:
          // Custom badges require manual awarding
          break;
      }

      if (shouldAward) {
        // Award badge
        await UserBadge.create({
          user: userId,
          badge: badge._id,
          earnedAt: new Date(),
        });

        // Update badge total earned count
        await Badge.findByIdAndUpdate(badge._id, {
          $inc: { totalEarned: 1 },
        });

        // Log activity
        await logBadgeEarned(
          userId,
          badge._id,
          badge.name,
          badge.rarity
        );

        awardedBadges.push(badge);
      }
    }

    return awardedBadges;
  }

  /**
   * Get all badges
   */
  async getAllBadges(queryParams) {
    const {
      category,
      rarity,
      isActive = true,
    } = queryParams;

    const query = {};
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;
    if (isActive !== undefined) query.isActive = isActive;

    const badges = await Badge.find(query)
      .sort({ rarity: 1, totalEarned: -1 })
      .lean();

    return badges;
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId) {
    const userBadges = await UserBadge.find({ user: userId })
      .populate('badge')
      .sort({ earnedAt: -1 })
      .lean();

    return userBadges.map(ub => ({
      ...ub.badge,
      earnedAt: ub.earnedAt,
      progress: ub.progress,
    }));
  }
}

module.exports = new GamificationService();

