import { createSlice } from '@reduxjs/toolkit';
import { fetchQueriesThunk, createQueryThunk } from './queryThunks';

const initialState = {
  results:   [],
  count:     0,
  next:      null,
  previous:  null,

  loading:   false,
  error:     null,
};

const querySlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch (paginated) */
      .addCase(fetchQueriesThunk.pending,   (s)=>{s.loading=true;  s.error=null;})
      .addCase(fetchQueriesThunk.fulfilled, (s,a)=>{
        const { results, count, next, previous, append } = a.payload;
        s.loading  = false;
        s.count    = count;
        s.next     = next;
        s.previous = previous;
        s.results  = append ? [...s.results, ...results] : results;
      })
      .addCase(fetchQueriesThunk.rejected,  (s,a)=>{s.loading=false; s.error=a.payload;})

      /* create */
      .addCase(createQueryThunk.pending,    (s)=>{s.loading=true;  s.error=null;})
      .addCase(createQueryThunk.fulfilled,  (s,a)=>{
        s.loading = false;
        s.results.unshift(a.payload);
        s.count  += 1;
      })
      .addCase(createQueryThunk.rejected,   (s,a)=>{s.loading=false; s.error=a.payload;});
  },
});

export default querySlice.reducer;
