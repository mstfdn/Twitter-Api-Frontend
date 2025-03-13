// src/pages/Home.jsx
import React from 'react';
import NavMenu from '../components/NavMenu';
import Posts from '../components/Posts';

const Home = () => {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto">
      <div className="w-64">
        <NavMenu />
      </div>
      
      <div className="flex-1">
        <Posts />
      </div>
      
      <div className="w-80 p-4 hidden lg:block">
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Kimi takip etmeli</h2>
          
          <div className="flex items-center mb-3">
            <img src="https://picsum.photos/210/300" alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <p className="font-bold">Ahmet Yılmaz</p>
              <p className="text-gray-500">@ahmetyilmaz</p>
            </div>
            <button className="bg-black text-white font-bold px-4 py-1 rounded-full text-sm">
              Takip Et
            </button>
          </div>
          
          <div className="flex items-center mb-3">
            <img src="https://picsum.photos/220/300" alt="User" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <p className="font-bold">Ayşe Demir</p>
              <p className="text-gray-500">@aysedemir</p>
            </div>
            <button className="bg-black text-white font-bold px-4 py-1 rounded-full text-sm">
              Takip Et
            </button>
          </div>
          
          <div className="flex items-center">
            <img src="https://picsum.photos/200/300" alt="User" className="w-10 h-10 rounded-full mr-3" />
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
        
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Gündemler</h2>
          
          <div className="mb-3">
            <p className="text-gray-500 text-sm">Türkiye'de Gündemde</p>
            <p className="font-bold">#ReactJS</p>
            <p className="text-gray-500 text-sm">5.234 Tweet</p>
          </div>
          
          <div className="mb-3">
            <p className="text-gray-500 text-sm">Teknoloji · Gündemde</p>
            <p className="font-bold">#TailwindCSS</p>
            <p className="text-gray-500 text-sm">3.126 Tweet</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Spor · Gündemde</p>
            <p className="font-bold">#Galatasaray</p>
            <p className="text-gray-500 text-sm">10.547 Tweet</p>
          </div>
          
          <a href="#" className="text-twitter-blue text-sm block mt-3">Daha fazla göster</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
