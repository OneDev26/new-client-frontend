// client-frontend/src/features/queryResponses/queryResponseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchQueryResponsesThunk } from './queryResponseThunks';

const initialState = {
  queryResponses: [],
  loading: false,
  error: null,
};

const queryResponseSlice = createSlice({
  name: 'queryResponses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueryResponsesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueryResponsesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.queryResponses = action.payload;
      })
      .addCase(fetchQueryResponsesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch query responses';
      });
  },
});

export default queryResponseSlice.reducer;
