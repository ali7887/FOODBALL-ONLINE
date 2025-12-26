'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { memo } from 'react';

interface BadgeCardProps {
  badge: {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    category?: string;
  };
  earnedAt?: Date;
  onClick?: () => void;
}

const rarityLabels: { [key: string]: string } = {
  common: 'معمولی',
  rare: 'نادر',
  epic: 'حماسی',
  legendary: 'افسانهای',
};

const rarityColors: { [key: string]: string } = {
  common: 'border-gray-300 text-gray-700 bg-gray-50',
  rare: 'border-blue-400 text-blue-700 bg-blue-50',
  epic: 'border-purple-400 text-purple-700 bg-purple-50',
  legendary: 'border-yellow-400 text-yellow-700 bg-yellow-50',
};

function BadgeCardComponent({ badge, earnedAt, onClick }: BadgeCardProps) {
  return (
    <Card
      className={`border-gray-200 hover:border-tm-green hover:shadow-lg transition-all duration-200 cursor-pointer bg-white transform hover:scale-105 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-6xl mb-4 transition-transform hover:scale-110">{badge.icon || '🏆'}</div>
        <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
        {badge.description && (
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">{badge.description}</p>
        )}
        <Badge
          variant="outline"
          className={`text-xs font-medium ${rarityColors[badge.rarity] || rarityColors.common}`}
        >
          {rarityLabels[badge.rarity] || badge.rarity}
        </Badge>
        {earnedAt && (
          <p className="text-xs text-gray-500 mt-3">
            کسب شده در {new Date(earnedAt).toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const BadgeCard = memo(BadgeCardComponent);

