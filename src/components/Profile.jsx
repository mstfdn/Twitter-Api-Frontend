// src/components/Profile.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfileComponent = ({ profileUser }) => {
  const { user } = useSelector(state => state.auth);
  const isCurrentUser = user?.id === profileUser?.id;
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="h-48 bg-twitter-blue"></div>
      
      <div className="px-4 py-3 relative">
        <div className="absolute -top-16">
          <img 
            src={profileUser?.profilePic || "https://via.placeholder.com/150"} 
            alt={profileUser?.name} 
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
        
        <div className="mt-16 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{profileUser?.name}</h1>
            <p className="text-gray-500">@{profileUser?.username}</p>
          </div>
          
          {isCurrentUser ? (
            <button className="border border-twitter-blue text-twitter-blue font-bold px-4 py-2 rounded-full hover:bg-blue-50">
              Profili Düzenle
            </button>
          ) : (
            <button className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600">
              Takip Et
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <p className="mb-2">Twitter klonu projesi için örnek profil açıklaması.</p>
          
          <div className="flex text-gray-500 text-sm">
            <div className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Türkiye
            </div>
            <div className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <a href="#" className="text-twitter-blue">example.com</a>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ocak 2023 tarihinde katıldı
            </div>
          </div>
          
          <div className="flex mt-4">
            <div className="mr-4">
              <span className="font-bold">120</span> <span className="text-gray-500">Takip edilen</span>
            </div>
            <div>
              <span className="font-bold">250</span> <span className="text-gray-500">Takipçi</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200">
        <button className="flex-1 py-3 font-bold text-center hover:bg-gray-100 border-b-2 border-twitter-blue">
          Tweetler
        </button>
        <button className="flex-1 py-3 text-center hover:bg-gray-100 text-gray-500">
          Tweetler ve Yanıtlar
        </button>
        <button className="flex-1 py-3 text-center hover:bg-gray-100 text-gray-500">
          Medya
        </button>
        <button className="flex-1 py-3 text-center hover:bg-gray-100 text-gray-500">
          Beğeniler
        </button>
      </div>
    </div>
  );
};

export default ProfileComponent;
