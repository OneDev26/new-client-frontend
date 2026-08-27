import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Gift,
  Info,
  Store,
  Users,
  ShieldCheck,
} from "lucide-react";

import "../CSS/ReferralPage.css";
import referralGift from "../assets/Refer_Earn.png";
import referralEmpty from "../assets/Refer_earn2.png";

const bestDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const preferredTimes = [
  "Morning",
  "Afternoon",
  "Evening",
  "Any Time",
];

export default function ReferralPage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    preferredTime: "",
    bestDay: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Referral Form Data:", form);

    // Later you can replace this with your API
    // await axios.post("/api/referrals", form);
  };

  return (
    <main className="referral-page">
      {/* TOP BANNER */}
      <section className="referral-hero">
        <div className="referral-hero-left">
          <div className="referral-gift-image">
            <img
              src={referralGift}
              alt=""
            />
          </div>

          <div className="referral-hero-copy">
            <h1>Refer. They Protect. You Earn!</h1>

            <p>
              When your referred business becomes a Survill customer
              and their store goes live, you'll get 1 month free
              monitoring for any store.
            </p>
          </div>
        </div>

        <div className="referral-how-it-works">
          <h3>How it works</h3>

          <div className="referral-steps">
            <ReferralStep
              icon={Users}
              title="Refer a friend"
              theme="purple"
            />

            <ArrowRight
              size={15}
              className="referral-step-arrow"
            />

            <ReferralStep
              icon={Store}
              title="They become a customer"
              theme="green"
            />

            <ArrowRight
              size={15}
              className="referral-step-arrow"
            />

            <ReferralStep
              icon={CheckCircle2}
              title="Store goes live"
              theme="green"
            />

            <ArrowRight
              size={15}
              className="referral-step-arrow"
            />

            <ReferralStep
              icon={Gift}
              title="You get 1 month free monitoring"
              theme="purple"
            />
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="referral-layout">
        {/* LEFT FORM */}
        <form
          className="referral-card referral-form-card"
          onSubmit={handleSubmit}
        >
          <div className="referral-section-header">
            <h2>Refer Business Details</h2>

            <p>
              Enter your friend's business and contact details. Our
              team will reach out to them.
            </p>
          </div>

          <div className="referral-form-grid one">
            <Field
              label="Business / Store Name"
              required
            >
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Enter business or store name"
              />
            </Field>
          </div>

          <div className="referral-form-grid one">
            <Field
              label="Contact Person Name"
              required
            >
              <input
                type="text"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Field>
          </div>

          <div className="referral-form-grid two">
            <Field
              label="Phone Number"
              required
            >
              <div className="referral-phone-field">
                <button
                  type="button"
                  className="referral-country-code"
                >
                  <span>🇺🇸</span>
                  <span>+1</span>
                  <ChevronDown size={12} />
                </button>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </Field>

            <Field label="Email Address (Optional)">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </Field>
          </div>

          <div className="referral-form-grid two">
            <Field label="Preferred Call Time (Optional)">
              <SelectBox
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                placeholder="Select preferred time"
                options={preferredTimes}
              />
            </Field>

            <Field label="Best Day to Contact (Optional)">
              <SelectBox
                name="bestDay"
                value={form.bestDay}
                onChange={handleChange}
                placeholder="Select day"
                options={bestDays}
              />
            </Field>
          </div>

          <div className="referral-form-grid one">
            <Field label="Additional Notes (Optional)">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional information about this business"
              />
            </Field>
          </div>

          <div className="referral-info-note">
            <Info size={14} />

            <span>
              Once the referred store is live and monitoring, you'll
              be eligible to claim your 1 month free monitoring.
            </span>
          </div>

          <div className="referral-form-actions">
            <button
              type="button"
              className="referral-cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="referral-submit-btn"
            >
              Submit Referral
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* RIGHT */}
        <aside className="referral-sidebar">
          {/* BENEFITS */}
          <article className="referral-card referral-benefits-card">
            <h2>Your Referral Benefits</h2>

            <div className="referral-benefit-highlight">
              <div>
                <strong>Earn 1 Month Free Monitoring</strong>

                <p>
                  Get 1 month of free monitoring for any of your
                  active stores when your referred business goes live
                  with Survill.
                </p>
              </div>

              <span>
                <ShieldCheck size={34} />
              </span>
            </div>

            <div className="referral-benefit-list">
              <h3>Benefit Highlights</h3>

              <BenefitItem>
                Valid for any one of your active stores
              </BenefitItem>

              <BenefitItem>
                Automatically available once the referred store is live
              </BenefitItem>

              <BenefitItem>
                No limits – refer more, earn more
              </BenefitItem>
            </div>
          </article>

          {/* PREVIOUS REFERRALS */}
          <article className="referral-card previous-referrals-card">
            <h2>Previous Referrals</h2>

            <div className="previous-referral-empty">
              <div className="previous-referral-image">
                <img
                  src={referralEmpty}
                  alt=""
                />
              </div>

              <strong>
                You haven't made any referrals yet.
              </strong>

              <p>
                Start referring and earn exciting rewards!
              </p>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}

function ReferralStep({ icon: Icon, title, theme }) {
  return (
    <div className="referral-step">
      <span className={`referral-step-icon ${theme}`}>
        <Icon size={18} />
      </span>

      <small>{title}</small>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="referral-field">
      <span>
        {label}
        {required && <b>*</b>}
      </span>

      {children}
    </label>
  );
}

function SelectBox({
  name,
  value,
  onChange,
  placeholder,
  options,
}) {
  return (
    <div className="referral-select">
      <select
        name={name}
        value={value}
        onChange={onChange}
      >
        <option
          value=""
          disabled
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            value={option}
            key={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown size={12} />
    </div>
  );
}

function BenefitItem({ children }) {
  return (
    <div className="referral-benefit-item">
      <Check size={11} />
      <span>{children}</span>
    </div>
  );
}