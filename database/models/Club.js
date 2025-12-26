const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  shortName: {
    type: String,
    trim: true
  },
  founded: {
    type: Number // Year
  },
  city: {
    type: String,
    trim: true
  },
  stadium: {
    type: String,
    trim: true
  },
  stadiumCapacity: {
    type: Number
  },
  league: {
    type: String,
    required: true,
    index: true
  },
  division: {
    type: String,
    default: '1'
  },
  currentPosition: {
    type: Number
  },
  logo: {
    type: String // URL
  },
  colors: {
    primary: {
      type: String
    },
    secondary: {
      type: String
    }
  },
  stats: {
    totalTitles: {
      type: Number,
      default: 0
    },
    leagueTitles: {
      type: Number,
      default: 0
    },
    cupTitles: {
      type: Number,
      default: 0
    }
  },
  signatureFood: {
    type: String,
    trim: true
  },
  foodDescription: {
    type: String
  },
  transfermarktId: {
    type: String
  },
  website: {
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

clubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for league tables
clubSchema.index({ currentPosition: 1 });

module.exports = mongoose.model('Club', clubSchema);

