// reportSlice.js
import { createSlice } from '@reduxjs/toolkit'; 
import {
  fetchReportsThunk,
  fetchReportSummaryThunk,
  fetchReportsByYearThunk,
  fetchReportsByMonthThunk,
  fetchReportsByWeekThunk,
  fetchReportsByDateRangeThunk,
  // New thunks
  fetchStoreOwnerSummaryThunk,
  fetchDailyIncidentsThreeMonthsThunk,
  fetchMonthlySeverityBreakdownThunk,
} from './reportThunks';

const initialState = {
  /* paginated list */
  results:   [],
  count:     0,
  next:      null,
  previous:  null,
  
  loading:   false,
  error:     null,
  
  /* dashboards & breakdowns */
  summary:           null,
  summaryLoading:    false,
  summaryError:      null,
  
  reportsByYear:     null,
  yearLoading:       false,
  yearError:         null,
  
  reportsByMonth:    null,
  monthLoading:      false,
  monthError:        null,
  
  reportsByWeek:     null,
  weekLoading:       false,
  weekError:         null,
  
  reportsByDateRange: null,
  dateRangeLoading:   false,
  dateRangeError:     null,
  
  /* NEW STATE FOR STORE OWNER ENDPOINTS */
  storeOwnerSummary:          null,
  storeOwnerSummaryLoading:   false,
  storeOwnerSummaryError:     null,
  
  dailyIncidentsThreeMonths:         null,
  dailyIncidentsThreeMonthsLoading:  false,
  dailyIncidentsThreeMonthsError:    null,
  
  monthlySeverityBreakdown:         null,
  monthlySeverityBreakdownLoading:  false,
  monthlySeverityBreakdownError:    null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* ───────── fetchAll (paginated) ───────── */
    builder
      .addCase(fetchReportsThunk.pending, (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchReportsThunk.fulfilled, (s, a) => {
        const { results, count, next, previous, append } = a.payload;
        s.loading   = false;
        s.count     = count;
        s.next      = next;
        s.previous  = previous;
        s.results   = append ? [...s.results, ...results] : results;
      })
      .addCase(fetchReportsThunk.rejected, (s, a) => {
        s.loading = false;
        s.error   = a.payload;
      });
    
    /* ───────── summary ───────── */
    builder
      .addCase(fetchReportSummaryThunk.pending,   (s)=>{s.summaryLoading=true; s.summaryError=null;})
      .addCase(fetchReportSummaryThunk.fulfilled, (s,a)=>{s.summaryLoading=false; s.summary=a.payload;})
      .addCase(fetchReportSummaryThunk.rejected,  (s,a)=>{s.summaryLoading=false; s.summaryError=a.payload;});
    
    /* by‑year */
    builder
      .addCase(fetchReportsByYearThunk.pending,   (s)=>{s.yearLoading=true; s.yearError=null;})
      .addCase(fetchReportsByYearThunk.fulfilled, (s,a)=>{s.yearLoading=false; s.reportsByYear=a.payload;})
      .addCase(fetchReportsByYearThunk.rejected,  (s,a)=>{s.yearLoading=false; s.yearError=a.payload;});
    
    /* by‑month */
    builder
      .addCase(fetchReportsByMonthThunk.pending,  (s)=>{s.monthLoading=true; s.monthError=null;})
      .addCase(fetchReportsByMonthThunk.fulfilled,(s,a)=>{s.monthLoading=false; s.reportsByMonth=a.payload;})
      .addCase(fetchReportsByMonthThunk.rejected, (s,a)=>{s.monthLoading=false; s.monthError=a.payload;});
    
    /* by‑week */
    builder
      .addCase(fetchReportsByWeekThunk.pending,   (s)=>{s.weekLoading=true; s.weekError=null;})
      .addCase(fetchReportsByWeekThunk.fulfilled, (s,a)=>{s.weekLoading=false; s.reportsByWeek=a.payload;})
      .addCase(fetchReportsByWeekThunk.rejected,  (s,a)=>{s.weekLoading=false; s.weekError=a.payload;});
    
    /* by date‑range */
    builder
      .addCase(fetchReportsByDateRangeThunk.pending,  (s)=>{s.dateRangeLoading=true; s.dateRangeError=null;})
      .addCase(fetchReportsByDateRangeThunk.fulfilled,(s,a)=>{s.dateRangeLoading=false; s.reportsByDateRange=a.payload;})
      .addCase(fetchReportsByDateRangeThunk.rejected, (s,a)=>{s.dateRangeLoading=false; s.dateRangeError=a.payload;});

    /* ───────── NEW STORE OWNER ENDPOINTS ───────── */
    
    /* store owner summary */
    builder
      .addCase(fetchStoreOwnerSummaryThunk.pending, (s) => {
        s.storeOwnerSummaryLoading = true;
        s.storeOwnerSummaryError = null;
      })
      .addCase(fetchStoreOwnerSummaryThunk.fulfilled, (s, a) => {
        s.storeOwnerSummaryLoading = false;
        s.storeOwnerSummary = a.payload;
      })
      .addCase(fetchStoreOwnerSummaryThunk.rejected, (s, a) => {
        s.storeOwnerSummaryLoading = false;
        s.storeOwnerSummaryError = a.payload;
      });
    
    /* daily incidents three months */
    builder
      .addCase(fetchDailyIncidentsThreeMonthsThunk.pending, (s) => {
        s.dailyIncidentsThreeMonthsLoading = true;
        s.dailyIncidentsThreeMonthsError = null;
      })
      .addCase(fetchDailyIncidentsThreeMonthsThunk.fulfilled, (s, a) => {
        s.dailyIncidentsThreeMonthsLoading = false;
        s.dailyIncidentsThreeMonths = a.payload;
      })
      .addCase(fetchDailyIncidentsThreeMonthsThunk.rejected, (s, a) => {
        s.dailyIncidentsThreeMonthsLoading = false;
        s.dailyIncidentsThreeMonthsError = a.payload;
      });
    
    /* monthly severity breakdown */
    builder
      .addCase(fetchMonthlySeverityBreakdownThunk.pending, (s) => {
        s.monthlySeverityBreakdownLoading = true;
        s.monthlySeverityBreakdownError = null;
      })
      .addCase(fetchMonthlySeverityBreakdownThunk.fulfilled, (s, a) => {
        s.monthlySeverityBreakdownLoading = false;
        s.monthlySeverityBreakdown = a.payload;
      })
      .addCase(fetchMonthlySeverityBreakdownThunk.rejected, (s, a) => {
        s.monthlySeverityBreakdownLoading = false;
        s.monthlySeverityBreakdownError = a.payload;
      });
  },
});

export default reportSlice.reducer;