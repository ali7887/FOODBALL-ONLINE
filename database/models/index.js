// Central export for all models
const User = require('./User');
const Player = require('./Player');
const Club = require('./Club');
const Transfer = require('./Transfer');
const TransferRumor = require('./TransferRumor');
const Vote = require('./Vote');
const Match = require('./Match');
const MatchMenu = require('./MatchMenu');
const Ritual = require('./Ritual');
const Quiz = require('./Quiz');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');
const ActivityLog = require('./ActivityLog');

module.exports = {
  User,
  Player,
  Club,
  Transfer,
  TransferRumor,
  Vote,
  Match,
  MatchMenu,
  Ritual,
  Quiz,
  Badge,
  UserBadge,
  ActivityLog
};

