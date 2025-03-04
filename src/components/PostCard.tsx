import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { Post, Comment as CommentType } from '../types';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Comment from './Comment';
import CommentSkeleton from './CommentSkeleton';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuthStore();
  const { likePost, addComment, fetchComments, deletePost, isLoadingComments, isLoadingLike } = useCommunityStore();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const isModerator = post.user?.id === '77f82615-bc6b-42a9-9cde-27d670d7baaa';
  const shouldShowIdentity = isModerator || post.user?.email === 'naufalaury10@gmail.com';

  const getAnonymousName = (userId: string) => {
    return `Pengguna ${userId.slice(0, 4)}`;
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    try {
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    await likePost(post.id, user.id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    await addComment(post.id, user.id, newComment);
    setNewComment('');
    await loadComments();
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) return;
    
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      try {
        await deletePost(post.id);
        // Post akan dihapus otomatis dari daftar karena state management
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden ${
      isModerator ? 'border-2 border-primary-500 dark:border-primary-600' : ''
    }`}>
      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
            {shouldShowIdentity && post.user?.avatar_url ? (
              <img 
                src={post.user.avatar_url} 
                alt={post.user?.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {shouldShowIdentity ? (post.user?.name || 'U').charAt(0) : 'A'}
              </span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {shouldShowIdentity ? post.user?.name : getAnonymousName(post.user?.id || '')}
                  </p>
                  {isModerator && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                      Moderator
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.created_at)}</p>
              </div>
              {user && (user.id === post.user_id || user.id === '77f82615-bc6b-42a9-9cde-27d670d7baaa') && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Hapus postingan"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className={`text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line ${
          isModerator ? 'font-medium' : ''
        }`}>{post.content}</p>

        {/* Post Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center gap-1 transition-colors ${
              post.is_liked 
                ? 'text-red-500 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart 
              className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} 
            />
            <span>{post.likes_count || 0}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            {/* Comment Form */}
            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="space-y-4">
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </div>
            ) : (
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      onReplyAdded={loadComments}
                      shouldShowIdentity={
                        comment.user?.id === '77f82615-bc6b-42a9-9cde-27d670d7baaa' ||
                        comment.user?.email === 'naufalaury10@gmail.com'
                      }
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

