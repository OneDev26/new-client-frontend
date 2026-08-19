import React, { useEffect } from "react";
import { CalendarDays, ChevronDown, Menu, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationsDropdown from "./NotificationsDropdown";
import useNotifications, { requestNotificationPermission } from "../hooks/useNotifications";

const PAGE_DETAILS = {
  "/camera-security": ["Explore Camera Options", "Choose the right cameras to protect your store and reduce losses."],
  "/reports": ["Reports", "Review your store reports and insights."],
  "/video-evidence": ["Video Evidence", "Browse, review, and download important video evidence from your store."],
  "/monitoring-status": ["Monitoring Status", "Real-time overview of your store's surveillance and security system."],
  "/cashier-activity": ["Cashier Activity Review", "Review cashier transactions, refunds, voids, and register activities."],
  "/prevention-highlights": ["Prevention Highlights", "Key incidents prevented and risks reduced with Survill's proactive monitoring."],
  "/refer-earn": ["Refer & Earn", "We’re here whenever you need support."],
  "/account": ["Account", "Manage your account and store information."],
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
    : PAGE_DETAILS[location.pathname] || ["Client Portal", "Manage your store from one place."];

  return (
    <header className="portal-page-header">
      <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open navigation"><Menu size={22} /></button>
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

