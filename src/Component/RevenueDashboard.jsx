import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingDown, Star, ChevronRight, UserX, AlertTriangle, ThumbsDown, Shield, Plus } from 'lucide-react';
import '../CSS/RevenueDashboard.css';

// Import thunks to fetch reports and stores
import { fetchReportSummaryThunk } from '../features/reports/reportThunks';
import { fetchStoresThunk } from '../features/stores/storeThunks';

// Helper: safely get 0 if a key is missing
const getCount = (obj, key) => (obj && obj[key]) ? obj[key] : 0;

// Helper: Returns today's date in a formatted way
const getTodaysDate = () => {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return now.toLocaleDateString('en-US', options);
};

// Skeleton components
const SkeletonCircle = () => <div className="revenue-dashboard__skeleton-circle"></div>;
const SkeletonRect = ({ width, height, className = "" }) => (
  <div className={`revenue-dashboard__skeleton-rect ${className}`} style={{ width, height }}></div>
);

// Skeleton loaders for different components
const SkeletonStoreItem = () => (
  <div className="revenue-dashboard__store-item revenue-dashboard__skeleton-store-item">
    <div className="revenue-dashboard__store-item-name">
      <div className="revenue-dashboard__skeleton-circle revenue-dashboard__store-image"></div>
      <div className="revenue-dashboard__skeleton-rect" style={{ width: '80px', height: '14px' }}></div>
    </div>
    <div className="revenue-dashboard__skeleton-rect" style={{ width: '60px', height: '12px' }}></div>
  </div>
);

const SkeletonStoreHeaderStrip = () => (
  <div className="revenue-dashboard__store-head-strip">
    <div className="revenue-dashboard__plus-icon-container">
      <Plus className="revenue-dashboard__plus-icon-head" />
    </div>
    {[1, 2, 3, 4].map((index) => <SkeletonStoreItem key={index} />)}
  </div>
);

const SkeletonStoreStrip = () => (
  <div className="revenue-dashboard__store-strip">
    <div className="revenue-dashboard__store-list">
      {[1, 2, 3, 4].map((index) => <SkeletonStoreItem key={index} />)}
    </div>
    <div className="revenue-dashboard__skeleton-rect" style={{ width: '100px', height: '36px', borderRadius: '25px' }}></div>
  </div>
);

const SkeletonRevenueCard = () => (
  <div className="revenue-dashboard__revenue-card">
    <div className="revenue-dashboard__skeleton-rect" style={{ width: '120px', height: '16px', marginBottom: '8px' }}></div>
    <div className="revenue-dashboard__revenue-card-amount-wrapper">
      <div className="revenue-dashboard__skeleton-rect" style={{ width: '180px', height: '70px', marginBottom: '8px' }}></div>
      <div className="revenue-dashboard__skeleton-rect" style={{ width: '80px', height: '28px', borderRadius: '16px' }}></div>
    </div>
    <div className="revenue-dashboard__skeleton-rect" style={{ width: '100px', height: '12px' }}></div>
  </div>
);

const SkeletonStatCard = ({ dark }) => (
  <div className={`revenue-dashboard__stat-card ${dark ? 'revenue-dashboard__stat-card--dark' : 'revenue-dashboard__stat-card--light'}`}>
    <div className="revenue-dashboard__card-content">
      <div className="revenue-dashboard__card-header">
        <div className="revenue-dashboard__skeleton-rect" style={{ width: '100px', height: '14px' }}></div>
        {dark && <SkeletonCircle />}
      </div>
      
      <div className="revenue-dashboard__skeleton-rect" style={{ width: '80px', height: '26px', margin: '12px 0' }}></div>
      
      <div className="revenue-dashboard__card-footer">
        <div className="revenue-dashboard__user">
          <div className="revenue-dashboard__skeleton-circle revenue-dashboard__avatar"></div>
          <div className="revenue-dashboard__skeleton-rect" style={{ width: '70px', height: '12px' }}></div>
        </div>
        <div className="revenue-dashboard__skeleton-circle" style={{ width: '32px', height: '32px' }}></div>
      </div>
    </div>
  </div>
);

const StoreHeaderStrip = ({ stores }) => (
  <div className="revenue-dashboard__store-head-strip">
    <div className="revenue-dashboard__plus-icon-container">
      <Plus className="revenue-dashboard__plus-icon-head" />
    </div>
    {stores.map((store, index) => (
      <div key={store.id || index} className="revenue-dashboard__store-item">
        <div className="revenue-dashboard__store-item-name">
          <img 
            src={store.image || '/banner/login.png'} 
            alt={`${store.store_name} store`} 
            className="revenue-dashboard__store-image"
          />
          <span className="revenue-dashboard__store-name">{store.store_name}</span>
        </div>
      </div>
    ))}
  </div>
);

const StoreStrip = ({ stores }) => (
  <div className="revenue-dashboard__store-strip">
    <div className="revenue-dashboard__store-list">
      {stores.map((store, index) => (
        <div key={store.id || index} className="revenue-dashboard__store-item">
          <div className="revenue-dashboard__store-item-name">
            <img 
              src={store.image || '/banner/login.png'} 
              alt={`${store.store_name} store`} 
              className="revenue-dashboard__store-image"
            />
            <span className="revenue-dashboard__store-name">{store.store_name}</span>
          </div>
          <span className="revenue-dashboard__store-city">{store.store_city}</span>
        </div>
      ))}
    </div>
    <button className="revenue-dashboard__details-button">Details</button>
  </div>
);

