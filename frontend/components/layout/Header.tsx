'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, TrendingUp, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'خانه', icon: Home },
    { href: '/players', label: 'بازیکنان', icon: Users },
    { href: '/rumors', label: 'شایعات', icon: TrendingUp },
    { href: '/leaderboard', label: 'جدول امتیازات', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-food-orange bg-clip-text text-transparent">
            Foodball
          </span>
          <span className="text-sm text-muted-foreground">.online</span>
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
                  'flex items-center space-x-reverse space-x-1 text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-reverse space-x-4">
          <Link href="/login">
            <Button variant="outline" size="sm">
              ورود
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

