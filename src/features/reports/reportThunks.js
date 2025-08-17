// reportThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'; 
import axiosInstance from '../../api/axiosInstance';  

/* ──────────────────────────────────────────────────────────
   Paginated "fetch all"  ‑‑ supports store‑filter + limit/offset
   ────────────────────────────────────────────────────────── */ 
export const fetchReportsThunk = createAsyncThunk(
  'reports/fetchAll',
  /** args may be either a storeId (legacy) or an options object */
  async (args, { rejectWithValue }) => {
    try {
      /* Back‑compat: allow passing plain storeId */
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
      
      const url = `/api/reports/?${params.join('&')}`;
      const res = await axiosInstance.get(url);
      
      return { ...res.data, append: offset > 0 };
    } catch (err) {
      return rejectWithValue('Failed to fetch reports');
    }
  }
);

/* ---- everything below here is unchanged (summary, by‑year, …) ---- */
export const fetchReportSummaryThunk = createAsyncThunk(
  'reports/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/reports/summary/');
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch report summary');
    }
  }
);

export const fetchReportsByYearThunk = createAsyncThunk(
  'reports/fetchByYear',
  async (year, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/reports/by-year/?year=${year}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by year');
    }
  }
);

export const fetchReportsByMonthThunk = createAsyncThunk(
  'reports/fetchByMonth',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/reports/by-month/?year=${year}&month=${month}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by month');
    }
  }
);

export const fetchReportsByWeekThunk = createAsyncThunk(
  'reports/fetchByWeek',
  async ({ year, month, week }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/reports/by-week/?year=${year}&month=${month}&week=${week}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by week');
    }
  }
);

export const fetchReportsByDateRangeThunk = createAsyncThunk(
  'reports/fetchByDateRange',
  async ({ start_date, end_date }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/reports/by-date-range/?start_date=${start_date}&end_date=${end_date}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by date range');
    }
  }
);

/* ---- NEW THUNKS FOR STORE OWNER ENDPOINTS ---- */

// Fetch store owner summary (total reports and breakdown by incident type)
export const fetchStoreOwnerSummaryThunk = createAsyncThunk(
  'reports/fetchStoreOwnerSummary',
  async (storeId = null, { rejectWithValue }) => {
    try {
      const url = storeId 
        ? `/api/reports/store-owner-summary/?store_id=${storeId}` 
        : '/api/reports/store-owner-summary/';
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch store owner summary');
    }
  }
);

// Fetch daily incidents for the past three months
export const fetchDailyIncidentsThreeMonthsThunk = createAsyncThunk(
  'reports/fetchDailyIncidentsThreeMonths',
  async (storeId = null, { rejectWithValue }) => {
    try {
      const url = storeId 
        ? `/api/reports/daily-incidents-three-months/?store_id=${storeId}` 
        : '/api/reports/daily-incidents-three-months/';
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch daily incidents');
    }
  }
);

// Fetch monthly severity breakdown for the past three months
export const fetchMonthlySeverityBreakdownThunk = createAsyncThunk(
  'reports/fetchMonthlySeverityBreakdown',
  async (storeId = null, { rejectWithValue }) => {
    try {
      const url = storeId 
        ? `/api/reports/monthly-severity-breakdown/?store_id=${storeId}` 
        : '/api/reports/monthly-severity-breakdown/';
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch monthly severity breakdown');
    }
  }
);