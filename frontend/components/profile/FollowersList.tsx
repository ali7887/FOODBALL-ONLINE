'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { followApi } from '@/lib/api/follow';
import { UserTitleBadge } from './UserTitleBadge';
import { Users } from 'lucide-react';
import Link from 'next/link';
import type { FollowUser } from '@/types/follow';

interface FollowersListProps {
  username: string;
  initialFollowers?: FollowUser[];
  initialCount?: number;
}

export function FollowersList({ username, initialFollowers = [], initialCount = 0 }: FollowersListProps) {
  const [followers, setFollowers] = useState<FollowUser[]>(initialFollowers);
  const [loading, setLoading] = useState(!initialFollowers.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(initialCount);

  const fetchFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await followApi.getFollowers({
        username,
        page,
        limit: 20,
      });
      setFollowers(response.followers || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  }, [username, page]);

  useEffect(() => {
    if (!initialFollowers.length) {
      fetchFollowers();
    } else {
      setTotal(initialCount);
    }
  }, [fetchFollowers, initialFollowers.length, initialCount]);

  if (loading && followers.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Users className="h-5 w-5 text-tm-green" />
            <span>دنبال‌کنندگان</span>
            <span className="text-sm text-gray-500 font-normal">({total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-reverse space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center space-x-reverse space-x-2">
          <Users className="h-5 w-5 text-tm-green" />
          <span>دنبال‌کنندگان</span>
          <span className="text-sm text-gray-500 font-normal">({total})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {followers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">هنوز کسی این کاربر رو دنبال نمی‌کنه</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {followers.map((follower) => (
                <Link
                  key={follower._id}
                  href={`/users/${follower.username}`}
                  className="flex items-center space-x-reverse space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-gray-200">
                    <AvatarImage src={follower.avatar} />
                    <AvatarFallback className="bg-tm-green text-white">
                      {follower.displayName?.[0] || follower.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {follower.displayName || follower.username}
                      </span>
                      {follower.title && (
                        <UserTitleBadge title={follower.title as any} size="sm" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{follower.username}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-reverse space-x-2 pt-4 mt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-gray-300 hover:border-tm-green hover:text-tm-green"
                >
                  قبلی
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  صفحه {page} از {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-gray-300 hover:border-tm-green hover:text-tm-green"
                >
                  بعدی
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

