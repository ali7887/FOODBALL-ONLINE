# Foodball.online Database Schema

This directory contains the complete MongoDB schema design and Mongoose models for Foodball.online.

## Structure

```
database/
├── schemas.md              # Complete schema documentation
├── models/                 # Mongoose model files
│   ├── index.js           # Central model exports
│   ├── User.js
│   ├── Player.js
│   ├── Club.js
│   ├── Transfer.js
│   ├── TransferRumor.js
│   ├── Vote.js
│   ├── Match.js
│   ├── MatchMenu.js
│   ├── Ritual.js
│   ├── Quiz.js
│   ├── Badge.js
│   ├── UserBadge.js
│   └── ActivityLog.js
└── middleware/            # Database middleware
    ├── voteMiddleware.js  # Vote calculation logic
    └── activityLogger.js  # Activity logging helpers
```

## Quick Start

### 1. Install Dependencies

```bash
npm install mongoose
```

### 2. Connect to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### 3. Use Models

```javascript
const { User, Player, Club } = require('./database/models');

// Create a user
const user = await User.create({
  username: 'footballfan',
  email: 'fan@example.com',
  passwordHash: 'hashed_password'
});

// Find players
const players = await Player.find({ currentClub: clubId });
```

## Key Features

### Community-Driven Market Values
- Players' market values are calculated from user votes
- Automatically updated when votes are added/updated
- See `middleware/voteMiddleware.js` for implementation

### Transfer Rumor Probability
- Rumors have probability scores based on community votes
- Automatically calculated and updated
- Supports upvote/downvote system

### Activity Tracking
- Every meaningful user action is logged
- Used for analytics, leaderboards, and badge eligibility
- See `middleware/activityLogger.js` for helpers

### Points System
- Users earn points for various activities
- Points contribute to user level
- Tracked in ActivityLog with automatic User.points updates

## Indexes

All critical indexes are defined in the models. Key indexes include:

- **User**: username, email (unique), points
- **Player**: currentClub, marketValue, fullName
- **Transfer**: player + transferDate (compound)
- **TransferRumor**: status + probability (compound)
- **Vote**: user + player/rumor (unique compound)
- **Match**: homeClub/awayClub + matchDate (compound)
- **ActivityLog**: user + timestamp (compound)

## Relationships

### Reference Relationships (Normalized)
- User → Club (favoriteClub)
- Player → Club (currentClub)
- Transfer → Player, Club
- TransferRumor → Player, Club, Transfer
- Vote → User, Player, TransferRumor
- Match → Club
- MatchMenu → Match, User
- Ritual → User, Match
- Quiz → User (createdBy)
- UserBadge → User, Badge
- ActivityLog → User, various entities

### Embedded Data (Denormalized for MVP)
- Player.stats
- Club.stats
- Match.lineups, events
- MatchMenu.votes.userVotes
- Ritual.likedBy
- Quiz.questions

## Special Logic

### Market Value Calculation
Triggered automatically when a marketValue vote is created/updated:

```javascript
const { handleVoteSaved } = require('./database/middleware/voteMiddleware');

// After creating a vote
await Vote.create({ ... });
await handleVoteSaved(vote); // Updates Player.marketValue
```

### Activity Logging
Use helper functions for consistent logging:

```javascript
const { logQuizCompleted, logBadgeEarned } = require('./database/middleware/activityLogger');

await logQuizCompleted(userId, quizId, score, correctAnswers, totalQuestions);
await logBadgeEarned(userId, badgeId, badgeName, rarity);
```

## Next Steps

1. Set up database connection in your Next.js app
2. Create API routes that use these models
3. Implement authentication middleware
4. Create seed scripts for initial data
5. Set up database indexes (MongoDB will create them automatically on first use)

## Notes

- All timestamps use `Date.now` by default
- `updatedAt` is automatically updated on save via pre-save hooks
- Unique constraints prevent duplicate votes per user
- ActivityLog can be cleaned up with TTL index (commented in model)

