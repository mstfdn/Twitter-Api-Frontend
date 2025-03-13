// src/components/Posts.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost } from '../redux/slices/postsSlice';
import PostItem from './PostItem';
import { toast } from 'react-toastify';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log('Fetching posts...');
        const resultAction = await dispatch(fetchPosts());
        console.log('Fetch result:', resultAction);
        
        if (fetchPosts.rejected.match(resultAction)) {
          console.error('Failed to fetch posts:', resultAction.error);
        } else if (fetchPosts.fulfilled.match(resultAction)) {
          console.log('Posts fetched successfully:', resultAction.payload);
        }
      } catch (error) {
        console.error('Error in loadPosts:', error);
      }
    };
    
    loadPosts();
  }, [dispatch]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      toast.error('Tweet içeriği boş olamaz!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Creating post with content:', newPostContent);
      
      const resultAction = await dispatch(createPost({
        content: newPostContent
      }));
      
      console.log('Create post result:', resultAction);
      
      if (createPost.fulfilled.match(resultAction)) {
        setNewPostContent('');
        toast.success('Tweet paylaşıldı!');
        // Tweet başarıyla oluşturulduktan sonra tweetleri yeniden çekelim
        dispatch(fetchPosts());
      } else {
        const errorMessage = resultAction.error?.message || 'Tweet paylaşılırken bir hata oluştu';
        toast.error(errorMessage);
        console.error('Tweet oluşturma hatası:', resultAction.error);
      }
    } catch (error) {
      toast.error('Tweet paylaşılırken bir hata oluştu');
      console.error('Tweet oluşturma hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Ana Sayfa</h1>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <img 
              src={user?.profilePic || "https://via.placeholder.com/40"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <textarea
                className="w-full border-none resize-none focus:outline-none text-lg placeholder-gray-500 mb-3"
                placeholder="Neler oluyor?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
              ></textarea>
              
              <div className="flex justify-between items-center">
                <div className="flex text-twitter-blue">
                  <button type="button" className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button type="button" className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button type="button" className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPostContent.trim()}
                  className={`bg-[#1DA1F2] text-white font-bold py-2 px-4 rounded-full ${
                    isSubmitting || !newPostContent.trim() ? 'opacity-50 cursor-not-allowed' : 'active:bg-[#1a91da]'
                  }`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Tweet'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">
          <p>Tweet'ler yüklenirken bir hata oluştu:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Detaylı hata bilgisi için konsolu kontrol edin.</p>
          <button 
            onClick={() => dispatch(fetchPosts())} 
            className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded"
          >
            Yeniden Dene
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Henüz hiç tweet yok. İlk tweeti sen at!
        </div>
      ) : (
        posts.map(post => (
          <PostItem key={post.id || post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default Posts;
