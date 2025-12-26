# Foodball.online - MongoDB Schema Design

## Overview
This document defines the complete MongoDB schema structure for Foodball.online MVP using Mongoose ODM.

**Design Principles:**
- MVP-focused (avoid overengineering)
- Community-driven data (votes, rumors)
- Comprehensive activity tracking
- Food-themed gamification elements

---

## 1. User Schema

```javascript
{
  _id: ObjectId,
  username: String (required, unique, indexed),
  email: String (required, unique, indexed),
  passwordHash: String (required),
  displayName: String,
  avatar: String (URL),
  bio: String,
  favoriteClub: ObjectId (ref: 'Club'),
  role: String (enum: ['user', 'admin', 'moderator'], default: 'user'),
  isVerified: Boolean (default: false),
  points: Number (default: 0),
  level: Number (default: 1),
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  lastActiveAt: Date,
  preferences: {
    notifications: Boolean (default: true),
    language: String (default: 'fa'),
    theme: String (default: 'light')
  }
}
```

**Indexes:**
- `username`: unique
- `email`: unique
- `createdAt`: for sorting/recent users
- `points`: for leaderboards

**Relationships:**
- `favoriteClub`: References Club
- One-to-many with Vote, Ritual, UserBadge, ActivityLog

**Notes:**
- Points system for gamification
- Level progression based on points
- Role-based access control

---

## 2. Player Schema

