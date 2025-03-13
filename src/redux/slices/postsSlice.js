// src/redux/slices/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Tweetleri getirme işlemi
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // Doğru endpoint: /tweet
      const response = await fetch('/tweet');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Tweetler yüklenirken bir hata oluştu');
    }
  }
);

// Tweet oluşturma işlemi
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      // Doğru endpoint: /tweet
      const response = await fetch('http://localhost:3001/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Tweet oluşturulurken bir hata oluştu');
    }
  }
);

// Like ve Retweet işlemleri
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      // Doğru endpoint: /tweet/:id/like
      const response = await fetch(`http://localhost:3001/tweet/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return { postId, data };
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Tweet beğenilirken bir hata oluştu');
    }
  }
);

export const retweetPost = createAsyncThunk(
  'posts/retweetPost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      // Doğru endpoint: /tweet/:id/retweet
      const response = await fetch(`http://localhost:3001/tweet/${postId}/retweet`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return { postId, data };
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.message || 'Tweet retweetlenirken bir hata oluştu');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
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
        const post = state.posts.find(post => post.id === postId);
        if (post) {
          post.likes = data.likes;
        }
      })
      
      // Retweet post
      .addCase(retweetPost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId);
        if (post) {
          post.retweets = data.retweets;
        }
      });
  },
});

export default postsSlice.reducer;
