const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // URL
    required: true
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'special', 'food'],
    required: true,
    index: true
  },
  foodName: {
    type: String,
    trim: true
  },
  foodDescription: {
    type: String
  },
  requirements: {
    type: {
      type: String,
      enum: ['votes', 'quizzes', 'rituals', 'points', 'streak', 'custom']
    },
    threshold: {
      type: Number
    },
    description: {
      type: String
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
    index: true
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

badgeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Badge', badgeSchema);

