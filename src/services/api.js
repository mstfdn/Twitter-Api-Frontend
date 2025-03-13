// src/services/api.js
import axios from 'axios';

// API'nin base URL'ini tanımlayalım - doğru URL
const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı
api.interceptors.request.use(
  (config) => {
    // İsteğe token ekleyelim
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Tweet API fonksiyonları
export const tweetAPI = {
  getAllTweets: () => api.get('/tweet'),
  getTweetById: (id) => api.get(`/tweet/${id}`),
  createTweet: (content) => api.post('/tweet', { content }),
  likeTweet: (id) => api.post(`/tweet/${id}/like`),
  retweetTweet: (id) => api.post(`/tweet/${id}/retweet`),
};

// Kullanıcı API fonksiyonları
export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: (username) => api.get(`/users/${username}`),
};
