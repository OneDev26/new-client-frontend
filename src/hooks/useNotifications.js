// src/hooks/useNotifications.js
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, setUnreadCount } from '../features/notifications/notificationSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  // 🔧 FIX: Get token from localStorage instead of Redux
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    // 🔧 FIX: Get token from localStorage (same as axiosInstance)
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn('No access token found, cannot connect to WebSocket');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    // WebSocket URL with token
    const wsUrl = `wss://server.survill.com/ws/notifications/?token=${token}`;
    
    console.log('🔌 Connecting to WebSocket with token:', token.substring(0, 20) + '...');
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 WebSocket message received:', data);
          
          if (data.type === 'connection_established') {
            console.log('✅ Notification system connected:', data.message);
          } else {
            // New notification received
            console.log('🔔 New notification:', data);
            dispatch(addNotification(data));
            
            // Play notification sound (optional)
            playNotificationSound();
            
            // Show browser notification if permitted
            showBrowserNotification(data);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        wsRef.current = null;
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
    }
  }, [dispatch]); // 🔧 Removed token dependency

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const markAsRead = useCallback((notificationId) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Marking notification as read:', notificationId);
      wsRef.current.send(JSON.stringify({
        type: 'mark_read',
        notification_id: notificationId
      }));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot mark as read');
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Marking all notifications as read');
      wsRef.current.send(JSON.stringify({
        type: 'mark_all_read'
      }));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot mark all as read');
    }
  }, []);

  useEffect(() => {
    // 🔧 Connect when component mounts
    const token = localStorage.getItem('accessToken');
    if (token) {
      connect();
    } else {
      console.warn('⚠️ No access token found, skipping WebSocket connection');
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    markAsRead,
    markAllAsRead,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  };
};

// Helper functions
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Could not play notification sound:', err));
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

const showBrowserNotification = (data) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(data.title || 'New Notification', {
      body: data.message,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.id,
    });
  }
};

// Request notification permission on first use
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};

export default useNotifications;
