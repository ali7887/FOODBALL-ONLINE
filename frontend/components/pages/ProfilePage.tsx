'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { Trophy, Award, TrendingUp, Activity, Star } from 'lucide-react';

export function ProfilePage() {
  const [progress, setProgress] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [progressRes, badgesRes, activitiesRes] = await Promise.all([
        apiClient.getProgress(),
        apiClient.getMyBadges(),
        apiClient.getActivityFeed({ limit: 20 }),
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
    try {
      await apiClient.checkBadges();
      fetchData();
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">لطفاً وارد حساب کاربری‌ات بشو تا پروفایلت رو ببینی 😊</p>
      </div>
    );
  }

  const { user, level, badgeCount, activityStats, totalActivities } = progress;

  return (
    <div className="container py-8 space-y-6">
      {/* User Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-reverse space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.displayName?.[0] || user.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.displayName || user.username}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              {user.favoriteClub && (
                <Badge variant="outline" className="mt-2">
                  {user.favoriteClub.name}
                </Badge>
              )}
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-food-yellow">{user.points || 0}</div>
              <div className="text-sm text-muted-foreground">امتیاز</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Star className="h-5 w-5 text-food-yellow" />
            <span>سطح {level.current}</span>
          </CardTitle>
          <CardDescription>
            {level.pointsToNextLevel} امتیاز تا سطح {level.current + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(level.points % 100) / 100 * 100} className="h-3" />
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>{level.points % 100} / 100</span>
            <span>مجموع: {level.points} امتیاز</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-reverse space-x-2">
              <Trophy className="h-5 w-5 text-food-yellow" />
              <div>
                <div className="text-2xl font-bold">{badgeCount}</div>
                <div className="text-sm text-muted-foreground">نشان کسب شده</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-reverse space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalActivities}</div>
                <div className="text-sm text-muted-foreground">فعالیت کل</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-reverse space-x-2">
              <TrendingUp className="h-5 w-5 text-food-orange" />
              <div>
                <div className="text-2xl font-bold">
                  {activityStats.vote_market_value?.count || 0}
                </div>
                <div className="text-sm text-muted-foreground">رأی داده شده</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-reverse space-x-2">
                <Award className="h-5 w-5 text-food-orange" />
                <span>نشان‌ها</span>
              </CardTitle>
              <CardDescription>دستاوردها و نقاط عطف تو</CardDescription>
            </div>
            <button
              onClick={handleCheckBadges}
              className="text-sm text-primary hover:underline"
            >
              بررسی نشان‌های جدید
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              هنوز نشانی نگرفتی. شروع کن به رأی دادن و شرکت در فعالیت‌ها تا نشان بگیری! 🏆
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge: any) => (
                <div
                  key={badge._id}
                  className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                  <div className="text-sm font-medium text-center">{badge.name}</div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {badge.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-reverse space-x-2">
            <Activity className="h-5 w-5" />
            <span>فعالیت‌های اخیر</span>
          </CardTitle>
          <CardDescription>آخرین کارها و دستاوردهای تو</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">هیچ فعالیتی ثبت نشده</p>
            ) : (
              activities.map((activity: any) => (
                <div key={activity._id} className="flex items-start space-x-reverse space-x-4 pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString('fa-IR')}
                    </p>
                  </div>
                  {activity.pointsEarned > 0 && (
                    <Badge variant="food" className="text-xs">
                      +{activity.pointsEarned} امتیاز
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
