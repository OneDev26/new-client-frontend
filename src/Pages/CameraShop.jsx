import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Check,
  Cloud,
  Eye,
  Grid2X2,
  Heart,
  Mail,
  Medal,
  MoonStar,
  PackageCheck,
  PanelsTopLeft,
  RadioTower,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Wrench,
  Search,
  Filter,
  MoreVertical,
  Plus,
  UserRound,
  ChevronDown,
} from "lucide-react";

import "../CSS/CameraShop.css";
import camera1 from "../assets/Cam-1.png";
import camera2 from "../assets/Cam-2.png";
import camera3 from "../assets/Cam-3.png";
import camera4 from "../assets/Cam-4.png";
import camera5 from "../assets/Cam-5.png";
import camera6 from "../assets/Cam-6.png";

const features = [
  {
    title: "High Definition",
    subtitle: "Clear video quality",
    icon: PanelsTopLeft,
  },
  {
    title: "Night Vision",
    subtitle: "See clearly in low light",
    icon: MoonStar,
  },
  {
    title: "Remote Access",
    subtitle: "View anywhere, anytime",
    icon: Cloud,
  },
  {
    title: "Smart Detection",
    subtitle: "Motion & activity alerts",
    icon: Sparkles,
  },
];

const categories = [
  {
    id: "all",
    title: "All Cameras",
    subtitle: "12 Options",
    icon: Grid2X2,
  },
  {
    id: "single",
    title: "Single View Cameras",
    subtitle: "6 Options",
    icon: Eye,
  },
  {
    id: "fisheye",
    title: "Fisheye Cameras",
    subtitle: "2 Options",
    icon: RadioTower,
  },
  {
    id: "long-range",
    title: "Long-Range Cameras",
    subtitle: "2 Options",
    icon: RadioTower,
  },
  {
    id: "180",
    title: "180° Cameras",
    subtitle: "2 Options",
    icon: Eye,
  },
];

const cameras = [
  {
    id: 1,
    category: "single",
    title: "Single View Bullet Camera",
    badge: "Popular",
    badgeTheme: "purple",
    image: camera1,
    features: [
      "2MP Full HD",
      "Indoor / Outdoor",
      "Night Vision up to 30m",
      "Weatherproof (IP66)",
    ],
  },
  {
    id: 2,
    category: "single",
    title: "Single View Dome Camera",
    badge: "Best Seller",
    badgeTheme: "green",
    image: camera2,
    features: [
      "2MP Full HD",
      "Indoor / Outdoor",
      "Night Vision up to 30m",
      "Vandal Resistant (IK10)",
    ],
  },
  {
    id: 3,
    category: "single",
    title: "PTZ Camera",
    badge: "Advanced",
    badgeTheme: "purple",
    image: camera3,
    features: [
      "Pan, Tilt, Zoom",
      "30x Optical Zoom",
      "Auto Tracking",
      "Smart Detection",
    ],
  },
  {
    id: 4,
    category: "fisheye",
    title: "Fisheye Camera 360°",
    badge: "Wide Coverage",
    badgeTheme: "blue",
    image: camera4,
    features: [
      "6MP Ultra HD",
      "360° View",
      "Night Vision up to 15m",
      "De-warping Technology",
    ],
  },
  {
    id: 5,
    category: "long-range",
    title: "Long-Range Camera",
    badge: "Long Range",
    badgeTheme: "orange",
    image: camera5,
    features: [
      "5MP Full HD",
      "Up to 150m IR Range",
      "Motorized Lens",
      "Weatherproof (IP67)",
    ],
  },
  {
    id: 6,
    category: "180",
    title: "180° Panoramic Camera",
    badge: "Panoramic",
    badgeTheme: "teal",
    image: camera6,
    features: [
      "6MP Ultra HD",
      "180° Wide View",
      "Night Vision up to 20m",
      "Wall / Ceiling Mount",
    ],
  },
];

const membershipFeatures = [
  "24/7 Remote Monitoring",
  "Cloud Video Storage",
  "Smart Alerts & Notifications",
  "Technical Support",
  "Software & Feature Updates",
];

const plans = [
  {
    title: "Up to 15 Single View Cameras for 3 Years",
    subtitle: "Includes our membership & complete support",
    price: "From $50/month",
  },
  {
    title: "Up to 12 Single View Cameras for 3 Years",
    subtitle: "Includes our membership & complete support",
    price: "From $55/month",
  },
];

