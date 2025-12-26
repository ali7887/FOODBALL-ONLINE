import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface LevelIndicatorProps {
  currentLevel: number;
  currentPoints: number;
  pointsToNextLevel: number;
  totalPoints: number;
}

export function LevelIndicator({
  currentLevel,
  currentPoints,
  pointsToNextLevel,
  totalPoints,
}: LevelIndicatorProps) {
  const progressPercentage = (currentPoints % 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-reverse space-x-2">
          <Star className="h-6 w-6 text-tm-green" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">سطح {currentLevel}</h3>
            <p className="text-sm text-gray-600">{pointsToNextLevel} امتیاز تا سطح بعدی</p>
          </div>
        </div>
        <div className="text-left">
          <div className="text-3xl font-bold text-tm-green">{totalPoints}</div>
          <div className="text-xs text-gray-500">امتیاز کل</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">پیشرفت به سطح {currentLevel + 1}</span>
          <span className="font-semibold text-tm-green">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-4" />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{currentPoints % 100} / 100 امتیاز</span>
          <span>سطح {currentLevel}</span>
        </div>
      </div>
    </div>
  );
}

