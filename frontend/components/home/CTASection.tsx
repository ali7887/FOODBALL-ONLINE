'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export function CTASection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-20 bg-gradient-to-br from-tm-green to-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6">⚽🍽️</div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4" dir="rtl">
            به جامعه فودبال بپیوندید
          </h2>

          <p className="text-xl text-white/90 mb-8 leading-relaxed" dir="rtl">
            رأی بدهید، پیش‌بینی کنید، و با هزاران هوادار فوتبال تعامل داشته باشید
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="px-8 py-4 bg-white text-tm-green rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    ثبت‌نام رایگان
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition"
                  >
                    بیشتر بدانید
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/players">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-white text-tm-green rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  شروع کنید
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold mb-1" dir="ltr">
                ۱۲K+
              </p>
              <p className="text-sm text-white/80" dir="rtl">
                کاربر فعال
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1" dir="ltr">
                ۵۰۰K+
              </p>
              <p className="text-sm text-white/80" dir="rtl">
                رأی ثبت‌شده
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1" dir="ltr">
                ۱۵۰+
              </p>
              <p className="text-sm text-white/80" dir="rtl">
                بازیکن
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

