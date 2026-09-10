import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

import "../CSS/ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Support Request:", formData);

    setSubmitted(true);
  };

  return (
    <main className="support-page">

      {/* TOP SUPPORT STRIP */}
      <section className="support-hero">
        <div className="support-hero-copy">
          <span className="support-hero-icon">
            <Headphones size={24} />
          </span>

          <div>
            <h2>How can we help?</h2>
            <p>
              Our support team is available to help with your store,
              monitoring service, cameras, billing, or account questions.
            </p>
          </div>
        </div>

        <div className="support-hero-stats">
          <SupportStat
            Icon={Clock3}
            title="Quick Response"
            copy="Our team will respond as soon as possible"
          />

          <SupportStat
            Icon={ShieldCheck}
            title="Dedicated Support"
            copy="Support for all active Survill clients"
          />

          <SupportStat
            Icon={MessageSquareText}
            title="Multiple Channels"
            copy="Phone, email, or support request"
          />
        </div>
      </section>


      {/* MAIN CONTENT */}
      <section className="support-layout">

        {/* LEFT */}
        <div className="support-left">

          <section className="support-card support-contact-card">
            <div className="support-card-header">
              <div>
                <h2>Contact Information</h2>
                <p>Choose the most convenient way to reach our team.</p>
              </div>
            </div>

            <div className="support-contact-list">

              <ContactItem
                Icon={Phone}
                title="Call Support"
                lines={[
                  "+1 (253) 362-3578",
                  "+1 (206) 208-0809",
                ]}
                accent="purple"
              />

              <ContactItem
                Icon={Mail}
                title="Email Support"
                lines={[
                  "operations@survill.com",
                  "Send us your question anytime",
                ]}
                accent="blue"
              />

              <ContactItem
                Icon={MapPin}
                title="Office Address"
                lines={[
                  "312 W 2nd St #5196",
                  "Casper, WY, US 82601",
                ]}
                accent="green"
              />

              <ContactItem
                Icon={Building2}
                title="Client Support"
                lines={[
                  "Existing Survill customers",
                  "Store, billing & monitoring support",
                ]}
                accent="orange"
              />

            </div>
          </section>


          {/* SUPPORT NOTE */}

          <section className="support-card support-assistance-card">
            <span>
              <ShieldCheck size={22} />
            </span>

            <div>
              <h3>Need urgent assistance?</h3>
              <p>
                For monitoring or security-related concerns, contact our
                support team directly so we can assist you quickly.
              </p>
            </div>

            <a href="tel:+12533623578">
              <Phone size={16} />
              Call Support
            </a>
          </section>

        </div>


        {/* RIGHT FORM */}

        <section className="support-card support-form-card">

          <div className="support-card-header">
            <div>
              <h2>Send a Support Request</h2>
              <p>
                Tell us how we can help and our team will get back to you.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="support-success">
              <span>
                <CheckCircle2 size={30} />
              </span>

              <h3>Request Submitted</h3>

              <p>
                Your message has been received. Our support team will contact
                you shortly.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);

                  setFormData({
                    fullName: "",
                    email: "",
                    subject: "",
                    message: "",
                  });
                }}
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form
              className="support-form"
              onSubmit={handleSubmit}
            >

              <div className="support-form-row">

                <SupportField
                  label="Full Name"
                  required
                >
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </SupportField>

                <SupportField
                  label="Email Address"
                  required
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </SupportField>

              </div>


              <SupportField
                label="Subject"
                required
              >
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What do you need help with?"
                  required
                />
              </SupportField>


              <SupportField
                label="Message"
                required
              >
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your question or issue..."
                  required
                />
              </SupportField>


              <div className="support-form-note">
                <ShieldCheck size={15} />

                <span>
                  Your request will only be shared with the Survill support
                  team.
                </span>
              </div>


              <div className="support-form-actions">

                <button
                  type="button"
                  className="support-cancel-btn"
                  onClick={() =>
                    setFormData({
                      fullName: "",
                      email: "",
                      subject: "",
                      message: "",
                    })
                  }
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="support-submit-btn"
                >
                  <Send size={15} />
                  Send Request
                </button>

              </div>

            </form>
          )}

        </section>

      </section>

    </main>
  );
}



function SupportField({
  label,
  required,
  children,
}) {
  return (
    <label className="support-field">

      <span>
        {label}

        {required && <b>*</b>}
      </span>

      {children}

    </label>
  );
}



function SupportStat({
  Icon,
  title,
  copy,
}) {
  return (
    <article className="support-stat">

      <span>
        <Icon size={18} />
      </span>

      <div>
        <strong>{title}</strong>
        <small>{copy}</small>
      </div>

    </article>
  );
}



function ContactItem({
  Icon,
  title,
  lines,
  accent,
}) {
  return (
    <article className="support-contact-item">

      <span className={`support-contact-icon ${accent}`}>
        <Icon size={19} />
      </span>

      <div>
        <strong>{title}</strong>

        {lines.map((line) => (
          <small key={line}>
            {line}
          </small>
        ))}
      </div>

    </article>
  );
}