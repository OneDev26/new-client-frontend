// reportThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'; 
import axiosInstance from '../../api/axiosInstance';  

/* ──────────────────────────────────────────────────────────
   Paginated "fetch all" - FIXED to support all filter parameters
   ────────────────────────────────────────────────────────── */ 
export const fetchReportsThunk = createAsyncThunk(
  'reports/fetchAll',
  async (args, { rejectWithValue }) => {
    try {
      console.log('fetchReportsThunk called with args:', args);
      
      // Handle both legacy (plain storeId) and new (object with filters) formats
      let params = {};
      
      if (typeof args === 'object' && args !== null) {
        // New format - extract all parameters
        const {
          storeId,
          store_id,
          offset = 0,
          limit = 20,
          append = false,
          ...otherFilters // This captures all other filter parameters
        } = args;
        
        // Set basic pagination
        params.limit = limit;
        params.offset = offset;
        
        // Handle store filtering (support both storeId and store_id)
        if (storeId || store_id) {
          params.store_id = storeId || store_id;
        }
        
        // Add all other filter parameters
        Object.keys(otherFilters).forEach(key => {
          if (otherFilters[key] !== null && otherFilters[key] !== undefined && otherFilters[key] !== '') {
            params[key] = otherFilters[key];
          }
        });
        
      } else if (args !== undefined) {
        // Legacy format - just a storeId
        params.store_id = args;
        params.limit = 20;
        params.offset = 0;
      } else {
        // No args - default pagination
        params.limit = 20;
        params.offset = 0;
      }
      
      // Convert params object to query string
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const url = `/api/reports/?${queryParams.toString()}`;
      console.log('Making API request to:', url);
      
      const res = await axiosInstance.get(url);
      console.log('API response:', res.data);
      
      return { 
        ...res.data, 
        append: (args?.append || args?.offset > 0) 
      };
      
    } catch (err) {
      console.error('fetchReportsThunk error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch reports';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ---- everything below here is unchanged (summary, by‑year, …) ---- */
export const fetchReportSummaryThunk = createAsyncThunk(
  'reports/fetchSummary',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Support filters for summary as well
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = queryParams.toString() 
        ? `/api/reports/summary/?${queryParams.toString()}`
        : '/api/reports/summary/';
      
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch report summary');
    }
  }
);

export const fetchReportsByYearThunk = createAsyncThunk(
  'reports/fetchByYear',
  async (params, { rejectWithValue }) => {
    try {
      // Handle both old format (just year) and new format (object with filters)
      let queryParams;
      if (typeof params === 'object') {
        queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
          }
        });
      } else {
        // Legacy: just year
        queryParams = new URLSearchParams({ year: params });
      }
      
      const res = await axiosInstance.get(`/api/reports/by-year/?${queryParams.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by year');
    }
  }
);

export const fetchReportsByMonthThunk = createAsyncThunk(
  'reports/fetchByMonth',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const res = await axiosInstance.get(`/api/reports/by-month/?${queryParams.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by month');
    }
  }
);

export const fetchReportsByWeekThunk = createAsyncThunk(
  'reports/fetchByWeek',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const res = await axiosInstance.get(`/api/reports/by-week/?${queryParams.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch reports by week');
    }
  }
);

export const fetchReportsByDateRangeThunk = createAsyncThunk(
  'reports/fetchByDateRange',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const res = await axiosInstance.get(`/api/reports/by-date-range/?${queryParams.toString()}`);
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
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const url = queryParams.toString()
        ? `/api/reports/store-owner-summary/?${queryParams.toString()}`
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
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const url = queryParams.toString()
        ? `/api/reports/daily-incidents-three-months/?${queryParams.toString()}`
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
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const url = queryParams.toString()
        ? `/api/reports/monthly-severity-breakdown/?${queryParams.toString()}`
        : '/api/reports/monthly-severity-breakdown/';
      
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch monthly severity breakdown');
    }
  }
);