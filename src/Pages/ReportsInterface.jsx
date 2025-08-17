import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, MapPin, Video, Filter, Calendar as CalendarIcon } from 'lucide-react';
import '../CSS/ReportsInterface.css';
import Sidebar from '../Component/Sidebar';
import Header from '../Component/Header';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  fetchReportsThunk,
  fetchReportsByYearThunk,
  fetchReportsByMonthThunk,
  fetchReportsByWeekThunk,
  fetchReportsByDateRangeThunk,
  fetchStoreOwnerSummaryThunk,
  fetchDailyIncidentsThreeMonthsThunk,
  fetchMonthlySeverityBreakdownThunk,
} from '../features/reports/reportThunks';

const ReportsInterface = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    results: reports,
    loading,
    error,
    reportsByYear,
    yearLoading,
    reportsByMonth,
    monthLoading,
    reportsByWeek,
    weekLoading,
    reportsByDateRange,
    dateRangeLoading,
    storeOwnerSummary,
    storeOwnerSummaryLoading,
    dailyIncidentsThreeMonths,
    dailyIncidentsThreeMonthsLoading,
  } = useSelector((state) => state.reports);

  // Component state
  const [activeTab, setActiveTab] = useState('YEARLY');
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [storeId, setStoreId] = useState(null); // For store filtering

  // Available years for selection
  const availableYears = ['2023', '2024', '2025'];
  const availableMonths = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      switch (activeTab) {
        case 'YEARLY':
          dispatch(fetchReportsByYearThunk(selectedYear));
          break;
        case 'MONTHLY':
          dispatch(fetchReportsByMonthThunk({ 
            year: selectedYear, 
            month: selectedMonth 
          }));
          break;
        case 'WEEKLY':
          dispatch(fetchReportsByWeekThunk({ 
            year: selectedYear, 
            month: selectedMonth, 
            week: selectedWeek 
          }));
          break;
        case 'DAILY':
          dispatch(fetchDailyIncidentsThreeMonthsThunk(storeId));
          break;
        case 'DATE_RANGE':
          if (startDate && endDate) {
            dispatch(fetchReportsByDateRangeThunk({ 
              start_date: startDate, 
              end_date: endDate 
            }));
          }
          break;
        default:
          break;
      }
    };

    loadData();
  }, [dispatch, activeTab, selectedYear, selectedMonth, selectedWeek, startDate, endDate, storeId]);

  // Load store owner summary on component mount
  useEffect(() => {
    dispatch(fetchStoreOwnerSummaryThunk(storeId));
  }, [dispatch, storeId]);

  // Load reports list
  useEffect(() => {
    dispatch(fetchReportsThunk({ storeId, offset: 0, limit: 50 }));
  }, [dispatch, storeId]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'YEARLY':
        return reportsByYear;
      case 'MONTHLY':
        return reportsByMonth;
      case 'WEEKLY':
        return reportsByWeek;
      case 'DAILY':
        return dailyIncidentsThreeMonths;
      case 'DATE_RANGE':
        return reportsByDateRange;
      default:
        return null;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'YEARLY':
        return yearLoading;
      case 'MONTHLY':
        return monthLoading;
      case 'WEEKLY':
        return weekLoading;
      case 'DAILY':
        return dailyIncidentsThreeMonthsLoading;
      case 'DATE_RANGE':
        return dateRangeLoading;
      default:
        return false;
    }
  };

  // Handler for Metric Click
  const handleMetricClick = (category) => {
    setFilteredCategory(filteredCategory === category ? null : category);
  };

  // Handler to Clear Filters
  const clearFilters = () => {
    setFilteredCategory(null);
  };

  // Handler for Calendar Date Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter reports based on category
  const getFilteredReports = () => {
    if (!reports) return [];
    
    let filtered = [...reports];
    
    if (filteredCategory) {
      filtered = filtered.filter(report => 
        report.incident_type?.toLowerCase() === filteredCategory.toLowerCase() ||
        report.status?.toLowerCase() === filteredCategory.toLowerCase()
      );
    }
    
    return filtered;
  };

  // Helper function to get severity class
  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'reports-interface__severity--low';
      case 'medium':
        return 'reports-interface__severity--medium';
      case 'high':
        return 'reports-interface__severity--high';
      case 'critical':
        return 'reports-interface__severity--critical';
      default:
        return '';
    }
  };

  // Get statistics for display
  const getStatistics = () => {
    const currentData = getCurrentData();
    if (!currentData) return null;

    // Handle different data structures from API
    if (Array.isArray(currentData)) {
      // For daily incidents or other array responses
      const stats = currentData.reduce((acc, item) => {
        const type = item.incident_type || 'general';
        acc[type] = (acc[type] || 0) + (item.count || 1);
        return acc;
      }, {});
      return stats;
    } else if (currentData.breakdown) {
      // For responses with breakdown property
      return currentData.breakdown;
    } else {
      // Direct object with statistics
      return currentData;
    }
  };

  const statistics = getStatistics();
  const filteredReports = getFilteredReports();
  const isLoading = getCurrentLoading();

  return (
    <div className="reports-interface">
      <div className="reports-interface__container">
        <main className="reports-interface__main">
          <div className="reports-interface__content">
            {/* Header Section */}
            <div className="reports-interface__header">
              <h1 className="reports-interface__title">Reports Dashboard</h1>
              {storeOwnerSummary && (
                <div className="reports-interface__summary">
                  <span className="reports-interface__summary-text">
                    Total Reports: {storeOwnerSummary.total_reports || 0}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="reports-interface__tabs">
              {['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'DATE_RANGE'].map((tab) => (
                <button
                  key={tab}
                  className={`reports-interface__tab ${activeTab === tab ? 'reports-interface__tab--active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setFilteredCategory(null);
                  }}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Filter Controls */}
            <div className="reports-interface__filters">
              {(activeTab === 'YEARLY' || activeTab === 'MONTHLY' || activeTab === 'WEEKLY') && (
                <div className="reports-interface__filter-group">
                  <label className="reports-interface__filter-label">Year:</label>
                  <select
                    className="reports-interface__filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === 'MONTHLY' || activeTab === 'WEEKLY') && (
                <div className="reports-interface__filter-group">
                  <label className="reports-interface__filter-label">Month:</label>
                  <select
                    className="reports-interface__filter-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {availableMonths.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'WEEKLY' && (
                <div className="reports-interface__filter-group">
                  <label className="reports-interface__filter-label">Week:</label>
                  <select
                    className="reports-interface__filter-select"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((week) => (
                      <option key={week} value={week}>Week {week}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'DATE_RANGE' && (
                <>
                  <div className="reports-interface__filter-group">
                    <label className="reports-interface__filter-label">Start Date:</label>
                    <input
                      type="date"
                      className="reports-interface__filter-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="reports-interface__filter-group">
                    <label className="reports-interface__filter-label">End Date:</label>
                    <input
                      type="date"
                      className="reports-interface__filter-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 'DAILY' && (
                <div className="reports-interface__filter-group">
                  <CalendarIcon className="reports-interface__calendar-icon" />
                  <Calendar 
                    onChange={handleDateChange} 
                    value={selectedDate} 
                    className="reports-interface__calendar"
                  />
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="reports-interface__loading">
                <div className="reports-interface__spinner"></div>
                <p>Loading data...</p>
              </div>
            )}

            {/* Statistics Cards */}
            {!isLoading && statistics && (
              <div className="reports-interface__statistics">
                {Object.entries(statistics).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className={`reports-interface__stat-card reports-interface__stat-card--${index % 4}`}
                    onClick={() => handleMetricClick(key)}
                  >
                    <div className="reports-interface__stat-header">
                      <h3 className="reports-interface__stat-title">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                      </h3>
                      <div className="reports-interface__stat-avatars">
                        <div className="reports-interface__avatar reports-interface__avatar--blue"></div>
                        <div className="reports-interface__avatar reports-interface__avatar--green"></div>
                        <div className="reports-interface__avatar reports-interface__avatar--purple"></div>
                      </div>
                    </div>
                    <div className="reports-interface__stat-value">
                      {typeof value === 'object' ? value.count || 0 : value || 0}
                    </div>
                    <div className="reports-interface__stat-trend">
                      <span className="reports-interface__trend-indicator">
                        {filteredCategory === key ? '✓ Selected' : 'Click to filter'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clear Filters */}
            {filteredCategory && (
              <div className="reports-interface__clear-filters">
                <button 
                  className="reports-interface__clear-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Reports Table */}
            <div className="reports-interface__table">
              <div className="reports-interface__table-header">
                <div className="reports-interface__header-cell">Name</div>
                <div className="reports-interface__header-cell">Status</div>
                <div className="reports-interface__header-cell">Details</div>
                <div className="reports-interface__header-cell">Severity</div>
                <div className="reports-interface__header-cell">Media</div>
              </div>
              
              <div className="reports-interface__table-body">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div 
                      key={report.id} 
                      className={`reports-interface__table-row ${getSeverityClass(report.severity)}`}
                    >
                      <div className="reports-interface__cell reports-interface__cell--name">
                        <div className="reports-interface__name-section">
                          <Video className="reports-interface__report-icon" />
                          <div>
                            <div className="reports-interface__report-name">
                              {report.title || report.name || 'Unnamed Report'}
                            </div>
                            <div className="reports-interface__report-location">
                              <MapPin className="reports-interface__location-icon" />
                              {report.store?.name || report.location || 'Unknown Location'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="reports-interface__cell">
                        <span className="reports-interface__status">
                          {report.status || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="reports-interface__cell">
                        <div className="reports-interface__date">
                          {new Date(report.created_at || report.date).toLocaleDateString()}
                        </div>
                        <div className="reports-interface__details">
                          {report.description || report.details || 'No details available'}
                        </div>
                      </div>
                      
                      <div className="reports-interface__cell">
                        <span className={`reports-interface__severity-badge ${getSeverityClass(report.severity)}`}>
                          {report.severity || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="reports-interface__cell">
                        <div className="reports-interface__media-section">
                          {report.media_files && report.media_files.length > 0 ? (
                            report.media_files.slice(0, 2).map((media, index) => (
                              <img 
                                key={index} 
                                src={media.file || media} 
                                alt={`Media ${index + 1}`} 
                                className="reports-interface__media-image" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ))
                          ) : (
                            <span className="reports-interface__no-media">
                              No media available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="reports-interface__empty-state">
                    <p>No reports found for the selected criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsInterface;