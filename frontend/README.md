# Foodball.online Frontend

Next.js 14 frontend application for Foodball.online - A football data platform with food-themed gamification.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see `../src/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── players/            # Players pages
│   ├── rumors/             # Rumors pages
│   ├── profile/            # Profile page
│   └── leaderboard/        # Leaderboard page
├── components/
│   ├── ui/                 # Shadcn/UI components
│   ├── layout/             # Layout components
│   └── pages/              # Page components
├── lib/
│   ├── api-client.ts       # API client
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🎨 Design System

### Colors

- **Primary**: Green (football pitch theme)
- **Food Accents**: Orange, Yellow, Red
- **Dark Mode**: First-class support

### Components

- Button (with food variant)
- Card
- Badge (with food variant)
- Modal
- Progress
- Avatar
- Input
- Skeleton

## 🔌 API Integration

The frontend uses a centralized API client (`lib/api-client.ts`) that:

- Handles JWT authentication via localStorage
- Provides typed methods for all endpoints
- Includes error handling and token management
- Automatically redirects on 401 errors

## 📄 Pages

### Home
- Trending players
- Hot transfer rumors
- Leaderboard preview

### Players
- Player list with pagination
- Search and filter by position
- Vote on market value
- Optimistic UI updates

### Rumors
- Transfer rumor list
- Probability voting (Yes/No)
- Status indicators
- Progress bars

### Profile
- User stats and level
- Badge collection
- Activity timeline
- Progress indicators

### Leaderboard
- Top users by points
- Ranked display with icons
- Pagination

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🎯 Features

- ✅ Dark-first design
- ✅ Football + food theme
- ✅ Responsive layout
- ✅ Optimistic UI updates
- ✅ Skeleton loading states
- ✅ Error handling
- ✅ JWT authentication
- ✅ Real-time voting
- ✅ Gamification UI

## 📝 Notes

- Authentication tokens are stored in localStorage
- All API calls go through the centralized client
- Components are reusable and follow Shadcn/UI patterns
- Design is playful but professional

