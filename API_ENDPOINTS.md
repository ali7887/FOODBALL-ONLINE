# Foodball API Endpoints Reference

Complete API endpoint documentation for Foodball.online backend.

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "displayName": "string" (optional)
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 👥 Players

### Get All Players
```http
GET /api/players?page=1&limit=20&club=<id>&position=FW&search=name&sortBy=marketValue&sortOrder=desc
```

### Get Player by ID
```http
GET /api/players/:id
```

### Create Player (Admin)
```http
POST /api/players
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "position": "GK|DF|MF|FW",
  "currentClub": "ObjectId",
  "dateOfBirth": "Date",
  "nationality": "string",
  ...
}
```

### Update Player (Admin)
```http
PUT /api/players/:id
Authorization: Bearer <admin_token>
```

### Delete Player (Admin)
```http
DELETE /api/players/:id
Authorization: Bearer <admin_token>
```

### Vote on Player Market Value
```http
POST /api/players/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 5000000
}
```

---

## 🔄 Transfers

### Get All Transfers
```http
GET /api/transfers?page=1&limit=20&player=<id>&fromClub=<id>&toClub=<id>&season=2024-25
```

### Get Transfer by ID
```http
GET /api/transfers/:id
```

### Create Transfer (Admin)
```http
POST /api/transfers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "player": "ObjectId",
  "fromClub": "ObjectId",
  "toClub": "ObjectId",
  "transferFee": 1000000,
  "currency": "EUR",
  "transferType": "permanent|loan|free|swap",
  "transferDate": "Date",
  "season": "string"
}
```

### Update Transfer (Admin)
```http
PUT /api/transfers/:id
Authorization: Bearer <admin_token>
```

### Delete Transfer (Admin)
```http
DELETE /api/transfers/:id
Authorization: Bearer <admin_token>
```

---

## 📰 Transfer Rumors

### Get All Rumors
```http
GET /api/rumors?page=1&limit=20&player=<id>&toClub=<id>&status=active&minProbability=50
```

### Get Rumor by ID
```http
GET /api/rumors/:id
```

### Create Rumor
```http
POST /api/rumors
Authorization: Bearer <token>
Content-Type: application/json

{
  "player": "ObjectId",
  "fromClub": "ObjectId",
  "toClub": "ObjectId",
  "estimatedFee": 1000000,
  "transferType": "permanent|loan|free",
  "rumoredDate": "Date",
  "source": "string"
}
```

### Vote on Rumor Probability
```http
POST /api/rumors/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "probability": 75  // 0-100
}
```

### Update Rumor Status (Admin)
```http
PUT /api/rumors/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "active|confirmed|denied|expired",
  "confirmedTransferId": "ObjectId" (optional)
}
```

### Delete Rumor (Admin)
```http
DELETE /api/rumors/:id
Authorization: Bearer <admin_token>
```

---

## 🗳️ Votes

### Get My Votes
```http
GET /api/votes/my-votes?voteType=marketValue|rumorProbability
Authorization: Bearer <token>
```

---

## 🎮 Gamification

### Get Leaderboard
```http
GET /api/gamification/leaderboard?page=1&limit=50&sortBy=points&sortOrder=desc
```

### Get Activity Feed
```http
GET /api/gamification/activity-feed?page=1&limit=20&activityType=vote_market_value
Authorization: Bearer <token>
```

### Get User Progress
```http
GET /api/gamification/progress
Authorization: Bearer <token>
```

Response includes:
- User info
- Badges earned
- Activity statistics
- Level and points
- Points to next level

### Check and Award Badges
```http
POST /api/gamification/check-badges
Authorization: Bearer <token>
```

Automatically checks if user qualifies for any badges and awards them.

### Get All Badges
```http
GET /api/gamification/badges?category=achievement&rarity=rare&isActive=true
```

### Get My Badges
```http
GET /api/gamification/my-badges
Authorization: Bearer <token>
```

---

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Error details (in development)
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

## 🔒 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Admin-only routes require user with `role: 'admin'`.

---

## 📝 Notes

- Market values are automatically calculated from community votes
- Rumor probabilities are automatically calculated from community votes
- All activities are automatically logged
- Badges can be auto-awarded based on activity thresholds
- Points are automatically awarded for various activities

