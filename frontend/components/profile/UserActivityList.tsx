'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersApi } from '@/lib/api/users';
import type { Activity, ActivityType, GetUserActivitiesParams } from '@/types/activity';
import { MessageSquare, Heart, Award, TrendingUp, AtSign, UserPlus, UserMinus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface UserActivityListProps {
  username: string;
  initialActivities?: Activity[];
  showFilter?: boolean;
}

export function UserActivityList({ username, initialActivities = [], showFilter = true }: UserActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [loading, setLoading] = useState(!initialActivities.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<ActivityType | ''>('');

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetUserActivitiesParams = {
        username,
        page,
        limit: 10,
        ...(selectedType && { activityType: selectedType as ActivityType }),
      };

      const response = await usersApi.getActivities(params);
      setActivities(response.activities || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setLoading(false);
    }
  }, [username, page, selectedType]);

  useEffect(() => {
    if (!initialActivities.length) {
      fetchActivities();
    }
  }, [fetchActivities, initialActivities.length]);

  const getActivityIcon = (type: ActivityType) => {
    const iconMap: Record<ActivityType, typeof MessageSquare> = {
      COMMENT_CREATED: MessageSquare,
      RUMOR_LIKED: Heart,
      BADGE_EARNED: Award,
      VOTE_SUBMITTED: TrendingUp,
      USER_MENTIONED: AtSign,
      USER_FOLLOWED: UserPlus,
      USER_UNFOLLOWED: UserMinus,
    };
    return iconMap[type] || MessageSquare;
  };

  const getActivityColor = (type: ActivityType) => {
    const colorMap: Record<ActivityType, string> = {
      COMMENT_CREATED: 'text-tm-green bg-tm-green/10',
      RUMOR_LIKED: 'text-red-600 bg-red-50',
      BADGE_EARNED: 'text-yellow-600 bg-yellow-50',
      VOTE_SUBMITTED: 'text-blue-600 bg-blue-50',
      USER_MENTIONED: 'text-purple-600 bg-purple-50',
      USER_FOLLOWED: 'text-tm-green bg-tm-green/10',
      USER_UNFOLLOWED: 'text-gray-600 bg-gray-50',
    };
    return colorMap[type] || 'text-gray-600 bg-gray-50';
  };

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      {showFilter && (
        <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
          <Button
            variant={selectedType === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('')}
            className={selectedType === '' ? 'bg-tm-green hover:bg-tm-green/90' : ''}
          >
            همه
          </Button>
          {(['COMMENT_CREATED', 'RUMOR_LIKED', 'BADGE_EARNED', 'USER_FOLLOWED'] as ActivityType[]).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? 'bg-tm-green hover:bg-tm-green/90' : ''}
            >
              {type === 'COMMENT_CREATED' && 'نظرات'}
              {type === 'RUMOR_LIKED' && 'لایک‌ها'}
              {type === 'BADGE_EARNED' && 'نشان‌ها'}
              {type === 'USER_FOLLOWED' && 'دنبال‌کردن'}
            </Button>
          ))}
        </div>
      )}

      {/* Activities */}
      {activities.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">هنوز فعالیتی ثبت نشده</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            const timeAgo = formatDistanceToNow(new Date(activity.timestamp), {
              addSuffix: true,
              locale: faIR,
            });

            return (
              <Card key={activity.id} className="border-gray-200 hover:border-tm-green/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-reverse space-x-3">
                    <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{timeAgo}</p>
                        {activity.pointsEarned && activity.pointsEarned > 0 && (
                          <span className="text-xs text-tm-green font-medium">
                            +{activity.pointsEarned} امتیاز
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-reverse space-x-2 pt-4">
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
    </div>
  );
}

