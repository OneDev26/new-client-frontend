import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-layout">
      {/* Header on top */}
      <div className="header-wrapper">
        <Header onMenuClick={toggleSidebar} />
      </div>

      {/* Below the header, we have a row: sidebar on the left, main content on the right */}
      <div className="body-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} onClose={toggleSidebar} />
        </div>
        <div className="content-wrapper">
          {children}
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color:#f3efee;
          
        }

        .header-wrapper {
          flex-shrink: 0; /* Keep header height fixed */
        }

        .body-wrapper {
          display: flex;
          flex: 1; /* Fill remaining space below header */
          overflow: hidden;
        }

        .sidebar-wrapper {
          width: 280px; 
          /* On mobile, we’ll overlay (handled in Sidebar), but this keeps width on desktop. */
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          /* On mobile, we might want the sidebar to be hidden or overlaid. 
             We rely on the Sidebar component’s own overlay logic for that. */
          .sidebar-wrapper {
            /* We can set width to 0 if we rely purely on overlay. 
               Or keep the same if you want a push layout. */
            width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
