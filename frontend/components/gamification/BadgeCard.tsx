import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
  common: 'border-gray-300 text-gray-700',
  rare: 'border-blue-400 text-blue-700',
  epic: 'border-purple-400 text-purple-700',
  legendary: 'border-yellow-400 text-yellow-700',
};

export function BadgeCard({ badge, earnedAt, onClick }: BadgeCardProps) {
  return (
    <Card
      className={`border-gray-200 hover:border-tm-green hover:shadow-md transition-all cursor-pointer bg-white ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">{badge.icon || '🏆'}</div>
        <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
        {badge.description && (
          <p className="text-xs text-gray-600 mb-3">{badge.description}</p>
        )}
        <Badge
          variant="outline"
          className={`text-xs ${rarityColors[badge.rarity] || rarityColors.common}`}
        >
          {rarityLabels[badge.rarity] || badge.rarity}
        </Badge>
        {earnedAt && (
          <p className="text-xs text-gray-500 mt-2">
            کسب شده در {new Date(earnedAt).toLocaleDateString('fa-IR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

