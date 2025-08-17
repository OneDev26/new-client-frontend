// client-frontend/src/features/stores/storeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchStoresThunk, fetchStoreByIdThunk } from './storeThunks';

const initialState = {
  stores: [],
  currentStore: null,    // If viewing a single store
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearCurrentStore(state) {
      state.currentStore = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStores
      .addCase(fetchStoresThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoresThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStoresThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stores';
      })

      // fetchStoreById
      .addCase(fetchStoreByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchStoreByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch store details';
      });
  },
});

export const { clearCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
