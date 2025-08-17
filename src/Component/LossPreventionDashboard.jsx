import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, ArrowUp, ArrowDown, ShieldCheck, AlertCircle, AlertTriangle, UserX, User } from 'lucide-react';
import { fetchStoreOwnerSummaryThunk } from '../features/reports/reportThunks';

const LossPreventionDashboard = ({ storeId = null }) => {
  const dispatch = useDispatch();
  const { storeOwnerSummary, storeOwnerSummaryLoading } = useSelector(state => state.reports);
  
  // Define all possible incident types with their display properties
  const allIncidentTypes = [
    {
      id: 'theftPrevented',
      name: 'Theft Prevented',
      icon: ShieldCheck,
      color: 'rgb(224, 224, 224)'
    },
    {
      id: 'theftReported',
      name: 'Theft Reported',
      icon: AlertCircle,
      color: '#d72e59'
    },
    {
      id: 'incidentReported',
      name: 'Incident Reported',
      icon: AlertTriangle,
      color: '#f1f1f1'
    },
    {
      id: 'customerDenied',
      name: 'Customer Denied',
      icon: UserX,
      color: '#10b981'
    },
    {
      id: 'cashierSuspicious',
      name: 'Cashier Suspicious',
      icon: User,
      color: '#f59e0b'
    }
  ];

  useEffect(() => {
    // Fetch the data when component mounts or storeId changes
    dispatch(fetchStoreOwnerSummaryThunk(storeId));
  }, [dispatch, storeId]);
  
  // Prepare segments data from the API response
  const prepareSegments = () => {
    // If we're still loading or don't have data, use all incident types with zero counts
    if (!storeOwnerSummary || storeOwnerSummaryLoading) {
      return allIncidentTypes.map(type => ({
        ...type,
        count: 0,
        change: 0,
        positive: true
      }));
    }
    
    const { incident_type_breakdown = {} } = storeOwnerSummary;
    
    // Start with all incident types and add counts where available
    return allIncidentTypes.map(type => {
      const count = incident_type_breakdown[type.id] || 0;
      
      return {
        ...type,
        count,
        change: 0, // We don't have change data in the API yet
        positive: true
      };
    });
  };
  
  const segments = prepareSegments();
  const total = segments.reduce((acc, curr) => acc + curr.count, 0);
  
  const calculateStrokeDasharray = (value, total) => {
    // Avoid division by zero
    if (total === 0) return '0 251.2';
    return `${(value / total) * 251.2} ${251.2}`;
  };
  
  // Generate skeleton placeholders for loading state
  const renderSkeletons = () => {
    return allIncidentTypes.map((type, index) => (
      <div key={`skeleton-${index}`} className="loss-prevention__segment loss-prevention__skeleton">
        <div className="loss-prevention__segment-info">
          <div className="loss-prevention__icon-container loss-prevention__skeleton-icon"></div>
          <span className="loss-prevention__label loss-prevention__skeleton-text"></span>
        </div>
        <div className="loss-prevention__metrics">
          <span className="loss-prevention__count loss-prevention__skeleton-text"></span>
          <div className="loss-prevention__change loss-prevention__skeleton-text"></div>
        </div>
      </div>
    ));
  };

  // Calculate the offsets for the donut chart segments
  const calculateOffset = (index) => {
    if (index === 0) return 0;
    return segments
      .slice(0, index)
      .reduce((acc, curr) => acc - (curr.count / (total || 1)) * 251.2, 0);
  };

  return (
    <div className="loss-prevention">
      <div className="loss-prevention__header">
        <h2 className="loss-prevention__title">Loss Prevention</h2>
        <ChevronRight className="loss-prevention__chevron" />
      </div>
      
      <div className="loss-prevention__content">
        <div className="loss-prevention__chart">
          {storeOwnerSummaryLoading ? (
            <div className="loss-prevention__donut-skeleton"></div>
          ) : (
            <svg viewBox="0 0 100 100" className="loss-prevention__donut">
              {total === 0 ? (
                // Show empty state when total is 0
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  strokeDasharray="251.2 0"
                  className="loss-prevention__donut-segment"
                />
              ) : (
                segments.map((segment, index) => (
                  <circle
                    key={segment.id}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="12"
                    strokeDasharray={calculateStrokeDasharray(segment.count, total)}
                    strokeDashoffset={calculateOffset(index)}
                    className="loss-prevention__donut-segment"
                  />
                ))
              )}
            </svg>
          )}
          
          <div className="loss-prevention__total">
            <div className="loss-prevention__total-label">Total</div>
            {storeOwnerSummaryLoading ? (
              <div className="loss-prevention__total-value loss-prevention__skeleton-text"></div>
            ) : (
              <div className="loss-prevention__total-value">{total.toLocaleString()}</div>
            )}
          </div>
        </div>
      
        <div className="loss-prevention__segments">
          {storeOwnerSummaryLoading ? (
            renderSkeletons()
          ) : (
            segments.map(segment => (
              <div 
                key={segment.id} 
                className="loss-prevention__segment"
                style={{ borderLeftColor: segment.color }}
              >
                <div className="loss-prevention__segment-info">
                  <div className="loss-prevention__icon-container" style={{ color: segment.color }}>
                    {React.createElement(segment.icon, { size: 16 })}
                  </div>
                  <span className="loss-prevention__label">{segment.name}</span>
                </div>
                <div className="loss-prevention__metrics">
                  <span className="loss-prevention__count">
                    {segment.count.toLocaleString()}
                  </span>
                  <div className={`loss-prevention__change ${
                    segment.positive ? 'loss-prevention__change--positive' : 'loss-prevention__change--negative'
                  }`}>
                    {segment.positive ? 
                      <ArrowUp className="loss-prevention__arrow" /> :
                      <ArrowDown className="loss-prevention__arrow" />
                    }
                    <span className="loss-prevention__change-value">{segment.change}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Add internal CSS to override the external CSS
const styles = `
  /* Enhanced styles for the Loss Prevention Dashboard */
  :root {
    --lp-primary-text: #1f2937;
    --lp-secondary-text: #6b7280;
    --lp-background: #ffffff;
    --lp-success: #10b981;
    --lp-danger: #ef4444;
    --lp-hover-bg: #f3f4f6;
    --lp-button-bg: #f9fafb;
    --lp-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    /* Original theme colors */
    --lp-prevented: rgb(224, 224, 224);
    --lp-reported: #d72e59;
    --lp-incident: #f1f1f1;
    
    /* Skeleton loading colors */
    --lp-skeleton-bg: #e5e7eb;
    --lp-skeleton-highlight: #f3f4f6;
  }

  .loss-prevention {
    width: 100%;
    max-width: 38rem;
    padding: 1.5rem;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color:#f0f0f0;
    border-radius: 1rem;
    box-shadow: var(--lp-shadow);
    transition: all 0.3s ease;
    box-sizing:border-box;
  }

 
  .loss-prevention__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .loss-prevention__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--lp-primary-text);
  }

  .loss-prevention__chevron {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--lp-secondary-text);
  }

  /* Content container explicitly set to row layout */
  .loss-prevention__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
  }

  .loss-prevention__chart {
    position: relative;
    flex: 0 0 auto;
    width: 40%;
  }

  .loss-prevention__donut {
    width: 100%;
    height: auto;
    transform: rotate(-90deg);
  }

  .loss-prevention__donut-segment {
    transition: all 0.3s ease;
  }

  .loss-prevention__donut-segment:hover {
    opacity: 0.8;
  }

  .loss-prevention__total {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .loss-prevention__total-label {
    font-size: 0.75rem;
    color: var(--lp-secondary-text);
    margin-bottom: 0.25rem;
  }

  .loss-prevention__total-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--lp-primary-text);
  }

  .loss-prevention__segments {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width:50%;
    box-sizing:border-box;
  }

  .loss-prevention__segment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  .loss-prevention__segment:hover {
    background-color: var(--lp-hover-bg);
  }

  .loss-prevention__segment-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .loss-prevention__icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    background-color: #f9fafb;
  }

  .loss-prevention__label {
    font-weight: 500;
    color: var(--lp-primary-text);
  }

  .loss-prevention__metrics {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .loss-prevention__count {
    font-weight: 600;
    color: var(--lp-primary-text);
  }

  .loss-prevention__change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .loss-prevention__change--positive {
    color: var(--lp-reported);
  }

  .loss-prevention__change--negative {
    color: var(--lp-danger);
  }

  .loss-prevention__arrow {
    width: 1rem;
    height: 1rem;
  }

  /* More prominent segment styling */
  .loss-prevention__segment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0.875rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    background-color: #f9fafb;
    border-left: 3px solid transparent;
  }

  .loss-prevention__segment:hover {
    background-color: #f3f4f6;
  }

  /* Skeleton loading styles */
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  .loss-prevention__skeleton-text {
    height: 0.875rem;
    width: 100%;
    background: var(--lp-skeleton-bg);
    background-image: linear-gradient(
      to right,
      var(--lp-skeleton-bg) 0%,
      var(--lp-skeleton-highlight) 20%,
      var(--lp-skeleton-bg) 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 0.25rem;
  }

  .loss-prevention__skeleton-icon {
    width: 1.75rem;
    height: 1.75rem;
    background: var(--lp-skeleton-bg);
    background-image: linear-gradient(
      to right,
      var(--lp-skeleton-bg) 0%,
      var(--lp-skeleton-highlight) 20%,
      var(--lp-skeleton-bg) 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 0.375rem;
  }

  .loss-prevention__donut-skeleton {
    width: 100%;
    padding-bottom: 100%; /* Makes it square */
    border-radius: 50%;
    background: var(--lp-skeleton-bg);
    background-image: linear-gradient(
      to right,
      var(--lp-skeleton-bg) 0%,
      var(--lp-skeleton-highlight) 20%,
      var(--lp-skeleton-bg) 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
  }

  .loss-prevention__skeleton .loss-prevention__label,
  .loss-prevention__skeleton .loss-prevention__count,
  .loss-prevention__skeleton .loss-prevention__change {
    width: 50px;
  }

  /* Responsive design adjustments */
  @media (max-width: 640px) {
    .loss-prevention__content {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .loss-prevention__chart {
      width: 8rem;
      margin: 0 auto 1rem;
    }
    
    .loss-prevention__segments {
      width: 100%;
    }

    .loss-prevention {
      padding: 1rem;
    }
  }
`;

// Apply the styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default LossPreventionDashboard;