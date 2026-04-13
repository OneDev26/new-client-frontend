import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import storeReducer from '../features/stores/storeSlice';
import reportReducer from '../features/reports/reportSlice';
import queryReducer from '../features/queries/querySlice';
import queryResponseReducer from '../features/queryResponses/queryResponseSlice'; // ne
import transactionReducer from '../features/transactions/transactionSlice'; 
import notificationReducer from '../features/notifications/notificationSlice'; // NEW


export const store = configureStore({
  reducer: {
    auth: authReducer,
    stores: storeReducer,
    reports: reportReducer,
    queries: queryReducer,
    queryResponses: queryResponseReducer, // add it here
    transactions: transactionReducer,
    notifications: notificationReducer, // NEW


  },
});

export default store;
