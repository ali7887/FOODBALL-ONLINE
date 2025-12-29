/**
 * Content Moderation & Safety Types
 * Handles content flags, violations, and moderation workflows
 */

/**
 * Reasons for flagging content
 */
export type FlagReason =
  | "spam"
  | "offensive"
  | "hate_speech"
  | "misinformation"
  | "copyright"
  | "violence"
  | "sexual"
  | "scam"
  | "impersonation"
  | "other";

/**
 * Status of moderation action
 */
export type ModerationStatus =
  | "approved"
  | "rejected"
  | "flagged"
  | "under_review"
  | "resolved";

/**
 * Result of a moderation check
 */
export type ModerationResult = "approved" | "rejected" | "review_needed";

/**
 * Individual check result
 * Part of moderation workflow
 */
export interface CheckResult {
  checkType: string; // 'spam_detection', 'abuse_filter', 'plagiarism', etc.
  passed: boolean;
  severity?: "low" | "medium" | "high"; // if failed
  details?: string;
  timestamp: Date;
}

/**
 * Flag on a piece of content
 * Reported by users or system
 */
export interface ContentModFlag {
  _id: string;
  contentId: string;
  contentType: "post" | "comment" | "prediction" | "review";

  // Reporter info
  reportedBy: string; // userId
  reportedAt: Date;

  // Flag details
  reason: FlagReason;
  description: string;
  screenshot?: string; // URL to screenshot

  // Review process
  reviewedBy?: string; // moderatorId
  reviewedAt?: Date;
  reviewNotes?: string;

  // Resolution
  status: ModerationStatus;
  actionTaken?:
    | "warning"
    | "content_removed"
    | "suspension"
    | "dismissed"
    | "no_action";
  actionExplanation?: string;

  // Content creator
  contentCreatorId: string;
  strikeGiven: boolean; // if user received a moderation strike
}

/**
 * User strike record
 * Tracks violations and suspension status
 */
export interface ModeratorStrike {
  _id: string;
  userId: string;

  // Strike info
  reason: FlagReason;
  description: string;
  severity: "minor" | "moderate" | "severe";

  // Content involved
  contentId: string;
  flagId: string;

  // Strike details
  issuedBy: string; // moderatorId
  issuedAt: Date;
  expiresAt: Date; // when strike is removed

  // Suspension
  suspension?: {
    duration: number; // in days
    startDate: Date;
    endDate: Date;
    reason: string;
  };

  // Appeal
  appealed: boolean;
  appealedAt?: Date;
  appealDetails?: string;
  appealStatus?: "pending" | "approved" | "rejected";
  appealReviewedBy?: string;
  appealReviewedAt?: Date;
}

/**
 * Moderation result for content
 * Summary of all checks performed
 */
export interface ContentModerationCheck {
  _id: string;
  contentId: string;
  contentType: "post" | "comment" | "prediction" | "review";
  creatorId: string;

  // Overall result
  finalResult: ModerationResult;
  overallRisk: "low" | "medium" | "high";

  // Individual checks
  checks: CheckResult[];

  // Automated analysis
  automatedResult?: {
    passed: boolean;
    confidence: number; // 0-1
    riskFactors: string[];
  };

  // Manual review
  manualReview?: {
    reviewedBy: string; // moderatorId
    reviewedAt: Date;
    notes: string;
    approved: boolean;
  };

  // Additional metadata
  ipAddress?: string; // hashed for privacy
  isRTLContent?: boolean;

  // Timeline
  createdAt: Date;
  resolvedAt?: Date;
}

/**
 * Moderation workflow for a user
 * Aggregates all flags and strikes
 */
export interface UserModerationProfile {
  _id: string;
  userId: string;
  username: string;

  // Safety score (0-100)
  safetyScore: number;

  // Strike history
  totalStrikes: number;
  activeStrikes: number;
  recentStrikes: ModeratorStrike[];

  // Content flags
  totalFlags: number;
  unresolvedFlags: number;
  dismissedFlags: number;

  // Account status
  isSuspended: boolean;
  suspendedUntil?: Date;
  suspensionReason?: string;

