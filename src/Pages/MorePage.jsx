import React,{useState}from"react";
import{useNavigate}from"react-router-dom";
import{BarChart3,Bell,Camera,ChevronDown,ChevronRight,CircleHelp,CloudDownload,CreditCard,Database,FileText,Info,Package,Settings,ShieldCheck,Store,UsersRound,CircleUserRound,Video,Wrench}from"lucide-react";
import storeImage from"../assets/Dashboard_store.png";
import giftImage from"../assets/Refer_Earn.png";
import"../CSS/MorePage.css";

const groups=[
 {title:"Monitoring & Security",items:[
  ["Monitoring Status","Review monitoring health and coverage",ShieldCheck,"/monitoring-status","purple"],
  ["Cashier Activity","Review cashier transactions and activity",CircleUserRound,"/cashier-activity","green"],
  ["Video Evidence","Browse and download recorded evidence",Video,"/video-evidence","blue"],
  ["Installation Progress","Track onboarding and installation status",Wrench,"/installation-progress","orange"]]},
 {title:"Store & Account",items:[
  ["My Stores","View and manage your stores",Store,"/my-stores","purple"],
  ["Camera & Security","Manage your cameras and devices",Camera,"/camera-security","green"],
  ["Packages & Billing","View your package and billing details",Package,"/packages-billing","orange"],
  ["Payment Methods","Manage your payment methods",CreditCard,"/settings","blue"],
  ["Account","Manage your account and store information",CircleUserRound,"/account","purple"]]},
 {title:"Reports & Data",items:[
  ["Reports","View and download detailed reports",FileText,"/reports","purple"],
  ["Analytics","See insights and performance trends",BarChart3,"/reports","green"],
  ["Download Center","Download videos and reports",CloudDownload,"/video-evidence","orange"],
  ["Data Backup","Manage your data backup settings",Database,"/settings","blue"]]},
 {title:"Preferences & Support",items:[
  ["Notifications","Manage your alerts and notifications",Bell,null,"purple","toggle"],
  ["User Management","Manage users and permissions",UsersRound,"/account","green"],
  ["Settings","App settings and preferences",Settings,"/settings","orange"],
  ["Help & Support","Get help and contact support",CircleHelp,"/help-support","blue"],
  ["About Us","Learn more about Survill",Info,null,"purple","v2.4.1"]]}
];

export default function MorePage(){const nav=useNavigate(),[notifications,setNotifications]=useState(true);return <main className="more-page-full">
 <header className="more-page-head"><div><h1>More</h1><p>Manage your account, stores, and preferences.</p></div><button onClick={()=>nav("/my-stores")}><img src={storeImage} alt=""/><span><b>Downtown Market</b><small>Store Owner</small></span><ChevronDown/></button></header>
 <div className="more-groups">{groups.map(group=><section className="more-group" key={group.title}><h2>{group.title}</h2><div>{group.items.map(([name,copy,Icon,path,theme,special])=><button key={name} onClick={()=>special==="toggle"?setNotifications(!notifications):path&&nav(path)}><span className={`more-item-icon ${theme}`}><Icon/></span><span className="more-item-copy"><b>{name}</b><small>{copy}</small></span>{special==="toggle"?<span className={`more-toggle ${notifications?"on":""}`}><i/></span>:special?<em>{special}</em>:null}<ChevronRight/></button>)}</div></section>)}</div>
 <aside className="more-referral"><img src={giftImage} alt="Referral gift"/><div><b>Refer a Friend & Earn!</b><span>Refer a business owner to Survill and get 1 month free monitoring.</span></div><button onClick={()=>nav("/refer-earn")}>Refer Now <ChevronRight/></button></aside>
 </main>}
