import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Mail,
  MapPin,
  Play,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  TriangleAlert,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import "../CSS/PreventionHighlights.css";

const stats = [
  {
    title: "Incidents Prevented This Month",
    value: "27",
    change: "↑ 12% vs last month",
    icon: ShieldCheck,
    theme: "purple",
  },
  {
    title: "Estimated Loss Prevented",
    value: "$2,450",
    change: "↑ 18% vs last month",
    icon: ShoppingBag,
    theme: "orange",
  },
  {
    title: "Suspicious Events Detected",
    value: "64",
    change: "↑ 15% vs last month",
    icon: Eye,
    theme: "blue",
  },
  {
    title: "Policy Violations Prevented",
    value: "18",
    change: "↓ 10% vs last month",
    icon: UserRound,
    theme: "green",
  },
  {
    title: "Repeat Offenders Identified",
    value: "6",
    change: "↓ 14% vs last month",
    icon: TrendingUp,
    theme: "purple",
  },
];

const preventedIncidents = [
  {
    type: "Unauthorized Access / Trespassing",
    count: 9,
    change: "29%",
    direction: "up",
    latest: "Today, 09:48 AM",
    theme: "purple",
  },
  {
    type: "Theft Attempt",
    count: 7,
    change: "16%",
    direction: "up",
    latest: "Today, 09:15 AM",
    theme: "orange",
  },
  {
    type: "Cash Handling Irregularity",
    count: 5,
    change: "17%",
    direction: "down",
    latest: "Yesterday, 11:32 PM",
    theme: "green",
  },
  {
    type: "Loitering / Suspicious Behavior",
    count: 4,
    change: "33%",
    direction: "up",
    latest: "Today, 08:05 AM",
    theme: "purple",
  },
  {
    type: "Policy Violation (No Uniform / ID)",
    count: 2,
    change: "20%",
    direction: "down",
    latest: "Yesterday, 07:20 PM",
    theme: "orange",
  },
];

const trendData = [
  { label: "Jul 25", value: 16 },
  { label: "Jul 26", value: 18 },
  { label: "Jul 27", value: 21 },
  { label: "Jul 28", value: 25 },
  { label: "Jul 29", value: 20 },
  { label: "Jul 30", value: 23 },
  { label: "Jul 31", value: 27 },
];

const recentHighlights = [
  {
    title: "Unauthorized access prevented at Front Entrance",
    time: "Today, 09:48 AM",
  },
  {
    title: "Theft attempt detected in Aisle 3",
    time: "Today, 09:15 AM",
  },
  {
    title: "Cash handling irregularity flagged at POS 2",
    time: "Yesterday, 11:32 PM",
  },
];

