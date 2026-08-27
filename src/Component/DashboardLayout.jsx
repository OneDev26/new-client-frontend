import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import PageSkeleton from "./PageSkeleton";

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setPageLoading(true);
    const timer = window.setTimeout(() => setPageLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);
  return (
    <div className="dashboard-layout">
      <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <section className="portal-workspace">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="content-wrapper">{pageLoading ? <PageSkeleton /> : children}</main>
      </section>
      <MobileBottomNav />
    </div>
  );
};
export default DashboardLayout;
