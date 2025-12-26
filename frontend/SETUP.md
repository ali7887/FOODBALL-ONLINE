# Foodball Frontend Setup Guide

## Quick Start

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
```bash
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
Navigate to [http://localhost:3001](http://localhost:3001)

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page
│   ├── players/
│   │   └── page.tsx            # Players listing page
│   ├── rumors/
│   │   └── page.tsx            # Rumors listing page
│   ├── profile/
│   │   └── page.tsx            # User profile page
│   ├── leaderboard/
│   │   └── page.tsx            # Leaderboard page
│   ├── login/
│   │   └── page.tsx            # Login/Register page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                      # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── progress.tsx
│   │   ├── avatar.tsx
│   │   ├── input.tsx
│   │   └── skeleton.tsx
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Footer
│   └── pages/                   # Page components
│       ├── HomePage.tsx
│       ├── PlayersPage.tsx
│       ├── RumorsPage.tsx
│       ├── ProfilePage.tsx
│       ├── LeaderboardPage.tsx
│       └── LoginPage.tsx
├── lib/
│   ├── api-client.ts           # Centralized API client
│   └── utils.ts                # Utility functions
└── public/                      # Static assets
```

## Features Implemented

### ✅ Pages
- **Home**: Trending players, hot rumors, leaderboard preview
- **Players**: List with pagination, search, filters, voting
- **Rumors**: List with probability voting, status indicators
- **Profile**: User stats, badges, activity timeline
- **Leaderboard**: Top users ranked by points
- **Login/Register**: Authentication forms

### ✅ Components
- Button (with food variant)
- Card
- Badge (with food variant)
- Modal
- Progress
- Avatar
- Input
- Skeleton (loading states)

### ✅ API Integration
- Centralized API client with Axios
- JWT authentication via localStorage
- Error handling
- Automatic token management

### ✅ UI/UX
- Dark-first design
- Football + food theme
- Responsive layout
- Optimistic UI updates
- Skeleton loading states
- Micro-interactions

## Design Tokens

### Colors
- **Primary**: Green (football pitch) - `hsl(142 76% 36%)`
- **Food Orange**: `#ff6b35`
- **Food Yellow**: `#ffc857`
- **Food Red**: `#e63946`
- **Background**: Dark theme by default

### Typography
- Font: Inter (from Google Fonts)
- Headings: Bold, gradient text for hero
- Body: Regular weight, muted colors for secondary text

## API Endpoints Used

- `GET /api/players` - List players
- `POST /api/players/:id/vote` - Vote on market value
- `GET /api/rumors` - List rumors
- `POST /api/rumors/:id/vote` - Vote on rumor probability
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/progress` - Get user progress
- `GET /api/gamification/activity-feed` - Get activity feed
- `POST /api/gamification/check-badges` - Check for new badges
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

## Notes

- Authentication tokens stored in localStorage
- All API calls go through `api-client.ts`
- Components follow Shadcn/UI patterns
- Design is playful but professional
- Optimistic updates for better UX

## Next Steps

1. Add authentication state management (Context/Redux)
2. Add protected route middleware
3. Add error boundaries
4. Add toast notifications
5. Add image optimization
6. Add SEO metadata
7. Add analytics

