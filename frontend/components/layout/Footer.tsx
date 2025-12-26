export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6 md:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} فوتبال آنلاین. تمامی حقوق محفوظ است.
            </p>
            <p className="text-xs text-muted-foreground">
              پلتفرم داده‌های فوتبال ایران با گیمیفیکیشن غذامحور
            </p>
          </div>
          <div className="flex items-center space-x-reverse space-x-4 text-sm text-muted-foreground">
            <span>⚽ 🍕</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

