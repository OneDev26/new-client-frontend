import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreHorizontal,
  BellRing,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import "../CSS/Reports.css";


const mobileOverview = [
  { title: "Incidents Prevented", value: "24", change: "20%", period: "vs Apr 1 - Apr 30", icon: ShieldCheck, theme: "purple" },
  { title: "Est. Loss Prevented", value: "$2,450", change: "18%", period: "vs Apr 1 - Apr 30", icon: BarChart3, theme: "purple" },
  { title: "Repeat Offenders", value: "15", change: "7%", period: "vs Apr 1 - Apr 30", icon: Users, theme: "purple" },
  { title: "Resolution Rate", value: "98%", change: "5%", period: "vs Apr 1 - Apr 30", icon: CheckCircle2, theme: "purple" },
];

const mobileReportGroups = [
  {
    title: "Reports",
    items: [
      { title: "Theft Prevention", subtitle: "Track and analyze theft incidents prevented", icon: ShieldCheck, theme: "purple" },
      { title: "Access Control", subtitle: "Monitor access events and unauthorized attempts", icon: LockKeyhole, theme: "green", metric: "12", metricLabel: "Events" },
      { title: "Alarm Activity", subtitle: "View alarm triggers and responses", icon: BellRing, theme: "red", metric: "18", metricLabel: "Alerts" },
      { title: "Policy Compliance", subtitle: "Check store security policy compliance", icon: FileText, theme: "blue", metric: "92%", metricLabel: "Compliance Score" },
    ],
  },
  {
    title: "Operational Reports",
    items: [
      { title: "Foot Traffic", subtitle: "Analyze customer foot traffic patterns", icon: Users, theme: "orange", metric: "1,248", metricLabel: "Total Visits" },
      { title: "Cashier Activity", subtitle: "Review cashier transactions and activity", icon: BarChart3, theme: "green", metric: "398", metricLabel: "Transactions" },
    ],
  },
];

const mobileCategories = ["All", "Security", "Operations", "Compliance"];
const summaryCards = [
  {
    title: "Reports Generated",
    value: "24",
    change: "↑ 26% vs last 7 days",
    icon: FileBarChart,
    theme: "purple",
  },
  {
    title: "Reports Viewed",
    value: "18",
    change: "↑ 15% vs last 7 days",
    icon: Eye,
    theme: "green",
  },
  {
    title: "Reports Downloaded",
    value: "12",
    change: "↑ 20% vs last 7 days",
    icon: Download,
    theme: "blue",
  },
  {
    title: "Scheduled Reports",
    value: "6",
    change: "No change",
    icon: Clock3,
    theme: "orange",
  },
  {
    title: "Storage Used",
    value: "3.2 GB",
    change: "32% of 10 GB",
    icon: Trash2,
    theme: "purple",
    progress: 32,
  },
];

const reportRows = [
  {
    title: "Weekly Security Summary",
    range: "Jul 24 - Jul 31, 2025",
    type: "Summary",
    store: "Store 0047",
    location: "Main Street, New York",
    date: "Jul 31, 2025",
    time: "09:15 AM",
    generatedBy: "System",
    format: "PDF",
    size: "2.4 MB",
    status: "Completed",
    icon: BarChart3,
    theme: "purple",
  },
  {
    title: "Incident Report",
    range: "Jul 24 - Jul 31, 2025",
    type: "Incident",
    store: "Store 0047",
    location: "Main Street, New York",
    date: "Jul 31, 2025",
    time: "08:45 AM",
    generatedBy: "System",
    format: "PDF",
    size: "1.8 MB",
    status: "Completed",
    icon: ShieldCheck,
    theme: "green",
  },
  {
    title: "Cashier Activity Report",
    range: "Jul 24 - Jul 31, 2025",
    type: "Activity",
    store: "Store 0047",
    location: "Main Street, New York",
    date: "Jul 31, 2025",
    time: "08:30 AM",
    generatedBy: "System",
    format: "Excel",
    size: "1.2 MB",
    status: "Completed",
    icon: FileSpreadsheet,
    theme: "orange",
  },
  {
    title: "Camera Uptime Report",
    range: "Jul 24 - Jul 31, 2025",
    type: "System",
    store: "Store 0047",
    location: "Main Street, New York",
    date: "Jul 31, 2025",
    time: "08:10 AM",
    generatedBy: "System",
    format: "PDF",
    size: "1.1 MB",
    status: "Completed",
    icon: FileText,
    theme: "blue",
  },
  {
    title: "Policy Violation Report",
    range: "Jul 24 - Jul 31, 2025",
    type: "Violation",
    store: "Store 0047",
    location: "Main Street, New York",
    date: "Jul 31, 2025",
    time: "07:50 AM",
    generatedBy: "System",
    format: "PDF",
    size: "1.6 MB",
    status: "Completed",
    icon: ShieldCheck,
    theme: "purple",
  },
];

