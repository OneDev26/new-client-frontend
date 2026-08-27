import React from "react";
import { Link } from "react-router-dom";
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
  MapPin,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

import activityVideo01 from "../assets/A-7_cashierSuspicious_20260421_tv4.mp4";
import activityVideo02 from "../assets/A-7_cashierSuspicious_20260426_p5j.mp4";
import activityVideo03 from "../assets/A-7_cashierSuspicious_20260429_lhh.mp4";
import activityVideo04 from "../assets/A-7_cashierSuspicious_20260430_38p.mp4";
import activityVideo05 from "../assets/A-7_cashierSuspicious_20260520_d3v.mp4";
import "../CSS/ClientMonitoringDashboard.css";

const demoVideo =
  "https://www.w3schools.com/html/mov_bbb.mp4";

const videoEvidence = [
  {
    title: "Prevention Activity",
    date: "Jul 31, 2025",
    time: "1:45 PM",
    videoUrl: activityVideo01,
  },
  {
    title: "Cashier Activity",
    date: "Jul 31, 2025",
    time: "2:00 PM",
    videoUrl: activityVideo02,
  },
  {
    title: "Opening & Closing",
    date: "Jul 31, 2025",
    time: "10:08 PM",
    videoUrl: activityVideo03,
  },
];

const mobileActivityVideos = [
  { id: "register-transaction", title: "Suspect Attempted Theft", status: "Theft Prevented", theme: "green", location: "Downtown Market", camera: "Camera 03", time: "Today, 09:35 AM", duration: "02:45", source: activityVideo01 },
  { id: "cash-handling", title: "Cash Theft Reported", status: "Theft Reported", theme: "red", location: "Downtown Market", camera: "Camera 01", time: "Today, 08:12 AM", duration: "01:32", source: activityVideo02 },
  { id: "customer-interaction", title: "Employee Policy Violation", status: "Incident Report", theme: "orange", location: "Downtown Market", camera: "Camera 05", time: "Yesterday, 11:47 PM", duration: "03:18", source: activityVideo03 },
  { id: "register-payment", title: "Vehicle Break-in Prevented", status: "Theft Prevented", theme: "blue", location: "Downtown Market", camera: "Camera 12", time: "Yesterday, 10:15 PM", duration: "02:05", source: activityVideo04 },
  { id: "end-shift", title: "Shoplifting Reported", status: "Theft Reported", theme: "red", location: "Downtown Market", camera: "Camera 02", time: "Yesterday, 09:02 PM", duration: "01:41", source: activityVideo05 },
];

export default function ClientMonitoringDashboard() {
  return (
    <main className="client-dashboard">
      <section className="mobile-dashboard-content">
        <article className="mobile-savings-hero">
          <span>Estimated Loss Prevented</span>
          <strong>$2,450</strong>
          <p>This Month</p>
          <Link to="/savings-overview">View Savings Details <ChevronRight size={16} /></Link>
          <BadgeDollarSign className="mobile-savings-art" size={126} />
        </article>

        <section className="mobile-monitor-section">
          <div className="mobile-section-heading">
            <h2>Monitoring Status</h2>
            <span>All Good <i /></span>
          </div>
          <div className="mobile-monitor-grid">
            <MobileMonitorItem icon={Store} title="Store Monitored" value="Today" />
            <MobileMonitorItem icon={Clock3} title="Monitoring Active" value="During Hours" />
            <MobileMonitorItem icon={Target} title="Last Activity" value="2h ago" />
            <MobileMonitorItem icon={ShieldCheck} title="System Health" value="Good" />
          </div>
        </section>

        <article className="mobile-prevention-card">
          <div className="mobile-prevention-header">
            <span><ShieldCheck size={22} /></span>
            <div><h2>Prevention Highlights</h2><p>You're preventing losses and keeping your store safe.</p></div>
            <Link to="/prevention-highlights">View Highlights <ChevronRight size={15} /></Link>
          </div>
          <div className="mobile-prevention-stats">
            <MobilePreventionStat icon={Target} value="18" label="Incidents Prevented" />
            <MobilePreventionStat icon={Users} value="24" label="People Identified" />
            <MobilePreventionStat icon={BarChart3} value="$3,210" label="Potential Loss Prevented" />
          </div>
        </article>

        <section className="mobile-quick-section">
          <div className="mobile-section-heading"><h2>Quick Actions</h2><span>View All</span></div>
          <div className="mobile-quick-grid">
            <MobileQuickAction to="/live-view" icon={Eye} label="Live View" theme="purple" />
            <MobileQuickAction to="/video-evidence" icon={Play} label="View Recordings" theme="red" />
            <MobileQuickAction to="/reports" icon={Download} label="Reports" theme="blue" />
            <MobileQuickAction to="/add-new-store" icon={Store} label="Add New Store" theme="green" />
            <MobileQuickAction to="/camera-security" icon={ShoppingCart} label="Buy Package" theme="orange" />
          </div>
        </section>

        <section className="mobile-activity-section">
          <div className="mobile-section-heading">
            <h2>All Activity Videos</h2>
            <Link to="/cashier-activity-videos">View All</Link>
          </div>
          <div className="mobile-activity-filters" aria-label="Video categories">
            <button className="active" type="button">All Videos</button>
            <button type="button">Theft Prevented</button>
            <button type="button">Theft Reported</button>
            <button type="button">Incident Reports</button>
            <button className="filter" type="button" aria-label="Filter videos"><SlidersHorizontal size={14} /></button>
          </div>
          <div className="mobile-activity-list">
            {mobileActivityVideos.map((video) => <MobileActivityVideo key={video.id} video={video} />)}
          </div>
        </section>
      </section>

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

          <Link className="text-link" to="/cashier-activity">
            View Cashier Activity Videos
            <ChevronRight size={13} />
          </Link>
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

            <Link className="view-all-btn" to="/cashier-activity-videos">View All Videos</Link>
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
function MobileMonitorItem({ icon: Icon, title, value }) {
  return (
    <div className="mobile-monitor-item">
      <span><Icon size={19} /></span>
      <strong>{title}</strong>
      <small>{value} <CheckCircle2 size={11} /></small>
    </div>
  );
}

function MobilePreventionStat({ icon: Icon, value, label }) {
  return (
    <div className="mobile-prevention-stat">
      <div><span><Icon size={17} /></span><strong>{value}</strong></div>
      <small>{label}</small>
      <em>This Month</em>
    </div>
  );
}

function MobileQuickAction({ to, icon: Icon, label, theme }) {
  return (
    <Link className="mobile-quick-action" to={to}>
      <span className={theme}><Icon size={19} /></span>
      <strong>{label}</strong>
    </Link>
  );
}
function MobileActivityVideo({ video }) {
  return (
    <article className="mobile-activity-video">
      <Link className="mobile-activity-preview" to={`/cashier-activity-videos/${video.id}`} aria-label={`Play ${video.title}`}>
        <video src={video.source} preload="metadata" muted playsInline />
        <span><Play size={14} fill="currentColor" /></span>
        <small>{video.duration}</small>
      </Link>
      <div className="mobile-activity-copy">
        <em className={video.theme}>{video.status}</em>
        <strong>{video.title}</strong>
        <span><MapPin size={10} />{video.location} <b>•</b> {video.camera}</span>
        <span><Clock3 size={10} />{video.time}</span>
      </div>
      <div className="mobile-activity-actions">
        <Link to={`/cashier-activity-videos/${video.id}`} aria-label={`View ${video.title}`}><Eye size={15} /></Link>
        <a href={video.source} download aria-label={`Download ${video.title}`}><Download size={15} /></a>
      </div>
    </article>
  );
}