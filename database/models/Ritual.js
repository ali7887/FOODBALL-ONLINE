const mongoose = require('mongoose');

const ritualSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  foodItems: [{
    type: String,
    trim: true
  }],
  timing: {
    type: String,
    enum: ['pre-match', 'half-time', 'post-match'],
    default: 'pre-match'
  },
  images: [{
    type: String // Array of image URLs
  }],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

ritualSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Sync likes count with likedBy array length
  this.likes = this.likedBy.length;
  next();
});

// Compound index for match rituals
ritualSchema.index({ match: 1, createdAt: -1 });

module.exports = mongoose.model('Ritual', ritualSchema);

