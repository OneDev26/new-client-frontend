import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Star,
  Clock,
  Layout,
  Goal,
  Share2,
  File,
  PieChart,
  Folder,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  Headset,
  LogOut,
} from 'lucide-react';
import { logout } from '../features/auth/authSlice'; // adjust the path as needed

const styles = {
  sidebar: {
    width: '280px',
    minWidth: '60px',
    height: '100vh',
    transition: 'transform 0.3s ease',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    position: 'relative', // so the "X" button can be absolutely positioned
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translateX(-100%)',
    zIndex: 1000,
  },
  mobileSidebarOpen: {
    transform: 'translateX(0)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    transition: 'opacity 0.3s ease',
  },
  logo: {
    width: '32px',
    height: '32px',
    backgroundColor: '#000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    margin: '16px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    color: '#333',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    position: 'relative',
    textDecoration: 'none',
  },
  menuIcon: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
  },
  menuLabel: {
    fontSize: '14px',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  submenu: {
    marginLeft: '28px',
    paddingLeft: '12px',
    borderLeft: '1px solid #eee',
  },
  badge: {
    backgroundColor: '#ff4757',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '12px',
    marginLeft: '8px',
  },
  newTag: {
    color: '#ff4757',
    fontSize: '12px',
    marginLeft: '8px',
  },
  collapseButton: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderTop: '1px solid #eee',
    transition: 'background-color 0.2s ease',
  },
};

const MenuItem = ({
  icon: Icon,
  label,
  badge,
  isNew,
  hasSubmenu,
  onClick,
  isOpen,
  isCollapsed,
  path,
  isMobile,
}) => {
  // Conditionally override styles for mobile
  const menuItemStyle = {
    ...styles.menuItem,
    ...(isMobile
      ? {
          color: '#fff',
          justifyContent: 'center',
        }
      : {}),
  };
  const menuIconStyle = {
    ...styles.menuIcon,
    ...(isMobile ? { color: '#fff' } : {}),
  };
  const menuLabelStyle = {
    ...styles.menuLabel,
    ...(isMobile
      ? {
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center',
        }
      : {}),
  };

  return path ? (
    <Link to={path} style={menuItemStyle}>
      <Icon style={menuIconStyle} />
      {!isCollapsed && (
        <>
          <span style={menuLabelStyle}>{label}</span>
          {badge && <span style={styles.badge}>{badge}</span>}
          {isNew && <span style={styles.newTag}>New</span>}
          {hasSubmenu && (
            <Plus
              style={{
                marginLeft: 'auto',
                transition: 'transform 0.2s ease',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                ...(isMobile ? { color: '#fff' } : {}),
              }}
            />
          )}
        </>
      )}
    </Link>
  ) : (
    <div onClick={onClick} style={menuItemStyle}>
      <Icon style={menuIconStyle} />
      {!isCollapsed && (
        <>
          <span style={menuLabelStyle}>{label}</span>
          {badge && <span style={styles.badge}>{badge}</span>}
          {isNew && <span style={styles.newTag}>New</span>}
          {hasSubmenu && (
            <Plus
              style={{
                marginLeft: 'auto',
                transition: 'transform 0.2s ease',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                ...(isMobile ? { color: '#fff' } : {}),
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const Sidebar = ({ isMobileSidebarOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    alerts: false,
    reports: false,
  });

  const dispatch = useDispatch();
  const isMobile = window.innerWidth <= 768;

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { icon: Layout, label: 'Dashboard', path: '/' },
    { icon: Folder, label: 'Client Queries', path: '/client-queries' },
    { icon: PieChart, label: 'Reports', path: '/reports' },
    { icon: Clock, label: 'Suspicious Transactions', path: '/suspicious-transaction' },
    { icon: Headset, label: 'Contact Us', path: '/contact-page' },
    { icon: Settings, label: 'Profile', path: '/profile-page' },
  ];

  // Combine base sidebar style with mobile overrides
  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile
      ? {
          backgroundColor: '#d82d57', // maroon background for mobile
          color: '#fff',              // white text
        }
      : {}),
    ...(isMobile ? styles.mobileSidebar : {}),
    ...(isMobile && isMobileSidebarOpen ? styles.mobileSidebarOpen : {}),
  };

  return (
    <>
      {/* Fade overlay for mobile */}
      {isMobile && isMobileSidebarOpen && (
        <div style={styles.overlay} onClick={onClose}></div>
      )}

      <div style={sidebarStyle}>
        {/* "X" button in top-right corner (only on mobile & only if open) */}
        {isMobile && isMobileSidebarOpen && (
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '0px',
              right: '15px',
              fontSize: '40px',
              fontWeight: '400',
              color: '#fff',
              cursor: 'pointer',
              zIndex: 1001,
            }}
          >
            &times;
          </div>
        )}

        <nav
          style={{
            ...styles.nav,
            ...(isMobile
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignItems: 'center',
                  marginTop:'80px',
                  gap:'20px'
                }
              : {}),
          }}
        >
          {menuItems.map((item, index) => (
            <div key={index}>
              <MenuItem
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                isNew={item.isNew}
                hasSubmenu={item.hasSubmenu}
                onClick={() => item.hasSubmenu && toggleMenu(item.id)}
                isOpen={openMenus[item.id]}
                isCollapsed={isCollapsed}
                path={item.path}
                isMobile={isMobile}
              />
              {!isCollapsed && item.hasSubmenu && openMenus[item.id] && (
                <div style={styles.submenu}>
                  {item.submenu?.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      <MenuItem
                        icon={subItem.icon}
                        label={subItem.label}
                        badge={subItem.badge}
                        isNew={subItem.isNew}
                        hasSubmenu={subItem.hasSubmenu}
                        onClick={() => subItem.hasSubmenu && toggleMenu(subItem.id)}
                        isOpen={openMenus[subItem.id]}
                        isCollapsed={isCollapsed}
                        path={subItem.path}
                        isMobile={isMobile}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Logout Button */}
          <div
            onClick={handleLogout}
            style={{
              ...styles.menuItem,
              ...(isMobile
                ? {
                    color: '#fff',
                    justifyContent: 'center',
                  }
                : {}),
            }}
          >
            <LogOut
              style={{
                ...styles.menuIcon,
                ...(isMobile ? { color: '#fff' } : {}),
              }}
            />
            {!isCollapsed && (
              <span
                style={{
                  ...styles.menuLabel,
                  ...(isMobile
                    ? { color: '#fff', fontSize: '18px', textAlign: 'center' }
                    : {}),
                }}
              >
                Logout
              </span>
            )}
          </div>
        </nav>

        {/* Collapse/Expand button (for desktop usage) */}
        {!isMobile && (
          <div
            style={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Share2 size={20} />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
