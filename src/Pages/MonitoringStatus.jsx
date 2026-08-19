import React from "react";
import {
  Camera,
  Cloud,
  ShieldCheck,
  CalendarDays,
  Wifi,
  CheckCircle2,
  Eye,
  ChevronRight,
  Clock3,
  Activity,
  UserRoundCheck,
} from "lucide-react";

import "../CSS/MonitoringStatus.css";

const topStatus = [
  {
    title: "Store Monitored Today",
    value: "Yes",
    subtitle: "Since 06:02 AM",
    icon: Camera,
    theme: "green",
  },
  {
    title: "Monitoring Active During Operating Hours",
    value: "Yes",
    subtitle: "6:00 AM - 11:00 PM",
    icon: Cloud,
    theme: "green",
  },
  {
    title: "All Systems Operational",
    value: "Normal",
    subtitle: "No active issues",
    icon: ShieldCheck,
    theme: "green",
  },
  {
    title: "Last Activity Reviewed",
    value: "10:18 AM",
    subtitle: "Today, July 31, 2025",
    icon: CalendarDays,
    theme: "purple",
  },
];

const systemOverview = [
  {
    title: "Total Cameras",
    value: "12",
    subtitle: "Online: 12",
    icon: Eye,
    theme: "purple",
  },
  {
    title: "Online Cameras",
    value: "12",
    subtitle: "100%",
    icon: Camera,
    theme: "green",
  },
  {
    title: "Offline Cameras",
    value: "0",
    subtitle: "0%",
    icon: Camera,
    theme: "red",
  },
  {
    title: "System Health",
    value: "Good",
    subtitle: "All systems running well",
    icon: ShieldCheck,
    theme: "green",
  },
  {
    title: "Network Status",
    value: "Stable",
    subtitle: "Strong Connection",
    icon: Wifi,
    theme: "green",
  },
];

const cameras = [
  {
    name: "Front Entrance",
    location: "Main Entrance",
    status: "Online",
    lastActivity: "10:18:22 AM",
  },
  {
    name: "Cash Counter 1",
    location: "POS Area",
    status: "Online",
    lastActivity: "10:18:19 AM",
  },
  {
    name: "Aisle 1",
    location: "Store Area",
    status: "Online",
    lastActivity: "10:18:25 AM",
  },
  {
    name: "Back Entrance",
    location: "Rear Door",
    status: "Online",
    lastActivity: "10:18:10 AM",
  },
  {
    name: "Parking Lot",
    location: "Parking Area",
    status: "Online",
    lastActivity: "10:18:21 AM",
  },
];

const timeline = [
  {
    time: "06:02 AM",
    title: "Monitoring Started",
    subtitle: "All systems are operational",
    theme: "green",
  },
  {
    time: "09:15 AM",
    title: "System Health Check",
    subtitle: "All cameras and system functions normal",
    theme: "green",
  },
  {
    time: "10:18 AM",
    title: "Activity Reviewed",
    subtitle: "Live review completed",
    theme: "purple",
    active: true,
  },
  {
    time: "11:00 PM",
    title: "Monitoring Ends",
    subtitle: "Scheduled monitoring end time",
    theme: "green",
  },
];

const benefits = [
  {
    title: "24/7 Monitoring",
    subtitle: "Round-the-clock surveillance",
    icon: Clock3,
  },
  {
    title: "Cloud Recording",
    subtitle: "Secure backup of all footage",
    icon: Cloud,
  },
  {
    title: "Smart Alerts",
    subtitle: "Instant notifications for important events",
    icon: Activity,
  },
  {
    title: "Expert Support",
    subtitle: "Our team is always here to help",
    icon: UserRoundCheck,
  },
];

