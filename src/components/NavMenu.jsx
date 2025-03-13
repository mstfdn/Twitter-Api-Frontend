// src/components/NavMenu.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import NavMenuItem from './NavMenuItem';

const NavMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    toast.success('Çıkış yapıldı');
    navigate('/login');
  };
  
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between w-64 py-4">
      <div>
        {/* Twitter Logo */}
        <div className="px-4 mb-6">
          <Link to="/">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-twitter-blue" fill="currentColor">
              <g>
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
              </g>
            </svg>
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav>
          <NavMenuItem to="/" icon="home" text="Ana Sayfa" />
          <NavMenuItem to="/explore" icon="search" text="Keşfet" />
          <NavMenuItem to="/notifications" icon="bell" text="Bildirimler" />
          <NavMenuItem to="/messages" icon="mail" text="Mesajlar" />
          <NavMenuItem to="/bookmarks" icon="bookmark" text="Yer İşaretleri" />
          <NavMenuItem to="/lists" icon="list" text="Listeler" />
          <NavMenuItem to={`/profile/${user?.username}`} icon="user" text="Profil" />
          <NavMenuItem to="/more" icon="more" text="Daha Fazla" />
        </nav>
        
        {/* Tweet Button */}
        <div className="px-4 mt-4">
          <button className="bg-[#1DA1F2] text-white font-bold py-3 px-4 rounded-full w-full active:bg-[#1a91da] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150">
            Tweet
          </button>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="px-4">
        <div className="flex items-center p-3 rounded-full hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
          <img 
            src={user?.profilePic || "https://via.placeholder.com/40"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-grow">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">@{user?.username}</p>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
