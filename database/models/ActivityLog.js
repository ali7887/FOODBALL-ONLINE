const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    index: true,
    enum: [
      'vote_market_value',
      'vote_rumor_probability',
      'quiz_attempt',
      'quiz_completed',
      'ritual_created',
      'ritual_liked',
      'badge_earned',
      'transfer_reported',
      'profile_updated',
      'match_menu_voted'
    ]
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['player', 'club', 'transfer', 'rumor', 'match', 'vote', 'quiz', 'ritual', 'badge', 'user'],
    index: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  }
});

// Compound indexes for common queries
activityLogSchema.index({ user: 1, timestamp: -1 }); // User activity feed
activityLogSchema.index({ activityType: 1, timestamp: -1 }); // Activity type analytics
activityLogSchema.index({ targetType: 1, targetId: 1, timestamp: -1 }); // Entity activity history

// TTL index for automatic cleanup (optional - uncomment if needed)
// activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 }); // 1 year

module.exports = mongoose.model('ActivityLog', activityLogSchema);

