import React, { useMemo, useState } from "react";
import {
  Film,
  ShieldCheck,
  Download,
  Clock3,
  HardDrive,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Play,
  Grid2X2,
  Grid3X3,
  List,
  Bookmark,
  Cloud,
  LockKeyhole,
} from "lucide-react";

import "../CSS/EvidenceClips.css";

const stats = [
  {
    title: "Total Clips",
    value: "124",
    subtitle: "↑ 18% vs last month",
    icon: Film,
    theme: "purple",
  },
  {
    title: "Verified Incidents",
    value: "32",
    subtitle: "↑ 21% vs last month",
    icon: ShieldCheck,
    theme: "green",
  },
  {
    title: "Downloads",
    value: "56",
    subtitle: "↑ 15% vs last month",
    icon: Download,
    theme: "orange",
  },
  {
    title: "Total Watch Time",
    value: "18h 42m",
    subtitle: "↑ 12% vs last month",
    icon: Clock3,
    theme: "red",
  },
  {
    title: "Storage Used",
    value: "236 GB",
    subtitle: "of 1 TB",
    icon: HardDrive,
    theme: "blue",
    progress: 24,
  },
];

const clips = [
  {
    camera: "CAM 01 - Front Entrance",
    duration: "00:30",
    type: "Unauthorized Access",
    title: "Unauthorized Access Detected",
    time: "Today, 10:18 AM",
    theme: "purple",
  },
  {
    camera: "CAM 03 - Aisle 4",
    duration: "00:42",
    type: "Theft Attempt",
    title: "Theft Attempt in Aisle 4",
    time: "Today, 09:45 AM",
    theme: "orange",
  },
  {
    camera: "CAM 02 - Cash Counter",
    duration: "00:26",
    type: "Refund Process",
    title: "Refund Process at Counter",
    time: "Today, 09:15 AM",
    theme: "green",
  },
  {
    camera: "CAM 05 - Parking Lot",
    duration: "00:36",
    type: "Suspicious Activity",
    title: "Suspicious Activity in Parking",
    time: "Yesterday, 08:50 PM",
    theme: "blue",
  },
  {
    camera: "CAM 04 - Aisle 2",
    duration: "00:25",
    type: "Policy Violation",
    title: "No Uniform Policy Violation",
    time: "Yesterday, 06:35 PM",
    theme: "orange",
  },
  {
    camera: "CAM 01 - Front Entrance",
    duration: "00:31",
    type: "Loitering",
    title: "Loitering Near Entrance",
    time: "Yesterday, 05:20 PM",
    theme: "purple",
  },
  {
    camera: "CAM 02 - Cash Counter",
    duration: "00:29",
    type: "Cash Handling",
    title: "Cash Handling Irregularity",
    time: "Yesterday, 04:10 PM",
    theme: "red",
  },
  {
    camera: "CAM 06 - Stock Room",
    duration: "00:40",
    type: "Inventory Issue",
    title: "Inventory Handling Issue",
    time: "Jul 29, 2025, 11:30 AM",
    theme: "blue",
  },
];

const quickFilters = [
  ["Unauthorized Access", 12, "purple"],
  ["Theft / Shoplifting", 26, "orange"],
  ["Refunds", 18, "blue"],
  ["Cash Handling", 9, "green"],
  ["Policy Violations", 15, "orange"],
  ["Suspicious Activity", 22, "yellow"],
  ["Inventory Issues", 8, "blue"],
];

const recentDownloads = [
  {
    title: "Theft Attempt in Aisle 4",
    time: "Today, 09:45 AM",
    size: "45 MB",
  },
  {
    title: "Refund Process at Counter",
    time: "Today, 09:15 AM",
    size: "32 MB",
  },
  {
    title: "Cash Handling Irregularity",
    time: "Yesterday, 04:10 PM",
    size: "28 MB",
  },
];

