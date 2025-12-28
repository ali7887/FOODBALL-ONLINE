'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  icon?: string | React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title = 'مشکلی پیش آمد',
  description = 'نتوانستیم اطلاعات را دریافت کنیم. لطفاً دوباره تلاش کنید.',
  action,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn('border-gray-200 bg-white', className)}>
      <CardContent className="p-12 text-center">
        {icon ? (
          <div className="text-6xl mb-4">
            {typeof icon === 'string' ? <span>{icon}</span> : icon}
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex justify-center gap-2">
          {action}
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="border-gray-300 hover:border-tm-green hover:text-tm-green">
              تلاش مجدد
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

