'use client';

import Link from 'next/link';
import { Instagram, Twitter, Send } from 'lucide-react';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-white transition text-sm" dir="rtl">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-tm-green transition"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Social media link"
    >
      {icon}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚽🍽️</span>
              <span className="text-xl font-bold text-white">Foodball</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" dir="rtl">
              پلتفرم جامع فوتبال ایران با طعمی متفاوت
            </p>
            <div className="flex gap-3">
              <SocialIcon href="#" icon={<Instagram size={20} className="text-gray-300" />} />
              <SocialIcon href="#" icon={<Twitter size={20} className="text-gray-300" />} />
              <SocialIcon href="#" icon={<Send size={20} className="text-gray-300" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4" dir="rtl">
              دسترسی سریع
            </h3>
            <ul className="space-y-2" dir="rtl">
              <FooterLink href="/players">بازیکنان</FooterLink>
              <FooterLink href="/rumors">شایعات نقل‌وانتقالات</FooterLink>
              <FooterLink href="/leaderboard">جدول امتیازات</FooterLink>
              <FooterLink href="/">خانه</FooterLink>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-bold mb-4" dir="rtl">
              جامعه
            </h3>
            <ul className="space-y-2" dir="rtl">
              <FooterLink href="/leaderboard">جدول امتیازات</FooterLink>
              <FooterLink href="/profile">پروفایل</FooterLink>
              <FooterLink href="/activity">فعالیت‌ها</FooterLink>
              <FooterLink href="/badges">نشان‌ها</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4" dir="rtl">
              پشتیبانی
            </h3>
            <ul className="space-y-2" dir="rtl">
              <FooterLink href="/about">درباره ما</FooterLink>
              <FooterLink href="/contact">تماس با ما</FooterLink>
              <FooterLink href="/privacy">حریم خصوصی</FooterLink>
              <FooterLink href="/terms">شرایط استفاده</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" dir="rtl">
            © {new Date().getFullYear()} فودبال. تمامی حقوق محفوظ است.
          </p>
          <p dir="rtl">
              طراحی و اجرا توسط{' '}
              <a
                href="https://alikiani.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tm-green hover:text-green-400 hover:underline transition-colors font-medium"
              >
                علی کیانی
              </a>
            </p>
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-500">
            <p>ساخته شده با ❤️ برای هواداران فوتبال ایران</p>
            <span className="hidden md:inline">•</span>

          </div>
        </div>
      </div>
    </footer>
  );
}
