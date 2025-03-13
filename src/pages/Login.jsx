// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    
    const success = await dispatch(login({ username, password }));
    
    if (success) {
      toast.success('Giriş başarılı!');
      navigate('/');
    } else {
      toast.error(error || 'Giriş başarısız');
    }
  };
  
  // Butonun aktif/pasif durumunu belirleyen değişken
  const isButtonDisabled = !username || !password;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-twitter-background">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-twitter-blue" fill="currentColor">
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Twitter'a giriş yap</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
            />
          </div>
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`
                ${isButtonDisabled ? 'bg-gray-700 text-gray-300' : 'bg-[#1DA1F2] hover:bg-[#1a91da]'} 
                text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-200
              `}
              disabled={loading || isButtonDisabled}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>
          )}
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Test için: kullanıcı adı: mustafa, şifre: 1234</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
