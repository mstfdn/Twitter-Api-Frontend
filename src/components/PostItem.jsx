// src/components/PostItem.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { likePost, retweetPost, unretweetPost, deletePost, addComment } from '../redux/slices/postsSlice';
import DeleteConfirmModal from './DeleteConfirmModal';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Yorum alanını ve yorumları göstermek için tek bir state kullanıyoruz
  const [showComments, setShowComments] = useState(false);
  // Yorum içeriğini tutmak için state ekliyoruz
  const [commentText, setCommentText] = useState('');
  
  // post.id veya post._id kullanımını kontrol edelim
  const postId = post.id || post._id;
  
  const handleLike = () => {
    dispatch(likePost(postId));
  };
  
  const handleRetweet = () => {
    // Eğer tweet zaten retweet edilmişse, unretweet işlemi yapıyoruz
    if (post.isRetweeted) {
      dispatch(unretweetPost(postId));
    } else {
      dispatch(retweetPost(postId));
    }
  };
  
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  
  const confirmDelete = () => {
    dispatch(deletePost(postId));
    setShowDeleteModal(false);
  };
  
  // Yorum formunu açıp kapatan fonksiyon
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  // Yorum gönderme fonksiyonu
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      // Redux action'ını çağır
      dispatch(addComment({ 
        postId, 
        content: commentText 
      }));
      // Formu temizle
      setCommentText('');
    }
  };
  
  return (
    <>
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
              <button 
                onClick={toggleComments}
                className="flex items-center text-gray-500 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{Array.isArray(post.comments) ? post.comments.length : (post.commentCount || 0)}</span>
              </button>
              
              <button 
                onClick={handleRetweet}
                className={`flex items-center ${post.isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'}`}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" 
                fill={post.isRetweeted ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor">
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
              
              <button 
                onClick={openDeleteModal}
                className="flex items-center text-gray-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Sil</span>
              </button>
            </div>
            
            {/* Yorum formu ve yorumlar sadece showComments true olduğunda görünecek */}
            {showComments && (
              <div className="mt-3">
                {/* Yorum formu */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Yorum yaz..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={!commentText.trim()}
                  >
                    Gönder
                  </button>
                </div>
                
                {/* Yorumlar */}
                {Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div className="border-t pt-3">
                    <h3 className="font-bold text-gray-700 mb-2">Yorumlar</h3>
                    {post.comments.map((comment, index) => (
                      <div key={comment.id || index} className="mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold mr-1">
                            {comment.user?.username || 'Anonim'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                          </span>
                        </div>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        postContent={post.content}
      />
    </>
  );
};

export default PostItem;
