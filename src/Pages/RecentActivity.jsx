import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CalendarDays, Camera, ChevronDown, ChevronRight, Filter, Footprints, Grid2X2, Info, ScanLine, Settings, ShieldCheck, Store, UserRound, UsersRound } from "lucide-react";
import feeds from "../assets/live-view-feeds.png";
import "../CSS/RecentActivity.css";

const categories = [
  ["All Activities", Grid2X2], ["Motion", Footprints], ["People", UsersRound], ["Events", Bell], ["System", Settings],
];
const stats = [["128","Total Activities",Grid2X2,"purple"],["42","Motion",Footprints,"green"],["38","People",UsersRound,"orange"],["25","Events",Bell,"blue"],["23","System",Settings,"violet"]];
const items = [
  ["Motion Detected","Front Entrance · 9:40 AM","Motion",Footprints,"0% 0%"],
  ["Cashier Activity","Checkout Counter · 9:35 AM","People",ScanLine,"50% 0%"],
  ["Door Opened","Back Room · 9:33 AM","Event",ScanLine,"0% 100%"],
  ["Motion Detected","Aisle 3 · 9:30 AM","Motion",Footprints,"100% 0%"],
  ["Multiple People Detected","Aisle 5 · 9:28 AM","People",UsersRound,"50% 100%"],
  ["System Armed","Downtown Market · 9:25 AM","System",ShieldCheck,null],
  ["Motion Detected","Parking Lot · 9:20 AM","Motion",Footprints,"100% 100%"],
  ["Customer Entered","Front Entrance · 9:18 AM","People",UserRound,"0% 0%"],
];

export default function RecentActivity(){
  const navigate=useNavigate();
  const [category,setCategory]=useState("All Activities");
  const visible=category==="All Activities"?items:items.filter(item=>item[2]===category || (category==="Events"&&item[2]==="Event"));
  return <main className="recent-page">
    <header className="recent-mobile-head"><button onClick={()=>navigate(-1)} aria-label="Go back"><ArrowLeft/></button><h1>Recent Activity</h1><button aria-label="Filters"><Filter/></button></header>
    <section className="recent-filters"><FilterButton Icon={CalendarDays} label="Today"/><FilterButton Icon={Store} label="All Stores"/><FilterButton Icon={Camera} label="All Cameras"/></section>
    <nav className="recent-tabs">{categories.map(([name,Icon])=><button key={name} className={category===name?"active":""} onClick={()=>setCategory(name)}><Icon/><span>{name}</span></button>)}</nav>
    <section className="recent-stats">{stats.map(([value,label,Icon,theme])=><article className={theme} key={label}><Icon/><div><b>{value}</b><span>{label}</span></div></article>)}</section>
    <section className="recent-list"><header><div><h2>Activity Timeline</h2><p>Live events from all monitored cameras</p></div><button>Export Activity</button></header><div className="recent-list-grid">{visible.map(([title,time,type,Icon,pos],index)=><article className="recent-row" key={title+time}><span className={`recent-type-icon ${type.toLowerCase()}`}><Icon/></span><div><b>{title}</b><small>{time}</small><em>{type}</em></div>{pos?<span className="recent-thumb" style={{backgroundImage:`url(${feeds})`,backgroundPosition:pos}}><i>▶</i></span>:<span className="recent-system"><ShieldCheck/></span>}<ChevronRight/></article>)}</div><footer><Info/>All times shown in your local time zone</footer></section>
  </main>;
}
function FilterButton({Icon,label}){return <button><Icon/><span>{label}</span><ChevronDown/></button>}
