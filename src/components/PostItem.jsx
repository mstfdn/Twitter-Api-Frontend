// src/components/PostItem.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { likePost, retweetPost } from '../redux/slices/postsSlice';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  
  // post.id veya post._id kullanımını kontrol edelim
  const postId = post.id || post._id;
  
  const handleLike = () => {
    dispatch(likePost(postId));
  };
  
  const handleRetweet = () => {
    dispatch(retweetPost(postId));
  };
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex">
        <img 
          src={post.user?.profilePic || "https://i.pravatar.cc/200"} 
          alt="Profile" 
          className="w-12 h-12 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-bold mr-1">{post.user?.name || post.username || 'İsimsiz'}</span>
            <span className="text-gray-500">@{post.user?.username || post.username || 'anonim'}</span>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Tarih yok'}
            </span>
          </div>
          
          <p className="mt-2 mb-3">{post.content}</p>
          
          <div className="flex justify-between max-w-md">
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments || 0}</span>
            </button>
            
            <button 
              onClick={handleRetweet}
              className="flex items-center text-gray-500 hover:text-green-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{post.retweets || 0}</span>
            </button>
            
            <button 
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes || 0}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
