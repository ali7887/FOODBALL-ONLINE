import axios from 'axios';
import type {
  FollowRequest,
  FollowResponse,
  FollowStatus,
  GetFollowersParams,
  GetFollowingParams,
  FollowersResponse,
  FollowingResponse,
} from '@/types/follow';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance for follow endpoints
const followClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
followClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const followApi = {
  /**
   * Toggle follow status (follow/unfollow)
   */
  async toggleFollow(params: FollowRequest): Promise<FollowResponse> {
    const response = await followClient.post('/users/follow', params);
    return response.data;
  },

  /**
   * Get follow status for a user
   */
  async getFollowStatus(userId: string): Promise<FollowStatus> {
    const response = await followClient.get(`/users/${userId}/follow-status`);
    return response.data;
  },

  /**
   * Get followers list
   */
  async getFollowers(params: GetFollowersParams): Promise<FollowersResponse> {
    const { username, ...queryParams } = params;
    const response = await followClient.get(`/users/${username}/followers`, {
      params: queryParams,
    });
    return response.data;
  },

  /**
   * Get following list
   */
  async getFollowing(params: GetFollowingParams): Promise<FollowingResponse> {
    const { username, ...queryParams } = params;
    const response = await followClient.get(`/users/${username}/following`, {
      params: queryParams,
    });
    return response.data;
  },
};

