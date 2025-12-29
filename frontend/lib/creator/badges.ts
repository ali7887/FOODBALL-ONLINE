/**
 * Creator Badge System
 * Defines all achievements and badge unlock logic
 */

import type { Badge } from "@/types/creator";

/**
 * Badge colors by rarity
 */
const BADGE_COLORS: Record<Badge["rarity"], string> = {
  common: "#6B7280", // gray
  rare: "#3B82F6", // blue
  epic: "#8B5CF6", // purple
  legendary: "#EC4899", // pink
};

/**
 * Extended badge with additional metadata
 */
export interface BadgeDefinition extends Badge {
  category:
    | "achievement" // First post, milestones
    | "skill" // Prediction accuracy, engagement
    | "consistency" // Streaks, regular posting
    | "community" // Follower milestones, influence
    | "creator" // Content type specific
    | "special"; // Limited time, seasonal
  unlockedAt?: Date;
}

/**
 * User stats used for badge unlock checks
 */
export interface UserBadgeStats {
  userId: string;
  totalPosts: number;
  followers: number;
  totalViews: number;
  avgEngagementRate: number;
  currentStreak: number;
  bestPost: { views: number; engagement: number };
  predictionStats: {
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number; // 0-100
  };
  reputation: number; // 0-100
  violations: number;
}

/**
 * All available badges in the system
 * Each badge represents an achievement unlock
 */
export const ALL_BADGES: BadgeDefinition[] = [
  // Achievement Badges
  {
    _id: "first_post",
    name: "First Post",
    description: "Create your first piece of content",
    icon: "🎬",
    rarity: "common",
    color: BADGE_COLORS.common,
    category: "achievement",
    criteria: {
      metric: "posts",
      requiredValue: 1,
      comparator: "gte",
    },
  },
  {
    _id: "content_creator",
    name: "Content Creator",
    description: "Create 5 pieces of content",
    icon: "✍️",
    rarity: "common",
    color: BADGE_COLORS.common,
    category: "achievement",
    criteria: {
      metric: "posts",
      requiredValue: 5,
      comparator: "gte",
    },
  },
  {
    _id: "prolific",
    name: "Prolific",
    description: "Create 50 pieces of content",
    icon: "📚",
    rarity: "rare",
    color: BADGE_COLORS.rare,
    category: "achievement",
    criteria: {
      metric: "posts",
      requiredValue: 50,
      comparator: "gte",
    },
  },

  // Engagement Badges
  {
    _id: "popular",
    name: "Popular",
    description: "Get 10,000 total views",
    icon: "👁️",
    rarity: "rare",
    color: BADGE_COLORS.rare,
    category: "community",
    criteria: {
      metric: "views",
      requiredValue: 10000,
      comparator: "gte",
    },
  },
  {
    _id: "viral",
    name: "Viral",
    description: "Get 100,000 total views",
    icon: "🚀",
    rarity: "epic",
    color: BADGE_COLORS.epic,
    category: "community",
    criteria: {
      metric: "views",
      requiredValue: 100000,
      comparator: "gte",
    },
  },

  // Follower Badges
  {
    _id: "influencer",
    name: "Influencer",
    description: "Reach 1,000 followers",
    icon: "⭐",
    rarity: "rare",
    color: BADGE_COLORS.rare,
    category: "community",
    criteria: {
      metric: "followers",
      requiredValue: 1000,
      comparator: "gte",
    },
  },
  {
    _id: "celebrity",
    name: "Celebrity",
    description: "Reach 10,000 followers",
    icon: "👑",
    rarity: "epic",
    color: BADGE_COLORS.epic,
    category: "community",
    criteria: {
      metric: "followers",
      requiredValue: 10000,
      comparator: "gte",
    },
  },

  // Streak Badges
  {
    _id: "on_fire",
    name: "On Fire",
    description: "Post for 7 consecutive days",
    icon: "🔥",
    rarity: "common",
    color: BADGE_COLORS.common,
    category: "consistency",
    criteria: {
      metric: "streak",
      requiredValue: 7,
      comparator: "gte",
    },
  },
  {
    _id: "unstoppable",
    name: "Unstoppable",
    description: "Post for 30 consecutive days",
    icon: "💪",
    rarity: "epic",
    color: BADGE_COLORS.epic,
    category: "consistency",
    criteria: {
      metric: "streak",
      requiredValue: 30,
      comparator: "gte",
    },
  },

  // Reputation Badges
  {
    _id: "trusted",
    name: "Trusted Creator",
    description: "Reach 50 reputation score with zero violations",
    icon: "✅",
    rarity: "rare",
    color: BADGE_COLORS.rare,
    category: "skill",
    criteria: {
      metric: "reputation",
      requiredValue: 50,
      comparator: "gte",
    },
  },
  {
    _id: "exemplary",
    name: "Exemplary",
    description: "Reach 80+ reputation with perfect moderation record",
    icon: "🌟",
    rarity: "legendary",
    color: BADGE_COLORS.legendary,
    category: "skill",
    criteria: {
      metric: "reputation",
      requiredValue: 80,
      comparator: "gte",
    },
  },

  // Prediction Badges
  {
    _id: "oracle",
    name: "The Oracle",
    description: "Achieve 75%+ prediction accuracy",
    icon: "🔮",
    rarity: "epic",
    color: BADGE_COLORS.epic,
    category: "skill",
    criteria: {
      metric: "reputation", // Using reputation as placeholder for custom logic
      requiredValue: 75,
      comparator: "gte",
    },
  },
  {
    _id: "prophet",
    name: "The Prophet",
    description: "Achieve 90%+ prediction accuracy over 30+ predictions",
    icon: "🎯",
    rarity: "legendary",
    color: BADGE_COLORS.legendary,
    category: "skill",
    criteria: {
      metric: "reputation",
      requiredValue: 90,
      comparator: "gte",
    },
  },

  // Engagement Rate Badges
  {
    _id: "engaging",
    name: "Engaging",
    description: "Maintain 10%+ engagement rate",
    icon: "💬",
    rarity: "rare",
    color: BADGE_COLORS.rare,
    category: "community",
    criteria: {
      metric: "followers", // Custom logic in checker
      requiredValue: 10,
      comparator: "gte",
    },
  },
];