```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  fullName: String (required, indexed), // Computed: firstName + lastName
  dateOfBirth: Date,
  nationality: String,
  position: String (enum: ['GK', 'DF', 'MF', 'FW'], required),
  jerseyNumber: Number,
  height: Number, // in cm
  weight: Number, // in kg
  preferredFoot: String (enum: ['left', 'right', 'both']),
  
  // Current status
  currentClub: ObjectId (ref: 'Club', indexed),
  contractExpiry: Date,
  marketValue: Number (default: 0), // Calculated from votes
  marketValueVoteCount: Number (default: 0),
  
  // Stats (embedded for MVP)
  stats: {
    appearances: Number (default: 0),
    goals: Number (default: 0),
    assists: Number (default: 0),
    yellowCards: Number (default: 0),
    redCards: Number (default: 0)
  },
  
  // Media
  photo: String (URL),
  bio: String,
  
  // Metadata
  transfermarktId: String, // External reference if available
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `fullName`: text search
- `currentClub`: for club player lists
- `position`: for filtering
- `marketValue`: for sorting by value

**Relationships:**
- `currentClub`: References Club
- One-to-many with Transfer, TransferRumor, Vote

**Notes:**
- `marketValue` is calculated as average of all votes
- Updated when new votes are added
- Stats can be expanded later

---

## 3. Club Schema

```javascript
{
  _id: ObjectId,
  name: String (required, unique, indexed),
  shortName: String,
  founded: Number, // Year
  city: String,
  stadium: String,
  stadiumCapacity: Number,
  
  // Current season
  league: String (required, indexed), // e.g., 'Persian Gulf Pro League'
  division: String (default: '1'),
  currentPosition: Number,
  
  // Media
  logo: String (URL),
  colors: {
    primary: String,
    secondary: String
  },
  
  // Stats (embedded for MVP)
  stats: {
    totalTitles: Number (default: 0),
    leagueTitles: Number (default: 0),
    cupTitles: Number (default: 0)
  },
  
  // Food theme
  signatureFood: String, // Club's signature food item
  foodDescription: String,
  
  // Metadata
  transfermarktId: String,
  website: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `name`: unique, text search
- `league`: for filtering by league
- `currentPosition`: for league tables

**Relationships:**
- One-to-many with Player, Transfer, Match
- Referenced by User (favoriteClub)

**Notes:**
- `signatureFood` adds food theme
- League structure supports multiple divisions

---

## 4. Transfer Schema

```javascript
{
  _id: ObjectId,
  player: ObjectId (ref: 'Player', required, indexed),
  fromClub: ObjectId (ref: 'Club', indexed),
  toClub: ObjectId (ref: 'Club', required, indexed),
  transferFee: Number, // in currency (e.g., Toman or EUR)
  currency: String (default: 'EUR'),
  transferType: String (enum: ['permanent', 'loan', 'free', 'swap'], required),
  transferDate: Date (required, indexed),
  contractExpiry: Date,
  season: String, // e.g., '2024-25'
  
  // Status
  isOfficial: Boolean (default: true),
  confirmedBy: ObjectId (ref: 'User'), // Admin who confirmed
  
  // Metadata
  source: String, // News source URL
  notes: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `player`: for player transfer history
- `fromClub`: for club outgoing transfers
- `toClub`: for club incoming transfers
- `transferDate`: for chronological sorting
- Compound: `[player, transferDate]` for player history

**Relationships:**
- `player`: References Player
- `fromClub`, `toClub`: Reference Club
- `confirmedBy`: References User (admin)

**Notes:**
- Tracks official transfers only
- TransferRumor handles unconfirmed transfers

---

## 5. TransferRumor Schema

```javascript
{
  _id: ObjectId,
  player: ObjectId (ref: 'Player', required, indexed),
  fromClub: ObjectId (ref: 'Club', indexed),
  toClub: ObjectId (ref: 'Club', required, indexed),
  estimatedFee: Number,
  currency: String (default: 'EUR'),
  transferType: String (enum: ['permanent', 'loan', 'free']),
  rumoredDate: Date, // When transfer might happen
  season: String,
  
  // Community voting
  probability: Number (default: 0, min: 0, max: 100), // Calculated from votes
  voteCount: Number (default: 0),
  upvotes: Number (default: 0),
  downvotes: Number (default: 0),
  
  // Status
  status: String (enum: ['active', 'confirmed', 'denied', 'expired'], default: 'active', indexed),
  confirmedTransfer: ObjectId (ref: 'Transfer'), // If rumor becomes reality
  
  // Source
  source: String, // News source URL
  reportedBy: ObjectId (ref: 'User'),
  reportedAt: Date (default: Date.now, indexed),
  
  // Metadata
  notes: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now),
  expiresAt: Date // Auto-expire old rumors
}
```

**Indexes:**
- `player`: for player rumors
- `toClub`: for club incoming rumors
- `status`: for filtering active rumors
- `reportedAt`: for recent rumors
- `probability`: for sorting by likelihood
- Compound: `[status, probability]` for active rumors sorted by probability

**Relationships:**
- `player`: References Player
- `fromClub`, `toClub`: Reference Club
- `reportedBy`: References User
- `confirmedTransfer`: References Transfer (if confirmed)

**Notes:**
- `probability` calculated from community votes
- Auto-expires after transfer window closes
- Can be linked to actual Transfer when confirmed

---

## 6. Vote Schema

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  voteType: String (enum: ['marketValue', 'rumorProbability'], required, indexed),
  
  // Target entity (one of these required)
  player: ObjectId (ref: 'Player', indexed), // For marketValue votes
  rumor: ObjectId (ref: 'TransferRumor', indexed), // For rumorProbability votes
  
  // Vote value
  value: Number (required), // Market value in currency OR probability 0-100
  
  // Metadata
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `user`: for user vote history
- `voteType`: for filtering vote types
- `player`: for player market value votes
- `rumor`: for rumor probability votes
- Compound: `[user, player]` unique for marketValue (one vote per user per player)
- Compound: `[user, rumor]` unique for rumorProbability (one vote per user per rumor)

**Relationships:**
- `user`: References User
- `player`: References Player (for marketValue votes)
- `rumor`: References TransferRumor (for rumorProbability votes)

**Notes:**
- One vote per user per entity
- Updates trigger recalculation of averages
- Used to calculate Player.marketValue and TransferRumor.probability

---

## 7. Match Schema

```javascript
{
  _id: ObjectId,
  homeClub: ObjectId (ref: 'Club', required, indexed),
  awayClub: ObjectId (ref: 'Club', required, indexed),
  competition: String (required, indexed), // e.g., 'Persian Gulf Pro League', 'Hazfi Cup'
  round: String, // e.g., 'Round 15', 'Quarter Final'
  season: String (required, indexed), // e.g., '2024-25'
  
  // Match details
  matchDate: Date (required, indexed),
  matchTime: String, // e.g., '18:00'
  venue: String,
  attendance: Number,
  
  // Result
  status: String (enum: ['scheduled', 'live', 'finished', 'postponed', 'cancelled'], default: 'scheduled', indexed),
  homeScore: Number,
  awayScore: Number,
  homePenalties: Number, // If went to penalties
  awayPenalties: Number,
  
  // Lineups (embedded for MVP)
  homeLineup: [{
    player: ObjectId (ref: 'Player'),
    position: String,
    isSubstitute: Boolean (default: false)
  }],
  awayLineup: [{
    player: ObjectId (ref: 'Player'),
    position: String,
    isSubstitute: Boolean (default: false)
  }],
  
  // Events (embedded for MVP)
  events: [{
    type: String (enum: ['goal', 'assist', 'yellow', 'red', 'substitution', 'penalty']),
    player: ObjectId (ref: 'Player'),
    minute: Number,
    description: String
  }],
  
  // Metadata
  referee: String,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `homeClub`: for club home matches
- `awayClub`: for club away matches
- `competition`: for filtering by competition
- `season`: for season-based queries
- `matchDate`: for chronological sorting
- `status`: for filtering by status
- Compound: `[homeClub, matchDate]` for club home fixtures
- Compound: `[awayClub, matchDate]` for club away fixtures

**Relationships:**
- `homeClub`, `awayClub`: Reference Club
- Lineups and events reference Player
- One-to-one with MatchMenu

**Notes:**
- Embedded lineups and events for MVP simplicity
- Can be normalized later if needed

---

## 8. MatchMenu Schema

```javascript
{
  _id: ObjectId,
  match: ObjectId (ref: 'Match', required, unique, indexed),
  
  // Food theme
  menuName: String (required), // e.g., "Derby Delight Menu"
  description: String,
  items: [{
    name: String (required),
    description: String,
    category: String (enum: ['appetizer', 'main', 'dessert', 'drink']),
    price: Number,
    image: String (URL)
  }],
  
  // Community interaction
  votes: {
    upvotes: Number (default: 0),
    downvotes: Number (default: 0),
    userVotes: [{
      user: ObjectId (ref: 'User'),
      vote: String (enum: ['up', 'down']),
      votedAt: Date
    }]
  },
  
  // Metadata
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `match`: unique (one menu per match)
- `createdAt`: for recent menus

**Relationships:**
- `match`: References Match (one-to-one)
- `createdBy`: References User
- `votes.userVotes.user`: References User

**Notes:**
- Food-themed feature for match engagement
- Community can vote on menu quality
- Embedded user votes for MVP (can be normalized later)

---

## 9. Ritual Schema

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  match: ObjectId (ref: 'Match', required, indexed),
  
  // Ritual details
  title: String (required),
  description: String,
  foodItems: [String], // Food items in the ritual
  timing: String (enum: ['pre-match', 'half-time', 'post-match'], default: 'pre-match'),
  
  // Media
  images: [String], // Array of image URLs
  
  // Community interaction
  likes: Number (default: 0),
  likedBy: [ObjectId (ref: 'User')], // Embedded for MVP
  
  // Metadata
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `user`: for user's rituals
- `match`: for match rituals
- `createdAt`: for recent rituals
- Compound: `[match, createdAt]` for match rituals sorted by time

**Relationships:**
- `user`: References User
- `match`: References Match
- `likedBy`: Array of User references

**Notes:**
- Pre-match ritual sharing (food-themed)
- Simple like system for engagement
- Embedded likedBy for MVP simplicity

---

## 10. Quiz Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String (enum: ['players', 'clubs', 'transfers', 'history', 'food'], indexed),
  difficulty: String (enum: ['easy', 'medium', 'hard'], default: 'medium'),
  
  // Questions (embedded)
  questions: [{
    question: String (required),
    options: [String] (required, length: 4),
    correctAnswer: Number (required), // Index of correct option (0-3)
    explanation: String
  }],
  
  // Food theme
  foodReward: String, // Food item name as reward
  foodDescription: String,
  
  // Stats
  totalAttempts: Number (default: 0),
  correctAnswers: Number (default: 0),
  averageScore: Number (default: 0),
  
  // Status
  isActive: Boolean (default: true, indexed),
  isFeatured: Boolean (default: false, indexed),
  
  // Metadata
  createdBy: ObjectId (ref: 'User'), // Admin
  createdAt: Date (default: Date.now, indexed),
  updatedAt: Date (default: Date.now),
  expiresAt: Date // Optional expiration
}
```

**Indexes:**
- `category`: for filtering by category
- `isActive`: for active quizzes
- `isFeatured`: for featured quizzes
- `createdAt`: for recent quizzes
- Compound: `[isActive, isFeatured, createdAt]` for homepage

**Relationships:**
- `createdBy`: References User (admin)
- One-to-many with ActivityLog (quiz attempts)

**Notes:**
- Embedded questions for MVP
- Food-themed rewards
- Stats track community performance

---

## 11. Badge Schema

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (required),
  icon: String (URL, required),
  
  // Badge type
  category: String (enum: ['achievement', 'milestone', 'special', 'food'], indexed),
  
  // Food theme
  foodName: String, // Associated food item
  foodDescription: String,
  
  // Requirements (for auto-awarding)
  requirements: {
    type: String (enum: ['votes', 'quizzes', 'rituals', 'points', 'streak', 'custom']),
    threshold: Number,
    description: String
  },
  
  // Rarity
  rarity: String (enum: ['common', 'rare', 'epic', 'legendary'], default: 'common', indexed),
  
  // Stats
  totalEarned: Number (default: 0),
  
  // Metadata
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
- `name`: unique
- `category`: for filtering
- `rarity`: for sorting by rarity
- `isActive`: for active badges

**Relationships:**
- Many-to-many with User (through UserBadge)

**Notes:**
- Food-themed badges for gamification
- Can be auto-awarded based on requirements
- Rarity system for prestige

---

## 12. UserBadge Schema

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  badge: ObjectId (ref: 'Badge', required, indexed),
  
  // Achievement details
  earnedAt: Date (required, default: Date.now, indexed),
  progress: Number (default: 100), // Percentage if badge has progress
  
  // Metadata
  awardedBy: ObjectId (ref: 'User'), // Admin if manually awarded
  notes: String
}
```

**Indexes:**
- `user`: for user's badges
- `badge`: for badge earners
- `earnedAt`: for recent achievements
- Compound: `[user, badge]` unique (one badge per user)
- Compound: `[user, earnedAt]` for user badges sorted by date

**Relationships:**
- `user`: References User
- `badge`: References Badge
- `awardedBy`: References User (admin)

**Notes:**
- Junction table for User-Badge many-to-many
- Tracks when badge was earned
- Supports progress tracking for multi-stage badges

---

## 13. ActivityLog Schema

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  activityType: String (required, indexed), // See activity types below
  action: String (required), // Specific action description
  
  // Target entity (varies by activityType)
  targetType: String (enum: ['player', 'club', 'transfer', 'rumor', 'match', 'vote', 'quiz', 'ritual', 'badge', 'user'], indexed),
  targetId: ObjectId (indexed),
  
  // Activity-specific data
  metadata: {
    // Flexible object for activity-specific data
    // Examples:
    // - vote: { voteType, value, playerId/rumorId }
    // - quiz: { quizId, score, correctAnswers }
    // - badge: { badgeId, badgeName }
    // - ritual: { matchId, ritualId }
  },
  
  // Points earned (if applicable)
  pointsEarned: Number (default: 0),
  
  // Timestamp
  timestamp: Date (required, default: Date.now, indexed)
}
```

