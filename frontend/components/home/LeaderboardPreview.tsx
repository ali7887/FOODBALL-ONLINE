'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SectionHeader } from './SectionHeader';
import { UserTitleBadge } from '@/components/profile/UserTitleBadge';
import { cn } from '@/lib/utils';

interface LeaderboardPreviewProps {
  topUsers: Array<{
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    points: number;
    level?: number;
    title?: string;
    favoriteClub?: {
      name: string;
    };
  }>;
}

function getMedalEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

function PodiumUser({
  user,
  rank,
  height,
}: {
  user: LeaderboardPreviewProps['topUsers'][0];
  rank: number;
  height: 'tall' | 'short' | 'shorter';
}) {
  const heightClass = {
    tall: 'h-32',
    short: 'h-24',
    shorter: 'h-20',
  }[height];

  const rankConfig = {
    1: { emoji: '🥇', bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600' },
    2: { emoji: '🥈', bg: 'bg-gradient-to-br from-gray-300 to-gray-500' },
    3: { emoji: '🥉', bg: 'bg-gradient-to-br from-amber-500 to-amber-700' },
  };

  const config = rankConfig[rank as keyof typeof rankConfig] || { emoji: '', bg: '' };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-3">
        <Avatar className={cn('border-4 border-white shadow-lg', rank === 1 ? 'h-16 w-16' : 'h-12 w-12')}>
          <AvatarImage src={user.avatar} loading="lazy" />
          <AvatarFallback className="bg-white text-gray-600">
            {user.displayName?.[0] || user.username[0]}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl">{config.emoji}</span>
        </div>
      </div>
      <p className="font-bold text-sm mb-1" dir="rtl">
        {user.displayName || user.username}
      </p>
      {user.title && <UserTitleBadge title={user.title as any} size="sm" />}
      <p className="text-xs text-gray-500 font-mono mt-1" dir="ltr">
        {user.points.toLocaleString('fa-IR')}
      </p>
      <div className={cn('w-full bg-gradient-to-t from-tm-green/20 to-transparent rounded-t-lg mt-2', heightClass)} />
    </div>
  );
}

function LeaderboardRow({
  user,
  rank,
  compact = false,
}: {
  user: LeaderboardPreviewProps['topUsers'][0];
  rank: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition',
        !compact && 'mb-2'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold">
          {rank}
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} loading="lazy" />
          <AvatarFallback className="bg-tm-green text-white">
            {user.displayName?.[0] || user.username[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold" dir="rtl">
            {user.displayName || user.username}
          </p>
          <p className="text-xs text-gray-600">
            سطح {user.level || 1}
            {user.favoriteClub && ` • ${user.favoriteClub.name}`}
          </p>
        </div>
      </div>
      <div className="text-left">
        <p className="text-lg font-bold text-tm-green" dir="ltr">
          {user.points.toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  );
}

export function LeaderboardPreview({ topUsers }: LeaderboardPreviewProps) {
  if (topUsers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-tm-green/5 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="جدول امتیازات"
            subtitle="برترین‌های این هفته"
            icon="🏆"
            centered
            action={
              <Link href="/leaderboard" className="text-tm-green hover:underline text-sm font-medium">
                مشاهده کامل ←
              </Link>
            }
          />

          {/* Podium Style for Top 3 */}
          {topUsers.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
              {/* 2nd Place */}
              <div className="text-center">
                <PodiumUser user={topUsers[1]} rank={2} height="short" />
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <PodiumUser user={topUsers[0]} rank={1} height="tall" />
              </div>

              {/* 3rd Place */}
              <div className="text-center pt-12">
                <PodiumUser user={topUsers[2]} rank={3} height="shorter" />
              </div>
            </div>
          )}

          {/* Rest of Top 5 */}
          {topUsers.length > 3 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              {topUsers.slice(3, 5).map((user, index) => (
                <LeaderboardRow key={user._id} user={user} rank={index + 4} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
