'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { feedApi } from '@/lib/api/feed';
import { FeedItemRenderer } from './FeedItemRenderer';
import { FeedItemSkeleton } from '@/components/ui/feed-item-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { PersonalizedFeedItem, FeedSourceType, GetPersonalizedFeedParams } from '@/types/feed';
import { TrendingUp, Clock, Star, Filter } from 'lucide-react';

interface PersonalizedFeedProps {
  initialItems?: PersonalizedFeedItem[];
  showFilters?: boolean;
  showSortOptions?: boolean;
}

export function PersonalizedFeed({
  initialItems = [],
  showFilters = true,
  showSortOptions = true,
}: PersonalizedFeedProps) {
  const [items, setItems] = useState<PersonalizedFeedItem[]>(initialItems);
  const [loading, setLoading] = useState(!initialItems.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [filterBy, setFilterBy] = useState<FeedSourceType[]>([]);
  const [hasPreferences, setHasPreferences] = useState(false);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetPersonalizedFeedParams = {
        page,
        limit: 20,
        sortBy,
        ...(filterBy.length > 0 && { filterBy }),
        includeFollowed: true,
      };

      const response = await feedApi.getPersonalizedFeed(params);
      setItems(response.items || []);
      setTotalPages(response.pagination?.pages || 1);
      setHasPreferences(response.preferences?.hasPreferences || false);
    } catch (error) {
      console.error('Error fetching personalized feed:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, filterBy]);

  useEffect(() => {
    if (!initialItems.length) {
      fetchFeed();
    }
  }, [fetchFeed, initialItems.length]);

  const handleSortChange = useCallback((newSort: 'relevance' | 'date' | 'popularity') => {
    setSortBy(newSort);
    setPage(1);
  }, []);

  const handleFilterToggle = useCallback((type: FeedSourceType) => {
    setFilterBy((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
    setPage(1);
  }, []);

  const memoizedItems = useMemo(() => items, [items]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <FeedItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort & Filter Controls */}
      {(showSortOptions || showFilters) && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Sort Options */}
              {showSortOptions && (
                <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center space-x-reverse space-x-1">
                    <Star className="h-4 w-4" />
                    <span>مرتب‌سازی:</span>
                  </span>
                  <Button
                    variant={sortBy === 'relevance' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('relevance')}
                    className={sortBy === 'relevance' ? 'bg-tm-green hover:bg-tm-green/90' : ''}
                  >
                    <Star className="h-3 w-3 ml-1" />
                    مرتبط‌ترین
                  </Button>
                  <Button
                    variant={sortBy === 'date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('date')}
                    className={sortBy === 'date' ? 'bg-tm-green hover:bg-tm-green/90' : ''}
                  >
                    <Clock className="h-3 w-3 ml-1" />
                    جدیدترین
                  </Button>
                  <Button
                    variant={sortBy === 'popularity' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('popularity')}
                    className={sortBy === 'popularity' ? 'bg-tm-green hover:bg-tm-green/90' : ''}
                  >
                    <TrendingUp className="h-3 w-3 ml-1" />
                    محبوب‌ترین
                  </Button>
                </div>
              )}

              {/* Filter Options */}
              {showFilters && (
                <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center space-x-reverse space-x-1">
                    <Filter className="h-4 w-4" />
                    <span>فیلتر:</span>
                  </span>
                  {(['player', 'team', 'rumor', 'news', 'activity'] as FeedSourceType[]).map((type) => (
                    <Button
                      key={type}
                      variant={filterBy.includes(type) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterToggle(type)}
                      className={filterBy.includes(type) ? 'bg-tm-green hover:bg-tm-green/90' : ''}
                    >
                      {type === 'player' && 'بازیکن'}
                      {type === 'team' && 'تیم'}
                      {type === 'rumor' && 'شایعه'}
                      {type === 'news' && 'خبر'}
                      {type === 'activity' && 'فعالیت'}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feed Items */}
      {items.length === 0 ? (
        <EmptyState
          icon="📰"
          title={!hasPreferences ? 'فید شخصی‌سازی شده‌ات خالیه!' : 'هیچ محتوایی پیدا نشد'}
          description={
            !hasPreferences
              ? 'برای دیدن محتوای مرتبط، بازیکنان و تیم‌های مورد علاقه‌ات رو دنبال کن'
              : 'لطفاً فیلترها رو تغییر بده یا بعداً دوباره امتحان کن'
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {memoizedItems.map((item) => (
              <FeedItemRenderer key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-reverse space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-300 hover:border-tm-green hover:text-tm-green"
              >
                قبلی
              </Button>
              <span className="text-sm text-gray-600 px-4">
                صفحه {page} از {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gray-300 hover:border-tm-green hover:text-tm-green"
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

