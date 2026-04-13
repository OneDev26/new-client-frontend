// src/features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunks for REST API calls
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/notifications/', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/notifications/${notificationId}/mark_read/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/notifications/mark_all_read/');
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark all as read');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/notifications/unread_count/');
      return response.data.unread_count;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch unread count');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // Add new notification to the beginning
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    updateNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload.id);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.offset = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const newNotifications = action.payload.results || action.payload;
        
        if (state.offset === 0) {
          state.notifications = newNotifications;
        } else {
          state.notifications.push(...newNotifications);
        }
        
        state.hasMore = action.payload.next !== null;
        state.offset = state.notifications.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark notification as read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.is_read = true);
        state.unreadCount = 0;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  addNotification,
  updateNotificationRead,
  setUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;