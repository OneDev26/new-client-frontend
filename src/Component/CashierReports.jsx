import React, { useState, useEffect } from 'react';
import { MapPin, Play, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import '../CSS/CashierReports.css';

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
          <span className={`cr-status ${
            report.status === 'Pending' ? 'cr-status--pending' : 'cr-status--sent'
          }`}>
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

const CashierReports = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile on mount and when window resizes
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const reports = [
    {
      id: 'DN',
      storeName: 'Divine City',
      storeImage: '/banner/login.png',
      location: 'New York',
      status: 'Pending',
      date: '02-01-2025',
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      thumbnails: ['/banner/login.png', '/banner/login.png']
    },
    {
      id: 'NW',
      storeName: 'NYC 7-11',
      storeImage: '/banner/login.png',
      location: 'Kent',
      status: 'Email Sent',
      date: '26-11-2024',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      thumbnails: ['/banner/login.png', '/banner/login.png']
    }
  ];

  return (
    <div className="cr-container">
      <div className="cr-header">
        <h1 className="cr-title">Cashier Reports</h1>
        <button className="cr-external-link">
          <ExternalLink size={20} />
        </button>
      </div>
      
      <div className="cr-header-controls">
        <div className="cr-filter-group">
          {['All', 'Cashier Fraud', 'Cashier Suspicious'].map(filter => (
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

      {isMobile ? (
        // Mobile card view
        <div className="cr-cards-list">
          {reports.map((report) => (
            <CollapsibleReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        // Desktop table view
        <div className="cr-table-wrapper">
          <div className="cr-table-header">
            <span>Store</span>
            <span>Status</span>
            <span>Details</span>
            <span>Media</span>
          </div>

          <div className="cr-reports-list">
            {reports.map((report) => (
              <div key={report.id} className="cr-report-row">
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
                  <div className="cr-report-text cr-text-collapsed">
                    {report.details}
                  </div>
                  <button 
                    className="cr-expand-btn"
                    onClick={() => {
                      // Implementation for desktop view
                    }}
                  >
                    Read more
                    <ChevronDown size={14} />
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierReports;