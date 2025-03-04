import React, { useState } from 'react';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';

const CreatePostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const { createPost } = useCommunityStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    await createPost(user.id, content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bagikan pengalaman Ramadhanmu..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-3"
        rows={3}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Posting
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
