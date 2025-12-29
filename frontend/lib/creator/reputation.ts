/**
 * Creator Reputation & Safety Scoring
 * Calculates creator reputation based on multiple factors
 */

/**
 * Reputation scoring input
 */
export interface CreatorReputationInput {
  contentQuality: number; // 0-100
  violations: number; // moderation strikes
  consistency: number; // 0-100 (posting frequency)
  communityRating: number; // 0-100 (user feedback)
  engagementQuality: number; // 0-100 (meaningful interactions)
  followRetention: number; // 0-100 (% of followers retained)
}

/**
 * Reputation score breakdown
 */
export interface ReputationBreakdown {
  contentScore: number;
  violationScore: number;
  consistencyScore: number;
  communityScore: number;
  engagementScore: number;
  retentionScore: number;
  total: number;
}

/**
 * Calculate creator reputation score
 * Composite score from 0-100 based on multiple factors
 *
 * Weights:
 * - Content Quality: 25%
 * - Consistency: 20%
 * - Community Rating: 25%
 * - Engagement Quality: 20%
 * - Follow Retention: 10%
 * - Violations: -15% (penalty)
 *
 * @param input Reputation calculation inputs
 * @returns Total reputation score (0-100)
 *
 * @example
 * const reputation = calculateCreatorReputation({
 *   contentQuality: 85,
 *   violations: 0,
 *   consistency: 90,
 *   communityRating: 80,
 *   engagementQuality: 75,
 *   followRetention: 85
 * });
 * // Returns 82
 */
export function calculateCreatorReputation(
  input: CreatorReputationInput
): number {
  // Validate inputs
  Object.entries(input).forEach(([key, value]) => {
    if (
      [
        "contentQuality",
        "consistency",
        "communityRating",
        "engagementQuality",
        "followRetention",
      ].includes(key)
    ) {
      if (value < 0 || value > 100) {
        throw new Error(`${key} must be between 0 and 100`);
      }
    }
  });

  if (input.violations < 0) {
    throw new Error("Violations cannot be negative");
  }

  const breakdown = calculateReputationBreakdown(input);
  return Math.max(0, Math.round(breakdown.total));
}

/**
 * Calculate detailed reputation breakdown
 */
export function calculateReputationBreakdown(
  input: CreatorReputationInput
): ReputationBreakdown {
  // Component scores with weights
  const contentScore = input.contentQuality * 0.25; // 25%
  const consistencyScore = input.consistency * 0.2; // 20%
  const communityScore = input.communityRating * 0.25; // 25%
  const engagementScore = input.engagementQuality * 0.2; // 20%
  const retentionScore = input.followRetention * 0.1; // 10%

  // Violation penalty: 5 points per violation, max -15
  const violationPenalty = Math.min(input.violations * 5, 15);
  const violationScore = -violationPenalty;

  const total =
    contentScore +
    violationScore +
    consistencyScore +
    communityScore +
    engagementScore +
    retentionScore;

  return {
    contentScore: Math.round(contentScore),
    violationScore: Math.round(violationScore),
    consistencyScore: Math.round(consistencyScore),
    communityScore: Math.round(communityScore),
    engagementScore: Math.round(engagementScore),
    retentionScore: Math.round(retentionScore),
    total: Math.round(total),
  };
}

/**
 * Get reputation tier based on score
 */
export type ReputationTier =
  | "Untrusted"
  | "New Creator"
  | "Developing"
  | "Trusted"
  | "Respected"
  | "Exemplary";

export function getReputationTier(score: number): ReputationTier {
  if (score < 20) return "Untrusted";
  if (score < 35) return "New Creator";
  if (score < 50) return "Developing";
  if (score < 65) return "Trusted";
  if (score < 85) return "Respected";
  return "Exemplary";
}

/**
 * Reputation tier colors for UI
 */
export const REPUTATION_TIER_COLORS: Record<ReputationTier, string> = {
  Untrusted: "#ef4444", // red
  "New Creator": "#f97316", // orange
  Developing: "#eab308", // yellow
  Trusted: "#3b82f6", // blue
  Respected: "#8b5cf6", // purple
  Exemplary: "#ec4899", // pink
};

