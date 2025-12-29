/**
 * Creator Economy Types
 * Defines all types for creator profiles, content, badges, and earnings
 * Simulation Only - No real money involved
 */

/**
 * Creator titles define the tier system for creators
 * Based on reputation, content volume, and community engagement
 */
export type CreatorTitle =
  | "Rookie Creator"
  | "Active Creator"
  | "Rising Star"
  | "Pro Creator"
  | "Elite Creator"
  | "Platform Partner"
  | "Legend";

/**
 * Types of content creators can produce
 */
export type ContentType =
  | "meme"
  | "analysis"
  | "highlight"
  | "prediction"
  | "quiz"
  | "news"
  | "discussion"
  | "tutorial";

/**
 * Supported media formats for creator content
 */
export interface ContentMedia {
  type: "image" | "video" | "gif";
  url: string;
  alt?: string;
  duration?: number; // in seconds, for videos
}

/**
 * Content flags for moderation purposes
 */
export interface ContentFlag {
  reason: "spam" | "offensive" | "misinformation" | "copyright" | "other";
  reportedAt: Date;
  reportedBy: string; // userId
  resolved: boolean;
  resolvedAt?: Date;
  resolutionNote?: string;
}

/**
 * Creator content post
 * Represents user-generated content with engagement metrics
 */
export interface CreatorContent {
  _id: string;
  creatorId: string;
  username: string;
  userAvatar?: string;

  // Content details
  type: ContentType;
  title: string;
  description: string;
  media: ContentMedia[];

  // Engagement metrics
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementScore: number; // calculated metric

  // Monetization
  impressionCredits: number; // earned from views
  engagementCredits: number; // earned from likes/comments
  totalCreditsEarned: number;

  // Moderation
  flags: ContentFlag[];
  approved: boolean;

  // RTL Support
  isRTL?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Badge requirements and metadata
 * Defines what needs to be achieved to unlock a badge
 */
export interface BadgeCriteria {
  requiredValue: number;
  metric: "followers" | "posts" | "views" | "reputation" | "streak" | "credits";
  comparator: "gte" | "lte" | "eq"; // greater than or equal, less than or equal, equal
}

/**
 * Achievement badge system
 * Badges are earned by creators based on criteria
 */
export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string; // URL to badge icon/image
  color: string; // hex color for badge
  rarity: "common" | "rare" | "epic" | "legendary";
  criteria: BadgeCriteria;
  creditsReward?: number; // one-time credit bonus for earning badge
}

/**
 * Creator earnings and revenue tracking
 * Simulated revenue system with no real money
 */
export interface CreatorEarnings {
  _id: string;
  creatorId: string;

  // Revenue sources
  impressionCreditsTotal: number;
  engagementCreditsTotal: number;
  tipCreditsTotal: number; // future feature
  bonusCreditsTotal: number; // from badges, streaks, etc.

  // Monthly tracking
  monthlyEarnings: number;
  currentMonth: string; // 'YYYY-MM'
  previousMonths: Array<{
    month: string;
    earned: number;
  }>;

  // Lifetime stats
  lifetimeEarnings: number;
  averageMonthlyEarnings: number;

  // Multipliers
  engagementMultiplier: number; // 1.0 - 2.0 based on reputation
  lastMultiplierUpdate: Date;
}

/**
 * Complete creator profile
 * Represents a user who has become a content creator
 */
export interface Creator {
  _id: string;
  userId: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  coverImage?: string;

  // Creator status
  title: CreatorTitle;
  verified: boolean;

  // Community stats
  followers: number;
  following: number;
  totalViews: number;
  totalPosts: number;

  // Reputation system
  reputationScore: number; // 0-100
  strikes: number; // moderation strikes
  isSuspended: boolean;
  suspendedUntil?: Date;

  // Earnings
  credits: number; // virtual currency balance
  monthlyEarnings: number;
  lifetimeEarnings: number;
  earnings: CreatorEarnings;

  // Achievements
  badges: Badge[];
  totalBadgesEarned: number;

  // Content analytics
  engagementRate: number; // percentage
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  bestPerformingType: ContentType;

  // Streaks (bonus system)
  currentStreak: number; // consecutive days of posting
  longestStreak: number;
  lastPostDate?: Date;

  // Content
  totalContent: number;
  contentBreakdown: Record<ContentType, number>;

  // Preferences
  acceptTips: boolean;
  isRTLLayout?: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
}

/**
 * Creator summary for display in lists, cards, etc.
 * Lightweight version of Creator for performance
 */
export interface CreatorSummary {
  _id: string;
  userId: string;
  username: string;
  avatar?: string;
  title: CreatorTitle;
  verified: boolean;
  followers: number;
  totalPosts: number;
  reputationScore: number;
  engagementRate: number;
}

/**
 * Creator dashboard data
 * Aggregated metrics and insights for creator dashboard
 */
export interface CreatorDashboard {
  creator: Creator;
  thisMonthStats: {
    earnings: number;
    views: number;
    engagements: number;
    newFollowers: number;
    topContent: CreatorContent[];
  };
  allTimeStats: {
    totalEarnings: number;
    totalViews: number;
    totalEngagements: number;
    mostSuccessfulContentType: ContentType;
  };
  nextBadges: Badge[];
  recentTransactions: Array<{
    type: "earn" | "spend" | "bonus";
    amount: number;
    source: string;
    date: Date;
  }>;
}
