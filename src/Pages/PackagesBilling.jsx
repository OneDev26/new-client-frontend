import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, ChevronRight, CircleDollarSign, CreditCard,
  Headphones, RefreshCw, ShieldCheck, Store, UserRound
} from "lucide-react";
import giftImage from "../assets/Refer_Earn.png";
import "../CSS/PackagesBilling.css";

const invoices = [
  ["May 20, 2025", "INV-2025-0520"],
  ["Apr 20, 2025", "INV-2025-0420"],
  ["Mar 20, 2025", "INV-2025-0320"],
];

export default function PackagesBilling() {
  const navigate = useNavigate();

  return (
    <main className="pb-page">
      <header className="pb-mobile-head">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={19}/></button>
        <div><h1>Packages &amp; Billing</h1><p>View your current plan and billing details</p></div>
      </header>

      <div className="pb-layout">
        <div className="pb-main">
          <section className="pb-section">
            <h2>Current Package</h2>
            <article className="pb-plan-card">
              <div className="pb-plan-summary">
                <span className="pb-plan-icon"><ShieldCheck size={25}/></span>
                <div><h3>Semi-Dedicated Plan <em><i/>Active</em></h3><p>Two stores are monitored by one dedicated representative.</p></div>
              </div>
              <div className="pb-plan-features">
                <Feature Icon={UserRound} value="1 Representative" label="Monitoring"/>
                <Feature Icon={Store} value="2 Stores" label="Covered"/>
                <Feature Icon={RefreshCw} value="Standard" label="Response Time"/>
                <Feature Icon={ShieldCheck} value="24/7" label="Monitoring"/>
              </div>
            </article>
            <div className="pb-date-card">
              <InfoRow Icon={CalendarDays} title="Plan Start Date" value="May 20, 2025"/>
              <InfoRow Icon={RefreshCw} title="Next Review Date" value="May 20, 2026"/>
            </div>
          </section>

          <section className="pb-section">
            <h2>Billing Overview</h2>
            <div className="pb-billing-card">
              <InfoRow Icon={CircleDollarSign} title="Billing Cycle" value="Monthly" chevron={false}/>
              <InfoRow Icon={CalendarDays} title="Next Billing Date" value="June 20, 2025" chevron={false}/>
              <InfoRow Icon={CreditCard} title="Payment Method" value="•••• •••• •••• 4242" action="Manage"/>
            </div>
          </section>
        </div>

        <aside className="pb-side">
          <section className="pb-section pb-history">
            <div className="pb-title-row"><h2>Billing History</h2><button type="button">View All</button></div>
            <div className="pb-history-card">
              {invoices.map(([date, invoice]) => <InfoRow key={invoice} Icon={CircleDollarSign} title={date} value={`Invoice #${invoice}`} badge="Paid"/>)}
            </div>
          </section>

          <aside className="pb-contact">
            <img src={giftImage} alt=""/>
            <div><h3>Need More Coverage?</h3><p>Upgrade your plan or add more stores to get dedicated monitoring.</p></div>
            <button type="button" onClick={() => navigate("/help-support")}><Headphones size={17}/>Contact Us</button>
          </aside>
        </aside>
      </div>
    </main>
  );
}

function Feature({ Icon, value, label }) {
  return <div><Icon size={21}/><strong>{value}</strong><small>{label}</small></div>;
}

function InfoRow({ Icon, title, value, action, badge, chevron = true }) {
  return <div className="pb-info-row"><span><Icon size={18}/></span><div><strong>{title}{badge && <em>{badge}</em>}</strong><small>{value}</small></div>{action && <button type="button">{action}</button>}{chevron && <ChevronRight size={16}/>}</div>;
}
