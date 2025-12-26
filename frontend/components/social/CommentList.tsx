'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { Trash2 } from 'lucide-react';
import { ReactionBar } from './ReactionBar';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  content: string;
  mentions?: Array<{
    _id: string;
    username: string;
    displayName?: string;
  }>;
  reactionCounts?: {
    like: number;
    fire: number;
    suspicious: number;
    funny: number;
  };
  createdAt: string;
}

interface CommentListProps {
  entityType: 'player' | 'rumor';
  entityId: string;
  refreshTrigger?: number;
}

export function CommentList({ entityType, entityId, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser } = useAuthStore();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getComments({
        entityType,
        entityId,
        page,
        limit: 10,
      });

      setComments(response.data?.comments || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  const handleDelete = useCallback(
    async (commentId: string) => {
      if (!confirm('آیا مطمئنی که می‌خوای این نظر رو حذف کنی؟')) {
        return;
      }

      try {
        await apiClient.deleteComment(commentId);
        fetchComments();
      } catch (error: any) {
        alert(error.message || 'خطا در حذف نظر');
      }
    },
    [fetchComments]
  );

  // Parse mentions in content
  const parseContent = useCallback((content: string, mentions?: Comment['mentions']) => {
    if (!mentions || mentions.length === 0) {
      return content;
    }

    let parsed = content;
    mentions.forEach((mention) => {
      const regex = new RegExp(`@${mention.username}`, 'g');
      parsed = parsed.replace(
        regex,
        `<span class="text-tm-green font-semibold">@${mention.username}</span>`
      );
    });

    return parsed;
  }, []);

  const memoizedComments = useMemo(() => comments, [comments]);

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="text-5xl mb-4">👀</div>
          <p className="text-gray-600 font-medium">اولین نظر رو تو بنویس ⚽</p>
          <p className="text-sm text-gray-500 mt-2">
            هنوز کسی نظری نذاشته، تو اولین نفر باش!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {memoizedComments.map((comment) => {
        const isOwner = currentUser?._id === comment.user._id;

        return (
          <Card key={comment._id} className="border-gray-200 hover:border-tm-green/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <Avatar className="h-10 w-10 border-2 border-gray-200">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback className="bg-tm-green text-white">
                    {comment.user.displayName?.[0] || comment.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {comment.user.displayName || comment.user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap">
                    {comment.mentions && comment.mentions.length > 0 ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: parseContent(comment.content, comment.mentions),
                        }}
                      />
                    ) : (
                      comment.content
                    )}
                  </div>
                  <ReactionBar
                    targetType="comment"
                    targetId={comment._id}
                    initialCounts={comment.reactionCounts}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

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
    </div>
  );
}

