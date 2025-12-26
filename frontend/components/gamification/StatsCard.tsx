'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: 'green' | 'blue' | 'orange' | 'purple';
}

function StatsCardComponent({ icon: Icon, value, label, color = 'green' }: StatsCardProps) {
  const colorClasses = {
    green: 'bg-tm-green/10 text-tm-green',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const formattedValue = typeof value === 'number' ? value.toLocaleString('fa-IR') : value;

  return (
    <Card className="border-gray-200 hover:border-tm-green hover:shadow-md transition-all duration-200 bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-reverse space-x-3">
          <div className={cn('p-3 rounded-lg transition-transform hover:scale-110', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-900">{formattedValue}</div>
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const StatsCard = memo(StatsCardComponent);

