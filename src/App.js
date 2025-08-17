import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Component/Index";
import LoginPage from "./Component/LoginPage";
import CashierReportsPage from "./Pages/CashierReportsPage";
import SuspiciousTransactionAlertsPage from "./Pages/SuspiciousTransactionAlertsPage";
import ClientQueries from "./Pages/ClientQueries";
import TriggerAlertsPage from "./Pages/TriggerAlertsPage";
import ContactPage from "./Pages/ContactPage";
import ReportsInterface from "./Pages/ReportsInterface";
import ProfilePage from "./Pages/ProfilePage";
import PrivateRoute from "./Component/PrivateRoute"; // Adjust the path as needed
import { Provider } from "react-redux";
import { store } from "./app/store";

// Import the layout
import DashboardLayout from "./Component/DashboardLayout";
import { setLogoutHandler } from './api/axiosInstance';
import { logout } from './features/auth/authSlice';

// Configure logout handler to dispatch Redux action
setLogoutHandler(() => {
  
  store.dispatch(logout());

});



function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Protected Routes inside DashboardLayout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Index />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
           
            <Route
              path="/cashier-reports"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CashierReportsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/suspicious-transaction"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <SuspiciousTransactionAlertsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/client-queries"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ClientQueries />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/trigger-alerts"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <TriggerAlertsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/contact-page"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ContactPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ReportsInterface />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile-page"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
