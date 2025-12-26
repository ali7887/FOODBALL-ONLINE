'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { Trophy, Medal, Award } from 'lucide-react';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const response = await apiClient.getLeaderboard({
        page,
        limit: 50,
        sortBy: 'points',
        sortOrder: 'desc',
      });
      setLeaderboard(response.data?.leaderboard || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRankIcon(rank: number) {
    if (rank === 1) return <Trophy className="h-6 w-6 text-food-yellow" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  }

  function getRankColor(rank: number) {
    if (rank === 1) return 'bg-gradient-to-r from-food-yellow to-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-500';
    return 'bg-secondary';
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">جدول امتیازات 🏆</h1>
        <p className="text-muted-foreground">برترین‌ها که برای رتبه اول می‌جنگن!</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-reverse space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : leaderboard.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">هنوز کسی امتیازی نگرفته، تو اولین نفر باش! 💪</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {leaderboard.map((user, index) => {
                const rank = user.rank || index + 1;
                const isTopThree = rank <= 3;

                return (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      isTopThree ? getRankColor(rank) : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center space-x-reverse space-x-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/80 font-bold text-lg">
                        {getRankIcon(rank) || rank}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.displayName?.[0] || user.username?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{user.displayName || user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          سطح {user.level || 1}
                          {user.favoriteClub && ` • ${user.favoriteClub.name}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-food-yellow">
                        {user.points || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">امتیاز</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-reverse space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {page} از {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}
