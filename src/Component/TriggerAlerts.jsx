import React from 'react';
import { Bell, Share2, AlertCircle } from 'lucide-react';

const TriggerAlerts = () => {
  // Toggle this array for testing; set it to [] to show the empty state.
  const alerts = []; // For example, [] for empty state

  return (
    <div className="ta-wrapper">
      {/* Header Section */}
      <div className="ta-header">
        <div className="ta-header__title-block">
          <Bell className="ta-header__bell-icon" />
          <h2 className="ta-header__heading">Recent Trigger Alerts</h2>
        </div>
        <Share2 className="ta-header__share-icon" />
      </div>

      {alerts.length === 0 ? (
        // Empty State Layout using plain CSS classes
        <div className="empty-alerts-state-container">
          <div className="empty-alerts-state-icon-container">
            <div className="empty-alerts-state-icon-bg"></div>
            <Bell className="empty-alerts-state-icon" />
          </div>
          <h3 className="empty-alerts-state-heading">No Trigger Alerts</h3>
          <p className="empty-alerts-state-description">
            Your alert feed is empty. New alerts will appear here once they're triggered.
          </p>
          <div className="empty-alerts-state-config">
            <AlertCircle className="empty-alerts-state-config-icon" />
            <p className="empty-alerts-state-config-text">
              Configure your alert settings to ensure you're notified when important events occur.
            </p>
          </div>
        </div>
      ) : (
        // Table Section with your original classes
        <div className="ta-table-wrapper">
          <table className="ta-table">
            <thead>
              <tr>
                <th>
                  <div className="ta-table__th-content">Store</div>
                </th>
                <th>
                  <div className="ta-table__th-content">Date</div>
                </th>
                <th>
                  <div className="ta-table__th-content">Status</div>
                </th>
                <th>
                  <div className="ta-table__th-content">Video Evidence</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={`ta-table__row ${
                    index % 2 === 0 ? 'ta-table__row--even' : 'ta-table__row--odd'
                  }`}
                >
                  <td className="ta-table__cell">
                    <div className="ta-store">
                      <img
                        src="/banner/login.png"
                        alt={`${alert.store} icon`}
                        className="ta-store__image"
                      />
                      <span className="ta-store__name">{alert.store}</span>
                    </div>
                  </td>
                  <td className="ta-table__cell">{alert.date}</td>
                  <td className="ta-table__cell">
                    <span className="ta-status ta-status--pending">{alert.status}</span>
                  </td>
                  <td className="ta-table__cell">{alert.videoEvidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TriggerAlerts;