/**
 * Calculate earnings multiplier based on reputation
 * Higher reputation = higher earnings from same engagement
 */
export function getEarningsMultiplier(reputationScore: number): number {
  // 0 reputation: 0.5x multiplier
  // 100 reputation: 2.0x multiplier
  // Linear scaling
  return 0.5 + (reputationScore / 100) * 1.5;
}

/**
 * Safety score - inverse of reputation with violation emphasis
 */
export interface SafetyScore {
  score: number; // 0-100, higher is safer
  riskLevel: "low" | "medium" | "high";
  violations: number;
  trustLevel: "high" | "medium" | "low";
}

export function calculateSafetyScore(
  reputation: number,
  violations: number
): SafetyScore {
  // Base score from reputation
  let score = Math.max(0, reputation - violations * 10);
  score = Math.min(100, score);

  // Determine risk level
  const riskLevel =
    violations === 0
      ? ("low" as const)
      : violations <= 2
      ? ("medium" as const)
      : ("high" as const);

  // Trust level
  const trustLevel =
    score >= 70
      ? ("high" as const)
      : score >= 40
      ? ("medium" as const)
      : ("low" as const);

  return {
    score: Math.round(score),
    riskLevel,
    violations,
    trustLevel,
  };
}

/**
 * Impact of single moderation strike
 */
export function calculateStrikeImpact(currentReputation: number): number {
  // Impact varies based on current reputation
  // Higher reputation has more to lose
  const baseImpact = 5;
  const reputationMultiplier = 1 + currentReputation / 100;
  return Math.round(baseImpact * reputationMultiplier);
}

/**
 * Calculate reputation recovery time
 * How many days until strike expires (affects calculations)
 */
export function calculateStrikeExpiration(
  strikeDate: Date,
  severity: "minor" | "moderate" | "severe"
): Date {
  const daysToExpire = {
    minor: 30, // 30 days
    moderate: 60, // 60 days
    severe: 90, // 90 days
  };

  const expirationDate = new Date(strikeDate);
  expirationDate.setDate(expirationDate.getDate() + daysToExpire[severity]);
  return expirationDate;
}

/**
 * Reputation update simulation
 * Shows how actions affect reputation over time
 */
export interface ReputationProjection {
  currentScore: number;
  projectedScore: number;
  daysNeeded: number;
  actions: Array<{
    action: string;
    impact: number;
    estimatedDate: Date;
  }>;
}

/**
 * Project reputation score into future
 */
export function projectReputation(
  currentScore: number,
  targetScore: number,
  dailyImprovement: number = 0.5 // conservative improvement per day
): ReputationProjection {
  if (targetScore <= currentScore) {
    return {
      currentScore,
      projectedScore: currentScore,
      daysNeeded: 0,
      actions: [],
    };
  }

  const daysNeeded = Math.ceil((targetScore - currentScore) / dailyImprovement);
  const projectionDate = new Date();
  projectionDate.setDate(projectionDate.getDate() + daysNeeded);

  return {
    currentScore,
    projectedScore: targetScore,
    daysNeeded,
    actions: [
      {
        action: "Consistent high-quality content",
        impact: daysNeeded * dailyImprovement,
        estimatedDate: projectionDate,
      },
    ],
  };
}

/**
 * Trustworthiness score for user interactions
 * Used when showing user profiles to others
 */
export interface TrustworthinessIndicator {
  visible: boolean; // show to other users
  level: "verified" | "trusted" | "caution" | "limited";
  reason?: string;
}

export function getTrustworthinessIndicator(
  reputation: number,
  violations: number,
  verified: boolean
): TrustworthinessIndicator {
  if (reputation < 20 || violations >= 3) {
    return {
      visible: true,
      level: "limited",
      reason: "Account restricted due to moderation history",
    };
  }

  if (violations >= 1) {
    return {
      visible: true,
      level: "caution",
      reason: "Prior moderation issues on record",
    };
  }

  if (verified) {
    return {
      visible: true,
      level: "verified",
    };
  }

  if (reputation >= 70) {
    return {
      visible: true,
      level: "trusted",
    };
  }

  return {
    visible: false,
    level: "limited",
  };
}
