import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Custom styles for our chart component
const styles = {
  chartContainer: `
    .chart-container {
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .chart-header {
      background: #f8f9fa;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }
    
    .chart-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #2d3748;
    }
    
    /* Custom tooltip styles */
    .custom-tooltip {
      background-color: rgba(255, 255, 255, 0.95);
      border: 1px solid #e2e8f0;
      padding: 0.75rem;
      border-radius: 0.375rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .tooltip-label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #4a5568;
    }
    
    /* Legend styling */
    .custom-legend {
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `,
};

// Custom tooltip component for better data display
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const TriggerStatistics = () => {
  // Sample data structure with values between 0 and 10
  const data = [
    { day: 'Sunday', lastWeek: 0, currentWeek: 0 },
    { day: 'Monday', lastWeek: 0, currentWeek: 0 },
    { day: 'Tuesday', lastWeek: 0, currentWeek: 0 },
    { day: 'Wednesday', lastWeek: 0, currentWeek: 0 },
    { day: 'Thursday', lastWeek: 0, currentWeek: 10 },
    { day: 'Friday', lastWeek: 0, currentWeek: 0 },
    { day: 'Saturday', lastWeek: 0, currentWeek: 0 },
  ];

  return (
    <>
    <style>{styles.chartContainer}</style>
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Trigger Statistics</h2>
      </div>
      
      <div className="w-full h-64">
        <LineChart
          width={600}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Enhanced gridlines with custom styling */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0"
          />
          
          {/* X-axis with custom styling */}
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12, fill: '#4a5568' }}
            stroke="#cbd5e0"
          />
          
          {/* Y-axis now ranging from 0 to 10 with custom styling */}
          <YAxis 
            domain={[0, 10]}
            tickCount={6}
            tick={{ fontSize: 12, fill: '#4a5568' }}
            stroke="#cbd5e0"
          />
          
          {/* Enhanced tooltip */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Custom styled legend */}
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
            }}
          />
          
          {/* Lines with enhanced styling */}
          <Line
            type="monotone"
            dataKey="lastWeek"
            stroke="#ff7675"
            name="Last Week"
            strokeWidth={2}
            dot={{ stroke: '#ff7675', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          
          <Line
            type="monotone"
            dataKey="currentWeek"
            stroke="#6c5ce7"
            name="Current Week"
            strokeWidth={2}
            dot={{ stroke: '#6c5ce7', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </div>
    </>
  );
};

export default TriggerStatistics;