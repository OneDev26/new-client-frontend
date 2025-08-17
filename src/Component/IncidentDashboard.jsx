import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, Plus, Minus, FileX, Loader, Play, Download, Video, Image, File } from 'lucide-react';

// Import the thunk to fetch all reports
import { fetchReportsThunk } from '../features/reports/reportThunks';
import '../CSS/IncidentDashboard.css'; 

const IncidentDashboard = () => {
  const dispatch = useDispatch();
  const { results: reports, loading, error, count, next } = useSelector(state => state.reports);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const observer = useRef(null);
  const LIMIT = 20; // Number of reports per page

  // Initial data load
  useEffect(() => {
    dispatch(fetchReportsThunk({ limit: LIMIT, offset: 0 }));
  }, [dispatch]);

  // Reset pagination when filter changes
  useEffect(() => {
    setOffset(0);
    dispatch(fetchReportsThunk({ limit: LIMIT, offset: 0 }));
  }, [selectedFilter, dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.incident-severity-filter__dropdown') && 
          !event.target.closest('.incident-status-filter__dropdown') &&
          !event.target.closest('.incident-date-filter__dropdown')) {
        setShowSeverityDropdown(false);
        setShowStatusDropdown(false);
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle card expansion
  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Infinite scroll functionality
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next) {
        setLoadingMore(true);
        const newOffset = offset + LIMIT;
        setOffset(newOffset);
        
        dispatch(fetchReportsThunk({ 
          limit: LIMIT, 
          offset: newOffset 
        })).finally(() => {
          setLoadingMore(false);
        });
      }
    }, { threshold: 1.0 });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, next, offset, dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Helper function to get file type
  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    if (['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv'].includes(extension)) {
      return 'video';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    return 'file';
  };

  // Helper function to get filename from URL
  const getFileName = (url) => {
    if (!url) return 'Unknown File';
    const filename = url.split('/').pop() || 'Download';
    return decodeURIComponent(filename);
  };

  // Check if media container has overflow content
  const checkMediaOverflow = useCallback((mediaFiles) => {
    return mediaFiles && Array.isArray(mediaFiles) && mediaFiles.length > 2;
  }, []);

  // Render media files with improved handling - horizontal row layout
  const renderMediaFiles = (mediaFiles) => {
    // Debug log to see what we're getting
    console.log('Rendering media files:', mediaFiles);
    
    if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
      return (
        <div className="incident-media__empty">
          <File size={16} />
          <span>No media available</span>
        </div>
      );
    }

    const hasOverflow = checkMediaOverflow(mediaFiles);

    return (
      <div className="incident-media-container" data-has-overflow={hasOverflow}>
        <div className="incident-media-scroll">
          {mediaFiles.map((media, index) => {
            const fileUrl = media.file || media.url || media;
            const fileType = getFileType(fileUrl);
            const fileName = getFileName(fileUrl);
            const mediaId = media.id || index;
            
            console.log('Processing media:', { fileUrl, fileType, fileName, mediaId });
            
            if (fileType === 'video') {
              return (
                <div key={mediaId} className="incident-media__item">
                  <div className="incident-media__video-wrapper">
                    <video 
                      className="incident-media__video" 
                      controls 
                      preload="metadata"
                    >
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="incident-media__type-badge">
                      <Video size={12} />
                    </div>
                  </div>
                  <div className="incident-media__info">
                    <span className="incident-media__filename" title={fileName}>
                      {fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName}
                    </span>
                    <a 
                      href={fileUrl} 
                      download={fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="incident-media__download"
                      title="Download video"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              );
            } else if (fileType === 'image') {
              return (
                <div key={mediaId} className="incident-media__item">
                  <div className="incident-media__image-wrapper">
                    <img 
                      src={fileUrl} 
                      alt={`Incident media ${index + 1}`} 
                      className="incident-media__image"
                      onError={(e) => {
                        console.error('Image failed to load:', fileUrl);
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.incident-media__error').style.display = 'flex';
                      }}
                    />
                    <div className="incident-media__error" style={{ display: 'none' }}>
                      <File size={24} />
                      <span>Image unavailable</span>
                    </div>
                    <div className="incident-media__type-badge">
                      <Image size={12} />
                    </div>
                  </div>
                  <div className="incident-media__info">
                    <span className="incident-media__filename" title={fileName}>
                      {fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName}
                    </span>
                    <a 
                      href={fileUrl} 
                      download={fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="incident-media__download"
                      title="Download image"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={mediaId} className="incident-media__item">
                  <div className="incident-media__file">
                    <div className="incident-media__file-icon">
                      <File size={32} />
                    </div>
                  </div>
                  <div className="incident-media__info">
                    <span className="incident-media__filename" title={fileName}>
                      {fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName}
                    </span>
                    <a 
                      href={fileUrl} 
                      download={fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="incident-media__download"
                      title="Download file"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="incident-media__count">
          {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };
  
  // Function to render skeleton rows
  const renderSkeletonRows = (count) => {
    const rows = [];
    for (let i = 0; i < count; i++) {
      rows.push(
        <div key={`skeleton-row-${i}`} className="incident-row">
          <div className="incident-store">
            <div className="skeleton skeleton-image"></div>
            <div className="incident-store__details">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text short"></div>
            </div>
          </div>
          <div className="incident-status">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
          <div className="skeleton skeleton-text medium"></div>
          <div>
            <div className="skeleton skeleton-severity"></div>
          </div>
          <div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      );
    }
    return rows;
  };
  
  // Function to render skeleton mobile cards
  const renderSkeletonCards = (count) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(
        <div key={`skeleton-card-${i}`} className="incident-card skeleton-card">
          <div className="incident-card__summary">
            <div className="incident-card__summary-info">
              <div className="skeleton skeleton-image"></div>
              <div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text short"></div>
              </div>
            </div>
            <div className="skeleton-card__header">
              <div className="skeleton skeleton-severity"></div>
            </div>
          </div>
        </div>
      );
    }
    return cards;
  };

  // Adapt the reports data to our structure if not loading
  const incidents = !loading ? reports.map((r) => {
    console.log('Processing report:', r.id, 'Media files:', r.media_files);
    
    const storeName = r.store ? r.store.store_name : 'No Store';
    const storeImage = r.store?.image || '/default/store.png';
    const location = r.store ? r.store.store_city || '' : '';
    const status = r.incident_type || 'Unknown';
    const date = r.incident_date || '';
    const details = r.details || '';
    const severity = r.severity || 'low';
    const mediaFiles = r.media_files || [];
    const hasMedia = Array.isArray(mediaFiles) && mediaFiles.length > 0;

    return {
      id: r.id,
      storeName,
      storeImage,
      location,
      status,
      date,
      details,
      severity,
      hasMedia,
      mediaFiles
    };
  }) : [];

  // Apply filters based on selected filter if not loading
  const filteredIncidents = !loading ? incidents.filter((i) => {
    let matchesFilter = true;
    
    // Apply category filter
    if (selectedFilter === 'All') {
      matchesFilter = true;
    } else if (selectedFilter === 'Customer') {
      matchesFilter = ['theftPrevented', 'customerDenied', 'theftReported'].includes(i.status);
    } else if (selectedFilter === 'Cashier') {
      matchesFilter = i.status === 'cashierSuspicious';
    }
    
    // Apply severity filter
    if (severityFilter !== 'All' && matchesFilter) {
      matchesFilter = i.severity.toLowerCase() === severityFilter.toLowerCase();
    }
    
    // Apply status filter
    if (statusFilter !== 'All' && matchesFilter) {
      matchesFilter = i.status === statusFilter;
    }
    
    // Apply date range filter
    if ((dateRange.start || dateRange.end) && matchesFilter) {
      const incidentDate = new Date(i.date);
      
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        matchesFilter = matchesFilter && incidentDate >= startDate;
      }
      
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        matchesFilter = matchesFilter && incidentDate <= endDate;
      }
    }
    
    // Apply search term filter
    if (searchTerm && matchesFilter) {
      const term = searchTerm.toLowerCase();
      return (
        i.storeName.toLowerCase().includes(term) ||
        i.location.toLowerCase().includes(term) ||
        i.status.toLowerCase().includes(term) ||
        i.details.toLowerCase().includes(term)
      );
    }
    
    return matchesFilter;
  }) : [];

  // Get unique values for filter dropdowns
  const uniqueSeverities = ['All', ...new Set(incidents.map(i => i.severity))];
  const uniqueStatuses = ['All', ...new Set(incidents.map(i => i.status))];

  // Handle filter changes
  const handleSeverityFilter = (severity) => {
    setSeverityFilter(severity);
    setShowSeverityDropdown(false);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
    setShowDateDropdown(false);
  };

  const applyDateRange = () => {
    setShowDateDropdown(false);
  };

  const formatDateDisplay = () => {
    if (!dateRange.start && !dateRange.end) {
      return 'All Time';
    }
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };

    if (dateRange.start && dateRange.end) {
      return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
    } else if (dateRange.start) {
      return `From ${formatDate(dateRange.start)}`;
    } else if (dateRange.end) {
      return `Until ${formatDate(dateRange.end)}`;
    }
  };

  // Determine if we should show empty state (not loading and no incidents)
  const showEmptyState = !loading && filteredIncidents.length === 0;

  return (
    <>
      <div className="incident-dashboard">
        <div className="incident-dashboard__header">
          <h1 className="incident-dashboard__title">All Reports</h1>
          <div className="incident-search">
            <input
              type="text"
              placeholder="Search reports..."
              className="incident-search__input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="incident-search__icon" size={18} />
          </div>
        </div>

        <div className="incident-filters">
          <div className="incident-filters__group">
            <div className="incident-severity-filter__dropdown">
              <button 
                className="incident-severity-filter__button"
                onClick={() => setShowSeverityDropdown(!showSeverityDropdown)}
              >
                Severity: {severityFilter}
                <ChevronDown size={16} />
              </button>
              {showSeverityDropdown && (
                <div className="incident-severity-filter__dropdown-menu">
                  {uniqueSeverities.map(severity => (
                    <button
                      key={severity}
                      className={`incident-severity-filter__dropdown-item ${severityFilter === severity ? 'active' : ''}`}
                      onClick={() => handleSeverityFilter(severity)}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="incident-status-filter__dropdown">
              <button 
                className="incident-status-filter__button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                Status: {statusFilter}
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="incident-status-filter__dropdown-menu">
                  {uniqueStatuses.map(status => (
                    <button
                      key={status}
                      className={`incident-status-filter__dropdown-item ${statusFilter === status ? 'active' : ''}`}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="incident-date-filter__dropdown">
            <button 
              className="incident-date-filter__button"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
            >
              <span className={`incident-date-filter__display-text ${!dateRange.start && !dateRange.end ? 'placeholder' : ''}`}>
                {formatDateDisplay()}
              </span>
              <ChevronDown size={16} />
            </button>
            {showDateDropdown && (
              <div className="incident-date-filter__dropdown-panel">
                <div className="incident-date-filter__panel-header">
                  Select Date Range
                </div>
                <div className="incident-date-filter__inputs-container">
                  <div className="incident-date-filter__input-group">
                    <label className="incident-date-filter__label">From Date</label>
                    <input
                      type="date"
                      className="incident-date-filter__input"
                      value={dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      max={dateRange.end || undefined}
                    />
                  </div>
                  <div className="incident-date-filter__input-group">
                    <label className="incident-date-filter__label">To Date</label>
                    <input
                      type="date"
                      className="incident-date-filter__input"
                      value={dateRange.end}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      min={dateRange.start || undefined}
                    />
                  </div>
                </div>
                <div className="incident-date-filter__actions">
                  <button 
                    className="incident-date-filter__clear-btn"
                    onClick={clearDateRange}
                  >
                    Clear
                  </button>
                  <button 
                    className="incident-date-filter__apply-btn"
                    onClick={applyDateRange}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="incident-filters__group">
          <div className="incident-filters__group-box">
            <button
              className={`incident-filters__pill ${selectedFilter === 'All' ? 'incident-filters__pill--active' : ''}`}
              onClick={() => setSelectedFilter('All')}
            >
              All
            </button>
            <button
              className={`incident-filters__pill ${selectedFilter === 'Customer' ? 'incident-filters__pill--active' : ''}`}
              onClick={() => setSelectedFilter('Customer')}
            >
              Customer
            </button>
            <button
              className={`incident-filters__pill ${selectedFilter === 'Cashier' ? 'incident-filters__pill--active' : ''}`}
              onClick={() => setSelectedFilter('Cashier')}
            >
              Cashier
            </button>
          </div>
        </div>

        {/* If no incidents available, display the empty state */}
        {showEmptyState ? (
          <div className="empty-state-container">
            <div className="empty-state-icon-wrapper">
              <FileX className="empty-state-icon" />
            </div>
            <h3 className="empty-state-title">No reports available</h3>
            <p className="empty-state-message">
              There are currently no reports to display. Reports will appear here once they have been generated.
            </p>
          </div>
        ) : (
          <>
            {/* Table View (Desktop) */}
            <div className="incident-table__header">
              <div>Store Name</div>
              <div>Status</div>
              <div>Details</div>
              <div>Severity</div>
              <div>Media</div>
            </div>

            <div className="incident-table__content">
              {/* Show skeleton loading or actual data */}
              {loading ? (
                // Skeleton rows for desktop
                renderSkeletonRows(5)
              ) : (
                // Actual data rows
                filteredIncidents.map((incident, index) => (
                  <div 
                    key={incident.id} 
                    className="incident-row"
                    ref={index === filteredIncidents.length - 1 ? lastElementRef : null}
                  >
                    <div className="incident-store">
                      <img
                        src={incident.storeImage}
                        alt={incident.storeName}
                        className="incident-store__image"
                        onError={(e) => {
                          e.target.src = '/default/store.png';
                        }}
                      />
                      <div className="incident-store__details">
                        <div className="incident-store__name">{incident.storeName}</div>
                        <div className="incident-store__location">{incident.location}</div>
                      </div>
                    </div>
                    <div className="incident-status">
                      <div className="incident-status__text">{incident.status}</div>
                      <div className="incident-status__date">{incident.date}</div>
                    </div>
                    <div className="incident-details">{incident.details}</div>
                    <div>
                      <span className={`incident-severity incident-severity--${incident.severity.toLowerCase()}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <div>
                      {renderMediaFiles(incident.mediaFiles)}
                    </div>
                  </div>
                ))
              )}

              {/* Mobile Card View */}
              {loading ? (
                // Skeleton cards for mobile
                renderSkeletonCards(5)
              ) : (
                // Actual mobile cards
                filteredIncidents.map((incident, index) => (
                  <div 
                    key={incident.id} 
                    className="incident-card"
                    ref={index === filteredIncidents.length - 1 ? lastElementRef : null}
                  >
                    <div className="incident-card__summary">
                      <div className="incident-card__summary-info">
                        <img
                          src={incident.storeImage}
                          alt={incident.storeName}
                          className="incident-store__image"
                          onError={(e) => {
                            e.target.src = '/default/store.png';
                          }}
                        />
                        <div>
                          <div className="incident-store__name">{incident.storeName}</div>
                          <div className="incident-card__summary-text">{incident.location} • {incident.status}</div>
                        </div>
                      </div>
                      
                      <div className="incident-card__header">
                        <span className={`incident-severity incident-severity--${incident.severity.toLowerCase()}`}>
                          {incident.severity}
                        </span>
                        <div 
                          className="incident-card__toggle"
                          onClick={() => toggleCard(incident.id)}
                        >
                          {expandedCards[incident.id] ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`incident-card__content ${expandedCards[incident.id] ? 'incident-card__content--open' : ''}`}>
                      <div className="incident-card__details">
                        <div className="incident-card__label">Details</div>
                        <div className="incident-details">{incident.details}</div>
                      </div>
                      
                      <div className="incident-card__footer">
                        <div className="incident-card__status-row">
                          <div>
                            <div className="incident-card__label">Status</div>
                            <div className="incident-status__text">{incident.status}</div>
                          </div>
                          <div>
                            <div className="incident-card__label">Date</div>
                            <div className="incident-status__date">{incident.date}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="incident-card__label">
                            Media ({incident.mediaFiles.length} file{incident.mediaFiles.length !== 1 ? 's' : ''})
                          </div>
                          {renderMediaFiles(incident.mediaFiles)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator for infinite scroll */}
              {(loadingMore && next) && (
                <div className="loader-container">
                  <Loader className="loader-spinner" size={24} />
                </div>
              )}
              
              {/* Invisible element to trigger infinite scroll */}
              <div className="scroll-trigger" ref={lastElementRef}></div>
            </div>
            
            {/* Pagination information */}
            {!loading && (
              <div style={{ marginTop: '1rem', textAlign: 'center', color: '#757575', fontSize: '0.875rem' }}>
                Showing {filteredIncidents.length} of {count} reports
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default IncidentDashboard;