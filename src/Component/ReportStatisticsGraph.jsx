import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { fetchDailyIncidentsThreeMonthsThunk } from '../features/reports/reportThunks';

// Define styles
const styles = `
  .graph-container {
    width: 100%;
    height: 355px;
    padding: 16px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .graph-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .trend-arrow {
    color: #666666;
  }

  .tooltip-container {
    background-color: white;
    padding: 16px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e5e5;
  }

  .tooltip-label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .tooltip-value {
    font-size: 14px;
    margin: 4px 0;
  }
  
  .empty-container {
    width: 100%;
    height: 85%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-style: italic;
  }
  
  /* Skeleton loading styles */
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
  
  .skeleton-container {
    width: 100%;
    height: 85%;
    position: relative;
  }
  
  .skeleton-axis {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e5e7eb;
  }
  
  .skeleton-tick {
    position: absolute;
    bottom: 0;
    width: 1px;
    height: 100%;
    background-color: #e5e7eb;
    opacity: 0.5;
  }
  
  .skeleton-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: #e5e7eb;
    background-image: linear-gradient(
      to right,
      #e5e7eb 0%,
      #f3f4f6 20%,
      #e5e7eb 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    opacity: 0.7;
  }
  
  .skeleton-point {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e5e7eb;
    background-image: linear-gradient(
      to right,
      #e5e7eb 0%,
      #f3f4f6 20%,
      #e5e7eb 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    transform: translate(-50%, -50%);
  }
  
  .skeleton-label {
    height: 12px;
    width: 40px;
    background: #e5e7eb;
    background-image: linear-gradient(
      to right,
      #e5e7eb 0%,
      #f3f4f6 20%,
      #e5e7eb 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 2px;
    position: absolute;
    bottom: -20px;
  }
  
  .skeleton-title {
    height: 24px;
    width: 180px;
    background: #e5e7eb;
    background-image: linear-gradient(
      to right,
      #e5e7eb 0%,
      #f3f4f6 20%,
      #e5e7eb 40%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 4px;
  }
`;

// Define incident types with their display properties
const incidentTypeColors = {
  'theftPrevented': '#32CD32', // Changed to green for "prevented"
  'theftReported': '#FF1493',
  'incidentReported': '#FFB6C1',
  'customerDenied': '#FFA500',
  'cashierSuspicious': '#FFD700'
};

// Names to display in the tooltip
const incidentTypeNames = {
  'theftPrevented': 'Theft Prevented',
  'theftReported': 'Theft Reported',
  'incidentReported': 'Incident Reported',
  'customerDenied': 'Customer Denied',
  'cashierSuspicious': 'Cashier Suspicious'
};

