// client-frontend/src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    frontendLogin(state, action) {
      const { remember } = action.payload;
      const demoUser = {
        first_name: 'Client',
        last_name: 'User',
        email: 'client@test.com',
      };

      state.user = demoUser;
      state.token = 'frontend-demo-token';
      state.refreshToken = null;
      state.error = null;

      if (remember) {
        localStorage.setItem('accessToken', 'frontend-demo-token');
        localStorage.setItem('user', JSON.stringify(demoUser));
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { frontendLogin, logout } = authSlice.actions;
export default authSlice.reducer;
