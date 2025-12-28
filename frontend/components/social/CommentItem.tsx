'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LikeButton } from './LikeButton';
import { MentionText } from './MentionText';
import { UserTitleBadge } from '@/components/profile/UserTitleBadge';
import { Trash2, Reply } from 'lucide-react';
import { commentsApi } from '@/lib/api/comments';
import { useAuthStore } from '@/store/useAuthStore';
import type { Comment } from '@/types/comments';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
  onReply?: (parentId: string) => void;
  showReplies?: boolean;
}

export function CommentItem({ comment, onDelete, onReply, showReplies = true }: CommentItemProps) {
  const { user: currentUser } = useAuthStore();
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUser?._id === comment.author.id;

  const handleDelete = async () => {
    if (!confirm('آیا مطمئنی که می‌خوای این نظر رو حذف کنی؟')) {
      return;
    }

    setDeleting(true);
    try {
      await commentsApi.delete(comment.id);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('خطا در حذف نظر');
    } finally {
      setDeleting(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: faIR,
  });

  return (
    <Card className="border-gray-200 hover:border-tm-green/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start space-x-reverse space-x-3">
          <Avatar className="h-10 w-10 border-2 border-gray-200 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback className="bg-tm-green text-white">
              {comment.author.displayName?.[0] || comment.author.username[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center space-x-reverse space-x-2 mb-1 flex-wrap gap-1">
                  <Link
                    href={`/users/${comment.author.username}`}
                    className="font-semibold text-gray-900 text-sm hover:text-tm-green transition-colors"
                  >
                    {comment.author.displayName || comment.author.username}
                  </Link>
                  {comment.author.title && (
                    <UserTitleBadge title={comment.author.title as any} size="sm" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{timeAgo}</p>
              </div>
              
              <div className="flex items-center space-x-reverse space-x-2">
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="حذف نظر"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(comment.id)}
                    className="text-gray-600 hover:text-tm-green hover:bg-gray-50"
                    title="پاسخ"
                  >
                    <Reply className="h-4 w-4 ml-1" />
                    پاسخ
                  </Button>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap">
              <MentionText text={comment.content} mentions={comment.mentions} />
            </div>

            <div className="flex items-center space-x-reverse space-x-2">
              <LikeButton
                targetType="comment"
                targetId={comment.id}
                initialLiked={comment.isLikedByUser}
                initialCount={comment.likesCount}
              />
            </div>

            {/* Replies */}
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pr-4 border-r-2 border-gray-200 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onDelete={onDelete}
                    showReplies={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
