// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk action creator for login
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Basit doğrulama (gerçek projede API çağrısı yapılır)
    if (credentials.username === 'mustafa' && credentials.password === '1234') {
      const user = {
        id: 1,
        username: 'mustafa',
        name: 'Mustafa',
        profilePic: 'https://i.pravatar.cc/300',
      };
      
      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess(user));
      return true;
    } else {
      dispatch(loginFailure('Kullanıcı adı veya şifre hatalı'));
      return false;
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return false;
  }
};

export default authSlice.reducer;
