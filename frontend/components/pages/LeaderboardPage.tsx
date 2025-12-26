'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser } = useAuthStore();

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
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  }

  function getRankBadgeColor(rank: number) {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-gray-200 text-gray-700';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">جدول امتیازات 🏆</h1>
          <p className="text-gray-600">برترین‌ها که برای رتبه اول می‌جنگن!</p>
        </div>

        {loading ? (
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
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
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-600 mb-2">هنوز کسی امتیازی نگرفته!</p>
              <p className="text-sm text-gray-500">تو اولین نفر باش و رتبه اول رو بگیر 💪</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 overflow-hidden">
            <CardHeader className="bg-tm-green text-white">
              <CardTitle>رتبه‌بندی کاربران</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {leaderboard.map((user, index) => {
                  const rank = user.rank || index + 1;
                  const isCurrentUser = currentUser?._id === user._id;

                  return (
                    <div
                      key={user._id}
                      className={`flex items-center justify-between p-4 transition-colors ${
                        isCurrentUser
                          ? 'bg-tm-green/5 border-r-4 border-r-tm-green'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-reverse space-x-4 flex-1">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadgeColor(rank)}`}
                        >
                          {getRankIcon(rank) || rank}
                        </div>
                        <Avatar className="h-12 w-12 border-2 border-gray-200">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-tm-green text-white">
                            {user.displayName?.[0] || user.username?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-reverse space-x-2">
                            <span className="font-semibold text-gray-900">
                              {user.displayName || user.username}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs bg-tm-green text-white px-2 py-0.5 rounded">
                                شما
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            سطح {user.level || 1}
                            {user.favoriteClub && ` • ${user.favoriteClub.name}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-tm-green">
                          {user.points || 0}
                        </div>
                        <div className="text-xs text-gray-500">امتیاز</div>
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
              className="border-gray-300 hover:border-tm-green hover:text-tm-green"
            >
              قبلی
            </Button>
            <span className="text-sm text-gray-600 px-4">
              صفحه {page} از {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-gray-300 hover:border-tm-green hover:text-tm-green"
            >
              بعدی
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