export default function EvidenceClips() {
  const [camera, setCamera] = useState("All Cameras");
  const [incident, setIncident] = useState("All Incident Types");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most Recent");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");

  const filteredClips = useMemo(() => {
    const q = search.trim().toLowerCase();

    return clips.filter((clip) => {
      const matchesSearch =
        !q ||
        clip.title.toLowerCase().includes(q) ||
        clip.camera.toLowerCase().includes(q) ||
        clip.type.toLowerCase().includes(q);

      const matchesCamera =
        camera === "All Cameras" || clip.camera === camera;

      const matchesIncident =
        incident === "All Incident Types" || clip.type === incident;

      return matchesSearch && matchesCamera && matchesIncident;
    });
  }, [camera, incident, search]);

  return (
    <main className="evidence-page">
      <section className="ev-stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className="ev-stat-card" key={item.title}>
              <span className={`ev-stat-icon ${item.theme}`}>
                <Icon size={21} />
              </span>

              <div className="ev-stat-copy">
                <span>{item.title}</span>

                <strong>
                  {item.value}
                  {item.subtitle === "of 1 TB" && (
                    <small> {item.subtitle}</small>
                  )}
                </strong>

                {item.progress ? (
                  <>
                    <div className="ev-storage-progress">
                      <span style={{ width: `${item.progress}%` }} />
                    </div>

                    <small className="ev-storage-label">
                      {item.progress}% used
                    </small>
                  </>
                ) : (
                  <small>{item.subtitle}</small>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="ev-filter-bar">
        <SelectBox
          value={camera}
          onChange={setCamera}
          options={[
            "All Cameras",
            "CAM 01 - Front Entrance",
            "CAM 02 - Cash Counter",
            "CAM 03 - Aisle 4",
            "CAM 05 - Parking Lot",
          ]}
        />

        <SelectBox
          value={incident}
          onChange={setIncident}
          options={[
            "All Incident Types",
            "Unauthorized Access",
            "Theft Attempt",
            "Refund Process",
            "Suspicious Activity",
            "Policy Violation",
            "Loitering",
            "Cash Handling",
            "Inventory Issue",
          ]}
        />

        <div className="ev-date-range">
          <span>Jul 24, 2025</span>
          <CalendarDays size={13} />
          <span>→</span>
          <span>Jul 31, 2025</span>
          <CalendarDays size={13} />
        </div>

        <button className="ev-filter-btn">
          <Filter size={13} />
          Filters
        </button>

        <label className="ev-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by keyword, incident type or camera..."
          />
        </label>
      </section>

      <section className="ev-main-grid">
        <section className="ev-left-column">
          <article className="ev-card ev-clips-card">
            <div className="ev-card-top">
              <div className="ev-title-group">
                <h2>Evidence Clips</h2>
                <span>124 Clips</span>
              </div>

              <div className="ev-view-controls">
                <span>Sort by:</span>

                <div className="ev-sort">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option>Most Recent</option>
                    <option>Oldest First</option>
                    <option>Longest Duration</option>
                  </select>
                  <ChevronDown size={11} />
                </div>

                <button
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                >
                  <Grid2X2 size={14} />
                </button>

                <button>
                  <Grid3X3 size={14} />
                </button>

                <button
                  className={view === "list" ? "active" : ""}
                  onClick={() => setView("list")}
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            <div
              className={`ev-clip-grid ${
                view === "list" ? "list-view" : ""
              }`}
            >
              {filteredClips.map((clip, index) => (
                <article className="ev-clip-card" key={`${clip.title}-${index}`}>
                  <div className="ev-video-placeholder">
                    {/* Add your surveillance thumbnail here */}

                    <span className="ev-camera-label">
                      {clip.camera}
                    </span>

                    <button className="ev-play-btn">
                      <Play size={18} fill="currentColor" />
                    </button>

                    <span className="ev-duration">
                      {clip.duration}
                    </span>
                  </div>

                  <div className="ev-clip-info">
                    <span className={`ev-type-badge ${clip.theme}`}>
                      {clip.type}
                    </span>

                    <strong>{clip.title}</strong>
                    <small>{clip.time}</small>
                  </div>

                  <footer className="ev-clip-footer">
                    <div>
                      <button title="Download">
                        <Download size={13} />
                      </button>

                      <button title="Save">
                        <Bookmark size={13} />
                      </button>
                    </div>

                    <button className="ev-details-btn">
                      View Details
                      <ChevronRight size={12} />
                    </button>
                  </footer>
                </article>
              ))}
            </div>

            <div className="ev-pagination-footer">
              <div className="ev-pagination">
                <button>
                  <ChevronLeft size={12} />
                </button>

                {[1, 2, 3, 4].map((number) => (
                  <button
                    key={number}
                    className={page === number ? "active" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}

                <span>...</span>
                <button>13</button>

                <button>
                  <ChevronRight size={12} />
                </button>
              </div>

              <span>Showing 1 to 12 of 124 clips</span>

              <button className="ev-per-page">
                12 per page
                <ChevronDown size={11} />
              </button>
            </div>
          </article>
        </section>

        <aside className="ev-right-column">
          <article className="ev-card ev-quick-card">
            <div className="ev-side-heading">
              <h2>Quick Filters</h2>
              <button>Clear</button>
            </div>

            <div className="ev-quick-filter-list">
              {quickFilters.map(([name, count, theme]) => (
                <button key={name}>
                  <span className={`ev-filter-dot ${theme}`} />
                  <strong>{name}</strong>
                  <small>{count}</small>
                </button>
              ))}
            </div>

            <button className="ev-side-link">
              View All Incident Types
            </button>
          </article>

          <article className="ev-card ev-storage-card">
            <div className="ev-storage-heading">
              <span>
                <Cloud size={17} />
              </span>

              <div>
                <h2>Storage & Retention</h2>
                <strong>236 GB of 1 TB Used</strong>
              </div>
            </div>

            <div className="ev-storage-bar">
              <span style={{ width: "24%" }} />
            </div>

            <div className="ev-storage-meta">
              <span>Retention Period</span>
              <strong>30 Days</strong>
            </div>

            <button className="ev-side-link">
              Manage Retention Settings
            </button>
          </article>

          <article className="ev-card ev-download-card">
            <div className="ev-side-heading">
              <h2>Recent Downloaded</h2>
              <button>View All</button>
            </div>

            <div className="ev-download-list">
              {recentDownloads.map((item) => (
                <div key={item.title}>
                  <Download size={13} />

                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.time}</small>
                  </div>

                  <span>{item.size}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="ev-secure-card">
            <span>
              <LockKeyhole size={18} />
            </span>

            <div>
              <strong>All videos are securely encrypted</strong>
              <p>
                Your data is safe and accessible only to authorized users.
              </p>
            </div>
          </article>
        </aside>
      </section>

      <div className="ev-footer-note">
        <ShieldCheck size={14} />
        Video footage is securely stored and used only for loss prevention and
        store safety.
      </div>
    </main>
  );
}

function SelectBox({ value, onChange, options }) {
  return (
    <label className="ev-select">
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