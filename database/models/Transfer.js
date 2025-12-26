const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    index: true
  },
  fromClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    index: true,
    default: null
  },
  toClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  transferFee: {
    type: Number
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  transferType: {
    type: String,
    enum: ['permanent', 'loan', 'free', 'swap'],
    required: true
  },
  transferDate: {
    type: Date,
    required: true,
    index: true
  },
  contractExpiry: {
    type: Date
  },
  season: {
    type: String,
    trim: true
  },
  isOfficial: {
    type: Boolean,
    default: true
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  source: {
    type: String // News source URL
  },
  notes: {
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

transferSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes for common queries
transferSchema.index({ player: 1, transferDate: -1 }); // Player transfer history
transferSchema.index({ fromClub: 1, transferDate: -1 }); // Club outgoing transfers
transferSchema.index({ toClub: 1, transferDate: -1 }); // Club incoming transfers

module.exports = mongoose.model('Transfer', transferSchema);

