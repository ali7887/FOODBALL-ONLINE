const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true,
    index: true
  },
  earnedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  progress: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  awardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String
  }
});

// Compound unique index: one badge per user
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

// Compound index for user badges sorted by date
userBadgeSchema.index({ user: 1, earnedAt: -1 });

module.exports = mongoose.model('UserBadge', userBadgeSchema);

