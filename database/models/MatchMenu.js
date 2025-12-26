const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'drink']
  },
  price: {
    type: Number
  },
  image: {
    type: String // URL
  }
}, { _id: false });

const userVoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const matchMenuSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    unique: true,
    index: true
  },
  menuName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  items: [menuItemSchema],
  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    userVotes: [userVoteSchema]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

matchMenuSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MatchMenu', matchMenuSchema);

