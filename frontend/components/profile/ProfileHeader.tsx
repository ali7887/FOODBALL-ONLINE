'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LevelIndicator } from '@/components/gamification/LevelIndicator';
import { ReputationBadge } from './ReputationBadge';
import { UserTitleBadge } from './UserTitleBadge';
import type { UserPublicProfile } from '@/types/user';
import { Calendar, Users, UserCheck } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserPublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const joinDate = new Date(profile.joinDate).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Primary Identity Section - 40% visual weight */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24 border-2 border-tm-green flex-shrink-0">
            <AvatarImage src={profile.avatar} loading="lazy" />
            <AvatarFallback className="bg-tm-green text-white text-2xl font-bold">
              {profile.displayName?.[0] || profile.username[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Username - Bold, Large */}
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-sm text-gray-600 mb-3">@{profile.username}</p>

            {/* Title Badge - Color-coded, Medium - 20% visual weight */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <UserTitleBadge title={profile.title} />
              {profile.favoriteClub && (
                <Badge variant="outline" className="border-tm-green text-tm-green text-xs">
                  {profile.favoriteClub.name}
                </Badge>
              )}
            </div>

            {/* Reputation - Accent */}
            <ReputationBadge reputation={profile.reputation} showTooltip={true} />
          </div>
        </div>
      </div>

      {/* Stats Bar - Horizontal, Icons - 20% visual weight */}
      {profile.followStatus && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-tm-green/10 rounded-lg">
                <Users className="h-4 w-4 text-tm-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">دنبال‌کننده</p>
                <p className="text-lg font-bold text-gray-900" dir="ltr">
                  {profile.followStatus.followersCount.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">دنبال‌شده</p>
                <p className="text-lg font-bold text-gray-900" dir="ltr">
                  {profile.followStatus.followingCount.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">عضویت</p>
                <p className="text-sm font-medium text-gray-900">{joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <span className="text-lg">🏆</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">سطح</p>
                <p className="text-lg font-bold text-gray-900" dir="ltr">
                  {profile.level}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Progress */}
      <div className="border-t border-gray-200 px-6 py-4">
        <LevelIndicator
          currentLevel={profile.level}
          currentPoints={profile.points}
          pointsToNextLevel={100 - (profile.points % 100)}
          totalPoints={profile.points}
        />
      </div>
    </div>
  );
}
