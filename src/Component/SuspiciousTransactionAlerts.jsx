// src/pages/SuspiciousTransactionAlerts.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsThunk } from '../features/transactions/transactionThunks';
import {
  AlertTriangle, ExternalLink, Play,
  ChevronDown, ChevronUp, X,
  CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
/* -------------------------------- utils -------------------------------- */
const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true })
                .toLowerCase().replace(/\s/g,'');
  return `${date} at ${time}`;
};

const VerificationStatus = ({ verified }) => (
  verified ? (
    <div className="sta-verified-status sta-verified">
      <CheckCircle size={20}/>
    </div>
  ) : (
    <div className="sta-verified-status sta-not-verified">
      <XCircle size={20}/>
    </div>
  )
);

/* ---------------------------- mobile card ----------------------------- */
const CollapsibleCard = ({ tx, openVideo }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="sta-card">
      <div className="sta-card-header" onClick={()=>setOpen(!open)}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <img
            className="sta-store-image"
            src={tx.store?.image ?? '/banner/placeholder.png'}
            alt={tx.store?.store_name ?? 'Store'}
          />
          <div className="sta-store-info">
            <p className="sta-store-name">{tx.store?.store_name ?? '—'}</p>
            <p className="sta-store-location">{tx.store?.store_city ?? '—'}</p>
          </div>
        </div>
        {open ? <ChevronUp/> : <ChevronDown/>}
      </div>
      {open && (
        <div className="sta-card-content">
          <div className="sta-card-row">
            <div className="sta-card-label">Description</div>
            <div className={`sta-card-value ${tx.description?.includes('ERROR')?'sta-error-text':''}`}>
              {tx.description}
            </div>
          </div>
          <div className="sta-card-row">
            <div className="sta-card-label">Date</div>
            <div className="sta-card-value">{formatDateTime(tx.date)}</div>
          </div>
          <div className="sta-card-row">
            <div className="sta-card-label">Device</div>
            <div className="sta-card-value">
              <span className="sta-device-tag">{tx.device}</span>
            </div>
          </div>
          <div className="sta-card-row">
            <div className="sta-card-label">Verification</div>
            <div className="sta-card-value"><VerificationStatus verified={tx.verified}/></div>
          </div>
          <div className="sta-card-row">
            <div className="sta-card-label">Video</div>
            <div className="sta-card-value">
              {tx.video_evidence ? (
                <div className="sta-video-thumbnail" onClick={()=>openVideo(tx.video_evidence)}>
                  <img src="/banner/login.png" alt="Video thumbnail"/>
                  <div className="sta-video-overlay"><Play/></div>
                </div>
              ) : <span className="sta-no-video">No Video Available</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================  MAIN COMPONENT  ===================== */
const SuspiciousTransactionAlerts = () => {
  const dispatch = useDispatch();

  /* safe selector – default to {} then to [] */
  const {
    results:  transactions = [],
    loading   = false,
    error     = null,
    next      = null,
    count     = 0,
  } = useSelector((s) => s.transactions || {});

  /* responsive check */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeVideo, setActiveVideo] = useState(null);
  
  /* infinite scroll refs */
  const observerRef = useRef(null);
  const loaderRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next) {
        dispatch(fetchTransactionsThunk({ offset: transactions.length }));
      }
    }, { threshold: 0.5 });
    
    if (node) observerRef.current.observe(node);
  }, [loading, next, dispatch, transactions.length]);

  /* initial fetch */
  useEffect(() => {
    if (transactions.length === 0) dispatch(fetchTransactionsThunk({ offset:0 }));
  }, [dispatch, transactions.length]);

  /* viewport listener */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  /* skeleton rows */
  const renderSkeleton = () => (
    isMobile ? (
      <div className="sta-loading-cards">
        {[1,2,3].map(i=> <div key={i} className="sta-skeleton sta-loading-card"/>)}
      </div>
    ) : (
      <div className="sta-table-wrapper">
        <div className="sta-table-container">
          <table className="sta-table">
            <thead>
              <tr><th>Store</th><th>Description</th><th>Date</th><th>Device</th><th>Verification</th><th>Video</th></tr>
            </thead>
          </table>
        </div>
        <div className="sta-table-body-container">
          <table className="sta-table">
            <tbody className="sta-loading-table">
              {[1,2,3].map(i=>(
                <tr key={i} className="sta-loading-row">
                  <td><div className="sta-skeleton" style={{width:'150px',height:'40px'}}/></td>
                  <td><div className="sta-skeleton" style={{width:'180px',height:'20px'}}/></td>
                  <td><div className="sta-skeleton" style={{width:'200px',height:'20px'}}/></td>
                  <td><div className="sta-skeleton" style={{width:'90px',height:'30px'}}/></td>
                  <td><div className="sta-skeleton" style={{width:'100px',height:'30px'}}/></td>
                  <td><div className="sta-skeleton" style={{width:'80px',height:'60px'}}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );

  /* loading indicator */
  const renderLoadingIndicator = () => {
    if (!loading || !next) return null;
    
    return (
      <div className="sta-loading-indicator">
        <div className="sta-loading-spinner"></div>
        <p>Loading more transactions...</p>
      </div>
    );
  };

  /* main render */
  const renderContent = () => {
    if (loading && transactions.length === 0) return renderSkeleton();
    if (error) return <div className="sta-error-message">{error}</div>;

    /* desktop table */
    if (!isMobile) {
      return (
        <div className="sta-table-wrapper">
          <div className="sta-table-container">
            <table className="sta-table">
              <thead>
                <tr><th>Store</th><th>Description</th><th>Date</th><th>Device</th><th>Verification</th><th>Video Evidence</th></tr>
              </thead>
            </table>
          </div>
          <div className="sta-table-body-container">
            <table className="sta-table">
              <tbody>
                {transactions.map(tx=>(
                  <tr key={tx.id}>
                    {/* store */}
                    <td>
                      <div className="sta-store-cell">
                        <img className="sta-store-image" src={tx.store?.image??'/banner/placeholder.png'}
                             alt={tx.store?.store_name??'Store'} />
                        <div className="sta-store-info">
                          <p className="sta-store-name">{tx.store?.store_name??'—'}</p>
                          <p className="sta-store-location">{tx.store?.store_city??'—'}</p>
                        </div>
                      </div>
                    </td>
                    {/* desc */}
                    <td className={tx.description?.includes('ERROR') ? 'sta-error-text' : ''}>
                      {tx.description}
                    </td>
                    {/* date */}
                    <td>{formatDateTime(tx.date)}</td>
                    {/* device */}
                    <td><span className="sta-device-tag">{tx.device}</span></td>
                    {/* verified */}
                    <td><VerificationStatus verified={tx.verified}/></td>
                    {/* video */}
                    <td>
                      {tx.video_evidence ? (
                        <div className="sta-video-thumbnail" onClick={()=>setActiveVideo(tx.video_evidence)}>
                          <img src="/banner/login.png" alt="Video thumbnail"/>
                          <div className="sta-video-overlay"><Play/></div>
                        </div>
                      ) : <span className="sta-no-video">No Video Available</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Infinite scroll loader reference element */}
            {next && <div ref={loaderRef} className="sta-loader-ref">{renderLoadingIndicator()}</div>}
          </div>
        </div>
      );
    }

    /* mobile cards */
    return (
      <>
        <div className="sta-mobile-scroll-container">
          <div className="sta-cards-container">
            {transactions.map(tx=>(
              <CollapsibleCard key={tx.id} tx={tx} openVideo={setActiveVideo}/>
            ))}
            
            {/* Infinite scroll loader reference element */}
            {next && <div ref={loaderRef} className="sta-loader-ref">{renderLoadingIndicator()}</div>}
          </div>
        </div>
      </>
    );
  };

  /* ---------------------------- styles ---------------------------- */
  const styles = `
  .sta-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden; /* Prevent outer scrolling */
  }
  .sta-container {
    background: #ffffff;
    border-radius: 0px;
    padding: 25px 25px 0;
    margin: 0 auto;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .sta-container:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
  .sta-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 2px solid #f1f5f9;
    position: relative;
  }
  .sta-header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #f59e0b, #f97316);
  }
  .sta-header-title {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .sta-header-title h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #1e293b, #334155);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.03em;
  }
  @media (max-width: 768px) {
   
      .sta-banner-header {
  height:130px;
}
  }
  .sta-warning-icon {
    color: #f59e0b;
    filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.25));
    animation: sta-pulse 2s infinite;
  }
  @keyframes sta-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  .sta-external-link {
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 8px;
  }
  .sta-external-link:hover {
    color: #334155;
    transform: scale(1.1) rotate(15deg);
    background: #f8fafc;
  }
  /* New table styles for fixed header */
  .sta-table-wrapper {
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    background: linear-gradient(to bottom, #ffffff, #fafafa);
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sta-table-container {
    width: 100%;
    overflow-x: auto;
  }
  .sta-table-body-container {
    max-height: 500px; /* Adjust this value based on your needs */
    overflow-y: auto;
    overflow-x: auto;
    flex: 1;
  }
  .sta-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    font-size: 15px;
    table-layout: fixed;
  }
  .sta-table-container th,
  .sta-table-body-container td {
    min-width: 140px; /* Minimum width for columns */
  }
  .sta-table th {
    background: #f8fafc;
    padding: 20px 24px;
    font-weight: 600;
    color: #334155;
    border-bottom: 2px solid #e2e8f0;
    position: relative;
    white-space: nowrap;
    box-sizing: border-box;
  }
  .sta-table th:nth-child(1) {
    min-width: 200px;
  }
  .sta-table th:nth-child(2) {
    min-width: 200px;
  }
  .sta-table th:nth-child(3) {
    min-width: 250px;
  }
  .sta-table th:first-child {
    border-top-left-radius: 16px;
  }
  .sta-table th:last-child {
    border-top-right-radius: 16px;
  }
  .sta-table td {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  .sta-table tr:last-child td {
    border-bottom: none;
  }
  .sta-table tr:last-child td:first-child {
    border-bottom-left-radius: 16px;
  }
  .sta-table tr:last-child td:last-child {
    border-bottom-right-radius: 16px;
  }
  .sta-table tr {
    transition: all 0.3s ease;
  }
  .sta-table tr:hover {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
  }
  /* Ensure the width of header and body cells match */
  .sta-table-container table,
  .sta-table-body-container table {
    width: 100%;
  }
  .sta-cards-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .sta-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #f1f5f9;
  }
  .sta-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
  .sta-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    justify-content: space-between;
    cursor: pointer;
  }
  .sta-card-content {
    padding: 16px;
  }
  .sta-card-row {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px dashed #f1f5f9;
  }
  .sta-card-row:last-child {
    border-bottom: none;
  }
  .sta-card-label {
    font-weight: 600;
    color: #64748b;
    width: 40%;
    font-size: 14px;
  }
  .sta-card-value {
    width: 60%;
    color: #334155;
    font-size: 14px;
  }
  .sta-error-text {
    color: #dc2626;
    font-weight: 600;
    text-shadow: 0 0 1px rgba(220, 38, 38, 0.1);
  }
  .sta-store-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    max-width: 200px;
  }
  .sta-store-image {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  .sta-store-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .sta-store-name {
    font-weight: 600;
    color: #334155;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sta-store-location {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sta-device-tag {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 14px;
    display: inline-block;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
    transition: all 0.3s ease;
    min-width: 90px;
    text-align: center;
    letter-spacing: 0.02em;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .sta-no-video {
    color: #94a3b8;
    font-style: italic;
    position: relative;
    padding-left: 20px;
  }
  .sta-no-video::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #cbd5e1;
  }
  .sta-video-thumbnail {
    position: relative;
    width: 80px;
    height: 60px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 2px solid transparent;
  }
  .sta-video-thumbnail:hover {
    transform: scale(1.08);
    border-color: #60a5fa;
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.1);
  }
  .sta-video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }
  .sta-video-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }
  .sta-video-overlay:hover {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
  }
  .sta-video-overlay svg {
    color: white;
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }
  .sta-video-overlay:hover svg {
    transform: scale(1.15);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }
  .video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .video-modal-content {
    position: relative;
    width: 90%;
    max-width: 800px;
  }
  .video-modal-close {
    position: absolute;
    top: -40px;
    right: 0;
    cursor: pointer;
    color: white;
  }
  .sta-verified-status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    margin: 0 auto;
  }
  .sta-verified {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
  }
  .sta-not-verified {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    box-shadow: 0 2px 6px rgba(220, 38, 38, 0.2);
  }
  .sta-skeleton {
    animation: skeleton-loading 1.5s infinite;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    border-radius: 4px;
  }
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .sta-loading-row td {
    padding: 20px 24px;
  }
  .sta-loading-table {
    height: 300px;
  }
  .sta-loading-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .sta-loading-card {
    height: 80px;
    border-radius: 16px;
  }
  .sta-loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
  }
  .sta-loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #f59e0b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  .sta-loading-indicator p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .sta-loader-ref {
    min-height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
    
`;

  /* ---------------------------- JSX ---------------------------- */
  return (
    <>
      <style>{styles}</style>
      <div className="sta-wrapper">
        <div className="sta-container">
          <div className="sta-header">
            <div className="sta-header-title">
              <AlertTriangle className="sta-warning-icon"/><h2>Suspicious Transaction Alerts</h2>
            </div>
           <Link to="/monitoring-status"> <ExternalLink className="sta-external-link"/></Link>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* video modal */}
      {activeVideo && (
        <div className="video-modal" onClick={()=>setActiveVideo(null)}>
          <div className="video-modal-content" onClick={e=>e.stopPropagation()}>
            <X className="video-modal-close" onClick={()=>setActiveVideo(null)}/>
            <video src={activeVideo} controls autoPlay style={{width:'100%',height:'100%'}}/>
          </div>
        </div>
      )}
    </>
  );
};

export default SuspiciousTransactionAlerts;