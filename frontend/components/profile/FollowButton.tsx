'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { followApi } from '@/lib/api/follow';
import { useAuthStore } from '@/store/useAuthStore';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  size = 'md',
  variant = 'default',
  className,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  // Sync with props if they change
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
    setFollowersCount(initialFollowersCount);
  }, [initialIsFollowing, initialFollowersCount]);

  // Don't show button if user is viewing their own profile
  if (!isAuthenticated || user?._id === targetUserId) {
    return null;
  }

  const handleToggleFollow = useCallback(async () => {
    if (!isAuthenticated) {
      alert('برای دنبال کردن، لطفاً وارد حساب کاربری‌ات بشو.');
      return;
    }

    setLoading(true);
    try {
      // Optimistic UI update
      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);
      setFollowersCount((prev) => (newIsFollowing ? prev + 1 : prev - 1));

      const response = await followApi.toggleFollow({ targetUserId });

      // Update with server response
      setIsFollowing(response.isFollowing);
      setFollowersCount(response.followersCount);

      onFollowChange?.(response.isFollowing, response.followersCount);
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      
      // Revert optimistic update on error
      setIsFollowing(initialIsFollowing);
      setFollowersCount(initialFollowersCount);

      const errorMessage =
        error.response?.data?.message || 'خطا در تغییر وضعیت دنبال کردن. لطفاً دوباره تلاش کن.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, targetUserId, isFollowing, initialIsFollowing, initialFollowersCount, onFollowChange]);

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <Button
      variant={variant}
      onClick={handleToggleFollow}
      disabled={loading}
      className={cn(
        'flex items-center space-x-reverse space-x-2',
        isFollowing
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          : 'bg-tm-green hover:bg-tm-green/90 text-white',
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          <span>دنبال می‌کنی</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>دنبال کن</span>
        </>
      )}
    </Button>
  );
}

