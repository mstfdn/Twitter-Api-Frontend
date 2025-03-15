import axios from 'axios';

// API base URL (uygulamaya proxy eklendiğinde bunu boş bırakabilirsiniz)
// package.json'a "proxy": "http://localhost:3001" eklediyseniz,
// baseURL'i boş bırakın veya kaldırın
const API_BASE_URL = ''; // Proxy kullanımı için boş

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

// Tweet API fonksiyonları - baseURL proxy tarafından yönetilecek
export const tweetAPI = {
  getAllTweets: () => api.get('/tweet'),
  getTweetById: (id) => api.get(`/tweet/${id}`),
  createTweet: (content) => api.post('/tweet', { content }),
  // Like işlemleri için yeni endpointler
  likeTweet: (id) => api.post(`/like/${id}`),
  unlikeTweet: (id) => api.delete(`/like/${id}`),
  checkLikeStatus: (id) => api.get(`/like/check/${id}`),
  getLikeCount: (id) => api.get(`/like/count/${id}`),
  // Diğer fonksiyonlar
  retweetTweet: (id) => api.post(`/retweet/${id}`),
  unretweetTweet: (id) => api.delete(`/retweet/${id}`),
  addComment: (tweetId, content) => api.post(`/comment/${tweetId}`, { content }),
  getCommentsByTweetId: (tweetId) => api.get(`/comment/tweet/${tweetId}`),
  deleteTweet: (tweetId) => api.delete(`/tweet/${tweetId}`),
};

// Kullanıcı API fonksiyonları
export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: (username) => api.get(`/users/${username}`),
};