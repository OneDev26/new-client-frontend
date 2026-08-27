import React, { useEffect } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, Menu, ShieldCheck, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationsDropdown from "./NotificationsDropdown";
import useNotifications, { requestNotificationPermission } from "../hooks/useNotifications";

const PAGE_DETAILS = {
  "/my-stores": ["My Stores", "View and manage your monitored store locations."],
  "/live-view": ["Live view", "View your store cameras and current surveillance status."],
  "/recent-activity": ["Recent Activity", "Review live events from your monitored stores and cameras."],
  "/camera-security": ["Explore Camera Options", "Choose the right cameras to protect your store and reduce losses."],
  "/add-new-store": ["Add New Store for Package", "Add your store details and choose the best surveillance package."],
  "/installation-progress": ["Installation Progress", "Track your store security installation and setup status."],
  "/reports": ["Reports", "Review your store reports and insights."],
  "/savings-overview": ["Savings Overview", "Review loss prevention savings and trends."],
  "/video-evidence": ["Video Evidence", "Browse, review, and download important video evidence from your store."],
  "/monitoring-status": ["Monitoring Status", "Real-time overview of your store's surveillance and security system."],
  "/cashier-activity": ["Cashier Activity Videos", "Review monitored cashier activity recordings."],
  "/cashier-activity-videos": ["Cashier Activity Videos", "Review monitored cashier activity recordings."],
  "/prevention-highlights": ["Prevention Highlights", "Key incidents prevented and risks reduced with Survill's proactive monitoring."],
  "/refer-earn": ["Refer & Earn", "Refer a business and earn one month of free monitoring."],
  "/account": ["Account", "Manage your account and store information."],
  "/settings": ["Settings", "Manage your account and portal preferences."],
  "/more": ["More", "Manage your account, stores, and preferences."],
  "/packages-billing": ["Packages & Billing", "View your current plan and billing details."],
  "/help-support": ["Help & Support", "We are here whenever you need support."],
};

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  useNotifications();
  useEffect(() => { requestNotificationPermission(); }, []);

  const profile = user?.store_owner_profile;
  const firstName = profile?.user?.first_name || user?.first_name || "Client";
  const lastName = profile?.user?.last_name || user?.last_name || "User";
  const formattedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
  const [title, subtitle] = location.pathname === "/dashboard"
    ? [`Good morning, ${firstName}! \u{1F44B}`, "Here’s what’s happening with your store today."]
    : location.pathname.startsWith("/cashier-activity-videos/")
      ? ["Watch Video", "Review the selected cashier activity recording."]
      : PAGE_DETAILS[location.pathname] || ["Client Portal", "Manage your store from one place."];

  return (
    <header className={"portal-page-header " + (location.pathname === "/dashboard" ? "dashboard-mobile-header" : location.pathname === "/reports" ? "reports-mobile-header" : location.pathname === "/savings-overview" ? "savings-mobile-route" : location.pathname === "/installation-progress" ? "installation-mobile-route" : location.pathname === "/add-new-store" ? "add-store-mobile-route" : location.pathname === "/settings" ? "settings-mobile-route" : location.pathname === "/live-view" ? "live-mobile-route" : location.pathname === "/recent-activity" ? "recent-mobile-route" : location.pathname === "/camera-security" ? "camera-security-mobile-route" : location.pathname === "/my-stores" ? "my-stores-mobile-route" : location.pathname === "/more" ? "more-mobile-route" : location.pathname === "/packages-billing" ? "packages-billing-mobile-route" : location.pathname === "/cashier-activity" ? "cashier-videos-mobile-route" : location.pathname === "/monitoring-status" ? "monitoring-mobile-header" : location.pathname === "/video-evidence" ? "evidence-mobile-header" : location.pathname.startsWith("/cashier-activity-videos") ? "cashier-videos-mobile-route" : "")}>
      <button type="button" className="mobile-page-back" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={19} /></button>
      <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open navigation"><Menu size={22} /></button>
      <div className="mobile-dashboard-welcome">
        <span className="mobile-welcome-mark"><ShieldCheck size={28} /></span>
        <div><small>Welcome back,</small><strong>{firstName} <span aria-hidden="true">👋</span></strong><p>Here's what's happening at your stores.</p></div>
      </div>
      <div className="page-heading"><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topbar-actions">
        <div className="date-control" aria-label={`Today's date: ${formattedDate}`}><CalendarDays size={18} /><span>{formattedDate}</span><ChevronDown size={15} /></div>
        <span className="topbar-divider" />
        <NotificationsDropdown />
        <span className="topbar-divider" />
        <button className="profile-control" onClick={() => navigate("/account")}>
          <span className="profile-avatar">{profile?.image ? <img src={profile.image} alt="" /> : <UserRound size={21} />}</span>
          <span className="profile-copy"><strong>{firstName} {lastName}</strong><small>Store Owner</small></span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
};
export default Header;

