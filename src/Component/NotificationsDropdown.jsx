// src/components/NotificationsDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, CheckCheck } from 'lucide-react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../features/notifications/notificationSlice';
import useNotifications from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { notifications, unreadCount, loading, hasMore } = useSelector(
    (state) => state.notifications
  );
  
  const { markAsRead, markAllAsRead } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      dispatch(fetchNotifications({ limit: 20, offset: 0 }));
    }
  }, [isOpen, dispatch, notifications.length]);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      // Mark as read via WebSocket
      markAsRead(notification.id);
      
      // Also mark via REST API as backup
      dispatch(markNotificationRead(notification.id));
    }
    
    // Navigate based on notification type
    handleNotificationNavigation(notification);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationNavigation = (notification) => {
    // Navigate to relevant page based on notification type
    if (notification.report) {
      navigate(`/reports-page`);
    } else if (notification.query) {
      navigate(`/queries`);
    }
  };

  const getNotificationIcon = (type) => {
    const colors = {
      REPORT_UPDATE: 'bg-blue-500',
      COMMENT_MENTION: 'bg-purple-500',
      REPORT_APPROVED: 'bg-green-500',
      CLIENT_QUERY_CREATED: 'bg-orange-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      {/* Bell Icon with Badge - Already styled in Header */}
      <button
        className="icon-button notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="menu-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="notification-dropdown-panel">
          {/* Header */}
          <div className="dropdown-header">
            <h3 className="dropdown-title">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllRead}
                title="Mark all as read"
              >
                <CheckCheck size={16} />
                <span className="mark-all-text">Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {loading && notifications.length === 0 ? (
              <div className="loading-state">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} className="empty-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.is_read ? 'read' : 'unread'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Icon */}
                    <div className={`notification-icon-wrapper ${getNotificationIcon(notification.type)}`}>
                      <Bell size={20} className="notification-bell-icon" />
                      {!notification.is_read && <div className="unread-indicator" />}
                    </div>

                    {/* Content */}
                    <div className="notification-content">
                      <h4 className="notification-title">{notification.title}</h4>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>

                    {/* Mark as read button */}
                    {!notification.is_read && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                          dispatch(markNotificationRead(notification.id));
                        }}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {hasMore && (
                  <button
                    className="load-more-btn"
                    onClick={() => dispatch(fetchNotifications({ 
                      limit: 20, 
                      offset: notifications.length 
                    }))}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-container {
          position: relative;
        }

        .notification-dropdown-panel {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 380px;
          max-height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dropdown-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
        }

        .dropdown-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .mark-all-read-btn {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          font-size: 13px;
        }

        .mark-all-read-btn:hover {
          background: #f3f4f6;
          color: #3b82f6;
        }

        .mark-all-text {
          font-size: 12px;
        }

        .notifications-list {
          flex: 1;
          overflow-y: auto;
          max-height: 432px;
        }

        .notification-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }

        .notification-item:hover {
          background: #f9fafb;
        }

        .notification-item.unread {
          background: #eff6ff;
        }

        .notification-item.unread:hover {
          background: #dbeafe;
        }

        .notification-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }

        .bg-blue-500 {
          background: #3b82f6;
        }

        .bg-purple-500 {
          background: #a855f7;
        }

        .bg-green-500 {
          background: #10b981;
        }

        .bg-orange-500 {
          background: #f97316;
        }

        .bg-gray-500 {
          background: #6b7280;
        }

        .notification-bell-icon {
          color: white;
        }

        .unread-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-message {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #6b7280;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .mark-read-btn {
          padding: 6px;
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .mark-read-btn:hover {
          background: #e5e7eb;
          color: #3b82f6;
        }

        .loading-state,
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #6b7280;
        }

        .empty-icon {
          margin: 0 auto 12px;
          color: #d1d5db;
        }

        .load-more-btn {
          width: 100%;
          padding: 12px;
          border: none;
          background: transparent;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .load-more-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .load-more-btn:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        /* Scrollbar styling */
        .notifications-list::-webkit-scrollbar {
          width: 6px;
        }

        .notifications-list::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .notifications-list::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .notifications-list::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .notification-dropdown-panel {
            width: 320px;
            right: -8px;
          }

          .mark-all-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsDropdown;