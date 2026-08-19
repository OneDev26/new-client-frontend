import React from "react";
import {
  BadgeDollarSign,
  BarChart3,
  ShieldCheck,
  ShoppingCart,
  CalendarDays,
  Users,
  CheckCircle2,
  Sun,
  Moon,
  Play,
  Clock3,
  Download,
  Gift,
  Target,
  Eye,
  Store,
  Video,
  ChevronRight,
} from "lucide-react";

import "../CSS/ClientMonitoringDashboard.css";

const demoVideo =
  "https://www.w3schools.com/html/mov_bbb.mp4";

const videoEvidence = [
  {
    title: "Prevention Activity",
    date: "Jul 31, 2025",
    time: "1:45 PM",
    videoUrl: demoVideo,
  },
  {
    title: "Cashier Activity",
    date: "Jul 31, 2025",
    time: "2:00 PM",
    videoUrl: demoVideo,
  },
  {
    title: "Opening & Closing",
    date: "Jul 31, 2025",
    time: "10:08 PM",
    videoUrl: demoVideo,
  },
];

export default function ClientMonitoringDashboard() {
  return (
    <main className="client-dashboard">
      {/* TOP STATS */}
      <section className="client-top-grid">
        <article className="client-stat-card savings-green">
          <div className="client-stat-content">
            <span className="client-stat-icon green">
              <BadgeDollarSign size={22} />
            </span>

            <div>
              <span>Estimated Savings</span>
              <strong>This Month</strong>
            </div>
          </div>

          <div className="client-stat-value">$2,450</div>
          <small>Loss Prevented</small>

          <div className="client-spark green-spark">
            <svg viewBox="0 0 110 38">
              <polyline
                points="2,30 15,27 24,31 34,25 45,26 55,22 64,13 72,18 82,13 92,2 100,21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="client-card-footer positive">
            ↑ 12%
            <span>vs last month</span>
          </div>
        </article>

        <article className="client-stat-card savings-blue">
          <div className="client-stat-content">
            <span className="client-stat-icon blue">
              <BarChart3 size={22} />
            </span>

            <div>
              <span>Estimated Savings</span>
              <strong>This Year</strong>
            </div>
          </div>

          <div className="client-stat-value">$18,700</div>
          <small>Loss Prevented</small>

          <div className="client-spark blue-spark">
            <svg viewBox="0 0 110 38">
              <polyline
                points="2,30 13,26 24,30 34,24 43,20 52,27 63,20 72,9 81,17 92,2 101,23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="client-card-footer positive">
            ↑ 18%
            <span>vs last year</span>
          </div>
        </article>

        <article className="client-stat-card status-card">
          <div className="client-stat-content">
            <span className="client-stat-icon purple">
              <ShieldCheck size={22} />
            </span>

            <div>
              <span>Monitoring Status</span>
            </div>
          </div>

          <div className="monitoring-active">Active</div>
          <small>Store monitored today</small>

          <div className="client-card-footer">
            <i className="status-dot" />
            Last activity reviewed: 2:15 PM
          </div>
        </article>

        <article className="client-stat-card purchase-card">
          <div className="client-stat-content">
            <span className="client-stat-icon orange">
              <ShoppingCart size={23} />
            </span>

            <div>
              <span>Purchase New Camera</span>
            </div>
          </div>

          <p>
            Upgrade your store security
            <br />
            with high-quality cameras.
          </p>

          <button type="button" className="outline-orange-btn">
            Buy New Camera
          </button>
        </article>
      </section>

      {/* SECOND ROW */}
      <section className="client-second-grid">
        <article className="client-panel">
          <div className="client-panel-heading">
            <div>
              <CalendarDays size={16} />
              <h2>Opening & Closing Verification</h2>
            </div>
          </div>

          <div className="open-close-row">
            <span className="round-icon sun">
              <Sun size={22} />
            </span>

            <div>
              <span>Store Opened</span>
              <strong>7:02 AM</strong>
            </div>

            <span className="verified-badge">Verified</span>
          </div>

          <div className="open-close-row">
            <span className="round-icon moon">
              <Moon size={22} />
            </span>

            <div>
              <span>Store Closed</span>
              <strong>10:08 PM</strong>
            </div>

            <span className="verified-badge">Verified</span>
          </div>

          <button className="text-link">
            View Full Timeline
            <ChevronRight size={13} />
          </button>
        </article>

        <article className="client-panel">
          <div className="client-panel-heading">
            <div>
              <Users size={16} />
              <h2>Cashier Activity Review</h2>
            </div>
          </div>

          <div className="cashier-check">
            <CheckCircle2 size={20} />
            <div>
              <strong>Cashier activity reviewed</strong>
              <span>Today, 2:00 PM</span>
            </div>
          </div>

          <div className="cashier-check">
            <CheckCircle2 size={20} />
            <div>
              <strong>No critical concern observed</strong>
              <span>All activity within normal limits</span>
            </div>
          </div>

          <button className="text-link">
            View Cashier Activity Videos
            <ChevronRight size={13} />
          </button>
        </article>

        <article className="client-panel prevention-highlight">
          <div className="client-panel-heading">
            <div>
              <ShieldCheck size={16} />
              <h2>Today's Prevention Highlight</h2>
            </div>

            <button className="view-all-btn">View All</button>
          </div>

          <div className="highlight-content">
            <div className="media-placeholder highlight-media">
              <video
                src={demoVideo}
                controls
                preload="metadata"
              />

              <span className="video-overlay-play">
                <Play size={19} fill="currentColor" />
              </span>
            </div>

            <div className="highlight-copy">
              <strong>Suspicious customer near beer cooler</strong>

              <p>
                Announcement issued – customer left without merchandise.
              </p>

              <div className="highlight-meta">
                <span>
                  <CalendarDays size={13} />
                  Jul 31, 2025
                </span>

                <span>
                  <Clock3 size={13} />
                  1:45 PM
                </span>
              </div>

              <button type="button" className="watch-video-btn">
                <Play size={13} fill="currentColor" />
                Watch Video
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* VIDEO / REPORT / PACKAGE */}
      <section className="client-third-grid">
        <article className="client-panel video-evidence-card">
          <div className="client-panel-heading">
            <div>
              <Video size={16} />
              <h2>Video Evidence</h2>
            </div>

            <button className="view-all-btn">View All Videos</button>
          </div>

          <div className="video-evidence-grid">
            {videoEvidence.map((video) => (
              <div className="evidence-item" key={video.title}>
                <div className="media-placeholder evidence-media">
                  <video
                    src={video.videoUrl}
                    controls
                    preload="metadata"
                  />

                  <span className="video-overlay-play small">
                    <Play size={16} fill="currentColor" />
                  </span>
                </div>

                <div className="evidence-copy">
                  <strong>{video.title}</strong>

                  <span>
                    {video.date} • {video.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="client-panel reports-card">
          <div className="client-panel-heading">
            <div>
              <Download size={17} />
              <h2>Download Reports</h2>
            </div>
          </div>

          <p>Get detailed reports for your records.</p>

          <ReportRow title="Daily Summary Report" />
          <ReportRow title="Monthly Summary Report" />

          <button className="text-link">
            View All Reports
            <ChevronRight size={13} />
          </button>
        </article>

        <article className="client-panel security-package-card">
          <div className="security-package-top">
            <span className="client-stat-icon blue">
              <ShieldCheck size={21} />
            </span>

            <h2>Buy Security Package</h2>
          </div>

          <p>
            Protect your other locations
            <br />
            with our security packages.
          </p>

          <button className="security-package-btn">
            Buy Security Package
          </button>

          <div className="security-package-image">
            {/* Add your image later */}
          </div>
        </article>
      </section>

      {/* BOTTOM ROW */}
      <section className="client-bottom-grid">
        <article className="refer-card">
          <div className="refer-icon">
            <Gift size={25} />
          </div>

          <div className="refer-copy">
            <strong>Refer a Friend & Earn Free Month</strong>

            <p>
              Refer another business owner and get 1 month free service
              when they sign up.
            </p>

            <button>Refer Now</button>
          </div>

          <div className="refer-image">
            {/* Add referral illustration later */}
          </div>
        </article>

        <article className="coverage-card">
          <h2>Monitoring Coverage Today</h2>

          <div className="coverage-grid">
            <CoverageItem
              icon={Target}
              title="Coverage"
              value="100%"
              subtitle="During Operating Hours"
            />

            <CoverageItem
              icon={Clock3}
              title="Monitored"
              value="12h 15m"
              subtitle="Total Monitoring Time"
            />

            <CoverageItem
              icon={Eye}
              title="Activity Reviewed"
              value="2:15 PM"
              subtitle="Last Review Time"
            />

            <CoverageItem
              icon={Store}
              title="Operating Hours"
              value="7:00 AM - 10:00 PM"
              subtitle="Store Hours"
            />
          </div>
        </article>
      </section>
    </main>
  );
}

function ReportRow({ title }) {
  return (
    <div className="report-row">
      <span>{title}</span>

      <div>
        <small>PDF</small>
        <button>
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}

function CoverageItem({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="coverage-item">
      <span className="coverage-icon">
        <Icon size={17} />
      </span>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}