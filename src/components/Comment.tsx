import React, { useState } from 'react';
import { Reply, ThumbsUp } from 'lucide-react';
import { Comment as CommentType } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import { useCommunityStore } from '../store/communityStore';

interface CommentProps {
  comment: CommentType;
  postId: string;
  onReplyAdded: () => void;
  shouldShowIdentity: boolean;
}

const Comment: React.FC<CommentProps> = ({ comment, postId, onReplyAdded, shouldShowIdentity }) => {
  const { user } = useAuthStore();
  const { addReply, likeComment } = useCommunityStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id });
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      const parentId = comment.parent_id || comment.id;
      
      await addReply(postId, parentId, user.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      onReplyAdded();
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    await likeComment(commentId, user.id);
  };

  const getAnonymousName = (userId: string) => {
    return `Pengguna ${userId.slice(0, 4)}`;
  };

  return (
    <div className="space-y-4">
      {/* Komentar utama */}
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
          {shouldShowIdentity && comment.user?.avatar_url ? (
            <img 
              src={comment.user.avatar_url} 
              alt={comment.user?.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
              {shouldShowIdentity ? (comment.user?.name || 'U').charAt(0) : 'A'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {shouldShowIdentity ? comment.user?.name : getAnonymousName(comment.user?.id || '')}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-1">
            {!comment.parent_id && user && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Reply
              </button>
            )}
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`text-sm flex items-center gap-1 ${
                comment.is_liked 
                  ? 'text-primary-500 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <ThumbsUp size={14} />
              {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
            </button>
          </div>

          {/* Form balasan */}
          {isReplying && (
            <form onSubmit={handleReply} className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isSubmittingReply}
              />
              <button
                type="submit"
                disabled={!replyContent.trim() || isSubmittingReply}
                className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingReply ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Tampilkan balasan dengan indentasi */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                {reply.user?.avatar_url ? (
                  <img 
                    src={reply.user.avatar_url} 
                    alt={reply.user?.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {(reply.user?.name || 'U').charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg px-4 py-2">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {reply.user?.name}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{reply.content}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  <button
                    onClick={() => handleLikeComment(reply.id)}
                    className={`text-sm flex items-center gap-1 ${
                      reply.is_liked 
                        ? 'text-primary-500 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    {reply.likes_count > 0 && <span>{reply.likes_count}</span>}
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