const scheduledReports = [
  {
    name: "Weekly Security Summary",
    frequency: "Every Monday",
    nextRun: "Aug 4, 2025 09:00 AM",
    recipient: "john.smith@email.com",
    status: "Active",
  },
  {
    name: "Incident Summary Report",
    frequency: "Every Wednesday",
    nextRun: "Aug 6, 2025 09:00 AM",
    recipient: "john.smith@email.com",
    status: "Active",
  },
  {
    name: "Monthly Overview Report",
    frequency: "1st of Every Month",
    nextRun: "Aug 1, 2025 09:00 AM",
    recipient: "john.smith@email.com",
    status: "Active",
  },
];

const typeBreakdown = [
  { label: "Summary Reports", value: 8, percent: 33, theme: "purple" },
  { label: "Incident Reports", value: 6, percent: 25, theme: "green" },
  { label: "Activity Reports", value: 5, percent: 21, theme: "orange" },
  { label: "System Reports", value: 3, percent: 13, theme: "orange2" },
  { label: "Other Reports", value: 2, percent: 8, theme: "muted" },
];

const mostGenerated = [
  ["Weekly Security Summary", 8],
  ["Incident Report", 6],
  ["Cashier Activity Report", 5],
  ["Camera Uptime Report", 3],
  ["Policy Violation Report", 2],
];

const quickActions = [
  {
    title: "Generate Custom Report",
    subtitle: "Create a report with custom filters",
    icon: FileBarChart,
    theme: "blue",
  },
  {
    title: "Schedule New Report",
    subtitle: "Set up automated report delivery",
    icon: CalendarDays,
    theme: "orange",
  },
  {
    title: "Manage Report Templates",
    subtitle: "Create and edit report templates",
    icon: FileText,
    theme: "purple",
  },
  {
    title: "Export Reports",
    subtitle: "Export multiple reports at once",
    icon: Download,
    theme: "green",
  },
];

