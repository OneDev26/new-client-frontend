// src/pages/SuspiciousTransactionAlertsPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsThunk } from '../features/transactions/transactionThunks';
import {
  AlertTriangle,
  Play,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import '../CSS/SuspiciousTransactionAlertsPage.css'; // Import your CSS styles

/* ────────────────────────────
   Utility functions
────────────────────────────── */
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  // Format date portion (e.g., "March 17, 2025")
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  // Format time portion (e.g., "01:58am")
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase().replace(/\s/g, '');
  return `${formattedDate} at ${formattedTime}`;
};

/* ────────────────────────────
   Verification Status Component
────────────────────────────── */
const VerificationStatus = ({ verified }) => {
  return verified ? (
    <div className="sta-verified-status sta-verified">
      <CheckCircle size={20} />
    </div>
  ) : (
    <div className="sta-verified-status sta-not-verified">
      <XCircle size={20} />
    </div>
  );
};

/* ────────────────────────────
   Collapsible card (mobile view)
────────────────────────────── */
const CollapsibleCard = ({ transaction, openVideo }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sta-card">
      <div
        className="sta-card-header"
        onClick={() => setIsOpen((p) => !p)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={transaction.store?.image ?? '/banner/placeholder.png'}
            alt={transaction.store?.store_name ?? 'Store'}
            className="sta-store-image"
          />
          <div className="sta-store-info">
            <p className="sta-store-name">{transaction.store?.store_name ?? 'Unnamed Store'}</p>
            <p className="sta-store-location">{transaction.store?.store_city ?? 'Unknown City'}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {isOpen && (
        <div className="sta-card-content">
          <div className="sta-card-row">
            <div className="sta-card-label">Description:</div>
            <div className={`sta-card-value ${transaction.description?.includes('ERROR') ? 'sta-error-text' : ''}`}>
              {transaction.description}
            </div>
          </div>

          <div className="sta-card-row">
            <div className="sta-card-label">Date:</div>
            <div className="sta-card-value">{formatDateTime(transaction.date)}</div>
          </div>

          <div className="sta-card-row">
            <div className="sta-card-label">Device:</div>
            <div className="sta-card-value">
              <span className="sta-device-tag">{transaction.device}</span>
            </div>
          </div>

          <div className="sta-card-row">
            <div className="sta-card-label">Verification:</div>
            <div className="sta-card-value">
              <VerificationStatus verified={transaction.verified} />
            </div>
          </div>

          <div className="sta-card-row">
            <div className="sta-card-label">Video:</div>
            <div className="sta-card-value">
              {transaction.video_evidence ? (
                <div
                  className="sta-video-thumbnail"
                  onClick={() => openVideo(transaction.video_evidence)}
                >
                  <img src="/banner/login.png" alt="thumbnail" />
                  <div className="sta-video-overlay">
                    <Play />
                  </div>
                </div>
              ) : (
                <span className="sta-no-video">No Video</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────
   Skeleton Loading Components
────────────────────────────── */
const SkeletonPulse = () => <div className="sta-skeleton-pulse"></div>;

const TableRowSkeleton = () => (
  <tr>
    <td><SkeletonPulse /></td>
    <td>
      <div className="sta-store-cell">
        <div className="sta-skeleton-image"></div>
        <div className="sta-store-info">
          <div className="sta-skeleton-text-short"></div>
          <div className="sta-skeleton-text-xshort"></div>
        </div>
      </div>
    </td>
    <td><div className="sta-skeleton-text-medium"></div></td>
    <td><div className="sta-skeleton-text-medium"></div></td>
    <td><div className="sta-skeleton-tag"></div></td>
    <td><div className="sta-skeleton-circle"></div></td>
    <td><div className="sta-skeleton-thumbnail"></div></td>
  </tr>
);

const CardSkeleton = () => (
  <div className="sta-card">
    <div className="sta-card-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
        <div className="sta-skeleton-image"></div>
        <div className="sta-store-info" style={{ flex: 1 }}>
          <div className="sta-skeleton-text-short"></div>
          <div className="sta-skeleton-text-xshort"></div>
        </div>
      </div>
      <ChevronDown />
    </div>
  </div>
);

/* ────────────────────────────
   Main page
────────────────────────────── */
const SuspiciousTransactionAlertsPage = () => {
  const dispatch = useDispatch();

  /* ---- Select slice state safely ---- */
  const {
    loading,
    error,
    next = null,
    // Accept any of the common field names:
    transactions: arrA,
    items: arrB,
    results: arrC
  } = useSelector((state) => state.transactions);

  // Pick whichever array actually exists, or fall back to []:
  const transactionList = arrA ?? arrB ?? arrC ?? [];

  /* ---- Infinite scroll observer setup ---- */
  const observerRef = useRef(null);
  const loaderRef = useCallback(node => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next) {
        // Use offset-based pagination matching the first file's approach
        dispatch(fetchTransactionsThunk({ offset: transactionList.length }));
      }
    }, { threshold: 0.1, rootMargin: '100px' });

    if (node) observerRef.current.observe(node);
  }, [loading, next, dispatch, transactionList.length]);

  /* ---- Fetch first page on mount ---- */
  useEffect(() => {
    // If the list is already populated (back‑navigation) don't re‑fetch
    if (transactionList.length === 0) {
      dispatch(fetchTransactionsThunk({ offset: 0 })); // limit defaults in the thunk/paginator
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Cleanup effect ---- */
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  /* ---- Video modal ---- */
  const [activeVideo, setActiveVideo] = useState(null);
  const openVideo = (url) => setActiveVideo(url);

  /* ---- Loading indicator for infinite scroll ---- */
  const renderLoadingIndicator = () => {
    if (!loading || !next) return null;

    return (
      <div className="sta-loading-indicator">
        <div className="sta-loading-spinner"></div>
        <p>Loading more transactions...</p>
      </div>
    );
  };

  /* ---- CSS styles ---- */
  const styles = `
  `;
  

  // Generate skeleton rows for desktop view
  const renderTableSkeletons = () => {
    return Array(5).fill().map((_, idx) => (
      <TableRowSkeleton key={`skeleton-row-${idx}`} />
    ));
  };

  // Generate skeleton cards for mobile view
  const renderCardSkeletons = () => {
    return Array(5).fill().map((_, idx) => (
      <CardSkeleton key={`skeleton-card-${idx}`} />
    ));
  };

  // Render header - always show the actual header, not a skeleton
  const renderHeader = () => {
    return (
      <div className="sta-header">
        <div className="sta-header-title">
          <AlertTriangle className="sta-warning-icon" />
          <h2>Suspicious Transaction Alerts</h2>
        </div>
        <div className="incident-search">
          <input className="incident-search__input" placeholder="Type here to search…" />
          <Search className="incident-search__icon w-4 h-4" />
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <style>{styles}</style>
        <div className="sta-wrapper">
          <div class="sta-banner-header">
          <div class="sta-banner-header__pattern"></div>
          <div class="sta-banner-header__content">
            <h1 class="sta-banner-header__title">Suspicious Transactions</h1>
            </div>
          </div>
          <div className="sta-container">
            {/* ── Header ───────────────────── */}
            {renderHeader()}

            {/* ── Desktop table ─────────────── */}
            <div className="desktop-view">
              <div className="sta-table-container">
                <table className="sta-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Store</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Device</th>
                      <th>Verification</th>
                      <th>Video</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show skeleton rows when loading initial data */}
                    {loading && transactionList.length === 0 ? (
                      renderTableSkeletons()
                    ) : (
                      transactionList.map((t, idx) => (
                        <tr key={t.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="sta-store-cell">
                              <img
                                src={t.store?.image ?? '/banner/placeholder.png'}
                                alt={t.store?.store_name ?? 'Store'}
                                className="sta-store-image"
                              />
                              <div className="sta-store-info">
                                <p className="sta-store-name">{t.store?.store_name ?? 'Unnamed Store'}</p>
                                <p className="sta-store-location">{t.store?.store_city ?? 'Unknown City'}</p>
                              </div>
                            </div>
                          </td>
                          <td className={t.description?.includes('ERROR') ? 'sta-error-text' : ''}>
                            {t.description}
                          </td>
                          <td>{formatDateTime(t.date)}</td>
                          <td><span className="sta-device-tag">{t.device}</span></td>
                          <td><VerificationStatus verified={t.verified} /></td>
                          <td>
                            {t.video_evidence ? (
                              <div className="sta-video-thumbnail" onClick={() => openVideo(t.video_evidence)}>
                                <img src="/banner/login.png" alt="Video thumbnail" />
                                <div className="sta-video-overlay"><Play /></div>
                              </div>
                            ) : (
                              <span className="sta-no-video">No Video</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Mobile cards ──────────────── */}
            <div className="mobile-view">
              <div className="sta-cards-container">
                {/* Show skeleton cards when loading initial data */}
                {loading && transactionList.length === 0 ? (
                  renderCardSkeletons()
                ) : (
                  transactionList.map((t) => (
                    <CollapsibleCard key={t.id} transaction={t} openVideo={openVideo} />
                  ))
                )}
              </div>
            </div>

            {/* ── Infinite scroll loader element ──────────── */}
            {next && (
              <div ref={loaderRef} className="sta-loader-ref">
                {renderLoadingIndicator()}
              </div>
            )}
          </div>
        </div>

        {/* ── Video modal ─────────────────── */}
        {activeVideo && (
          <div className="video-modal" onClick={() => setActiveVideo(null)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <X className="video-modal-close" onClick={() => setActiveVideo(null)} />
              <video src={activeVideo} controls autoPlay style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuspiciousTransactionAlertsPage;