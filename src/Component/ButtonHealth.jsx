import React from 'react';
import { Monitor, WifiOff } from 'lucide-react';

const customStyles = `
  .button-health-dashboard {
    background-color: transparent;
    padding: 20px;
  }

  .button-health-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 16px;
  }

  .button-health-icon {
    width: 24px;
    height: 24px;
    color: #374151;
  }

  .button-health-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .button-health-metric-list {
    display: flex;
    flex-direction: column;
    gap: 0px;
  }

  .button-health-metric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
  }

  .button-health-metric-name {
    width: 128px;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }

  .button-health-progress-wrapper {
    flex: 1;
    margin: 0 24px;
    background-color: #f3f4f6;
    border-radius: 4px;
    height: 12px;
    overflow: hidden;
  }

  .button-health-progress-bar {
    height: 100%;
    transition: width 300ms ease, background-color 300ms ease;
  }

  .button-health-percentage {
    width: 64px;
    font-size: 14px;
    color: #4b5563;
    text-align: right;
    font-weight: 500;
  }
`;

const StyleSheet = () => (
  <style>{customStyles}</style>
);

const ButtonHealthItem = ({ name, percentage }) => {
  const getProgressBarColor = (percentage) => {
    const baseColor = '#d82f5a';
    if (percentage <= 30) {
      return 'rgba(216, 47, 90, 0.3)';
    } else if (percentage <= 70) {
      return baseColor;
    }
    return baseColor;
  };

  return (
    <div className="button-health-metric-row">
      <div className="button-health-metric-name">{name}</div>
      
      <div className="button-health-progress-wrapper">
        <div 
          className="button-health-progress-bar"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressBarColor(percentage)
          }}
        />
      </div>
      
      <div className="button-health-percentage">
        {percentage}%
      </div>
    </div>
  );
};

const ButtonHealth = () => {
  // Change or empty out this array to trigger the empty state
  const healthData = [
    
  ];

  return (
    <>
      <StyleSheet />
      {healthData.length === 0 ? (
        <div className="empty-button-state-container">
          <div className="empty-button-state-icon-wrapper">
            <WifiOff className="empty-button-state-icon" />
          </div>
          <h3 className="empty-button-state-title">No IoT buttons connected</h3>
          <p className="empty-button-state-message">
            There are currently no IoT buttons connected to your system. Connected devices will appear here once they have been paired.
          </p>
          
          <style jsx>{`
            .empty-button-state-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 48px;
              margin: 48px 0;
              background: transparent;
              border-radius: 16px;
            }
            
            .empty-button-state-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 96px;
              width: 96px;
              border-radius: 50%;
              background-color: transparent;
              margin-bottom: 24px;
            }
            
            .empty-button-state-icon {
              height: 64px;
              width: 64px;
              color: #000;
            }
            
            .empty-button-state-title {
              font-size: 22px;
              font-weight: 500;
              color: #000;
              margin-bottom: 12px;
            }
            
            .empty-button-state-message {
              color: #000;
              text-align: center;
              max-width: 420px;
              line-height: 1.5;
            }
          `}</style>
        </div>
      ) : (
        <div className="button-health-dashboard">
          <div className="button-health-header">
            <Monitor className="button-health-icon" />
            <h2 className="button-health-title">Button Health</h2>
          </div>

          <div className="button-health-metric-list">
            {healthData.map((item, index) => (
              <ButtonHealthItem
                key={`${item.name}-${index}`}
                name={item.name}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonHealth;
