/**
 * Content Moderation & Filtering
 * Automated checks for content safety and policy compliance
 */

import type { CreatorContent } from "@/types/creator";

/**
 * Result of moderation check
 */
export interface ModerationCheckResult {
  approved: boolean;
  action: "approve" | "remove" | "review_required";
  violations: ContentViolation[];
  score: number; // 0-100, higher is riskier
  summary: string;
}

/**
 * Individual violation found in content
 */
export interface ContentViolation {
  type: string; // 'spam', 'abuse', 'plagiarism', etc.
  severity: "low" | "medium" | "high";
  description: string;
  detectedAt: Date;
}

/**
 * Spam detection patterns
 */
const SPAM_PATTERNS = [
  /(\w+\s*){5,}\1{2,}/, // Repeated words
  /[A-Z]{10,}/, // All caps spam
  /(.)\1{9,}/, // Character repetition (aaaaaaaaaa)
  /click here|buy now|limited offer/i,
  /\$+|\d{1,}[KMB]? followers/i,
];

/**
 * Check for spam patterns in content
 */
async function checkSpamPatterns(
  content: CreatorContent
): Promise<ContentViolation[]> {
  const violations: ContentViolation[] = [];

  const textContent = `${content.title} ${content.description}`;

  SPAM_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(textContent)) {
      violations.push({
        type: "spam",
        severity: "medium",
        description: `Spam pattern detected (pattern ${index + 1})`,
        detectedAt: new Date(),
      });
    }
  });

  // Check for excessive links
  const linkCount = (content.description.match(/https?:\/\//g) || []).length;
  if (linkCount > 3) {
    violations.push({
      type: "spam",
      severity: "low",
      description: `Too many links (${linkCount})`,
      detectedAt: new Date(),
    });
  }

  return violations;
}

/**
 * Offensive language patterns
 */
const OFFENSIVE_PATTERNS = [/hate|kill|die|death/i, /racist|discrimination/i];

/**
 * Check for offensive content
 */
async function checkExplicitContent(
  content: CreatorContent
): Promise<ContentViolation[]> {
  const violations: ContentViolation[] = [];

  const textContent = `${content.title} ${content.description}`;

  OFFENSIVE_PATTERNS.forEach((pattern) => {
    if (pattern.test(textContent)) {
      violations.push({
        type: "offensive",
        severity: "high",
        description: "Potentially offensive language detected",
        detectedAt: new Date(),
      });
    }
  });

  return violations;
}

/**
 * Check for stolen/plagiarized content
 * Placeholder - would integrate with plagiarism detection service
 */
async function checkForPlagiarism(
  content: CreatorContent
): Promise<ContentViolation[]> {
  // TODO: Integrate with plagiarism detection API
  // For now, simple heuristic checks

  const violations: ContentViolation[] = [];

  // Check if description is too generic (less than 20 characters)
  if (content.description.length < 20) {
    violations.push({
      type: "plagiarism",
      severity: "low",
      description: "Content description is too generic",
      detectedAt: new Date(),
    });
  }

  return violations;
}

/**
 * Check for policy violations
 */
async function checkPolicyCompliance(
  content: CreatorContent
): Promise<ContentViolation[]> {
  const violations: ContentViolation[] = [];

  // Check for prohibited content types
  const prohibitedKeywords = ["real club", "real team", "real money"];
  const textContent = `${content.title} ${content.description}`.toLowerCase();

  prohibitedKeywords.forEach((keyword) => {
    if (textContent.includes(keyword)) {
      violations.push({
        type: "policy_violation",
        severity: "high",
        description: `Prohibited content: "${keyword}"`,
        detectedAt: new Date(),
      });
    }
  });

  return violations;
}

/**
 * Main moderation function
 * Runs all checks and returns comprehensive result
 *
 * @param content The content to moderate
 * @returns Moderation decision and details
 */
export async function moderateContent(
  content: CreatorContent
): Promise<ModerationCheckResult> {
  try {
    // Run all checks in parallel
    const [
      spamViolations,
      explicitViolations,
      plagiarismViolations,
      policyViolations,
    ] = await Promise.all([
      checkSpamPatterns(content),
      checkExplicitContent(content),
      checkForPlagiarism(content),
      checkPolicyCompliance(content),
    ]);

    const allViolations = [
      ...spamViolations,
      ...explicitViolations,
      ...plagiarismViolations,
      ...policyViolations,
    ];

    // Calculate risk score (0-100)
    const highSeverityCount = allViolations.filter(
      (v) => v.severity === "high"
    ).length;
    const mediumSeverityCount = allViolations.filter(
      (v) => v.severity === "medium"
    ).length;
    const lowSeverityCount = allViolations.filter(
      (v) => v.severity === "low"
    ).length;

    const score = Math.min(
      highSeverityCount * 40 + mediumSeverityCount * 20 + lowSeverityCount * 5,
      100
    );

    // Determine action
    let action: "approve" | "remove" | "review_required";
    if (highSeverityCount > 0) {
      action = "remove";
    } else if (mediumSeverityCount > 0 || score > 50) {
      action = "review_required";
    } else {
      action = "approve";
    }

    const summary = generateSummary(allViolations, action);

    return {
      approved: action === "approve",
      action,
      violations: allViolations,
      score,
      summary,
    };
  } catch (error) {
    // On error, flag for manual review
    return {
      approved: false,
      action: "review_required",
      violations: [
        {
          type: "system_error",
          severity: "medium",
          description: "Automated moderation check encountered an error",
          detectedAt: new Date(),
        },
      ],
      score: 50,
      summary: "Content flagged for manual review due to system error",
    };
  }
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  violations: ContentViolation[],
  action: string
): string {
  if (violations.length === 0) {
    return "Content approved - no violations detected";
  }

  const violationSummary = violations
    .map((v) => `${v.type} (${v.severity})`)
    .slice(0, 3)
    .join(", ");

  return `${violations.length} violation(s) detected: ${violationSummary}. Action: ${action}`;
}

/**
 * Quick content safety check
 * Simpler, faster check for basic compliance
 */
export async function quickSafetyCheck(
  content: CreatorContent
): Promise<boolean> {
  const violations = await checkPolicyCompliance(content);
  return violations.length === 0;
}

/**
 * Batch moderation for multiple contents
 */
export async function moderateContentBatch(
  contents: CreatorContent[]
): Promise<Map<string, ModerationCheckResult>> {
  const results = new Map<string, ModerationCheckResult>();

  const moderationResults = await Promise.all(
    contents.map((content) => moderateContent(content))
  );

  contents.forEach((content, index) => {
    results.set(content._id, moderationResults[index]);
  });

  return results;
}

/**
 * Get moderation stats
 * For analytics and dashboard
 */
export interface ModerationStats {
  totalChecked: number;
  approved: number;
  rejected: number;
  reviewRequired: number;
  averageScore: number;
}

/**
 * Calculate moderation statistics
 */
export function calculateModerationStats(
  results: ModerationCheckResult[]
): ModerationStats {
  const stats: ModerationStats = {
    totalChecked: results.length,
    approved: 0,
    rejected: 0,
    reviewRequired: 0,
    averageScore: 0,
  };

  let totalScore = 0;

  results.forEach((result) => {
    if (result.action === "approve") stats.approved++;
    if (result.action === "remove") stats.rejected++;
    if (result.action === "review_required") stats.reviewRequired++;
    totalScore += result.score;
  });

  stats.averageScore = Math.round(totalScore / results.length);

  return stats;
}