**Activity Types:**
- `vote_market_value` - Voted on player market value
- `vote_rumor_probability` - Voted on transfer rumor
- `quiz_attempt` - Attempted a quiz
- `quiz_completed` - Completed a quiz
- `ritual_created` - Created a pre-match ritual
- `ritual_liked` - Liked a ritual
- `badge_earned` - Earned a badge
- `transfer_reported` - Reported a transfer rumor
- `profile_updated` - Updated profile
- `match_menu_voted` - Voted on match menu

**Indexes:**
- `user`: for user activity history
- `activityType`: for filtering by activity type
- `targetType`: for filtering by target entity
- `targetId`: for entity-specific activity
- `timestamp`: for chronological sorting
- Compound: `[user, timestamp]` for user activity feed
- Compound: `[activityType, timestamp]` for activity type analytics
- Compound: `[targetType, targetId]` for entity activity history

**Relationships:**
- `user`: References User
- `targetId`: References various entities based on `targetType`

**Notes:**
- **CRITICAL**: Logs every meaningful user action
- Used for analytics, leaderboards, recommendations
- Flexible metadata field for activity-specific data
- TTL index can be added later for old log cleanup

---

## Schema Relationships Summary

### Reference Relationships (Normalized)
- User → Club (favoriteClub)
- Player → Club (currentClub)
- Transfer → Player, Club (fromClub, toClub)
- TransferRumor → Player, Club, Transfer (if confirmed)
- Vote → User, Player, TransferRumor
- Match → Club (homeClub, awayClub)
- MatchMenu → Match, User
- Ritual → User, Match
- Quiz → User (createdBy)
- UserBadge → User, Badge
- ActivityLog → User, various entities

