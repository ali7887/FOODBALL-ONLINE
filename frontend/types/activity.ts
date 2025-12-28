export type ActivityType = 
  | 'COMMENT_CREATED'
  | 'RUMOR_LIKED'
  | 'BADGE_EARNED'
  | 'VOTE_SUBMITTED'
  | 'USER_MENTIONED'
  | 'USER_FOLLOWED'
  | 'USER_UNFOLLOWED';

export interface ActivityAuthor {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  author: ActivityAuthor;
  action: string;
  targetType?: 'player' | 'rumor' | 'comment' | 'badge';
  targetId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  pointsEarned?: number;
}

export interface GetActivityParams {
  page?: number;
  limit?: number;
  activityType?: ActivityType;
}

export interface GetUserActivitiesParams {
  username: string;
  page?: number;
  limit?: number;
  activityType?: ActivityType;
}

export interface ActivityResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}


