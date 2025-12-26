'use client';

import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { memo } from 'react';

interface LevelIndicatorProps {
  currentLevel: number;
  currentPoints: number;
  pointsToNextLevel: number;
  totalPoints: number;
}

function LevelIndicatorComponent({
  currentLevel,
  currentPoints,
  pointsToNextLevel,
  totalPoints,
}: LevelIndicatorProps) {
  const progressPercentage = Math.min(100, Math.max(0, (currentPoints % 100)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-reverse space-x-3">
          <div className="p-2 bg-tm-green/10 rounded-lg">
            <Star className="h-6 w-6 text-tm-green" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">سطح {currentLevel}</h3>
            <p className="text-sm text-gray-600">{pointsToNextLevel} امتیاز تا سطح {currentLevel + 1}</p>
          </div>
        </div>
        <div className="text-left bg-tm-green/5 px-4 py-3 rounded-lg border border-tm-green/20">
          <div className="text-3xl font-bold text-tm-green">{totalPoints.toLocaleString('fa-IR')}</div>
          <div className="text-xs text-gray-500">امتیاز کل</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">پیشرفت به سطح {currentLevel + 1}</span>
          <span className="font-bold text-tm-green text-base">{progressPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-4" />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{Math.floor(currentPoints % 100)} / 100 امتیاز</span>
          <span className="font-medium">سطح {currentLevel}</span>
        </div>
      </div>
    </div>
  );
}

export const LevelIndicator = memo(LevelIndicatorComponent);

