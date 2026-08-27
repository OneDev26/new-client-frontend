import React,{useMemo,useState}from"react";
import{useNavigate}from"react-router-dom";
import{ArrowLeft,Camera,Check,ChevronDown,ChevronRight,CirclePause,Filter,Headphones,MapPin,MoreHorizontal,Plus,Search,ShieldCheck,Store}from"lucide-react";
import feeds from"../assets/live-view-feeds.png";
import"../CSS/MyStoresPage.css";

const data=[
["Downtown Market","123 Main St, Los Angeles, CA",16,"Premium Package","active","0% 0%"],
["Sunset Supermart","456 Sunset Blvd, Los Angeles, CA",24,"Standard Package","active","50% 0%"],
["Brew & Beans Café","789 Coffee St, Los Angeles, CA",8,"Basic Package","active","50% 100%"],
["HealthPlus Pharmacy","321 Health Ave, Los Angeles, CA",12,"Standard Package","inactive","100% 0%"],
["Metro Wholesale","654 Industrial Rd, Los Angeles, CA",32,"Premium Package","inactive","100% 100%"],
["Westside Grocery","88 Ocean Ave, Los Angeles, CA",18,"Premium Package","active","0% 100%"]];

export default function MyStoresPage(){const nav=useNavigate(),[q,setQ]=useState(""),[filter,setFilter]=useState("all");const rows=useMemo(()=>data.filter(x=>x[0].toLowerCase().includes(q.toLowerCase())&&(filter==="all"||x[4]===filter)),[q,filter]);return <main className="ms-page">
<header className="ms-mobile-head"><button onClick={()=>nav(-1)} aria-label="Go back"><ArrowLeft/></button><div><h1>My Stores</h1><p>View and manage all your stores in one place.</p></div><button className="add" onClick={()=>nav("/add-new-store")}><Plus/>Add Store</button></header>
<section className="ms-stats"><Stat I={Store} v="12" l="Total Stores" c="purple"/><Stat I={Check} v="9" l="Active" c="green"/><Stat I={CirclePause} v="2" l="Inactive" c="orange"/><Stat I={Camera} v="156" l="Total Cameras" c="blue"/></section>
<section className="ms-tools"><label><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stores..."/></label><div><Filter/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Filter</option><option value="active">Active</option><option value="inactive">Inactive</option></select><ChevronDown/></div></section>
<section className="ms-grid">{rows.map(([name,address,cameras,plan,status,pos])=><article className="my-store-item-card" key={name}><span className="ms-image" style={{backgroundImage:`url(${feeds})`,backgroundPosition:pos}}/><div className="ms-info"><h2>{name}</h2><button aria-label="More options"><MoreHorizontal/></button><p><MapPin/>{address}</p><div className="ms-tags"><span><Camera/>{cameras} Cameras</span><span className={plan.split(" ")[0].toLowerCase()}><ShieldCheck/>{plan}</span></div><div className={`ms-status ${status}`}><i/>{status==="active"?"Active · Online":"Inactive · Offline"}</div></div><button className="ms-view" onClick={()=>nav("/monitoring-status")}>View Store <ChevronRight/></button></article>)}</section>
<aside className="ms-support"><Headphones/><div><b>Can't find your store?</b><span>Contact support to add or sync your store.</span></div><button onClick={()=>nav("/help-support")}>Contact Support</button></aside></main>}
function Stat({I,v,l,c}){return <article className={c}><span><I/></span><div><b>{v}</b><small>{l}</small></div></article>}
