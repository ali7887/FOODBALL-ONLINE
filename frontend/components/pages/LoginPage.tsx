'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await apiClient.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await apiClient.register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName,
        });
      }
      router.push('/profile');
    } catch (error: any) {
      alert(error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کن.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? 'ورود' : 'ثبت‌نام'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'اطلاعات حساب کاربری‌ات رو وارد کن'
              : 'حساب کاربری جدید بساز و شروع کن'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  placeholder="نام کاربری"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  placeholder="نام نمایشی"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </>
            )}
            <Input
              type="email"
              placeholder="ایمیل"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال بارگذاری...' : isLogin ? 'ورود' : 'ثبت‌نام'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'حساب کاربری نداری؟ ثبت‌نام کن' : 'حساب کاربری داری؟ وارد شو'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← بازگشت به خانه
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
