'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LikeButton } from './LikeButton';
import { MentionText } from './MentionText';
import { UserTitleBadge } from '@/components/profile/UserTitleBadge';
import { Trash2, Reply, Clock } from 'lucide-react';
import { commentsApi } from '@/lib/api/comments';
import { useAuthStore } from '@/store/useAuthStore';
import type { Comment } from '@/types/comments';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
  onReply?: (parentId: string) => void;
  showReplies?: boolean;
  isReply?: boolean;
}

export function CommentItem({ comment, onDelete, onReply, showReplies = true, isReply = false }: CommentItemProps) {
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
    <Card className={cn(
      'bg-white border border-gray-200 rounded-lg hover:border-tm-green/30 transition-colors duration-150',
      isReply && 'bg-gray-50/50'
    )}>
      <CardContent className="p-0">
        {/* Header: User + Timestamp - Small, Gray Meta */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className={cn(
              'border border-gray-200 flex-shrink-0',
              isReply ? 'h-8 w-8' : 'h-10 w-10'
            )}>
              <AvatarImage src={comment.author.avatar} loading="lazy" />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {comment.author.displayName?.[0] || comment.author.username[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/users/${comment.author.username}`}
                  className={cn(
                    'hover:text-tm-green transition-colors',
                    isReply ? 'text-sm font-medium text-gray-700' : 'text-sm font-bold text-gray-900'
                  )}
                >
                  {comment.author.displayName || comment.author.username}
                </Link>
                {comment.author.title && (
                  <UserTitleBadge title={comment.author.title as any} size="sm" />
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-[11px] text-gray-500">{timeAgo}</span>
              </div>
            </div>
          </div>
          
          {/* Actions: Minimal, Top-right */}
          <div className="flex items-center gap-1">
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="حذف نظر"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onReply && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-tm-green hover:bg-gray-50"
                title="پاسخ"
              >
                <Reply className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Content: Readable, Normal Weight - Primary Focus */}
        <div className={cn(
          'px-4 py-3',
          isReply && 'px-3 py-2'
        )}>
          <div className={cn(
            'text-gray-700 leading-relaxed whitespace-pre-wrap',
            isReply ? 'text-sm' : 'text-base'
          )}>
            <MentionText text={comment.content} mentions={comment.mentions} />
          </div>
        </div>

        {/* Footer: Minimal Actions */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50/50">
          <LikeButton
            targetType="comment"
            targetId={comment.id}
            initialLiked={comment.isLikedByUser}
            initialCount={comment.likesCount}
            size="sm"
          />
        </div>

        {/* Replies: Indented, Lighter */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50/30">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
                showReplies={false}
                isReply={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
