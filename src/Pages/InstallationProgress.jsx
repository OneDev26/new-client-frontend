import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Box,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Headphones,
  ImageUp,
  LayoutGrid,
  PlayCircle,
  PackageCheck,
  Store,
  UploadCloud,
  UserRoundCog,
  Wrench,
  ClipboardCheck,
  Rocket,
} from "lucide-react";

import "../CSS/InstallationProgress.css";
import installationStoreImage from "../assets/Dashboard_store.png";

const installationSteps = [
  {
    id: 1,
    title: "Store Information Confirmed",
    description: "Store details and contact information have been confirmed.",
    status: "completed",
    date: "May 15, 2025 10:30 AM",
  },
  {
    id: 2,
    title: "Videos Shared",
    description: "Store videos / walk-through have been shared.",
    status: "completed",
    date: "May 15, 2025 02:15 PM",
  },
  {
    id: 3,
    title: "Layout Created & Confirmed",
    description: "Store layout has been created and confirmed.",
    status: "completed",
    date: "May 18, 2025 11:20 AM",
  },
  {
    id: 4,
    title: "Shipment Process",
    description: "Equipment has been shipped to the store.",
    status: "completed",
    date: "May 20, 2025 09:45 AM",
  },
  {
    id: 5,
    title: "Items Received by Store",
    description:
      "Please share pictures of all received items and confirm the drop date.",
    status: "current",
  },
  {
    id: 6,
    title: "Installation Schedule",
    description:
      "We will schedule the installation. You will receive an email confirmation.",
    status: "upcoming",
    icon: CalendarDays,
  },
  {
    id: 7,
    title: "Technician Visit",
    description: "Technician will visit the store for installation.",
    status: "upcoming",
    icon: UserRoundCog,
  },
  {
    id: 8,
    title: "Installation Status",
    description: "Installation in progress. Any issues will be updated here.",
    status: "upcoming",
    icon: Wrench,
  },
  {
    id: 9,
    title: "Site Go Live",
    description:
      "Installation complete and store is live. Monitoring will start.",
    status: "upcoming",
    icon: Store,
  },
];