### Embedded Data (Denormalized for MVP)
- Player.stats
- Club.stats
- Match.homeLineup, awayLineup, events
- MatchMenu.votes.userVotes
- Ritual.likedBy
- Quiz.questions

---

## Index Strategy

### High-Priority Indexes (Performance Critical)
1. **User**: username, email (unique lookups)
2. **Player**: currentClub, marketValue (club rosters, sorting)
3. **Transfer**: player, transferDate (player history)
4. **TransferRumor**: status, probability (active rumors)
5. **Vote**: Compound [user, player] and [user, rumor] (prevent duplicates)
6. **Match**: matchDate, status (upcoming/finished matches)
7. **ActivityLog**: [user, timestamp] (user feeds)

### Secondary Indexes (Query Optimization)
- Text search: Player.fullName, Club.name
- Filtering: Match.competition, Quiz.category
- Sorting: Player.marketValue, TransferRumor.probability

---

## Special Logic Implementation Notes

### 1. Player Market Value Calculation
- Triggered when Vote is created/updated with `voteType: 'marketValue'`
- Query all votes for the player
- Calculate average: `marketValue = SUM(values) / COUNT(votes)`
- Update Player.marketValue and Player.marketValueVoteCount
- Log activity: `vote_market_value`

### 2. TransferRumor Probability Calculation
- Triggered when Vote is created/updated with `voteType: 'rumorProbability'`
- Query all votes for the rumor
- Calculate weighted average or simple average
- Update TransferRumor.probability, voteCount, upvotes, downvotes
- Log activity: `vote_rumor_probability`

