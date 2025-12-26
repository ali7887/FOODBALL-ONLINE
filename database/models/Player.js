const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    enum: ['GK', 'DF', 'MF', 'FW'],
    required: true
  },
  jerseyNumber: {
    type: Number,
    min: 1,
    max: 99
  },
  height: {
    type: Number // in cm
  },
  weight: {
    type: Number // in kg
  },
  preferredFoot: {
    type: String,
    enum: ['left', 'right', 'both']
  },
  currentClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    index: true,
    default: null
  },
  contractExpiry: {
    type: Date
  },
  marketValue: {
    type: Number,
    default: 0,
    index: true
  },
  marketValueVoteCount: {
    type: Number,
    default: 0
  },
  stats: {
    appearances: {
      type: Number,
      default: 0
    },
    goals: {
      type: Number,
      default: 0
    },
    assists: {
      type: Number,
      default: 0
    },
    yellowCards: {
      type: Number,
      default: 0
    },
    redCards: {
      type: Number,
      default: 0
    }
  },
  photo: {
    type: String // URL
  },
  bio: {
    type: String
  },
  transfermarktId: {
    type: String
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

// Auto-generate fullName
playerSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
  this.updatedAt = Date.now();
  next();
});

// Index for position filtering
playerSchema.index({ position: 1 });

module.exports = mongoose.model('Player', playerSchema);

