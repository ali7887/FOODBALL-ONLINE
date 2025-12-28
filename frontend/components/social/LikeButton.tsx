'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
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
      return;
    }

    // Optimistic update
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
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, liked, count, isAuthenticated, loading, onLikeChange]);

  if (!isAuthenticated) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base',
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        liked
          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
          : 'text-gray-600 hover:text-tm-green hover:bg-gray-50',
        className
      )}
      title={liked ? 'لایک را بردار' : 'لایک کن'}
    >
      <Heart
        className={cn(
          'ml-1',
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5',
          liked && 'fill-current'
        )}
      />
      {count > 0 && <span className="font-medium">{count}</span>}
    </Button>
  );
}

