'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LevelIndicator } from '@/components/gamification/LevelIndicator';
import { ReputationBadge } from './ReputationBadge';
import { UserTitleBadge } from './UserTitleBadge';
import type { UserPublicProfile } from '@/types/user';
import { formatDate } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';

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
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Avatar and Basic Info */}
      <div className="flex items-start space-x-reverse space-x-4">
        <Avatar className="h-24 w-24 border-4 border-tm-green flex-shrink-0">
          <AvatarImage src={profile.avatar} loading="lazy" />
          <AvatarFallback className="bg-tm-green text-white text-2xl">
            {profile.displayName?.[0] || profile.username[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-gray-600 text-sm">@{profile.username}</p>
            </div>
            {profile.favoriteClub && (
              <Badge variant="outline" className="border-tm-green text-tm-green">
                {profile.favoriteClub.name}
              </Badge>
            )}
          </div>

          {/* Title and Reputation */}
          <div className="flex items-center space-x-reverse space-x-3 mb-3">
            <UserTitleBadge title={profile.title} />
            <ReputationBadge reputation={profile.reputation} />
          </div>

          {/* Level Progress */}
          <div className="mb-3">
            <LevelIndicator
              currentLevel={profile.level}
              currentPoints={profile.points}
              pointsToNextLevel={100 - (profile.points % 100)}
              totalPoints={profile.points}
            />
          </div>

          {/* Join Date */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 ml-1" />
            <span>عضو از {joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

