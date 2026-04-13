import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, MapPin, Video, Filter, Search, RefreshCw, Download, Eye, X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, FileX, ChevronDown, ChevronUp } from 'lucide-react';

// Import thunks from your reportThunks file
import {
  fetchReportsThunk,
  fetchReportSummaryThunk,
  fetchReportsByYearThunk,
  fetchReportsByMonthThunk,
  fetchReportsByWeekThunk,
  fetchReportsByDateRangeThunk
} from '../features/reports/reportThunks'; // Adjust import path as needed

import '../CSS/ReportsInterface.css';

const ReportsInterface = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    results: reports = [], 
    loading = false, 
    error = null, 
    count: totalCount = 0, 
    next = null 
  } = useSelector(state => state.reports || {});

  // Filter state
  const [filters, setFilters] = useState({
    filterType: 'all',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: 1,
    startDate: '',
    endDate: '',
    status: 'all',
    severity: 'all',
    storeId: '',
    employeeId: '',
    search: '',
    incidentType: 'all'
  });

  // Pagination and UI state
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [videoStates, setVideoStates] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  
  const LIMIT = 20;

  // Toggle card expansion
  const toggleCardExpansion = (reportId) => {
    setExpandedCards(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  // Media viewer functions
  const openMediaViewer = (mediaFiles, index = 0) => {
    setSelectedMedia(mediaFiles);
    setCurrentMediaIndex(index);
  };

  const closeMediaViewer = () => {
    setSelectedMedia(null);
    setCurrentMediaIndex(0);
    // Pause any playing videos
    Object.keys(videoStates).forEach(key => {
      if (videoStates[key].isPlaying) {
        const video = document.getElementById(key);
        if (video) video.pause();
      }
    });
  };

  const navigateMedia = (direction) => {
    if (!selectedMedia) return;
    
    const newIndex = direction === 'next' 
      ? Math.min(currentMediaIndex + 1, selectedMedia.length - 1)
      : Math.max(currentMediaIndex - 1, 0);
    
    setCurrentMediaIndex(newIndex);
  };

  // Video player functions
  const toggleVideoPlay = (videoId) => {
    const video = document.getElementById(videoId);
    if (!video) return;

    const currentState = videoStates[videoId] || { isPlaying: false, isMuted: false, progress: 0, duration: 0 };
    
    if (currentState.isPlaying) {
      video.pause();
      setVideoStates(prev => ({
        ...prev,
        [videoId]: { ...currentState, isPlaying: false }
      }));
    } else {
      video.play();
      setVideoStates(prev => ({
        ...prev,
        [videoId]: { ...currentState, isPlaying: true }
      }));
    }
  };

  const toggleVideoMute = (videoId) => {
    const video = document.getElementById(videoId);
    if (!video) return;

    const currentState = videoStates[videoId] || { isPlaying: false, isMuted: false, progress: 0, duration: 0 };
    video.muted = !currentState.isMuted;
    
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { ...currentState, isMuted: !currentState.isMuted }
    }));
  };

  const handleVideoProgress = (videoId, e) => {
    const video = e.target;
    const progress = (video.currentTime / video.duration) * 100;
    
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        progress: progress || 0,
        duration: video.duration || 0,
        currentTime: video.currentTime || 0
      }
    }));
  };

  const seekVideo = (videoId, e) => {
    const video = document.getElementById(videoId);
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const progress = (e.clientX - rect.left) / rect.width;
    
    if (video && video.duration) {
      video.currentTime = progress * video.duration;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper functions
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const getDateRangeFromFilters = useCallback(() => {
    let startDate = '';
    let endDate = '';

    switch (filters.filterType) {
      case 'daily':
        if (filters.startDate) {
          startDate = filters.startDate;
          endDate = filters.startDate;
        } else {
          const todayStr = getCurrentDate();
          startDate = todayStr;
          endDate = todayStr;
        }
        break;
        
      case 'weekly':
        const yearStart = new Date(filters.year, 0, 1);
        const weekStart = new Date(yearStart);
        weekStart.setDate(yearStart.getDate() + (filters.week - 1) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        startDate = weekStart.toISOString().split('T')[0];
        endDate = weekEnd.toISOString().split('T')[0];
        break;
        
      case 'monthly':
        const monthStart = new Date(filters.year, filters.month - 1, 1);
        const monthEnd = new Date(filters.year, filters.month, 0);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = monthEnd.toISOString().split('T')[0];
        break;
        
      case 'yearly':
        startDate = `${filters.year}-01-01`;
        endDate = `${filters.year}-12-31`;
        break;
        
      case 'dateRange':
        startDate = filters.startDate;
        endDate = filters.endDate;
        break;
    }

    return { startDate, endDate };
  }, [filters]);

  const buildQueryParams = useCallback((offset = 0) => {
    const { startDate, endDate } = getDateRangeFromFilters();
    
    const params = {
      limit: LIMIT,
      offset: offset
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.severity !== 'all') params.severity = filters.severity;
    if (filters.storeId) params.store_id = filters.storeId;
    if (filters.employeeId) params.employee_id = filters.employeeId;
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.incidentType !== 'all') params.incident_type = filters.incidentType;

    return params;
  }, [filters, getDateRangeFromFilters]);

  const fetchReports = useCallback((offset = 0, append = false) => {
    console.log('Fetching reports with filters:', filters);
    const params = buildQueryParams(offset);
    console.log('API params:', params);
    
    // Create proper action payload
    const actionPayload = {
      ...params,
      append: append
    };
    
    dispatch(fetchReportsThunk(actionPayload));
  }, [dispatch, buildQueryParams, filters]);

  // Event handlers
  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    setCurrentOffset(0);
    setHasAppliedFilters(true);
    fetchReports(0, false);
  };

  const handleLoadMore = () => {
    const newOffset = currentOffset + LIMIT;
    setCurrentOffset(newOffset);
    fetchReports(newOffset, true);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      filterType: 'all',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      week: 1,
      startDate: '',
      endDate: '',
      status: 'all',
      severity: 'all',
      storeId: '',
      employeeId: '',
      search: '',
      incidentType: 'all'
    };
    
    setFilters(defaultFilters);
    setCurrentOffset(0);
    setHasAppliedFilters(false);
    
    dispatch(fetchReportsThunk({ limit: LIMIT, offset: 0 }));
  };

  const handleFilterChange = (key, value) => {
    console.log(`Filter change: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    const params = buildQueryParams();
    console.log('Exporting reports with parameters:', params);
    alert('Export functionality would be implemented here');
  };

  const formatStatus = (status) => {
    const statusMap = {
      'APPROVED': 'Approved',
      'SUBMITTED_REVIEW': 'Under Review',
      'SUBMITTED_APPROVAL': 'Pending Approval',
      'DECLINED': 'Declined',
      'DISCREPANCY': 'Discrepancy'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `ri-reports-interface__status ri-reports-interface__status-${status?.toLowerCase()}`;
  };

  const getSeverityClass = (severity) => {
    return `ri-reports-interface__severity-badge ri-reports-interface__severity--${severity?.toLowerCase()}`;
  };

  const isVideoFile = (filename) => {
    if (!filename) return false;
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension);
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  // Render media thumbnails
  const renderMediaThumbnails = (mediaFiles) => {
    if (!mediaFiles || mediaFiles.length === 0) {
      return (
        <div className="ri-reports-interface__no-media">
          <FileX size={16} />
          No media
        </div>
      );
    }

    return (
      <div className="ri-reports-interface__media-section">
        <div className="ri-reports-interface__media-thumbnails">
          {mediaFiles.slice(0, 3).map((media, index) => (
            <div
              key={index}
              className="ri-reports-interface__media-thumbnail"
              onClick={() => openMediaViewer(mediaFiles, index)}
              style={{
                backgroundImage: isImageFile(media.file) ? `url(${media.file})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {isVideoFile(media.file) && <Play size={20} color="#757575" />}
            </div>
          ))}
          {mediaFiles.length > 3 && (
            <div
              className="ri-reports-interface__media-thumbnail"
              onClick={() => openMediaViewer(mediaFiles, 3)}
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#757575',
                backgroundColor: '#f3f4f6'
              }}
            >
              +{mediaFiles.length - 3}
            </div>
          )}
        </div>
        <div className="ri-reports-interface__media-count">
          {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  // Render mobile card
  const renderMobileCard = (report) => {
    const isExpanded = expandedCards[report.id];

    return (
      <div key={report.id} className="ri-reports-interface__mobile-card">
        <div 
          className="ri-reports-interface__mobile-card-header"
          onClick={() => toggleCardExpansion(report.id)}
        >
          <div className="ri-reports-interface__mobile-card-main-info">
            <div className="ri-reports-interface__store">
              <img
                src={report.store?.image || '/default/store.png'}
                alt={report.store?.store_name || 'Store'}
                className="ri-reports-interface__store-image"
                onError={(e) => {
                  e.target.src = '/default/store.png';
                }}
              />
              <div className="ri-reports-interface__store-details">
                <div className="ri-reports-interface__store-name">
                  {report.store?.store_name || 'Unknown Store'}
                </div>
                <div className="ri-reports-interface__store-location">
                  {report.store?.store_city || 'Unknown Location'}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <span className={getStatusClass(report.status)}>
                {formatStatus(report.status)}
              </span>
            </div>
          </div>
          <button className="ri-reports-interface__mobile-card-expand-btn">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className={`ri-reports-interface__mobile-card-content ${isExpanded ? 'ri-reports-interface__mobile-card-content--expanded' : ''}`}>
          <div className="ri-reports-interface__mobile-card-body">
            <div className="ri-reports-interface__mobile-card-row">
              <div className="ri-reports-interface__mobile-card-label">Date & Time</div>
              <div className="ri-reports-interface__mobile-card-value">
                {new Date(report.incident_date).toLocaleDateString()} at {report.incident_time || 'Unknown time'}
              </div>
            </div>

            <div className="ri-reports-interface__mobile-card-row">
              <div className="ri-reports-interface__mobile-card-label">Description</div>
              <div className="ri-reports-interface__mobile-card-value">
                {report.details || 'No description available'}
              </div>
            </div>

            <div className="ri-reports-interface__mobile-card-row">
              <div className="ri-reports-interface__mobile-card-label">Severity</div>
              <div className="ri-reports-interface__mobile-card-value">
                <span className={getSeverityClass(report.severity || 'low')}>
                  {(report.severity || 'low').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="ri-reports-interface__mobile-card-row">
              <div className="ri-reports-interface__mobile-card-label">Media Files</div>
              <div className="ri-reports-interface__mobile-card-value">
                {renderMediaThumbnails(report.media_files)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Initial load
  useEffect(() => {
    if (!hasAppliedFilters && reports.length === 0) {
      console.log('Initial load');
      dispatch(fetchReportsThunk({ limit: LIMIT, offset: 0 }));
    }
  }, [dispatch, hasAppliedFilters, reports.length]);

  // Keyboard navigation for media viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedMedia) return;
      
      switch (e.key) {
        case 'Escape':
          closeMediaViewer();
          break;
        case 'ArrowLeft':
          navigateMedia('prev');
          break;
        case 'ArrowRight':
          navigateMedia('next');
          break;
      }
    };

    if (selectedMedia) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedMedia, currentMediaIndex]);

  console.log('Component render - Reports:', reports.length, 'Loading:', loading, 'Error:', error);

  const showEmptyState = !loading && reports.length === 0;

  return (
    <div className="ri-reports-interface">
      <div className="ri-reports-interface__main">
        <div className="ri-reports-interface__content">
          {/* Header */}
          <div className="ri-reports-interface__header">
            <h1 className="ri-reports-interface__title">All Reports</h1>
            <div className="ri-reports-interface__summary">
              <span className="ri-reports-interface__summary-text">
                <Eye size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {totalCount || 0} total reports
              </span>
            </div>
          </div>

          {/* Filters Section */}
          <div className="ri-reports-interface__filters">
            <div className="ri-reports-interface__filters-header">
              <div className="ri-reports-interface__filters-title">
                <Filter size={20} />
                Advanced Filters
              </div>
              <button className="ri-reports-interface__clear-filters-btn" onClick={handleClearFilters}>
                <RefreshCw size={16} />
                Clear All
              </button>
            </div>

            <div className="ri-reports-interface__filters-grid">
              {/* Time Filter Type */}
              <div className="ri-reports-interface__filter-group">
                <label className="ri-reports-interface__filter-label">Time Period</label>
                <select
                  className="ri-reports-interface__filter-select"
                  value={filters.filterType}
                  onChange={(e) => handleFilterChange('filterType', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="daily">Single Day</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="dateRange">Custom Date Range</option>
                </select>
              </div>

              {/* Conditional time inputs */}
              {filters.filterType === 'daily' && (
                <div className="ri-reports-interface__filter-group">
                  <label className="ri-reports-interface__filter-label">Select Date</label>
                  <input
                    type="date"
                    className="ri-reports-interface__filter-input"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
              )}

              {filters.filterType === 'weekly' && (
                <>
                  <div className="ri-reports-interface__filter-group">
                    <label className="ri-reports-interface__filter-label">Week Number</label>
                    <select
                      className="ri-reports-interface__filter-select"
                      value={filters.week}
                      onChange={(e) => handleFilterChange('week', parseInt(e.target.value))}
                    >
                      {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                        <option key={week} value={week}>Week {week}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ri-reports-interface__filter-group">
                    <label className="ri-reports-interface__filter-label">Year</label>
                    <select
                      className="ri-reports-interface__filter-select"
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {filters.filterType === 'monthly' && (
                <>
                  <div className="ri-reports-interface__filter-group">
                    <label className="ri-reports-interface__filter-label">Month</label>
                    <select
                      className="ri-reports-interface__filter-select"
                      value={filters.month}
                      onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ri-reports-interface__filter-group">
                    <label className="ri-reports-interface__filter-label">Year</label>
                    <select
                      className="ri-reports-interface__filter-select"
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {filters.filterType === 'yearly' && (
                <div className="ri-reports-interface__filter-group">
                  <label className="ri-reports-interface__filter-label">Year</label>
                  <select
                    className="ri-reports-interface__filter-select"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {filters.filterType === 'dateRange' && (
                <div className="ri-reports-interface__filter-group">
                  <label className="ri-reports-interface__filter-label">Date Range</label>
                  <div className="ri-reports-interface__date-range-group">
                    <input
                      type="date"
                      className="ri-reports-interface__filter-input"
                      placeholder="Start Date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      className="ri-reports-interface__filter-input"
                      placeholder="End Date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="ri-reports-interface__filter-group">
                <label className="ri-reports-interface__filter-label">Search</label>
                <div className="ri-reports-interface__search-input">
                  <Search className="ri-reports-interface__search-icon" />
                  <input
                    type="text"
                    className="ri-reports-interface__filter-input"
                    placeholder="Search reports, employees, stores..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="ri-reports-interface__filter-group">
                <label className="ri-reports-interface__filter-label">Status</label>
                <select
                  className="ri-reports-interface__filter-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="SUBMITTED_REVIEW">Under Review</option>
                  <option value="SUBMITTED_APPROVAL">Pending Approval</option>
                  <option value="DECLINED">Declined</option>
                  <option value="DISCREPANCY">Discrepancy</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="ri-reports-interface__filter-group">
                <label className="ri-reports-interface__filter-label">Severity</label>
                <select
                  className="ri-reports-interface__filter-select"
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Incident Type Filter */}
              <div className="ri-reports-interface__filter-group">
                <label className="ri-reports-interface__filter-label">Incident Type</label>
                <select
                  className="ri-reports-interface__filter-select"
                  value={filters.incidentType}
                  onChange={(e) => handleFilterChange('incidentType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="theftPrevented">Theft Prevented</option>
                  <option value="theftReported">Theft Reported</option>
                  <option value="incidentReported">Incident Reported</option>
                  <option value="customerDenied">Customer Denied</option>
                  <option value="cashierSuspicious">Cashier Suspicious</option>
                </select>
              </div>
            </div>

            {/* Apply Filters Section */}
            <div className="ri-reports-interface__apply-filters-section">
              <div className="ri-reports-interface__pagination-info">
                {hasAppliedFilters && totalCount !== undefined && (
                  <span>Showing filtered results ({totalCount} total)</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="ri-reports-interface__apply-filters-btn"
                  onClick={handleApplyFilters}
                  disabled={loading}
                >
                  {loading ? <div className="ri-reports-interface__loading-spinner" /> : <Filter size={16} />}
                  Apply Filters
                </button>
                <button className="ri-reports-interface__export-btn" onClick={handleExport}>
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="ri-reports-interface__error-message">
              Error loading reports: {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          {/* Empty State or Reports Table/Cards */}
          {showEmptyState ? (
            <div className="ri-reports-interface__empty-state">
              <FileX className="ri-reports-interface__empty-state-icon" />
              <h3>No reports found</h3>
              <p>
                {hasAppliedFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'No reports have been created yet. Reports will appear here once they have been generated.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="ri-reports-interface__table">
                <div className="ri-reports-interface__table-header">
                  <div>Store</div>
                  <div>Status</div>
                  <div>Description & Date</div>
                  <div>Severity</div>
                  <div>Media</div>
                </div>

                {/* Loading State */}
                {loading && reports.length === 0 && (
                  <div className="ri-reports-interface__empty-state">
                    <div className="ri-reports-interface__loading-spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto 1rem' }} />
                    <h3>Loading reports...</h3>
                    <p>Please wait while we fetch the latest reports.</p>
                  </div>
                )}

                {/* Reports List */}
                <div className="ri-reports-interface__table-body">
                  {reports.map((report) => (
                    <div key={report.id} className="ri-reports-interface__table-row">
                      <div className="ri-reports-interface__cell">
                        <div className="ri-reports-interface__store">
                          <img
                            src={report.store?.image || '/default/store.png'}
                            alt={report.store?.store_name || 'Store'}
                            className="ri-reports-interface__store-image"
                            onError={(e) => {
                              e.target.src = '/default/store.png';
                            }}
                          />
                          <div className="ri-reports-interface__store-details">
                            <div className="ri-reports-interface__store-name">
                              {report.store?.store_name || 'Unknown Store'}
                            </div>
                            <div className="ri-reports-interface__store-location">
                              {report.store?.store_city || 'Unknown Location'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ri-reports-interface__cell">
                        <div className={getStatusClass(report.status)}>
                          {formatStatus(report.status)}
                        </div>
                      </div>

                      <div className="ri-reports-interface__cell">
                        <div>
                          <div className="ri-reports-interface__date">
                            {new Date(report.incident_date).toLocaleDateString()} at{' '}
                            {report.incident_time || 'Unknown time'}
                          </div>
                          <div className="ri-reports-interface__details">
                            {report.details || 'No description available'}
                          </div>
                        </div>
                      </div>

                      <div className="ri-reports-interface__cell">
                        <span className={getSeverityClass(report.severity || 'low')}>
                          {(report.severity || 'low').toUpperCase()}
                        </span>
                      </div>

                      <div className="ri-reports-interface__cell">
                        {renderMediaThumbnails(report.media_files)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {reports.length > 0 && (
                  <div className="ri-reports-interface__pagination-section">
                    <div className="ri-reports-interface__pagination-info">
                      Showing {reports.length} of {totalCount || 0} reports
                    </div>
                    {next && (
                      <button
                        className="ri-reports-interface__load-more-btn"
                        onClick={handleLoadMore}
                        disabled={loading}
                      >
                        {loading ? <div className="ri-reports-interface__loading-spinner" /> : 'Load More'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Cards View */}
              <div className="ri-reports-interface__mobile-cards">
                {loading && reports.length === 0 ? (
                  <div className="ri-reports-interface__empty-state">
                    <div className="ri-reports-interface__loading-spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto 1rem' }} />
                    <h3>Loading reports...</h3>
                    <p>Please wait while we fetch the latest reports.</p>
                  </div>
                ) : (
                  <>
                    {reports.map((report) => renderMobileCard(report))}
                    
                    {/* Mobile Pagination */}
                    {reports.length > 0 && (
                      <div className="ri-reports-interface__pagination-section">
                        <div className="ri-reports-interface__pagination-info">
                          Showing {reports.length} of {totalCount || 0} reports
                        </div>
                        {next && (
                          <button
                            className="ri-reports-interface__load-more-btn"
                            onClick={handleLoadMore}
                            disabled={loading}
                          >
                            {loading ? <div className="ri-reports-interface__loading-spinner" /> : 'Load More'}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Media Viewer Modal */}
          {selectedMedia && (
            <div className="ri-reports-interface__media-modal" onClick={closeMediaViewer}>
              <div className="ri-reports-interface__media-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="ri-reports-interface__media-modal-close" onClick={closeMediaViewer}>
                  <X size={24} />
                </button>
                
                <div className="ri-reports-interface__media-viewer">
                  {selectedMedia.length > 1 && (
                    <>
                      <button
                        className="ri-reports-interface__media-nav-btn ri-reports-interface__media-nav-prev"
                        onClick={() => navigateMedia('prev')}
                        disabled={currentMediaIndex === 0}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        className="ri-reports-interface__media-nav-btn ri-reports-interface__media-nav-next"
                        onClick={() => navigateMedia('next')}
                        disabled={currentMediaIndex === selectedMedia.length - 1}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {selectedMedia[currentMediaIndex] && (
                    <>
                      {isVideoFile(selectedMedia[currentMediaIndex].file) ? (
                        <div className="ri-reports-interface__video-player">
                          <video
                            id={`modal-video-${currentMediaIndex}`}
                            className="ri-reports-interface__video-element"
                            src={selectedMedia[currentMediaIndex].file}
                            onTimeUpdate={(e) => handleVideoProgress(`modal-video-${currentMediaIndex}`, e)}
                            onLoadedMetadata={(e) => handleVideoProgress(`modal-video-${currentMediaIndex}`, e)}
                          />
                          <div className="ri-reports-interface__video-controls">
                            <button
                              className="ri-reports-interface__video-control-btn"
                              onClick={() => toggleVideoPlay(`modal-video-${currentMediaIndex}`)}
                            >
                              {videoStates[`modal-video-${currentMediaIndex}`]?.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            
                            <div
                              className="ri-reports-interface__video-progress"
                              onClick={(e) => seekVideo(`modal-video-${currentMediaIndex}`, e)}
                            >
                              <div
                                className="ri-reports-interface__video-progress-bar"
                                style={{ width: `${videoStates[`modal-video-${currentMediaIndex}`]?.progress || 0}%` }}
                              />
                            </div>
                            
                            <div className="ri-reports-interface__video-time">
                              {formatTime(videoStates[`modal-video-${currentMediaIndex}`]?.currentTime || 0)} / {formatTime(videoStates[`modal-video-${currentMediaIndex}`]?.duration || 0)}
                            </div>
                            
                            <button
                              className="ri-reports-interface__video-control-btn"
                              onClick={() => toggleVideoMute(`modal-video-${currentMediaIndex}`)}
                            >
                              {videoStates[`modal-video-${currentMediaIndex}`]?.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <img
                          className="ri-reports-interface__image-viewer"
                          src={selectedMedia[currentMediaIndex].file}
                          alt={`Media ${currentMediaIndex + 1}`}
                        />
                      )}
                    </>
                  )}
                </div>
                
                {selectedMedia.length > 1 && (
                  <div className="ri-reports-interface__media-counter">
                    {currentMediaIndex + 1} of {selectedMedia.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsInterface;