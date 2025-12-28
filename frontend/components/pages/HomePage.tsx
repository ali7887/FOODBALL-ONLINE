'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const [trendingPlayers, setTrendingPlayers] = useState<any[]>([]);
  const [rumors, setRumors] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [playersRes, rumorsRes, leaderboardRes] = await Promise.all([
          apiClient.getPlayers({ limit: 6, sortBy: 'marketValue', sortOrder: 'desc' }),
          apiClient.getRumors({ limit: 6, status: 'active', sortBy: 'probability', sortOrder: 'desc' }),
          apiClient.getLeaderboard({ limit: 5 }),
        ]);

        setTrendingPlayers(playersRes.data?.players || []);
        setRumors(rumorsRes.data?.rumors || []);
        setLeaderboard(leaderboardRes.data?.leaderboard || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        // Silently handle errors - show empty states instead
        // In production, you might want to show a toast notification
        if (error.message?.includes('سرور در دسترس نیست')) {
          console.warn('Backend server is not running. Showing empty states.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-800" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
          به فودبال آنلاین خوش آمدید ⚽
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          پلتفرم داده‌های فوتبال ایران با طعم کباب و پیتزا! بازیکنان را دنبال کن، نقل‌وانتقالات را ببین و برای صدر جدول بجنگ 🏆
        </p>
      </section>

      {/* Trending Players */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-reverse space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">بازیکنان داغ 🔥</h2>
          </div>
          <Link href="/players">
            <Button variant="outline">مشاهده همه</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : trendingPlayers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">هنوز بازیکنی اضافه نشده، تو شروعش کن 😉</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPlayers.map((player) => (
              <Link key={player._id} href={`/players/${player._id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{player.fullName}</CardTitle>
                        <CardDescription>{player.position}</CardDescription>
                      </div>
                      {player.currentClub && (
                        <Badge variant="outline">{player.currentClub.name}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">ارزش بازاری</span>
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(player.marketValue || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{player.marketValueVoteCount || 0} رأی</span>
                        <span>{player.stats?.goals || 0} گل</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Hot Rumors */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-reverse space-x-2">
            <Users className="h-5 w-5 text-food-orange" />
            <h2 className="text-2xl font-bold">شایعات داغ نقل‌وانتقالات 🔥</h2>
          </div>
          <Link href="/rumors">
            <Button variant="outline">مشاهده همه</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rumors.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">هنوز شایعه‌ای ثبت نشده، تو اولین شایعه رو ثبت کن! 🍕</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rumors.map((rumor) => (
              <Link key={rumor._id} href={`/rumors/${rumor._id}`}>
                <Card className="hover:border-food-orange transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {rumor.player?.fullName || 'بازیکن نامشخص'}
                        </CardTitle>
                        <CardDescription>
                          {rumor.fromClub?.name || 'آزاد'} → {rumor.toClub?.name}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={rumor.probability >= 70 ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {rumor.probability}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${rumor.probability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{rumor.voteCount || 0} رأی</span>
                        <span>{rumor.upvotes || 0} موافق</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Leaderboard Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-reverse space-x-2">
            <Trophy className="h-5 w-5 text-food-yellow" />
            <h2 className="text-2xl font-bold">برترین‌ها 🏆</h2>
          </div>
          <Link href="/leaderboard">
            <Button variant="outline">مشاهده جدول کامل</Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-reverse space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
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
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || user.username}</p>
                        <p className="text-sm text-muted-foreground">سطح {user.level || 1}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-food-yellow">{user.points || 0} امتیاز</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
