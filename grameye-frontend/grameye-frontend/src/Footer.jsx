import React, { useState } from "react";
import {
  MapPin, Phone, Mail, Globe, MessageSquare, Send, X, Sparkles,
  ChevronRight, Clock, ShieldCheck, Camera, Zap, Award, CheckCircle2,
  ExternalLink, Bot, ArrowUpRight
} from "lucide-react";

/* Modern Social SVG Icons matching professional footer standards */
const SocialIcons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  GitHub: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  TwitterX: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
};

export default function Footer({ setPage }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! 🙏 I am GramEye AI Sahayak. How can I assist you with village grievances or platform inquiries today?"
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Dhanyawad! GramEye AI is actively monitoring your village's civic health. You can lodge complaints directly with geo-tagged photos, or connect with Amit Kumar Sahu on WhatsApp at +91 6268814185.";
      const lower = userText.toLowerCase();
      if (lower.includes("report") || lower.includes("complaint") || lower.includes("problem")) {
        reply = "You can click on 'Report a Problem' in the navigation bar to launch our 4-step AI-assisted grievance filing with automatic severity detection!";
      } else if (lower.includes("amit") || lower.includes("developer") || lower.includes("contact") || lower.includes("phone")) {
        reply = "You can contact the developer Amit Kumar Sahu at +91 6268814185, email dmtamit789@gmail.com, or visit his portfolio!";
      } else if (lower.includes("ward") || lower.includes("panchayat") || lower.includes("admin")) {
        reply = "Switch to the 'Panchayat Admin' mode at the top to explore the real-time AI Command Center and village trends.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  const navigateTo = (pageKey) => {
    if (setPage) {
      setPage(pageKey);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .grameye-footer {
          background: #08130C;
          color: #B4C6BA;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .grameye-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232, 163, 61, 0.5), transparent);
        }
        .ge-footer-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 60px 24px 30px;
          position: relative;
          z-index: 2;
        }
        .ge-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1.05fr 1.25fr 1.4fr 1.15fr;
          gap: 36px;
        }
        @media (max-width: 1024px) {
          .ge-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
        }
        @media (max-width: 640px) {
          .ge-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
        .ge-footer-heading {
          color: #E8A33D;
          font-size: 13.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ge-footer-link {
          color: #B4C6BA;
          text-decoration: none;
          font-size: 13.5px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          text-align: left;
          width: 100%;
        }
        .ge-footer-link:hover {
          color: #FBF8F0;
          transform: translateX(4px);
        }
        .ge-footer-link .ge-chevron {
          color: #E8A33D;
          font-weight: bold;
          font-size: 15px;
          transition: transform 0.2s ease;
        }
        .ge-footer-link:hover .ge-chevron {
          transform: translateX(2px);
          color: #F4C374;
        }
        .ge-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E0EADE;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ge-social-btn:hover {
          background: #E8A33D;
          color: #0B1710;
          border-color: #E8A33D;
          transform: translateY(-3px);
          box-shadow: 0 8px 18px -4px rgba(232, 163, 61, 0.5);
        }
        .ge-cta-banner-btn {
          background: linear-gradient(135deg, #E8A33D 0%, #D4791E 100%);
          color: #0E1A13;
          border: none;
          border-radius: 999px;
          padding: 14px 34px;
          font-size: 14.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 12px 28px -6px rgba(232, 163, 61, 0.55);
          text-transform: uppercase;
        }
        .ge-cta-banner-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 36px -6px rgba(232, 163, 61, 0.75);
          background: linear-gradient(135deg, #F4C374 0%, #E8A33D 100%);
        }
        .ge-floating-chat-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0F2317;
          border: 1px solid rgba(232, 163, 61, 0.4);
          padding: 6px 16px 6px 6px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.25s ease;
        }
        .ge-floating-chat-trigger:hover {
          transform: translateY(-3px);
          border-color: #E8A33D;
          box-shadow: 0 16px 34px rgba(232, 163, 61, 0.3);
        }
        @media (max-width: 640px) {
          .ge-floating-chat-trigger {
            bottom: 68px;
            right: 14px;
            padding: 4px;
            border-radius: 999px;
            gap: 0;
          }
          .ge-floating-chat-trigger span {
            display: none !important;
          }
        }
      `}</style>

      <footer className="grameye-footer">
        <div className="ge-footer-container">
          {/* Main 5-Column Grid */}
          <div className="ge-footer-grid">
            {/* COLUMN 1: BRAND / ABOUT */}
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16 }}
                onClick={() => navigateTo("landing")}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #E8A33D 0%, #1F4D36 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px -4px rgba(232, 163, 61, 0.4)"
                  }}
                >
                  <span style={{ fontSize: 22 }}>🌾</span>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#FBF8F0",
                      lineHeight: 1.1,
                      letterSpacing: "0.02em"
                    }}
                  >
                    GRAMEYE <span style={{ color: "#E8A33D" }}>AI</span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "#7E9685",
                      textTransform: "uppercase",
                      marginTop: 2
                    }}
                  >
                    PANCHAYAT GOVERNANCE
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div
                style={{
                  color: "#E8A33D",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 14
                }}
              >
                SMART. TRANSPARENT. EMPOWERED.
              </div>

              {/* Description */}
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#8EAA97", marginBottom: 20 }}>
                GramEye AI is your trusted village grievance redressal and rural development platform.
                We bridge citizens and Panchayat administration through transparent, AI-verified governance.
              </p>

              {/* Location Box */}
              <a
                href="https://maps.google.com/?q=Kodebod,+Tehsil+Kurud,+Dhamtari,+Chhattisgarh+493663,+India"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  color: "#A2B8AA",
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  textDecoration: "none",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <MapPin size={18} color="#E8A33D" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Kodebod, Tehsil Kurud, Dhamtari, Chhattisgarh - 493663, India</span>
              </a>
            </div>

            {/* COLUMN 2: NAVIGATE */}
            <div>
              <div className="ge-footer-heading">NAVIGATE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <button className="ge-footer-link" onClick={() => navigateTo("landing")}>
                  <span className="ge-chevron">›</span> Home
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("citizenDashboard")}>
                  <span className="ge-chevron">›</span> Citizen Dashboard
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("report")}>
                  <span className="ge-chevron">›</span> Report a Problem
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("map")}>
                  <span className="ge-chevron">›</span> Village Live Map
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("adminDashboard")}>
                  <span className="ge-chevron">›</span> Panchayat Command
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("adminComplaints")}>
                  <span className="ge-chevron">›</span> Grievance Directory
                </button>
                <button className="ge-footer-link" onClick={() => navigateTo("rewards")}>
                  <span className="ge-chevron">›</span> Rewards & Badges
                </button>
                <button className="ge-footer-link" onClick={() => setChatOpen(true)}>
                  <span className="ge-chevron">›</span> Gram Sahayak AI
                </button>
              </div>
            </div>

            {/* COLUMN 3: SERVICES */}
            <div>
              <div className="ge-footer-heading">SERVICES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <Camera size={15} color="#E8A33D" />
                  <span>AI Vision Problem Detection</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <MapPin size={15} color="#E8A33D" />
                  <span>Geo-Tagged Grievance Pin</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <Zap size={15} color="#E8A33D" />
                  <span>Auto-Department Routing</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <ShieldCheck size={15} color="#E8A33D" />
                  <span>Severity & SLA Triage Engine</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <CheckCircle2 size={15} color="#E8A33D" />
                  <span>Before/After Dual Verification</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <Award size={15} color="#E8A33D" />
                  <span>Citizen Karma & Leaderboard</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#A8BFB0" }}>
                  <Clock size={15} color="#E8A33D" />
                  <span>24/7 AI Gram Sahayak</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4: CONTACT */}
            <div>
              <div className="ge-footer-heading">CONTACT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Phone 1 */}
                <a
                  href="tel:+916268814185"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#D8E4DC",
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: 600,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8A33D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#D8E4DC")}
                >
                  <Phone size={15} color="#E8A33D" />
                  <span>+91 6268814185</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:dmtamit789@gmail.com"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#D8E4DC",
                    textDecoration: "none",
                    fontSize: 13.5,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8A33D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#D8E4DC")}
                >
                  <Mail size={15} color="#E8A33D" />
                  <span>dmtamit789@gmail.com</span>
                </a>

                {/* Portfolio URL */}
                <a
                  href="https://portfolio-website-delta-one-38.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#D8E4DC",
                    textDecoration: "none",
                    fontSize: 13,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8A33D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#D8E4DC")}
                >
                  <Globe size={15} color="#E8A33D" />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    portfolio-website-delta-one-38
                  </span>
                  <ExternalLink size={12} color="#7E9685" />
                </a>

                {/* WhatsApp Chat */}
                <a
                  href="https://wa.me/916268814185?text=Hello%20Amit%2C%20I%20am%20contacting%20you%20from%20GramEye%20AI%20platform."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#25D366",
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: 700,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <SocialIcons.WhatsApp />
                  <span>WhatsApp Chat</span>
                  <span
                    style={{
                      background: "rgba(37, 211, 102, 0.15)",
                      color: "#25D366",
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 6
                    }}
                  >
                    Online
                  </span>
                </a>

                {/* Timings */}
                <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#8EAA97" }}>
                    <Clock size={14} color="#E8A33D" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div>Mon - Sat: 8:00 AM - 8:00 PM</div>
                      <div style={{ marginTop: 2 }}>Sunday: 9:00 AM - 6:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 5: FOLLOW US */}
            <div>
              <div className="ge-footer-heading">FOLLOW US</div>
              {/* Social Icons row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <a
                  href="https://portfolio-website-delta-one-38.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="Portfolio Website"
                >
                  <SocialIcons.Facebook />
                </a>

                <a
                  href="https://www.instagram.com/amitsahu_018?igsi=MXB0OG0yZWoyY3hjbA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="Instagram: @amitsahu_018"
                >
                  <SocialIcons.Instagram />
                </a>

                <a
                  href="https://wa.me/916268814185?text=Hello%20Amit%2C%20I%20visited%20GramEye%20AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="WhatsApp: 6268814185"
                >
                  <SocialIcons.WhatsApp />
                </a>

                <a
                  href="https://www.linkedin.com/in/amit-kumar-sahu-980a4236b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="LinkedIn: Amit Kumar Sahu"
                >
                  <SocialIcons.LinkedIn />
                </a>

                <a
                  href="https://github.com/ashu30u"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="GitHub: ashu30u"
                >
                  <SocialIcons.GitHub />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-social-btn"
                  title="X (Twitter)"
                >
                  <SocialIcons.TwitterX />
                </a>
              </div>

              <div style={{ color: "#E8A33D", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                @GramEyeAI • @amitsahu_018
              </div>

              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#8EAA97", margin: 0 }}>
                Stay connected with us for latest village development updates, AI governance releases, and citizen initiatives.
              </p>
            </div>
          </div>

          {/* Central Call-to-Action Pill Banner (Matches the Ghidora orange button) */}
          <div
            style={{
              margin: "44px 0 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            <button
              className="ge-cta-banner-btn"
              onClick={() => navigateTo("report")}
            >
              <Sparkles size={18} />
              <span>REPORT A VILLAGE PROBLEM WITH AI</span>
            </button>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#7E9685",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span>Quick AI Triage</span>
              <span>•</span>
              <span>Real-Time Geo-Tagging</span>
              <span>•</span>
              <span>Instant Panchayat Alert</span>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Attribution */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: 24,
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              fontSize: 12.5,
              color: "#7E9685"
            }}
          >
            {/* Left: Copyright */}
            <div>
              <div>© 2026 GramEye AI. All rights reserved.</div>
              <div style={{ color: "#546A5B", fontWeight: 600, marginTop: 2 }}>
                Your Trust, Our Responsibility. Empowering Rural India.
              </div>
            </div>

            {/* Center: Developer Attribution (Built by AMIT KUMAR SAHU) */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.07)",
                color: "#D8E4DC",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>Built by</span>
              <a
                href="https://portfolio-website-delta-one-38.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#E8A33D",
                  fontWeight: 800,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  borderBottom: "1px dashed rgba(232, 163, 61, 0.6)",
                  paddingBottom: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#F4C374";
                  e.currentTarget.style.borderBottomStyle = "solid";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#E8A33D";
                  e.currentTarget.style.borderBottomStyle = "dashed";
                }}
              >
                AMIT KUMAR SAHU
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Right: Policies */}
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Privacy Policy</span>
              <span>|</span>
              <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Terms & Conditions</span>
              <span>|</span>
              <span style={{ cursor: "pointer", transition: "color 0.2s" }}>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating "Chat with GramEye AI" Pill Button (matches the screenshot bottom-right widget) */}
      <div
        className="ge-floating-chat-trigger"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            background: "linear-gradient(135deg, #E8A33D 0%, #1F4D36 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(232, 163, 61, 0.6)"
          }}
        >
          <Bot size={20} color="#FBF8F0" />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FBF8F0", whiteSpace: "nowrap" }}>
          Chat with GramEye AI
        </span>
      </div>

      {/* Interactive AI Chatbot Drawer/Modal */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 84,
            right: 24,
            width: 350,
            maxWidth: "calc(100vw - 32px)",
            height: 440,
            background: "#0E1C13",
            border: "1px solid rgba(232, 163, 61, 0.4)",
            borderRadius: 20,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "geFadeUp 0.25s ease-out"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "#132A1C",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#E8A33D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Bot size={18} color="#0B1710" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FBF8F0" }}>GramEye AI Assistant</div>
                <div style={{ fontSize: 10, color: "#25D366", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "#25D366", display: "inline-block" }} />
                  Online • Powered by Amit Kumar Sahu
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{ background: "none", border: "none", color: "#8EAA97", cursor: "pointer", padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Message List */}
          <div
            style={{
              flex: 1,
              padding: 14,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: msg.sender === "user" ? "#1F4D36" : "rgba(255, 255, 255, 0.06)",
                  color: "#FBF8F0",
                  padding: "9px 13px",
                  borderRadius: msg.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  border: msg.sender === "user" ? "1px solid #2E6B4A" : "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Action Badges */}
          <div
            style={{
              padding: "6px 12px",
              background: "rgba(0,0,0,0.2)",
              display: "flex",
              gap: 6,
              overflowX: "auto"
            }}
          >
            <button
              onClick={() => {
                navigateTo("report");
                setChatOpen(false);
              }}
              style={{
                background: "rgba(232, 163, 61, 0.15)",
                border: "1px solid rgba(232, 163, 61, 0.3)",
                color: "#E8A33D",
                borderRadius: 99,
                fontSize: 11,
                padding: "3px 9px",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              ⚡ Report Problem
            </button>
            <a
              href="https://wa.me/916268814185?text=Hello%20Amit%2C%20chatting%20from%20GramEye%20AI"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(37, 211, 102, 0.15)",
                border: "1px solid rgba(37, 211, 102, 0.3)",
                color: "#25D366",
                borderRadius: 99,
                fontSize: 11,
                padding: "3px 9px",
                whiteSpace: "nowrap",
                textDecoration: "none"
              }}
            >
              💬 WhatsApp Amit
            </a>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: 10,
              background: "#132A1C",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              gap: 8
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about GramEye..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#FBF8F0",
                fontSize: 12.5,
                outline: "none"
              }}
            />
            <button
              type="submit"
              style={{
                background: "#E8A33D",
                border: "none",
                borderRadius: 8,
                padding: "0 12px",
                color: "#0B1710",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
