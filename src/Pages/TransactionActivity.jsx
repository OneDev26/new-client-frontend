import React, { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  ReceiptText,
  RotateCcw,
  XCircle,
  TrendingUp,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CreditCard,
  Banknote,
  Play,
  Clock3,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";

import "../CSS/TransactionActivity.css";

const stats = [
  {
    title: "Total Transactions",
    value: "1,248",
    change: "8%",
    note: "vs yesterday",
    direction: "up",
    icon: ReceiptText,
    theme: "purple",
  },
  {
    title: "Total Sales",
    value: "$18,745.60",
    change: "7%",
    note: "vs yesterday",
    direction: "up",
    icon: BadgeDollarSign,
    theme: "green",
  },
  {
    title: "Refunds",
    value: "$245.30",
    change: "12%",
    note: "vs yesterday",
    direction: "down",
    icon: RotateCcw,
    theme: "orange",
  },
  {
    title: "Voids",
    value: "15",
    change: "17%",
    note: "vs yesterday",
    direction: "down",
    icon: XCircle,
    theme: "red",
  },
  {
    title: "Avg. Transaction Value",
    value: "$15.02",
    change: "5%",
    note: "vs yesterday",
    direction: "up",
    icon: TrendingUp,
    theme: "blue",
  },
];

const transactions = [
  {
    time: "10:23:15 AM",
    id: "TXN-78521",
    cashier: "Emma M.",
    initials: "EM",
    register: "REG-01",
    type: "Sale",
    amount: "$24.65",
    payment: "Card",
    status: "Completed",
  },
  {
    time: "10:18:42 AM",
    id: "TXN-78520",
    cashier: "Jason S.",
    initials: "JS",
    register: "REG-01",
    type: "Sale",
    amount: "$15.90",
    payment: "Cash",
    status: "Completed",
  },
  {
    time: "10:17:05 AM",
    id: "TXN-78519",
    cashier: "Olivia L.",
    initials: "OL",
    register: "REG-02",
    type: "Refund",
    amount: "-$12.30",
    payment: "Card",
    status: "Completed",
  },
  {
    time: "10:15:33 AM",
    id: "TXN-78518",
    cashier: "Emma M.",
    initials: "EM",
    register: "REG-01",
    type: "Void",
    amount: "-$8.75",
    payment: "Cash",
    status: "Completed",
  },
  {
    time: "10:12:11 AM",
    id: "TXN-78517",
    cashier: "Jason S.",
    initials: "JS",
    register: "REG-01",
    type: "Sale",
    amount: "$32.40",
    payment: "Card",
    status: "Completed",
  },
  {
    time: "10:08:56 AM",
    id: "TXN-78516",
    cashier: "Emma M.",
    initials: "EM",
    register: "REG-02",
    type: "Sale",
    amount: "$18.20",
    payment: "Card",
    status: "Completed",
  },
  {
    time: "10:06:22 AM",
    id: "TXN-78515",
    cashier: "Olivia L.",
    initials: "OL",
    register: "REG-02",
    type: "Sale",
    amount: "$11.75",
    payment: "Cash",
    status: "Completed",
  },
  {
    time: "10:03:37 AM",
    id: "TXN-78514",
    cashier: "Jason S.",
    initials: "JS",
    register: "REG-01",
    type: "Refund",
    amount: "-$5.40",
    payment: "Cash",
    status: "Completed",
  },
];

const highlights = [
  {
    title: "Top Selling Item",
    main: "Energy Drink (12oz)",
    detail: "Qty: 186",
    icon: FileSpreadsheet,
    theme: "green",
  },
  {
    title: "Peak Sales Time",
    main: "2:00 PM - 3:00 PM",
    detail: "$2,856.40",
    icon: Clock3,
    theme: "purple",
  },
  {
    title: "Most Refunds",
    main: "Olivia L. (3)",
    detail: "$28.40",
    icon: RotateCcw,
    theme: "orange",
  },
  {
    title: "Most Voids",
    main: "Jason S. (7)",
    detail: "$42.15",
    icon: XCircle,
    theme: "red",
  },
];

const activityClips = [
  {
    title: "Refund Process",
    user: "Olivia L.",
    register: "REG-02",
    time: "10:17 AM",
    date: "Jul 31, 2025",
    duration: "00:36",
  },
  {
    title: "Void Transaction",
    user: "Emma M.",
    register: "REG-01",
    time: "10:15 AM",
    date: "Jul 31, 2025",
    duration: "00:28",
  },
  {
    title: "Large Cash Transaction",
    user: "Jason S.",
    register: "REG-01",
    time: "10:12 AM",
    date: "Jul 31, 2025",
    duration: "00:31",
  },
  {
    title: "Price Override",
    user: "Olivia L.",
    register: "REG-02",
    time: "10:06 AM",
    date: "Jul 31, 2025",
    duration: "00:27",
  },
];

const cashierPerformance = [
  {
    cashier: "Emma M.",
    sales: "$6,245.30",
    transactions: 412,
    avg: "$15.15",
    refunds: "$85.40",
    voids: 4,
  },
  {
    cashier: "Jason S.",
    sales: "$6,180.20",
    transactions: 398,
    avg: "$15.53",
    refunds: "$72.20",
    voids: 7,
  },
  {
    cashier: "Olivia L.",
    sales: "$5,420.10",
    transactions: 368,
    avg: "$14.73",
    refunds: "$87.70",
    voids: 4,
  },
];

const flaggedActivities = [
  {
    title: "High Refund Amount",
    detail: "Olivia L. • $12.30 • 10:17 AM",
  },
  {
    title: "Multiple Voids",
    detail: "Jason S. • 3 voids • 10:15 AM",
  },
  {
    title: "Price Override",
    detail: "Emma M. • $5.00 • 09:58 AM",
  },
];

export default function TransactionActivity() {
  const [cashier, setCashier] = useState("All Cashiers");
  const [register, setRegister] = useState("All Registers");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase().trim();

    return transactions.filter((item) => {
      const matchesCashier =
        cashier === "All Cashiers" || item.cashier === cashier;

      const matchesRegister =
        register === "All Registers" || item.register === register;

      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.cashier.toLowerCase().includes(q);

      return matchesCashier && matchesRegister && matchesSearch;
    });
  }, [cashier, register, search]);

  return (
    <main className="transaction-activity-page">
      {/* KPI CARDS */}
      <section className="txn-stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className="txn-stat-card" key={item.title}>
              <span className={`txn-stat-icon ${item.theme}`}>
                <Icon size={20} />
              </span>

              <div>
                <span className="txn-stat-title">{item.title}</span>
                <strong>{item.value}</strong>

                <small
                  className={
                    item.direction === "up"
                      ? "txn-positive"
                      : "txn-negative"
                  }
                >
                  {item.direction === "up" ? "▲" : "▼"} {item.change}
                  <span> {item.note}</span>
                </small>
              </div>
            </article>
          );
        })}
      </section>

      {/* FILTER BAR */}
      <section className="txn-filter-bar">
        <FilterSelect
          value={cashier}
          onChange={setCashier}
          options={[
            "All Cashiers",
            "Emma M.",
            "Jason S.",
            "Olivia L.",
          ]}
        />

        <FilterSelect
          value={register}
          onChange={setRegister}
          options={["All Registers", "REG-01", "REG-02"]}
        />

        <div className="txn-date-range">
          <CalendarDays size={13} />
          <span>Jul 31, 2025</span>
          <span className="txn-date-arrow">→</span>
          <span>Jul 31, 2025</span>
          <CalendarDays size={13} />
        </div>

        <button className="txn-filter-btn">
          <Filter size={13} />
          Filters
        </button>

        <label className="txn-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by transaction ID or cashier name..."
          />
        </label>
      </section>

      {/* MAIN CONTENT */}
      <section className="txn-main-grid">
        <div className="txn-left-column">
          {/* TRANSACTION TABLE */}
          <article className="txn-card txn-transactions-card">
            <div className="txn-card-heading">
              <div>
                <h2>Transactions</h2>
                <span className="txn-record-count">
                  1,248 Records
                </span>
              </div>
            </div>

            <div className="txn-table-wrapper">
              <table className="txn-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Transaction ID</th>
                    <th>Cashier</th>
                    <th>Register</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.time}</td>
                      <td>{item.id}</td>

                      <td>
                        <div className="txn-cashier">
                          <span>{item.initials}</span>
                          {item.cashier}
                        </div>
                      </td>

                      <td>{item.register}</td>

                      <td>
                        <TransactionType type={item.type} />
                      </td>

                      <td>{item.amount}</td>

                      <td>
                        <div className="txn-payment">
                          {item.payment === "Card" ? (
                            <CreditCard size={12} />
                          ) : (
                            <Banknote size={12} />
                          )}
                          {item.payment}
                        </div>
                      </td>

                      <td>
                        <span className="txn-completed">
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button className="txn-play-action">
                          <Play size={11} fill="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="txn-table-footer">
              <div className="txn-pagination">
                <button>
                  <ChevronLeft size={12} />
                </button>

                {[1, 2, 3].map((number) => (
                  <button
                    key={number}
                    className={page === number ? "active" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}

                <span>...</span>
                <button>42</button>

                <button>
                  <ChevronRight size={12} />
                </button>
              </div>

              <span>Showing 1 to 20 of 1,248</span>

              <button className="txn-per-page">
                20 / page
                <ChevronDown size={11} />
              </button>
            </footer>
          </article>

          {/* LOWER LEFT */}
          <section className="txn-lower-grid">
            <article className="txn-card txn-performance-card">
              <div className="txn-card-heading">
                <h2>Cashier Performance Overview</h2>

                <button className="txn-small-select">
                  Today
                  <ChevronDown size={11} />
                </button>
              </div>

              <table className="txn-small-table">
                <thead>
                  <tr>
                    <th>Cashier</th>
                    <th>Total Sales</th>
                    <th>Transactions</th>
                    <th>Avg. Transaction</th>
                    <th>Refunds</th>
                    <th>Voids</th>
                  </tr>
                </thead>

                <tbody>
                  {cashierPerformance.map((item) => (
                    <tr key={item.cashier}>
                      <td>{item.cashier}</td>
                      <td>{item.sales}</td>
                      <td>{item.transactions}</td>
                      <td>{item.avg}</td>
                      <td>{item.refunds}</td>
                      <td>{item.voids}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="txn-bottom-link">
                View All Cashier Performance
              </button>
            </article>

            <article className="txn-card txn-flagged-card">
              <div className="txn-card-heading">
                <h2>Flagged Activities</h2>
                <button className="txn-view-all">View All</button>
              </div>

              <div className="txn-flagged-list">
                {flaggedActivities.map((item) => (
                  <div className="txn-flagged-item" key={item.title}>
                    <span className="txn-alert-icon">
                      <AlertTriangle size={14} />
                    </span>

                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>

                    <button>Review</button>
                  </div>
                ))}
              </div>

              <button className="txn-bottom-link">
                View All Flagged Activities
              </button>
            </article>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="txn-right-column">
          {/* HIGHLIGHTS */}
          <article className="txn-card txn-highlights-card">
            <div className="txn-card-heading">
              <h2>Transaction Highlights</h2>
              <button className="txn-view-all">View Report</button>
            </div>

            <div className="txn-highlights-grid">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="txn-highlight-item" key={item.title}>
                    <span className={`txn-highlight-icon ${item.theme}`}>
                      <Icon size={17} />
                    </span>

                    <div>
                      <span>{item.title}</span>
                      <strong>{item.main}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* ACTIVITY CLIPS */}
          <article className="txn-card txn-clips-card">
            <div className="txn-card-heading">
              <h2>Recent Activity Clips</h2>
              <button className="txn-view-all">View All</button>
            </div>

            <div className="txn-clips-list">
              {activityClips.map((clip) => (
                <div className="txn-clip-item" key={clip.title}>
                  <div className="txn-video-placeholder">
                    {/* Replace with your surveillance thumbnail */}
                    <button>
                      <Play size={15} fill="currentColor" />
                    </button>

                    <span>{clip.duration}</span>
                  </div>

                  <div>
                    <strong>{clip.title}</strong>

                    <span>
                      {clip.user} • {clip.register}
                    </span>

                    <small>
                      {clip.time} • {clip.date}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <button className="txn-view-all-clips">
              View All Clips
            </button>
          </article>
        </aside>
      </section>
    </main>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <label className="txn-select">
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

function TransactionType({ type }) {
  const cls = type.toLowerCase();

  return <span className={`txn-type ${cls}`}>{type}</span>;
}