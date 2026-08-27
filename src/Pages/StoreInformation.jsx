import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  GitCompare,
  ChevronDown,
  Clock3,
  Headphones,
  House,
  Monitor,
  Pencil,
  UserRound,
  UsersRound,
  CircleHelp,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import "../CSS/StoreInformation.css";
import AddStoreImg from '../assets/Add_store_img.png'

const states = [
  "California",
  "Texas",
  "Florida",
  "New York",
  "Illinois",
  "Washington",
];

const timeZones = [
  "Eastern Time (ET)",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "Pacific Time (PT)",
];

const storeTypes = [
  "Convenience Store",
  "Gas Station",
  "Grocery Store",
  "Liquor Store",
  "Retail Store",
];

const businessCategories = [
  "Retail",
  "Fuel & Convenience",
  "Grocery",
  "Food & Beverage",
  "Pharmacy",
];

const designations = [
  "Owner",
  "Manager",
  "Store Manager",
  "Operations Manager",
  "Authorized Representative",
];

const days = [
  "Monday - Friday",
  "Monday - Saturday",
  "Every Day",
  "Custom Schedule",
];


const surveillancePackages = [
  { id: "starter", name: "Starter", subtitle: "Essential Protection", price: "$49", cameras: "4 HD Cameras", features: ["24/7 Recording", "Mobile App Access", "Instant Alerts", "30 Days Cloud Storage"] },
  { id: "business", name: "Business", subtitle: "Advanced Protection", price: "$89", cameras: "8 HD Cameras", popular: true, features: ["AI Motion Detection", "24/7 Recording", "Mobile App Access", "Instant Alerts", "30 Days Cloud Storage"] },
  { id: "enterprise", name: "Enterprise", subtitle: "Complete Protection", price: "$149", cameras: "16+ HD Cameras", features: ["AI Analytics & People Counting", "24/7 Recording", "Mobile App Access", "Instant Alerts", "90 Days Cloud Storage", "Priority Support"] },
];

const includedFeatures = [
  "High quality HD cameras", "AI powered detection", "Remote live view & playback",
  "Cloud video storage", "Email & push notifications", "Professional installation", "3 Year Warranty",
];
const packageFeatures = [
  {
    title: "24/7 Store Monitoring",
    subtitle: "Round-the-clock surveillance and alerts",
    icon: House,
  },
  {
    title: "HD Camera Recording",
    subtitle: "High quality video with secure cloud storage",
    icon: Camera,
  },
  {
    title: "AI Powered Analytics",
    subtitle: "Smart detection and loss prevention",
    icon: Sparkles,
  },
  {
    title: "Live View Access",
    subtitle: "Access your store from anywhere anytime",
    icon: Monitor,
  },
  {
    title: "Instant Alerts",
    subtitle: "Real-time notifications on incidents",
    icon: Bell,
  },
];

