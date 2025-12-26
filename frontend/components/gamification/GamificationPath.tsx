'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, TrendingUp, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GamificationPathProps {
  currentPoints: number;
  currentLevel: number;
  badgeCount: number;
  rank: number;
  pointsToNextLevel: number;
}

export function GamificationPath({
  currentPoints,
  currentLevel,
  badgeCount,
  rank,
  pointsToNextLevel,
}: GamificationPathProps) {
  const progressPercentage = Math.min(100, ((currentPoints % 100) / 100) * 100);

  const steps = [
    {
      icon: TrendingUp,
      label: 'امتیاز',
      value: currentPoints.toLocaleString('fa-IR'),
      description: 'با رأی دادن و فعالیت، امتیاز بگیر',
      color: 'text-tm-green',
      bgColor: 'bg-tm-green/10',
    },
    {
      icon: Star,
      label: 'سطح',
      value: currentLevel,
      description: 'هر ۱۰۰ امتیاز = یک سطح',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Award,
      label: 'نشان',
      value: badgeCount,
      description: 'با دستاوردها، نشان کسب کن',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Trophy,
      label: 'رتبه',
      value: rank > 0 ? `#${rank}` : '-',
      description: 'رتبه‌ت در جدول امتیازات',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <Card className="border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-2">
            <TrendingUp className="h-5 w-5 text-tm-green" />
            <CardTitle className="text-gray-900">مسیر پیشرفت</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  مسیر پیشرفت: امتیاز → سطح → نشان → رتبه
                  <br />
                  با رأی دادن و فعالیت، امتیاز بگیر و سطحت رو بالا ببر
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="mt-1">
          مسیر پیشرفت تو در سیستم گیمیفیکیشن
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-4 rounded-lg border-2 border-gray-200 hover:border-tm-green transition-all cursor-help ${step.bgColor}`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`p-2 rounded-lg ${step.bgColor}`}>
                            <Icon className={`h-6 w-6 ${step.color}`} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{step.value}</p>
                            <p className="text-xs text-gray-600 mt-1">{step.label}</p>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{step.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Level Progress */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                پیشرفت به سطح {currentLevel + 1}
              </span>
              <span className="font-bold text-tm-green">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {Math.floor(currentPoints % 100)} / 100 امتیاز
              </span>
              <span>
                {pointsToNextLevel} امتیاز تا سطح بعدی
              </span>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-medium">💡 نکته:</p>
            <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
              <li>هر رأی = امتیاز بیشتر</li>
              <li>هر ۱۰۰ امتیاز = یک سطح</li>
              <li>دستاوردها = نشان‌های جدید</li>
              <li>رتبه بالاتر = جایزه بیشتر</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

