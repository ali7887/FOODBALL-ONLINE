import { ActivityFeedPage } from '@/components/pages/ActivityFeedPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <ActivityFeedPage />
    </ProtectedRoute>
  );
}

