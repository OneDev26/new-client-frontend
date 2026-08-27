import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Camera, ChevronDown, ChevronRight, Circle, Expand,
  Filter, Footprints, Maximize, Mic, MoreHorizontal, Play, Radio,
  ScanLine, Store, UserRound, ZoomIn, ZoomOut,
} from "lucide-react";
import feedSheet from "../assets/live-view-feeds.png";
import "../CSS/LiveView.css";

const cameras = [
  ["Front Entrance", "0% 0%"], ["Checkout Counter", "50% 0%"],
  ["Aisle 3", "100% 0%"], ["Back Room", "0% 100%"],
  ["Produce Section", "50% 100%"], ["Parking Entrance", "100% 100%"],
];
const activity = [
  ["Motion Detected", "Aisle 3 · 9:40 AM", Footprints, 2],
  ["Cashier Activity", "Checkout Counter · 9:35 AM", UserRound, 1],
  ["Door Opened", "Back Room · 9:33 AM", ScanLine, 3],
];

export default function LiveView() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selected, setSelected] = useState(0);
  const [ptz, setPtz] = useState("Center");

  return <main className="live-page">
    <header className="live-mobile-header"><button onClick={()=>navigate(-1)} aria-label="Go back"><ArrowLeft/></button><h1>Live View</h1><button aria-label="Filters"><Filter/></button></header>
    <section className="live-filters">
      <button><Store/><span>Downtown Market</span><ChevronDown/></button>
      <button><i/>6 Cameras Online<ChevronDown/></button>
    </section>
    <div className="live-layout">
      <section className="live-camera-area">
        <div className="live-grid">{cameras.map(([name,pos],index)=><button key={name} className={`live-feed ${selected===index?"selected":""}`} onClick={()=>setSelected(index)} style={{backgroundImage:`url(${feedSheet})`,backgroundPosition:pos}}>
          <span className="feed-name">{index+1}. {name}</span><em>Live</em><b><Radio size={15}/></b><span className="feed-expand"><Maximize size={16}/></span>
        </button>)}</div>
        <div className="live-actions">
          <Action Icon={Camera} label="Snapshot" onClick={()=>window.print()}/>
          <Action Icon={Circle} label={recording?"Recording":"Record"} active={recording} onClick={()=>setRecording(!recording)}/>
          <Action Icon={Mic} label={speaking?"Speaking":"Speak"} active={speaking} onClick={()=>setSpeaking(!speaking)}/>
          <Action Icon={MoreHorizontal} label="More"/>
        </div>
      </section>
      <aside className="live-side">
        <section className="live-card activity-card"><header><h2>Recent Activity</h2><button onClick={() => navigate("/recent-activity")}>View All <ChevronRight/></button></header>{activity.map(([title,time,Icon,feed])=><div className="activity-row" key={title}><span><Icon/></span><div><b>{title}</b><small>{time}</small></div><button className="activity-thumb" style={{backgroundImage:`url(${feedSheet})`,backgroundPosition:cameras[feed][1]}}><Play fill="currentColor"/></button></div>)}</section>
        <section className="live-card ptz-card"><header><h2>PTZ Control</h2><button>Camera {selected+1} - {cameras[selected][0]} <ChevronRight/></button></header><div className="ptz-body"><div className="ptz-pad"><button onClick={()=>setPtz("Up")}>⌃</button><button onClick={()=>setPtz("Left")}>‹</button><i>{ptz}</i><button onClick={()=>setPtz("Right")}>›</button><button onClick={()=>setPtz("Down")}>⌄</button></div><div className="ptz-options"><div><button><ZoomIn/></button><span>Zoom</span><button><ZoomOut/></button></div><hr/><b>Presets</b><button className="preset-btn"><Expand/>View Presets</button></div></div></section>
      </aside>
    </div>
  </main>;
}

function Action({Icon,label,active,onClick}) { return <button className={active?"active":""} onClick={onClick}><Icon fill={active&&label.startsWith("Record")?"currentColor":"none"}/><span>{label}</span></button>; }