const bottomBenefits = [
  {
    title: "Free Site Assessment",
    subtitle: "We'll evaluate your store's needs",
    icon: Truck,
  },
  {
    title: "Customized Solution",
    subtitle: "Tailored to your business requirements",
    icon: ShieldCheck,
  },
  {
    title: "Quote via Email",
    subtitle: "Get your personalized quote within 24 hours",
    icon: Mail,
  },
];

export default function CameraShop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mobileTab, setMobileTab] = useState("cameras");
  const [mobileSearch, setMobileSearch] = useState("");

  const visibleCameras = useMemo(() => {
    if (activeCategory === "all") return cameras;

    return cameras.filter(
      (camera) => camera.category === activeCategory
    );
  }, [activeCategory]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleCamera = (camera) => {
    setSelectedCameras((current) => {
      const exists = current.some((item) => item.id === camera.id);

      if (exists) {
        return current.filter((item) => item.id !== camera.id);
      }

      return [...current, camera];
    });
  };

  return (
<main className="camera-shop-page">
      <section className="mobile-devices-view">
        <header className="mobile-devices-header">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={19} /></button>
          <div><h1>Devices & Cameras</h1><p>Manage all devices and cameras in your store</p></div>
          <button type="button" aria-label="Notifications"><Bell size={18} /></button>
          <button type="button" aria-label="Profile"><UserRound size={18} /></button>
        </header>
        <div className="mobile-device-search"><Search size={17}/><input value={mobileSearch} onChange={(event) => setMobileSearch(event.target.value)} placeholder="Search devices or cameras..."/><button type="button" aria-label="Filter"><Filter size={17}/></button></div>
        <nav className="mobile-device-tabs"><button className={mobileTab === "cameras" ? "active" : ""} onClick={() => setMobileTab("cameras")}>Cameras</button><button className={mobileTab === "devices" ? "active" : ""} onClick={() => setMobileTab("devices")}>Devices</button></nav>
        <MobileDeviceList tab={mobileTab} search={mobileSearch} />
        <button type="button" className="mobile-add-device"><Plus size={17}/>Add Device</button>
      </section>
      <div className="camera-shop-layout">
        {/* LEFT SIDE */}
        <section className="camera-shop-main">
          {/* FEATURE STRIP */}
          <section className="camera-feature-strip">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className="camera-feature-item"
                  key={feature.title}
                >
                  <span className="camera-feature-icon">
                    <Icon size={18} />
                  </span>

                  <div>
                    <strong>{feature.title}</strong>
                    <small>{feature.subtitle}</small>
                  </div>
                </article>
              );
            })}
          </section>

          {/* CATEGORY TABS */}
          <section className="camera-category-tabs">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  type="button"
                  key={category.id}
                  className={
                    activeCategory === category.id ? "active" : ""
                  }
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>
                    <Icon size={18} />
                  </span>

                  <div>
                    <strong>{category.title}</strong>
                    <small>{category.subtitle}</small>
                  </div>
                </button>
              );
            })}
          </section>

          {/* PRODUCT GRID */}
          <section className="camera-product-grid">
            {visibleCameras.map((camera) => {
              const selected = selectedCameras.some(
                (item) => item.id === camera.id
              );

              const favorite = favorites.includes(camera.id);

              return (
                <article
                  className={`camera-product-card ${
                    selected ? "selected" : ""
                  }`}
                  key={camera.id}
                >
                  <button
                    type="button"
                    className={`camera-favorite ${
                      favorite ? "active" : ""
                    }`}
                    onClick={() => toggleFavorite(camera.id)}
                    aria-label="Add to favorites"
                  >
                    <Heart
                      size={17}
                      fill={favorite ? "currentColor" : "none"}
                    />
                  </button>

                  <div className="camera-product-image">
                    <img
                      src={camera.image}
                      alt={camera.title}
                    />
                  </div>

                  <div className="camera-product-heading">
                    <h3>{camera.title}</h3>

                    <span
                      className={`camera-product-badge ${camera.badgeTheme}`}
                    >
                      {camera.badge}
                    </span>
                  </div>

                  <ul className="camera-feature-list">
                    {camera.features.map((feature) => (
                      <li key={feature}>
                        <Check size={12} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="camera-card-actions">
                    <button
                      type="button"
                      className="camera-details-btn"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className={`camera-select-btn ${
                        selected ? "selected" : ""
                      }`}
                      onClick={() => toggleCamera(camera)}
                    >
                      {selected ? "Selected" : "Select Camera"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {/* SERVICE INFO */}
          <section className="camera-service-info">
            <article>
              <span className="service-info-icon agreement">
                <PackageCheck size={24} />
              </span>

              <div>
                <h3>3 Year Service Agreement</h3>
                <p>
                  All camera service plans require a 36-month service
                  agreement. Early termination charges may apply as per
                  the terms of our service agreement.
                </p>
              </div>
            </article>

            <article>
              <span className="service-info-icon install">
                <Wrench size={24} />
              </span>

              <div>
                <h3>Professional Installation</h3>
                <p>
                  Our certified technicians will install and configure
                  your cameras for optimal performance.
                </p>
              </div>
            </article>
          </section>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="camera-shop-sidebar">
          {/* EXCLUSIVE OFFER */}
          <article className="exclusive-offer-card">
            <div className="exclusive-heading">
              <span>
                <Medal size={28} />
              </span>

              <div>
                <h2>Exclusive Offer</h2>
                <strong>For Our Valued Clients</strong>
              </div>
            </div>

            <p className="exclusive-description">
              Add professional surveillance to your store with our
              special membership plans starting from just
              <strong> $50/month.</strong>
            </p>

            <div className="membership-box">
              <h3>Membership Includes</h3>

              <ul>
                {membershipFeatures.map((feature) => (
                  <li key={feature}>
                    <Check size={12} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* SPECIAL PLANS */}
          <article className="camera-side-card plans-card">
            <h2>Our Special Plans (3 Year Contract)</h2>

            <div className="special-plan-list">
              {plans.map((plan) => (
                <button
                  type="button"
                  className="special-plan"
                  key={plan.title}
                >
                  <span className="plan-icon">
                    <RadioTower size={18} />
                  </span>

                  <div>
                    <strong>{plan.title}</strong>
                    <small>{plan.subtitle}</small>
                  </div>

                  <span className="plan-price">
                    {plan.price}
                  </span>
                </button>
              ))}
            </div>

            <div className="termination-note">
              <BellRing size={14} />

              <span>
                Early termination charges may apply as per the terms
                of our service agreement.
              </span>
            </div>
          </article>

          {/* READY */}
          <article className="ready-card">
            <div>
              <h2>Ready to Get Started?</h2>
              <p>Select your cameras and request a quote.</p>
            </div>

            <button type="button">
              <ShoppingCart size={14} />
              Add Cameras to Request

              {selectedCameras.length > 0 && (
                <span>{selectedCameras.length}</span>
              )}
            </button>
          </article>
        </aside>
      </div>

      {/* BOTTOM BENEFITS */}
      <section className="camera-bottom-benefits">
        {bottomBenefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article key={benefit.title}>
              <span>
                <Icon size={20} />
              </span>

              <div>
                <strong>{benefit.title}</strong>
                <small>{benefit.subtitle}</small>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
const managedCameras = [
  ["Front Entrance", "CAM-001", "192.168.1.101", camera2, true],
  ["Cash Counter", "CAM-002", "192.168.1.102", camera1, true],
  ["Aisle View", "CAM-003", "192.168.1.103", camera3, true],
  ["Parking Area", "CAM-004", "192.168.1.104", camera4, false],
  ["Stock Room", "CAM-005", "192.168.1.105", camera5, true],
  ["Back Entrance", "CAM-006", "192.168.1.106", camera6, false],
];

function MobileDeviceList({ tab, search }) {
  const rows = tab === "cameras" ? managedCameras : [["Main NVR", "NVR-001", "16 Channel NVR", camera5, true]];
  const filtered = rows.filter((item) => item[0].toLowerCase().includes(search.trim().toLowerCase()));
  return <section className="mobile-managed-list">
    <div className="mobile-list-heading"><h2>{tab === "cameras" ? `Cameras (${managedCameras.length})` : "Devices (1)"}</h2>{tab === "cameras" && <span><i className="online"/>4 Online <i className="offline"/>2 Offline</span>}</div>
    <div className="mobile-device-rows">{filtered.map(([name,id,address,image,online]) => <article key={id}><span className="mobile-device-image"><img src={image} alt=""/></span><div><strong>{name}</strong><small>{id}</small><em>{address}</em></div><b className={online ? "online" : "offline"}><i/>{online ? "Online" : "Offline"}</b><button type="button" aria-label={`More options for ${name}`}><MoreVertical size={17}/></button></article>)}</div>
    <button type="button" className="mobile-view-all">View All {tab === "cameras" ? "Cameras" : "Devices"} <ChevronDown size={16}/></button>
  </section>;
}