export default function PreventionHighlights() {
  const [period, setPeriod] = useState("This Month");
  const [chartRange, setChartRange] = useState("Daily");

  const maxValue = useMemo(
    () => Math.max(...trendData.map((item) => item.value)),
    []
  );

  return (
    <main className="prevention-page">

      <section className="ph-status-bar" aria-label="Monitoring update status">
        <div className="ph-auto-refresh">
          <span>Auto refresh:</span>
          <strong>ON</strong>
        </div>

        <div className="ph-updated">
          <RefreshCw size={14} />
          <span>Last updated: 10:24:30 AM</span>
        </div>
      </section>
      {/* PERIOD TABS */}
      <section className="ph-period-bar">
        <div className="ph-period-tabs">
          {["Today", "This Week", "This Month", "This Year"].map((item) => (
            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="ph-filter-btn">
          <Filter size={13} />
          Filters
        </button>
      </section>

      {/* KPI */}
      <section className="ph-stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className="ph-stat-card" key={item.title}>
              <span className={`ph-stat-icon ${item.theme}`}>
                <Icon size={22} />
              </span>

              <div>
                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <small>{item.change}</small>
              </div>
            </article>
          );
        })}
      </section>

      {/* MAIN */}
      <section className="ph-main-grid">
        <div className="ph-left-column">
          {/* TOP INCIDENTS */}
          <article className="ph-card ph-incidents-card">
            <div className="ph-card-header">
              <div>
                <h2>Top Prevented Incidents</h2>
                <p>Incidents detected and prevented in real-time.</p>
              </div>

              <button className="ph-outline-btn">
                View All Incidents
              </button>
            </div>

            <div className="ph-table-wrapper">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>Incident Type</th>
                    <th>Count</th>
                    <th>% Change</th>
                    <th>Latest Occurrence</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {preventedIncidents.map((item) => (
                    <tr key={item.type}>
                      <td>
                        <div className="ph-incident-type">
                          <span className={`ph-type-icon ${item.theme}`}>
                            <ShieldCheck size={13} />
                          </span>

                          {item.type}
                        </div>
                      </td>

                      <td>{item.count}</td>

                      <td>
                        <span
                          className={
                            item.direction === "up"
                              ? "ph-positive"
                              : "ph-positive"
                          }
                        >
                          {item.direction === "up" ? "▲" : "▼"} {item.change}
                        </span>
                      </td>

                      <td>{item.latest}</td>

                      <td>
                        <button className="ph-view-clip-btn">
                          View Clip
                          <ChevronRight size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ph-incidents-footer">
              <ShieldCheck size={14} />
              Real-time alerts and active monitoring help prevent losses before
              they happen.
            </div>
          </article>

          {/* CHART */}
          <article className="ph-card ph-chart-card">
            <div className="ph-card-header">
              <h2>Incidents Prevented Over Time</h2>

              <div className="ph-chart-select">
                <select
                  value={chartRange}
                  onChange={(event) => setChartRange(event.target.value)}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>

                <ChevronDown size={11} />
              </div>
            </div>

            <TrendChart data={trendData} maxValue={maxValue} />
          </article>
        </div>

        <aside className="ph-right-column">
          {/* SUMMARY */}
          <article className="ph-card ph-summary-card">
            <div className="ph-side-title">
              <TrendingUp size={15} />
              <h2>Highlights Summary</h2>
            </div>

            <div className="ph-safe-message">
              <span>
                <ShieldCheck size={21} />
              </span>

              <div>
                <strong>Your store is safer with Survill</strong>
                <p>
                  Proactive monitoring and instant alerts helping you reduce
                  risk and protect what matters most.
                </p>
              </div>
            </div>

            <div className="ph-great-job">
              <span>
                <Users size={18} />
              </span>

              <div>
                <strong>Great Job!</strong>
                <p>
                  You have 12% more incidents prevented this month compared to
                  last month.
                </p>
              </div>
            </div>

            <div className="ph-summary-list">
              <SummaryRow
                icon={Clock3}
                label="Most Active Time"
                value="12:00 PM - 04:00 PM"
              />

              <SummaryRow
                icon={MapPin}
                label="Most Common Area"
                value="Front Entrance"
              />

              <SummaryRow
                icon={TriangleAlert}
                label="Risk Level"
                value="• Low"
                green
              />
            </div>

            <button className="ph-full-report-btn">
              View Full Prevention Report
              <ChevronRight size={12} />
            </button>
          </article>

          {/* RECENT HIGHLIGHTS */}
          <article className="ph-card ph-recent-card">
            <div className="ph-card-header">
              <div className="ph-side-title no-margin">
                <Play size={14} />
                <h2>Recent Prevention Highlights</h2>
              </div>

              <button className="ph-text-btn">View All</button>
            </div>

            <div className="ph-recent-list">
              {recentHighlights.map((item, index) => (
                <div className="ph-recent-item" key={item.title}>
                  <div className="ph-thumb-placeholder">
                    {/* Add your image later */}

                    <button>
                      <Play size={13} fill="currentColor" />
                    </button>
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.time}</small>
                  </div>

                  <span>Prevented</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      {/* EMAIL BANNER */}
      <section className="ph-email-banner">
        <span className="ph-email-icon">
          <Mail size={20} />
        </span>

        <div>
          <strong>Get Prevention Reports in Your Inbox</strong>
          <p>
            Receive weekly prevention summary reports and stay informed about
            your store's security.
          </p>
        </div>

        <button>Manage Email Preferences</button>
      </section>
    </main>
  );
}

function SummaryRow({ icon: Icon, label, value, green }) {
  return (
    <div className="ph-summary-row">
      <Icon size={13} />

      <span>{label}</span>

      <strong className={green ? "green" : ""}>{value}</strong>
    </div>
  );
}

function TrendChart({ data, maxValue }) {
  const chartWidth = 680;
  const chartHeight = 150;
  const paddingLeft = 34;
  const paddingRight = 14;
  const paddingTop = 18;
  const paddingBottom = 31;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((item, index) => {
    const x =
      paddingLeft +
      (index / (data.length - 1)) * usableWidth;

    const y =
      paddingTop +
      usableHeight -
      (item.value / 40) * usableHeight;

    return { ...item, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="ph-trend-chart">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {[0, 10, 20, 30, 40].map((value) => {
          const y =
            paddingTop +
            usableHeight -
            (value / 40) * usableHeight;

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                x2={chartWidth - paddingRight}
                y1={y}
                y2={y}
                className="ph-grid-line"
              />

              <text
                x="3"
                y={y + 3}
                className="ph-axis-label"
              >
                {value}
              </text>
            </g>
          );
        })}

        <polygon
          points={`${paddingLeft},${paddingTop + usableHeight} ${polyline} ${
            chartWidth - paddingRight
          },${paddingTop + usableHeight}`}
          className="ph-area-fill"
        />

        <polyline
          points={polyline}
          className="ph-chart-line"
        />

        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3.6"
              className="ph-chart-dot"
            />

            <text
              x={point.x}
              y={point.y - 9}
              textAnchor="middle"
              className="ph-point-value"
            >
              {point.value}
            </text>

            <text
              x={point.x}
              y={chartHeight - 9}
              textAnchor="middle"
              className="ph-axis-label"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="ph-chart-legend">
        <span>
          <i className="current" />
          Incidents Prevented
        </span>

        <span>
          <i className="previous" />
          Previous Period
        </span>
      </div>
    </div>
  );
}