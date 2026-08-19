import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ClientMonitoringDashboard from "./Pages/ClientMonitoringDashboard";
import LoginPage from "./Component/LoginPage";
import TransactionActivity from "./Pages/TransactionActivity";
import MonitoringStatus from "./Pages/MonitoringStatus";
import CameraShop from "./Pages/CameraShop";
import PreventionHighlights from "./Pages/PreventionHighlights";
import ContactPage from "./Pages/ContactPage";
import Reports from "./Pages/Reports";
import EvidenceClips from "./Pages/EvidenceClips";
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
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ClientMonitoringDashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
           
            <Route
              path="/cashier-activity"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <TransactionActivity />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/monitoring-status"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <MonitoringStatus />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/camera-security"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CameraShop />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/prevention-highlights"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <PreventionHighlights />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/refer-earn"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ContactPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/video-evidence"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <EvidenceClips />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/help-support"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ContactPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
