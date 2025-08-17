import React, { useState, useEffect } from 'react';
import { MapPin, Play, Search, ChevronDown } from 'lucide-react';
// import Header from '../Component/Header';
// import Sidebar from '../Component/Sidebar';

import '../CSS/CashierReports.css'; // Ensure you're importing the same CSS used in your original snippet

// --- Collapsible Card component (from your first snippet) ---
const CollapsibleReportCard = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  return (
    <div className="cr-card">
      <div 
        className="cr-card-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cr-card-store">
          <div className="cr-store-image">
            <img src={report.storeImage} alt={report.storeName} />
          </div>
          <div className="cr-store-info">
            <span className="cr-store-name">{report.storeName}</span>
            <span className="cr-store-location">
              <MapPin size={14} />
              {report.location}
            </span>
          </div>
        </div>
        
        <div className="cr-card-status-wrapper">
          <span 
            className={`cr-status ${
              report.status === 'Pending' ? 'cr-status--pending' : 'cr-status--sent'
            }`}
          >
            {report.status}
          </span>
          <ChevronDown 
            size={16} 
            className="cr-card-chevron"
            style={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)'
            }} 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="cr-card-content">
          <div className="cr-card-section">
            <h4 className="cr-card-section-title">Details</h4>
            <span className="cr-report-date">{report.date}</span>
            <div className={`cr-report-text ${!isDetailsExpanded ? 'cr-text-collapsed' : ''}`}>
              {report.details}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsExpanded(!isDetailsExpanded);
              }}
              className="cr-expand-btn"
            >
              {isDetailsExpanded ? 'Show less' : 'Read more'}
              <ChevronDown 
                size={14} 
                style={{ 
                  transform: isDetailsExpanded ? 'rotate(180deg)' : 'rotate(0)'
                }} 
              />
            </button>
          </div>
          
          <div className="cr-card-section">
            <h4 className="cr-card-section-title">Media</h4>
            <div className="cr-media-group">
              {report.thumbnails.map((thumb, idx) => (
                <div key={idx} className="cr-media-item">
                  <img src={thumb} alt={`Media ${idx + 1}`} />
                  <div className="cr-media-overlay">
                    <Play className="cr-play-icon" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- (Optional) Table row component if you want it separated ---
const ReportRow = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="cr-report-row">
      <div className="cr-store-field">
        <div className="cr-store-image">
          <img src={report.storeImage} alt={report.storeName} />
        </div>
        <div className="cr-store-info">
          <span className="cr-store-name">{report.storeName}</span>
          <span className="cr-store-location">
            <MapPin size={14} />
            {report.location}
          </span>
        </div>
      </div>

      <div className="cr-status-cell">
        <span className={`cr-status ${
          report.status === 'Pending' ? 'cr-status--pending' : 'cr-status--sent'
        }`}>
          {report.status}
        </span>
      </div>

      <div className="cr-details-cell">
        <span className="cr-report-date">{report.date}</span>
        <div className={`cr-report-text ${!isExpanded ? 'cr-text-collapsed' : ''}`}>
          {report.details}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cr-expand-btn"
        >
          {isExpanded ? 'Show less' : 'Read more'}
          <ChevronDown 
            size={14} 
            style={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s'
            }} 
          />
        </button>
      </div>

      <div className="cr-media-group">
        {report.thumbnails.map((thumb, idx) => (
          <div key={idx} className="cr-media-item">
            <img src={thumb} alt={`Media ${idx + 1}`} />
            <div className="cr-media-overlay">
              <Play className="cr-play-icon" size={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CashierReportsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile(); 
    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Sample data
  const reports = [
    {
      id: 'DN',
      storeName: 'Divine City',
      storeImage: '/banner/login.png',
      location: 'New York',
      status: 'Pending',
      date: '02-01-2025',
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...',
      thumbnails: ['/banner/login.png', '/banner/login.png']
    },
    {
      id: 'NW',
      storeName: 'NYC 7-11',
      storeImage: '/banner/login.png',
      location: 'Kent',
      status: 'Email Sent',
      date: '26-11-2024',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
      thumbnails: ['/banner/login.png', '/banner/login.png']
    }
  ];

  // Simple filter & search if needed
  const filteredReports = reports.filter((report) => {
    if (activeFilter !== 'All' && !report.details.includes(activeFilter)) {
      return false;
    }
    if (searchTerm && !report.storeName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* <Header /> */}
      {/* <Sidebar /> */}

      <div className="dashboard-container">
        <main className="main-content">
          <div className="cr-container">
            {/* Page header */}
            <div className="cr-header">
              <h1 className="cr-title">Cashier Reports</h1>
              <div className="cr-search-box">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="cr-search-input"
                />
                <Search className="cr-search-icon" size={18} />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="cr-header-controls">
              <div className="cr-filter-group">
                {['All', 'Cashier Fraud', 'Cashier Suspicious'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`cr-filter-btn ${
                      activeFilter === filter ? 'cr-filter-btn--active' : ''
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditionally render card layout (mobile) or table layout (desktop) */}
            {isMobile ? (
              // --- Mobile Card Layout ---
              <div className="cr-cards-list">
                {filteredReports.map((report) => (
                  <CollapsibleReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              // --- Desktop Table Layout ---
              <div className="cr-table-wrapper">
                <div className="cr-table-header">
                  <span>Store</span>
                  <span>Status</span>
                  <span>Details</span>
                  <span>Media</span>
                </div>
                <div className="cr-reports-list">
                  {filteredReports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CashierReportsPage;
