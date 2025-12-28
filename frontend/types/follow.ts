export interface FollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export interface FollowUser {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  title?: string;
  reputation?: number;
  level?: number;
  followedAt?: string;
}

export interface FollowRequest {
  targetUserId: string;
}

export interface FollowResponse {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  message?: string;
}

export interface GetFollowersParams {
  username: string;
  page?: number;
  limit?: number;
}

export interface GetFollowingParams {
  username: string;
  page?: number;
  limit?: number;
}

export interface FollowersResponse {
  followers: FollowUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FollowingResponse {
  following: FollowUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

