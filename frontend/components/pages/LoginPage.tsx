'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/profile';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await apiClient.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await apiClient.register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName,
        });
      }

      // Update auth store
      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        
        // Redirect
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/profile';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      }
    } catch (error: any) {
      // Persian error messages
      let errorMessage = 'خطایی رخ داد. لطفاً دوباره تلاش کن.';
      
      if (error.message) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid credentials') || message.includes('نام کاربری یا رمز عبور')) {
          errorMessage = 'نام کاربری یا رمز عبور اشتباه است';
        } else if (message.includes('email already') || message.includes('ایمیل')) {
          errorMessage = 'این ایمیل قبلاً ثبت شده است';
        } else if (message.includes('username') && message.includes('taken')) {
          errorMessage = 'این نام کاربری قبلاً انتخاب شده است';
        } else if (message.includes('unauthorized')) {
          errorMessage = 'برای ادامه، لطفاً وارد حساب کاربری شوید';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
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
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
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
                  placeholder="نام نمایشی (اختیاری)"
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
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال بارگذاری...' : isLogin ? 'ورود' : 'ثبت‌نام'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
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
