'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { likesApi } from '@/lib/api/likes';
import { useAuthStore } from '@/store/useAuthStore';
import type { LikeableEntity } from '@/types/likes';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  targetType: LikeableEntity;
  targetId: string;
  initialLiked?: boolean;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  onLikeChange?: (liked: boolean, count: number) => void;
}

export function LikeButton({
  targetType,
  targetId,
  initialLiked = false,
  initialCount = 0,
  size = 'sm',
  variant = 'ghost',
  className,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Sync with props if they change
  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated || loading) {
      if (!isAuthenticated) {
        alert('برای لایک کردن، لطفاً وارد حساب کاربری‌ات بشو.');
      }
      return;
    }

    // Optimistic update with visual feedback
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1);
    
    setLiked(newLiked);
    setCount(newCount);
    setLoading(true);

    try {
      const response = await likesApi.toggle({
        targetType,
        targetId,
      });

      // Update with server response
      setLiked(response.liked);
      setCount(response.likesCount);
      onLikeChange?.(response.liked, response.likesCount);
    } catch (error) {
      // Revert optimistic update
      setLiked(!newLiked);
      setCount(count);
      console.error('Error toggling like:', error);
      alert('خطا در ثبت لایک. لطفاً دوباره تلاش کن.');
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, liked, count, isAuthenticated, loading, onLikeChange]);

  if (!isAuthenticated) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs min-w-[44px]',
    md: 'h-9 px-3 text-sm min-w-[44px]',
    lg: 'h-10 px-4 text-base min-w-[44px]',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'flex items-center gap-1.5 transition-all duration-150',
        liked
          ? 'text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-95'
          : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50 active:scale-95',
        loading && 'opacity-60 cursor-not-allowed',
        className
      )}
      title={liked ? 'لایک را بردار' : 'لایک کن'}
      aria-label={liked ? 'لایک را بردار' : 'لایک کن'}
    >
      {loading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : (
        <Heart
          className={cn(
            iconSizes[size],
            'transition-transform duration-150',
            liked && 'fill-current scale-110'
          )}
        />
      )}
      {count > 0 && (
        <span className="font-medium" dir="ltr">
          {count}
        </span>
      )}
    </Button>
  );
}
