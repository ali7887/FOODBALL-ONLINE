const mongoose = require('mongoose');

const lineupSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  position: {
    type: String,
    required: true
  },
  isSubstitute: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const matchEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['goal', 'assist', 'yellow', 'red', 'substitution', 'penalty'],
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  minute: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  homeClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  awayClub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
  },
  competition: {
    type: String,
    required: true,
    index: true
  },
  round: {
    type: String,
    trim: true
  },
  season: {
    type: String,
    required: true,
    index: true
  },
  matchDate: {
    type: Date,
    required: true,
    index: true
  },
  matchTime: {
    type: String
  },
  venue: {
    type: String
  },
  attendance: {
    type: Number
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished', 'postponed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  homeScore: {
    type: Number,
    default: null
  },
  awayScore: {
    type: Number,
    default: null
  },
  homePenalties: {
    type: Number
  },
  awayPenalties: {
    type: Number
  },
  homeLineup: [lineupSchema],
  awayLineup: [lineupSchema],
  events: [matchEventSchema],
  referee: {
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

matchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound indexes
matchSchema.index({ homeClub: 1, matchDate: -1 });
matchSchema.index({ awayClub: 1, matchDate: -1 });
matchSchema.index({ competition: 1, season: 1, matchDate: -1 });

module.exports = mongoose.model('Match', matchSchema);

