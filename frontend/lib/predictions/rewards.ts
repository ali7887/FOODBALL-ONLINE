/**
 * Prediction Rewards Calculation
 * Computes winnings and losses from prediction bets
 * Simulation Only - Virtual credits
 */

import type { ConfidenceLevel, MatchOutcome } from "@/types/predictions";

/**
 * Prediction reward calculation input
 */
export interface PredictionRewardInput {
  coinsWagered: number;
  confidence: ConfidenceLevel;
  outcome: "correct" | "wrong";
  streak: number; // current winning streak
}

/**
 * Confidence level multipliers
 * Affects payout odds
 */
export const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  low: 1.5, // Conservative, lower payout
  medium: 2.0, // Balanced
  high: 3.0, // Aggressive, higher payout
} as const;

/**
 * Calculate prediction reward/loss
 * Incorrect predictions lose the wagered amount.
 * Correct predictions win based on confidence level and streak bonus.
 *
 * @param coinsWagered Amount wagered
 * @param confidence Confidence level of prediction
 * @param outcome Whether prediction was correct or wrong
 * @param streak Current winning streak (0-based)
 * @returns Reward amount (positive for wins, negative for losses)
 *
 * @example
 * const reward = calculatePredictionReward(100, 'high', 'correct', 5);
 * // Returns 375 (100 * 3.0 * 1.25 streak bonus)
 */
export function calculatePredictionReward(
  coinsWagered: number,
  confidence: ConfidenceLevel,
  outcome: "correct" | "wrong",
  streak: number = 0
): number {
  if (coinsWagered <= 0) {
    throw new Error("Coins wagered must be greater than 0");
  }

  if (streak < 0) {
    throw new Error("Streak cannot be negative");
  }

  // Wrong predictions lose the full amount
  if (outcome === "wrong") {
    return -coinsWagered;
  }

  // Correct prediction: base reward
  const baseReward = coinsWagered * CONFIDENCE_MULTIPLIERS[confidence];

  // Streak bonus: 10% per streak level, capped at 100% (2x multiplier)
  const streakBonus = Math.min(streak * 0.1, 1.0);
  const totalReward = baseReward * (1 + streakBonus);

  return Math.floor(totalReward);
}

/**
 * Detailed prediction reward breakdown
 */
export interface PredictionRewardBreakdown {
  wagered: number;
  baseMultiplier: number;
  baseReward: number;
  streakBonus: number;
  streakBonusAmount: number;
  totalReward: number;
  profitLoss: number;
}

/**
 * Calculate prediction reward with detailed breakdown
 */
export function calculatePredictionRewardWithBreakdown(
  coinsWagered: number,
  confidence: ConfidenceLevel,
  outcome: "correct" | "wrong",
  streak: number = 0
): PredictionRewardBreakdown {
  if (coinsWagered <= 0) {
    throw new Error("Coins wagered must be greater than 0");
  }

  if (outcome === "wrong") {
    return {
      wagered: coinsWagered,
      baseMultiplier: CONFIDENCE_MULTIPLIERS[confidence],
      baseReward: 0,
      streakBonus: 0,
      streakBonusAmount: 0,
      totalReward: 0,
      profitLoss: -coinsWagered,
    };
  }

  const baseMultiplier = CONFIDENCE_MULTIPLIERS[confidence];
  const baseReward = coinsWagered * baseMultiplier;
  const streakBonusPercent = Math.min(streak * 0.1, 1.0);
  const streakBonusAmount = baseReward * streakBonusPercent;
  const totalReward = baseReward + streakBonusAmount;

  return {
    wagered: coinsWagered,
    baseMultiplier,
    baseReward: Math.floor(baseReward),
    streakBonus: streakBonusPercent,
    streakBonusAmount: Math.floor(streakBonusAmount),
    totalReward: Math.floor(totalReward),
    profitLoss: Math.floor(totalReward - coinsWagered),
  };
}

/**
 * Calculate odds for a prediction
 * Used for display on prediction cards
 */
export function calculatePredictionOdds(confidence: ConfidenceLevel): string {
  const multiplier = CONFIDENCE_MULTIPLIERS[confidence];
  return `${multiplier.toFixed(2)}x`;
}

/**
 * Calculate potential return
 */
export function calculatePotentialReturn(
  wagered: number,
  confidence: ConfidenceLevel,
  streak: number = 0
): number {
  const baseReward = wagered * CONFIDENCE_MULTIPLIERS[confidence];
  const streakBonus = Math.min(streak * 0.1, 1.0);
  return Math.floor(baseReward * (1 + streakBonus));
}

/**
 * League reward calculation
 * Distributes rewards to top performers in a league
 */
export interface LeagueRewardDistribution {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  total: number;
}

/**
 * Calculate league rewards pool
 * Total is distributed among top 3 players
 */
export function calculateLeagueRewards(
  totalPoolCredits: number
): LeagueRewardDistribution {
  // Typical distribution: 50% / 30% / 20%
  const firstPlace = Math.floor(totalPoolCredits * 0.5);
  const secondPlace = Math.floor(totalPoolCredits * 0.3);
  const thirdPlace = Math.floor(totalPoolCredits * 0.2);

  return {
    firstPlace,
    secondPlace,
    thirdPlace,
    total: firstPlace + secondPlace + thirdPlace,
  };
}

/**
 * Streak bonus calculation
 * Additional bonus for maintaining winning streak
 */
export function calculateStreakBonus(streakLength: number): number {
  if (streakLength <= 0) return 0;

  // Bonus accelerates with streak length
  // 1 streak: 10 credits, 5 streaks: 125 credits, 10 streaks: 500 credits
  return Math.floor(10 * Math.pow(streakLength, 1.5));
}

/**
 * Calculate win rate (for analytics)
 */
export function calculateWinRate(
  correctPredictions: number,
  totalPredictions: number
): number {
  if (totalPredictions === 0) return 0;
  return Math.round((correctPredictions / totalPredictions) * 100 * 10) / 10; // 1 decimal
}

/**
 * Expected value calculation
 * Useful for showing risk/reward metrics
 */
export function calculateExpectedValue(
  winProbability: number, // 0-1
  winAmount: number,
  lossAmount: number
): number {
  if (winProbability < 0 || winProbability > 1) {
    throw new Error("Win probability must be between 0 and 1");
  }

  const expectedWin = winProbability * winAmount;
  const expectedLoss = (1 - winProbability) * lossAmount;
  return expectedWin - expectedLoss;
}
