# Foodball Backend API

Professional Node.js + Express backend for Foodball.online platform.

## 🏗️ Architecture

Clean architecture with separation of concerns:

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/                # Configuration files
│   ├── index.js          # App config
│   └── database.js       # MongoDB connection
├── routes/               # API routes
│   ├── auth.routes.js
│   ├── player.routes.js
│   ├── transfer.routes.js
│   ├── rumor.routes.js
│   ├── vote.routes.js
│   └── gamification.routes.js
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── player.controller.js
│   ├── transfer.controller.js
│   ├── rumor.controller.js
│   ├── vote.controller.js
│   └── gamification.controller.js
├── services/             # Business logic
│   ├── auth.service.js
│   ├── player.service.js
│   ├── transfer.service.js
│   ├── rumor.service.js
│   ├── vote.service.js
│   └── gamification.service.js
├── middlewares/          # Custom middlewares
│   ├── auth.middleware.js
│   ├── errorHandler.js
│   └── asyncHandler.js
└── utils/               # Utility functions
    ├── errors.js
    └── response.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/foodball
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Players

- `GET /api/players` - Get all players (with pagination, filters)
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create player (Admin only)
- `PUT /api/players/:id` - Update player (Admin only)
- `DELETE /api/players/:id` - Delete player (Admin only)
- `POST /api/players/:id/vote` - Vote on player market value (Protected)

### Transfers

- `GET /api/transfers` - Get all transfers
- `GET /api/transfers/:id` - Get transfer by ID
- `POST /api/transfers` - Create transfer (Admin only)
- `PUT /api/transfers/:id` - Update transfer (Admin only)
- `DELETE /api/transfers/:id` - Delete transfer (Admin only)

### Transfer Rumors

- `GET /api/rumors` - Get all rumors
- `GET /api/rumors/:id` - Get rumor by ID
- `POST /api/rumors` - Create rumor (Protected)
- `POST /api/rumors/:id/vote` - Vote on rumor probability (Protected)
- `PUT /api/rumors/:id/status` - Update rumor status (Admin only)
- `DELETE /api/rumors/:id` - Delete rumor (Admin only)

### Votes

- `GET /api/votes/my-votes` - Get current user's votes (Protected)

### Gamification

- `GET /api/gamification/leaderboard` - Get points leaderboard
- `GET /api/gamification/activity-feed` - Get user activity feed (Protected)
- `GET /api/gamification/progress` - Get user progress summary (Protected)
- `POST /api/gamification/check-badges` - Check and award badges (Protected)
- `GET /api/gamification/badges` - Get all badges
- `GET /api/gamification/my-badges` - Get user's badges (Protected)

## 🔐 Authentication

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "footballfan",
  "email": "fan@example.com",
  "password": "password123",
  "displayName": "Football Fan"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "fan@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Protected Routes

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 📊 Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Players
- `club` - Filter by club ID
- `position` - Filter by position (GK, DF, MF, FW)
- `search` - Search by name
- `sortBy` - Sort field (default: marketValue)
- `sortOrder` - Sort order (asc/desc, default: desc)

### Transfers
- `player` - Filter by player ID
- `fromClub` - Filter by from club
- `toClub` - Filter by to club
- `season` - Filter by season

### Rumors
- `player` - Filter by player ID
- `toClub` - Filter by to club
- `status` - Filter by status (active, confirmed, denied, expired)
- `minProbability` - Minimum probability threshold

## 🎮 Gamification Features

### Points System
Users earn points for:
- Voting (5 points)
- Completing quizzes (up to 20 points)
- Creating rituals (10 points)
- Reporting rumors (15 points)
- Earning badges (10-100 points based on rarity)

### Badges
Badges are automatically awarded based on:
- Vote count
- Quiz completions
- Ritual creations
- Total points
- Activity streaks

### Leaderboard
Sorted by points, showing:
- User rank
- Username, avatar
- Points and level
- Favorite club

## 🔧 Features

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (Admin/User)
- ✅ Community-driven market values
- ✅ Transfer rumor probability system
- ✅ Points and badges system
- ✅ Activity logging
- ✅ Pagination support
- ✅ Error handling
- ✅ Input validation

## 🛠️ Development

### Project Structure

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic layer
- **Middlewares**: Request processing (auth, errors)
- **Utils**: Helper functions

### Error Handling

All errors are handled by `errorHandler` middleware:
- Validation errors (400)
- Unauthorized (401)
- Forbidden (403)
- Not found (404)
- Server errors (500)

### Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

## 📝 Notes

- Market values are automatically calculated from votes
- Rumor probabilities are automatically calculated from votes
- Activity logging is automatic for all meaningful actions
- Badge checking can be triggered manually or on activity

## 🔗 Related

- Database schemas: `../database/schemas.md`
- Database models: `../database/models/`

