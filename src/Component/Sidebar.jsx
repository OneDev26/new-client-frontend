import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard, Clock3, Star, CircleUserRound, Video, ClipboardList,
  ShieldCheck, UsersRound, UserRound, CircleHelp, Headphones,
  Store, Wrench, Settings, Camera, Package, ChevronDown, X
} from "lucide-react";
import { fetchStoresThunk } from "../features/stores/storeThunks";
import survillLogo from "../assets/Survill_logo.png";

const primaryItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Store, label: "My Stores", path: "/my-stores" },
  { icon: Camera, label: "Live View", path: "/live-view" },
  { icon: Clock3, label: "Monitoring Status", path: "/monitoring-status" },
  { icon: Star, label: "Prevention Highlights", path: "/prevention-highlights" },
  { icon: CircleUserRound, label: "Cashier Activity", path: "/cashier-activity", activePrefix: "/cashier-activity-videos" },
  { icon: Video, label: "Video Evidence", path: "/video-evidence" },
  { icon: ClipboardList, label: "Reports", path: "/reports", activePath: "/reports" },
  { icon: ShieldCheck, label: "Camera & Security", path: "/camera-security" },
  { icon: Store, label: "Add New Store", path: "/add-new-store" },
  { icon: Wrench, label: "Installation Progress", path: "/installation-progress" },
  { icon: Package, label: "Packages & Billing", path: "/packages-billing" },
];

const secondaryItems = [
  { icon: UserRound, label: "Account", path: "/account" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: UsersRound, label: "Refer & Earn", path: "/refer-earn" },
  { icon: CircleHelp, label: "Help & Support", path: "/help-support" },
];

const SidebarLink = ({ item, onClose }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === (item.activePath || item.path) || (item.activePrefix && location.pathname.startsWith(item.activePrefix));
  return (
    <NavLink to={item.path} onClick={onClose} className={`sidebar-link ${isActive ? "active" : ""}`}>
      <Icon size={20} strokeWidth={1.8} /><span>{item.label}</span>
    </NavLink>
  );
};

const Sidebar = ({ isMobileSidebarOpen, onClose }) => {
  const dispatch = useDispatch();
  const { stores, loading } = useSelector((state) => state.stores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);

  useEffect(() => { if (!stores.length) dispatch(fetchStoresThunk()); }, [dispatch, stores.length]);
  useEffect(() => { if (!selectedStore && stores.length) setSelectedStore(stores[0]); }, [stores, selectedStore]);

  const storeName = selectedStore?.store_name || (loading ? "Loading store..." : "Your Store");
  const storeLocation = selectedStore
    ? [selectedStore.store_address, selectedStore.store_city, selectedStore.store_state].filter(Boolean).join(", ")
    : "Store location";

  return (
    <>
      {isMobileSidebarOpen && <button className="sidebar-overlay" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`portal-sidebar ${isMobileSidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <img className="sidebar-logo" src={survillLogo} alt="Survill Client Portal" />
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={22} /></button>
        </div>

        <div className="sidebar-store-wrap">
          <button className="sidebar-store" onClick={() => setStoreMenuOpen((open) => !open)} aria-expanded={storeMenuOpen}>
            <span className="store-icon"><Store size={20} /></span>
            <span className="store-copy"><strong>{storeName}</strong><small>{storeLocation}</small></span>
            <ChevronDown size={16} className={storeMenuOpen ? "rotated" : ""} />
          </button>
          {storeMenuOpen && stores.length > 0 && (
            <div className="sidebar-store-menu">
              {stores.map((storeItem) => (
                <button key={storeItem.id} onClick={() => { setSelectedStore(storeItem); setStoreMenuOpen(false); }}>
                  {storeItem.store_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {primaryItems.map((item) => <SidebarLink key={item.label} item={item} onClose={onClose} />)}
          <div className="sidebar-nav-divider" />
          {secondaryItems.map((item) => <SidebarLink key={item.label} item={item} onClose={onClose} />)}
        </nav>

        <div className="sidebar-help">
          <Headphones size={24} />
          <div><strong>Need help?</strong><span>Our support team is here to help you.</span></div>
          <NavLink to="/help-support">Contact Support</NavLink>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