const RevenueCard = ({ title, value, change, period }) => (
  <div className="revenue-dashboard__revenue-card">
    <div className="revenue-dashboard__revenue-card-label">{title}</div>
    <div className="revenue-dashboard__revenue-card-amount-wrapper">
      <span className="revenue-dashboard__revenue-card-amount">{value.toLocaleString()}</span>
      <span className="revenue-dashboard__revenue-card-change">
        <TrendingDown size={14} />
        {change}%
      </span>
    </div>
    <div className="revenue-dashboard__revenue-card-comparison">{period}</div>
  </div>
);

const StatCard = ({ title, value, subtitle, dark }) => {
  const getIcon = (title) => {
    switch (title) {
      case "Customer Denied":
        return <UserX size={16} />;
      case "Cashier Suspicious":
        return <AlertTriangle size={16} />;
      case "Theft Reported":
        return <ThumbsDown size={16} />;
      case "Incident Prevented":
        return <Shield size={16} />;
      default:
        return <Star size={16} />;
    }
  };

  return (
    <div className={`revenue-dashboard__stat-card ${dark ? 'revenue-dashboard__stat-card--dark' : 'revenue-dashboard__stat-card--light'}`}>
      <div className="revenue-dashboard__card-content">
        <div className="revenue-dashboard__card-header">
          <h3 className="revenue-dashboard__card-title">{title}</h3>
          {dark && <Star className="revenue-dashboard__star-icon" size={20} />}
        </div>
        
        <div className="revenue-dashboard__card-value">
          {value >= 1000 ? `$${value.toLocaleString()}` : value}
        </div>
        
        <div className="revenue-dashboard__card-footer">
          <div className="revenue-dashboard__user">
            <div className="revenue-dashboard__avatar">
              {getIcon(title)}
            </div>
            <span className="revenue-dashboard__user-name">{subtitle}</span>
          </div>
          <button className="revenue-dashboard__arrow-button">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const RevenueDashboard = () => {
  const dispatch = useDispatch();

  // Access report data from Redux
  const { summary, summaryLoading, summaryError } = useSelector((state) => state.reports);
  // Access store data from Redux
  const { stores, loading: storeLoading, error: storeError } = useSelector((state) => state.stores);

  // Loading state: true if either summary or stores are loading
  const isLoading = summaryLoading || storeLoading;
  // Error state: contains first error message if any
  const errorMessage = summaryError || storeError;

  useEffect(() => {
    dispatch(fetchReportSummaryThunk());
    dispatch(fetchStoresThunk());
  }, [dispatch]);

  const totalReports = summary?.total_reports || 0;
  const breakdown = summary?.incident_type_breakdown || {};

  // Map breakdown keys to stat cards
  const statMappings = [
    { key: 'theftPrevented', label: 'Incident Prevented', subtitle: 'Security Ops', dark: false },
    { key: 'cashierSuspicious', label: 'Cashier Suspicious', subtitle: 'Store Staff', dark: true },
    { key: 'theftReported', label: 'Theft Reported', subtitle: 'Loss Prevention', dark: false },
    { key: 'customerDenied', label: 'Customer Denied', subtitle: 'Security Team', dark: false },
  ];

  // Get today's date
  const todaysDate = getTodaysDate();

  // CSS for skeleton loading
  const skeletonStyles = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    .revenue-dashboard__skeleton-rect, .revenue-dashboard__skeleton-circle {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    
    .revenue-dashboard__skeleton-circle {
      border-radius: 50%;
    }
    
    .revenue-dashboard__skeleton-store-item {
      border: 0.5px solid #e6e6e6;
    }
  `;

  return (
    <div className="revenue-dashboard">
      <style>{skeletonStyles}</style>
      
      {/* Store Header Strip - show skeleton when loading */}
      {isLoading ? (
        <SkeletonStoreHeaderStrip />
      ) : (
        <StoreHeaderStrip stores={stores} />
      )}
      
      {/* Dashboard Header - always show this */}
      <div className="revenue-dashboard__header">
        <div className="revenue-dashboard__title-wrapper">
          <h1 className="revenue-dashboard__title">New report</h1>
          <div className="revenue-dashboard__avatars">
            <div className="revenue-dashboard__avatar revenue-dashboard__avatar--blue"></div>
            <div className="revenue-dashboard__avatar revenue-dashboard__avatar--green"></div>
            <div className="revenue-dashboard__avatar revenue-dashboard__avatar--purple"></div>
            <div className="revenue-dashboard__avatar revenue-dashboard__avatar--add">
              <span>+</span>
            </div>
          </div>
        </div>
        <div className="revenue-dashboard__date-display">
          <span>Today</span>
          <span className="revenue-dashboard__date-selector">{todaysDate}</span>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && <p className="revenue-dashboard__error-message">Error: {errorMessage}</p>}

      {/* Statistics Box - show skeleton when loading or real data when loaded */}
      <div className="revenue-dashboard__statistics-box">
        {isLoading ? (
          <SkeletonRevenueCard />
        ) : (
          <RevenueCard
            title="Total Reports"
            value={totalReports}
            change={0}
            period="vs previous data"
          />
        )}

        <div className="revenue-dashboard__metrics-grid">
          {isLoading ? (
            // Show skeleton stat cards when loading
            statMappings.map((item, index) => (
              <SkeletonStatCard key={index} dark={item.dark} />
            ))
          ) : (
            // Show real stat cards when data is loaded
            statMappings.map((item) => (
              <StatCard
                key={item.key}
                title={item.label}
                value={getCount(breakdown, item.key)}
                subtitle={item.subtitle}
                dark={item.dark}
              />
            ))
          )}
        </div>
      </div>

      {/* Store Strip - show skeleton when loading */}
      {isLoading ? (
        <SkeletonStoreStrip />
      ) : (
        <StoreStrip stores={stores} />
      )}
    </div>
  );
};

export default RevenueDashboard;