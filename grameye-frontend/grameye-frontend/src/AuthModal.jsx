import React, { useState, useEffect, useRef } from "react";
import {
  X, Phone, ShieldCheck, Sparkles, ArrowRight, CheckCircle2,
  Lock, Mail, User, MapPin, Loader2, ArrowLeft, RefreshCw,
  Sprout, Award, LogOut, AlertCircle, KeyRound, Globe
} from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  lang = "en"
}) {
  const [authMode, setAuthMode] = useState("otp"); // "otp" | "password"
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "profile"
  const [mobile, setMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [sentOtp, setSentOtp] = useState(null);
  const [smsNotification, setSmsNotification] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New user registration fields
  const [fullName, setFullName] = useState("");
  const [ward, setWard] = useState("Ward 3");
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [adminPassword, setAdminPassword] = useState("");

  // Email / Password mode fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const otpInputsRef = useRef([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // Handle Request OTP
  const handleSendOtp = async (inputMobile) => {
    const targetMobile = (inputMobile || mobile).replace(/\D/g, "");
    if (targetMobile.length < 10) {
      setError(lang === "hi" ? "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें" : "Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call backend send-otp API with fallback
      const cleanNum = targetMobile.slice(-10);
      let generatedOtp = "4829";

      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: cleanNum })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.otp) generatedOtp = data.otp;
        }
      } catch {
        // Offline / Standalone mode fallback
      }

      setSentOtp(generatedOtp);
      setStep("otp");
      setCountdown(30);
      setSmsNotification(`📩 SMS: Your GramEye AI verification code is ${generatedOtp}.`);

      // Auto-dismiss SMS simulation after 8s
      setTimeout(() => setSmsNotification(null), 8000);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle Digit Change
  const handleOtpDigitChange = (index, value) => {
    const val = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    if (val && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Auto-fill OTP Shortcut
  const handleAutoFillOtp = () => {
    if (sentOtp) {
      const chars = sentOtp.split("");
      setOtpDigits(chars);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 4) {
      setError(lang === "hi" ? "कृपया 4 अंकों का ओटीपी दर्ज करें" : "Please enter the full 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    // Client-side strict check: Entered OTP must match sentOtp (or master fallback 4829)
    if (sentOtp && enteredOtp !== sentOtp && enteredOtp !== "4829") {
      setLoading(false);
      setError(lang === "hi" ? "❌ गलत ओटीपी (Wrong OTP)! कृपया अपने मोबाइल पर आया सही 4-अंकीय कोड दर्ज करें।" : "❌ Wrong OTP! Please enter the correct 4-digit code sent to your mobile.");
      return;
    }

    try {
      let isNew = false;
      let userData = null;

      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: mobile.slice(-10),
            otp: enteredOtp,
            fullName: fullName || "Gram Citizen",
            ward,
            role: selectedRole === "admin" ? "ADMIN" : "CITIZEN",
            adminPassword
          })
        });
        if (res.ok) {
          const data = await res.json();
          userData = data.user;
          isNew = data.isNewUser;
        } else {
          const errData = await res.json();
          throw new Error(errData.message || "Invalid OTP");
        }
      } catch (backendErr) {
        // Fallback check
        if (enteredOtp !== sentOtp && enteredOtp !== "4829") {
          throw new Error(lang === "hi" ? "❌ गलत ओटीपी (Wrong OTP)! कृपया अपने मोबाइल पर आया सही कोड दर्ज करें।" : "❌ Wrong OTP! Please enter the correct verification code.");
        }
        isNew = true;
      }

      // Always proceed to profile setup to confirm name, ward & role/password
      if (isNew || !fullName) {
        setStep("profile");
        setLoading(false);
        return;
      }

      // If user selected admin, strictly enforce password amit@123
      if (selectedRole === "admin") {
        if (!adminPassword.trim() || adminPassword.trim().toLowerCase() !== "amit@123") {
          setStep("profile");
          setError(lang === "hi" ? "❌ गलत एडमिन पासवर्ड (Wrong Password)! पंचायत एडमिन के लिए पासवर्ड 'amit@123' अनिवार्य है।" : "❌ Wrong Admin Password! Password 'amit@123' is required for Panchayat Admin.");
          setLoading(false);
          return;
        }
      }

      // Complete login
      const finalUser = userData || {
        id: `usr-${Date.now().toString().slice(-4)}`,
        fullName: fullName || (mobile.includes("6268814185") ? "Amit Kumar Sahu" : "Rahul Sahu"),
        mobile: mobile.slice(-10),
        role: selectedRole === "admin" ? "admin" : "citizen",
        ward: ward || "Ward 3",
        village: "Kodebod",
        xp: selectedRole === "admin" ? 500 : 340
      };

      if (onLoginSuccess) {
        onLoginSuccess(finalUser);
      }
      onClose();
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Complete Profile for New User
  const handleCompleteProfile = () => {
    setError("");

    // If Admin role is selected, validate password amit@123
    if (selectedRole === "admin") {
      if (!adminPassword.trim()) {
        setError(lang === "hi" ? "❌ कृपया पंचायत एडमिन पासवर्ड दर्ज करें!" : "❌ Please enter Panchayat Admin password!");
        return;
      }
      if (adminPassword.trim().toLowerCase() !== "amit@123") {
        setError(lang === "hi" ? "❌ गलत एडमिन पासवर्ड (Wrong Password)! कृपया सही पासवर्ड 'amit@123' दर्ज करें।" : "❌ Wrong Admin Password! Please enter valid password 'amit@123'.");
        return;
      }
    }

    const finalUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      fullName: fullName.trim() || (selectedRole === "admin" ? "Panchayat Admin" : "Citizen of Kodebod"),
      mobile: mobile.slice(-10) || "6268814185",
      role: selectedRole === "admin" ? "admin" : "citizen",
      ward: ward || "Ward 3",
      village: "Kodebod",
      xp: selectedRole === "admin" ? 500 : 150
    };

    if (onLoginSuccess) {
      onLoginSuccess(finalUser);
    }
    onClose();
  };

  // Quick Demo Shortcut
  const handleQuickDemoLogin = (roleType) => {
    const demoUser = roleType === "admin"
      ? {
          id: "adm-1",
          fullName: "Sarpanch Rameshwar Patel",
          email: "sarpanch@kodebod.gov.in",
          mobile: "9876543210",
          role: "admin",
          ward: "Panchayat Bhavan",
          village: "Kodebod",
          xp: 850
        }
      : {
          id: "cit-1",
          fullName: "Rahul Sahu",
          mobile: "6268814185",
          role: "citizen",
          ward: "Ward 4",
          village: "Kodebod",
          xp: 340
        };

    if (onLoginSuccess) {
      onLoginSuccess(demoUser);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(8, 19, 12, 0.78)",
        backdropFilter: "blur(12px)",
        animation: "geFadeIn 0.25s ease-out"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        .ge-auth-box {
          width: 100%;
          max-width: 860px;
          background: #FBF8F0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
        }
        @media (max-width: 768px) {
          .ge-auth-box {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
          .ge-auth-banner {
            display: none !important;
          }
        }
        .ge-otp-input {
          width: 54px;
          height: 60px;
          border-radius: 12px;
          border: 2px solid rgba(14, 26, 19, 0.15);
          background: #fff;
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          color: #0E1A13;
          outline: none;
          transition: all 0.2s ease;
        }
        .ge-otp-input:focus {
          border-color: #1F4D36;
          box-shadow: 0 0 0 4px rgba(31, 77, 54, 0.15);
          background: #F4EEE0;
        }
        .ge-auth-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          font-weight: 700;
          font-size: 13px;
          color: #5C6E62;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .ge-auth-tab.active {
          color: #1F4D36;
          border-bottom-color: #1F4D36;
        }
      `}</style>

      <div className="ge-auth-box">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "rgba(14, 26, 19, 0.06)",
            border: "none",
            borderRadius: 99,
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            color: "#0E1A13"
          }}
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: GramEye Rural AI Visual Branding */}
        <div
          className="ge-auth-banner"
          style={{
            background: "linear-gradient(145deg, #0B1710 0%, #173623 55%, #1F4D36 100%)",
            color: "#FBF8F0",
            padding: "44px 34px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 180,
              height: 180,
              borderRadius: 999,
              background: "radial-gradient(circle, rgba(232, 163, 61, 0.35) 0%, transparent 70%)"
            }}
          />

          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "var(--turmeric)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 18px rgba(232, 163, 61, 0.4)"
                }}
              >
                <Sprout size={22} color="#231402" />
              </div>
              <span className="ge-serif" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.02em" }}>
                GramEye <span style={{ color: "var(--turmeric)" }}>AI</span>
              </span>
            </div>

            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 26,
                fontWeight: 600,
                lineHeight: 1.25,
                marginBottom: 12
              }}
            >
              {lang === "hi" ? "गाँव की तरक्की, अब एक क्लिक पर।" : "Smart Village Governance, Powered by AI."}
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#A8BFB0", marginBottom: 30 }}>
              {lang === "hi"
                ? "बिना किसी पासवर्ड के केवल अपना मोबाइल नंबर दर्ज करें और गाँव की समस्याओं का AI redressal शुरू करें।"
                : "Fast, passwordless login with SMS OTP. Report village issues, track panchayat resolutions, and earn citizen karma."}
            </p>

            {/* Feature Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["⚡ Instant Mobile OTP", "No complicated passwords needed"],
                ["📷 AI Vision Scanner", "Automatic hazard & category detection"],
                ["🏛️ Direct Panchayat Link", "Transparent accountability & live status"],
                ["🏆 Citizen Karma Rewards", "Earn XP & badges for your village"]
              ].map(([heading, sub], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 99,
                      background: "rgba(232, 163, 61, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <CheckCircle2 size={14} color="var(--turmeric)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#FBF8F0" }}>{heading}</div>
                    <div style={{ fontSize: 11, color: "#8EAA97" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: 24,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: 11.5,
              color: "#7E9685",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <ShieldCheck size={16} color="var(--turmeric)" />
            <span>Digital India & Gram Swaraj Aligned</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form */}
        <div style={{ padding: "40px 32px 34px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Simulated SMS Toast Banner */}
            {smsNotification && (
              <div
                style={{
                  background: "#132A1C",
                  color: "#FBF8F0",
                  border: "1.5px solid var(--turmeric)",
                  padding: "10px 14px",
                  borderRadius: 12,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  animation: "geFadeUp 0.3s ease-out"
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{smsNotification}</div>
                {sentOtp && (
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    style={{
                      background: "var(--turmeric)",
                      color: "#231402",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Auto-Fill
                  </button>
                )}
              </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: 18 }}>
              <div className="ge-serif" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-text)" }}>
                {step === "profile"
                  ? (lang === "hi" ? "अपनी प्रोफ़ाइल पूर्ण करें" : "Complete Your Profile")
                  : (lang === "hi" ? "लॉगिन या नया खाता बनाएं" : "Sign in to GramEye")}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {step === "otp"
                  ? (lang === "hi" ? `+91 ${mobile} पर भेजा गया 4-अंकीय कोड दर्ज करें` : `Enter the 4-digit code sent to +91 ${mobile}`)
                  : (lang === "hi" ? "अपने मोबाइल नंबर से तुरंत प्रवेश करें" : "Enter your phone number to continue with OTP")}
              </div>
            </div>

            {/* Auth Mode Tabs (Only on initial step) */}
            {step === "phone" && (
              <div style={{ display: "flex", borderBottom: "1px solid var(--line-dark)", marginBottom: 20 }}>
                <button
                  type="button"
                  className={`ge-auth-tab ${authMode === "otp" ? "active" : ""}`}
                  onClick={() => setAuthMode("otp")}
                >
                  📲 Mobile Number + OTP
                </button>
                <button
                  type="button"
                  className={`ge-auth-tab ${authMode === "password" ? "active" : ""}`}
                  onClick={() => setAuthMode("password")}
                >
                  ✉️ Email / Password
                </button>
              </div>
            )}

            {/* ERROR ALERT */}
            {error && (
              <div
                style={{
                  background: "rgba(214, 69, 69, 0.1)",
                  border: "1px solid rgba(214, 69, 69, 0.3)",
                  color: "var(--crit)",
                  padding: "9px 12px",
                  borderRadius: 10,
                  fontSize: 12.5,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* FLOW 1: MOBILE NUMBER ENTRY */}
            {authMode === "otp" && step === "phone" && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block", color: "var(--ink-text)" }}>
                  {lang === "hi" ? "मोबाइल नंबर" : "Mobile Phone Number"}
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    border: "1.5px solid var(--line-dark)",
                    borderRadius: 14,
                    overflow: "hidden",
                    marginBottom: 12
                  }}
                >
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "rgba(31, 77, 54, 0.05)",
                      borderRight: "1px solid var(--line-dark)",
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: "var(--ink-text)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number..."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    style={{
                      flex: 1,
                      border: "none",
                      padding: "13px 14px",
                      fontSize: 15,
                      fontFamily: "var(--font-mono)",
                      outline: "none",
                      color: "var(--ink-text)",
                      letterSpacing: "0.04em"
                    }}
                    autoFocus
                  />
                </div>

                {/* Quick Auto-Fill Chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobile("6268814185");
                      handleSendOtp("6268814185");
                    }}
                    style={{
                      background: "rgba(232, 163, 61, 0.14)",
                      border: "1px solid rgba(232, 163, 61, 0.3)",
                      color: "#995C08",
                      borderRadius: 99,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    ⚡ Try +91 6268814185
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobile("9876543210");
                      handleSendOtp("9876543210");
                    }}
                    style={{
                      background: "rgba(31, 77, 54, 0.08)",
                      border: "1px solid rgba(31, 77, 54, 0.2)",
                      color: "var(--paddy)",
                      borderRadius: 99,
                      padding: "4px 10px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    👤 Try 9876543210 (Demo)
                  </button>
                </div>

                <button
                  type="button"
                  className="ge-btn ge-btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: 14.5 }}
                  onClick={() => handleSendOtp()}
                  disabled={loading || mobile.length < 10}
                >
                  {loading ? <Loader2 size={16} style={{ animation: "geSpin 1s linear infinite" }} /> : <KeyRound size={16} />}
                  <span>{loading ? "Sending OTP..." : (lang === "hi" ? "ओटीपी प्राप्त करें" : "Get Verification OTP")}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* FLOW 2: OTP DIGIT ENTRY */}
            {authMode === "otp" && step === "otp" && (
              <div>
                {/* Prominent Verification Code Display Card */}
                <div
                  style={{
                    background: "rgba(232, 163, 61, 0.14)",
                    border: "1.5px solid var(--turmeric)",
                    borderRadius: 14,
                    padding: "12px 14px",
                    marginBottom: 16,
                    textAlign: "center",
                    boxShadow: "0 6px 18px -4px rgba(232,163,61,0.25)"
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5E34", marginBottom: 6 }}>
                    {lang === "hi" ? "🔑 आपका 4-अंकीय सत्यापन कोड (Verification Code):" : "🔑 Your 4-Digit Verification OTP Code:"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "6px",
                        color: "var(--paddy)",
                        background: "#fff",
                        padding: "4px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--line-dark)",
                        display: "inline-block"
                      }}
                    >
                      {sentOtp || "4829"}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="ge-btn ge-btn-primary"
                      style={{ padding: "6px 14px", fontSize: 12 }}
                    >
                      ⚡ 1-Click Auto-Fill
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                    {lang === "hi"
                      ? "लोकलहोस्ट पर बिना SMS क्रेडिट के टेस्ट करने के लिए कोड ऊपर दिया गया है।"
                      : "Displayed on screen for instant testing without requiring paid SMS gateway balance."}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0 16px" }}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpInputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="ge-otp-input"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {/* Mobile Notification & Dispatch Channels */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#F4F7F5",
                  border: "1px solid rgba(31,77,54,0.15)"
                }}>
                  <div style={{ fontSize: 12, color: "var(--ink-text)", fontWeight: 600, textAlign: "center" }}>
                    📲 {lang === "hi"
                      ? `ओटीपी आपके मोबाइल नंबर +91 ${(mobile || "6268814185").slice(-10)} पर भेजा गया है।`
                      : `OTP has been dispatched to +91 ${(mobile || "6268814185").slice(-10)}.`}
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href={`sms:+91${(mobile || "6268814185").slice(-10)}?body=Your%20GramEye%20AI%20OTP%20is%20${sentOtp || "4829"}`}
                      style={{
                        fontSize: 11.5,
                        color: "var(--paddy)",
                        fontWeight: 700,
                        textDecoration: "none",
                        padding: "5px 10px",
                        background: "#fff",
                        border: "1px solid var(--paddy)",
                        borderRadius: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      <span>📩 मोबाइल SMS खोलें (View SMS)</span>
                    </a>
                    <a
                      href={`https://wa.me/91${(mobile || "6268814185").slice(-10)}?text=Your%20GramEye%20AI%20Login%20Verification%20OTP%20code%20is%20${sentOtp || "4829"}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 11.5,
                        color: "#1E7E34",
                        fontWeight: 700,
                        textDecoration: "none",
                        padding: "5px 10px",
                        background: "#EAF8EF",
                        border: "1px solid #25D366",
                        borderRadius: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      <span>💬 WhatsApp पर OTP</span>
                    </a>
                  </div>
                </div>

                {/* Resend & Change Mobile */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, fontSize: 12.5 }}>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <ArrowLeft size={13} /> Change Number
                  </button>

                  <div>
                    {countdown > 0 ? (
                      <span style={{ color: "var(--muted)" }}>Resend code in <b>{countdown}s</b></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--paddy)",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="ge-btn ge-btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: 14.5 }}
                  onClick={handleVerifyOtp}
                  disabled={loading || otpDigits.join("").length < 4}
                >
                  {loading ? <Loader2 size={16} style={{ animation: "geSpin 1s linear infinite" }} /> : <CheckCircle2 size={16} />}
                  <span>{loading ? "Verifying..." : (lang === "hi" ? "सत्यापित करें एवं लॉगिन करें" : "Verify & Sign In")}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* FLOW 3: NEW USER PROFILE QUICK SETUP */}
            {step === "profile" && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Your Full Name / आपका नाम
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sahu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: "1.5px solid var(--line-dark)",
                      padding: "11px 14px",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Select Ward / वार्ड चुनें
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: "1.5px solid var(--line-dark)",
                      padding: "11px 14px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      outline: "none",
                      background: "#fff",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="Ward 1">Ward 1 — Village Entrance</option>
                    <option value="Ward 2">Ward 2 — Water Tank & Handpumps</option>
                    <option value="Ward 3">Ward 3 — Central Market & Bus Stop</option>
                    <option value="Ward 4">Ward 4 — Primary School & Health Post</option>
                    <option value="Ward 5">Ward 5 — Farmland & Substation</option>
                    <option value="Ward 6">Ward 6 — Temple Road & Pond</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Role / भूमिका
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole("citizen");
                        setError("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: 10,
                        border: `1.5px solid ${selectedRole === "citizen" ? "var(--paddy)" : "var(--line-dark)"}`,
                        background: selectedRole === "citizen" ? "rgba(31,77,54,0.08)" : "transparent",
                        fontWeight: 700,
                        fontSize: 12.5,
                        cursor: "pointer"
                      }}
                    >
                      👤 Citizen (नागरिक)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole("admin");
                        setError("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: 10,
                        border: `1.5px solid ${selectedRole === "admin" ? "var(--turmeric)" : "var(--line-dark)"}`,
                        background: selectedRole === "admin" ? "rgba(232,163,61,0.14)" : "transparent",
                        fontWeight: 700,
                        fontSize: 12.5,
                        cursor: "pointer"
                      }}
                    >
                      🛡️ Panchayat Admin
                    </button>
                  </div>

                  {/* Admin Password Requirement Box */}
                  {selectedRole === "admin" && (
                    <div style={{
                      marginTop: 14,
                      background: "#FFFBF2",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1.5px solid var(--turmeric)",
                      animation: "geFadeUp 0.2s ease-out"
                    }}>
                      <label style={{ fontSize: 12.5, fontWeight: 800, color: "#8B5E34", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Lock size={15} color="#8B5E34" />
                        {lang === "hi" ? "पंचायत एडमिन सुरक्षा पासवर्ड दर्ज करें *" : "Panchayat Admin Security Password *"}
                      </label>
                      <input
                        type="password"
                        placeholder="Enter admin password (e.g. amit@123)"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setError("");
                        }}
                        style={{
                          width: "100%",
                          borderRadius: 10,
                          border: "1.5px solid rgba(139,94,52,0.3)",
                          padding: "11px 14px",
                          fontSize: 14,
                          outline: "none",
                          background: "#fff",
                          boxSizing: "border-box",
                          fontWeight: 600,
                          letterSpacing: "0.05em"
                        }}
                        autoFocus
                      />
                      <div style={{ fontSize: 11.5, color: "#8B5E34", marginTop: 6, lineHeight: 1.4, fontWeight: 600 }}>
                        🔒 {lang === "hi" ? "सुरक्षा नियम: केवल अधिकृत पंचायत अधिकारियों के लिए पासवर्ड 'amit@123' मान्य है।" : "Security Rule: Password 'amit@123' is required to access Panchayat Admin privileges."}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="ge-btn ge-btn-primary"
                  style={{ width: "100%", padding: "13px", fontSize: 14 }}
                  onClick={handleCompleteProfile}
                >
                  <Sparkles size={16} /> Complete & Earn 150 Welcome XP
                </button>
              </div>
            )}

            {/* FLOW 4: EMAIL / PASSWORD MODE */}
            {authMode === "password" && step === "phone" && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: "1.5px solid var(--line-dark)",
                      padding: "11px 14px",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      border: "1.5px solid var(--line-dark)",
                      padding: "11px 14px",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="ge-btn ge-btn-primary"
                  style={{ width: "100%", padding: "13px", fontSize: 14, marginBottom: 14 }}
                  onClick={() => {
                    setError("");
                    const isAdminAttempt = email.toLowerCase().includes("admin") || email.toLowerCase().includes("sarpanch");
                    if (isAdminAttempt) {
                      if (password.trim().toLowerCase() !== "amit@123") {
                        setError(lang === "hi" ? "❌ गलत एडमिन पासवर्ड (Wrong Password)! पंचायत एडमिन पासवर्ड 'amit@123' है।" : "❌ Wrong Admin Password! Admin password is 'amit@123'.");
                        return;
                      }
                      handleQuickDemoLogin("admin");
                    } else {
                      handleQuickDemoLogin("citizen");
                    }
                  }}
                >
                  Sign In with Password
                </button>

                <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 10 }}>
                  Or test with verified demo roles:
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="ge-btn ge-btn-ghost"
                    style={{ flex: 1, padding: "8px", fontSize: 12 }}
                    onClick={() => handleQuickDemoLogin("citizen")}
                  >
                    👤 Demo Citizen
                  </button>
                  <button
                    type="button"
                    className="ge-btn ge-btn-ghost"
                    style={{ flex: 1, padding: "8px", fontSize: 12 }}
                    onClick={() => {
                      // Demo Admin requires amit@123 verification check
                      if (password.trim().toLowerCase() === "amit@123") {
                        handleQuickDemoLogin("admin");
                      } else {
                        setPassword("amit@123");
                        setError(lang === "hi" ? "🔑 एडमिन पासवर्ड 'amit@123' सेट किया गया। अब साइन इन करें।" : "🔑 Admin password 'amit@123' prefilled. Click sign in.");
                      }
                    }}
                  >
                    🛡️ Demo Admin (amit@123)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Terms */}
          <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 20 }}>
            By continuing, you agree to GramEye AI's{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span> and{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LOGOUT CONFIRMATION MODAL
   ============================================================ */
export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirmLogout,
  userName = "Rahul"
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(8, 19, 12, 0.78)",
        backdropFilter: "blur(12px)",
        animation: "geFadeIn 0.2s ease-out"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ge-card"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "32px 26px",
          textAlign: "center",
          borderRadius: 22,
          animation: "geFadeUp 0.25s ease-out"
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 99,
            background: "rgba(214, 69, 69, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}
        >
          <LogOut size={30} color="var(--crit)" />
        </div>

        <div className="ge-serif" style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-text)", marginBottom: 8 }}>
          Log out of GramEye?
        </div>

        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55, marginBottom: 24 }}>
          Goodbye for now, <b>{userName}</b>. You will need to enter your phone number and OTP to report issues or access your citizen karma rewards.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="ge-btn ge-btn-ghost"
            style={{ flex: 1, padding: "12px" }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--crit)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer"
            }}
            onClick={() => {
              onConfirmLogout();
              onClose();
            }}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
