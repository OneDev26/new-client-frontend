// client-frontend/src/features/queryResponses/queryResponseThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

/**
 * Fetch all responses related to a particular query (or for all queries).
 * If your API supports filtering by query ID, you'd do:
 *    GET /api/query-responses/?query=<queryId>
 */
export const fetchQueryResponsesThunk = createAsyncThunk(
  'queryResponses/fetchAll',
  async (queryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/query-responses/?query=${queryId}`);
      return response.data; // array of ClientQueryResponse objects
    } catch (err) {
      return rejectWithValue('Failed to fetch query responses');
    }
  }
);
