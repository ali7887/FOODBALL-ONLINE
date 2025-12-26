'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { Trophy, Award, TrendingUp, Activity, Star, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/gamification/StatsCard';
import { LevelIndicator } from '@/components/gamification/LevelIndicator';
import { BadgeCard } from '@/components/gamification/BadgeCard';
import Link from 'next/link';

export function ProfilePage() {
  const [progress, setProgress] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingBadges, setCheckingBadges] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [progressRes, badgesRes, activitiesRes] = await Promise.all([
        apiClient.getProgress(),
        apiClient.getMyBadges(),
        apiClient.getActivityFeed({ limit: 10 }),
      ]);

      setProgress(progressRes.data);
      setBadges(badgesRes.data?.badges || []);
      setActivities(activitiesRes.data?.activities || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckBadges() {
    setCheckingBadges(true);
    try {
      await apiClient.checkBadges();
      fetchData();
    } catch (error) {
      console.error('Error checking badges:', error);
    } finally {
      setCheckingBadges(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container space-y-6">
          {/* Header Skeleton */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-reverse space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-20 w-32 rounded-lg" />
              </div>
            </CardContent>
          </Card>
          {/* Level Progress Skeleton */}
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-100">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Badges Skeleton */}
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-gray-200">
          <CardContent className="pt-6 text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">پروفایل پیدا نشد</h2>
            <p className="text-gray-600 mb-6">لطفاً وارد حساب کاربری‌ات بشو تا پروفایلت رو ببینی 😊</p>
            <Link href="/login">
              <Button className="bg-tm-green hover:bg-tm-green/90 text-white tm-button">
                ورود به حساب کاربری
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, level, badgeCount, activityStats, totalActivities } = progress;
  const progressPercentage = (level.points % 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container space-y-6">
        {/* User Header - Transfermarkt style */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-reverse space-x-6">
              <Avatar className="h-24 w-24 border-2 border-tm-green">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-tm-green text-white text-2xl">
                  {user.displayName?.[0] || user.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.displayName || user.username}</h1>
                <p className="text-gray-600 mt-1">@{user.username}</p>
                {user.favoriteClub && (
                  <Badge variant="outline" className="mt-2 border-tm-green text-tm-green">
                    {user.favoriteClub.name}
                  </Badge>
                )}
              </div>
              <div className="text-left bg-tm-green/10 px-6 py-4 rounded-lg border border-tm-green/20">
                <div className="text-4xl font-bold text-tm-green">{user.points || 0}</div>
                <div className="text-sm text-gray-600 mt-1">امتیاز کل</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Progress - Transfermarkt style */}
        <Card className="border-gray-200">
          <CardHeader className="bg-tm-green text-white">
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Star className="h-5 w-5" />
              <span>سطح {level.current}</span>
            </CardTitle>
            <CardDescription className="text-white/90">
              {level.pointsToNextLevel} امتیاز تا سطح {level.current + 1}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <LevelIndicator
              currentLevel={level.current}
              currentPoints={level.points}
              pointsToNextLevel={level.pointsToNextLevel}
              totalPoints={level.points}
            />
          </CardContent>
        </Card>

        {/* Stats Grid - Transfermarkt table style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Trophy}
            value={badgeCount}
            label="نشان کسب شده"
            color="green"
          />
          <StatsCard
            icon={Activity}
            value={totalActivities}
            label="فعالیت کل"
            color="blue"
          />
          <StatsCard
            icon={TrendingUp}
            value={activityStats.vote_market_value?.count || 0}
            label="رأی داده شده"
            color="orange"
          />
        </div>

        {/* Badges Collection - Transfermarkt style */}
        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-reverse space-x-2 text-gray-900">
                  <Award className="h-5 w-5 text-tm-green" />
                  <span>مجموعه نشان‌ها</span>
                </CardTitle>
                <CardDescription className="mt-1">دستاوردها و نقاط عطف تو</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckBadges}
                disabled={checkingBadges}
                className="border-tm-green text-tm-green hover:bg-tm-green hover:text-white"
              >
                {checkingBadges ? 'در حال بررسی...' : 'بررسی نشان‌های جدید'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {badges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <p className="text-gray-600 mb-2 font-semibold">هنوز نشانی نگرفتی!</p>
                <p className="text-sm text-gray-500 mb-4">
                  شروع کن به رأی دادن و شرکت در فعالیت‌ها تا نشان بگیری
                </p>
                <Link href="/players">
                  <Button variant="outline" size="sm" className="border-tm-green text-tm-green hover:bg-tm-green hover:text-white">
                    شروع رأی دادن
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge: any) => (
                  <BadgeCard
                    key={badge._id}
                    badge={badge}
                    earnedAt={badge.earnedAt ? new Date(badge.earnedAt) : undefined}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities - Transfermarkt table style */}
        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-reverse space-x-2 text-gray-900">
                  <Activity className="h-5 w-5 text-tm-green" />
                  <span>فعالیت‌های اخیر</span>
                </CardTitle>
                <CardDescription className="mt-1">آخرین کارها و دستاوردهای تو</CardDescription>
              </div>
              <Link href="/activity">
                <Button variant="outline" size="sm" className="border-tm-green text-tm-green hover:bg-tm-green hover:text-white">
                  مشاهده همه
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-600 mb-2 font-semibold">هیچ فعالیتی ثبت نشده</p>
                <p className="text-sm text-gray-500">
                  فعالیت‌های تو اینجا نمایش داده می‌شه
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {activities.map((activity: any, index: number) => (
                  <div
                    key={activity._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-reverse space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-tm-green/10 group-hover:bg-tm-green/20 transition-colors">
                        <CheckCircle className="h-5 w-5 text-tm-green" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    {activity.pointsEarned > 0 && (
                      <Badge className="bg-tm-green text-white border-0">
                        +{activity.pointsEarned} امتیاز
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
