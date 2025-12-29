/**
 * Prediction & Betting Types
 * Defines types for prediction games, leagues, streaks, and match data
 * Simulation Only - Virtual credits, no real money
 */

/**
 * Match outcomes in football predictions
 */
export type MatchOutcome = "home_win" | "draw" | "away_win";

/**
 * Confidence levels for predictions
 * Higher confidence = higher potential payout but higher risk
 */
export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * Status of a prediction
 */
export type PredictionStatus =
  | "pending"
  | "won"
  | "lost"
  | "refunded"
  | "cancelled";

/**
 * Match data available for predictions
 * Uses generic team names (no real clubs)
 */
export interface MatchForPrediction {
  _id: string;
  matchId: string;

  // Teams (generic names)
  homeTeam: {
    name: string; // e.g., "Team A"
    id: string;
  };
  awayTeam: {
    name: string; // e.g., "Team B"
    id: string;
  };

  // Match details
  matchDate: Date;
  season: string; // e.g., "2025-2026"
  league: string; // generic league name

  // Prediction availability
  openForPrediction: boolean;
  predictionDeadline: Date;

  // Match status
  status: "scheduled" | "in_progress" | "completed";
  result?: MatchOutcome;
  finalScore?: {
    home: number;
    away: number;
  };

  // Prediction stats
  totalPredictions: number;
  predictionBreakdown?: {
    home_win: number;
    draw: number;
    away_win: number;
  };
}

/**
 * Confidence level multipliers
 * Affects odds and potential returns
 */
export const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  low: 1.5, // Conservative bet, lower payout
  medium: 2.0, // Balanced risk/reward
  high: 3.0, // Aggressive bet, higher payout but higher risk
};

/**
 * User prediction on a match
 */
export interface Prediction {
  _id: string;
  userId: string;
  matchId: string;

  // Prediction details
  outcome: MatchOutcome;
  confidenceLevel: ConfidenceLevel;
  coinsWagered: number;

  // Odds and potential return
  odds: number; // calculated based on confidence
  potentialReturn: number;

  // Resolution
  status: PredictionStatus;
  actualOutcome?: MatchOutcome;
  coinsWon?: number;
  multiplierApplied?: number;

  // Social features
  isPublic: boolean; // can be shared/viewed by others
  description?: string; // user's reasoning
  likes: number;
  comments: number;
  shares: number;

  // League participation
  leagueIds: string[];

  // RTL Support
  isRTL?: boolean;

  // Timestamps
  createdAt: Date;
  resolvedAt?: Date;
  updatedAt: Date;
}

/**
 * Lightweight prediction summary for lists/feeds
 */
export interface PredictionSummary {
  _id: string;
  userId: string;
  username: string;
  userAvatar?: string;

  homeTeam: string;
  awayTeam: string;

  outcome: MatchOutcome;
  confidenceLevel: ConfidenceLevel;
  coinsWagered: number;
  potentialReturn: number;

  status: PredictionStatus;
  coinsWon?: number;

  likes: number;
  isPublic: boolean;
  createdAt: Date;
}

/**
 * Prediction streak tracking
 * Bonus system for consecutive correct predictions
 */
export interface PredictionStreak {
  _id: string;
  userId: string;

  // Current streak
  currentStreak: number;
  longestStreak: number;

  // Streak details
  lastCorrectPredictionDate: Date;
  streakStartDate: Date;

  // Bonuses
  streakBonus: number; // additional credits earned
  currentStreakMultiplier: number; // affects next prediction payout

  // Breakdown by streak length
  stats: Array<{
    streakLength: number;
    count: number;
    totalCreditsEarned: number;
  }>;

  updatedAt: Date;
}

/**
 * Member stats within a prediction league
 */
export interface LeagueMember {
  _id: string;
  leagueId: string;
  userId: string;
  username: string;
  userAvatar?: string;

  // Stats
  totalPredictions: number;
  correctPredictions: number;
  winRate: number; // percentage

  // Points
  points: number;
  rank: number;

  // Earnings
  coinsEarned: number;

  joinedAt: Date;
}

/**
 * Prediction league - group of users competing
 */
export interface PredictionLeague {
  _id: string;
  name: string;
  description?: string;

  // League type
  type: "private" | "public";
  creatorId: string;

  // Season info
  season: string; // e.g., "2025-2026"
  startDate: Date;
  endDate?: Date;

  // Rules
  minWagerAmount: number;
  maxWagerAmount: number;
  matchesIncluded: string[]; // matchIds

  // Members
  members: LeagueMember[];
  totalMembers: number;
  maxMembers?: number;

  // Access
  joinCode?: string; // for private leagues
  isOpen: boolean;

  // Leaderboard
  leaderboard: LeagueMember[];

  // Rankings/rewards
  rewards?: {
    firstPlace: number; // credits
    secondPlace: number;
    thirdPlace: number;
  };

  isRTL?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Prediction game state
 * Dashboard and analytics for prediction system
 */
export interface PredictionGameState {
  userId: string;
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;

  // Current holdings
  creditsAvailable: number;
  creditsWagered: number;
  expectedReturn: number; // if all pending predictions win

  // Streaks
  currentStreak: number;
  longestStreak: number;
  streakBonus: number;

  // League participation
  activeLeagues: PredictionLeague[];
  leagueRankings: Array<{
    leagueName: string;
    rank: number;
    points: number;
  }>;

  // Upcoming matches
  upcomingMatches: MatchForPrediction[];

  // Recent activity
  recentPredictions: Prediction[];
}

/**
 * Prediction analytics for user profile
 */
export interface PredictionAnalytics {
  userId: string;
  allTimeStats: {
    totalPredictions: number;
    correctPredictions: number;
    winRate: number;
    totalCreditsEarned: number;
    totalCreditsLost: number;
    netProfitLoss: number;
  };
  byConfidence: Record<
    ConfidenceLevel,
    {
      count: number;
      winRate: number;
      avgReturn: number;
    }
  >;
  byOutcome: Record<
    MatchOutcome,
    {
      predictions: number;
      correct: number;
      winRate: number;
    }
  >;
  monthlyTrend: Array<{
    month: string;
    predictions: number;
    winRate: number;
    creditsEarned: number;
  }>;
}
