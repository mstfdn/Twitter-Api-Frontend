// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavMenu from '../components/NavMenu';
import ProfileComponent from '../components/Profile';
import PostItem from '../components/PostItem';

const Profile = () => {
  const { username } = useParams();
  const { posts } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  
  useEffect(() => {
    // Gerçek projede API'den kullanıcı bilgilerini çekersiniz
    // Şimdilik mevcut kullanıcıyı veya örnek bir kullanıcı gösterelim
    if (user?.username === username) {
      setProfileUser(user);
    } else {
      // Örnek kullanıcı
      setProfileUser({
        id: 2,
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        profilePic: 'https://via.placeholder.com/150',
      });
    }
    
    // Kullanıcının tweetlerini filtrele
    const filteredPosts = posts.filter(post => post.user.username === username);
    setUserPosts(filteredPosts);
  }, [username, user, posts]);
  
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto">
      <div className="w-64">
        <NavMenu />
      </div>
      
      <div className="flex-1 border-l border-r border-gray-200">
        <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200 flex items-center">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">{profileUser?.name}</h1>
            <p className="text-gray-500 text-sm">{userPosts.length} Tweet</p>
          </div>
        </div>
        
        {profileUser && <ProfileComponent profileUser={profileUser} />}
        
        {userPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
        
        {userPosts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-xl font-bold mb-2">Henüz tweet yok</p>
            <p>Bu kullanıcı henüz tweet paylaşmamış.</p>
          </div>
        )}
      </div>
      
      <div className="w-80 p-4 hidden lg:block">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Kimi takip etmeli</h2>
          
          <div className="flex items-center mb-3">
            <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <p className="font-bold">Ahmet Yılmaz</p>
              <p className="text-gray-500">@ahmetyilmaz</p>
            </div>
            <button className="bg-black text-white font-bold px-4 py-1 rounded-full text-sm">
              Takip Et
            </button>
          </div>
          
          <div className="flex items-center">
            <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <p className="font-bold">Mehmet Kaya</p>
              <p className="text-gray-500">@mehmetkaya</p>
            </div>
            <button className="bg-black text-white font-bold px-4 py-1 rounded-full text-sm">
              Takip Et
            </button>
          </div>
          
          <a href="#" className="text-twitter-blue text-sm block mt-3">Daha fazla göster</a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