### 3. Activity Logging
- **Always log** when:
  - User votes (any type)
  - User completes quiz
  - User creates ritual
  - User earns badge
  - User reports rumor
  - Any point-earning action
- Use ActivityLog for:
  - User activity feeds
  - Leaderboards
  - Analytics
  - Badge eligibility checks

### 4. Points System
- Award points for:
  - Voting (e.g., +5 points)
  - Completing quiz (based on score)
  - Creating ritual (+10 points)
  - Earning badge (varies by rarity)
  - Daily login streak
- Update User.points and User.level
- Log in ActivityLog with pointsEarned

---

## MVP Considerations

### What's Included
- Core football data (players, clubs, transfers, matches)
- Community voting system
- Food-themed gamification (menus, rituals, badges)
- Activity tracking
- Basic stats (embedded for simplicity)

### What's Deferred (Post-MVP)
- Advanced player statistics
- Detailed match analytics
- Social features (follows, comments)
- Notification system
- Advanced search/filtering
- Data normalization (some embedded data can be moved to separate collections)

---

## Next Steps

1. Create Mongoose model files based on these schemas
2. Set up database connection
3. Implement middleware for:
   - Market value calculation
   - Rumor probability calculation
   - Activity logging
   - Points system
4. Create seed scripts for initial data
5. Set up indexes in MongoDB

