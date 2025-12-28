'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn('border-gray-200 bg-white', className)}>
      <CardContent className="p-12 text-center">
        {icon && (
          <div className="text-6xl mb-4">
            {typeof icon === 'string' ? <span>{icon}</span> : icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="flex justify-center">{action}</div>}
      </CardContent>
    </Card>
  );
}