const ReportStatisticsGraph = ({ storeId = null }) => {
  const dispatch = useDispatch();
  const { dailyIncidentsThreeMonths, dailyIncidentsThreeMonthsLoading } = useSelector(state => state.reports);
  const [processedData, setProcessedData] = useState([]);
  const [trend, setTrend] = useState('');

  useEffect(() => {
    dispatch(fetchDailyIncidentsThreeMonthsThunk(storeId));
  }, [dispatch, storeId]);

  // Process the daily data into weekly data for the chart
  useEffect(() => {
    if (!dailyIncidentsThreeMonths || !dailyIncidentsThreeMonths.data) return;

    // Convert daily data to weeks
    const dailyData = dailyIncidentsThreeMonths.data;
    const groupedByWeek = {};
    
    // Process each day's data
    Object.entries(dailyData).forEach(([date, incidents]) => {
      // Get week number from date
      const dateObj = new Date(date);
      const weekNum = getWeekNumber(dateObj);
      const weekLabel = `W${weekNum}`;
      
      // Initialize week entry if it doesn't exist
      if (!groupedByWeek[weekLabel]) {
        groupedByWeek[weekLabel] = {
          week: weekLabel,
          // Initialize all incident types to 0
          theftPrevented: 0,
          theftReported: 0,
          incidentReported: 0,
          customerDenied: 0,
          cashierSuspicious: 0
        };
      }
      
      // Add incident counts for this day to the weekly total
      Object.entries(incidents).forEach(([incidentType, count]) => {
        if (groupedByWeek[weekLabel][incidentType] !== undefined) {
          groupedByWeek[weekLabel][incidentType] += count;
        }
      });
    });
    
    // Convert grouped data to array and sort by week
    const sortedData = Object.values(groupedByWeek).sort((a, b) => {
      // Sort by week number
      const weekA = parseInt(a.week.substring(1));
      const weekB = parseInt(b.week.substring(1));
      return weekA - weekB;
    });
    
    // Calculate trend
    if (sortedData.length >= 2) {
      const firstWeek = sortedData[0];
      const lastWeek = sortedData[sortedData.length - 1];
      
      // Calculate total incidents for first and last week
      const firstWeekTotal = Object.values(firstWeek)
        .filter(val => typeof val === 'number')
        .reduce((sum, val) => sum + val, 0);
      
      const lastWeekTotal = Object.values(lastWeek)
        .filter(val => typeof val === 'number')
        .reduce((sum, val) => sum + val, 0);
      
      if (lastWeekTotal > firstWeekTotal) {
        setTrend('↗');
      } else if (lastWeekTotal < firstWeekTotal) {
        setTrend('↘');
      } else {
        setTrend('→');
      }
    } else {
      setTrend('');
    }
    
    setProcessedData(sortedData);
  }, [dailyIncidentsThreeMonths]);
  
  // Helper function to get week number
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out incident types with 0 value
      const nonZeroPayload = payload.filter(entry => entry.value > 0);
      
      if (nonZeroPayload.length === 0) return null;
      
      return (
        <div className="tooltip-container">
          <p className="tooltip-label">{label}</p>
          {nonZeroPayload.map((entry, index) => (
            <p 
              key={index} 
              className="tooltip-value" 
              style={{ color: entry.color }}
            >
              {incidentTypeNames[entry.dataKey] || entry.name}: {entry.value} cases
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const referenceLines = processedData.map((entry) => (
    <ReferenceLine
      key={entry.week}
      x={entry.week}
      stroke="#E5E7EB"
      strokeWidth={1}
      opacity={0.5}
      strokeDasharray="3 3"
      segment={[{ y: 0 }, { y: 400 }]}
    />
  ));

  // Skeleton loading component
  const SkeletonChart = () => {
    return (
      <div className="skeleton-container">
        {/* Horizontal axis line */}
        <div className="skeleton-axis"></div>
        
        {/* Vertical tick marks - 8 evenly spaced */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={`tick-${i}`} 
            className="skeleton-tick" 
            style={{ left: `${(i / 7) * 100}%` }}
          ></div>
        ))}
        
        {/* X-axis labels */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={`label-${i}`} 
            className="skeleton-label" 
            style={{ left: `${(i / 7) * 100}%` }}
          ></div>
        ))}
        
        {/* Skeleton lines - 3 with different heights */}
        <div className="skeleton-line" style={{ bottom: '30%' }}></div>
        <div className="skeleton-line" style={{ bottom: '45%' }}></div>
        <div className="skeleton-line" style={{ bottom: '60%' }}></div>
        
        {/* Skeleton points - a few scattered points */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`point-${i}`} 
            className="skeleton-point" 
            style={{ 
              left: `${20 + (i * 15)}%`, 
              bottom: `${30 + Math.sin(i) * 15}%` 
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="graph-container">
        <div className="header-container">
          {dailyIncidentsThreeMonthsLoading ? (
            <div className="skeleton-title"></div>
          ) : (
            <div className="graph-title">Report Statistics</div>
          )}
          <div className="trend-arrow">{trend}</div>
        </div>
        
        {dailyIncidentsThreeMonthsLoading ? (
          <SkeletonChart />
        ) : processedData.length === 0 ? (
          <div className="empty-container">No data available for the selected period</div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="theftReportedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF1493" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFB6C1" stopOpacity={0.3}/>
                </linearGradient>
                
                <linearGradient id="axisGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFA500" />
                  <stop offset="25%" stopColor="#32CD32" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="75%" stopColor="#FF00FF" />
                  <stop offset="100%" stopColor="#32CD32" />
                </linearGradient>
              </defs>

              {referenceLines}

              <rect
                x="0"
                y="95%"
                width="100%"
                height="3"
                fill="url(#axisGradient)"
                style={{ opacity: 0.7 }}
              />

              <XAxis 
                dataKey="week" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666' }}
                hide
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Render all incident types */}
              <Line
                type="monotone"
                dataKey="theftPrevented"
                name="Theft Prevented"
                stroke={incidentTypeColors.theftPrevented}
                strokeWidth={2}
                dot={false}
                opacity={0.7}
              />
              
              <Line
                type="monotone"
                dataKey="customerDenied"
                name="Customer Denied"
                stroke={incidentTypeColors.customerDenied}
                strokeWidth={2}
                dot={false}
                opacity={0.5}
              />
              
              <Line
                type="monotone"
                dataKey="cashierSuspicious"
                name="Cashier Suspicious"
                stroke={incidentTypeColors.cashierSuspicious}
                strokeWidth={2}
                dot={false}
                opacity={0.5}
              />
              
              <Line
                type="monotone"
                dataKey="incidentReported"
                name="Incident Reported"
                stroke={incidentTypeColors.incidentReported}
                strokeWidth={2}
                dot={false}
                opacity={0.6}
              />

              {/* Make theft reported the most prominent line */}
              <Line
                type="monotone"
                dataKey="theftReported"
                name="Theft Reported"
                stroke={incidentTypeColors.theftReported}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, fill: incidentTypeColors.theftReported }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default ReportStatisticsGraph;