export default function InstallationProgress() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [dropDate, setDropDate] = useState("2025-05-21");
  const [files, setFiles] = useState([]);
  const [mobileStep, setMobileStep] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);

  const handleFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles || []);

    setFiles((current) => [...current, ...incoming]);
  };

  const handleSubmit = () => {
    console.log({
      dropDate,
      files,
    });

    // Later:
    // const formData = new FormData();
    // formData.append("dropDate", dropDate);
    // files.forEach(file => formData.append("images", file));
    // await axios.post("/api/installation/items-received", formData);
  };

  return (
    <main className="installation-page">
      <section className="installation-mobile-flow">
        {mobileStep === 0 ? (
          <MobileInstallationOverview onOpenStep={setMobileStep} onBack={() => navigate(-1)} />
        ) : (
          <MobileInstallationStep
            stepNumber={mobileStep}
            dropDate={dropDate}
            setDropDate={setDropDate}
            fileRef={fileRef}
            files={files}
            handleFiles={handleFiles}
            onBack={() => setMobileStep(mobileStep === 1 ? 0 : mobileStep - 1)}
            onNext={() => setMobileStep((current) => Math.min(9, current + 1))}
            onOverview={() => setMobileStep(0)}
            onDashboard={() => navigate("/dashboard")}
          />
        )}
      </section>

      {/* TOP PROJECT STRIP */}
      <section className="installation-project-strip">
        <div className="project-store-block">
          <div className="project-store-image">
            {/* Add your store image here */}
            <img
              src={installationStoreImage}
              alt=""
            />
          </div>

          <div>
            <div className="project-store-title">
              <h2>Downtown Market</h2>

              <span>In Progress</span>
            </div>

            <p>123 Main Street, New York, NY 10001</p>
          </div>
        </div>

        <ProjectMeta
          label="Project ID"
          value="PRJ-78542"
        />

        <ProjectMeta
          label="Onboarded On"
          value="May 15, 2025"
        />

        <ProjectMeta
          label="Expected Go Live"
          value="Jun 10, 2025"
        />

        <button
          type="button"
          className="view-store-btn"
        >
          View Store
          <ChevronRight size={14} />
        </button>
      </section>

      {/* MAIN BODY */}
      <section className="installation-layout">
        {/* LEFT */}
        <section className="installation-progress-card">
          <h2 className="installation-title">
            Installation Progress
          </h2>

          <div className="installation-timeline">
            {installationSteps.map((step, index) => (
              <InstallationStep
                step={step}
                key={step.id}
                last={index === installationSteps.length - 1}
                expanded={expandedStep === step.id}
                onToggle={() => setExpandedStep((current) => current === step.id ? null : step.id)}
              />
            ))}
          </div>

          <div className="installation-email-note">
            <CircleHelp size={15} />

            <span>
              You will receive email notifications at each step of the
              process.
            </span>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="installation-sidebar">
          {/* CURRENT DETAILS */}
          <article className="installation-side-card current-step-card">
            <div className="installation-side-heading">
              <span>
                <PackageCheck size={16} />
              </span>

              <h2>Current Step Details</h2>
            </div>

            <h3>Items Received by Store</h3>

            <p className="current-step-description">
              Please upload clear pictures of all items you have
              received.
            </p>

            <label className="installation-field">
              <span>Drop Date</span>

              <div className="installation-date-field">
                <input
                  type="date"
                  value={dropDate}
                  onChange={(event) =>
                    setDropDate(event.target.value)
                  }
                />

                <CalendarDays size={14} />
              </div>
            </label>

            <div className="installation-upload-label">
              Upload Received Items
            </div>

            <button
              type="button"
              className="installation-dropzone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleFiles(event.dataTransfer.files);
              }}
            >
              <UploadCloud size={25} />

              <strong>
                Click to upload or drag & drop
              </strong>

              <small>JPG, PNG up to 10MB</small>

              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/png,image/jpeg"
                hidden
                onChange={(event) =>
                  handleFiles(event.target.files)
                }
              />
            </button>

            {files.length > 0 && (
              <div className="installation-selected-files">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`}>
                    <ImageUp size={12} />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="installation-submit-btn"
              disabled={!dropDate || files.length === 0}
              onClick={handleSubmit}
            >
              Submit & Continue
            </button>
          </article>

          {/* HELP */}
          <article className="installation-side-card installation-help-card">
            <div className="installation-help-top">
              <span>
                <Headphones size={18} />
              </span>

              <div>
                <h2>Need Help?</h2>

                <p>
                  If you have any questions or face any issues, our
                  support team is here to help.
                </p>
              </div>
            </div>

            <button type="button">
              Contact Support
            </button>
          </article>

          {/* PROJECT SUMMARY */}
          <article className="installation-side-card project-summary-card">
            <h2>Project Summary</h2>

            <div className="project-summary-list">
              <SummaryRow
                label="Project ID"
                value="PRJ-78542"
              />

              <SummaryRow
                label="Store Name"
                value="Downtown Market"
              />

              <SummaryRow
                label="Onboarded On"
                value="May 15, 2025"
              />

              <SummaryRow
                label="Expected Go Live"
                value="Jun 10, 2025"
              />

              <SummaryRow
                label="Project Owner"
                value="Survill Team"
              />
            </div>

            <button
              type="button"
              className="view-requests-btn"
            >
              View All Requests
            </button>
          </article>
        </aside>
      </section>
    </main>
  );
}

function getMobileStepIcon(stepNumber) {
  const icons = {
    1: Store,
    2: PlayCircle,
    3: LayoutGrid,
    4: Box,
    5: PackageCheck,
    6: CalendarDays,
    7: UserRoundCog,
    8: ClipboardCheck,
    9: Store,
  };
  return icons[stepNumber] || Wrench;
}

function MobileInstallationOverview({ onOpenStep, onBack }) {
  const completedCount = installationSteps.filter((step) => step.status === "completed").length;

  return (
    <div className="mobile-install-overview">
      <header className="mobile-install-header">
        <button type="button" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <h1>Installation Progress</h1>
        <Bell size={18} />
      </header>

      <article className="mobile-install-store-card">
        <img src={installationStoreImage} alt="Downtown Market" />
        <div><strong>Downtown Market</strong><small>123 Main Street, New York, NY 10001</small><em>In Progress</em></div>
      </article>

      <section className="mobile-overall-progress">
        <h2>Overall Progress</h2>
        <div className="mobile-progress-ring"><strong>{completedCount}</strong><span>of 9</span><small>Steps Complete</small></div>
      </section>

      <div className="mobile-install-step-list">
        {installationSteps.map((step) => {
          const Icon = getMobileStepIcon(step.id);
          return (
            <button type="button" key={step.id} onClick={() => onOpenStep(step.id)}>
              <span className={"mobile-list-icon " + step.status}>{step.status === "completed" ? <Check size={13} /> : <Icon size={14} />}</span>
              <div><strong>{step.title.replace(" Confirmed", "")}</strong></div>
              <em className={step.status}>{step.status === "current" ? "Pending" : step.status === "completed" ? "Completed" : "Upcoming"}</em>
              <ChevronRight size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileInstallationStep({
  stepNumber, dropDate, setDropDate, fileRef, files, handleFiles, onBack, onNext, onOverview, onDashboard,
}) {
  const step = installationSteps[stepNumber - 1];
  const Icon = getMobileStepIcon(stepNumber);
  const isComplete = stepNumber <= 4;
  const isFinal = stepNumber === 9;

  return (
    <div className={"mobile-install-detail step-" + stepNumber}>
      <header className="mobile-install-header">
        <button type="button" onClick={onBack} aria-label="Previous step"><ArrowLeft size={18} /></button>
        <h1>Step {stepNumber} of 9</h1>
        <span />
      </header>

      <section className="mobile-step-intro">
        <span><Icon size={26} /></span>
        <h2>{step.title}</h2>
        <p>{step.description}</p>
      </section>

      <MobileStepDetails
        stepNumber={stepNumber}
        dropDate={dropDate}
        setDropDate={setDropDate}
        fileRef={fileRef}
        files={files}
        handleFiles={handleFiles}
      />

      {isFinal && (
        <div className="mobile-go-live-note">
          <Check size={18} />
          <div><strong>Monitoring is Active</strong><small>24/7 monitoring enabled</small></div>
        </div>
      )}

      <div className="mobile-step-actions">
        <button type="button" className={isComplete || isFinal ? "completed" : "pending"} onClick={isFinal ? onDashboard : undefined}>
          {isFinal ? "Go to Dashboard" : isComplete ? "Completed" : stepNumber === 5 ? "Upload Photos" : stepNumber === 6 ? "View Schedule" : stepNumber === 7 ? "Reschedule" : "View Details"}
          {isComplete && <Check size={14} />}
        </button>
        {!isFinal && <button type="button" className="mobile-next-step" onClick={onNext}>Next Step <ChevronRight size={14} /></button>}
        {isFinal && <button type="button" className="mobile-next-step" onClick={onOverview}>View Progress</button>}
      </div>
    </div>
  );
}

function MobileStepDetails({ stepNumber, dropDate, setDropDate, fileRef, files, handleFiles }) {
  if (stepNumber === 1) {
    return <article className="mobile-step-detail-card"><h3>Store Details</h3><DetailRow label="Store Name" value="Downtown Market" /><DetailRow label="Address" value="123 Main Street, New York, NY 10001" /><DetailRow label="Confirmed On" value="May 15, 2025 10:30 AM" /></article>;
  }

  if (stepNumber === 2) {
    return <article className="mobile-step-detail-card"><h3>Videos Received</h3>{["Store Front", "Walk-through", "Back Area", "Register Area"].map((item) => <DetailCheck key={item} text={item} />)}<DetailRow label="Confirmed On" value="May 15, 2025 02:15 PM" /></article>;
  }

  if (stepNumber === 3) {
    return <article className="mobile-step-detail-card"><h3>Layout Summary</h3><div className="mobile-layout-preview"><LayoutGrid size={54} /></div><DetailRow label="Confirmed On" value="May 18, 2025 11:20 AM" /></article>;
  }

  if (stepNumber === 4) {
    return <article className="mobile-step-detail-card"><h3>Tracking Details</h3><DetailRow label="Tracking ID" value="123934A103245678" /><DetailRow label="Carrier" value="FedEx" /><DetailRow label="Shipped On" value="May 20, 2025 09:45 AM" /></article>;
  }

  if (stepNumber === 5) {
    return (
      <article className="mobile-step-detail-card mobile-received-card">
        <label>Drop Date<input type="date" value={dropDate} onChange={(event) => setDropDate(event.target.value)} /></label>
        <span>Upload Photos</span>
        <button type="button" className="mobile-upload-box" onClick={() => fileRef.current?.click()}>
          <UploadCloud size={25} /><strong>Tap to upload or drag & drop</strong><small>JPG, PNG up to 10MB</small>
          <input ref={fileRef} type="file" multiple accept="image/png,image/jpeg" hidden onChange={(event) => handleFiles(event.target.files)} />
        </button>
        {files.length > 0 && <small>{files.length} file(s) selected</small>}
      </article>
    );
  }

  if (stepNumber === 6) {
    return <article className="mobile-step-detail-card"><h3>Schedule Status <em>Upcoming</em></h3><DetailRow label="Expected Date" value="May 28, 2025" /><DetailRow label="Time Window" value="10:00 AM - 02:00 PM" /><p className="mobile-info-note">You will receive an email confirmation once the schedule is finalized.</p></article>;
  }

  if (stepNumber === 7) {
    return <article className="mobile-step-detail-card"><h3>Visit Status <em>Upcoming</em></h3><DetailRow label="Visit Type" value="Installation" /><DetailRow label="Expected Date" value="May 28, 2025" /><DetailRow label="Time Window" value="10:00 AM - 02:00 PM" /></article>;
  }

  if (stepNumber === 8) {
    return <article className="mobile-step-detail-card"><h3>Installation progress</h3>{["Technician Arrived", "Equipment Installed", "Testing In Progress", "System Configuration", "Final Checklist"].map((item, index) => <DetailCheck key={item} text={item} pending={index > 1} />)}</article>;
  }

  return <article className="mobile-step-detail-card"><h3>Go Live Date</h3><DetailRow label="Monitoring Started" value="May 30, 2025" /><p className="mobile-info-note success">Your store is now live and under monitoring.</p></article>;
}

function DetailRow({ label, value }) {
  return <div className="mobile-detail-row"><span>{label}</span><strong>{value}</strong></div>;
}

function DetailCheck({ text, pending = false }) {
  return <div className={"mobile-detail-check " + (pending ? "pending" : "")}><Check size={12} /><span>{text}</span></div>;
}
function ProjectMeta({ label, value }) {
  return (
    <div className="project-meta">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InstallationStep({ step, last, expanded, onToggle }) {
  const Icon = step.icon;

  return (
    <div className={`installation-step ${step.status}`}>
      <div className="installation-step-track">
        <div className="installation-step-circle">
          {step.status === "completed" ? <Check size={15} /> : step.status === "current" ? step.id : Icon ? <Icon size={14} /> : step.id}
        </div>
        {!last && <div className="installation-step-line" />}
      </div>

      <div className="installation-step-main">
        <div className={`installation-step-content ${expanded ? "expanded" : ""}`}>
          <div className="installation-step-number">{step.id}.</div>
          <div className="installation-step-copy">
            <strong>{step.title}</strong>
            <small>{step.description}</small>
          </div>
          <div className="installation-step-status">
            {step.status === "completed" && <><span className="installation-badge completed">Completed</span><span className="installation-date">{step.date}</span></>}
            {step.status === "current" && <><span className="installation-badge pending">Pending Action</span><button type="button">Upload Photos</button></>}
            {step.status === "upcoming" && <span className="installation-badge upcoming">Upcoming</span>}
            <button className="installation-step-toggle" type="button" onClick={onToggle} aria-expanded={expanded} aria-label={`${expanded ? "Close" : "Open"} ${step.title} details`}>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className={`installation-step-details ${expanded ? "open" : ""}`} aria-hidden={!expanded}>
          <div className="installation-step-details-inner"><DesktopStepDetails step={step} /></div>
        </div>
      </div>
    </div>
  );
}

function DesktopStepDetails({ step }) {
  const Icon = {
    1: Store,
    2: PlayCircle,
    3: LayoutGrid,
    4: Box,
    5: ClipboardCheck,
    6: CalendarDays,
    7: UserRoundCog,
    8: ClipboardCheck,
    9: Rocket,
  }[step.id];

  const messages = {
    1: <>Thank you!<small>Your store information<br />has been confirmed.</small></>,
    2: <>Thank you!<small>Your videos have been<br />shared.</small></>,
    3: <>Thank you!<small>Your layout has been<br />created and confirmed.</small></>,
    4: <>Your equipment has been<small>shipped to the store.</small></>,
    5: <>Please confirm received items by<small>uploading clear pictures.</small></>,
    6: <>We will schedule your installation<small>and notify you via email.</small></>,
    7: <>Technician will visit the store<small>on the scheduled date.</small></>,
    8: <>We will keep you updated on<small>the installation progress.</small></>,
    9: <>Congratulations! Your store is live<small>and under monitoring.</small></>,
  };

  return (
    <article className={`desktop-step-card desktop-step-${step.id}`}>
      <header className="desktop-step-card-title"><span>{step.id}</span><strong>{step.title.replace("Site Go Live", "Store Live")}</strong></header>
      <div className="desktop-step-hero">
        <span className="desktop-step-hero-icon"><Icon size={30} /></span>
        <div className="desktop-step-message">{messages[step.id]}</div>
      </div>
      <DesktopStepBody step={step} />
      <footer>
        <span className={`desktop-step-footer-status ${step.status}`}>
          {step.status === "completed" && <Check size={11} />}
          {step.status === "completed" ? "Completed" : step.status === "current" ? "In Progress" : "Upcoming"}
        </span>
      </footer>
    </article>
  );
}

function DesktopStepBody({ step }) {
  if (step.id === 1) return <div className="desktop-step-info-box"><small>Confirmed On</small><strong>May 15, 2025 10:30 AM</strong></div>;
  if (step.id === 2) return <><div className="desktop-step-label">Videos Received</div><div className="desktop-video-checks">{["Store Front", "Register Area", "Walk-through", "+2 more"].map((item) => <span key={item}><Check size={10} />{item}</span>)}</div><div className="desktop-confirmed"><small>Confirmed On</small><strong>May 16, 2025 02:15 PM</strong></div></>;
  if (step.id === 3) return <><div className="desktop-confirmed"><small>Confirmed On</small><strong>May 18, 2025 11:20 AM</strong></div><button className="desktop-outline-action" type="button">View Layout</button></>;
  if (step.id === 4) return <><div className="desktop-tracking"><small>Tracking Details</small><span><b>Tracking ID</b><strong>12993AA10123456784</strong></span><span><b>Carrier</b><strong>FedEx</strong></span><span><b>Shipped On</b><strong>May 20, 2025 09:45 AM</strong></span></div><button className="desktop-outline-action" type="button">Track Shipment</button></>;
  if (step.id === 5) return <><label className="desktop-drop-date"><span>Drop Date</span><div><strong>May 21, 2025</strong><CalendarDays size={15} /></div></label><button className="desktop-primary-action" type="button">Upload Photos</button></>;
  if (step.id === 6) return <div className="desktop-detail-list"><span><small>Schedule Status</small><em>Upcoming</em></span><span><small>Expected Date</small><strong>May 28, 2025</strong></span><span><small>Time Window</small><strong>10:00 AM - 02:00 PM</strong></span></div>;
  if (step.id === 7) return <div className="desktop-detail-list"><span><small>Visit Status</small><em>Upcoming</em></span><span><small>Expected Date</small><strong>May 28, 2025</strong></span><span><small>Time Window</small><strong>10:00 AM - 02:00 PM</strong></span></div>;
  if (step.id === 8) return <><div className="desktop-step-label">Status <em>Upcoming</em></div><div className="desktop-install-checks">{["Technician Arrived", "Testing In Progress", "Equipment Installed", "System Configuration", "Testing Complete", "Final Checklist"].map((item) => <span key={item}><i />{item}</span>)}</div></>;
  return <div className="desktop-step-info-box"><small>Go Live Date</small><strong>Jun 10, 2025</strong></div>;
}
function SummaryRow({ label, value }) {
  return (
    <div className="project-summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}