import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetAPI } from '../../services/api'; // API servisinizi import edin
import axios from 'axios'; // axios'u import etmeyi unutmayın
import { toast } from 'react-toastify'; // React-Toastify'ı import ediyoruz

// Tweetleri getirme işlemi
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.getAllTweets();
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweetler yüklenirken bir hata oluştu');
    }
  }
);

// Tweet oluşturma işlemi
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.createTweet(postData.content);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweet oluşturulurken bir hata oluştu');
    }
  }
);

// Like ve Retweet işlemleri
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.likeTweet(postId);
      return { postId, data: response.data };
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweet beğenilirken bir hata oluştu');
    }
  }
);

export const retweetPost = createAsyncThunk(
  'posts/retweetPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.retweetTweet(postId);
      return { postId, data: response.data };
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweet retweetlenirken bir hata oluştu');
    }
  }
);

// deletePost action ve reducer'ını ekleyin
// Adım 3: postsSlice.js dosyasında deletePost fonksiyonunu düzenleyelim

// Eğer API servisinizi düzenlemek istemiyorsanız, doğrudan axios kullanarak da sorunu çözebilirsiniz:
// deletePost fonksiyonunu düzeltelim
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.deleteTweet(postId);
      // Başarılı silme işlemi sonrası bildirim gösteriyoruz
      toast.success('Tweet başarıyla silindi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return { postId, data: response.data };
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error('Tweet silinirken bir hata oluştu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweet silinirken bir hata oluştu');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Tweetler yüklenirken bir hata oluştu';
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        // İsteğe bağlı olarak burada loading state'i ekleyebilirsiniz
      })
      .addCase(createPost.fulfilled, (state, action) => {
        // Yeni tweet'i listenin başına ekleyelim
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload || 'Tweet oluşturulurken bir hata oluştu';
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          post.likes = data.likes;
        }
      })
      
      // Retweet post
      .addCase(retweetPost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          post.retweets = data.retweets;
        }
      })
      // Noktalı virgül hatası burada düzeltildi (noktalı virgül kaldırıldı)
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      // Delete post reducer'ını düzenleyelim
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.meta.arg yerine action.payload.postId kullanıyoruz
        state.posts = state.posts.filter(post => (post.id || post._id) !== action.payload.postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default postsSlice.reducer;