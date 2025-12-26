const mongoose = require('mongoose');

const transferRumorSchema = new mongoose.Schema({
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
  estimatedFee: {
    type: Number
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  transferType: {
    type: String,
    enum: ['permanent', 'loan', 'free']
  },
  rumoredDate: {
    type: Date
  },
  season: {
    type: String,
    trim: true
  },
  probability: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: true
  },
  voteCount: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'confirmed', 'denied', 'expired'],
    default: 'active',
    index: true
  },
  confirmedTransfer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transfer',
    default: null
  },
  source: {
    type: String // News source URL
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedAt: {
    type: Date,
    default: Date.now,
    index: true
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
  },
  expiresAt: {
    type: Date
  }
});

transferRumorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes
transferRumorSchema.index({ status: 1, probability: -1 }); // Active rumors sorted by probability
transferRumorSchema.index({ toClub: 1, status: 1, reportedAt: -1 }); // Club incoming rumors

module.exports = mongoose.model('TransferRumor', transferRumorSchema);

