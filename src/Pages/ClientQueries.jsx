import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, ChevronDown, ChevronUp, Users, Loader } from 'lucide-react';
import IncidentModal from '../Component/IncidentModal';
import AssignTasksModal from '../Component/AssignTasksModal';
import { fetchQueriesThunk } from '../features/queries/queryThunks';

// CSS styles (same as before)
const styles = `
  .dashboard-container {
    display: flex;
    width: 100%;
  }
  .main-content {
    flex: 1;
  }
  .queries-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .queries-header {
    margin-bottom: 24px;
  }
  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 600;
  }
  .header-icon {
    width: 24px;
    height: 24px;
    color: #4B5563;
  }
  .tabs-container {
    display: flex;
    gap: 10px;
  }
  .tab-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px;
    border-radius: 10px;
    font-size: 12px;
    cursor: pointer;
    border: none;
  }
  .tab-button.active {
    background-color: black;
    color: white;
  }
  .tab-button.inactive {
    color: #6B7280;
  }
  .tab-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .tab-indicator.active {
    background-color: #fff;
  }
  .tab-indicator.inactive {
    background-color: #D1D5DB;
  }
  .search-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 15px;
    margin-bottom: 35px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .search-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }
  .queries-search-input-container {
    position: relative;
    height: 40px;
  }
  .queries-search-input {
    padding: 8px 16px 8px 40px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    width: 256px;
    height: 100%;
    font-size: 14px;
    box-sizing: border-box;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF;
    pointer-events: none;
  }
  .create-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    height: 40px;
    background-color: #d72e59;
    border-radius: 5px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
  }
  .dropdown-menu {
    position: absolute;
    top: 45px;
    right: 0;
    background-color: #fff;
    border: 1px solid #E5E7EB;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
  }
  .dropdown-item:hover {
    background-color: #F3F4F6;
  }
  .desktop-table {
    width: 100%;
    border-collapse: collapse;
  }
  @media (max-width: 768px) {
    .desktop-table {
      display: none;
    }
  }
  .queries-page-table {
    width: 100%;
    border-collapse: collapse;
  }
  .queries-page-table .table-header {
    background-color: #fff;
    text-align: left;
  }
  .table-header th {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 400;
    color: rgb(103, 103, 103);
  }
  .header-content {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .table-row {
    border-top: 1px solid #E5E7EB;
  }
  .table-cell {
    padding: 22px 16px;
    font-size: 14px;
    color: #111827;
  }
  .date-time-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .incident-date {
    font-size: 14px;
    color: #111827;
  }
  .incident-time {
    font-size: 14px;
    color: #6B7280;
  }
  .store-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }
  .store-cell:hover {
    opacity: 0.8;
  }
  .store-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .store-name {
    font-size: 14px;
  }
  .status-badge {
    padding: 10px 15px;
    border-radius: 9999px;
    font-size: 12px;
    display: inline-block;
    cursor: pointer;
  }
  .status-badge:hover {
    opacity: 0.8;
  }
  .status-requested {
    background-color: #7C9A92;
    color: #fff;
  }
  .status-resolved {
    background-color: #60a5fa;
    color: #fff;
  }
  .video-thumbnail {
    width: 96px;
    height: 64px;
    background-color: #F3F4F6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .play-button {
    width: 32px;
    height: 32px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mobile-cards {
    display: none;
  }
  @media (max-width: 768px) {
    .mobile-cards {
      display: block;
    }
    .search-section {
      flex-direction: column;
      align-items: stretch;
    }
    .search-controls {
      width: 100%;
    }
    .queries-search-input-container {
      width: 100%;
    }
    .queries-search-input {
      width: 100%;
    }
  }
  .mobile-card {
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #F9FAFB;
    cursor: pointer;
  }
  .card-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .card-content {
    padding: 16px;
  }
  .card-row {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }
  .card-label {
    font-size: 12px;
    color: #6B7280;
    margin-bottom: 4px;
  }
  .card-value {
    font-size: 14px;
    color: #111827;
  }
  .read-more-button {
    background-color: transparent;
    color: #2563EB;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 14px;
  }
  .truncated-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
  .filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  .filter-pill {
    background-color: #f3f4f6;
    color: #4b5563;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .filter-pill:hover {
    background-color: #e5e7eb;
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
    margin-top: 16px;
  }
  .clear-filters-btn:hover {
    background-color: #e2e8f0;
  }
`;

