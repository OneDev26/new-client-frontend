import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BarChart3, CalendarDays, ChevronDown, ChevronRight,
  ShoppingCart, Store, TrendingUp, WalletCards,
} from "lucide-react";
import "../CSS/SavingsOverview.css";
import savingsOverviewImage from "../assets/Savings_Overview.png";

const overviewItems = [
  { label: "Loss Prevented", value: "$2,450", change: "18%", icon: WalletCards, theme: "green" },
  { label: "This Year", value: "$18,700", change: "22%", icon: CalendarDays, theme: "orange" },
  { label: "All Time", value: "$56,100", change: "15%", icon: BarChart3, theme: "purple" },
];

const categories = [
  { title: "Theft Prevention", incidents: "18", amount: "$1,540", change: "21%", icon: ShoppingCart, theme: "green" },
  { title: "Cash Handling", incidents: "12", amount: "$620", change: "16%", icon: Store, theme: "orange" },
  { title: "Inventory Protection", incidents: "9", amount: "$290", change: "12%", icon: WalletCards, theme: "purple" },
];

export default function SavingsOverview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("prevented");

  return (
    <main className="savings-overview-page">
      <header className="savings-page-header">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={19} /></button>
        <h1>Savings Overview</h1>
        <button type="button" aria-label="Select date"><CalendarDays size={19} /></button>
      </header>

      <div className="savings-tabs">
        <button type="button" className={activeTab === "prevented" ? "active" : ""} onClick={() => setActiveTab("prevented")}>Loss Prevented</button>
        <button type="button" className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>Savings History</button>
      </div>

      <article className="savings-hero-card">
        <span>Estimated Loss Prevented</span>
        <strong>$2,450</strong>
        <p>This Month</p>
        <em><TrendingUp size={13} />18% vs last month</em>
        <div className="savings-shield-art"><img src={savingsOverviewImage} alt="Savings protection" /></div>
      </article>

      <section className="savings-section">
        <div className="savings-section-heading">
          <h2>Overview</h2>
          <button type="button">This Month <ChevronDown size={13} /></button>
        </div>
        <div className="savings-overview-grid">
          {overviewItems.map(({ label, value, change, icon: Icon, theme }) => (
            <article key={label}>
              <span className={theme}><Icon size={18} /></span>
              <strong>{value}</strong>
              <small>{label}</small>
              <em>↑ {change}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="savings-chart-card">
        <div className="savings-section-heading">
          <h2>Loss Prevented Over Time</h2>
          <button type="button">Monthly <ChevronDown size={13} /></button>
        </div>
        <div className="savings-chart">
          <div className="savings-y-axis"><span>$3K</span><span>$2K</span><span>$1K</span><span>$0</span></div>
          <svg viewBox="0 0 300 120" role="img" aria-label="Loss prevented increased from February through July">
            <defs>
              <linearGradient id="savingsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6847ed" stopOpacity=".24" />
                <stop offset="100%" stopColor="#6847ed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M10 92 L65 76 L120 64 L175 52 L230 42 L288 28 L288 108 L10 108 Z" fill="url(#savingsArea)" />
            <polyline points="10,92 65,76 120,64 175,52 230,42 288,28" fill="none" stroke="#6847ed" strokeWidth="2.5" />
            {[["10","92"],["65","76"],["120","64"],["175","52"],["230","42"],["288","28"]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="3" fill="#fff" stroke="#6847ed" strokeWidth="2" />)}
          </svg>
          <div className="savings-x-axis"><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div>
        </div>
      </section>

      <section className="savings-categories">
        <div className="savings-section-heading"><h2>Top Loss Prevention Categories</h2><button type="button" className="view-all">View All</button></div>
        <div>
          {categories.map(({ title, incidents, amount, change, icon: Icon, theme }) => (
            <button type="button" className="savings-category-row" key={title}>
              <span className={theme}><Icon size={18} /></span>
              <div><strong>{title}</strong><small>Incidents: {incidents}</small></div>
              <div><strong>{amount}</strong><em>↑ {change}</em></div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}