# Foodball.online - MongoDB Schema Summary

## Overview

Complete MongoDB schema design for **Foodball.online** - a football data platform for Iranian football with food-themed gamification.

**Content Ratio:** 70% football data, 30% fun & food interaction

---

## Schema Entities (13 Total)

### Core Football Data (70%)

1. **User** - User accounts, profiles, points, preferences
2. **Player** - Player information, stats, market value (community-driven)
3. **Club** - Team/club data, league info, signature food
4. **Transfer** - Official transfers (permanent, loan, free, swap)
5. **TransferRumor** - Unconfirmed transfer rumors with probability scores
6. **Match** - Match data, lineups, events, results
7. **Vote** - Community votes on market values and rumor probabilities

### Gamification & Food Theme (30%)

8. **MatchMenu** - Food-themed menus for matches
9. **Ritual** - Pre-match rituals shared by users
10. **Quiz** - Football quizzes with food rewards
11. **Badge** - Achievement badges (food-themed)
12. **UserBadge** - Junction table for user-badge relationships
13. **ActivityLog** - Comprehensive activity tracking (CRITICAL)

---

## Key Design Decisions

### 1. Community-Driven Market Values
- **Player.marketValue** = Average of all user votes
- Automatically recalculated when votes are added/updated
- Stored in Player model for quick access
- See `middleware/voteMiddleware.js`

### 2. Transfer Rumor Probability
- **TransferRumor.probability** = Average of community votes (0-100)
- Tracks upvotes/downvotes separately
- Can be linked to actual Transfer when confirmed
- Auto-expires after transfer window

### 3. Activity Logging (VERY IMPORTANT)
- **Every meaningful action is logged**
- Used for:
  - User activity feeds
  - Leaderboards
  - Analytics
  - Badge eligibility checks
- Automatic points calculation
- See `middleware/activityLogger.js`

### 4. Points System
- Users earn points for various activities
- Points contribute to user level
- Tracked in ActivityLog
- Automatically updates User.points

### 5. Embedded vs Referenced Data

**Embedded (Denormalized for MVP):**
- Player.stats
- Club.stats
- Match.lineups, events
- MatchMenu.votes.userVotes
- Ritual.likedBy
- Quiz.questions

**Referenced (Normalized):**
- All entity relationships (User → Club, Player → Club, etc.)
- Prevents data duplication
- Easier to maintain consistency

---

## Index Strategy

### High-Priority Indexes
- **User**: username, email (unique lookups)
- **Player**: currentClub, marketValue (club rosters, sorting)
- **Transfer**: [player, transferDate] (player history)
- **TransferRumor**: [status, probability] (active rumors)
- **Vote**: [user, player] and [user, rumor] (prevent duplicates)
- **Match**: matchDate, status (upcoming/finished)
- **ActivityLog**: [user, timestamp] (user feeds)

### Secondary Indexes
- Text search: Player.fullName, Club.name
- Filtering: Match.competition, Quiz.category
- Sorting: Player.marketValue, TransferRumor.probability

---

## Special Logic Implementation

### Market Value Calculation
```javascript
// Triggered automatically via Vote model post-save hook
const vote = await Vote.create({
  user: userId,
  voteType: 'marketValue',
  player: playerId,
  value: 5000000
});
// Automatically updates Player.marketValue
```

### Rumor Probability Calculation
```javascript
// Triggered automatically via Vote model post-save hook
const vote = await Vote.create({
  user: userId,
  voteType: 'rumorProbability',
  rumor: rumorId,
  value: 75 // 0-100
});
// Automatically updates TransferRumor.probability
```

### Activity Logging
```javascript
const { logQuizCompleted, logBadgeEarned } = require('./middleware/activityLogger');

// Log quiz completion (awards points)
await logQuizCompleted(userId, quizId, score, correctAnswers, totalQuestions);

// Log badge earned (awards points based on rarity)
await logBadgeEarned(userId, badgeId, badgeName, rarity);
```

---

## Points System

### Points Awarded Per Activity
- **Vote** (any type): 5 points
- **Complete Quiz**: Up to 20 points (based on score)
- **Create Ritual**: 10 points
- **Like Ritual**: 1 point
- **Report Transfer Rumor**: 15 points
- **Vote on Match Menu**: 3 points
- **Earn Badge**: 
  - Common: 10 points
  - Rare: 25 points
  - Epic: 50 points
  - Legendary: 100 points

---

## File Structure

```
database/
├── schemas.md              # Detailed schema documentation
├── SCHEMA_SUMMARY.md       # This file
├── README.md               # Quick start guide
├── connection.js           # MongoDB connection utility
├── models/
│   ├── index.js           # Central exports
│   ├── User.js
│   ├── Player.js
│   ├── Club.js
│   ├── Transfer.js
│   ├── TransferRumor.js
│   ├── Vote.js            # Includes auto-calculation hooks
│   ├── Match.js
│   ├── MatchMenu.js
│   ├── Ritual.js
│   ├── Quiz.js
│   ├── Badge.js
│   ├── UserBadge.js
│   └── ActivityLog.js
└── middleware/
    ├── voteMiddleware.js  # Market value & probability calculations
    └── activityLogger.js   # Activity logging helpers
```

---

## Usage Example

```javascript
// 1. Connect to database
const { connectDB } = require('./database/connection');
await connectDB(process.env.MONGODB_URI);

// 2. Use models
const { User, Player, Vote } = require('./database/models');

// 3. Create a vote (automatically updates player market value)
const vote = await Vote.create({
  user: userId,
  voteType: 'marketValue',
  player: playerId,
  value: 5000000
});

// 4. Log activity
const { logQuizCompleted } = require('./database/middleware/activityLogger');
await logQuizCompleted(userId, quizId, 85, 17, 20);

// 5. Query with relationships
const player = await Player.findById(playerId).populate('currentClub');
const user = await User.findById(userId).populate('favoriteClub');
```

---

## MVP Considerations

### Included
✅ Core football data (players, clubs, transfers, matches)  
✅ Community voting system  
✅ Food-themed gamification (menus, rituals, badges)  
✅ Activity tracking  
✅ Points system  
✅ Basic stats (embedded)

### Deferred (Post-MVP)
⏸️ Advanced player statistics  
⏸️ Detailed match analytics  
⏸️ Social features (follows, comments)  
⏸️ Notification system  
⏸️ Advanced search/filtering  
⏸️ Data normalization (some embedded data can be moved to separate collections)

---

## Next Steps

1. ✅ Schema design complete
2. ✅ Mongoose models created
3. ✅ Middleware for calculations and logging
4. ⏭️ Set up database connection in Next.js app
5. ⏭️ Create API routes
6. ⏭️ Implement authentication
7. ⏭️ Create seed scripts
8. ⏭️ Set up indexes in MongoDB

---

## Notes

- All timestamps auto-update via pre-save hooks
- Unique constraints prevent duplicate votes
- ActivityLog supports TTL index for automatic cleanup (optional)
- Market value and probability calculations are automatic
- Points system is integrated with activity logging
- Food theme is woven throughout (signatureFood, foodReward, foodName)

---

**Schema Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Ready for implementation

