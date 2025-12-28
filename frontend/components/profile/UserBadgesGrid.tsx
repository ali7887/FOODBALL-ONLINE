'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeCard } from '@/components/gamification/BadgeCard';
import type { UserBadge } from '@/types/user';

interface UserBadgesGridProps {
  badges: UserBadge[];
  loading?: boolean;
}

export function UserBadgesGrid({ badges, loading }: UserBadgesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-4">
              <Skeleton className="h-16 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-gray-600 font-medium">هنوز نشانی کسب نکرده</p>
          <p className="text-sm text-gray-500 mt-2">
            با فعالیت بیشتر، نشان‌های جدید کسب کن!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <BadgeCard
          key={badge._id}
          badge={{
            _id: badge._id,
            name: badge.name,
            icon: badge.icon,
            category: badge.category,
            rarity: badge.rarity,
            description: '',
          }}
          earnedAt={new Date(badge.earnedAt)}
        />
      ))}
    </div>
  );
}

