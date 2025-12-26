'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, TrendingUp, Trophy, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { href: '/', label: 'خانه', icon: Home },
    { href: '/players', label: 'بازیکنان', icon: Users },
    { href: '/rumors', label: 'شایعات', icon: TrendingUp },
    { href: '/leaderboard', label: 'جدول امتیازات', icon: Trophy },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    // Show success message (you can use a toast library here)
    if (typeof window !== 'undefined') {
      alert('با موفقیت از حساب کاربری خارج شدید 👋');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-reverse space-x-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold text-tm-green">
            فوتبال
          </span>
          <span className="text-sm text-gray-600">.آنلاین</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-reverse space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-reverse space-x-1 text-sm font-medium transition-colors',
                  isActive ? 'text-tm-green font-semibold' : 'text-gray-600 hover:text-tm-green'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-reverse space-x-4">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="hidden md:flex items-center space-x-reverse space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">
                    سلام {user?.displayName || user?.username} 👋
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.points || 0} امتیاز
                  </p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="ghost" size="icon" title="پروفایل">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                title="خروج"
                className="border-gray-300 hover:border-red-300 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 ml-2" />
                <span className="hidden md:inline">خروج</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-reverse space-x-2">
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-tm-green hover:bg-tm-green/90">
                  ورود
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
