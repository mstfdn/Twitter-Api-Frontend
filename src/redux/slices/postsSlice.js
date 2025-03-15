import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tweetAPI } from '../../services/api'; // API servisinizi import edin
import axios from 'axios'; // axios'u import etmeyi unutmayın
import { toast } from 'react-toastify'; // React-Toastify'ı import ediyoruz

// Tweetleri getirme işlemi
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await tweetAPI.getAllTweets();
      
      // Tweetleri işleyelim ve her tweet için yorumları ve like durumunu da alalım
      const tweets = await Promise.all(response.data.map(async tweet => {
        try {
          // Tweet'in yorumlarını getir
          const commentsResponse = await tweetAPI.getCommentsByTweetId(tweet.id || tweet._id);
          
          // Tweet'in like durumunu kontrol et
          const likeStatusResponse = await tweetAPI.checkLikeStatus(tweet.id || tweet._id);
          
          // Tweet'in like sayısını al
          const likeCountResponse = await tweetAPI.getLikeCount(tweet.id || tweet._id);
          
          return {
            ...tweet,
            comments: commentsResponse.data || [],
            isRetweeted: tweet.isRetweetedByCurrentUser || tweet.retweetedByMe || false,
            isLiked: likeStatusResponse.data.isLiked || false,
            likes: likeCountResponse.data.count || tweet.likes || 0
          };
        } catch (error) {
          console.error(`Tweet ${tweet.id || tweet._id} için ek bilgiler alınamadı:`, error);
          return {
            ...tweet,
            comments: [],
            isRetweeted: tweet.isRetweetedByCurrentUser || tweet.retweetedByMe || false,
            isLiked: tweet.isLikedByCurrentUser || tweet.likedByMe || false,
            likes: tweet.likes || 0
          };
        }
      }));
      
      return tweets;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Tweetler yüklenirken bir hata oluştu');
    }
  }
);

// Like işlemleri - Tek bir likePost fonksiyonu tanımlıyoruz
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      // Mevcut like durumunu kontrol et
      const state = getState();
      const post = state.posts.posts.find(p => (p.id === postId || p._id === postId));
      const isLiked = post ? post.isLiked : false;
      
      let response;
      
      // Eğer zaten like edilmişse unlike yap, edilmemişse like yap
      if (isLiked) {
        response = await tweetAPI.unlikeTweet(postId);
        
        // Başarılı unlike işlemi sonrası bildirim gösteriyoruz
        toast.info('Beğeni geri alındı', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Like sayısını al
        const likeCountResponse = await tweetAPI.getLikeCount(postId);
        
        return { 
          postId, 
          data: {
            likes: likeCountResponse.data.count || Math.max(0, (post.likes || 0) - 1),
            isLiked: false
          } 
        };
      } else {
        response = await tweetAPI.likeTweet(postId);
        
        // Başarılı like işlemi sonrası bildirim gösteriyoruz
        toast.success('Tweet beğenildi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Like sayısını al
        const likeCountResponse = await tweetAPI.getLikeCount(postId);
        
        return { 
          postId, 
          data: {
            likes: likeCountResponse.data.count || (post.likes || 0) + 1,
            isLiked: true
          } 
        };
      }
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error('Beğeni işlemi sırasında bir hata oluştu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Beğeni işlemi sırasında bir hata oluştu');
    }
  }
);

// ÖNEMLİ: Aşağıdaki satırları SİLİN (duplicate likePost ve standalone addCase)
// extraReducers içinde likePost.fulfilled case'ini güncelle
// .addCase(likePost.fulfilled, (state, action) => {
//   const { postId, data } = action.payload;
//   const post = state.posts.find(post => post.id === postId || post._id === postId);
//   if (post) {
//     post.likes = data.likes;
//     post.isLiked = data.isLiked;
//   }
// })

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

// ÖNEMLİ: Aşağıdaki satırları SİLİN (duplicate likePost)
// Like ve Retweet işlemleri
// export const likePost = createAsyncThunk(
//   'posts/likePost',
//   async (postId, { rejectWithValue }) => {
//     try {
//       const response = await tweetAPI.likeTweet(postId);
//       return { postId, data: response.data };
//     } catch (error) {
//       console.error('API Error:', error);
//       return rejectWithValue(error.response?.data?.message || error.message || 'Tweet beğenilirken bir hata oluştu');
//     }
//   }
// );

