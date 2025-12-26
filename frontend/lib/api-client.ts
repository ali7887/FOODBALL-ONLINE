import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Store reference will be set dynamically
let authStore: any = null;

export function setAuthStore(store: any) {
  authStore = store;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token from store
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth state
          if (authStore) {
            authStore.getState().logout();
          }
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error
      const message = (error.response.data as any)?.message || error.message;
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('خطای شبکه. لطفاً اتصال اینترنتت رو بررسی کن.');
    } else {
      // Something else happened
      return new Error(error.message || 'خطای غیرمنتظره‌ای رخ داد');
    }
  }

  private getToken(): string | null {
    // Try to get from store first
    if (authStore) {
      const state = authStore.getState();
      if (state.token) {
        return state.token;
      }
    }
    // Fallback to localStorage
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string) {
    // Store in localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth methods
  async register(data: { username: string; email: string; password: string; displayName?: string }) {
    const response = await this.client.post('/auth/register', data);
    const token = response.data.data.token;
    if (token) this.setToken(token);
    return response.data;
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/auth/login', data);
    const token = response.data.data.token;
    if (token) this.setToken(token);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  logout() {
    this.clearToken();
    if (authStore) {
      authStore.getState().logout();
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Player methods
  async getPlayers(params?: {
    page?: number;
    limit?: number;
    club?: string;
    position?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await this.client.get('/players', { params });
    return response.data;
  }

  async getPlayer(id: string) {
    const response = await this.client.get(`/players/${id}`);
    return response.data;
  }

  async voteOnPlayerMarketValue(playerId: string, value: number) {
    const response = await this.client.post(`/players/${playerId}/vote`, { value });
    return response.data;
  }

  // Transfer methods
  async getTransfers(params?: {
    page?: number;
    limit?: number;
    player?: string;
    fromClub?: string;
    toClub?: string;
    season?: string;
  }) {
    const response = await this.client.get('/transfers', { params });
    return response.data;
  }

  async getTransfer(id: string) {
    const response = await this.client.get(`/transfers/${id}`);
    return response.data;
  }

  // Rumor methods
  async getRumors(params?: {
    page?: number;
    limit?: number;
    player?: string;
    toClub?: string;
    status?: string;
    minProbability?: number;
  }) {
    const response = await this.client.get('/rumors', { params });
    return response.data;
  }

  async getRumor(id: string) {
    const response = await this.client.get(`/rumors/${id}`);
    return response.data;
  }

  async createRumor(data: {
    player: string;
    fromClub?: string;
    toClub: string;
    estimatedFee?: number;
    transferType?: string;
    source?: string;
  }) {
    const response = await this.client.post('/rumors', data);
    return response.data;
  }

  async voteOnRumor(rumorId: string, probability: number) {
    const response = await this.client.post(`/rumors/${rumorId}/vote`, { probability });
    return response.data;
  }

  // Gamification methods
  async getLeaderboard(params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const response = await this.client.get('/gamification/leaderboard', { params });
    return response.data;
  }

  async getActivityFeed(params?: { page?: number; limit?: number; activityType?: string }) {
    const response = await this.client.get('/gamification/activity-feed', { params });
    return response.data;
  }

  async getProgress() {
    const response = await this.client.get('/gamification/progress');
    return response.data;
  }

  async checkBadges() {
    const response = await this.client.post('/gamification/check-badges');
    return response.data;
  }

  async getAllBadges(params?: { category?: string; rarity?: string; isActive?: boolean }) {
    const response = await this.client.get('/gamification/badges', { params });
    return response.data;
  }

  async getMyBadges() {
    const response = await this.client.get('/gamification/my-badges');
    return response.data;
  }

  // Vote methods
  async getMyVotes(voteType?: string) {
    const response = await this.client.get('/votes/my-votes', { params: { voteType } });
    return response.data;
  }
}

export const apiClient = new ApiClient();