export default function Reports() {
  const [reportType, setReportType] = useState("All Report Types");
  const [store, setStore] = useState("All Stores");
  const [search, setSearch] = useState("");
  const [insightRange, setInsightRange] = useState("This Week");
  const [mobileCategory, setMobileCategory] = useState("All");

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reportRows.filter((report) => {
      const matchesType =
        reportType === "All Report Types" || report.type === reportType;

      const matchesStore =
        store === "All Stores" || report.store === store;

      const matchesSearch =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.type.toLowerCase().includes(q);

      return matchesType && matchesStore && matchesSearch;
    });
  }, [reportType, store, search]);

  return (
    <main className="reports-page">
      <section className="reports-mobile-view">
        <button type="button" className="reports-mobile-date">
          <CalendarDays size={17} />
          <span>May 1 - May 31, 2024</span>
          <ChevronDown size={15} />
        </button>

        <div className="reports-mobile-tabs" role="tablist" aria-label="Report category">
          {mobileCategories.map((category) => (
            <button
              type="button"
              role="tab"
              aria-selected={mobileCategory === category}
              className={mobileCategory === category ? "active" : ""}
              onClick={() => setMobileCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="reports-mobile-overview">
          <h2>Overview</h2>
          <div>
            {mobileOverview.map(({ title, value, change, period, icon: Icon, theme }) => (
              <article key={title}>
                <span className={theme}><Icon size={19} /></span>
                <strong>{value}</strong>
                <p>{title}</p>
                <em>↑ {change}</em>
                <small>{period}</small>
              </article>
            ))}
          </div>
        </section>

        {mobileReportGroups.map((group) => (
          <section className="reports-mobile-group" key={group.title}>
            <div className="reports-mobile-group-heading">
              <h2>{group.title}</h2>
              {group.title === "Reports" && <button type="button">View All</button>}
            </div>
            <div className="reports-mobile-list">
              {group.items.map(({ title, subtitle, icon: Icon, theme, metric, metricLabel }, index) => (
                <button type="button" className={index === 0 && group.title === "Reports" ? "featured" : ""} key={title}>
                  <span className={theme}><Icon size={19} /></span>
                  <div><strong>{title}</strong><small>{subtitle}</small></div>
                  {metric && <div className="reports-mobile-metric"><strong>{metric}</strong><small>{metricLabel}</small></div>}
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </section>
        ))}
      </section>

      <div className="reports-page-actions" aria-label="Report actions">
        <button className="schedule-report-btn">
          <Clock3 size={16} />
          Schedule Report
        </button>
        <button className="generate-report-btn">
          <Plus size={16} />
          Generate New Report
        </button>
      </div>

      {/* STATS */}
      <section className="reports-stat-grid">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <article className="reports-stat-card" key={item.title}>
              <span className={`reports-stat-icon ${item.theme}`}>
                <Icon size={20} />
              </span>

              <div className="reports-stat-copy">
                <span>{item.title}</span>
                <strong>{item.value}</strong>

                {item.progress ? (
                  <>
                    <div className="reports-storage-row">
                      <div className="reports-storage-track">
                        <i style={{ width: `${item.progress}%` }} />
                      </div>

                      <small>{item.change}</small>
                    </div>
                  </>
                ) : (
                  <small
                    className={
                      item.change === "No change" ? "neutral" : "positive"
                    }
                  >
                    {item.change}
                  </small>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* FILTERS */}
      <section className="reports-filter-bar">
        <ReportSelect
          value={reportType}
          onChange={setReportType}
          options={[
            "All Report Types",
            "Summary",
            "Incident",
            "Activity",
            "System",
            "Violation",
          ]}
        />

        <ReportSelect
          value={store}
          onChange={setStore}
          options={["All Stores", "Store 0047", "Store 0048", "Store 0049"]}
        />

        <div className="reports-date-range">
          <span>Jul 24, 2025</span>
          <CalendarDays size={12} />
          <span>→</span>
          <span>Jul 31, 2025</span>
          <CalendarDays size={12} />
        </div>

        <button className="reports-filter-btn">
          <Filter size={13} />
          Filters
        </button>

        <label className="reports-search">
          <Search size={14} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reports by name or type..."
          />
        </label>
      </section>

      {/* MAIN */}
      <section className="reports-main-grid">
        <div className="reports-left-column">
          {/* RECENT REPORTS */}
          <article className="reports-card recent-reports-card">
            <div className="reports-card-header">
              <h2>Recent Reports</h2>

              <button className="reports-text-link">
                View All Reports
              </button>
            </div>

            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Type</th>
                    <th>Store / Location</th>
                    <th>Date Generated</th>
                    <th>Generated By</th>
                    <th>Format</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => {
                    const Icon = report.icon;

                    return (
                      <tr key={report.title}>
                        <td>
                          <div className="report-name-cell">
                            <span
                              className={`report-row-icon ${report.theme}`}
                            >
                              <Icon size={14} />
                            </span>

                            <div>
                              <strong>{report.title}</strong>
                              <small>{report.range}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`report-type-badge ${report.type.toLowerCase()}`}
                          >
                            {report.type}
                          </span>
                        </td>

                        <td>
                          <strong className="report-store">
                            {report.store}
                          </strong>
                          <small className="report-location">
                            {report.location}
                          </small>
                        </td>

                        <td>
                          <strong className="report-date">
                            {report.date}
                          </strong>
                          <small className="report-time">
                            {report.time}
                          </small>
                        </td>

                        <td>{report.generatedBy}</td>

                        <td>
                          <div className="report-format">
                            {report.format === "Excel" ? (
                              <FileSpreadsheet size={12} />
                            ) : (
                              <FileText size={12} />
                            )}

                            <div>
                              <strong>{report.format}</strong>
                              <small>{report.size}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="report-completed">
                            <CheckCircle2 size={10} />
                            {report.status}
                          </span>
                        </td>

                        <td>
                          <div className="report-row-actions">
                            <button>
                              <Download size={12} />
                            </button>

                            <button>
                              <MoreHorizontal size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="recent-reports-footer">
              <button>View All Reports</button>
            </div>
          </article>

          {/* SCHEDULED */}
          <article className="reports-card scheduled-card">
            <div className="reports-card-header">
              <h2>Scheduled Reports</h2>
            </div>

            <div className="reports-table-wrapper">
              <table className="scheduled-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Frequency</th>
                    <th>Next Run</th>
                    <th>Recipients</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {scheduledReports.map((report) => (
                    <ScheduledRow
                      key={report.name}
                      report={report}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <button className="scheduled-view-all">
              View All Scheduled Reports
            </button>
          </article>
        </div>

        {/* RIGHT */}
        <aside className="reports-right-column">
          {/* INSIGHTS */}
          <article className="reports-card report-insights-card">
            <div className="reports-card-header">
              <h2>Report Insights</h2>

              <label className="insight-select">
                <select
                  value={insightRange}
                  onChange={(event) => setInsightRange(event.target.value)}
                >
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>

                <ChevronDown size={10} />
              </label>
            </div>

            <div className="report-insight-title">Reports by Type</div>

            <div className="report-insight-content">
              <ReportDonut />

              <div className="report-insight-legend">
                {typeBreakdown.map((item) => (
                  <div key={item.label}>
                    <i className={item.theme} />

                    <span>{item.label}</span>

                    <strong>
                      {item.value} ({item.percent}%)
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="most-generated-box">
              <h3>Most Generated Reports</h3>

              {mostGenerated.map(([title, number], index) => (
                <div key={title}>
                  <span>{index + 1}</span>
                  <strong>{title}</strong>
                  <b>{number}</b>
                </div>
              ))}
            </div>
          </article>

          {/* QUICK ACTIONS */}
          <article className="reports-card reports-quick-card">
            <div className="reports-card-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="reports-quick-list">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button key={action.title}>
                    <span
                      className={`reports-quick-icon ${action.theme}`}
                    >
                      <Icon size={15} />
                    </span>

                    <div>
                      <strong>{action.title}</strong>
                      <small>{action.subtitle}</small>
                    </div>

                    <ChevronRight size={13} />
                  </button>
                );
              })}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}

function ReportSelect({ value, onChange, options }) {
  return (
    <label className="reports-select">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <ChevronDown size={11} />
    </label>
  );
}

function ScheduledRow({ report }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <tr>
      <td>{report.name}</td>
      <td>{report.frequency}</td>
      <td>{report.nextRun}</td>
      <td>{report.recipient}</td>

      <td>
        <span className="scheduled-active">
          {report.status}
        </span>
      </td>

      <td>
        <div className="scheduled-actions">
          <button
            className={`scheduled-toggle ${enabled ? "active" : ""}`}
            onClick={() => setEnabled((current) => !current)}
          >
            <span />
          </button>

          <button className="scheduled-more">
            <MoreHorizontal size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ReportDonut() {
  return (
    <div className="report-donut">
      <span />
    </div>
  );
}