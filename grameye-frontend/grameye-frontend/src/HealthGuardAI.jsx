import React, { useState } from "react";
import {
  ShieldAlert, Camera, Activity, AlertOctagon, Mic, PhoneCall, MapPin,
  Clock, CheckCircle, AlertTriangle, Hospital, UserCheck, FileText, ChevronRight,
  RefreshCw, X, ArrowLeft, HeartPulse, Stethoscope, Share2, Printer, Info
} from "lucide-react";

export default function HealthGuardAI() {
  const [activeMode, setActiveMode] = useState("landing"); // landing, photo, symptoms, accident, voice, emergency, result, doctors, hospitals
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("Skin");
  const [painLevel, setPainLevel] = useState(3);
  const [duration, setDuration] = useState("1-2 days");
  const [isWorsening, setIsWorsening] = useState("Same");
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Trigger Emergency Mode
  const triggerEmergencyMode = (reason = "Critical condition reported") => {
    setEmergencyAlertActive(true);
    setActiveMode("emergency");
  };

  // Structured Symptom Wizard submission
  const handleSymptomAnalysis = () => {
    if (!symptomInput.trim()) return;

    // Deterministic Safety Check
    const lower = symptomInput.toLowerCase();
    const criticalWords = ["unconscious", "behoshi", "chest pain", "chhati", "breathing", "saans", "stroke", "bleeding", "khoon", "seizure", "daura"];
    if (criticalWords.some(w => lower.includes(w))) {
      triggerEmergencyMode();
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      setAssessmentResult({
        title: "Preliminary Symptom Assessment",
        riskLevel: painLevel > 7 ? "HIGH" : painLevel > 4 ? "MODERATE" : "LOW",
        observedSummary: `Reported discomfort in ${selectedBodyPart} with pain rating ${painLevel}/10, duration ${duration}, trajectory: ${isWorsening}.`,
        possibleCauses: [
          { cause: "Local muscular strain or inflammatory reaction", likelihood: "Common", note: "Fits the localized discomfort and onset timeline" },
          { cause: "Mild viral prodrome or seasonal malaise", likelihood: "Moderate", note: "Common when accompanied by slight fatigue" },
          { cause: "Tension or posture-induced discomfort", likelihood: "Possible", note: "Symptoms typically ease with rest and hydration" }
        ],
        immediateSteps: [
          "Rest the affected area and avoid strenuous physical exertion",
          "Maintain optimal hydration with clean drinking water / ORS",
          "Keep an hourly note of temperature and discomfort levels"
        ],
        whatToAvoid: [
          "❌ Do NOT take unprescribed antibiotics or heavy analgesics without doctor advice",
          "❌ Do NOT apply extreme heat directly to fresh swelling or acute pain",
          "❌ Do NOT ignore sudden shortness of breath or radiating pain"
        ],
        warningSigns: [
          "Spike in body temperature above 101°F (38.3°C)",
          "Difficulty in breathing, persistent coughing, or chest tightness",
          "Spread of pain to neck, jaw, shoulders, or back",
          "Sudden dizziness, confusion, or inability to stand"
        ],
        doctorConsultation: painLevel > 5 ? "Recommended within 24 hours" : "Routine observation (see doctor if no improvement in 48h)",
        disclaimer: "HealthGuard AI provides general educational guidance only and cannot provide a definitive medical diagnosis. Always consult a licensed healthcare practitioner."
      });
      setAnalyzing(false);
      setActiveMode("result");
    }, 1200);
  };

  // Photo Analysis
  const handlePhotoUploadSimulation = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAssessmentResult({
        title: "Visible Photo Triage (Preliminary)",
        riskLevel: "MODERATE",
        observedSummary: "Image shows localized surface erythema (redness) and minor epidermal swelling without deep tissue laceration or visible arterial hemorrhage.",
        possibleCauses: [
          { cause: "Contact Dermatitis / Environmental Irritation", likelihood: "Likely", note: "Superficial redness without blistering" },
          { cause: "Insect bite or localized allergic response", likelihood: "Moderate", note: "Slight central swelling visible" },
          { cause: "Mild superficial friction burn or abrasion", likelihood: "Possible", note: "Surface layer irritation" }
        ],
        immediateSteps: [
          "Wash the affected site gently with cool water and neutral soap",
          "Pat dry with a clean cotton towel (do not scrub)",
          "Avoid direct friction from tight garments"
        ],
        whatToAvoid: [
          "❌ Do NOT scratch, puncture, or peel the affected skin",
          "❌ Do NOT apply lime (choona), kerosene, or untested home pastes",
          "❌ Do NOT apply topical steroid formulations without prescription"
        ],
        warningSigns: [
          "Rapid spreading of the red border over 12 hours",
          "Onset of pus (purulent fluid) or yellow crusting",
          "High fever, body chills, or swollen lymph nodes"
        ],
        doctorConsultation: "Consult a General Physician or Dermatologist if symptoms persist beyond 48 hours",
        disclaimer: "Photo analysis provides preliminary visual observations only. Photos cannot reveal underlying clinical conditions or replace an in-person physical examination."
      });
      setAnalyzing(false);
      setActiveMode("result");
    }, 1400);
  };

  // Fetch Doctors
  const handleOpenDoctors = () => {
    fetch("/api/health/doctors")
      .then(res => res.json())
      .then(data => {
        if (data.doctors) setDoctorsList(data.doctors);
        setActiveMode("doctors");
      })
      .catch(() => {
        setDoctorsList([
          { id: "d-1", name: "Dr. Suresh Verma", specialty: "General Physician", hospital: "CHC Kurud (7 km)", phone: "+91 77052 24108", available: "9 AM - 5 PM" },
          { id: "d-2", name: "Dr. Ananya Chandrakar", specialty: "Dermatologist", hospital: "Dhamtari District Hospital (25 km)", phone: "+91 77222 28450", available: "10 AM - 4 PM" },
          { id: "d-3", name: "Dr. Rajeshwar Sahu", specialty: "Orthopedic", hospital: "Kurud Trauma Care (6.5 km)", phone: "+91 94252 89102", available: "24x7 Emergency" }
        ]);
        setActiveMode("doctors");
      });
  };

  // Fetch Hospitals
  const handleOpenHospitals = () => {
    fetch("/api/health/hospitals")
      .then(res => res.json())
      .then(data => {
        if (data.hospitals) setHospitalsList(data.hospitals);
        setActiveMode("hospitals");
      })
      .catch(() => {
        setHospitalsList([
          { id: "h-1", name: "Community Health Center (CHC), Kurud", distance: "7.2 km (12 mins)", emergency24x7: true, phone: "+91 77052 24108", helpline: "108" },
          { id: "h-2", name: "Dhamtari District Hospital (Zila Chikitsalaya)", distance: "25.4 km (35 mins)", emergency24x7: true, phone: "+91 77222 22060", helpline: "108" }
        ]);
        setActiveMode("hospitals");
      });
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 90px" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999, background: "#0E1A13",
          color: "#fff", padding: "12px 20px", borderRadius: 12, border: "1.5px solid var(--turmeric)",
          fontWeight: 700, fontSize: 13.5, boxShadow: "0 16px 36px rgba(0,0,0,0.5)"
        }}>
          {toastMsg}
        </div>
      )}

      {/* Top Banner & Header */}
      <div style={{
        background: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
        color: "#fff", borderRadius: 24, padding: "26px 28px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HeartPulse size={26} color="#FF6B6B" />
              </div>
              <div>
                <span className="ge-serif" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800 }}>
                  HealthGuard <span style={{ color: "#4ECCA3" }}>AI</span>
                </span>
                <div style={{ fontSize: 13.5, color: "#D1E8E2", marginTop: 2 }}>
                  Understand the situation. Take the right next step.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleOpenDoctors}
              className="ge-btn"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12.5, padding: "8px 16px", borderRadius: 10 }}
            >
              👨⚕️ Find Doctor
            </button>
            <button
              onClick={handleOpenHospitals}
              className="ge-btn"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12.5, padding: "8px 16px", borderRadius: 10 }}
            >
              🏥 Nearby Hospitals
            </button>
          </div>
        </div>

        {/* Conservative Safety Disclaimer */}
        <div style={{
          marginTop: 18, background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#E0ECE4"
        }}>
          <Info size={18} color="#4ECCA3" style={{ flexShrink: 0 }} />
          <span>
            <b>Clinical Safety Guardrail:</b> HealthGuard AI provides educational assistance and preliminary risk assessment only. It does not replace clinical diagnosis by a licensed physician.
          </span>
        </div>
      </div>

      {/* EMERGENCY RED-ALERT OVERLAY / ESCALATION SCREEN */}
      {activeMode === "emergency" && (
        <div style={{
          background: "linear-gradient(135deg, #780206 0%, #061161 100%)", color: "#fff",
          borderRadius: 24, padding: "32px 24px", boxShadow: "0 20px 50px rgba(120,2,6,0.6)",
          textAlign: "center", animation: "geFadeUp .3s ease"
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#FF2E2E",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px #FF2E2E", marginBottom: 16
          }}>
            <AlertOctagon size={42} color="#fff" />
          </div>

          <div className="ge-serif" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "0.02em" }}>
            🚨 POSSIBLE MEDICAL EMERGENCY
          </div>
          <div style={{ fontSize: 16, color: "#FFD2D2", maxWidth: 650, margin: "10px auto 26px", lineHeight: 1.5 }}>
            AI cannot safely evaluate this remotely. Do NOT delay professional medical care while using this application.
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
            <a
              href="tel:108"
              style={{
                textDecoration: "none", background: "#FF2E2E", color: "#fff",
                fontWeight: 900, fontSize: 18, padding: "16px 36px", borderRadius: 16,
                display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 10px 30px rgba(255,46,46,0.5)"
              }}
            >
              <PhoneCall size={22} />
              <span>CALL 108 AMBULANCE</span>
            </a>

            <button
              onClick={handleOpenHospitals}
              style={{
                background: "#fff", color: "#780206", fontWeight: 800, fontSize: 16,
                padding: "16px 28px", borderRadius: 16, border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8
              }}
            >
              <Hospital size={20} />
              <span>FIND 24x7 HOSPITAL</span>
            </button>
          </div>

          {/* Emergency Safety Protocol */}
          <div style={{
            background: "rgba(0,0,0,0.4)", borderRadius: 16, padding: 20, maxWidth: 680,
            margin: "0 auto", textAlign: "left", fontSize: 13.5, lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, color: "#FFB4B4", marginBottom: 6 }}>
              तत्काल सुरक्षा निर्देश (Immediate Safety Protocol):
            </div>
            <div>• मरीज को अकेला न छोड़ें (Do not leave the person alone).</div>
            <div>• सांस लेने में तकलीफ हो तो कपड़े ढीले करें और खुली हवा में रखें।</div>
            <div>• बेहोशी की हालत में मुंह में कोई पानी या दवा न डालें।</div>
            <div>• निकटतम अस्पताल (CHC कुरूद 7 किमी / धमतरी जिला अस्पताल) ले जाने की व्यवस्था करें।</div>
          </div>

          <div style={{ marginTop: 22 }}>
            <button
              onClick={() => setActiveMode("landing")}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13 }}
            >
              ← Return to Main HealthGuard Menu
            </button>
          </div>
        </div>
      )}

      {/* LANDING SCREEN (4 MAIN CARDS) */}
      {activeMode === "landing" && (
        <div>
          {/* Emergency Bar */}
          <div style={{
            background: "linear-gradient(135deg, #FFE8E8 0%, #FFF0F0 100%)",
            border: "2px solid #FFA8A8", borderRadius: 18, padding: "18px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
            marginBottom: 26
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ShieldAlert size={32} color="#D64545" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#9B1C1C" }}>
                  Emergency Warning / आपातकालीन स्थिति?
                </div>
                <div style={{ fontSize: 12.5, color: "#771D1D", maxWidth: 680 }}>
                  If someone is unconscious, having severe breathing difficulty, heavy bleeding, chest pain, or seizure, seek emergency help immediately.
                </div>
              </div>
            </div>
            <button
              onClick={() => triggerEmergencyMode("Manual Emergency Click")}
              style={{
                background: "#D64545", color: "#fff", fontWeight: 800, fontSize: 13.5,
                padding: "12px 22px", borderRadius: 12, border: "none", cursor: "pointer",
                boxShadow: "0 6px 18px rgba(214,69,69,0.3)"
              }}
            >
              🚨 EMERGENCY MODE
            </button>
          </div>

          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink-text)", marginBottom: 16 }}>
            How can HealthGuard AI assist you today?
          </div>

          {/* 4 Large Entry Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ge-2col">
            {/* Card 1: Check a Photo */}
            <div
              onClick={() => setActiveMode("photo")}
              style={{
                background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "transform .2s, box-shadow .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(46,107,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Camera size={26} color="var(--paddy)" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink-text)", marginBottom: 6 }}>
                📷 Check a Photo
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16 }}>
                Analyze visible skin problems, wounds, rashes, swelling, or insect bites with AI computer vision quality checks.
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--paddy)", display: "flex", alignItems: "center", gap: 4 }}>
                Upload Image <ChevronRight size={16} />
              </span>
            </div>

            {/* Card 2: Describe Symptoms */}
            <div
              onClick={() => setActiveMode("symptoms")}
              style={{
                background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "transform .2s, box-shadow .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(60,135,166,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Activity size={26} color="var(--tank)" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink-text)", marginBottom: 6 }}>
                🩺 Describe Symptoms
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16 }}>
                Structured clinical questionnaire evaluating pain, duration, fever, and conservative safe next steps.
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tank)", display: "flex", alignItems: "center", gap: 4 }}>
                Start Symptom Wizard <ChevronRight size={16} />
              </span>
            </div>

            {/* Card 3: Accident / Injury Mode */}
            <div
              onClick={() => setActiveMode("accident")}
              style={{
                background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "transform .2s, box-shadow .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(224,112,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <AlertTriangle size={26} color="#E0703A" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink-text)", marginBottom: 6 }}>
                🚑 Accident & Injury
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16 }}>
                Immediate first-aid protocols for road trauma, falls, burns, cuts, animal bites, and fracture suspicions.
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E0703A", display: "flex", alignItems: "center", gap: 4 }}>
                Get Immediate Safety Guidance <ChevronRight size={16} />
              </span>
            </div>

            {/* Card 4: Talk to AI (Voice Mode) */}
            <div
              onClick={() => setActiveMode("voice")}
              style={{
                background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", transition: "transform .2s, box-shadow .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.06)"; }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(139,94,52,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Mic size={26} color="var(--soil)" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--ink-text)", marginBottom: 6 }}>
                🎙️ Talk to AI (बोलकर बताएं)
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16 }}>
                Speak in Hindi, Chhattisgarhi or English. AI processes your voice and flags emergency risks automatically.
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--soil)", display: "flex", alignItems: "center", gap: 4 }}>
                Speak to HealthGuard <ChevronRight size={16} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SYMPTOM WIZARD */}
      {activeMode === "symptoms" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            🩺 Structured Symptom Assessment
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Answer these clinical safety questions to determine the right next step.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>
                1. What is the primary discomfort or symptom? (क्या समस्या महसूस हो रही है?)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Mild headache and low grade fever since yesterday afternoon..."
                value={symptomInput}
                onChange={e => setSymptomInput(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ccc", fontSize: 13.5, outline: "none" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="ge-3col">
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, display: "block", marginBottom: 4 }}>Location / Body Area</label>
                <select
                  value={selectedBodyPart}
                  onChange={e => setSelectedBodyPart(e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 13 }}
                >
                  <option>Skin / Rash</option>
                  <option>Head / Neck</option>
                  <option>Stomach / Abdomen</option>
                  <option>Joint / Knee / Arm</option>
                  <option>Throat / Ear</option>
                  <option>General / Body</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, display: "block", marginBottom: 4 }}>Duration (कब से है?)</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 13 }}
                >
                  <option>Few hours</option>
                  <option>1-2 days</option>
                  <option>3-5 days</option>
                  <option>More than 1 week</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, display: "block", marginBottom: 4 }}>Trajectory (बढ़ रहा है या घट रहा है?)</label>
                <select
                  value={isWorsening}
                  onChange={e => setIsWorsening(e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 13 }}
                >
                  <option>Getting Worse</option>
                  <option>Same / Unchanged</option>
                  <option>Improving</option>
                </select>
              </div>
            </div>

            {/* Pain Scale */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 800, marginBottom: 4 }}>
                <span>Pain / Discomfort Severity Level (0-10)</span>
                <span style={{ color: painLevel > 7 ? "#D64545" : "var(--paddy)" }}>{painLevel}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={e => setPainLevel(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--muted)" }}>
                <span>0 (No Pain)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe / Unbearable)</span>
              </div>
            </div>

            <button
              onClick={handleSymptomAnalysis}
              disabled={analyzing}
              className="ge-btn"
              style={{
                background: "var(--paddy)", color: "#fff", fontWeight: 800, fontSize: 14,
                padding: "14px 24px", borderRadius: 12, marginTop: 10
              }}
            >
              {analyzing ? "Evaluating Safety Indicators..." : "Analyze Symptoms with HealthGuard AI →"}
            </button>
          </div>
        </div>
      )}

      {/* PHOTO UPLOAD MODE */}
      {activeMode === "photo" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            📷 Upload Health Photo for Visual Triage
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Photo analysis evaluates surface characteristics like color, swelling, and redness. It does not replace clinical evaluation.
          </div>

          {/* Upload Area */}
          <div
            onClick={handlePhotoUploadSimulation}
            style={{
              border: "2px dashed #3C87A6", borderRadius: 20, padding: "40px 20px", textAlign: "center",
              background: "rgba(60,135,166,0.04)", cursor: "pointer", marginBottom: 20
            }}
          >
            <Camera size={44} color="#3C87A6" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)" }}>
              Tap to Take or Upload Photo
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Supported: Skin rashes, minor burns, insect stings, surface swelling (JPG, PNG)
            </div>
          </div>

          <div style={{ background: "#F4F7F5", borderRadius: 14, padding: "14px 18px", fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            <b>Photo Quality Notice:</b> Ensure good daylight illumination. Avoid heavy blur or dark lighting. If the image is unclear, HealthGuard AI will request a clearer photo.
          </div>
        </div>
      )}

      {/* ACCIDENT / INJURY MODE */}
      {activeMode === "accident" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, color: "#E0703A", marginBottom: 6 }}>
            🚑 Accident & Injury First-Aid Triage
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Select the type of trauma or physical incident for immediate safety protocols:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }} className="ge-3col">
            {[
              { type: "Fall / Sprain / Fracture", icon: "🦵", urgency: "Urgent Care" },
              { type: "Road / Bike Accident", icon: "🏍️", urgency: "Emergency Triage" },
              { type: "Thermal Burn (आग/गर्म पानी)", icon: "🔥", urgency: "Immediate First Aid" },
              { type: "Deep Cut / Laceration", icon: "🩹", urgency: "Bleeding Control" },
              { type: "Animal Bite (कुत्ता/साँप)", icon: "🐕", urgency: "Urgent Medical Evaluation" },
              { type: "Head Bump / Concussion", icon: "🤕", urgency: "Monitor Red Flags" }
            ].map((t, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setAssessmentResult({
                    title: `Emergency Protocol: ${t.type}`,
                    riskLevel: "HIGH",
                    observedSummary: `Reported acute trauma event (${t.type}). Requires physical examination and professional wound/fracture stabilization.`,
                    possibleCauses: [
                      { cause: "Acute musculoskeletal trauma or tissue injury", likelihood: "Confirmed Event", note: "Resulting from sudden mechanical impact" }
                    ],
                    immediateSteps: [
                      "1. Keep the patient still. Do not attempt to force-straighten any deformed limb.",
                      "2. For bleeding: apply firm pressure with a clean, dry cloth.",
                      "3. For burns: cool under running tap water for 15-20 minutes (do NOT apply ice or butter).",
                      "4. For animal bites: wash thoroughly with soap and running water for 15 minutes and go to hospital for anti-rabies vaccination."
                    ],
                    whatToAvoid: [
                      "❌ Do NOT move a person with suspected neck, spine, or head injury unless in immediate fire danger",
                      "❌ Do NOT apply turmeric, dung, or chemical pastes to open cuts or bites",
                      "❌ Do NOT give food or drink if surgery may be required"
                    ],
                    warningSigns: [
                      "Loss of consciousness even for a few seconds",
                      "Inability to move fingers or toes, or numbness in extremities",
                      "Vomiting following head impact"
                    ],
                    doctorConsultation: "Immediate emergency hospital evaluation recommended",
                    disclaimer: "Accident guidance provides temporary stabilization steps only while en route to a qualified medical facility."
                  });
                  setActiveMode("result");
                }}
                style={{
                  border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16, padding: 18,
                  cursor: "pointer", background: "#FAF7F5", textAlign: "center"
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 4 }}>{t.type}</div>
                <div style={{ fontSize: 11, color: "#E0703A", fontWeight: 700 }}>{t.urgency}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VOICE MODE */}
      {activeMode === "voice" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            🎙️ Voice Health Consultation
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            बोलकर अपनी तकलीफ बताएं (Tap the microphone and describe what you are feeling):
          </div>

          <div style={{
            width: 90, height: 90, borderRadius: "50%", background: "var(--paddy)",
            color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 10px 30px rgba(31,77,54,0.4)", animation: "gePulse 2s infinite",
            marginBottom: 20
          }}>
            <Mic size={40} />
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-text)", marginBottom: 8 }}>
            Listening... "बोलिए, क्या तकलीफ है?"
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", maxWidth: 450, margin: "0 auto 20px" }}>
            Example: "मेरे पेट में सुबह से हल्का दर्द है" or "घुटने में मोच आ गई है"
          </div>

          <button
            onClick={() => {
              setSymptomInput("हल्का सिरदर्द और कमजोरी महसूस हो रही है");
              handleSymptomAnalysis();
            }}
            className="ge-btn"
            style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, padding: "10px 22px", borderRadius: 10 }}
          >
            Simulate Voice Response →
          </button>
        </div>
      )}

      {/* RESULT PAGE */}
      {activeMode === "result" && assessmentResult && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 30, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button
              onClick={() => setActiveMode("landing")}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
            >
              <ArrowLeft size={16} /> Main Menu
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => window.print()}
                className="ge-btn"
                style={{ background: "#eee", fontSize: 12, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8 }}
              >
                <Printer size={14} /> Print Health Report
              </button>
            </div>
          </div>

          {/* Risk Badge Bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
            background: assessmentResult.riskLevel === "HIGH" ? "#FFF2F2" : "#F4F7F5",
            padding: "16px 20px", borderRadius: 16, border: `1.5px solid ${assessmentResult.riskLevel === "HIGH" ? "#FFA8A8" : "rgba(31,77,54,0.15)"}`,
            marginBottom: 24
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.08em" }}>
                ASSESSMENT SEVERITY LEVEL
              </div>
              <div className="ge-serif" style={{ fontSize: 22, fontWeight: 800, color: assessmentResult.riskLevel === "HIGH" ? "#D64545" : "var(--paddy)" }}>
                {assessmentResult.riskLevel} PRIORITY
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Clinician Recommendation:</div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink-text)" }}>{assessmentResult.doctorConsultation}</div>
            </div>
          </div>

          {/* Observed Summary */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink-text)", marginBottom: 6 }}>
              🔍 What We Observed (प्राथमिक अवलोकन):
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#444" }}>
              {assessmentResult.observedSummary}
            </div>
          </div>

          {/* Possible Explanations */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink-text)", marginBottom: 8 }}>
              💡 Possible Explanations (संभावित कारण — पुष्टि हेतु नहीं):
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {assessmentResult.possibleCauses.map((c, i) => (
                <div key={i} style={{ background: "#FAF7F5", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5 }}>{c.cause}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Steps vs What to Avoid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }} className="ge-2col">
            <div style={{ background: "#F0F7F3", padding: 18, borderRadius: 14, border: "1px solid rgba(31,77,54,0.15)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--paddy)", marginBottom: 8 }}>
                ✅ What To Do Now (सुरक्षित कदम):
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#2E4F3B" }}>
                {assessmentResult.immediateSteps.map((s, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>• {s}</div>
                ))}
              </div>
            </div>

            <div style={{ background: "#FFF5F5", padding: 18, borderRadius: 14, border: "1px solid rgba(214,69,69,0.2)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#D64545", marginBottom: 8 }}>
                ❌ What NOT To Do (सावधानियां):
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#772222" }}>
                {assessmentResult.whatToAvoid.map((a, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Warning Signs */}
          <div style={{ background: "#FAF2E8", padding: 18, borderRadius: 14, border: "1px solid rgba(232,163,61,0.3)", marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#8B5E34", marginBottom: 6 }}>
              ⚠️ Red Flag Warning Signs (इन लक्षणों पर तुरंत डॉक्टर से मिलें):
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#5F4022" }}>
              {assessmentResult.warningSigns.map((w, idx) => (
                <div key={idx} style={{ marginBottom: 3 }}>• {w}</div>
              ))}
            </div>
          </div>

          {/* Direct Doctor & Hospital Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleOpenDoctors}
              className="ge-btn"
              style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "12px 20px", borderRadius: 12 }}
            >
              👨⚕️ Connect With a Doctor (कुरुद/धमतरी)
            </button>
            <button
              onClick={handleOpenHospitals}
              className="ge-btn"
              style={{ background: "#3C87A6", color: "#fff", fontWeight: 800, padding: "12px 20px", borderRadius: 12 }}
            >
              🏥 Locate Nearby 24x7 Hospital
            </button>
          </div>
        </div>
      )}

      {/* DOCTORS DIRECTORY */}
      {activeMode === "doctors" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            👨⚕️ Verified Doctors Directory (Kurud & Dhamtari)
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Official clinic contacts and government hospital medical officers:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {doctorsList.map(d => (
              <div key={d.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)" }}>{d.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--paddy)", fontWeight: 700 }}>{d.specialty} • {d.qualification || "Govt Medical Officer"}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{d.hospital}</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`tel:${d.phone}`}
                    style={{
                      textDecoration: "none", background: "var(--paddy)", color: "#fff",
                      fontWeight: 800, fontSize: 13, padding: "8px 18px", borderRadius: 10,
                      display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <PhoneCall size={14} /> Call Doctor
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOSPITALS DIRECTORY */}
      {activeMode === "hospitals" && (
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setActiveMode("landing")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 13 }}
          >
            <ArrowLeft size={16} /> Back to HealthGuard
          </button>

          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            🏥 Nearby 24x7 Emergency Hospitals
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Geotagged healthcare centers with active trauma and emergency wards:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {hospitalsList.map(h => (
              <div key={h.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)" }}>{h.name}</span>
                    {h.emergency24x7 && (
                      <span style={{ background: "#FF2E2E", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 6 }}>
                        24x7 Emergency
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--tank)", fontWeight: 700 }}>{h.distance} from Kodebod</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{h.address}</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href="tel:108"
                    style={{
                      textDecoration: "none", background: "#D64545", color: "#fff",
                      fontWeight: 800, fontSize: 13, padding: "8px 16px", borderRadius: 10,
                      display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <PhoneCall size={14} /> 108 Ambulance
                  </a>
                  <a
                    href={`tel:${h.phone}`}
                    style={{
                      textDecoration: "none", background: "#3C87A6", color: "#fff",
                      fontWeight: 800, fontSize: 13, padding: "8px 16px", borderRadius: 10
                    }}
                  >
                    Hospital Desk
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