export const retweetPost = createAsyncThunk(
  'posts/retweetPost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const response = await tweetAPI.retweetTweet(postId);
      
      // Mevcut retweet sayısını alalım
      const state = getState();
      const post = state.posts.posts.find(p => (p.id === postId || p._id === postId));
      const currentRetweetCount = post ? (post.retweets || 0) : 0;
      
      // Başarılı retweet işlemi sonrası bildirim gösteriyoruz
      toast.success('Tweet başarıyla retweetlendi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Backend'den dönen yanıtı uygun formatta dönüştürüyoruz
      return { 
        postId, 
        data: {
          // Eğer backend count dönüyorsa onu kullan, yoksa mevcut sayıyı 1 artır
          retweets: response.data.count || (currentRetweetCount + 1),
          isRetweeted: true
        } 
      };
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error('Tweet retweetlenirken bir hata oluştu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

// Unretweet işlemi için yeni bir thunk ekliyoruz
export const unretweetPost = createAsyncThunk(
  'posts/unretweetPost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      const response = await tweetAPI.unretweetTweet(postId);
      
      // Mevcut retweet sayısını alalım
      const state = getState();
      const post = state.posts.posts.find(p => (p.id === postId || p._id === postId));
      const currentRetweetCount = post ? (post.retweets || 0) : 0;
      
      // Başarılı unretweet işlemi sonrası bildirim gösteriyoruz
      toast.info('Retweet geri alındı', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return { 
        postId, 
        data: {
          // Retweet sayısını 1 azaltıyoruz (en az 0 olacak şekilde)
          retweets: response.data.count || Math.max(0, currentRetweetCount - 1),
          isRetweeted: false
        } 
      };
    } catch (error) {
      toast.error('Retweet geri alınırken bir hata oluştu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Retweet geri alınırken bir hata oluştu');
    }
  }
);

// Yorum ekleme işlemi için yeni bir thunk ekliyoruz
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await tweetAPI.addComment(postId, content);
      
      // Başarılı yorum işlemi sonrası bildirim gösteriyoruz
      toast.success('Yorum başarıyla eklendi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return { postId, comment: response.data };
    } catch (error) {
      // Hata durumunda bildirim gösteriyoruz
      toast.error('Yorum eklenirken bir hata oluştu!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Yorum eklenirken bir hata oluştu');
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
        // Tweetleri createdAt tarihine göre sıralayalım (en yeniden en eskiye)
        state.posts = action.payload.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
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
      
      // Like post - isLiked durumunu da güncelliyoruz
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          post.likes = data.likes;
          post.isLiked = data.isLiked;
        }
      })
      
      // Retweet post
      .addCase(retweetPost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          // Retweet sayısını güncelle
          post.retweets = data.retweets;
          
          // Kullanıcının retweet ettiğini işaretleyelim (varsa)
          if (data.isRetweeted !== undefined) {
            post.isRetweeted = data.isRetweeted;
          }
        }
      })
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.meta.arg yerine action.payload.postId kullanıyoruz
        state.posts = state.posts.filter(post => (post.id || post._id) !== action.payload.postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Unretweet case'ini ekliyoruz
      .addCase(unretweetPost.fulfilled, (state, action) => {
        const { postId, data } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          post.retweets = data.retweets;
          post.isRetweeted = data.isRetweeted;
        }
      })
      
      // Yorum ekleme case'ini ekliyoruz
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find(post => post.id === postId || post._id === postId);
        if (post) {
          // Eğer post.comments bir dizi değilse, boş bir dizi oluştur
          if (!Array.isArray(post.comments)) {
            post.comments = [];
          }
          // Yorumu ekle
          post.comments.push(comment);
          // Yorum sayısını güncelle
          post.commentCount = (post.commentCount || 0) + 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload || 'Yorum eklenirken bir hata oluştu';
      });
  }
});

export default postsSlice.reducer;