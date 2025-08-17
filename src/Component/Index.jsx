import React from "react";
import "../CSS/Index.css"; // Import your custom CSS
import Header from "./Header";
import RevenueDashboard from "./RevenueDashboard";
import ReportStatisticsGraph from "./ReportStatisticsGraph";
import SeverityReports from "./SeverityReports";
import IncidentDashboard from "./IncidentDashboard";
import ButtonHealth from "./ButtonHealth";
import LossPreventionDashboard from "./LossPreventionDashboard";
import SuspiciousTransactionAlerts from "./SuspiciousTransactionAlerts";
import CashierReports from "./CashierReports";
import TriggerAlerts from "./TriggerAlerts";
// 1. Import Recharts components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 2. Import icons from lucide-react
import {
  Camera,
  AlertTriangle,
  TrendingUp,
  Users,
  Search,
  AlertCircle,
  Video,
  WifiOff,
  AlertOctagon,
} from "lucide-react";
import Sidebar from "./Sidebar";
const players = [
  {
    id: 1,
    name: 'Armin A.',
    revenue: '$209,633',
    leads: 41,
    kpi: 118,
    wl: 0.84,
    percentage: '31%',
    wins: 12,
    losses: 29,
  },
  {
    id: 2,
    name: 'Mikasa A.',
    revenue: '$156,841',
    leads: 56,
    kpi: 103,
    wl: 0.89,
    percentage: '39%',
    wins: 21,
    losses: 33,
  }
];


// Sample data for Bar Chart
const alertsData = [
  { week: "Week 1", alerts: 12 },
  { week: "Week 2", alerts: 9 },
  { week: "Week 3", alerts: 15 },
  { week: "Week 4", alerts: 7 },
];

// Sample data for Line Chart
const bandwidthData = [
  { day: "Mon", usage: 2.3 },
  { day: "Tue", usage: 3.1 },
  { day: "Wed", usage: 2.8 },
  { day: "Thu", usage: 4.2 },
  { day: "Fri", usage: 3.6 },
  { day: "Sat", usage: 4.0 },
  { day: "Sun", usage: 5.0 },
];

// Sample data for Live Feeds Status
const liveFeedsData = [
  { status: "Live Feeds", count: 15 },
  { status: "Offline", count: 3 },
  { status: "Potential Issues", count: 5 },
];

export default function Index() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
     

      {/* Main Content */}
      <main className="main-content">
  
        <div className="">
        <RevenueDashboard />
        <IncidentDashboard />
        <div className="SuspiciousTransaction-LossPrevention-section">
        <SuspiciousTransactionAlerts />
       

      </div>
        <div className="performance-section">

        <div className="report-performance-dashboard">
      {/* Top row: user performance statistics */}
      
        <TriggerAlerts />
        <div className="report-performance-dashboard-box">
      {/* Platforms Performance */}
      <ButtonHealth />
      
      {/* Sales Performance Chart */}
      <div className="performance-sales-chart-card">
        <ReportStatisticsGraph />
      </div>
      </div>
    </div>
    <SeverityReports />
    </div>
      

    </div>
       </main>

      
    </div>
  );
}
