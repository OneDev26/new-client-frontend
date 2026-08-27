import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  Play,
  ShieldCheck,
  UserRound,
  Video,
} from "lucide-react";
import video01 from "../assets/A-7_cashierSuspicious_20260421_tv4.mp4";
import video02 from "../assets/A-7_cashierSuspicious_20260426_p5j.mp4";
import video03 from "../assets/A-7_cashierSuspicious_20260429_lhh.mp4";
import video04 from "../assets/A-7_cashierSuspicious_20260430_38p.mp4";
import video05 from "../assets/A-7_cashierSuspicious_20260520_d3v.mp4";
import video06 from "../assets/A-7_cashierSuspicious_20260608_hmj.mp4";
import video07 from "../assets/A-7_cashierSuspicious_20260707_wsq.mp4";
import video08 from "../assets/AB_cashierSuspicious_20260613_jco.mp4";
import video09 from "../assets/AH_--_Can_Take_Away.mp4";
import video10 from "../assets/JC -- Cashier Suspicious Activity.mp4";
import "../CSS/CashierActivityVideos.css";

export const cashierVideos = [
  { id: "register-transaction", title: "Register Transaction Review", cashier: "Michael Brown", date: "Jul 31, 2025", time: "02:00 PM", duration: "02:45", source: video01 },
  { id: "cash-handling", title: "Cash Handling Review", cashier: "Sarah Johnson", date: "Jul 31, 2025", time: "11:15 AM", duration: "03:12", source: video02 },
  { id: "customer-interaction", title: "Customer Interaction Review", cashier: "David Wilson", date: "Jul 31, 2025", time: "09:30 AM", duration: "02:18", source: video03 },
  { id: "register-payment", title: "Register & Payment Review", cashier: "Emily Davis", date: "Jul 31, 2025", time: "06:45 PM", duration: "02:36", source: video04 },
  { id: "end-shift", title: "End of Shift Review", cashier: "Michael Brown", date: "Jul 30, 2025", time: "10:05 PM", duration: "01:38", source: video05 },
  { id: "transaction-exception", title: "Transaction Exception Review", cashier: "Sarah Johnson", date: "Jul 30, 2025", time: "03:20 PM", duration: "02:02", source: video06 },
  { id: "cash-drop", title: "Cash Drop Review", cashier: "David Wilson", date: "Jul 30, 2025", time: "01:15 PM", duration: "01:57", source: video07 },
  { id: "suspicious-activity", title: "Suspicious Activity Review", cashier: "Emily Davis", date: "Jul 30, 2025", time: "11:45 AM", duration: "02:22", source: video08 },
  { id: "take-away-review", title: "Take Away Transaction Review", cashier: "Anna Harris", date: "Jul 30, 2025", time: "10:20 AM", duration: "01:49", source: video09 },
  { id: "cashier-suspicious-review", title: "Cashier Suspicious Activity", cashier: "James Carter", date: "Jul 30, 2025", time: "09:10 AM", duration: "02:12", source: video10 },
];

const stats = [
  { Icon: Video, label: "Total Videos", value: "128", theme: "purple" },
  { Icon: CheckCircle2, label: "Reviewed Today", value: "48", theme: "green" },
  { Icon: Eye, label: "Critical", value: "0", theme: "red" },
  { Icon: ShieldCheck, label: "Reviewed", value: "100%", theme: "blue" },
];

export default function CashierActivityVideos() {
  const navigate = useNavigate();
  const openVideo = (id) => navigate(`/cashier-activity-videos/${id}`);

  return (
    <main className="cav-page">
      <header className="cav-local-head">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft /></button>
        <h1>Cashier Activity Videos</h1>
        <button type="button" aria-label="Filter videos"><Filter /></button>
      </header>

      <section className="cav-stats">
        {stats.map((stat) => <Stat key={stat.label} {...stat} />)}
      </section>

      <section className="cav-filters">
        <button type="button"><CalendarDays />Date Range<ChevronDown /></button>
        <button type="button"><UserRound />All Cashiers<ChevronDown /></button>
        <button type="button"><Clock3 />All Shifts<ChevronDown /></button>
        <a className="cav-export" href={cashierVideos[0].source} download><Download />Export List</a>
      </section>

      <DesktopVideoTable videos={cashierVideos} onOpen={openVideo} />

      <section className="cav-list">
        {cashierVideos.map((video) => (
          <VideoCard key={video.id} video={video} onOpen={openVideo} />
        ))}
      </section>
    </main>
  );
}

function DesktopVideoTable({ videos, onOpen }) {
  return (
    <section className="cav-desktop-table">
      <div className="cav-table-head">
        <span>Video Preview</span><span>Cashier</span><span>Date & Time</span><span>Shift</span><span>Status</span><span>Actions</span>
      </div>

      {videos.map((video, index) => {
        const shift = index % 3 === 0 ? "Afternoon" : index % 3 === 1 ? "Morning" : "Evening";
        const shiftTime = shift === "Morning" ? "6:00 AM - 12:00 PM" : shift === "Afternoon" ? "12:00 PM - 6:00 PM" : "6:00 PM - 12:00 AM";

        return (
          <article className="cav-table-row" key={video.id}>
            <div className="cav-table-preview">
              <button className="cav-preview" type="button" onClick={() => onOpen(video.id)} aria-label={`Play ${video.title}`}>
                <video src={video.source} preload="metadata" muted playsInline />
                <span><Play fill="currentColor" /></span>
                <small>{video.duration}</small>
              </button>
              <div><h2>{video.title}</h2><p>{video.title.includes("Cash") ? "Cash handling and drawer management review." : "Regular transaction activity review and verification."}</p></div>
            </div>
            <div className="cav-table-cell"><strong>{video.cashier}</strong><small>ID: {10458 + index}</small></div>
            <div className="cav-table-cell"><strong>{video.date}</strong><small>{video.time}</small></div>
            <div className="cav-table-cell"><em className={`cav-shift ${shift.toLowerCase()}`}>{shift}</em><small>{shiftTime}</small></div>
            <div className="cav-table-cell"><em className="cav-reviewed">Reviewed</em><small>No Concerns</small></div>
            <div className="cav-actions"><button type="button" onClick={() => onOpen(video.id)} aria-label={`View ${video.title}`}><Eye /></button><a href={video.source} download aria-label={`Download ${video.title}`}><Download /></a></div>
          </article>
        );
      })}

      <footer className="cav-table-footer"><span>Showing 1 to {videos.length} of {videos.length} videos</span><nav><button><ChevronLeft /></button><button className="active">1</button><button>2</button><button>3</button><button><ChevronRight /></button></nav></footer>
    </section>
  );
}
function VideoCard({ video, onOpen }) {
  return (
    <article className="cav-video-card">
      <button className="cav-preview" type="button" onClick={() => onOpen(video.id)} aria-label={`Play ${video.title}`}>
        <video src={video.source} preload="metadata" muted playsInline />
        <span><Play fill="currentColor" /></span>
        <small>{video.duration}</small>
      </button>

      <div className="cav-copy">
        <h2>{video.title}</h2>
        <strong>{video.cashier}</strong>
        <p>{video.date} · {video.time}</p>
        <em>Reviewed</em>
      </div>

      <div className="cav-actions">
        <button type="button" onClick={() => onOpen(video.id)} aria-label={`View ${video.title}`}><Eye /></button>
        <a href={video.source} download aria-label={`Download ${video.title}`}><Download /></a>
      </div>
    </article>
  );
}

function Stat({ Icon, label, value, theme }) {
  return <article className={theme}><span><Icon /></span><small>{label}</small><strong>{value}</strong></article>;
}