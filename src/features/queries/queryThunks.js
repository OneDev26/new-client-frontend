import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

/* Paginated GET */
export const fetchQueriesThunk = createAsyncThunk(
  'queries/fetchAll',
  async (args = {}, { rejectWithValue }) => {
    try {
      const {
        storeId   = null,
        queryType = null,
        offset    = 0,
        limit     = 20,
      } = args;

      const params = [`limit=${limit}`, `offset=${offset}`];
      if (storeId)   params.push(`store=${storeId}`);
      if (queryType) params.push(`query_type=${queryType}`);

      const res = await axiosInstance.get(`/api/queries/?${params.join('&')}`);
      return { ...res.data, append: offset > 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* POST stays exactly the same */
export const createQueryThunk = createAsyncThunk(
  'queries/create',
  async (data, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'media_files' && Array.isArray(v)) {
          v.forEach(f => fd.append('media_files', f));
        } else {
          fd.append(k, v);
        }
      });
      const res = await axiosInstance.post('/api/queries/', fd);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create query');
    }
  }
);
