import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

/* GET /api/transactions/?[store=<id>]&limit=&offset= */
export const fetchTransactionsThunk = createAsyncThunk(
  'transactions/fetchAll',
  async (args, { rejectWithValue }) => {
    try {
      /* args can be plain storeId (legacy) or an options object */
      let storeId = null, offset = 0, limit = 20;
      if (typeof args === 'object' && args !== null) {
        ({ storeId = null, offset = 0, limit = 20 } = args);
      } else if (args !== undefined) {
        storeId = args;
      }

      const params = [];
      if (storeId) params.push(`store=${storeId}`);
      params.push(`limit=${limit}`);
      params.push(`offset=${offset}`);

      const url = `/api/transactions/?${params.join('&')}`;
      const res = await axiosInstance.get(url);

      return { ...res.data, append: offset > 0 };
    } catch (err) {
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);
