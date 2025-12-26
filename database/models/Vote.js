const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  voteType: {
    type: String,
    enum: ['marketValue', 'rumorProbability'],
    required: true,
    index: true
  },
  // For marketValue votes
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    index: true,
    default: null
  },
  // For rumorProbability votes
  rumor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransferRumor',
    index: true,
    default: null
  },
  value: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

voteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validation: ensure either player or rumor is set based on voteType
voteSchema.pre('validate', function(next) {
  if (this.voteType === 'marketValue' && !this.player) {
    return next(new Error('Player is required for marketValue votes'));
  }
  if (this.voteType === 'rumorProbability' && !this.rumor) {
    return next(new Error('Rumor is required for rumorProbability votes'));
  }
  next();
});

// Compound unique indexes to prevent duplicate votes
voteSchema.index({ user: 1, player: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { voteType: 'marketValue' }
});

voteSchema.index({ user: 1, rumor: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { voteType: 'rumorProbability' }
});

// Post-save hook to update market value or rumor probability
voteSchema.post('save', async function(doc) {
  const { handleVoteSaved } = require('../middleware/voteMiddleware');
  await handleVoteSaved(doc);
});

// Post-update hook (for findOneAndUpdate, etc.)
voteSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    const { handleVoteUpdated } = require('../middleware/voteMiddleware');
    await handleVoteUpdated(doc);
  }
});

module.exports = mongoose.model('Vote', voteSchema);

