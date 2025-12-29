/**
 * Monetization & Credits System Types
 * Simulation Only - Virtual credits, no real money involved
 * Tracks all credit transactions and revenue
 */

/**
 * Types of credit transactions
 */
export type TransactionType = 'earn' | 'spend' | 'refund' | 'bonus' | 'adjustment';

/**
 * Sources where credits can be earned
 */
export type TransactionSource =
  | 'content_impression' // views on creator content
  | 'content_engagement' // likes, comments on content
  | 'prediction_win' // winning a prediction
  | 'prediction_streak' // bonus for streak
  | 'badge_unlock' // one-time badge reward
  | 'league_reward' // league competition reward
  | 'daily_challenge' // daily engagement bonus
  | 'referral' // (future phase)
  | 'admin_bonus' // platform reward
  | 'refund'; // refund of previous transaction

/**
 * Sources where credits can be spent
 */
export type SpendSource =
  | 'prediction_wager' // place a prediction
  | 'tips' // send tips (disabled for now)
  | 'premium_feature' // access premium content (future)
  | 'bundle_purchase'; // purchase special bundles (future)

/**
 * Status of a credit transaction
 */
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

/**
 * Single credit transaction record
 * Used for all money-like movements in the system
 */
export interface CreditTransaction {
  _id: string;
  userId: string;

  // Transaction details
  type: TransactionType;
  amount: number; // always positive, type indicates direction
  newBalance: number; // balance after transaction

  // Source/purpose
  source: TransactionSource | SpendSource;
  description: string;
  relatedId?: string; // contentId, predictionId, matchId, etc.
  relatedType?: 'content' | 'prediction' | 'match' | 'badge' | 'league';

  // Status
  status: TransactionStatus;

  // Metadata
  metadata?: Record<string, any>; // flexible data for different transaction types

  // Timestamps
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Monthly revenue summary for a creator
 */
export interface MonthlyRevenue {
  month: string; // 'YYYY-MM'
  year: number;

  // Revenue breakdown by source
  bySource: {
    impressions: number;
    engagement: number;
    bonuses: number;
    other: number;
    total: number;
  };

  // Stats
  contentCount: number;
  totalViews: number;
  totalEngagements: number;
  avgPerPost: number;

  // Multiplier applied
  multiplier: number;
  multiplierReason?: string;
}

/**
 * Comprehensive revenue simulation dashboard
 * Shows all financial data for a creator or the platform
 */
export interface RevenueSimulation {
  // Creator/User info
  userId: string;
  username: string;
  creatorId?: string;

  // Current state
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  netEarnings: number;

  // Monthly breakdown
  thisMonth: MonthlyRevenue;
  lastMonth?: MonthlyRevenue;
  allTimeMonthly: MonthlyRevenue[];

  // Sources analysis
  earningSources: Array<{
    source: TransactionSource;
    total: number;
    percentage: number;
    transactions: number;
  }>;

  spendingSources: Array<{
    source: SpendSource;
    total: number;
    percentage: number;
    transactions: number;
  }>;

  // Growth metrics
  monthOverMonthGrowth: number; // percentage
  averageMonthlyEarnings: number;
  projectedYearlyEarnings: number;

  // Transaction history
  recentTransactions: CreditTransaction[];

  // Predictions performance (if applicable)
  predictionStats?: {
    correctPredictions: number;
    totalPredictions: number;
    winRate: number;
    totalWinnings: number;
    totalLosses: number;
  };

  // Time period covered
  period: {
    startDate: Date;
    endDate: Date;
  };

  generatedAt: Date;
}

/**
 * Credit wallet - user's account balance and settings
 */
export interface CreditWallet {
  _id: string;
  userId: string;

  // Balance
  balance: number;
  lastUpdated: Date;

  // Lifetime stats
  totalEarned: number;
  totalSpent: number;

  // Pending amounts
  pendingCredits: number; // from content not yet paid out
  lockedCredits: number; // in active wagers

  // Account settings
  autoCollectRewards: boolean;
  notifyOnEarn: boolean;

  // Account status
  isFrozen: boolean;
  freezeReason?: string;
  freezeUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tip transaction (feature disabled for MVP)
 * Prepared structure for future implementation
 */
export interface TipTransaction {
  _id: string;
  senderId: string;
  senderUsername: string;
  senderAvatar?: string;

  recipientId: string;
  recipientUsername: string;
  recipientAvatar?: string;

  amount: number;
  message?: string;

  // Content being tipped
  contentId?: string;
  contentType?: string;

  status: 'pending' | 'completed' | 'refunded' | 'disputed';

  // Timestamps
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Earnings chart data
 * For dashboard visualizations
 */
export interface EarningsChartData {
  date: string; // 'YYYY-MM-DD' or 'YYYY-MM'
  earnings: number;
  source: 'impressions' | 'engagement' | 'bonuses' | 'predictions' | 'total';
}

/**
 * Credit system constants
 * Base rates for earning credits
 */
export const CREDIT_CONSTANTS = {
  // Content earnings (per action)
  IMPRESSION_CREDITS: 0.01, // per view
  LIKE_CREDIT: 0.1,
  COMMENT_CREDIT: 0.25,
  SHARE_CREDIT: 0.5,

  // Prediction system
  MIN_WAGER: 10,
  MAX_WAGER: 1000,

  // Badges
  BADGE_REWARD_CREDIT: 50,

  // Streak bonus
  STREAK_BONUS_MULTIPLIER: 1.1, // 10% per streak day

  // Prediction multipliers
  PREDICTION_MULTIPLIERS: {
    low: 1.5,
    medium: 2.0,
    high: 3.0,
  },

  // Engagement multipliers (based on reputation)
  REPUTATION_MULTIPLIERS: {
    0: 1.0, // 0-20: No boost
    20: 1.1,
    40: 1.2,
    60: 1.3,
    80: 1.5,
    100: 2.0,
  },
} as const;

/**
 * Summary of all monetization for admin/analytics
 */
export interface MonetizationReport {
  period: {
    startDate: Date;
    endDate: Date;
  };

  // Platform totals
  totalCreditsEarned: number;
  totalCreditsSpent: number;
  netCreditsInCirculation: number;

  // By source
  earningSources: Record<TransactionSource, number>;
  spendingSources: Record<SpendSource, number>;

  // User distribution
  totalActiveUsers: number;
  totalCreators: number;
  averageUserBalance: number;
  averageCreatorEarnings: number;

  // Top earners
  topEarners: Array<{
    userId: string;
    username: string;
    totalEarned: number;
    month: string;
  }>;

  // Trends
  dailyEarnings: EarningsChartData[];
  userGrowth: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
  }>;

  generatedAt: Date;
}