export default function StoreInformation() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("business");
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    storeType: "",
    category: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    timezone: "",
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    openingTime: "09:00 AM",
    closingTime: "09:00 PM",
    daysOpen: "",
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

    console.log("Store Information", form);
    setActiveStep(2);

    // Later:
    // await axios.post("/api/store", form);
  };

  return (
    <main className={"store-info-page " + (activeStep > 1 ? "package-page-active" : "")}>
      <header className="store-mobile-header">
        <button type="button" onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : navigate(-1)} aria-label="Go back"><ArrowLeft size={19} /></button>
        <div><h1>Add New Store</h1><p>Add a new store to start monitoring.</p></div>
        <span />
      </header>
      <div className="store-info-layout">
        {/* LEFT */}
        <form
          className={"store-info-main-card " + (activeStep > 1 ? "non-form-step-active" : "")}
          onSubmit={handleSubmit}
        >
          {/* STEP HEADER */}
          <div className="store-progress">
            <Step
              number="1"
              title="Store Information"
              subtitle="Enter store details"
              active={activeStep === 1}
              onClick={() => setActiveStep(1)}
            />

            <div className="store-step-line" />

            <Step
              number="2"
              title="Package Selection"
              subtitle="Choose a package"
              active={activeStep === 2}
              onClick={() => setActiveStep(2)}
            />

            <div className="store-step-line" />

            <Step
              number="3"
              title="Review & Confirm"
              subtitle="Confirm and save"
              active={activeStep === 3}
              onClick={() => setActiveStep(3)}
            />
          </div>

          <div className="store-divider" />

          {activeStep === 2 && (
            <PackageSelection
              selectedPackage={selectedPackage}
              onSelect={setSelectedPackage}
              onBack={() => setActiveStep(1)}
              onContinue={() => setActiveStep(3)}
            />
          )}

          {activeStep === 3 && (
            <ReviewConfirm
              form={form}
              selectedPackage={selectedPackage}
              onEditStore={() => setActiveStep(1)}
              onEditPackage={() => setActiveStep(2)}
              onBack={() => setActiveStep(2)}
              onConfirm={() => setShowSuccess(true)}
            />
          )}

          {/* STORE INFORMATION */}
          <section className="store-form-section">
            <div className="store-section-heading">
              <h2>Store Information</h2>
              <p>Enter your store details. All fields are required.</p>
            </div>

            <div className="store-form-grid three">
              <Field
                label="Store Name"
                required
              >
                <input
                  type="text"
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  placeholder="Enter store name"
                />
              </Field>

              <Field
                label="Store Type"
                required
              >
                <Select
                  name="storeType"
                  value={form.storeType}
                  onChange={handleChange}
                  placeholder="Select store type"
                  options={storeTypes}
                />
              </Field>

              <Field
                label="Business Category"
                required
              >
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  options={businessCategories}
                />
              </Field>
            </div>

            <div className="store-form-grid one">
              <Field
                label="Store Address"
                required
              >
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </Field>
            </div>

            <div className="store-form-grid one">
              <Field label="Address Line 2 (Optional)">
                <input
                  type="text"
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Suite, floor, unit, etc."
                />
              </Field>
            </div>

            <div className="store-form-grid three">
              <Field
                label="City"
                required
              >
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </Field>

              <Field
                label="State"
                required
              >
                <Select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Select state"
                  options={states}
                />
              </Field>

              <Field
                label="ZIP Code"
                required
              >
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="Enter ZIP code"
                />
              </Field>
            </div>

            <div className="store-form-grid two">
              <Field
                label="Country"
                required
              >
                <Select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  options={["United States"]}
                />
              </Field>

              <Field
                label="Time Zone"
                required
              >
                <Select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  placeholder="Select time zone"
                  options={timeZones}
                />
              </Field>
            </div>
          </section>

          <div className="store-divider" />

          {/* CONTACT */}
          <section className="store-form-section">
            <div className="store-section-heading">
              <h2>Contact Person</h2>
              <p>Add the primary contact person for this store.</p>
            </div>

            <div className="store-form-grid two">
              <Field
                label="Full Name"
                required
              >
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </Field>

              <Field
                label="Email Address"
                required
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </Field>

              <Field
                label="Phone Number"
                required
              >
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(xxx) xxx-xxxx"
                />
              </Field>

              <Field
                label="Designation"
                required
              >
                <Select
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Select designation"
                  options={designations}
                />
              </Field>
            </div>
          </section>

          <div className="store-divider" />

          {/* OPERATING HOURS */}
          <section className="store-form-section store-hours-section">
            <div className="store-section-heading">
              <h2>Store Operating Hours</h2>
              <p>Set the regular operating hours for this store.</p>
            </div>

            <div className="store-form-grid three">
              <Field
                label="Opening Time"
                required
              >
                <div className="store-icon-input">
                  <Clock3 size={14} />

                  <input
                    type="text"
                    name="openingTime"
                    value={form.openingTime}
                    onChange={handleChange}
                  />

                  <ChevronDown size={13} />
                </div>
              </Field>

              <Field
                label="Closing Time"
                required
              >
                <div className="store-icon-input">
                  <Clock3 size={14} />

                  <input
                    type="text"
                    name="closingTime"
                    value={form.closingTime}
                    onChange={handleChange}
                  />

                  <ChevronDown size={13} />
                </div>
              </Field>

              <Field
                label="Days Open"
                required
              >
                <Select
                  name="daysOpen"
                  value={form.daysOpen}
                  onChange={handleChange}
                  placeholder="Select days"
                  options={days}
                />
              </Field>
            </div>
          </section>

          <div className="store-form-footer">
            <button
              type="submit"
              className="store-save-btn"
            >
              Save & Continue
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* RIGHT */}
        <aside className="store-info-sidebar">
          <article className="store-package-summary">
            <h2>Package Summary</h2>

            <p className="package-summary-desc">
              You can select your package in the next step.
            </p>

            <div className="package-image-slot">
              <img
                src={AddStoreImg}
                alt=""
              />
            </div>

            <div className="package-feature-list">
              {packageFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    className="package-feature"
                    key={feature.title}
                  >
                    <span>
                      <Icon size={15} />
                    </span>

                    <div>
                      <strong>{feature.title}</strong>
                      <small>{feature.subtitle}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="store-help-card">
            <h2>Need Help?</h2>

            <p>
              Our team is here to help you choose the perfect package for your
              store.
            </p>

            <button type="button">
              <Headphones size={15} />
              Contact Support
            </button>
          </article>
        </aside>
      </div>

      {showSuccess && (
        <div
          className="store-success-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSuccess(false);
          }}
        >
          <section className="store-success-modal" role="dialog" aria-modal="true" aria-labelledby="store-success-title">
            <button type="button" className="store-success-close" onClick={() => setShowSuccess(false)} aria-label="Close">
              <X size={18} />
            </button>
            <span className="store-success-icon"><CheckCircle2 size={48} /></span>
            <h2 id="store-success-title">Request Submitted!</h2>
            <p>Thank you for adding your store. We have received your request successfully.</p>
            <div className="store-success-contact"><Headphones size={28} /><div><strong>Our representative will contact you shortly!</strong><span>Our team will review your request and get in touch with you soon to help you get started.</span></div></div>
            <div className="store-success-meta"><div><CalendarDays size={18} /><span>Request ID<strong>STR-2025-05-20-1001</strong></span></div><div><Clock3 size={18} /><span>Submitted On<strong>May 20, 2025 - 10:30 AM</strong></span></div></div>
            <div className="store-success-safe"><ShieldCheck size={23} /><span>Your information is safe with us and we'll keep you updated throughout the process.</span></div>
            <button type="button" className="store-success-done" onClick={() => setShowSuccess(false)}>Got It</button>
          </section>
        </div>
      )}
    </main>
  );
}

