'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import {
  Activity,
  TrendingUp,
  Trophy,
  Award,
  CheckCircle,
  Vote,
  MessageSquare,
  Star,
} from 'lucide-react';

export function ActivityFeedPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activityType, setActivityType] = useState<string>('');

  useEffect(() => {
    fetchActivities();
  }, [page, activityType]);

  async function fetchActivities() {
    setLoading(true);
    try {
      const response = await apiClient.getActivityFeed({
        page,
        limit: 20,
        activityType: activityType || undefined,
      });
      setActivities(response.data?.activities || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }

  function getActivityIcon(type: string) {
    const iconMap: { [key: string]: any } = {
      vote_market_value: Vote,
      vote_rumor_probability: TrendingUp,
      quiz_completed: Trophy,
      quiz_attempt: MessageSquare,
      badge_earned: Award,
      ritual_created: Star,
      ritual_liked: Star,
      transfer_reported: Activity,
    };
    return iconMap[type] || Activity;
  }

  function getActivityColor(type: string) {
    const colorMap: { [key: string]: string } = {
      vote_market_value: 'text-blue-600 bg-blue-50',
      vote_rumor_probability: 'text-purple-600 bg-purple-50',
      quiz_completed: 'text-yellow-600 bg-yellow-50',
      badge_earned: 'text-tm-green bg-tm-green/10',
      ritual_created: 'text-orange-600 bg-orange-50',
    };
    return colorMap[type] || 'text-gray-600 bg-gray-50';
  }

  const activityTypes = [
    { value: '', label: 'همه فعالیت‌ها' },
    { value: 'vote_market_value', label: 'رأی به ارزش بازاری' },
    { value: 'vote_rumor_probability', label: 'رأی به شایعات' },
    { value: 'quiz_completed', label: 'کویزها' },
    { value: 'badge_earned', label: 'نشان‌ها' },
    { value: 'ritual_created', label: 'ریتوال‌ها' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">فعالیت‌های من</h1>
          <p className="text-gray-600">تاریخچه کامل فعالیت‌ها و دستاوردهای تو</p>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={activityType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActivityType(type.value);
                    setPage(1);
                  }}
                  className={
                    activityType === type.value
                      ? 'bg-tm-green hover:bg-tm-green/90 text-white'
                      : 'border-gray-300 hover:border-tm-green hover:text-tm-green'
                  }
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        {loading ? (
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-reverse space-x-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : activities.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 mb-2">هیچ فعالیتی ثبت نشده</p>
              <p className="text-sm text-gray-500">
                شروع کن به رأی دادن و شرکت در فعالیت‌ها تا تاریخچه‌ات پر بشه!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">تاریخچه فعالیت‌ها</CardTitle>
              <CardDescription>تمام فعالیت‌ها و دستاوردهای تو به ترتیب زمان</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {activities.map((activity: any) => {
                  const Icon = getActivityIcon(activity.activityType);
                  const colorClass = getActivityColor(activity.activityType);

                  return (
                    <div
                      key={activity._id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-reverse space-x-4 flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colorClass} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6" />
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
                        <Badge className="bg-tm-green text-white border-0 ml-4">
                          +{activity.pointsEarned} امتیاز
                        </Badge>
                      )}
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