  // Appeal history
  appeals: Array<{
    flagId: string;
    appealedAt: Date;
    status: "pending" | "approved" | "rejected";
    reviewedAt?: Date;
  }>;

  // Notes
  moderationNotes: Array<{
    note: string;
    addedBy: string; // moderatorId
    addedAt: Date;
  }>;

  // Last action
  lastModeratedAt?: Date;
  lastFlaggedAt?: Date;

  // Account status transitions
  history: Array<{
    action:
      | "flagged"
      | "warned"
      | "suspended"
      | "unsuspended"
      | "appeal_approved";
    timestamp: Date;
    reason?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Moderation settings for the platform
 * Configurable thresholds and rules
 */
export interface ModerationSettings {
  _id: string;

  // Strike thresholds
  strikeThresholds: {
    minorStrikesToSuspend: number; // e.g., 3 minor = suspension
    moderateStrikesToSuspend: number; // e.g., 2 moderate = suspension
    severeStrikesToSuspend: number; // e.g., 1 severe = suspension
  };

  // Suspension duration (in days)
  suspensionDuration: {
    first: number;
    second: number;
    permanent: number; // triggers after X suspensions
  };

  // Automatic filters
  autoFilters: {
    enableSpamFilter: boolean;
    enableAbuseFilter: boolean;
    enablePlagiarismCheck: boolean;
    requireManualApprovalForNewUsers: boolean;
  };

  // Content policies
  flagReasonsEnabled: FlagReason[];
  maxFlagsPerContent: number;
  minFlagsToReview: number;

  // Moderation team
  moderatorGroups: Array<{
    groupName: string;
    permissions: string[];
  }>;

  updatedAt: Date;
  updatedBy: string; // admin userId
}

/**
 * Moderation queue item
 * Content waiting for review
 */
export interface ModerationQueueItem {
  _id: string;

  // Content details
  contentId: string;
  contentType: "post" | "comment" | "prediction" | "review";
  creatorId: string;
  creatorUsername: string;

  // Queue info
  addedAt: Date;
  reason: "flagged" | "auto_review" | "appeal";
  priority: "low" | "medium" | "high";
  urgentReason?: string;

  // Current status
  assignedTo?: string; // moderatorId
  assignedAt?: Date;
  status: "pending" | "in_review" | "resolved";

  // Review data
  flags: ContentModFlag[];
  automatedAnalysis?: {
    riskLevel: "low" | "medium" | "high";
    flaggedKeywords: string[];
  };

  // Preview
  preview: {
    text?: string;
    image?: string;
    url?: string;
  };

  updatedAt: Date;
}

/**
 * Moderation action taken
 * Record of all moderation decisions
 */
export interface ModerationAction {
  _id: string;

  // Action details
  actionType:
    | "warning"
    | "content_removal"
    | "suspension"
    | "appeal_approval"
    | "appeal_rejection";
  reason: string;

  // Parties involved
  moderatorId: string;
  userId: string;
  contentId?: string;

  // Action specifics
  details: {
    suspensionDays?: number;
    appealId?: string;
    contentRemovalReason?: string;
  };

  // Public visibility
  isPublic: boolean;
  publicMessage?: string; // shown to user

  createdAt: Date;
}

/**
 * Moderation report for analytics
 */
export interface ModerationReport {
  period: {
    startDate: Date;
    endDate: Date;
  };

  // Overall stats
  totalFlagsReceived: number;
  totalStrikesIssued: number;
  totalSuspensions: number;

  // By reason
  flagsByReason: Record<FlagReason, number>;

  // Response times
  avgTimeToReview: number; // in hours
  avgTimeToResolve: number; // in hours

  // Actions taken
  actionsBreakdown: {
    contentRemoved: number;
    warnings: number;
    suspensions: number;
    dismissedAppeals: number;
    approvedAppeals: number;
  };

  // Content analysis
  topFlaggedCreators: Array<{
    userId: string;
    username: string;
    flagCount: number;
  }>;

  topFlagReasons: Array<{
    reason: FlagReason;
    count: number;
    percentage: number;
  }>;

  // Health metrics
  communityHealthScore: number; // 0-100
  reporterAccuracy: number; // % of valid reports

  generatedAt: Date;
  generatedBy: string; // admin userId
}
