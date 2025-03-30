import React, { useEffect } from 'react';
import { useCommunityStore } from '../store/communityStore';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';

const CommunityPage: React.FC = () => {
  const { posts, fetchPosts, isLoading } = useCommunityStore();

  useEffect(() => { 
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Komunitas</h1>
        <p className="text-gray-600 dark:text-gray-400">Berbagi pengalaman Ramadhan dengan sesama</p>
      </div>

      <CreatePostForm />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Belum ada postingan. Jadilah yang pertama berbagi!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;

