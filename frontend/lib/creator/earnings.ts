/**
 * Creator Earnings Calculation
 * Computes credits earned from content engagement
 * Simulation Only - Virtual credits
 */

/**
 * Input metrics for earnings calculation
 */
export interface EarningsInput {
  views: number;
  likes: number;
  saves: number;
  comments: number;
  contentQuality: number; // 0-100
}

/**
 * Earning rates (credits per action)
 * These are the base rates before quality multipliers
 */
export const EARNING_RATES = {
  VIEW_RATE: 0.1, // 0.1 credits per view
  LIKE_RATE: 2, // 2 credits per like
  SAVE_RATE: 5, // 5 credits per save
  COMMENT_RATE: 3, // 3 credits per comment
} as const;

/**
 * Calculate credits earned from content engagement
 * Quality multiplier ranges from 0.5x (low quality) to 2x (high quality)
 *
 * @param input Engagement metrics and content quality
 * @returns Total credits earned (rounded down)
 *
 * @example
 * const earnings = calculateContentEarnings({
 *   views: 1000,
 *   likes: 50,
 *   saves: 10,
 *   comments: 25,
 *   contentQuality: 85
 * });
 * // Returns approximately 300+ credits
 */
export function calculateContentEarnings(input: EarningsInput): number {
  // Validate inputs
  if (input.contentQuality < 0 || input.contentQuality > 100) {
    throw new Error("Content quality must be between 0 and 100");
  }

  const baseEarnings =
    input.views * EARNING_RATES.VIEW_RATE +
    input.likes * EARNING_RATES.LIKE_RATE +
    input.saves * EARNING_RATES.SAVE_RATE +
    input.comments * EARNING_RATES.COMMENT_RATE;

  // Quality multiplier: 0.5x (0% quality) to 2x (100% quality)
  const qualityMultiplier = 0.5 + (input.contentQuality / 100) * 1.5;

  return Math.floor(baseEarnings * qualityMultiplier);
}

/**
 * Breakdown of earnings by source
 * Useful for analytics and transparency
 */
export interface EarningsBreakdown {
  viewEarnings: number;
  likeEarnings: number;
  saveEarnings: number;
  commentEarnings: number;
  baseTotal: number;
  qualityMultiplier: number;
  finalTotal: number;
}

/**
 * Calculate earnings with detailed breakdown
 *
 * @param input Engagement metrics and content quality
 * @returns Breakdown of earnings by source
 */
export function calculateContentEarningsWithBreakdown(
  input: EarningsInput
): EarningsBreakdown {
  if (input.contentQuality < 0 || input.contentQuality > 100) {
    throw new Error("Content quality must be between 0 and 100");
  }

  const viewEarnings = input.views * EARNING_RATES.VIEW_RATE;
  const likeEarnings = input.likes * EARNING_RATES.LIKE_RATE;
  const saveEarnings = input.saves * EARNING_RATES.SAVE_RATE;
  const commentEarnings = input.comments * EARNING_RATES.COMMENT_RATE;

  const baseTotal =
    viewEarnings + likeEarnings + saveEarnings + commentEarnings;
  const qualityMultiplier = 0.5 + (input.contentQuality / 100) * 1.5;
  const finalTotal = Math.floor(baseTotal * qualityMultiplier);

  return {
    viewEarnings: Math.floor(viewEarnings),
    likeEarnings: Math.floor(likeEarnings),
    saveEarnings: Math.floor(saveEarnings),
    commentEarnings: Math.floor(commentEarnings),
    baseTotal: Math.floor(baseTotal),
    qualityMultiplier,
    finalTotal,
  };
}

/**
 * Calculate impressions bonus
 * Based on number of unique views
 */
export function calculateImpressionBonus(
  uniqueViews: number,
  reputationScore: number
): number {
  // Base: 0.05 credits per unique view
  const baseBonus = uniqueViews * 0.05;

  // Reputation multiplier: 1.0 (0 rep) to 2.0 (100 rep)
  const repMultiplier = 1.0 + (reputationScore / 100) * 1.0;

  return Math.floor(baseBonus * repMultiplier);
}

/**
 * Calculate engagement bonus
 * Extra credits for high engagement rate
 */
export function calculateEngagementBonus(
  engagementRate: number, // 0-100 (percentage)
  postCount: number
): number {
  if (engagementRate < 0 || engagementRate > 100) {
    throw new Error("Engagement rate must be between 0 and 100");
  }

  // Bonus threshold: 5% engagement rate
  if (engagementRate < 5) return 0;

  const excessRate = engagementRate - 5;
  const bonus = excessRate * 2 * postCount; // 2 credits per 1% excess per post

  return Math.floor(bonus);
}

/**
 * Calculate monthly earnings estimate
 * Useful for dashboards
 */
export interface MonthlyEarningsEstimate {
  baseEarnings: number;
  bonuses: number;
  penalties: number;
  total: number;
}

export function estimateMonthlyEarnings(
  dailyAvgEarnings: number,
  daysPosted: number,
  suspensionDays?: number
): MonthlyEarningsEstimate {
  const baseEarnings = dailyAvgEarnings * daysPosted;
  const suspensionPenalty = suspensionDays
    ? dailyAvgEarnings * suspensionDays * 0.5
    : 0;

  return {
    baseEarnings: Math.floor(baseEarnings),
    bonuses: 0, // Will be added by other functions
    penalties: Math.floor(suspensionPenalty),
    total: Math.floor(baseEarnings - suspensionPenalty),
  };
}
