// client-frontend/src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Request tokens (assumes backend returns both access and refresh tokens)
      const res = await axiosInstance.post('/api/token/', { username, password });
      const { access, refresh } = res.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Fetch user details (including store_owner_profile, if any)
      const userRes = await axiosInstance.get('/api/whoami/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      const user = userRes.data;

      // Save user details to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token: access, refreshToken: refresh };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Could not log in');
    }
  }
);
