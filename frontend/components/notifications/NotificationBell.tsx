'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Award, TrendingUp, Star, Gift } from 'lucide-react';
// Simple time formatter - replace with date-fns if needed
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 7) return `${days} روز پیش`;
  return date.toLocaleDateString('fa-IR');
}

interface Notification {
  id: string;
  type: 'badge' | 'level' | 'daily' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  unreadCount?: number;
}

export function NotificationBell({ notifications = [], unreadCount = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return <Award className="h-5 w-5 text-tm-green" />;
      case 'level':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'daily':
        return <Gift className="h-5 w-5 text-blue-500" />;
      case 'achievement':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'badge':
        return 'bg-tm-green/10 border-tm-green/20';
      case 'level':
        return 'bg-yellow-50 border-yellow-200';
      case 'daily':
        return 'bg-blue-50 border-blue-200';
      case 'achievement':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Mock notifications - replace with real API data
  const mockNotifications: Notification[] = notifications.length > 0 
    ? notifications 
    : [
        {
          id: '1',
          type: 'badge',
          title: 'نشان جدید!',
          message: 'نشان "اولین رأی" را کسب کردی',
          timestamp: new Date(Date.now() - 3600000),
          read: false,
        },
        {
          id: '2',
          type: 'level',
          title: 'سطح بالا رفت!',
          message: 'تبریک! به سطح ۵ رسیدی',
          timestamp: new Date(Date.now() - 7200000),
          read: false,
        },
        {
          id: '3',
          type: 'daily',
          title: 'پاداش روزانه',
          message: 'چالش روزانه تکمیل شد! +50 امتیاز',
          timestamp: new Date(Date.now() - 86400000),
          read: true,
        },
      ];

  const unreadNotifications = mockNotifications.filter(n => !n.read);
  const displayCount = unreadCount > 0 ? unreadCount : unreadNotifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        title="اعلان‌ها"
      >
        <Bell className="h-5 w-5" />
        {displayCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-0">
            {displayCount > 9 ? '9+' : displayCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 md:w-96 z-50">
          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="bg-tm-green text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">اعلان‌ها</CardTitle>
                {displayCount > 0 && (
                  <Badge className="bg-white/20 text-white border-0">
                    {displayCount} خوانده نشده
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {mockNotifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">هیچ اعلانی وجود ندارد</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-tm-green/5' : ''
                      } ${getNotificationColor(notification.type)}`}
                    >
                      <div className="flex items-start space-x-reverse space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-tm-green ml-2 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

