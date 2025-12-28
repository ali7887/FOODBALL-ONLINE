import type { Activity, ActivityType } from './activity';
import type { Comment } from './comments';

export interface UserPublicProfile {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  email?: string; // Optional for privacy
  joinDate: string;
  favoriteClub?: {
    _id: string;
    name: string;
    logo?: string;
  };
  level: number;
  points: number;
  reputation: number;
  title: UserTitle;
  stats: UserStats;
  badges: UserBadge[];
  recentActivities: Activity[];
  followStatus?: {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
}

export interface UserStats {
  totalComments: number;
  totalLikes: number;
  totalVotes: number;
  totalBadges: number;
  commentsReceived: number;
  likesReceived: number;
  reputation: number;
}

export interface UserReputation {
  score: number;
  breakdown: {
    commentsPosted: number;
    likesReceived: number;
    badgesEarned: number;
    challengesCompleted: number;
    leaderboardRank: number;
  };
}

export type UserTitle =
  | 'تازه‌وارد'
  | 'تحلیل‌گر'
  | 'شایعه‌باز'
  | 'Guru نقل‌وانتقالات'
  | 'Legend'
  | 'Master'
  | 'Expert'
  | 'Veteran';

export interface UserTitleInfo {
  title: UserTitle;
  emoji: string;
  description: string;
  minReputation: number;
  minLevel: number;
}

export interface UserBadge {
  _id: string;
  name: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export interface UserActivitySummary {
  total: number;
  byType: Record<ActivityType, number>;
  recent: Activity[];
}

export interface GetUserProfileParams {
  username: string;
}

export interface GetUserActivitiesParams {
  username: string;
  page?: number;
  limit?: number;
  activityType?: ActivityType;
}

export interface UserProfileResponse {
  profile: UserPublicProfile;
}

export interface UserActivitiesResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Title definitions
export const USER_TITLES: UserTitleInfo[] = [
  {
    title: 'تازه‌وارد',
    emoji: '⚽',
    description: 'کاربر جدید',
    minReputation: 0,
    minLevel: 1,
  },
  {
    title: 'تحلیل‌گر',
    emoji: '📊',
    description: 'تحلیل‌گر فعال',
    minReputation: 50,
    minLevel: 2,
  },
  {
    title: 'شایعه‌باز',
    emoji: '🔥',
    description: 'متخصص شایعات',
    minReputation: 100,
    minLevel: 3,
  },
  {
    title: 'Guru نقل‌وانتقالات',
    emoji: '🎯',
    description: 'استاد نقل‌وانتقالات',
    minReputation: 200,
    minLevel: 5,
  },
  {
    title: 'Expert',
    emoji: '⭐',
    description: 'کارشناس فوتبال',
    minReputation: 300,
    minLevel: 7,
  },
  {
    title: 'Master',
    emoji: '👑',
    description: 'استاد',
    minReputation: 500,
    minLevel: 10,
  },
  {
    title: 'Veteran',
    emoji: '🏅',
    description: 'کهنه‌کار',
    minReputation: 750,
    minLevel: 15,
  },
  {
    title: 'Legend',
    emoji: '🏆',
    description: 'افسانه',
    minReputation: 1000,
    minLevel: 20,
  },
];

/**
 * Calculate user title based on reputation and level
 */
export function calculateUserTitle(reputation: number, level: number): UserTitle {
  // Sort by minReputation descending to get highest matching title
  const sortedTitles = [...USER_TITLES].sort((a, b) => b.minReputation - a.minReputation);
  
  for (const titleInfo of sortedTitles) {
    if (reputation >= titleInfo.minReputation && level >= titleInfo.minLevel) {
      return titleInfo.title;
    }
  }
  
  return USER_TITLES[0].title; // Default to first title
}

/**
 * Get title info by title name
 */
export function getTitleInfo(title: UserTitle): UserTitleInfo {
  return USER_TITLES.find(t => t.title === title) || USER_TITLES[0];
}

