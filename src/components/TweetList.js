// src/components/TweetList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TweetList = () => {
  const navigate = useNavigate();
  
  // Bu bileşen artık kullanılmıyor, ana sayfaya yönlendirelim
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return <div>Yönlendiriliyor...</div>;
};

export default TweetList;
