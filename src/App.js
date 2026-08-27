import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ClientMonitoringDashboard from "./Pages/ClientMonitoringDashboard";
import PortalLogin from "./Component/PortalLogin";
import MonitoringStatus from "./Pages/MonitoringStatus";
import LiveView from "./Pages/LiveView";
import RecentActivity from "./Pages/RecentActivity";
import CameraShop from "./Pages/CameraShop";
import StoreInformation from "./Pages/StoreInformation";
import InstallationProgress from "./Pages/InstallationProgress";
import PreventionHighlights from "./Pages/PreventionHighlights";
import ContactPage from "./Pages/ContactPage";
import ReferralPage from "./Pages/ReferralPage";
import Reports from "./Pages/Reports";
import SavingsOverview from "./Pages/SavingsOverview";
import EvidenceClips from "./Pages/EvidenceClips";
import ProfilePage from "./Pages/ProfilePage";
import MyStoresPage from "./Pages/MyStoresPage";
import SettingsPage from "./Pages/SettingsPage";
import MorePage from "./Pages/MorePage";
import PackagesBilling from "./Pages/PackagesBilling";
import CashierActivityVideos from "./Pages/CashierActivityVideos";
import CashierVideoDetails from "./Pages/CashierVideoDetails";
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



function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
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
              path="/my-stores"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <MyStoresPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/cashier-activity-videos"
              element={<PrivateRoute><DashboardLayout><CashierActivityVideos /></DashboardLayout></PrivateRoute>}
            />
            <Route
              path="/cashier-activity-videos/:id"
              element={<PrivateRoute><DashboardLayout><CashierVideoDetails /></DashboardLayout></PrivateRoute>}
            />            <Route
              path="/cashier-activity"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CashierActivityVideos />
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
              path="/live-view"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <LiveView />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />            <Route
              path="/recent-activity"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <RecentActivity />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />            <Route
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
              path="/add-new-store"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <StoreInformation />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/installation-progress"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <InstallationProgress />
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
                    <ReferralPage />
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
              path="/savings-overview"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <SavingsOverview />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />            <Route
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
              path="/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/packages-billing"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <PackagesBilling />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />            <Route
              path="/more"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <MorePage />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />            <Route
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
            <Route path="/login" element={<PortalLogin />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
