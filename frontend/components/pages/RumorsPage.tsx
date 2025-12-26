'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export function RumorsPage() {
  const [rumors, setRumors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    fetchRumors();
  }, [page]);

  async function fetchRumors() {
    setLoading(true);
    try {
      const response = await apiClient.getRumors({
        page,
        limit: 12,
        status: 'active',
        sortBy: 'probability',
        sortOrder: 'desc',
      });
      setRumors(response.data?.rumors || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching rumors:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(rumorId: string, probability: number) {
    setVoting(rumorId);
    try {
      await apiClient.voteOnRumor(rumorId, probability);
      // Optimistic update
      fetchRumors();
    } catch (error) {
      console.error('Error voting:', error);
      alert('خطا در ثبت رأی. لطفاً دوباره تلاش کن.');
    } finally {
      setVoting(null);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <TrendingUp className="h-4 w-4 text-primary" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'denied':
        return 'destructive';
      case 'expired':
        return 'secondary';
      default:
        return 'default';
    }
  }

  function getStatusLabel(status: string) {
    const labels: { [key: string]: string } = {
      'active': 'فعال',
      'confirmed': 'تأیید شده',
      'denied': 'رد شده',
      'expired': 'منقضی شده',
    };
    return labels[status] || status;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">شایعات نقل‌وانتقالات 🔥</h1>
          <p className="text-muted-foreground">روی احتمال نقل‌وانتقالات رأی بده و آخرین شایعات رو دنبال کن</p>
        </div>
      </div>

      {/* Rumors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : rumors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">هنوز شایعه‌ای ثبت نشده، تو اولین شایعه رو ثبت کن! 🍕</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rumors.map((rumor) => (
            <Card
              key={rumor._id}
              className="hover:border-food-orange transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 p-2">
                {getStatusIcon(rumor.status)}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between pl-8">
                  <div className="flex-1">
                    <Link href={`/rumors/${rumor._id}`}>
                      <CardTitle className="hover:text-food-orange transition-colors cursor-pointer">
                        {rumor.player?.fullName || 'بازیکن نامشخص'}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-1">
                      {rumor.fromClub?.name || 'آزاد'} → {rumor.toClub?.name}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusColor(rumor.status) as any}>
                    {getStatusLabel(rumor.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rumor.probability}% احتمال
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">احتمال جامعه</span>
                    <span className="font-bold text-primary">{rumor.probability}%</span>
                  </div>
                  <Progress value={rumor.probability} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{rumor.voteCount || 0} رأی</span>
                    <span>{rumor.upvotes || 0} موافق • {rumor.downvotes || 0} مخالف</span>
                  </div>
                </div>

                {rumor.estimatedFee && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">حق‌الزحمه تخمینی: </span>
                    <span className="font-semibold">{formatCurrency(rumor.estimatedFee)}</span>
                  </div>
                )}

                {rumor.status === 'active' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleVote(rumor._id, 75)}
                      disabled={voting === rumor._id}
                    >
                      {voting === rumor._id ? 'در حال رأی...' : 'بله (75%)'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleVote(rumor._id, 25)}
                      disabled={voting === rumor._id}
                    >
                      {voting === rumor._id ? 'در حال رأی...' : 'خیر (25%)'}
                    </Button>
                  </div>
                )}

                {rumor.reportedAt && (
                  <p className="text-xs text-muted-foreground">
                    ثبت شده در {formatDate(rumor.reportedAt)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-reverse space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {page} از {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}
