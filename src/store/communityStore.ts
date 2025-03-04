import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types/types';

interface CommunityState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (userId: string, content: string, challengeId?: number) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, userId: string, content: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<Comment[]>;
  addReply: (postId: string, parentId: string, userId: string, content: string) => Promise<void>;
  likeComment: (commentId: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  isLoadingComments: boolean;
  isLoadingLike: boolean;
  isLoadingReply: boolean;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  isLoadingComments: false,
  isLoadingLike: false,
  isLoadingReply: false,

  fetchPosts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Fetch posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (postsError) throw postsError;

      // Get current user's likes and user data
      const { data: { user } } = await supabase.auth.getUser();
      let likedPostIds = new Set();
      
      if (user) {
        const { data: userLikes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
          
        likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);
      }

      // Fetch user data and combine with posts
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .eq('id', post.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return post;
          }

          // Get likes count
          const { count } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          return {
            ...post,
            user: userData,
            likes_count: count || 0,
            is_liked: likedPostIds.has(post.id)
          };
        })
      );
      
      set({ posts: postsWithUsers as Post[] });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (userId: string, content: string, challengeId?: number) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content,
          challenge_id: challengeId,
          likes: 0
        });
        
      if (error) throw error;
      
      // Refresh posts
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  likePost: async (postId: string, userId: string) => {
    try {
      set({ isLoadingLike: true, error: null });
      
      // Check if user already liked the post
      const { data: existingLike, error: likeError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (likeError && likeError.code !== 'PGRST116') throw likeError;
      
      if (!existingLike) {
        // Add new like
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });
          
        if (insertError) throw insertError;
        
        // Update local state
        set(state => ({
          posts: state.posts.map(p => 
            p.id === postId 
              ? { 
                  ...p, 
                  likes_count: (p.likes_count || 0) + 1,
                  is_liked: true
                } 
              : p
          )
        }));
      } else {
        // Remove like
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
          
        if (deleteError) throw deleteError;
        
        // Update local state
        set(state => ({
          posts: state.posts.map(p => 
            p.id === postId 
              ? { 
                  ...p, 
                  likes_count: Math.max((p.likes_count || 0) - 1, 0),
                  is_liked: false
                } 
              : p
          )
        }));
      }
    } catch (error) {
      console.error('Error in likePost:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoadingLike: false });
    }
  },

  fetchComments: async (postId: string): Promise<Comment[]> => {
    try {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          user_id,
          post_id,
          parent_id,
          reply_to,
          created_at,
          profiles!comments_user_id_fkey (
            id,
            name,
            avatar_url
          ),
          comment_likes(count)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (commentsError) throw commentsError;

      // Get current user's likes
      const { data: { user } } = await supabase.auth.getUser();
      let likedCommentIds = new Set();
      
      if (user) {
        const { data: userLikes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);
          
        likedCommentIds = new Set(userLikes?.map(like => like.comment_id) || []);
      }

      // Transform comments
      const transformedComments = comments?.map(comment => ({
        ...comment,
        user: comment.profiles,
        likes_count: comment.comment_likes?.[0]?.count || 0,
        is_liked: likedCommentIds.has(comment.id)
      }));

      // Organize into tree structure
      const commentMap = new Map();
      const rootComments: Comment[] = [];

      transformedComments?.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      transformedComments?.forEach((comment) => {
        if (comment.parent_id) {
          const parentComment = commentMap.get(comment.parent_id);
          if (parentComment) {
            parentComment.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });
      
      return rootComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  addComment: async (postId: string, userId: string, content: string) => {
    try {
      set({ isLoadingComments: true, error: null });
      
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;

      // Update post's comment count in local state
      set(state => ({
        posts: state.posts.map(p => 
          p.id === postId 
            ? { ...p, comments_count: (p.comments_count || 0) + 1 }
            : p
        )
      }));

      // Refresh comments for this post
      await get().fetchComments(postId);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      set({ isLoadingComments: false });
    }
  },

  addReply: async (postId: string, parentId: string, userId: string, content: string) => {
    try {
      set({ isLoadingReply: true, error: null });
      
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', parentId)
        .single();
        
      if (parentError) throw parentError;

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          parent_id: parentId,
          reply_to: parentComment.user_id
        });
        
      if (error) throw error;

      // Refresh comments for this post
      await get().fetchComments(postId);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoadingReply: false });
    }
  },

  likeComment: async (commentId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user already liked the comment
      const { data: existingLike, error: likeError } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (likeError && likeError.code !== 'PGRST116') {
        throw likeError;
      }
      
      if (!existingLike) {
        // Add new like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({ 
            comment_id: commentId, 
            user_id: userId,
            created_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      } else {
        // Remove like if it exists
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);
          
        if (deleteError) throw deleteError;
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePost: async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Update posts list after deletion
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId)
      }));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
}));