export default function MonitoringStatus() {
  return (
    <main className="monitoring-status-page">
      {/* TOP STATUS */}
      <section className="ms-top-status-grid">
        {topStatus.map((item) => {
          const Icon = item.icon;

          return (
            <article className="ms-top-status-card" key={item.title}>
              <span className={`ms-top-icon ${item.theme}`}>
                <Icon size={22} />
              </span>

              <div>
                <span className="ms-top-title">{item.title}</span>

                <strong
                  className={
                    item.theme === "green"
                      ? "ms-green-value"
                      : ""
                  }
                >
                  {item.value}

                  {item.theme === "green" && (
                    <CheckCircle2
                      size={14}
                      className="ms-inline-check"
                    />
                  )}
                </strong>

                <small>{item.subtitle}</small>
              </div>
            </article>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <section className="ms-main-grid">
        <div className="ms-left-column">
          {/* LIVE OVERVIEW */}
          <article className="ms-card">
            <div className="ms-card-header">
              <h2>Live System Overview</h2>

              <button className="ms-outline-btn">
                View Live
              </button>
            </div>

            <div className="ms-system-grid">
              {systemOverview.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="ms-system-card" key={item.title}>
                    <span className="ms-system-title">
                      {item.title}
                    </span>

                    <div className="ms-system-main">
                      <span
                        className={`ms-system-icon ${item.theme}`}
                      >
                        <Icon size={22} />
                      </span>

                      <strong
                        className={
                          item.theme === "green"
                            ? "ms-green-value"
                            : ""
                        }
                      >
                        {item.value}
                      </strong>
                    </div>

                    <small>{item.subtitle}</small>
                  </div>
                );
              })}
            </div>
          </article>

          {/* CAMERA HEALTH */}
          <article className="ms-card ms-camera-card">
            <div className="ms-card-header">
              <h2>Camera Health</h2>

              <span className="ms-online-label">
                All Cameras are Online
              </span>
            </div>

            <div className="ms-table-wrapper">
              <table className="ms-camera-table">
                <thead>
                  <tr>
                    <th>Camera Name</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Last Activity</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {cameras.map((camera) => (
                    <tr key={camera.name}>
                      <td>
                        <div className="ms-camera-name">
                          <span className="ms-camera-dot-icon">
                            <Camera size={13} />
                          </span>

                          {camera.name}
                        </div>
                      </td>

                      <td>{camera.location}</td>

                      <td>
                        <span className="ms-online-status">
                          <i />
                          {camera.status}
                        </span>
                      </td>

                      <td>{camera.lastActivity}</td>

                      <td>
                        <button className="ms-view-btn">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ms-camera-footer">
              <button className="ms-outline-btn">
                View All Cameras
              </button>
            </div>
          </article>
        </div>

        {/* RIGHT */}
        <aside className="ms-right-column">
          {/* TIMELINE */}
          <article className="ms-card ms-timeline-card">
            <div className="ms-card-header">
              <h2>Today's Monitoring Timeline</h2>
            </div>

            <div className="ms-timeline">
              {timeline.map((item, index) => (
                <div
                  className={`ms-timeline-row ${
                    item.active ? "active" : ""
                  }`}
                  key={`${item.time}-${item.title}`}
                >
                  <span
                    className={`ms-timeline-dot ${item.theme}`}
                  >
                    <CheckCircle2 size={11} />
                  </span>

                  <span className="ms-timeline-time">
                    {item.time}
                  </span>

                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>
                </div>
              ))}
            </div>

            <button className="ms-bottom-link">
              View Full Activity Log
              <ChevronRight size={14} />
            </button>
          </article>

          {/* ALERTS */}
          <article className="ms-card ms-alert-card">
            <div className="ms-card-header">
              <h2>System Alerts</h2>
            </div>

            <div className="ms-no-alerts">
              <span>
                <CheckCircle2 size={20} />
              </span>

              <div>
                <strong>No Active Alerts</strong>

                <p>
                  All systems are working normally.
                  <br />
                  You'll be notified if any issues occur.
                </p>
              </div>
            </div>

            <button className="ms-bottom-link">
              View Alert History
              <ChevronRight size={14} />
            </button>
          </article>
        </aside>
      </section>

      {/* SECURITY BOTTOM */}
      <section className="ms-security-card">
        <div className="ms-security-intro">
          <span className="ms-security-icon">
            <ShieldCheck size={25} />
          </span>

          <div>
            <strong>Your Store is Secure</strong>
            <p>
              We're continuously monitoring your store to help
              prevent losses and keep your business safe.
            </p>
          </div>
        </div>

        <div className="ms-benefit-grid">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div className="ms-benefit" key={item.title}>
                <span>
                  <Icon size={18} />
                </span>

                <div>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}