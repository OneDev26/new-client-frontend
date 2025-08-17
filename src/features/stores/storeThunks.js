// client-frontend/src/features/stores/storeThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// GET /api/stores/ (all stores belonging to the logged-in store owner)
export const fetchStoresThunk = createAsyncThunk(
  'stores/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/stores/');
      console.log( response.data)
      return response.data; // an array of stores
    } catch (err) {
      return rejectWithValue('Could not fetch stores');
    }
  }
);

// GET /api/stores/:id
export const fetchStoreByIdThunk = createAsyncThunk(
  'stores/fetchOne',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stores/${storeId}/`);
      return response.data; // a single store object
    } catch (err) {
      return rejectWithValue('Could not fetch store details');
    }
  }
);
