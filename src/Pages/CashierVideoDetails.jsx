import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BellRing,
  Bookmark,
  CalendarDays,
  Check,
  Clock3,
  Download,
  Flag,
  Headphones,
  ReceiptText,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";
import { cashierVideos } from "./CashierActivityVideos";
import "../CSS/CashierActivityVideos.css";

const highlights = [
  { timestamp: "00:12", label: "Transaction Started" },
  { timestamp: "00:45", label: "Item Scanned" },
  { timestamp: "01:28", label: "Payment Processed" },
  { timestamp: "02:05", label: "Receipt Printed" },
];

const timelineEvents = [
  ["00:15", "Transaction Start"],
  ["00:45", "Cash Drawer Opened"],
  ["01:20", "Cash Count"],
  ["02:05", "Card Payment"],
  ["02:50", "Transaction Complete"],
];

export default function CashierVideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = cashierVideos.find((item) => item.id === id) || cashierVideos[0];

  return (
    <main className="cvd-page">
      <header className="cav-local-head cvd-head">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft /></button>
        <h1>Video Details</h1>
        <a href={video.source} download aria-label={`Download ${video.title}`}><Download /></a>
      </header>

      <DesktopWatchVideo video={video} />

      <div className="cvd-layout cvd-mobile-layout">
        <section className="cvd-main">
          <video className="cvd-player" src={video.source} controls playsInline preload="metadata" />
          <div className="cvd-title"><h2>{video.title}</h2><em>Reviewed</em></div>
          <VideoMetadata video={video} />
          <VideoHighlights source={video.source} />
          <section className="cvd-section"><h3>AI Summary</h3><div className="cvd-ai"><Sparkles /><p>Transaction looks normal. Items scanned and payment processed successfully. Cash drawer opened once for change.</p></div></section>
          <section className="cvd-section cvd-notes"><h3>Video Notes</h3><button type="button">Add Note</button><p>No notes added</p></section>
        </section>
        <aside className="cvd-side"><ActivityLog /><button type="button" className="cvd-flag"><Flag />Flag as Issue</button><button type="button" className="cvd-share"><Share2 />Share Video</button></aside>
      </div>
    </main>
  );
}

function DesktopWatchVideo({ video }) {
  return (
    <section className="cvd-desktop-watch">
      <div className="cvd-breadcrumb">Cashier Activity Videos <span>›</span> {video.title} <span>›</span> {video.date} <span>{video.time}</span></div>
      <div className="cvd-watch-grid">
        <div className="cvd-watch-main">
          <video className="cvd-watch-player" src={video.source} controls playsInline preload="metadata" />
          <VideoTimeline />
          <ActivitySummary />
        </div>
        <aside className="cvd-watch-side">
          <DesktopVideoDetails video={video} />
          <section className="cvd-watch-panel"><h2>Actions</h2><div className="cvd-watch-actions"><a href={video.source} download><Download />Download Video</a><button type="button"><Share2 />Share Video</button></div></section>
          <section className="cvd-watch-panel cvd-support"><h2>Need Something?</h2><p>Request additional footage or report an issue for this video.</p><button type="button"><Headphones />Request Support</button></section>
        </aside>
      </div>
    </section>
  );
}

function VideoTimeline() {
  return <section className="cvd-timeline"><header><h2>Video Timeline</h2><button type="button"><Bookmark />Add Bookmark</button></header><div className="cvd-timeline-line">{timelineEvents.map(([time,label],index)=><div key={time} className={index===1?"active":""}><i/><strong>{time}</strong><span>{label}</span></div>)}</div></section>;
}

function ActivitySummary() {
  const items=[[ShieldCheck,"No Critical Concerns","All activity within normal limits"],[ReceiptText,"Transactions Reviewed","18 transactions"],[WalletCards,"Cash Drawer Openings","18 times"],[Sparkles,"Exceptions","0"]];
  return <section className="cvd-activity-summary"><h2>Activity Summary</h2><p>Cash handling and drawer management review. All transactions were processed accurately.</p><div>{items.map(([Icon,title,value])=><article key={title}><span><Icon/></span><div><strong>{title}</strong><small>{value}</small></div></article>)}</div></section>;
}

function DesktopVideoDetails({video}) {
  return <section className="cvd-watch-panel"><h2>Video Details</h2><dl><dt>Video Name</dt><dd>{video.title}</dd><dt>Cashier</dt><dd>{video.cashier}<small>ID: 10459</small></dd><dt>Date & Time</dt><dd>{video.date} · {video.time}</dd><dt>Shift</dt><dd><em>Morning</em><small>6:00 AM - 12:00 PM</small></dd><dt>Status</dt><dd><em>Reviewed</em><small>No Concerns</small></dd><dt>Reviewed By</dt><dd>Michael Brown</dd><dt>Reviewed On</dt><dd>Jul 31, 2025 · 2:00 PM</dd></dl></section>;
}

function VideoMetadata({ video }) {
  return <div className="cvd-meta"><span><CalendarDays />{video.date}</span><span><Clock3 />{video.time}</span><span><UserRound />{video.cashier}</span><span>Shift: Afternoon Shift</span><span>Camera: Camera 03</span></div>;
}

function VideoHighlights({ source }) {
  return <section className="cvd-section"><div className="cvd-section-head"><h3>Video Highlights</h3><button type="button">View All</button></div><div className="cvd-highlights">{highlights.map((highlight)=><button type="button" key={highlight.timestamp}><video src={`${source}#t=0.2`} muted preload="metadata" playsInline/><strong>{highlight.timestamp}</strong><span>{highlight.label}</span></button>)}</div></section>;
}

function ActivityLog() {
  return <section className="cvd-section"><h3>Activity Log</h3><div className="cvd-log"><span><Check /></span><div><b>Reviewed by John Smith</b><small>Jul 31, 2025 · 03:15 PM</small></div><span><BellRing /></span><div><b>Video uploaded</b><small>Jul 31, 2025 · 02:05 PM</small></div></div></section>;
}