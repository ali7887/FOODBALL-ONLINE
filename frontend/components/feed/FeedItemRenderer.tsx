'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { PersonalizedFeedItem } from '@/types/feed';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  User,
  Users,
  TrendingUp,
  Newspaper,
  Activity,
  ArrowLeft,
  Clock,
  Eye,
  MessageCircle,
  Heart,
} from 'lucide-react';

interface FeedItemRendererProps {
  item: PersonalizedFeedItem;
}

function FeedItemRendererComponent({ item }: FeedItemRendererProps) {
  const timeAgo = formatDistanceToNow(new Date(item.metadata.createdAt), {
    addSuffix: true,
    locale: faIR,
  });

  const getTypeIcon = () => {
    const iconMap = {
      player: User,
      team: Users,
      rumor: TrendingUp,
      news: Newspaper,
      activity: Activity,
    };
    return iconMap[item.type] || Activity;
  };

  const getTypeColor = () => {
    const colorMap = {
      player: 'bg-blue-50 text-blue-700 border-blue-200',
      team: 'bg-purple-50 text-purple-700 border-purple-200',
      rumor: 'bg-tm-green/5 text-tm-green border-tm-green/20',
      news: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      activity: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colorMap[item.type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getItemLink = () => {
    switch (item.type) {
      case 'player':
        return `/players/${item.data.type === 'player' ? item.data.playerId : '#'}`;
      case 'team':
        return `/teams/${item.data.type === 'team' ? item.data.teamId : '#'}`;
      case 'rumor':
        return `/rumors/${item.data.type === 'rumor' ? item.data.rumorId : '#'}`;
      case 'news':
        return item.data.type === 'news' && item.data.url ? item.data.url : '#';
      default:
        return '#';
    }
  };

  const renderItemContent = () => {
    switch (item.data.type) {
      case 'player':
        const playerData = item.data;
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed">
              {playerData.action === 'transfer' && 'انتقال جدید'}
              {playerData.action === 'rumor' && 'شایعه جدید'}
              {playerData.action === 'update' && 'به‌روزرسانی'}
              {playerData.action === 'milestone' && 'دستاورد'}
              {' برای '}
              <span className="font-bold text-gray-900">{playerData.playerName}</span>
            </p>
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        );

      case 'team':
        const teamData = item.data;
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed">
              {teamData.action === 'transfer' && 'انتقال جدید'}
              {teamData.action === 'rumor' && 'شایعه جدید'}
              {teamData.action === 'match' && 'مسابقه جدید'}
              {teamData.action === 'update' && 'به‌روزرسانی'}
              {' برای '}
              <span className="font-bold text-gray-900">{teamData.teamName}</span>
            </p>
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        );

      case 'rumor':
        const rumorData = item.data;
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">{rumorData.playerName}</span>
              {rumorData.fromClub && ` از ${rumorData.fromClub}`}
              {rumorData.toClub && ` به ${rumorData.toClub}`}
              {rumorData.probability !== undefined && (
                <span className="mr-2 text-tm-green font-semibold">
                  ({rumorData.probability}% احتمال)
                </span>
              )}
            </p>
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        );

      case 'news':
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        );

      case 'activity':
        const activityData = item.data;
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">{activityData.userName}</span>
              {' '}
              {item.description}
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <p className="text-base text-gray-700 leading-relaxed font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            )}
          </div>
        );
    }
  };

  const Icon = getTypeIcon();
  const typeColor = getTypeColor();
  const itemLink = getItemLink();

  return (
    <Card className="bg-white border border-gray-200 rounded-lg hover:border-tm-green/30 transition-colors duration-150">
      <CardContent className="p-0">
        {/* Header: User/Meta Info - Subtle */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {item.source.avatar && (
              <Avatar className="h-8 w-8 border border-gray-200 flex-shrink-0">
                <AvatarImage src={item.source.avatar} loading="lazy" />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                  {item.source.name[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.source.type === 'player' ? (
                  <Link
                    href={`/users/${item.source.id}`}
                    className="text-xs font-medium text-gray-600 hover:text-tm-green transition-colors"
                  >
                    {item.source.name}
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-gray-600">{item.source.name}</span>
                )}
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeColor}`}>
                  {item.type === 'player' && 'بازیکن'}
                  {item.type === 'team' && 'تیم'}
                  {item.type === 'rumor' && 'شایعه'}
                  {item.type === 'news' && 'خبر'}
                  {item.type === 'activity' && 'فعالیت'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-[11px] text-gray-500">{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content: Primary Focus - 70% visual weight */}
        <div className="px-5 py-4">
          {renderItemContent()}
        </div>

        {/* Footer: Stats + Actions - Clear separation */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
          {/* Stats: Icons + Numbers (no labels) */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {item.metadata.interactionCount !== undefined && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="font-medium" dir="ltr">
                  {item.metadata.interactionCount}
                </span>
              </div>
            )}
            {item.metadata.popularityScore !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium" dir="ltr">
                  {Math.round(item.metadata.popularityScore)}
                </span>
              </div>
            )}
            {item.metadata.relevanceScore !== undefined && (
              <div className="flex items-center gap-1 text-tm-green">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-medium" dir="ltr">
                  {Math.round(item.metadata.relevanceScore * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Action: Clear CTA */}
          {itemLink !== '#' && (
            <Link
              href={itemLink}
              className="flex items-center gap-1.5 text-xs font-medium text-tm-green hover:text-tm-green/80 transition-colors min-h-[44px] px-3 -my-3 -mx-3 items-center justify-center"
            >
              <span>مشاهده</span>
              <ArrowLeft className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const FeedItemRenderer = memo(FeedItemRendererComponent);
