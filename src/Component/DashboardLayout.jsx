import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <section className="portal-workspace">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="content-wrapper">{children}</main>
      </section>
    </div>
  );
};
export default DashboardLayout;
