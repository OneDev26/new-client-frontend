import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, Legend, Cell 
} from 'recharts';import { Gauge, Video, AlertCircle, ChevronUp, ChevronDown, Users, Loader } from 'lucide-react';
import "../CSS/SeverityReports.css";
import { fetchReportSummaryThunk, fetchMonthlySeverityBreakdownThunk } from '../features/reports/reportThunks';
import { fetchQueriesThunk } from '../features/queries/queryThunks';
import IncidentModal from '../Component/IncidentModal';
import AssignTasksModal from '../Component/AssignTasksModal';
import LossPreventionDashboard from "./LossPreventionDashboard";

// -------------------------------------------------------------
// ClientQueriesTable Component
// -------------------------------------------------------------

const ClientQueriesTable = () => {
  const dispatch = useDispatch();
  const { results, count, next, loading, error } = useSelector((state) => state.queries);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCards, setExpandedCards] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 748);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filters, setFilters] = useState({
    storeId: null,
    queryType: null,
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
  });
  
  const observer = useRef();
  const lastQueryElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next) {
        setPagination(prev => ({
          ...prev,
          offset: prev.offset + prev.limit
        }));
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, next]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchQueriesThunk({
      storeId: filters.storeId,
      queryType: filters.queryType,
      offset: 0,
      limit: pagination.limit
    }));
  }, [dispatch, filters]);

  // Fetch more data when scrolling
  useEffect(() => {
    if (pagination.offset > 0) {
      dispatch(fetchQueriesThunk({
        storeId: filters.storeId,
        queryType: filters.queryType,
        offset: pagination.offset,
        limit: pagination.limit
      }));
    }
  }, [dispatch, pagination.offset, filters]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 748);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter by store
  const handleFilterByStore = (storeId) => {
    setFilters(prev => ({
      ...prev,
      storeId: storeId === prev.storeId ? null : storeId // Toggle filter
    }));
    setPagination({ offset: 0, limit: 20 }); // Reset pagination
  };
  
  // Filter by query type
  const handleFilterByType = (queryType) => {
    setFilters(prev => ({
      ...prev,
      queryType: queryType === prev.queryType ? null : queryType
    }));
    setPagination({ offset: 0, limit: 20 }); // Reset pagination
  };

  const handleSelectRow = (id) => {
    setSelectedRows(selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === results.length ? [] : results.map(row => row.id));
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    
    // Note: This is client-side sorting. For server-side sorting, you would 
    // add sorting parameters to the fetchQueriesThunk and reset pagination.
  };

  const toggleCardExpand = (id) => {
    setExpandedCards(expandedCards.includes(id)
      ? expandedCards.filter(cardId => cardId !== id)
      : [...expandedCards, id]
    );
  };

  // Modal handlers
  const handleOpenIncidentModal = () => setShowIncidentModal(true);
  const handleCloseIncidentModal = () => setShowIncidentModal(false);
  const handleOpenAssignModal = () => setShowAssignModal(true);
  const handleCloseAssignModal = () => setShowAssignModal(false);
  const handleIncidentSubmit = (formData) => {
    console.log('IncidentModal submitted:', formData);
    handleCloseIncidentModal();
  };
  const handleAssignSubmit = (formData) => {
    console.log('AssignTasksModal submitted:', formData);
    handleCloseAssignModal();
  };

  return (
    <div className="queries-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Client Queries</h2>
          <span className="query-count">{selectedRows.length || count}</span>
        </div>
        <div className="header-filters">
          {/* Store filter dropdown could go here */}
        </div>
        <div className="header-actions">
          <button 
            className="action-btn video-btn" 
            onClick={handleOpenIncidentModal}
            disabled={selectedRows.length === 0}
          >
            <Video size={18} />
            Request Video
          </button>
          <button 
            className="action-btn assign-btn" 
            onClick={handleOpenAssignModal}
            disabled={selectedRows.length === 0}
          >
            <AlertCircle size={18} />
            Assign Task
          </button>
        </div>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {!error && results && results.length > 0 ? (
        <>
          {/* Desktop Table View */}
          {!isMobileView && (
            <div className="table-container">
              <table className="queries-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedRows.length === results.length && results.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="sortable-header" onClick={() => handleSort('store')}>
                      <div className="sort-header">
                        Store
                        <span className="sort-icons">
                          {sortConfig.key === 'store' ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                    <th className="sortable-header" onClick={() => handleSort('date')}>
                      <div className="sort-header">
                        Date
                        <span className="sort-icons">
                          {sortConfig.key === 'date' ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                    <th className="sortable-header" onClick={() => handleSort('status')}>
                      <div className="sort-header">
                        Status
                        <span className="sort-icons">
                          {sortConfig.key === 'status' ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                    <th>Subject</th>
                    <th>Video Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={selectedRows.includes(row.id) ? 'selected' : ''}
                      ref={index === results.length - 1 ? lastQueryElementRef : null}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                      <td>
                        <div 
                          className="store-info"
                          onClick={() => handleFilterByStore(row.store.id)}
                        >
                          <img
                            src={row.store.image || "/default-store-image.png"}
                            alt={row.store.store_name || row.store}
                            className="store-avatar"
                          />
                          <span>{row.store.store_name || row.store}</span>
                        </div>
                      </td>
                      <td>{row.date}</td>
                      <td>
                        <span 
                          className={`status-badge ${row.status.toLowerCase()}`}
                          onClick={() => handleFilterByType(row.status)}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>{row.subject}</td>
                      <td>
                        {row.videoEvidence ? (
                          <div className="video-preview">
                            <img src="/banner/login.png" alt="Video thumbnail" />
                            <div className="video-overlay">
                              <Video size={20} />
                            </div>
                          </div>
                        ) : (
                          <span className="no-video">No video available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Loading indicator at the bottom of the table */}
              {loading && (
                <div className="loading-more">
                  <Loader size={24} className="animate-spin" />
                  <span>Loading more queries...</span>
                </div>
              )}
            </div>
          )}

          {/* Mobile Card View */}
          {isMobileView && (
            <div className="query-card-container">
              {results.map((row, index) => (
                <div
                  key={row.id}
                  className={`query-card ${selectedRows.includes(row.id) ? 'query-card--selected' : ''}`}
                  ref={index === results.length - 1 ? lastQueryElementRef : null}
                >
                  <div className="query-card__header" onClick={() => toggleCardExpand(row.id)}>
                    <div className="query-card__checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="custom-checkbox query-card__checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(row.id);
                        }}
                      />
                    </div>
                    <div className="query-card__main-info">
                      <div 
                        className="query-card__store-info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterByStore(row.store.id);
                        }}
                      >
                        <img
                          src={row.store.image || "/default-store-image.png"}
                          alt={row.store.store_name || row.store}
                          className="store-avatar query-card__store-avatar"
                        />
                        <span className="query-card__store-name">{row.store.store_name || row.store}</span>
                      </div>
                      <span 
                        className={`status-badge query-card__status ${row.status.toLowerCase()}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterByType(row.status);
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className="query-card__toggle">
                      {expandedCards.includes(row.id) ? (
                        <ChevronUp size={20} className="query-card__toggle-icon" />
                      ) : (
                        <ChevronDown size={20} className="query-card__toggle-icon" />
                      )}
                    </div>
                  </div>

                  {expandedCards.includes(row.id) && (
                    <div className="query-card__content">
                      <div className="query-card__detail-row">
                        <span className="query-card__detail-label">Date:</span>
                        <span className="query-card__detail-value">{row.date}</span>
                      </div>
                      <div className="query-card__detail-row">
                        <span className="query-card__detail-label">Subject:</span>
                        <span className="query-card__detail-value">{row.subject}</span>
                      </div>
                      <div className="query-card__detail-row">
                        <span className="query-card__detail-label">Video Evidence:</span>
                        <span className="query-card__detail-value">
                          {row.videoEvidence ? (
                            <div className="video-preview query-card__video">
                              <img
                                src="/banner/login.png"
                                alt="Video thumbnail"
                                className="query-card__video-thumbnail"
                              />
                              <div className="video-overlay query-card__video-overlay">
                                <Video size={20} className="query-card__video-icon" />
                              </div>
                            </div>
                          ) : (
                            <span className="no-video query-card__no-video">No video available</span>
                          )}
                        </span>
                      </div>
                      <div className="query-card__actions">
                        <button className="query-card__action-btn query-card__video-btn" onClick={handleOpenIncidentModal}>
                          <Video size={16} className="query-card__action-icon" />
                          Request Video
                        </button>
                        <button className="query-card__action-btn query-card__assign-btn" onClick={handleOpenAssignModal}>
                          <AlertCircle size={16} className="query-card__action-icon" />
                          Assign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile loading indicator */}
              {loading && (
                <div className="loading-more mobile-loading">
                  <Loader size={24} className="animate-spin" />
                  <span>Loading more queries...</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (!loading && !error && results && results.length === 0 && (
        <div className="empty-queries-state-container">
          <div className="empty-queries-state-icon-wrapper">
            <Users className="empty-queries-state-icon" />
          </div>
          <h3 className="empty-queries-state-title">No client queries available</h3>
          <p className="empty-queries-state-message">
            {filters.storeId || filters.queryType ? 
              "No queries match your current filters. Try changing or clearing your filters." :
              "There are currently no client queries to display. New queries will appear here once clients submit their requests."
            }
          </p>
          
          {(filters.storeId || filters.queryType) && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setFilters({ storeId: null, queryType: null });
                setPagination({ offset: 0, limit: 20 });
              }}
            >
              Clear Filters
            </button>
          )}
          
          <style jsx>{`
            .empty-queries-state-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding:0 48px;
              margin: 48px 0;
              border-radius: 16px;
            }
            
            .empty-queries-state-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 96px;
              width: 96px;
              border-radius: 50%;
              background-color: #f5f5f5;
              margin-bottom: 24px;
            }
            
            .empty-queries-state-icon {
              height: 64px;
              width: 64px;
              color: #a0aec0;
            }
            
            .empty-queries-state-title {
              font-size: 22px;
              font-weight: 500;
              color: #1a202c;
              margin-bottom: 12px;
            }
            
            .empty-queries-state-message {
              color: #718096;
              text-align: center;
              max-width: 420px;
              line-height: 1.5;
              margin-bottom: 16px;
            }
            
            .clear-filters-btn {
              padding: 8px 16px;
              background-color: #edf2f7;
              color: #4a5568;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .clear-filters-btn:hover {
              background-color: #e2e8f0;
            }
          `}</style>
        </div>
      ))}
      
      {/* Initial loading state */}
      {loading && results.length === 0 && (
        <div className="initial-loading">
          <Loader size={32} className="animate-spin" />
          <p>Loading queries...</p>
        </div>
      )}
      
      {/* Shared Modals */}
      <IncidentModal
        isOpen={showIncidentModal}
        onClose={handleCloseIncidentModal}
        onSubmit={handleIncidentSubmit}
        selectedItems={results.filter(row => selectedRows.includes(row.id))}
      />
      <AssignTasksModal
        isOpen={showAssignModal}
        onClose={handleCloseAssignModal}
        onSubmit={handleAssignSubmit}
        selectedItems={results.filter(row => selectedRows.includes(row.id))}
      />
      
      {/* Additional styles */}
      <style jsx>{`
        .loading-more {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          gap: 8px;
          color: #4a5568;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .initial-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 16px;
          color: #4a5568;
        }
        
        .mobile-loading {
          padding: 12px;
          margin-top: 8px;
          border-radius: 8px;
          background-color: #f7fafc;
        }
        
        .store-info, .query-card__store-info, .status-badge {
          cursor: pointer;
        }
        
        .store-info:hover, .query-card__store-info:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default function SeverityReports({ storeId = null }) {
  const dispatch = useDispatch();
  const { 
    monthlySeverityBreakdown, 
    monthlySeverityBreakdownLoading, 
    monthlySeverityBreakdownError 
  } = useSelector(state => state.reports);
  
  // Fetch monthly severity data
  useEffect(() => {
    dispatch(fetchMonthlySeverityBreakdownThunk(storeId));
  }, [dispatch, storeId]);

  // Process data for the component when API response changes
  const severitySummary = React.useMemo(() => {
    if (!monthlySeverityBreakdown || !monthlySeverityBreakdown.monthly_averages) {
      return {
        high: { total: 0, open: 0 },
        medium: { total: 0, open: 0 },
        low: { total: 0, open: 0 },
      };
    }
    
    const { monthly_averages } = monthlySeverityBreakdown;
    
    // Calculate open counts (as percent of total)
    return {
      high: { 
        total: Math.round(monthly_averages.High || 0), 
        open: Math.round((monthly_averages.High || 0) * 0.3) // Assuming 30% are open
      },
      medium: { 
        total: Math.round(monthly_averages.Medium || 0), 
        open: Math.round((monthly_averages.Medium || 0) * 0.2) // Assuming 20% are open
      },
      low: { 
        total: Math.round(monthly_averages.Low || 0), 
        open: Math.round((monthly_averages.Low || 0) * 0.1) // Assuming 10% are open
      }
    };
  }, [monthlySeverityBreakdown]);

  // Process chart data - Keep the last 3 months of data
  const securityData = React.useMemo(() => {
    if (!monthlySeverityBreakdown || !monthlySeverityBreakdown.monthly_breakdown) {
      // Default empty data with Sep, Oct, Nov as in the original
      return [
        { month: 'Sep', high: 0, medium: 0, low: 0 },
        { month: 'Oct', high: 0, medium: 0, low: 0 },
        { month: 'Nov', high: 0, medium: 0, low: 0 }
      ];
    }
    
    const { monthly_breakdown } = monthlySeverityBreakdown;
    
    // Convert to array of monthly data objects
    const monthlyData = Object.entries(monthly_breakdown).map(([monthStr, data]) => {
      // Get month name from YYYY-MM format
      const date = new Date(monthStr + '-01');
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      
      return {
        month: monthName,
        high: data.High || 0,
        medium: data.Medium || 0,
        low: data.Low || 0
      };
    });
    
    // Sort chronologically
    monthlyData.sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
    
    // Get only the last 3 months
    return monthlyData.slice(-3);
  }, [monthlySeverityBreakdown]);

  return (
    <div className="report-queries">
      <ClientQueriesTable />

      <div className="security-overview">
        <div className="security-header">
          <div className="security-branding">
            <div className="security-logo">
              <Gauge />
            </div>
            <div className="security-title">
              <h2>Reports Severity Level</h2>
              <p>Security Overview</p>
            </div>
          </div>
          <div className="report-filters">
            <button className="filter-btn filter-btn--active">All Reports</button>
            <button className="filter-btn">Open</button>
            <button className="filter-btn">Resolved</button>
          </div>
        </div>

        <div className="security-metrics">
          {/* Dynamic Severity Summary Card */}
          <div className="severity-summary">
            {monthlySeverityBreakdownLoading ? (
              <>
                <span className="summary-timeframe skeleton-text"></span>
                <div className="severity-metrics">
                  <div className="severity-metric severity-metric--high">
                    <p className="metric-label skeleton-text"></p>
                    <p className="metric-value skeleton-text"></p>
                  </div>
                  <div className="severity-metric severity-metric--medium">
                    <p className="metric-label skeleton-text"></p>
                    <p className="metric-value skeleton-text"></p>
                  </div>
                  <div className="severity-metric severity-metric--low">
                    <p className="metric-label skeleton-text"></p>
                    <p className="metric-value skeleton-text"></p>
                  </div>
                </div>
              </>
            ) : monthlySeverityBreakdownError ? (
              <p className="error">{monthlySeverityBreakdownError}</p>
            ) : (
              <>
                <span className="summary-timeframe">Average monthly</span>
                <div className="severity-metrics">
                  <div className="severity-metric severity-metric--high">
                    <p className="metric-label">High Severity</p>
                    <p className="metric-value">
                      {severitySummary.high.total}
                      <span className="metric-detail"> Reports</span>
                    </p>
                  </div>
                  <div className="severity-metric severity-metric--medium">
                    <p className="metric-label">Medium Severity</p>
                    <p className="metric-value">
                      {severitySummary.medium.total}
                      <span className="metric-detail"> Reports</span>
                    </p>
                  </div>
                  <div className="severity-metric severity-metric--low">
                    <p className="metric-label">Low Severity</p>
                    <p className="metric-value">
                      {severitySummary.low.total}
                      <span className="metric-detail"> Reports</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Trend Analysis Section */}
          <div className="trend-analysis">
            <ResponsiveContainer width="100%" height={300}>
              {monthlySeverityBreakdownLoading ? (
                <BarChart data={securityData} barGap={2} barCategoryGap="10%" maxBarSize={70}>
                  <defs>
                    <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#e5e7eb" />
                      <stop offset="50%" stopColor="#f3f4f6" />
                      <stop offset="100%" stopColor="#e5e7eb" />
                    </linearGradient>
                    <pattern
                      id="slantLines"
                      patternUnits="userSpaceOnUse"
                      width="6"
                      height="6"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y="0" x2="0" y2="100" stroke="white" strokeWidth="5" />
                    </pattern>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                  <Bar dataKey="high" fill="url(#skeletonGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="medium" fill="url(#skeletonGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="low" fill="url(#skeletonGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={securityData} barGap={2} barCategoryGap="10%" maxBarSize={70}>
                  <defs>
                    <pattern
                      id="slantLines"
                      patternUnits="userSpaceOnUse"
                      width="6"
                      height="6"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y="0" x2="0" y2="100" stroke="white" strokeWidth="5" />
                    </pattern>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                  <Bar dataKey="high" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="medium" fill="#e0e0e0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="low" fill="url(#slantLines)" background={{ fill: '#e0e0e0' }} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
            <div className="trend-legend">
              <div className="trend-indicator">
                <div className="indicator-color indicator-color--high"></div>
                <span>High</span>
              </div>
              <div className="trend-indicator">
                <div className="indicator-color indicator-color--medium"></div>
                <span>Medium</span>
              </div>
              <div className="trend-indicator">
                <div className="indicator-color indicator-color--low"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LossPreventionDashboard storeId={storeId} />
    </div>
  );
}
