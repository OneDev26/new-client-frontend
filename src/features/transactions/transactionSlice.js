import { createSlice } from '@reduxjs/toolkit';
import { fetchTransactionsThunk } from './transactionThunks';

const initialState = {
  results:   [],
  count:     0,
  next:      null,
  previous:  null,

  loading:   false,
  error:     null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsThunk.pending,   (s)=>{s.loading=true;  s.error=null;})
      .addCase(fetchTransactionsThunk.fulfilled, (s,a)=>{
        const { results, count, next, previous, append } = a.payload;
        s.loading  = false;
        s.count    = count;
        s.next     = next;
        s.previous = previous;
        s.results  = append ? [...s.results, ...results] : results;
      })
      .addCase(fetchTransactionsThunk.rejected,  (s,a)=>{s.loading=false; s.error=a.payload;});
  },
});

export default transactionSlice.reducer;
