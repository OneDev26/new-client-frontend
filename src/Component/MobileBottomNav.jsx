import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Camera, FileText, Home, Menu, Store } from "lucide-react";

const mainItems = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Stores", path: "/my-stores", icon: Store },
  { label: "Live View", path: "/live-view", icon: Camera },
  { label: "Reports", path: "/reports", icon: FileText },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {mainItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive || (path === "/dashboard" && location.pathname === "/savings-overview") ? "active" : ""
          }
        >
          <Icon size={21} />
          <span>{label}</span>
        </NavLink>
      ))}
      <NavLink to="/more" className={location.pathname === "/more" ? "active" : ""}>
        <Menu size={22} />
        <span>More</span>
      </NavLink>
    </nav>
  );
}