const ClientQueries = () => {
  // Modal & dropdown states
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Mobile card & read-more states
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedDetails, setExpandedDetails] = useState({});
  
  // Search and filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Requested');
  const [filters, setFilters] = useState({
    storeId: null,
    storeName: null,
    queryType: null
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10
  });

  // Redux hooks to fetch queries dynamically
  const dispatch = useDispatch();
  const { results, count, next, loading, error } = useSelector((state) => state.queries);

  // Intersection observer for infinite loading
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

  // Initial data load with active tab filter
  useEffect(() => {
    dispatch(fetchQueriesThunk({
      storeId: filters.storeId,
      queryType: activeTab,
      searchTerm: searchTerm,
      offset: 0,
      limit: pagination.limit
    }));
    // Reset pagination when tab or filters change
    setPagination({
      offset: 0,
      limit: 10
    });
  }, [dispatch, activeTab, filters.storeId, searchTerm]);

  // Load more data when scrolling
  useEffect(() => {
    if (pagination.offset > 0) {
      dispatch(fetchQueriesThunk({
        storeId: filters.storeId,
        queryType: activeTab,
        searchTerm: searchTerm,
        offset: pagination.offset,
        limit: pagination.limit
      }));
    }
  }, [dispatch, pagination.offset]);

  // Debounce search input
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm) {
        // Reset pagination when search term changes
        setPagination({
          offset: 0,
          limit: 10
        });
      }
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Modal handlers
  const handleOpenIncidentModal = () => setShowIncidentModal(true);
  const handleCloseIncidentModal = () => setShowIncidentModal(false);
  const handleOpenAssignModal = () => setShowAssignModal(true);
  const handleCloseAssignModal = () => setShowAssignModal(false);

  // Toggle dropdown menu
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Toggle mobile card expansion
  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle read more details
  const toggleReadMore = (id, e) => {
    if (e) e.stopPropagation();
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter by store
  const handleFilterByStore = (storeId, storeName) => {
    setFilters(prev => ({
      ...prev,
      storeId: storeId === prev.storeId ? null : storeId,
      storeName: storeId === prev.storeId ? null : storeName
    }));
  };
  
  // Change active tab
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      storeId: null,
      storeName: null,
      queryType: null
    });
    setSearchTerm('');
  };

  // Function to format date & time from string (assuming dd/mm/yyyy format)
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return { date: formattedDate, time: formattedTime };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <main className="main-content">
          <div className="queries-container">
            {/* Header Section */}
            <div className="queries-header">
              <h2 className="header-title">
                <svg viewBox="0 0 24 24" className="header-icon" fill="none" stroke="currentColor">
                  <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
                Client Queries
                {count > 0 && <span style={{ fontSize: '14px', marginLeft: '8px', color: '#6B7280' }}>({count})</span>}
              </h2>
            </div>

            {/* Search & Tabs Section */}
            <div className="search-section">
              <div className="tabs-container">
                <button 
                  className={`tab-button ${activeTab === 'Requested' ? 'active' : 'inactive'}`}
                  onClick={() => handleTabChange('Requested')}
                >
                  <span className={`tab-indicator ${activeTab === 'Requested' ? 'active' : 'inactive'}`}></span>
                  Requested Queries
                </button>
                <button 
                  className={`tab-button ${activeTab === 'Resolved' ? 'active' : 'inactive'}`}
                  onClick={() => handleTabChange('Resolved')}
                >
                  <span className={`tab-indicator ${activeTab === 'Resolved' ? 'active' : 'inactive'}`}></span>
                  Resolved Queries
                </button>
              </div>
              <div className="search-controls">
                <div className="queries-search-input-container">
                  <input 
                    type="text" 
                    placeholder="Type here to search..." 
                    className="queries-search-input" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="search-icon" size={16} />
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="create-button" onClick={toggleDropdown}>
                    <Plus size={16} />
                    Create New Query
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          handleOpenIncidentModal();
                          setShowDropdown(false);
                        }}
                      >
                        Request Video
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          handleOpenAssignModal();
                          setShowDropdown(false);
                        }}
                      >
                        Assign Task
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active Filters */}
            {(filters.storeId || searchTerm) && (
              <div className="filter-pills">
                {filters.storeId && (
                  <div className="filter-pill" onClick={() => handleFilterByStore(filters.storeId, filters.storeName)}>
                    Store: {filters.storeName}
                    <ChevronUp size={12} />
                  </div>
                )}
                {searchTerm && (
                  <div className="filter-pill" onClick={() => setSearchTerm('')}>
                    Search: {searchTerm}
                    <ChevronUp size={12} />
                  </div>
                )}
                <div className="filter-pill" onClick={handleClearFilters}>
                  Clear All
                </div>
              </div>
            )}

            {/* Initial Loading State */}
            {loading && results.length === 0 && (
              <div className="initial-loading">
                <Loader size={32} className="animate-spin" />
                <p>Loading queries...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="error-state-container" style={{ padding: '32px', textAlign: 'center', color: '#e53e3e' }}>
                <p>Error: {error}</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    handleClearFilters();
                    dispatch(fetchQueriesThunk({
                      offset: 0,
                      limit: pagination.limit
                    }));
                  }}
                  style={{ marginTop: '16px' }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && results && results.length === 0 ? (
              <div className="empty-state-container">
                <div className="empty-state-icon-wrapper">
                  <Users className="empty-state-icon" />
                </div>
                <h3 className="empty-state-title">No client queries available</h3>
                <p className="empty-state-message">
                  {(filters.storeId || searchTerm) ? 
                    "No queries match your current filters. Try changing or clearing your filters." :
                    `There are currently no ${activeTab.toLowerCase()} queries to display. New queries will appear here once clients submit their requests.`
                  }
                </p>
                
                {(filters.storeId || searchTerm) && (
                  <button 
                    className="clear-filters-btn"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                )}
                <style jsx>{`
                  .empty-state-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px;
                    margin: 48px 0;
                    background: linear-gradient(to bottom, #f9fafb, #ffffff);
                    border-radius: 16px;
                    border: 1px solid #f0f0f0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                  }
                  
                  .empty-state-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 96px;
                    width: 96px;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    margin-bottom: 24px;
                  }
                  
                  .empty-state-icon {
                    height: 64px;
                    width: 64px;
                    color: #a0aec0;
                  }
                  
                  .empty-state-title {
                    font-size: 22px;
                    font-weight: 500;
                    color: #1a202c;
                    margin-bottom: 12px;
                  }
                  
                  .empty-state-message {
                    color: #718096;
                    text-align: center;
                    max-width: 420px;
                    line-height: 1.5;
                    margin-bottom: 16px;
                  }
                `}</style>
              </div>
            ) : (!loading && !error && results && results.length > 0 && (
              <>
                {/* Desktop Table View */}
                <div className="desktop-table">
                  <table className="queries-page-table">
                    <thead className="table-header">
                      <tr>
                        <th>S.No.</th>
                        <th>Store</th>
                        <th>Incident Date & Time</th>
                        <th>Status</th>
                        <th>Subject</th>
                        <th>Incident Details</th>
                        <th>Video Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((query, index) => {
                        const { date, time } = formatDateTime(query.incidentDate);
                        return (
                          <tr 
                            key={query.id} 
                            className="table-row"
                            ref={index === results.length - 1 ? lastQueryElementRef : null}
                          >
                            <td className="table-cell">{query.id}</td>
                            <td className="table-cell">
                              <div 
                                className="store-cell"
                                onClick={() => handleFilterByStore(query.store.id, query.store.name)}
                              >
                                <img src={query.store.image} alt={query.store.name} className="store-image" />
                                <span className="store-name">{query.store.name}</span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <div className="date-time-cell">
                                <span className="incident-date">{date}</span>
                                <span className="incident-time">{time}</span>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span 
                                className={`status-badge ${query.status === 'Requested' ? 'status-requested' : 'status-resolved'}`}
                                onClick={() => handleTabChange(query.status)}
                              >
                                {query.status}
                              </span>
                            </td>
                            <td className="table-cell">{query.subject}</td>
                            <td className="table-cell">
                              {query.incidentDetails.length > 50 ? (
                                <>
                                  {expandedDetails[query.id] 
                                    ? query.incidentDetails 
                                    : `${query.incidentDetails.substring(0, 50)}...`
                                  }
                                  <button className="read-more-button" onClick={() => toggleReadMore(query.id)}>
                                    {expandedDetails[query.id] ? 'Read less' : 'Read more'}
                                  </button>
                                </>
                              ) : query.incidentDetails}
                            </td>
                            <td className="table-cell">
                              {query.videoEvidence === 'video-url' ? (
                                <div className="video-thumbnail">
                                  <div className="play-button">
                                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    </svg>
                                  </div>
                                </div>
                              ) : query.videoEvidence}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {/* Loading more indicator */}
                  {loading && results.length > 0 && (
                    <div className="loading-more">
                      <Loader size={24} className="animate-spin" />
                      <span>Loading more queries...</span>
                    </div>
                  )}
                </div>

                {/* Mobile Card View */}
                <div className="mobile-cards">
                  {results.map((query, index) => {
                    const { date, time } = formatDateTime(query.incidentDate);
                    const isExpanded = expandedCards[query.id] || false;
                    const isDetailsExpanded = expandedDetails[query.id] || false;
                    return (
                      <div 
                        key={query.id} 
                        className="mobile-card"
                        ref={index === results.length - 1 ? lastQueryElementRef : null}
                      >
                        <div className="card-header" onClick={() => toggleCardExpansion(query.id)}>
                          <div className="card-header-left">
                            <img 
                              src={query.store.image} 
                              alt={query.store.name} 
                              className="store-image"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFilterByStore(query.store.id, query.store.name);
                              }}
                            />
                            <div>
                              <div 
                                className="store-name"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFilterByStore(query.store.id, query.store.name);
                                }}
                              >
                                {query.store.name}
                              </div>
                              <div className="incident-time">{date}</div>
                            </div>
                          </div>
                          <div>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="card-content">
                            <div className="card-row">
                              <div className="card-label">Incident Date & Time</div>
                              <div className="card-value">{date} at {time}</div>
                            </div>
                            <div className="card-row">
                              <div className="card-label">Status</div>
                              <div className="card-value">
                                <span 
                                  className={`status-badge ${query.status === 'Requested' ? 'status-requested' : 'status-resolved'}`}
                                  onClick={() => handleTabChange(query.status)}
                                >
                                  {query.status}
                                </span>
                              </div>
                            </div>
                            <div className="card-row">
                              <div className="card-label">Subject</div>
                              <div className="card-value">{query.subject}</div>
                            </div>
                            <div className="card-row">
                              <div className="card-label">Incident Details</div>
                              <div className="card-value">
                                <div className={isDetailsExpanded ? '' : 'truncated-text'}>
                                  {query.incidentDetails}
                                </div>
                                {query.incidentDetails.length > 60 && (
                                  <button 
                                    className="read-more-button" 
                                    onClick={(e) => toggleReadMore(query.id, e)}
                                  >
                                    {isDetailsExpanded ? 'Read less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="card-row">
                              <div className="card-label">Video Evidence</div>
                              <div className="card-value">
                                {query.videoEvidence === 'video-url' ? (
                                  <div className="video-thumbnail">
                                    <div className="play-button">
                                      <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                      </svg>
                                    </div>
                                  </div>
                                ) : query.videoEvidence}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Mobile loading more indicator */}
                  {loading && results.length > 0 && (
                    <div className="loading-more">
                      <Loader size={24} className="animate-spin" />
                      <span>Loading more queries...</span>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
        </main>
        
        {/* Modals */}
        <IncidentModal 
          isOpen={showIncidentModal} 
          onClose={handleCloseIncidentModal} 
          onSubmit={(formData) => {
            console.log('Incident form submitted:', formData);
            handleCloseIncidentModal();
          }}
        />
        <AssignTasksModal 
          isOpen={showAssignModal} 
          onClose={handleCloseAssignModal} 
          onSubmit={(formData) => {
            console.log('Assign tasks form submitted:', formData);
            handleCloseAssignModal();
          }}
        />
      </div>
    </>
  );
};

export default ClientQueries;