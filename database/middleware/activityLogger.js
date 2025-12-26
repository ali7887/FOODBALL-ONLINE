/**
 * Activity Logger Middleware
 * 
 * Centralized logging for all user activities
 * This ensures every meaningful action is tracked
 */

const { ActivityLog, User } = require('../models');

/**
 * Log a user activity
 * 
 * @param {Object} params
 * @param {ObjectId} params.userId - User who performed the action
 * @param {String} params.activityType - Type of activity (from enum)
 * @param {String} params.action - Human-readable action description
 * @param {String} params.targetType - Type of target entity
 * @param {ObjectId} params.targetId - ID of target entity
 * @param {Object} params.metadata - Additional activity-specific data
 * @param {Number} params.pointsEarned - Points awarded for this activity
 */
async function logActivity({
  userId,
  activityType,
  action,
  targetType = null,
  targetId = null,
  metadata = {},
  pointsEarned = 0
}) {
  try {
    const activity = await ActivityLog.create({
      user: userId,
      activityType,
      action,
      targetType,
      targetId,
      metadata,
      pointsEarned,
      timestamp: new Date()
    });

    // Update user points if points were earned
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { points: pointsEarned },
        lastActiveAt: new Date()
      });
    } else {
      // Still update lastActiveAt
      await User.findByIdAndUpdate(userId, {
        lastActiveAt: new Date()
      });
    }

    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging shouldn't break main operations
    return null;
  }
}

/**
 * Helper functions for common activities
 */

async function logQuizAttempt(userId, quizId, score, correctAnswers, totalQuestions) {
  return logActivity({
    userId,
    activityType: 'quiz_attempt',
    action: 'Attempted quiz',
    targetType: 'quiz',
    targetId: quizId,
    metadata: { score, correctAnswers, totalQuestions },
    pointsEarned: 0 // Points awarded on completion
  });
}

async function logQuizCompleted(userId, quizId, score, correctAnswers, totalQuestions) {
  const pointsEarned = Math.round((correctAnswers / totalQuestions) * 20); // Up to 20 points
  
  return logActivity({
    userId,
    activityType: 'quiz_completed',
    action: 'Completed quiz',
    targetType: 'quiz',
    targetId: quizId,
    metadata: { score, correctAnswers, totalQuestions },
    pointsEarned
  });
}

async function logRitualCreated(userId, ritualId, matchId) {
  return logActivity({
    userId,
    activityType: 'ritual_created',
    action: 'Created pre-match ritual',
    targetType: 'ritual',
    targetId: ritualId,
    metadata: { matchId },
    pointsEarned: 10
  });
}

async function logRitualLiked(userId, ritualId) {
  return logActivity({
    userId,
    activityType: 'ritual_liked',
    action: 'Liked a ritual',
    targetType: 'ritual',
    targetId: ritualId,
    metadata: {},
    pointsEarned: 1
  });
}

async function logBadgeEarned(userId, badgeId, badgeName, rarity) {
  const pointsByRarity = {
    common: 10,
    rare: 25,
    epic: 50,
    legendary: 100
  };

  return logActivity({
    userId,
    activityType: 'badge_earned',
    action: `Earned badge: ${badgeName}`,
    targetType: 'badge',
    targetId: badgeId,
    metadata: { badgeName, rarity },
    pointsEarned: pointsByRarity[rarity] || 10
  });
}

async function logTransferReported(userId, rumorId, playerId, toClubId) {
  return logActivity({
    userId,
    activityType: 'transfer_reported',
    action: 'Reported transfer rumor',
    targetType: 'rumor',
    targetId: rumorId,
    metadata: { playerId, toClubId },
    pointsEarned: 15
  });
}

async function logMatchMenuVoted(userId, menuId, matchId, vote) {
  return logActivity({
    userId,
    activityType: 'match_menu_voted',
    action: `Voted ${vote} on match menu`,
    targetType: 'match',
    targetId: matchId,
    metadata: { menuId, vote },
    pointsEarned: 3
  });
}

async function logProfileUpdated(userId) {
  return logActivity({
    userId,
    activityType: 'profile_updated',
    action: 'Updated profile',
    targetType: 'user',
    targetId: userId,
    metadata: {},
    pointsEarned: 0
  });
}

module.exports = {
  logActivity,
  logQuizAttempt,
  logQuizCompleted,
  logRitualCreated,
  logRitualLiked,
  logBadgeEarned,
  logTransferReported,
  logMatchMenuVoted,
  logProfileUpdated
};