/**
 * Check if a user meets criteria for a specific badge
 */
export function checkBadgeCriteria(
  stats: UserBadgeStats,
  badgeId: string
): boolean {
  const badge = ALL_BADGES.find((b) => b._id === badgeId);
  if (!badge) return false;

  const { metric, requiredValue, comparator } = badge.criteria;

  // Custom badge logic (metric not in stats directly)
  if (badgeId === "oracle" || badgeId === "prophet") {
    return comparePredictionAccuracy(
      stats.predictionStats.accuracy,
      requiredValue,
      comparator
    );
  }

  if (badgeId === "on_fire" || badgeId === "unstoppable") {
    return compareValues(stats.currentStreak, requiredValue, comparator);
  }

  if (badgeId === "engaging") {
    return compareValues(stats.avgEngagementRate, requiredValue, comparator);
  }

  if (badgeId === "trusted" || badgeId === "exemplary") {
    // Must have zero violations in addition to reputation
    const meetsReputation = compareValues(
      stats.reputation,
      requiredValue,
      comparator
    );
    const zeroViolations = stats.violations === 0;
    return meetsReputation && zeroViolations;
  }

  // Standard metric checks
  switch (metric) {
    case "posts":
      return compareValues(stats.totalPosts, requiredValue, comparator);
    case "followers":
      return compareValues(stats.followers, requiredValue, comparator);
    case "views":
      return compareValues(stats.totalViews, requiredValue, comparator);
    case "streak":
      return compareValues(stats.currentStreak, requiredValue, comparator);
    case "reputation":
      return compareValues(stats.reputation, requiredValue, comparator);
    default:
      return false;
  }
}

/**
 * Helper function to compare values
 */
function compareValues(
  actual: number,
  required: number,
  comparator: "gte" | "lte" | "eq"
): boolean {
  switch (comparator) {
    case "gte":
      return actual >= required;
    case "lte":
      return actual <= required;
    case "eq":
      return actual === required;
    default:
      return false;
  }
}

/**
 * Compare prediction accuracy
 */
function comparePredictionAccuracy(
  accuracy: number,
  required: number,
  comparator: "gte" | "lte" | "eq"
): boolean {
  return compareValues(accuracy, required, comparator);
}

/**
 * Get all unlocked badges for a user
 * In real implementation, would query database
 */
export function getUnlockedBadges(stats: UserBadgeStats): BadgeDefinition[] {
  return ALL_BADGES.filter((badge) => checkBadgeCriteria(stats, badge._id)).map(
    (badge) => ({
      ...badge,
      unlockedAt: new Date(),
    })
  );
}

/**
 * Get next badges user is close to unlocking
 * Shows progress towards upcoming achievements
 */
export function getNextBadges(
  stats: UserBadgeStats,
  limit: number = 3
): Array<{
  badge: BadgeDefinition;
  progress: number; // 0-100
  remaining: number;
}> {
  const unlockedBadgeIds = new Set(getUnlockedBadges(stats).map((b) => b._id));

  const nextBadges = ALL_BADGES.filter((b) => !unlockedBadgeIds.has(b._id))
    .map((badge) => {
      const { metric, requiredValue } = badge.criteria;
      let current = 0;

      switch (metric) {
        case "posts":
          current = stats.totalPosts;
          break;
        case "followers":
          current = stats.followers;
          break;
        case "views":
          current = stats.totalViews;
          break;
        case "streak":
          current = stats.currentStreak;
          break;
        case "reputation":
          current = stats.reputation;
          break;
      }

      const progress = Math.min((current / requiredValue) * 100, 100);
      const remaining = Math.max(requiredValue - current, 0);

      return { badge, progress, remaining };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, limit);

  return nextBadges;
}

/**
 * Calculate badge reward (one-time credit bonus)
 */
export function getBadgeReward(badgeId: string): number {
  const badge = ALL_BADGES.find((b) => b._id === badgeId);
  if (!badge) return 0;

  const rarityRewards: Record<Badge["rarity"], number> = {
    common: 10,
    rare: 50,
    epic: 100,
    legendary: 500,
  };

  return rarityRewards[badge.rarity];
}

/**
 * Get badge by ID
 */
export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b._id === badgeId);
}

/**
 * Get badges by category
 */
export function getBadgesByCategory(
  category: BadgeDefinition["category"]
): BadgeDefinition[] {
  return ALL_BADGES.filter((b) => b.category === category);
}
