'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient, setAuthStore } from '@/lib/api-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setLoading, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    // Set store reference in API client
    setAuthStore(useAuthStore);

    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const storedToken = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token') 
        : null;

      if (storedToken && !isAuthenticated) {
        setLoading(true);
        try {
          const response = await apiClient.getCurrentUser();
          if (response.data?.user) {
            login(storedToken, response.data.user);
          }
        } catch (error) {
          // Token is invalid, clear it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, login, logout, setLoading]);

  return <>{children}</>;
}