function Step({ number, title, subtitle, active = false, onClick }) {
  return (
    <button type="button" className={"store-step " + (active ? "active" : "")} onClick={onClick}>
      <span className="store-step-number">{number}</span>
      <span><strong>{title}</strong><small>{subtitle}</small></span>
    </button>
  );
}

function PackageSelection({ selectedPackage, onSelect, onBack, onContinue }) {
  return (
    <section className="store-package-step">
      <div className="package-step-heading">
        <div><h2>Select a Surveillance Package</h2><p>All packages include professional installation and 24/7 support.</p></div>
        <button type="button" className="compare-packages-btn"><GitCompare size={15} />Compare Packages</button>
      </div>
      <div className="mobile-monitoring-plans">
        <div className="mobile-plan-heading"><span><ShieldCheck size={22} /></span><div><h2>Select Monitoring Plan</h2><p>Choose the monitoring plan that best fits your store.</p></div></div>
        {[
          { id: "business", name: "Shared Plan", copy: "For stores monitored by one person along with multiple other stores.", note: "One monitoring representative handles multiple stores.", icon: UserRound, recommended: true },
          { id: "starter", name: "Semi-Dedicated Plan", copy: "Two stores are monitored by one dedicated representative.", note: "One representative monitors two stores.", icon: UsersRound },
          { id: "enterprise", name: "Dedicated Plan", copy: "One store is monitored by one dedicated representative.", note: "One representative focused on your store only.", icon: UserRound },
        ].map((plan) => {
          const PlanIcon = plan.icon;
          const selected = selectedPackage === plan.id;
          return <button type="button" className={"mobile-plan-card " + (selected ? "selected" : "")} key={plan.id} onClick={() => onSelect(plan.id)}>
            <span className="mobile-plan-radio">{selected && <span />}</span>
            <span className="mobile-plan-icon"><PlanIcon size={22} /></span>
            <span className="mobile-plan-copy"><strong>{plan.name}{plan.recommended && <em>Recommended</em>}</strong><small>{plan.copy}</small><b><UsersRound size={14} />{plan.note}</b></span>
          </button>;
        })}
        <div className="mobile-plan-help"><CircleHelp size={20} /><div><strong>Need Help Choosing?</strong><small>Our team can help you choose the right plan for your business.</small></div><button type="button">Contact Us</button></div>
      </div>      <div className="package-selection-layout">
        <div className="package-options-grid">
          {surveillancePackages.map((item) => {
            const selected = selectedPackage === item.id;
            return (
              <article className={"package-option-card " + (selected ? "selected" : "")} key={item.id}>
                {item.popular && <span className="package-popular-badge">Most Popular</span>}
                <h3>{item.name}</h3><p>{item.subtitle}</p>
                <div className="package-price"><strong>{item.price}</strong><span>/month</span></div>
                <small>Billed annually</small>
                <ul><li><Check size={13} />{item.cameras}</li>{item.features.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
                <button type="button" onClick={() => onSelect(item.id)}>{selected ? <>Selected <Check size={14} /></> : "Select Package"}</button>
              </article>
            );
          })}
        </div>
        <aside className="package-includes-card">
          <h3>Business Package Includes</h3>
          <ul>{includedFeatures.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}</ul>
        </aside>
      </div>
      <div className="package-step-footer">
        <button type="button" className="package-back-btn" onClick={onBack}><ArrowLeft size={14} />Back</button>
        <button type="button" className="package-continue-btn" onClick={onContinue}>Continue<ArrowRight size={14} /></button>
      </div>
    </section>
  );
}
function ReviewConfirm({ form, selectedPackage, onEditStore, onEditPackage, onBack, onConfirm }) {
  const packageItem = surveillancePackages.find((item) => item.id === selectedPackage) || surveillancePackages[1];
  const monthlyPrice = Number(packageItem.price.replace("$", ""));
  const annualTotal = monthlyPrice * 12;
  const display = (value, fallback = "Not provided") => value || fallback;

  return (
    <section className="store-review-step">
      <div className="review-layout">
        <div className="review-left-column">
          <article className="review-card">
            <div className="review-card-heading">
              <h2>Review Store Details</h2>
              <button type="button" onClick={onEditStore}><Pencil size={13} />Edit</button>
            </div>
            <dl className="review-details-grid">
              <div><dt>Store Name</dt><dd>{display(form.storeName)}</dd></div>
              <div><dt>Email Address</dt><dd>{display(form.email)}</dd></div>
              <div><dt>Store Type</dt><dd>{display(form.storeType)}</dd></div>
              <div><dt>Operating Hours</dt><dd>{form.openingTime} - {form.closingTime}<small>{display(form.daysOpen)}</small></dd></div>
              <div><dt>Business Category</dt><dd>{display(form.category)}</dd></div>
              <div><dt>Time Zone</dt><dd>{display(form.timezone)}</dd></div>
              <div><dt>Address</dt><dd>{display(form.address)}<small>{[form.city, form.state, form.zip].filter(Boolean).join(", ") || "Location not provided"}</small></dd></div>
              <div><dt>Contact Person</dt><dd>{display(form.fullName)}<small>{display(form.phone)}</small></dd></div>
            </dl>
          </article>

          <article className="review-card review-package-card">
            <div className="review-card-heading">
              <h2>Review Package Details</h2>
              <button type="button" onClick={onEditPackage}><Pencil size={13} />Edit</button>
            </div>
            <div className="review-package-summary">
              <span className="review-package-icon"><Camera size={20} /></span>
              <div><strong>{packageItem.name} Package</strong><small>{packageItem.subtitle}</small></div>
              <div className="review-package-price"><strong>{packageItem.price}</strong><span>/month</span><small>Billed annually</small></div>
            </div>
            <ul className="review-feature-grid">
              <li><Check size={13} />{packageItem.cameras}</li>
              {packageItem.features.map((feature) => <li key={feature}><Check size={13} />{feature}</li>)}
              <li><Check size={13} />Professional Installation</li>
              <li><Check size={13} />3 Year Warranty</li>
            </ul>
          </article>
        </div>

        <aside className="review-order-column">
          <article className="review-card review-order-card">
            <h2>Order Summary</h2>
            <div><span>{packageItem.name} Package</span><strong>{packageItem.price}.00 <small>/month</small></strong></div>
            <div><span>Setup & Installation</span><strong>$0.00</strong></div>
            <div className="review-order-spacer" />
            <div><span>Annual Billing</span><strong>{"$" + annualTotal.toLocaleString() + ".00"}</strong></div>
            <div><span>Tax (0%)</span><strong>$0.00</strong></div>
            <div className="review-total"><span>Total (Annual)</span><strong>{"$" + annualTotal.toLocaleString() + ".00"}</strong></div>
            <p>You will be billed annually.</p>
          </article>
          <div className="review-agreement"><span><ShieldCheck size={18} /></span><p>By confirming, you agree to our <strong>Terms of Service</strong> and <strong>3 Year Service Agreement.</strong></p></div>
        </aside>
      </div>

      <div className="package-step-footer review-footer">
        <button type="button" className="package-back-btn" onClick={onBack}><ArrowLeft size={14} />Back</button>
        <button type="button" className="package-continue-btn" onClick={onConfirm}>Confirm & Save<ArrowRight size={14} /></button>
      </div>
    </section>
  );
}
function Field({ label, required, children }) {
  return (
    <label className="store-field">
      <span>
        {label}
        {required && <b>*</b>}
      </span>

      {children}
    </label>
  );
}

function Select({
  name,
  value,
  onChange,
  placeholder,
  options,
}) {
  return (
    <div className="store-select-wrap">
      <select
        name={name}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            value={option}
            key={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown size={13} />
    </div>
  );
}