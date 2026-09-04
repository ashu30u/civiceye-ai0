import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin, Camera, Mic, FileText, ChevronRight, ChevronLeft, ChevronDown, CheckCircle2,
  AlertTriangle, TrendingUp, Users, Award, Droplet, Zap, Trash2, Construction,
  School, HeartPulse, Bus, Trees, Home, LayoutDashboard, Map as MapIcon,
  BarChart3, Bell, Settings, LogOut, Search, Sparkles, Upload, X, Star,
  Trophy, Flame, ShieldAlert, Clock, ArrowRight, Menu, Globe, User, Loader2,
  Check, RotateCcw, Sprout, Sun, Waves, Building2, Leaf, MessageSquare, Send,
  Navigation, RefreshCw, Volume2, Image as ImageIcon
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie,
  Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import Footer from "./Footer.jsx";
import AuthModal, { LogoutConfirmModal } from "./AuthModal.jsx";
import WorkOrderModal from "./WorkOrderModal.jsx";
import GramNidhi from "./GramNidhi.jsx";
import GramSabha from "./GramSabha.jsx";
import VoiceSahayakModal from "./VoiceSahayakModal.jsx";
import NoticeBoard from "./NoticeBoard.jsx";
import EmergencyAlertModal from "./EmergencyAlertModal.jsx";
import KisanPortal from "./KisanPortal.jsx";
import CertificatePortal from "./CertificatePortal.jsx";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const TOKENS = `
  :root{
    --ink:#0B1710;
    --ink-2:#132A1C;
    --paddy:#1F4D36;
    --paddy-light:#2E6B4A;
    --turmeric:#E8A33D;
    --turmeric-light:#F4C374;
    --tank:#3C87A6;
    --tank-light:#6FADC7;
    --husk:#F4EEE0;
    --husk-2:#FBF8F0;
    --soil:#8B5E34;
    --crit:#D64545;
    --high:#E0703A;
    --med:#E8A33D;
    --low:#5FA872;
    --ink-text:#0E1A13;
    --muted:#5C6E62;
    --line: rgba(255,255,255,0.09);
    --line-dark: rgba(14,26,19,0.10);
    --radius: 18px;
    --shadow: 0 20px 50px -20px rgba(6,20,12,0.45);
    --font-display: 'Fraunces', 'Georgia', serif;
    --font-body: 'Manrope', 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }
  .ge-root{ font-family:var(--font-body); color:var(--ink-text); background:var(--husk-2); }
  .ge-root, .ge-root *{ box-sizing:border-box; }
  .ge-serif{ font-family:var(--font-display); }
  .ge-mono{ font-family:var(--font-mono); }

  @keyframes geFadeUp{ from{opacity:0; transform:translateY(18px)} to{opacity:1; transform:translateY(0)} }
  @keyframes geFadeIn{ from{opacity:0} to{opacity:1} }
  @keyframes gePulse{ 0%,100%{ transform:scale(1); opacity:1 } 50%{ transform:scale(1.35); opacity:0.35 } }
  @keyframes geScan{ 0%{ top:6% } 100%{ top:92% } }
  @keyframes geShimmer{ 0%{ background-position:-200px 0 } 100%{ background-position:200px 0 } }
  @keyframes geFloat{ 0%,100%{ transform:translateY(0px) } 50%{ transform:translateY(-10px) } }
  @keyframes geSpin{ to{ transform:rotate(360deg) } }
  @keyframes geGrow{ from{ width:0 } }
  @keyframes geWave{ 0%,100%{ height: 6px } 50%{ height: 28px } }
  @keyframes geLaserScan{ 0%{ top: 4%; opacity: 0.7 } 50%{ opacity: 1 } 100%{ top: 92%; opacity: 0.7 } }
  @keyframes gePulseGlow{ 0%{ box-shadow: 0 0 0 0 rgba(232,163,61,0.7) } 70%{ box-shadow: 0 0 0 14px rgba(232,163,61,0) } 100%{ box-shadow: 0 0 0 0 rgba(232,163,61,0) } }
  @keyframes geSuccessPop{ 0%{ transform: scale(0.75); opacity: 0 } 70%{ transform: scale(1.06); opacity: 1 } 100%{ transform: scale(1); opacity: 1 } }
  @keyframes geRadarPing{ 0%{ transform: scale(0.8); opacity: 0.9 } 100%{ transform: scale(2.2); opacity: 0 } }
  @media (prefers-reduced-motion: reduce){
    .ge-root *{ animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important; }
  }

  .ge-fadeup{ animation: geFadeUp 0.7s cubic-bezier(.2,.8,.2,1) both; }
  .ge-glass{
    background: rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(14px);
    border-radius: var(--radius);
  }
  .ge-card{
    background: var(--husk-2);
    border:1px solid var(--line-dark);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  .ge-btn{
    display:inline-flex; align-items:center; gap:8px; justify-content:center;
    font-family:var(--font-body); font-weight:700; font-size:14px;
    padding:13px 22px; border-radius:999px; border:none; cursor:pointer;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
    letter-spacing:0.01em;
  }
  .ge-btn:active{ transform:scale(0.97); }
  .ge-btn-primary{ background:var(--turmeric); color:#231402; box-shadow:0 10px 24px -8px rgba(232,163,61,0.55); }
  .ge-btn-primary:hover{ background:var(--turmeric-light); transform:translateY(-2px); }
  .ge-btn-outline{ background:transparent; color:var(--husk); border:1.5px solid rgba(255,255,255,0.35); }
  .ge-btn-outline:hover{ background:rgba(255,255,255,0.08); }
  .ge-btn-dark{ background:var(--ink); color:var(--husk-2); }
  .ge-btn-dark:hover{ background:var(--ink-2); transform:translateY(-2px); }
  .ge-btn-ghost{ background:rgba(14,26,19,0.06); color:var(--ink-text); }
  .ge-btn-ghost:hover{ background:rgba(14,26,19,0.12); }
  .ge-btn:disabled{ opacity:0.45; cursor:not-allowed; transform:none !important; }

  .ge-chip{ display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; font-size:12px; font-weight:700; letter-spacing:0.02em; }
  .ge-scroll::-webkit-scrollbar{ height:6px; width:6px; }
  .ge-scroll::-webkit-scrollbar-thumb{ background:rgba(0,0,0,0.15); border-radius:10px; }
`;

/* ============================================================
   TRANSLATIONS
   ============================================================ */
const T = {
  en: {
    tagline: "Your Village. Your Voice. Smarter Tomorrow.",
    sub: "Report village problems, track their resolution, and help build a smarter, safer and better-connected community.",
    reportProblem: "Report a Problem",
    exploreVillage: "Explore Village",
    step_photo: "📷 Take a photo of the problem",
    step_voice: "🎙️ Speak your problem",
    step_location: "📍 Choose the location",
    step_next: "➡️ Continue",
    goodMorning: "Good Morning",
    village: "Rampur Village",
  },
  hi: {
    tagline: "आपका गाँव। आपकी आवाज़। स्मार्ट कल।",
    sub: "गाँव की समस्याएँ दर्ज करें, उनका समाधान ट्रैक करें, और एक स्मार्ट व सुरक्षित समुदाय बनाने में मदद करें।",
    reportProblem: "समस्या दर्ज करें",
    exploreVillage: "गाँव देखें",
    step_photo: "📷 समस्या की फोटो लें",
    step_voice: "🎙️ अपनी समस्या बोलें",
    step_location: "📍 जगह चुनें",
    step_next: "➡️ आगे बढ़ें",
    goodMorning: "सुप्रभात",
    village: "रामपुर गाँव",
  },
};

/* ============================================================
   MOCK DATA / DOMAIN LOGIC
   ============================================================ */
const CATEGORIES = [
  { key: "Road Damage", icon: Construction, color: "#E0703A", dept: "Public Works", baseSeverity: "HIGH" },
  { key: "Water Leakage", icon: Droplet, color: "#3C87A6", dept: "Water Department", baseSeverity: "MEDIUM" },
  { key: "Broken Streetlight", icon: Zap, color: "#E8A33D", dept: "Electricity Department", baseSeverity: "MEDIUM" },
  { key: "Garbage & Drainage", icon: Trash2, color: "#7A8B4A", dept: "Sanitation", baseSeverity: "MEDIUM" },
  { key: "Electrical Hazard", icon: ShieldAlert, color: "#D64545", dept: "Electricity Department", baseSeverity: "CRITICAL" },
  { key: "School Infrastructure", icon: School, color: "#7A5FBF", dept: "Education", baseSeverity: "HIGH" },
  { key: "Healthcare Access", icon: HeartPulse, color: "#C9598B", dept: "Healthcare", baseSeverity: "HIGH" },
  { key: "Transport Issue", icon: Bus, color: "#4A6FBF", dept: "Transport", baseSeverity: "LOW" },
  { key: "Environmental", icon: Trees, color: "#3E8E5C", dept: "Environment", baseSeverity: "LOW" },
];

const SEVERITY_COLOR = { LOW: "var(--low)", MEDIUM: "var(--med)", HIGH: "var(--high)", CRITICAL: "var(--crit)" };
const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const STATUS_FLOW = ["PENDING", "VERIFIED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];
const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6"];

function catOf(key) { return CATEGORIES.find(c => c.key === key) || CATEGORIES[0]; }

function seedComplaints() {
  const seeds = [
    ["Large pothole outside primary school", "Road Damage", "Ward 4", "HIGH", "IN_PROGRESS", 64],
    ["Handpump broken for 5 days", "Water Leakage", "Ward 2", "HIGH", "ASSIGNED", 20],
    ["Streetlight out near bus stop", "Broken Streetlight", "Ward 1", "MEDIUM", "PENDING", 0],
    ["Garbage piling near market", "Garbage & Drainage", "Ward 3", "MEDIUM", "IN_PROGRESS", 45],
    ["Exposed live wire near field", "Electrical Hazard", "Ward 5", "CRITICAL", "ASSIGNED", 10],
    ["Cracked classroom wall", "School Infrastructure", "Ward 4", "HIGH", "RESOLVED", 100],
    ["Blocked drain, water stagnating", "Garbage & Drainage", "Ward 2", "MEDIUM", "RESOLVED", 100],
    ["No streetlight on temple road", "Broken Streetlight", "Ward 6", "LOW", "PENDING", 0],
    ["Irregular bus stop shelter damaged", "Transport Issue", "Ward 3", "LOW", "VERIFIED", 12],
    ["Pond edge eroding near farmland", "Environmental", "Ward 6", "MEDIUM", "IN_PROGRESS", 30],
    ["Health sub-centre roof leaking", "Healthcare Access", "Ward 5", "HIGH", "PENDING", 0],
    ["Road washed out after rain", "Road Damage", "Ward 1", "CRITICAL", "IN_PROGRESS", 55],
  ];
  return seeds.map((s, i) => {
    const [title, category, ward, severity, status, progress] = s;
    return {
      id: `GRM-${1020 + i}`,
      title, category, ward, severity, status, progress,
      dept: catOf(category).dept,
      reporter: i % 3 === 0 ? "You" : ["Meena D.", "Suresh K.", "Anita P.", "Ramesh V."][i % 4],
      createdAt: `2026-0${(i % 6) + 2}-${10 + i}`,
      confidence: 0.88 + (i % 7) * 0.01,
      votes: 3 + i * 2,
    };
  });
}

const BADGES = [
  { name: "Village Helper", icon: Users, color: "#3C87A6" },
  { name: "Water Guardian", icon: Droplet, color: "#3C87A6" },
  { name: "Road Reporter", icon: Construction, color: "#E0703A" },
  { name: "Green Champion", icon: Leaf, color: "#3E8E5C" },
  { name: "Community Hero", icon: Trophy, color: "#E8A33D" },
];

const LEADERBOARD = [
  { name: "You", xp: 340, badges: ["Village Helper", "Road Reporter"] },
  { name: "Meena D.", xp: 620, badges: ["Community Hero", "Water Guardian", "Green Champion"] },
  { name: "Suresh K.", xp: 480, badges: ["Road Reporter", "Village Helper"] },
  { name: "Anita P.", xp: 410, badges: ["Green Champion"] },
  { name: "Ramesh V.", xp: 290, badges: ["Village Helper"] },
].sort((a, b) => b.xp - a.xp);

/* deterministic mock "AI" */
function mockAnalyze({ category, description }) {
  const c = catOf(category);
  let severity = c.baseSeverity;
  const text = (description || "").toLowerCase();
  if (text.includes("school") || text.includes("hospital") || text.includes("बच्च")) {
    severity = severity === "LOW" ? "MEDIUM" : severity === "MEDIUM" ? "HIGH" : "CRITICAL";
  }
  if (text.includes("wire") || text.includes("fire") || text.includes("आग")) severity = "CRITICAL";
  const confidence = 0.86 + Math.min(0.12, (description || "").length * 0.002);
  const risk = {
    CRITICAL: "Immediate danger to life or property",
    HIGH: "Accident or health hazard if unresolved",
    MEDIUM: "Growing inconvenience for residents",
    LOW: "Minor issue, monitor over time",
  }[severity];
  return {
    problemType: category,
    category: category,
    severity,
    confidence: Math.min(0.98, confidence),
    suggestedDepartment: c.dept,
    safetyRisk: risk,
  };
}

function findDuplicates(complaints, { category, ward }) {
  return complaints.filter(c => c.category === category && c.ward === ward && c.status !== "RESOLVED");
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function StatusBadge({ status }) {
  const map = {
    PENDING: { bg: "#F4EEE0", fg: "#8B5E34", label: "Pending" },
    VERIFIED: { bg: "#E7F0FB", fg: "#3C87A6", label: "Verified" },
    ASSIGNED: { bg: "#EFE9FB", fg: "#7A5FBF", label: "Assigned" },
    IN_PROGRESS: { bg: "#FDF0DC", fg: "#B97417", label: "In Progress" },
    RESOLVED: { bg: "#E7F5EA", fg: "#2E6B4A", label: "Resolved" },
    REOPENED: { bg: "#FBE7E7", fg: "#B23A3A", label: "Reopened" },
  };
  const s = map[status] || map.PENDING;
  return <span className="ge-chip" style={{ background: s.bg, color: s.fg }}>{s.label}</span>;
}

function SeverityBadge({ severity }) {
  return (
    <span className="ge-chip" style={{ background: SEVERITY_COLOR[severity] + "22", color: SEVERITY_COLOR[severity] }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: SEVERITY_COLOR[severity] }} />
      {severity}
    </span>
  );
}

function ProgressBar({ value, color = "var(--turmeric)" }) {
  return (
    <div style={{ height: 7, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Counter({ to, duration = 1400, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setSeen(true);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setV(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
      else setV(to);
    }
    requestAnimationFrame(step);
  }, [seen, to, duration]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

function CategoryIcon({ category, size = 18, box }) {
  const c = catOf(category);
  const Icon = c.icon;
  if (box) {
    return (
      <div style={{ width: box, height: box, borderRadius: 12, background: c.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={box * 0.5} color={c.color} />
      </div>
    );
  }
  return <Icon size={size} color={c.color} />;
}

/* ============================================================
   VILLAGE MAP (SVG, mock)
   ============================================================ */
const WARD_POS = {
  "Ward 1": { x: 90, y: 80 }, "Ward 2": { x: 230, y: 60 }, "Ward 3": { x: 340, y: 130 },
  "Ward 4": { x: 260, y: 230 }, "Ward 5": { x: 120, y: 240 }, "Ward 6": { x: 60, y: 160 },
};

function VillageMap({ complaints, onSelectWard, selectedWard, height = 340 }) {
  return (
    <svg viewBox="0 0 420 320" width="100%" height={height} style={{ display: "block" }}>
      <rect x="0" y="0" width="420" height="320" fill="#DCEEE0" rx="18" />
      <path d="M0 60 C 100 30, 300 90, 420 40" stroke="#B7D9BE" strokeWidth="18" fill="none" opacity="0.6" />
      <path d="M40 0 C 90 120, 60 220, 100 320" stroke="#EADFC2" strokeWidth="14" fill="none" opacity="0.7" />
      <path d="M0 200 C 150 180, 260 260, 420 210" stroke="#EADFC2" strokeWidth="14" fill="none" opacity="0.7" />
      <circle cx="360" cy="260" r="26" fill="#9FCBE0" opacity="0.8" />
      <text x="360" y="264" fontSize="9" textAnchor="middle" fill="#215A73" fontFamily="var(--font-body)">Tank</text>
      {WARDS.map(w => {
        const p = WARD_POS[w];
        const wComplaints = complaints.filter(c => c.ward === w);
        const critical = wComplaints.filter(c => c.severity === "CRITICAL" || c.severity === "HIGH").length;
        const active = selectedWard === w;
        return (
          <g key={w} onClick={() => onSelectWard(w)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={active ? 30 : 26} fill="#FBF8F0" stroke={active ? "#E8A33D" : "#1F4D36"} strokeWidth={active ? 3 : 1.5} opacity="0.95" />
            <text x={p.x} y={p.y - 2} fontSize="10" fontWeight="700" textAnchor="middle" fill="#132A1C" fontFamily="var(--font-body)">{w.replace("Ward ", "W")}</text>
            <text x={p.x} y={p.y + 11} fontSize="8" textAnchor="middle" fill="#5C6E62" fontFamily="var(--font-body)">{wComplaints.length} issues</text>
            {critical > 0 && (
              <circle cx={p.x + 20} cy={p.y - 20} r="6" fill="#D64545">
                <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   VILLAGE ILLUSTRATION (CSS-parallax hero, no heavy 3D)
   ============================================================ */
function VillageScene() {
  const [mx, setMx] = useState(0);
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMx(((e.clientX - r.left) / r.width - 0.5) * 14);
      }}
      style={{ position: "relative", minHeight: 250, height: "clamp(250px, 42vw, 420px)", width: "100%", maxWidth: "100%", borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg,#F4C374 0%, #E8A33D 32%, #1F4D36 33%, #0B1710 100%)" }}
    >
      <div style={{ position: "absolute", top: 30, right: 60, width: 70, height: 70, borderRadius: 99, background: "#FBF3D8", boxShadow: "0 0 60px 20px rgba(251,243,216,0.5)", transform: `translateX(${mx * 0.4}px)` }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", bottom: 40 + (i % 2) * 14, left: `${8 + i * 18}%`,
          width: 46, height: 46, transform: `translateX(${mx * (0.6 + i * 0.15)}px)`,
          transition: "transform 0.15s ease-out"
        }}>
          <div style={{ width: 0, height: 0, borderLeft: "23px solid transparent", borderRight: "23px solid transparent", borderBottom: "20px solid #8B5E34" }} />
          <div style={{ width: 46, height: 26, background: "#F4EEE0", borderRadius: "2px 2px 0 0" }} />
        </div>
      ))}
      {[...Array(8)].map((_, i) => (
        <div key={"t" + i} style={{
          position: "absolute", bottom: 25, left: `${2 + i * 12.4}%`, width: 10, height: 34,
          transform: `translateX(${mx * (0.3 + (i % 3) * 0.2)}px)`, transition: "transform 0.15s ease-out"
        }}>
          <div style={{ width: 3, height: 18, background: "#5C4326", margin: "16px auto 0" }} />
          <div style={{ width: 26, height: 26, borderRadius: "50% 50% 50% 0", background: "#2E6B4A", position: "absolute", top: -6, left: -8 }} />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 26, background: "#132A1C" }} />
      <div style={{ position: "absolute", bottom: 26, left: "40%", width: 60, height: 60, borderRadius: "50%", border: "5px solid #3C87A6", background: "#6FADC7AA", transform: `translateX(${mx * 0.5}px)` }} />
      <div style={{ position: "absolute", top: 16, left: 16, color: "#FBF8F0", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", opacity: 0.85 }}>
        LIVE VILLAGE VIEW · RAMPUR
      </div>
    </div>
  );
}

/* ============================================================
   NAVBAR (CLEAN, MODULAR & ZERO-OVERLAP RESPONSIVE)
   ============================================================ */
function Navbar({
  page, setPage, lang, setLang, role, setRole, xp,
  currentUser, onOpenAuthModal, onOpenLogoutModal,
  onOpenVoiceSahayak, onOpenEmergencyAlert
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isDark = page === "landing";

  // Core 4 Direct Tabs on Desktop
  const coreLinks = role === "citizen"
    ? [
        ["citizenDashboard", "Dashboard"],
        ["report", "Report"],
        ["noticeBoard", "📢 Notices"],
        ["kisanPortal", "🌾 Kisan"]
      ]
    : [
        ["adminDashboard", "Command Center"],
        ["adminComplaints", "Complaints"],
        ["noticeBoard", "📢 Notices"],
        ["kisanPortal", "🌾 Kisan"]
      ];

  // Services Dropdown Menu
  const serviceLinks = [
    ["certificates", "📜 Certificates (प्रमाण पत्र)", "Instant Digital Panchayat Certificates"],
    ["gramNidhi", "💰 Gram Nidhi (बजट लेजर)", "100% Transparent Public Works & Bills"],
    ["gramSabha", "🗳️ Gram Sabha (जनमत व प्रस्ताव)", "Propose Village Works & Community Voting"],
    ["map", "🗺️ Village Map (गाँव का नक्शा)", "GIS Ward Map with Real-time Complaints"],
    ["rewards", "🏆 Rewards & Karma (सम्मान)", "Citizen Karma, Badges & Leaderboard"]
  ];

  const isServiceActive = serviceLinks.some(([k]) => k === page);

  const navigateTo = (p) => {
    setPage(p);
    setServicesOpen(false);
    setMobileDrawerOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: isDark ? "rgba(11,23,16,0.95)" : "rgba(251,248,240,0.96)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(14,26,19,0.08)"}`
      }}>
        <div style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}>
        {/* BRAND LOGO */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigateTo("landing")}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "var(--turmeric)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(232,163,61,0.35)"
          }}>
            <Sprout size={19} color="#231402" />
          </div>
          <span className="ge-serif" style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#FBF8F0" : "#132A1C", letterSpacing: "0.01em" }}>
            GramEye <span style={{ color: "var(--turmeric)" }}>AI</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS (VISIBLE ON >= 921px) */}
        <div className="ge-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {coreLinks.map(([key, label]) => (
            <button
              key={key}
              onClick={() => navigateTo(key)}
              className="ge-btn"
              style={{
                background: page === key ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(14,26,19,0.08)") : "transparent",
                color: isDark ? "#FBF8F0" : "#132A1C",
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: page === key ? 800 : 600,
                whiteSpace: "nowrap"
              }}
            >
              {label}
            </button>
          ))}

          {/* Services Dropdown Button */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setServicesOpen(!servicesOpen)}
              className="ge-btn"
              style={{
                background: isServiceActive
                  ? (isDark ? "rgba(232,163,61,0.22)" : "rgba(232,163,61,0.15)")
                  : (servicesOpen ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(14,26,19,0.06)") : "transparent"),
                color: isServiceActive ? "var(--turmeric)" : (isDark ? "#FBF8F0" : "#132A1C"),
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: isServiceActive ? 800 : 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap"
              }}
            >
              <span>🏛️ ग्राम सेवाएँ (Services)</span>
              <ChevronDown size={14} style={{ transform: servicesOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>

            {/* Services Floating Card */}
            {servicesOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 310,
                  background: "#FBF8F0",
                  border: "1px solid var(--line-dark)",
                  borderRadius: 16,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                  padding: 8,
                  zIndex: 80,
                  animation: "geFadeUp 0.2s ease-out"
                }}
              >
                {serviceLinks.map(([key, label, desc]) => (
                  <div
                    key={key}
                    onClick={() => navigateTo(key)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: page === key ? "rgba(31,77,54,0.09)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      transition: "background .15s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(31,77,54,0.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = page === key ? "rgba(31,77,54,0.09)" : "transparent")}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: page === key ? "var(--paddy)" : "#0E1A13" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ACTION BUTTONS (NO OVERLAP) */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          {/* Emergency Siren Pill Button */}
          <button
            type="button"
            onClick={onOpenEmergencyAlert}
            style={{
              background: "rgba(214,69,69,0.14)",
              color: "var(--crit)",
              border: "1.5px solid var(--crit)",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 11.5,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            title="आपदा सायरन अलर्ट"
          >
            <span>🚨</span>
            <span className="ge-hide-sm">आपदा</span>
          </button>

          {/* AI Voice Sahayak Button */}
          <button
            type="button"
            className="ge-hide-sm"
            onClick={onOpenVoiceSahayak}
            style={{
              background: "rgba(232,163,61,0.16)",
              color: "#995C08",
              border: "1.5px solid var(--turmeric)",
              borderRadius: 999,
              padding: "5px 10px",
              fontSize: 11.5,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            title="बोलकर सवाल पूछें"
          >
            <Mic size={13} color="#995C08" />
            <span>AI बोलें</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="ge-btn ge-hide-sm"
            style={{
              background: "transparent",
              color: isDark ? "#FBF8F0" : "#132A1C",
              padding: "5px 8px",
              fontSize: 12,
              fontWeight: 700
            }}
          >
            <Globe size={13} /> {lang === "en" ? "हिं" : "EN"}
          </button>

          {/* XP Chip (Hidden on very small screens) */}
          <div className="ge-chip ge-hide-sm" style={{ background: "var(--turmeric)22", color: "#B97417", gap: 4, padding: "5px 9px", fontSize: 11 }}>
            <Flame size={12} /> {xp} XP
          </div>

          {/* User Profile Pill / Menu */}
          {currentUser ? (
            <div style={{ position: "relative" }} className="ge-hide-sm">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 8px 3px 3px",
                  borderRadius: 999,
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(14,26,19,0.12)"}`,
                  background: isDark ? "rgba(255,255,255,0.08)" : "#fff",
                  color: isDark ? "#FBF8F0" : "#0E1A13",
                  cursor: "pointer"
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 99,
                    background: role === "admin" ? "var(--turmeric)" : "var(--paddy)",
                    color: role === "admin" ? "#231402" : "#fff",
                    fontWeight: 800,
                    fontSize: 11.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {(currentUser.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700 }} className="ge-hide-sm">
                  {(currentUser.fullName || "Citizen").split(" ")[0]}
                </span>
                <ChevronDown size={11} color="var(--muted)" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 240,
                    background: "#FBF8F0",
                    border: "1px solid var(--line-dark)",
                    borderRadius: 16,
                    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                    padding: 14,
                    zIndex: 90,
                    color: "#0E1A13",
                    animation: "geFadeUp 0.2s ease-out"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: role === "admin" ? "var(--turmeric)" : "var(--paddy)",
                        color: role === "admin" ? "#231402" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14
                      }}
                    >
                      {(currentUser.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{currentUser.fullName}</div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)" }}>+91 {currentUser.mobile || "6268814185"}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(31,77,54,0.06)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      marginBottom: 10,
                      fontSize: 11,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>📍 {currentUser.ward || "Ward 3"}</span>
                    <span style={{ fontWeight: 700, color: "var(--turmeric)" }}>{xp} XP</span>
                  </div>

                  <div style={{ borderTop: "1px solid var(--line-dark)", paddingTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onOpenLogoutModal();
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(214,69,69,0.08)",
                        color: "var(--crit)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      <LogOut size={13} /> Log Out / साइन आउट
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="ge-btn ge-btn-primary ge-hide-sm"
              onClick={onOpenAuthModal}
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <User size={13} /> Sign In
            </button>
          )}

          {/* MOBILE HAMBURGER BUTTON (VISIBLE ONLY ON <= 920px) */}
          <button
            type="button"
            className="ge-mobile-menu-btn"
            onClick={() => setMobileDrawerOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: isDark ? "#FBF8F0" : "#132A1C",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Open Mobile Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </div>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY (FULL VIEWPORT) */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 99999,
            background: "rgba(8, 19, 12, 0.78)",
            display: "flex",
            justifyContent: "flex-end",
            animation: "geFadeIn 0.2s ease-out"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileDrawerOpen(false);
          }}
        >
          <div
            style={{
              width: "86%",
              maxWidth: 340,
              height: "100vh",
              background: "#FBF8F0",
              boxShadow: "-10px 0 35px rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "20px 16px",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              zIndex: 100000,
              animation: "geFadeUp 0.25s ease-out"
            }}
          >
            <div>
              {/* Drawer Top Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sprout size={18} color="#231402" />
                  </div>
                  <span className="ge-serif" style={{ fontSize: 18, fontWeight: 700 }}>GramEye AI</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* User Greeting Card */}
              {currentUser ? (
                <div style={{ background: "#fff", border: "1px solid var(--line-dark)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 99, background: "var(--paddy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                      {(currentUser.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5 }}>{currentUser.fullName}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>📍 {currentUser.ward || "Ward 3"} • <span style={{ color: "var(--turmeric)", fontWeight: 700 }}>{xp} XP</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onOpenAuthModal();
                    }}
                    className="ge-btn ge-btn-primary"
                    style={{ width: "100%", padding: "10px", fontSize: 12.5 }}
                  >
                    <User size={14} /> Sign In (लॉगिन / खाता बनाएं)
                  </button>
                </div>
              )}

              {/* Mobile Quick Action Pills (Language & Voice Assistant) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                <button
                  type="button"
                  onClick={() => setLang(lang === "en" ? "hi" : "en")}
                  style={{
                    background: "rgba(14,26,19,0.06)",
                    border: "1px solid var(--line-dark)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    cursor: "pointer",
                    color: "var(--ink-text)"
                  }}
                >
                  <Globe size={14} />
                  <span>{lang === "en" ? "हिन्दी करें" : "English"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenVoiceSahayak();
                  }}
                  style={{
                    background: "rgba(232,163,61,0.16)",
                    border: "1px solid var(--turmeric)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    cursor: "pointer",
                    color: "#995C08"
                  }}
                >
                  <Mic size={14} />
                  <span>AI बोलें</span>
                </button>
              </div>

              {/* All Navigation Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  ["citizenDashboard", "🏠 Dashboard (डैशबोर्ड)"],
                  ["report", "📸 Report a Problem (समस्या दर्ज करें)"],
                  ["noticeBoard", "📢 Notice Board (नोटिस बोर्ड)"],
                  ["kisanPortal", "🌾 Kisan Kendra (किसान फसल डॉक्टर व मंडी)"],
                  ["certificates", "📜 Certificates (डिजिटल प्रमाण पत्र)"],
                  ["map", "🗺️ Village Map (गाँव का लाइव नक्शा)"],
                  ["gramNidhi", "💰 Gram Nidhi (बजट व ऑडिट लेजर)"],
                  ["gramSabha", "🗳️ Gram Sabha (जनमत व प्रस्ताव)"],
                  ["rewards", "🏆 Rewards & Karma (नागरिक सम्मान)"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => navigateTo(key)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: page === key ? "rgba(31,77,54,0.12)" : "transparent",
                      color: page === key ? "var(--paddy)" : "#132A1C",
                      fontWeight: page === key ? 800 : 600,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{label}</span>
                    <ChevronRight size={13} color="var(--muted)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div style={{ borderTop: "1px solid var(--line-dark)", paddingTop: 14 }}>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenLogoutModal();
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: "rgba(214,69,69,0.08)",
                    color: "var(--crit)",
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  <LogOut size={14} /> Log Out / साइन आउट
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenAuthModal();
                  }}
                  className="ge-btn ge-btn-primary"
                  style={{ width: "100%", padding: "11px", fontSize: 13 }}
                >
                  <User size={14} /> Sign In (लॉगिन करें)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileBottomNav({ page, setPage, role }) {
  const items = [
    ["citizenDashboard", Home, "Home"],
    ["noticeBoard", Bell, "Notices"],
    ["report", Camera, "Report"],
    ["kisanPortal", Sprout, "Kisan"],
    ["rewards", User, "Profile"]
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(251, 248, 240, 0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(14,26,19,0.12)",
        display: "flex",
        zIndex: 50
      }}
      className="ge-mobile-nav"
    >
      {items.map(([key, Icon, label], i) => {
        const isActive = page === key;
        const isCenter = label === "Report";

        return (
          <button
            key={i}
            onClick={() => setPage(key)}
            style={{
              flex: 1,
              border: "none",
              background: "none",
              padding: "8px 0 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: isActive ? "var(--paddy)" : "#829487",
              cursor: "pointer",
              transform: isCenter ? "translateY(-8px)" : "none"
            }}
          >
            {isCenter ? (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  background: "var(--turmeric)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 18px rgba(232,163,61,0.6)"
                }}
              >
                <Icon size={20} color="#231402" />
              </div>
            ) : (
              <Icon size={18} />
            )}
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 600 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   LANDING PAGE
   ============================================================ */
function Landing({ setPage, lang, complaints }) {
  const resolved = complaints.filter(c => c.status === "RESOLVED").length;
  const rate = Math.round((resolved / complaints.length) * 100);
  const t = T[lang];

  const steps = [
    { icon: Camera, title: "Report", body: "Snap a photo, speak, or type — pin the exact location in seconds." },
    { icon: Sparkles, title: "AI Analyzes", body: "Category, severity and the responsible department are detected instantly." },
    { icon: Users, title: "Panchayat Acts", body: "Verified issues are assigned to the right department and tracked." },
    { icon: CheckCircle2, title: "Village Improves", body: "Before/after proof, citizen verification, and a rising Village Score." },
  ];

  const faqs = [
    ["Do I need to know the department to report a problem?", "No — GramEye AI detects the category and routes it to the right department automatically."],
    ["What if I don't have a smartphone camera?", "You can describe the problem in text or by voice in Hindi or English."],
    ["How is severity decided?", "A transparent scoring model weighs danger, people affected, and proximity to schools or hospitals."],
    ["Can two people report the same problem?", "Yes — GramEye AI detects likely duplicates and merges them into one tracked issue."],
  ];
  const [faqOpen, setFaqOpen] = useState(0);

  return (
    <div style={{ background: "var(--ink)", color: "#FBF8F0" }}>
      {/* HERO */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 20px 36px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 36, alignItems: "center" }} className="ge-hero-grid">
        <div className="ge-fadeup">
          <div className="ge-chip" style={{ background: "rgba(232,163,61,0.14)", color: "var(--turmeric-light)", marginBottom: 16 }}>
            <Sparkles size={13} /> AI-Powered Village Governance
          </div>
          <h1 className="ge-serif" style={{ fontSize: "clamp(26px, 5.5vw, 56px)", lineHeight: 1.12, fontWeight: 600, margin: "0 0 16px", wordBreak: "break-word", overflowWrap: "break-word" }}>
            {t.tagline.split(". ").map((line, i) => <div key={i}>{line}{i < t.tagline.split(". ").length - 1 ? "." : ""}</div>)}
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "rgba(251,248,240,0.72)", maxWidth: 480, marginBottom: 24 }}>{t.sub}</p>
          <div className="ge-hero-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="ge-btn ge-btn-primary" onClick={() => setPage("report")} style={{ padding: "14px 22px", fontSize: 14.5 }}>
              {t.reportProblem} <ArrowRight size={16} />
            </button>
            <button className="ge-btn ge-btn-outline" onClick={() => setPage("map")} style={{ padding: "14px 22px", fontSize: 14.5 }}>
              {t.exploreVillage}
            </button>
          </div>
        </div>
        <div className="ge-fadeup" style={{ animationDelay: "0.15s" }}>
          <VillageScene />
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "34px 24px", display: "grid", gridTemplateColorumns: "repeat(4,1fr)", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="ge-stats-grid">
          {[
            [12480, "+", "Citizens"], [complaints.length * 107, "", "Problems Reported"], [resolved * 107, "", "Problems Resolved"], [rate, "%", "Resolution Rate"]
          ].map(([n, suf, label], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="ge-serif" style={{ fontSize: 34, fontWeight: 600, color: "var(--turmeric)" }}><Counter to={n} suffix={suf} /></div>
              <div style={{ fontSize: 13, color: "rgba(251,248,240,0.6)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHeading eyebrow="How GramEye Works" title="From a photo to a fixed problem" dark />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 40 }} className="ge-4col">
          {steps.map((s, i) => (
            <div key={i} className="ge-glass ge-fadeup" style={{ padding: 24, animationDelay: `${i * 0.08}s` }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <s.icon size={21} color="#231402" />
              </div>
              <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--turmeric-light)", marginBottom: 6 }}>0{i + 1}</div>
              <div className="ge-serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: "rgba(251,248,240,0.65)", lineHeight: 1.55 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SCANNER PREVIEW */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="ge-hero-grid">
        <div>
          <SectionHeading eyebrow="AI Problem Scanner" title="Every report is read by AI in seconds" dark align="left" />
          <p style={{ color: "rgba(251,248,240,0.65)", fontSize: 14.5, lineHeight: 1.6, marginTop: 14, maxWidth: 440 }}>
            Category, severity, safety risk, and the right department are surfaced automatically — so nothing waits in an inbox.
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Detects 16 common village problem types", "Flags safety risk near schools & hospitals", "Suggests the correct department instantly", "Catches duplicate reports before they're filed"].map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, color: "rgba(251,248,240,0.85)" }}>
                <CheckCircle2 size={16} color="var(--turmeric)" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <ScannerPreviewCard />
      </section>

      {/* CATEGORIES */}
      <section style={{ background: "var(--husk-2)", color: "var(--ink-text)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="Coverage" title="Village problem categories GramEye understands" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 36 }} className="ge-3col">
            {CATEGORIES.map((c, i) => (
              <div key={i} className="ge-card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <CategoryIcon category={c.key} box={44} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.key}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>→ {c.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP PREVIEW + VILLAGE SCORE */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 30 }} className="ge-hero-grid">
        <div className="ge-glass" style={{ padding: 20 }}>
          <SectionHeading eyebrow="Live Village Map" title="See every open issue, ward by ward" dark align="left" small />
          <div style={{ marginTop: 16 }}>
            <VillageMap complaints={complaints} onSelectWard={() => setPage("map")} selectedWard={null} height={280} />
          </div>
        </div>
        <div className="ge-glass" style={{ padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="ge-chip" style={{ background: "rgba(232,163,61,0.14)", color: "var(--turmeric-light)", alignSelf: "flex-start" }}>Village Development Index</div>
          <div className="ge-serif" style={{ fontSize: 52, fontWeight: 600, margin: "14px 0 4px" }}>78<span style={{ fontSize: 22, opacity: 0.5 }}>/100</span></div>
          <div style={{ fontSize: 13, color: "rgba(251,248,240,0.6)", marginBottom: 18 }}>Rampur Village — updated weekly from live complaint data</div>
          {[["Infrastructure", 72], ["Water", 65], ["Sanitation", 81], ["Electricity", 85]].map(([label, v], i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "rgba(251,248,240,0.75)" }}>
                <span>{label}</span><span>{v}</span>
              </div>
              <ProgressBar value={v} color="var(--turmeric)" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "var(--paddy)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="Community Voices" title="What villagers are saying" dark />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 38 }} className="ge-3col">
            {[
              ["Meena D.", "Ward 2", "I reported our broken handpump in the morning — by evening the department had already responded."],
              ["Suresh K.", "Ward 4", "The AI knew it was a road hazard near the school before I even finished writing the description."],
              ["Anita P.", "Ward 6", "I like seeing the before and after photos. It finally feels like reports don't disappear."],
            ].map(([name, ward, quote], i) => (
              <div key={i} className="ge-glass" style={{ padding: 22 }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(251,248,240,0.9)", marginBottom: 16 }}>"{quote}"</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{name} <span style={{ fontWeight: 400, opacity: 0.6 }}>· {ward}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHeading eyebrow="FAQ" title="Common questions" dark />
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map(([q, a], i) => (
            <div key={i} className="ge-glass" style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 14.5 }}>
                {q} <ChevronRight size={16} style={{ transform: faqOpen === i ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
              </div>
              {faqOpen === i && <div style={{ fontSize: 13.5, color: "rgba(251,248,240,0.7)", marginTop: 10, lineHeight: 1.6 }}>{a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 90px" }}>
        <div style={{ background: "linear-gradient(120deg, var(--turmeric), var(--high))", borderRadius: 28, padding: "56px 40px", textAlign: "center", color: "#231402" }}>
          <div className="ge-serif" style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>See a problem in your village?</div>
          <div style={{ fontSize: 14.5, marginBottom: 24, opacity: 0.85 }}>It takes under a minute to report, and AI does the rest.</div>
          <button className="ge-btn ge-btn-dark" onClick={() => setPage("report")} style={{ padding: "15px 30px", fontSize: 15 }}>{t.reportProblem} <ArrowRight size={16} /></button>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "34px 24px", textAlign: "center", color: "rgba(251,248,240,0.5)", fontSize: 12.5 }}>
        GramEye AI — Intelligent Digital Village Problem Reporting & Smart Governance Platform. Built as a civic-tech capstone demo.
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, dark, align = "center", small }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 560 : "none", margin: align === "center" ? "0 auto" : 0 }}>
      <div className="ge-chip" style={{ background: dark ? "rgba(232,163,61,0.14)" : "rgba(31,77,54,0.09)", color: dark ? "var(--turmeric-light)" : "var(--paddy)", marginBottom: 12 }}>{eyebrow}</div>
      <div className="ge-serif" style={{ fontSize: small ? 21 : "clamp(24px,3vw,32px)", fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
}

function ScannerPreviewCard() {
  const [i, setI] = useState(0);
  const phases = ["Reading image…", "Detecting category…", "Estimating severity…", "Matching department…"];
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % phases.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ge-glass" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", height: 150, borderRadius: 14, background: "linear-gradient(135deg,#2E6B4A,#132A1C)", overflow: "hidden", marginBottom: 16 }}>
        <Construction size={46} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 20, top: 20 }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "var(--turmeric)", boxShadow: "0 0 14px 3px rgba(232,163,61,0.8)", animation: "geScan 1.8s ease-in-out infinite alternate" }} />
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--turmeric-light)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <Loader2 size={13} style={{ animation: "geSpin 1s linear infinite" }} /> {phases[i]}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
        {[["Category", "Road Damage"], ["Severity", "HIGH"], ["Confidence", "94%"], ["Department", "Public Works"]].map(([k, v], idx) => (
          <div key={idx} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "9px 12px" }}>
            <div style={{ opacity: 0.55, fontSize: 10.5 }}>{k}</div>
            <div style={{ fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CITIZEN DASHBOARD
   ============================================================ */
function CitizenDashboard({ complaints, setPage, setSelectedComplaint, xp }) {
  const mine = complaints.filter(c => c.reporter === "You");
  const resolved = mine.filter(c => c.status === "RESOLVED").length;
  const inProgress = mine.filter(c => c.status === "IN_PROGRESS" || c.status === "ASSIGNED").length;
  const pending = mine.filter(c => c.status === "PENDING" || c.status === "VERIFIED").length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div className="ge-serif" style={{ fontSize: 28, fontWeight: 600 }}>Good Morning, Rahul 👋</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>Rampur Village · Ward 4</div>
        </div>
        <button className="ge-btn ge-btn-primary" onClick={() => setPage("report")}><Sparkles size={15} /> Report a Problem</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 30 }} className="ge-5col">
        <ScoreCard label="Village Health Score" value="78" suffix="/100" accent="var(--turmeric)" />
        <StatCard label="My Reports" value={mine.length} icon={FileText} color="var(--paddy)" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="var(--low)" />
        <StatCard label="In Progress" value={inProgress} icon={Clock} color="var(--turmeric)" />
        <StatCard label="Pending" value={pending} icon={AlertTriangle} color="var(--high)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="ge-hero-grid">
        <div className="ge-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Recent Reports</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mine.length === 0 && <EmptyState text="You haven't reported anything yet — tap Report a Problem to get started." />}
            {mine.map(c => (
              <div key={c.id} onClick={() => { setSelectedComplaint(c); setPage("complaintDetail"); }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, border: "1px solid var(--line-dark)", cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(31,77,54,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <CategoryIcon category={c.category} box={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="ge-mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.id}</span>
                    <SeverityBadge severity={c.severity} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, margin: "3px 0" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 6, alignItems: "center" }}><MapPin size={11} /> {c.ward}</div>
                </div>
                <div style={{ width: 90, textAlign: "right" }}>
                  <StatusBadge status={c.status} />
                  <div style={{ marginTop: 8 }}><ProgressBar value={c.progress} color={SEVERITY_COLOR[c.severity]} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="ge-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={16} color="var(--turmeric)" /> Your Progress</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{xp} XP · Level {Math.floor(xp / 200) + 1}</div>
            <ProgressBar value={(xp % 200) / 2} color="var(--turmeric)" />
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {BADGES.slice(0, 3).map((b, i) => (
                <div key={i} className="ge-chip" style={{ background: b.color + "18", color: b.color }}><b.icon size={12} /> {b.name}</div>
              ))}
            </div>
            <button className="ge-btn ge-btn-ghost" style={{ width: "100%", marginTop: 14 }} onClick={() => setPage("rewards")}>View Leaderboard</button>
          </div>

          <div className="ge-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Bell size={16} color="var(--paddy)" /> Notifications</div>
            {[
              ["GRM-1023 has been assigned to Electricity Dept.", "2h ago"],
              ["Your report earned +20 XP", "1d ago"],
              ["GRM-1025 marked Resolved — please verify", "2d ago"],
            ].map(([msg, when], i) => (
              <div key={i} style={{ fontSize: 12.5, padding: "9px 0", borderTop: i > 0 ? "1px solid var(--line-dark)" : "none" }}>
                <div>{msg}</div>
                <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, suffix, accent }) {
  return (
    <div className="ge-card" style={{ padding: 16, background: "linear-gradient(135deg, var(--ink), var(--paddy))", color: "#fff" }}>
      <div style={{ fontSize: 11.5, opacity: 0.75 }}>{label}</div>
      <div className="ge-serif" style={{ fontSize: 26, fontWeight: 600, color: accent, marginTop: 4 }}>{value}<span style={{ fontSize: 13, opacity: 0.7 }}>{suffix}</span></div>
    </div>
  );
}
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="ge-card" style={{ padding: 16 }}>
      <Icon size={17} color={color} />
      <div className="ge-serif" style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}
function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--muted)" }}>
      <FileText size={26} style={{ marginBottom: 10, opacity: 0.4 }} />
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  );
}

/* ============================================================
   PRESET SCENARIOS & SAMPLE PHOTOS (SVG DATA URLS)
   ============================================================ */
const PRESET_ROAD = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="roadBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#242826"/><stop offset="100%" stop-color="#121614"/></linearGradient>
    <linearGradient id="mud" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#543d25"/><stop offset="100%" stop-color="#25170c"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#roadBg)"/>
  <path d="M 0 160 L 800 150 L 800 450 L 0 450 Z" fill="#1b1f1d"/>
  <line x1="0" y1="290" x2="800" y2="290" stroke="#E8A33D" stroke-dasharray="40 30" stroke-width="7" opacity="0.65"/>
  <ellipse cx="420" cy="300" rx="140" ry="70" fill="url(#mud)"/>
  <ellipse cx="420" cy="300" rx="120" ry="55" fill="#140c06"/>
  <path d="M 330 280 Q 380 340 460 330 Q 530 300 490 260 Q 420 250 330 280 Z" fill="#0b0704"/>
  <path d="M 310 270 L 240 240 M 520 320 L 610 350 M 460 360 L 480 410" stroke="#0e1411" stroke-width="3.5"/>
  <rect x="260" y="210" width="340" height="170" fill="none" stroke="#E0703A" stroke-width="2.5" stroke-dasharray="8 6"/>
  <rect x="260" y="184" width="240" height="26" rx="4" fill="#E0703A"/>
  <text x="270" y="202" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">AI VISION: ROAD DAMAGE (POTHOLE)</text>
</svg>
`)}`;

const PRESET_WATER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="soil" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#423022"/><stop offset="100%" stop-color="#22170e"/></linearGradient>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3C87A6"/><stop offset="100%" stop-color="#19485C"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#soil)"/>
  <ellipse cx="410" cy="320" rx="260" ry="85" fill="url(#waterGrad)" opacity="0.9"/>
  <ellipse cx="410" cy="320" rx="200" ry="60" fill="#5fb5db" opacity="0.45"/>
  <rect x="180" y="220" width="340" height="42" rx="6" fill="#6d7570"/>
  <rect x="230" y="210" width="22" height="62" rx="4" fill="#444b47"/>
  <circle cx="430" cy="240" r="14" fill="#1b1e1d"/>
  <path d="M 430 240 Q 480 130 540 230" stroke="#b2e5fa" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9"/>
  <path d="M 430 240 Q 410 120 460 250" stroke="#ffffff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.9"/>
  <rect x="330" y="120" width="270" height="230" fill="none" stroke="#3C87A6" stroke-width="2.5" stroke-dasharray="8 6"/>
  <rect x="330" y="94" width="240" height="26" rx="4" fill="#3C87A6"/>
  <text x="340" y="112" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">AI VISION: MAIN WATER PIPELINE LEAK</text>
</svg>
`)}`;

const PRESET_WIRE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1c1614"/><stop offset="100%" stop-color="#0f0d0c"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#darkBg)"/>
  <rect x="200" y="50" width="32" height="400" fill="#4d4540"/>
  <rect x="140" y="90" width="160" height="18" fill="#35302c"/>
  <rect x="150" y="110" width="90" height="110" fill="#202020" rx="4"/>
  <path d="M 170 220 Q 280 370 400 380 Q 460 385 530 360" stroke="#0a0a0a" stroke-width="6" fill="none"/>
  <circle cx="400" cy="380" r="18" fill="#ffdd44" opacity="0.95"/>
  <circle cx="400" cy="380" r="36" fill="#ff4411" opacity="0.3"/>
  <path d="M 390 360 L 410 400 M 380 390 L 420 370" stroke="#ffffff" stroke-width="3.5"/>
  <rect x="290" y="290" width="240" height="130" fill="none" stroke="#D64545" stroke-width="2.5" stroke-dasharray="8 6"/>
  <rect x="290" y="264" width="250" height="26" rx="4" fill="#D64545"/>
  <text x="300" y="282" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">AI VISION: EXPOSED LIVE WIRE (440V)</text>
</svg>
`)}`;

const PRESET_LIGHT = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#081016"/><stop offset="100%" stop-color="#121d26"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#nightSky)"/>
  <rect x="0" y="380" width="800" height="70" fill="#0b130e"/>
  <path d="M 320 400 L 330 180 Q 335 120 400 100 L 460 90" stroke="#717a74" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M 460 90 L 470 140" stroke="#111" stroke-width="4"/>
  <rect x="440" y="140" width="50" height="22" rx="4" fill="#2d302e" transform="rotate(35 465 151)"/>
  <circle cx="490" cy="165" r="7" fill="#443212"/>
  <rect x="280" y="60" width="260" height="210" fill="none" stroke="#E8A33D" stroke-width="2.5" stroke-dasharray="8 6"/>
  <rect x="280" y="34" width="240" height="26" rx="4" fill="#E8A33D"/>
  <text x="290" y="52" fill="#231402" font-family="sans-serif" font-size="12" font-weight="bold">AI VISION: BROKEN STREETLIGHT POLE</text>
</svg>
`)}`;

const PRESET_SCENARIOS = [
  {
    id: "p1",
    label: "🛣️ Pothole Road",
    sub: "Ward 4 • School Rd",
    category: "Road Damage",
    ward: "Ward 4",
    description: "Deep pothole outside primary school gate. Water stagnating after rain, risky for students and cyclists.",
    image: PRESET_ROAD
  },
  {
    id: "p2",
    label: "💧 Pipe Burst",
    sub: "Ward 2 • Tank Area",
    category: "Water Leakage",
    ward: "Ward 2",
    description: "Main drinking water pipe burst near community tank. Clean water flowing onto road continuously.",
    image: PRESET_WATER
  },
  {
    id: "p3",
    label: "⚡ Live Wire",
    sub: "Ward 5 • Farmland",
    category: "Electrical Hazard",
    ward: "Ward 5",
    description: "High voltage wire snapped and hanging low near cattle walking path. Dangerous sparks visible.",
    image: PRESET_WIRE
  },
  {
    id: "p4",
    label: "💡 Streetlight Out",
    sub: "Ward 1 • Entrance",
    category: "Broken Streetlight",
    ward: "Ward 1",
    description: "Main entrance pole light broken, total pitch darkness at night causing safety and mobility hazard.",
    image: PRESET_LIGHT
  }
];

/* ============================================================
   UPGRADED REPORT FLOW COMPONENT
   ============================================================ */
function ReportFlow({ complaints, addComplaint, setPage, setSelectedComplaint, addXp, lang }) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("photo");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState(null);

  // Photographic Evidence State
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [detectedAiBadge, setDetectedAiBadge] = useState("");

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("hi-IN");
  const [speechStatus, setSpeechStatus] = useState("");
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);

  // GPS Geolocation State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsInfo, setGpsInfo] = useState(null);
  const [gpsVerified, setGpsVerified] = useState(false);

  // AI Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [dupChoice, setDupChoice] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const t = T[lang];

  const duplicates = ward && category ? findDuplicates(complaints, { category, ward }) : [];

  // File Upload Handling
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageName(file.name);
      runMiniScan(file.name);
    };
    reader.readAsDataURL(file);
  };

  const runMiniScan = (nameHint = "") => {
    setIsScanningImage(true);
    setTimeout(() => {
      setIsScanningImage(false);
      const lower = (nameHint + " " + description).toLowerCase();
      let autoCat = category;
      if (!autoCat) {
        if (lower.includes("road") || lower.includes("pothole") || lower.includes("सड़क")) autoCat = "Road Damage";
        else if (lower.includes("water") || lower.includes("pipe") || lower.includes("पानी")) autoCat = "Water Leakage";
        else if (lower.includes("wire") || lower.includes("electric") || lower.includes("बिजली")) autoCat = "Electrical Hazard";
        else if (lower.includes("light") || lower.includes("pole") || lower.includes("बत्ती")) autoCat = "Broken Streetlight";
        else autoCat = "Road Damage";
        setCategory(autoCat);
      }
      setDetectedAiBadge(`⚡ AI Vision: ${autoCat || "Problem"} Detected • 96% Match`);
    }, 1100);
  };

  // Quick Preset Selector
  const selectPreset = (preset) => {
    setImagePreview(preset.image);
    setImageName(preset.label);
    setCategory(preset.category);
    setDescription(preset.description);
    if (!ward) setWard(preset.ward);
    setDetectedAiBadge(`⚡ AI Vision: ${preset.category} Detected • 98% Match`);
    setIsScanningImage(true);
    setTimeout(() => setIsScanningImage(false), 800);
  };

  // Voice Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setSpeechStatus("Stopped");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      handleSimulateVoice();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = speechLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechStatus(speechLang === "hi-IN" ? "माइक चालू है — बोलिए..." : "Listening — speak clearly...");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        const textSpoken = (final || interim).trim();
        if (textSpoken) {
          setDescription((prev) => (prev ? prev + " " + textSpoken : textSpoken));
          autoDetectCategoryFromText(textSpoken);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechStatus("Microphone error. Falling back to simulator.");
        handleSimulateVoice();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      handleSimulateVoice();
    }
  };

  // Simulated Voice Input (Demo / Fallback)
  const handleSimulateVoice = () => {
    setIsSimulatingVoice(true);
    setSpeechStatus("🎙️ Simulating voice input...");
    const sampleHindi = "वार्ड 3 में मुख्य सड़क पर बड़ा गड्ढा हो गया है और बारिश का गंदा पानी भर गया है, तुरंत ठीक करवाएं।";
    let index = 0;
    setDescription("");
    const interval = setInterval(() => {
      index += 4;
      setDescription(sampleHindi.slice(0, index));
      if (index >= sampleHindi.length) {
        clearInterval(interval);
        setIsSimulatingVoice(false);
        setSpeechStatus("✓ Voice transcription complete!");
        autoDetectCategoryFromText(sampleHindi);
      }
    }, 45);
  };

  const autoDetectCategoryFromText = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("सड़क") || lower.includes("गड्ढा") || lower.includes("road") || lower.includes("pothole")) {
      setCategory("Road Damage");
    } else if (lower.includes("पानी") || lower.includes("नल") || lower.includes("leak") || lower.includes("pipe") || lower.includes("water")) {
      setCategory("Water Leakage");
    } else if (lower.includes("बिजली") || lower.includes("तार") || lower.includes("wire") || lower.includes("current") || lower.includes("spark")) {
      setCategory("Electrical Hazard");
    } else if (lower.includes("लाइट") || lower.includes("बत्ती") || lower.includes("pole") || lower.includes("streetlight") || lower.includes("dark")) {
      setCategory("Broken Streetlight");
    } else if (lower.includes("कचरा") || lower.includes("नाली") || lower.includes("drain") || lower.includes("garbage")) {
      setCategory("Garbage & Drainage");
    }
  };

  // GPS Auto-Detection
  const handleDetectGPS = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          const acc = Math.round(pos.coords.accuracy || 8);
          setGpsInfo(`${lat}° N, ${lng}° E (±${acc}m)`);
          setGpsVerified(true);
          setGpsLoading(false);
          if (!ward) setWard("Ward 3");
        },
        () => {
          // Accurate Kurud/Kodebod simulated fallback
          setTimeout(() => {
            setGpsInfo("20.6542° N, 81.6912° E (±5m · Kurud)");
            setGpsVerified(true);
            setGpsLoading(false);
            if (!ward) setWard("Ward 3");
          }, 800);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setGpsInfo("20.6542° N, 81.6912° E (±5m · Kurud)");
        setGpsVerified(true);
        setGpsLoading(false);
        if (!ward) setWard("Ward 3");
      }, 600);
    }
  };

  // AI Analysis Execution with multi-stage ticker
  function runAnalysis() {
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisPhase(1);

    const t1 = setTimeout(() => setAnalysisPhase(2), 600);
    const t2 = setTimeout(() => setAnalysisPhase(3), 1300);
    const t3 = setTimeout(() => setAnalysisPhase(4), 1900);
    const t4 = setTimeout(() => {
      const result = mockAnalyze({ category, description });
      setAnalysis(result);
      setAnalyzing(false);
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }

  useEffect(() => {
    if (step === 2 && !analysis && !analyzing) {
      runAnalysis();
    }
  }, [step]); // eslint-disable-line

  function submit() {
    const id = `GRM-${1030 + complaints.length}`;
    const record = {
      id,
      title: description ? description.slice(0, 60) : `${category} reported`,
      category,
      ward,
      severity: analysis ? analysis.severity : "MEDIUM",
      status: "PENDING",
      progress: 0,
      dept: analysis ? analysis.suggestedDepartment : catOf(category).dept,
      reporter: "You",
      createdAt: "2026-09-03",
      confidence: analysis ? analysis.confidence : 0.94,
      votes: 1,
      image: imagePreview || null,
      gps: gpsInfo || null,
      method
    };
    addComplaint(record);
    addXp(20);
    setSubmitted(record);
  }

  // Submission Success Card with Animations
  if (submitted) {
    return (
      <div style={{ maxWidth: 580, margin: "50px auto", padding: "0 20px", textAlign: "center" }}>
        <div className="ge-card" style={{ padding: "40px 24px", animation: "geSuccessPop 0.5s ease-out" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 99,
              background: "rgba(95, 168, 114, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 24px rgba(95, 168, 114, 0.4)"
            }}
          >
            <CheckCircle2 size={44} color="var(--low)" />
          </div>

          <div className="ge-serif" style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>
            Grievance Registered Successfully!
          </div>

          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 16 }}>
            Your report has been analyzed by GramEye AI and routed to the <b>{submitted.dept}</b>.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(31,77,54,0.06)",
              padding: "8px 20px",
              borderRadius: 12,
              marginBottom: 20
            }}
          >
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Tracking ID:</span>
            <span className="ge-mono" style={{ fontSize: 16, color: "var(--paddy)", fontWeight: 800 }}>
              {submitted.id}
            </span>
          </div>

          {submitted.image && (
            <div style={{ maxWidth: 280, margin: "0 auto 20px", borderRadius: 10, overflow: "hidden", border: "1px solid var(--line-dark)" }}>
              <img src={submitted.image} alt="Report preview" style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            <div className="ge-chip" style={{ background: "rgba(232,163,61,0.18)", color: "#B97417", fontSize: 13, gap: 6 }}>
              <Flame size={15} /> +20 XP Earned
            </div>
            {submitted.gps && (
              <div className="ge-chip" style={{ background: "rgba(60,135,166,0.14)", color: "var(--tank)", fontSize: 12, gap: 5 }}>
                <MapPin size={13} /> GPS Logged
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="ge-btn ge-btn-ghost"
              onClick={() => {
                setSelectedComplaint(submitted);
                setPage("complaintDetail");
              }}
            >
              Track This Report
            </button>
            <button className="ge-btn ge-btn-primary" onClick={() => setPage("citizenDashboard")}>
              Go to Dashboard <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = ["Describe", "Location", "AI Analysis", "Confirm"];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px 90px" }}>
      {/* Step Progress Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div
              style={{
                height: 4,
                borderRadius: 4,
                background: i <= step ? "var(--turmeric)" : "var(--line-dark)",
                transition: "background .3s"
              }}
            />
            <div
              style={{
                fontSize: 11.5,
                marginTop: 6,
                color: i <= step ? "var(--ink-text)" : "var(--muted)",
                fontWeight: i === step ? 800 : 400
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      {/* STEP 0: DESCRIBE */}
      {step === 0 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 25, fontWeight: 700, marginBottom: 6 }}>
            What's the problem?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 22 }}>
            Choose how you'd like to report, pick a category, and upload photographic or voice evidence.
          </p>

          {/* Method Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[
              ["photo", Camera, "Take a photo of problem"],
              ["voice", Mic, "Speak your problem"],
              ["text", FileText, "Describe in text"]
            ].map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className="ge-btn"
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: "16px 8px",
                  gap: 8,
                  background: method === key ? "rgba(31,77,54,0.08)" : "var(--husk-2)",
                  border: `1.5px solid ${method === key ? "var(--paddy)" : "var(--line-dark)"}`,
                  boxShadow: method === key ? "0 4px 14px rgba(31,77,54,0.12)" : "none"
                }}
              >
                <Icon size={22} color={method === key ? "var(--paddy)" : "var(--muted)"} />
                <span style={{ fontSize: 12, fontWeight: 700, textAlign: "center", lineHeight: 1.25 }}>{label}</span>
              </button>
            ))}
          </div>

          {/* 1. PHOTO METHOD: REAL UPLOAD & CAMERA */}
          {method === "photo" && (
            <div style={{ marginBottom: 24 }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {!imagePreview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  style={{
                    border: `2px dashed ${isDragging ? "var(--paddy)" : "var(--line-dark)"}`,
                    borderRadius: 16,
                    padding: "26px 16px",
                    textAlign: "center",
                    background: isDragging ? "rgba(31,77,54,0.07)" : "rgba(31,77,54,0.03)",
                    transition: "all .2s"
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 99,
                      background: "rgba(232,163,61,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px"
                    }}
                  >
                    <Upload size={24} color="var(--turmeric)" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
                    Upload or Capture Photo of the Problem
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                    Drag and drop an image here, or choose from device
                  </div>

                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="ge-btn ge-btn-primary"
                      style={{ padding: "10px 18px", fontSize: 13 }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={15} /> Choose Photo
                    </button>
                    <button
                      type="button"
                      className="ge-btn ge-btn-dark"
                      style={{ padding: "10px 18px", fontSize: 13 }}
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera size={15} /> Use Camera
                    </button>
                  </div>
                </div>
              ) : (
                /* LIVE IMAGE PREVIEW WITH SCANNER */
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1.5px solid var(--paddy)",
                    position: "relative",
                    background: "#0B1710",
                    boxShadow: "0 14px 34px -10px rgba(11,23,16,0.35)"
                  }}
                >
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <img
                      src={imagePreview}
                      alt="Uploaded defect"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />

                    {/* Animated Scanning Line */}
                    {isScanningImage && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          height: 3,
                          background: "var(--turmeric)",
                          boxShadow: "0 0 16px 4px rgba(232,163,61,0.9)",
                          animation: "geLaserScan 1.2s ease-in-out infinite alternate"
                        }}
                      />
                    )}

                    {/* AI Bounding Box Tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        background: "rgba(11,23,16,0.85)",
                        backdropFilter: "blur(6px)",
                        padding: "6px 12px",
                        borderRadius: 8,
                        color: "#FBF8F0",
                        fontSize: 11.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <Sparkles size={13} color="var(--turmeric)" />
                      <span>{detectedAiBadge || "AI Optical Vision Active"}</span>
                    </div>

                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setImageName("");
                        setDetectedAiBadge("");
                      }}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 99,
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      background: "rgba(31,77,54,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Photo Loaded: {imageName || "Device Photo"}</span>
                    <button
                      className="ge-btn ge-btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <RefreshCw size={12} /> Retake
                    </button>
                  </div>
                </div>
              )}

              {/* One-Click Real Presets */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>
                  Or test with 1-click realistic village problem samples:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }} className="ge-4col">
                  {PRESET_SCENARIOS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPreset(p)}
                      className="ge-btn"
                      style={{
                        flexDirection: "column",
                        padding: "8px 6px",
                        gap: 3,
                        background: category === p.category && imagePreview === p.image ? "rgba(232,163,61,0.18)" : "var(--husk-2)",
                        border: `1px solid ${category === p.category && imagePreview === p.image ? "var(--turmeric)" : "var(--line-dark)"}`
                      }}
                    >
                      <span style={{ fontSize: 11.5, fontWeight: 700 }}>{p.label}</span>
                      <span style={{ fontSize: 9.5, color: "var(--muted)" }}>{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. VOICE METHOD: REAL RECOGNITION + SOUND WAVES */}
          {method === "voice" && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 18px",
                marginBottom: 20,
                background: "rgba(31,77,54,0.04)",
                borderRadius: 16,
                border: "1px solid var(--line-dark)"
              }}
            >
              {/* Language Switch */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setSpeechLang("hi-IN")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: speechLang === "hi-IN" ? "1.5px solid var(--paddy)" : "1px solid var(--line-dark)",
                    background: speechLang === "hi-IN" ? "var(--paddy)" : "transparent",
                    color: speechLang === "hi-IN" ? "#fff" : "var(--ink-text)"
                  }}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechLang("en-IN")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: speechLang === "en-IN" ? "1.5px solid var(--paddy)" : "1px solid var(--line-dark)",
                    background: speechLang === "en-IN" ? "var(--paddy)" : "transparent",
                    color: speechLang === "en-IN" ? "#fff" : "var(--ink-text)"
                  }}
                >
                  English (India)
                </button>
              </div>

              {/* Pulsing Mic Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 99,
                  background: isListening ? "var(--crit)" : "var(--turmeric)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: isListening ? "0 0 20px rgba(214,69,69,0.7)" : "0 8px 20px -4px rgba(232,163,61,0.5)",
                  animation: isListening ? "gePulseGlow 1.5s infinite" : "none",
                  transition: "all .2s"
                }}
              >
                <Mic size={32} color={isListening ? "#fff" : "#231402"} />
              </button>

              {/* Sound Waves Animation */}
              {isListening && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 32, marginBottom: 12 }}>
                  {[12, 24, 18, 28, 14, 26, 32, 20, 15, 27, 18, 10].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3.5,
                        height: h,
                        background: "var(--paddy)",
                        borderRadius: 2,
                        animation: `geWave 0.8s ease-in-out infinite alternate ${i * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-text)", marginBottom: 4 }}>
                {isListening ? (speechLang === "hi-IN" ? "माइक चालू है — बोलिए..." : "Listening — speak clearly...") : "Tap microphone to speak"}
              </div>

              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
                {speechStatus || 'e.g. "वार्ड 3 में सड़क पर बड़ा गड्ढा है और पानी भर गया है"'}
              </div>

              <button
                type="button"
                className="ge-btn ge-btn-ghost"
                style={{ fontSize: 12, padding: "6px 14px" }}
                onClick={handleSimulateVoice}
                disabled={isSimulatingVoice}
              >
                <Volume2 size={13} /> {isSimulatingVoice ? "Transcribing..." : "Simulate Hindi Voice Demo"}
              </button>
            </div>
          )}

          {/* 3. CATEGORY SELECTION */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span>Category {category && <span style={{ color: "var(--paddy)", fontWeight: 800 }}>• {category}</span>}</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>AI auto-classifies on photo/voice</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }} className="ge-3col">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className="ge-btn"
                  style={{
                    flexDirection: "column",
                    padding: "12px 6px",
                    gap: 6,
                    background: category === c.key ? c.color + "1a" : "var(--husk-2)",
                    border: `1.5px solid ${category === c.key ? c.color : "var(--line-dark)"}`,
                    transform: category === c.key ? "scale(1.02)" : "none"
                  }}
                >
                  <c.icon size={18} color={c.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{c.key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. DESCRIPTION TEXTAREA */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block" }}>
              Description & Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the issue, landmarks, or how long it has been unresolved..."
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1.5px solid var(--line-dark)",
                padding: 12,
                fontSize: 13.5,
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none"
              }}
            />
          </div>

          <button
            className="ge-btn ge-btn-primary"
            disabled={!category}
            style={{ width: "100%", padding: "14px" }}
            onClick={() => setStep(1)}
          >
            {t.step_next}
          </button>
        </div>
      )}

      {/* STEP 1: LOCATION & REAL GPS AUTO-DETECT */}
      {step === 1 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>
            {t.step_location}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 18 }}>
            Choose the ward or use live GPS to pin the exact geo-coordinates.
          </p>

          {/* GPS Auto-Detect Button */}
          <div
            style={{
              background: "rgba(31,77,54,0.05)",
              border: "1px solid var(--line-dark)",
              borderRadius: 14,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  background: gpsVerified ? "rgba(95,168,114,0.2)" : "rgba(232,163,61,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Navigation size={18} color={gpsVerified ? "var(--low)" : "var(--turmeric)"} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-text)" }}>
                  {gpsVerified ? "Live GPS Coordinates Verified" : "Automatic GPS Geolocation"}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  {gpsInfo || "Capture real satellite GPS coordinates for Panchayat field crew"}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="ge-btn ge-btn-primary"
              style={{ padding: "8px 16px", fontSize: 12.5 }}
              onClick={handleDetectGPS}
              disabled={gpsLoading}
            >
              {gpsLoading ? <Loader2 size={14} style={{ animation: "geSpin 1s linear infinite" }} /> : <MapPin size={14} />}
              {gpsLoading ? "Acquiring GPS..." : gpsVerified ? "GPS Refreshed ✓" : "Detect My Location"}
            </button>
          </div>

          <div className="ge-card" style={{ padding: 14, marginBottom: 18 }}>
            <VillageMap complaints={complaints} onSelectWard={setWard} selectedWard={ward} height={260} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 26 }} className="ge-3col">
            {WARDS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWard(w)}
                className="ge-btn"
                style={{
                  background: ward === w ? "var(--paddy)" : "var(--husk-2)",
                  color: ward === w ? "#fff" : "var(--ink-text)",
                  border: `1.5px solid ${ward === w ? "var(--paddy)" : "var(--line-dark)"}`
                }}
              >
                <MapPin size={13} /> {w}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(0)}>
              <ChevronLeft size={15} /> Back
            </button>
            <button className="ge-btn ge-btn-primary" disabled={!ward} style={{ flex: 1 }} onClick={() => setStep(2)}>
              {t.step_next}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADVANCED AI VISION & NLP ANALYSIS */}
      {step === 2 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>
            AI Optical & Risk Analysis
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>
            GramEye AI neural vision engine is assessing hazard depth, safety risk, and Panchayat SLA.
          </p>

          <div className="ge-card" style={{ padding: 20, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            {/* Visual Screen: Shows Real User Photo OR Category Visualizer with Laser Scanner */}
            <div
              style={{
                position: "relative",
                height: 180,
                borderRadius: 12,
                background: "#08130C",
                marginBottom: 16,
                overflow: "hidden",
                border: "1.5px solid var(--line-dark)"
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Defect" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,var(--paddy),var(--ink))" }}>
                  {React.createElement(catOf(category).icon, { size: 54, color: "rgba(255,255,255,0.4)" })}
                </div>
              )}

              {/* Scanning Laser Beam */}
              {analyzing && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "var(--turmeric)",
                    boxShadow: "0 0 16px 4px rgba(232,163,61,0.9)",
                    animation: "geLaserScan 1.2s ease-in-out infinite alternate"
                  }}
                />
              )}

              {/* HUD Coordinates & Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(11,23,16,0.85)",
                  backdropFilter: "blur(6px)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  color: "#E8A33D",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)"
                }}
              >
                HUD // {ward} • {gpsInfo ? "GPS LOCK" : "SIMULATED GIS"}
              </div>
            </div>

            {/* Live Progress Ticker */}
            {analyzing && (
              <div style={{ padding: "8px 0 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--paddy)", marginBottom: 8 }}>
                  <Loader2 size={16} style={{ animation: "geSpin 1s linear infinite" }} />
                  {analysisPhase === 1 && "Phase 1/4: Analyzing Image Pixels & Edge Fractures..."}
                  {analysisPhase === 2 && "Phase 2/4: Classifying Hazard Pattern (Neural Vision Model)..."}
                  {analysisPhase === 3 && "Phase 3/4: Cross-referencing Village GIS & Ward SLA..."}
                  {analysisPhase === 4 && "Phase 4/4: Generating Automated Department Work Order..."}
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "var(--line-dark)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(analysisPhase / 4) * 100}%`,
                      background: "var(--turmeric)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Analysis Result */}
            {analysis && !analyzing && (
              <div className="ge-fadeup">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <InfoTile label="Problem Detected" value={analysis.problemType} />
                  <InfoTile label="Severity Rating" value={analysis.severity} valueColor={SEVERITY_COLOR[analysis.severity]} />
                  <InfoTile label="AI Confidence Score" value={`${Math.round(analysis.confidence * 100)}%`} />
                  <InfoTile label="Assigned Department" value={analysis.suggestedDepartment} />
                </div>
                <div
                  style={{
                    background: "rgba(214,69,69,0.08)",
                    border: "1px solid rgba(214,69,69,0.2)",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    gap: 10
                  }}
                >
                  <AlertTriangle size={18} color="var(--crit)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12.5 }}>
                    <b>Safety & Health Risk:</b> {analysis.safetyRisk}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Duplicate Detection Alert */}
          {analysis && duplicates.length > 0 && (
            <div className="ge-card ge-fadeup" style={{ padding: 18, marginBottom: 20, border: "1.5px solid var(--turmeric)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <Sparkles size={16} color="var(--turmeric)" />
                <div style={{ fontWeight: 700, fontSize: 14 }}>Possible duplicate issue detected</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
                {duplicates.length} similar open report found in {ward}. Master complaint:{" "}
                <span className="ge-mono">{duplicates[0].id}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="ge-btn"
                  style={{
                    flex: 1,
                    background: dupChoice === "join" ? "var(--paddy)" : "var(--husk-2)",
                    color: dupChoice === "join" ? "#fff" : "var(--ink-text)",
                    border: "1px solid var(--line-dark)"
                  }}
                  onClick={() => setDupChoice("join")}
                >
                  Join existing report
                </button>
                <button
                  className="ge-btn"
                  style={{
                    flex: 1,
                    background: dupChoice === "separate" ? "var(--paddy)" : "var(--husk-2)",
                    color: dupChoice === "separate" ? "#fff" : "var(--ink-text)",
                    border: "1px solid var(--line-dark)"
                  }}
                  onClick={() => setDupChoice("separate")}
                >
                  Submit as separate issue
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(1)}>
              <ChevronLeft size={15} /> Back
            </button>
            <button
              className="ge-btn ge-btn-primary"
              disabled={!analysis || (duplicates.length > 0 && !dupChoice)}
              style={{ flex: 1 }}
              onClick={() => setStep(3)}
            >
              {t.step_next}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM & SUBMIT */}
      {step === 3 && analysis && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>
            Confirm & Dispatch
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>
            Review your complaint details before routing to the Panchayat.
          </p>

          <div className="ge-card" style={{ padding: 22, marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
              {imagePreview ? (
                <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line-dark)", flexShrink: 0 }}>
                  <img src={imagePreview} alt="Evidence thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <CategoryIcon category={category} box={60} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{category}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                  {description || "No additional description"}
                </div>
                {gpsInfo && (
                  <div style={{ fontSize: 11, color: "var(--paddy)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={11} /> GPS: {gpsInfo}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <InfoTile label="Location" value={ward} icon={MapPin} />
              <InfoTile label="Severity" value={analysis.severity} valueColor={SEVERITY_COLOR[analysis.severity]} />
              <InfoTile label="Category" value={analysis.category} />
              <InfoTile label="Assigned Department" value={analysis.suggestedDepartment} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(2)}>
              <ChevronLeft size={15} /> Back
            </button>
            <button className="ge-btn ge-btn-primary" style={{ flex: 1, padding: 14 }} onClick={submit}>
              Submit Complaint & Earn 20 XP <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value, valueColor, icon: Icon }) {
  return (
    <div style={{ background: "rgba(31,77,54,0.05)", borderRadius: 10, padding: "9px 12px" }}>
      <div style={{ fontSize: 10.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
        {Icon && <Icon size={10} />}
        {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: valueColor || "var(--ink-text)" }}>{value}</div>
    </div>
  );
}

/* ============================================================
   COMPLAINT DETAIL (WITH EVIDENCE PHOTO & GPS)
   ============================================================ */
function ComplaintDetail({ complaint, setPage, updateComplaint, addXp }) {
  if (!complaint) return <div style={{ padding: 60, textAlign: "center" }}>No complaint selected.</div>;
  const [verify, setVerify] = useState(null);
  const [workOrderOpen, setWorkOrderOpen] = useState(false);
  const stageIndex = STATUS_FLOW.indexOf(complaint.status);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 90px" }}>
      <button className="ge-btn ge-btn-ghost" style={{ marginBottom: 18 }} onClick={() => setPage("citizenDashboard")}>
        <ChevronLeft size={15} /> Back to dashboard
      </button>

      <div className="ge-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="ge-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{complaint.id}</div>
            <div className="ge-serif" style={{ fontSize: 21, fontWeight: 600, margin: "4px 0" }}>{complaint.title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <SeverityBadge severity={complaint.severity} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          <CategoryIcon category={complaint.category} box={50} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }} className="ge-3col">
          <InfoTile label="Location" value={complaint.ward} icon={MapPin} />
          <InfoTile label="Department" value={complaint.dept} />
          <InfoTile label="Reported" value={complaint.createdAt} icon={Clock} />
        </div>

        {/* Evidence Photo Card */}
        {complaint.image && (
          <div style={{ marginTop: 18, borderTop: "1px solid var(--line-dark)", paddingTop: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--paddy)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Camera size={15} /> Citizen Photographic Evidence (AI Verified)
            </div>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--line-dark)", maxHeight: 260, background: "#0B1710" }}>
              <img src={complaint.image} alt={complaint.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(11,23,16,0.85)", backdropFilter: "blur(6px)", padding: "6px 12px", borderRadius: 8, fontSize: 11, color: "#FBF8F0" }}>
                <span>🎯 AI Confidence: {Math.round((complaint.confidence || 0.94) * 100)}%</span>
                {complaint.gps && <span>📍 {complaint.gps}</span>}
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Official Work Order Generator Button */}
        <div style={{ marginTop: 18, borderTop: "1px solid var(--line-dark)", paddingTop: 16 }}>
          <button
            type="button"
            onClick={() => setWorkOrderOpen(true)}
            className="ge-btn"
            style={{
              width: "100%",
              padding: "13px 18px",
              background: "linear-gradient(135deg, #0B1710 0%, #1F4D36 100%)",
              color: "#FBF8F0",
              border: "1.5px solid var(--turmeric)",
              borderRadius: 12,
              fontSize: 13.5,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
            }}
          >
            <FileText size={17} color="var(--turmeric)" />
            <span>Generate Official Government Work Order & Notice (PDF)</span>
          </button>
        </div>
      </div>

      <WorkOrderModal
        isOpen={workOrderOpen}
        onClose={() => setWorkOrderOpen(false)}
        complaint={complaint}
      />

      <div className="ge-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Timeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {["Reported", "AI Analyzed", "Verified", "Assigned", "In Progress", "Resolved"].map((label, i) => {
            const done = i <= stageIndex + 1;
            return (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--paddy)" : "var(--line-dark)", color: "#fff", flexShrink: 0
                  }}>{done && <Check size={13} />}</div>
                  {i < 5 && <div style={{ width: 2, flex: 1, minHeight: 26, background: i < stageIndex + 1 ? "var(--paddy)" : "var(--line-dark)" }} />}
                </div>
                <div style={{ paddingBottom: 22, fontSize: 13.5, fontWeight: done ? 700 : 400, color: done ? "var(--ink-text)" : "var(--muted)" }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {complaint.status === "RESOLVED" && (
        <div className="ge-card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Before / After Verification</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {["BEFORE", "AFTER"].map((label, i) => (
              <div key={i}>
                <div style={{ height: 100, borderRadius: 10, background: i === 0 ? "linear-gradient(135deg,#8B5E34,#5C4326)" : "linear-gradient(135deg,#2E6B4A,#1F4D36)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CategoryIcon category={complaint.category} box={0} size={30} />
                  {React.createElement(catOf(complaint.category).icon, { size: 30, color: "rgba(255,255,255,0.5)" })}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: "var(--muted)", textAlign: "center" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(95,168,114,0.12)", borderRadius: 10, padding: 10, fontSize: 12.5, color: "var(--low)", fontWeight: 700, marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <CheckCircle2 size={15} /> Visual improvement detected by AI
          </div>
          {!verify ? (
            <div style={{ display: "flex", gap: 10 }}>
              <button className="ge-btn ge-btn-primary" style={{ flex: 1 }} onClick={() => { setVerify("confirmed"); addXp(50); }}>Confirm Resolved</button>
              <button className="ge-btn ge-btn-ghost" style={{ flex: 1 }} onClick={() => { setVerify("reopen"); updateComplaint(complaint.id, { status: "REOPENED", progress: 40 }); }}>Problem Still Exists</button>
            </div>
          ) : verify === "confirmed" ? (
            <div style={{ fontSize: 13, color: "var(--low)", fontWeight: 700 }}>✓ Thanks for confirming — you earned +50 XP</div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--crit)", fontWeight: 700 }}>Complaint reopened and sent back to {complaint.dept}.</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAP PAGE
   ============================================================ */
function MapPage({ complaints }) {
  const [ward, setWard] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const filtered = complaints.filter(c => (!ward || c.ward === ward) && (severityFilter === "ALL" || c.severity === severityFilter));
  const wardStats = ward ? {
    total: complaints.filter(c => c.ward === ward).length,
    critical: complaints.filter(c => c.ward === ward && (c.severity === "CRITICAL" || c.severity === "HIGH")).length,
    resolved: complaints.filter(c => c.ward === ward && c.status === "RESOLVED").length,
  } : null;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 90px" }}>
      <div className="ge-serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Village Map</div>
      <div style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Rampur Village — live issues by ward</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(s => (
          <button key={s} onClick={() => setSeverityFilter(s)} className="ge-btn" style={{
            padding: "8px 14px", fontSize: 12.5,
            background: severityFilter === s ? "var(--ink)" : "var(--husk-2)", color: severityFilter === s ? "#fff" : "var(--ink-text)", border: "1px solid var(--line-dark)"
          }}>{s === "ALL" ? "All Severities" : s}</button>
        ))}
        {ward && <button className="ge-btn ge-btn-ghost" onClick={() => setWard(null)}><X size={13} /> Clear ward filter</button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }} className="ge-hero-grid">
        <div className="ge-card" style={{ padding: 18 }}>
          <VillageMap complaints={filtered} onSelectWard={setWard} selectedWard={ward} height={380} />
          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            {Object.entries(SEVERITY_COLOR).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: v }} /> {k}
              </div>
            ))}
          </div>
        </div>

        <div>
          {wardStats && (
            <div className="ge-card" style={{ padding: 18, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{ward}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <InfoTile label="Open Problems" value={wardStats.total} />
                <InfoTile label="Critical/High" value={wardStats.critical} valueColor="var(--crit)" />
                <InfoTile label="Resolved" value={wardStats.resolved} valueColor="var(--low)" />
              </div>
            </div>
          )}
          <div className="ge-card" style={{ padding: 18, maxHeight: 420, overflowY: "auto" }} className2="ge-scroll">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Issues ({filtered.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(c => (
                <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 10, border: "1px solid var(--line-dark)" }}>
                  <CategoryIcon category={c.category} box={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.ward}</div>
                  </div>
                  <SeverityBadge severity={c.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD (COMMAND CENTER)
   ============================================================ */
function AdminDashboard({ complaints, setPage }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "PENDING").length;
  const inProgress = complaints.filter(c => c.status === "IN_PROGRESS" || c.status === "ASSIGNED").length;
  const resolved = complaints.filter(c => c.status === "RESOLVED").length;
  const critical = complaints.filter(c => c.severity === "CRITICAL" || c.severity === "HIGH").length;
  const rate = Math.round((resolved / total) * 100);

  const byCategory = CATEGORIES.map(c => ({ name: c.key.split(" ")[0], value: complaints.filter(x => x.category === c.key).length, color: c.color })).filter(d => d.value > 0);
  const bySeverity = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(s => ({ name: s, value: complaints.filter(c => c.severity === s).length }));
  const monthly = [["Mar", 22], ["Apr", 30], ["May", 26], ["Jun", 34], ["Jul", 29], ["Aug", 38]].map(([name, value]) => ({ name, value }));

  const alerts = [
    "Water complaints in Ward 3 increased 40% this week.",
    `${critical} critical/high problems remain unresolved.`,
    "Complaint resolution time increased by 18% this month.",
  ];
  const recs = [
    { title: "Add secondary water source in Ward 3", reason: "Repeated handpump & leakage reports over 30 days", priority: "HIGH", impact: "Reduces water complaints by an est. 35%" },
    { title: "Inspect Ward 4 school-zone road", reason: "Two HIGH severity pothole reports near school entrance", priority: "HIGH", impact: "Removes leading accident risk in Ward 4" },
  ];

  return (
    <div style={{ maxWidth: 1220, margin: "0 auto", padding: "32px 24px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <div className="ge-serif" style={{ fontSize: 26, fontWeight: 600 }}>Village Command Center</div>
          <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>Rampur Village · Live overview</div>
        </div>
        <button className="ge-btn ge-btn-dark" onClick={() => setPage("adminComplaints")}>Manage Complaints <ArrowRight size={14} /></button>
      </div>

      {critical > 0 && (
        <div style={{ background: "rgba(214,69,69,0.09)", border: "1px solid rgba(214,69,69,0.25)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 700, color: "var(--crit)" }}>
          🚨 {critical} Critical/High Problems Require Attention
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 22 }} className="ge-6col">
        <StatCard label="Total Problems" value={total} icon={FileText} color="var(--paddy)" />
        <StatCard label="Pending" value={pending} icon={Clock} color="var(--turmeric)" />
        <StatCard label="In Progress" value={inProgress} icon={Loader2} color="var(--tank)" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="var(--low)" />
        <StatCard label="Critical" value={critical} icon={ShieldAlert} color="var(--crit)" />
        <StatCard label="Resolution Rate" value={rate + "%"} icon={TrendingUp} color="var(--paddy)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }} className="ge-3col">
        <ChartCard title="Problems by Category">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={byCategory}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 10 }} width={22} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byCategory.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Severity Distribution">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={bySeverity} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {bySeverity.map((d, i) => <Cell key={i} fill={SEVERITY_COLOR[d.name]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: -8 }}>
            {bySeverity.map(d => <div key={d.name} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: 99, background: SEVERITY_COLOR[d.name] }} />{d.name}</div>)}
          </div>
        </ChartCard>
        <ChartCard title="Monthly Complaints">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={22} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--paddy)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginBottom: 20 }} className="ge-hero-grid">
        <div className="ge-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Village Map</div>
          <VillageMap complaints={complaints} onSelectWard={() => setPage("map")} selectedWard={null} height={260} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="ge-card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Smart Alerts</div>
            {alerts.map((a, i) => (
              <div key={i} style={{ fontSize: 12.5, padding: "8px 0", borderTop: i > 0 ? "1px solid var(--line-dark)" : "none", display: "flex", gap: 8 }}>
                <AlertTriangle size={13} color="var(--turmeric)" style={{ flexShrink: 0, marginTop: 2 }} /> {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ge-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color="var(--turmeric)" /> Smart Development Recommendations</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Generated from historical complaint patterns</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="ge-2col">
          {recs.map((r, i) => (
            <div key={i} style={{ border: "1px solid var(--line-dark)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.title}</div>
                <SeverityBadge severity={r.priority} />
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{r.reason}</div>
              <div style={{ fontSize: 11.5, color: "var(--low)", fontWeight: 700 }}>↑ {r.impact}</div>
            </div>
          ))}
        </div>
      </div>

      <AIAnalyticsChat complaints={complaints} />
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="ge-card" style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function AIAnalyticsChat({ complaints }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Ask me about your village's complaint data — e.g. \"What is the biggest problem in Ward 3?\"" }]);
  const [input, setInput] = useState("");

  function answer(q) {
    const lower = q.toLowerCase();
    const wardMatch = WARDS.find(w => lower.includes(w.toLowerCase().replace("ward ", "ward")) || lower.includes(w.split(" ")[1]));
    if (wardMatch) {
      const wc = complaints.filter(c => c.ward === wardMatch);
      const byCat = {};
      wc.forEach(c => byCat[c.category] = (byCat[c.category] || 0) + 1);
      const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
      const unresolved = wc.filter(c => c.status !== "RESOLVED").length;
      return top ? `${top[0]} complaints are the most frequent issue in ${wardMatch}. There are ${top[1]} reports, of which ${unresolved} are currently unresolved.` : `No data found for ${wardMatch} yet.`;
    }
    if (lower.includes("slow") || lower.includes("department")) {
      return "Public Works currently has the slowest average resolution time at 9.2 days, followed by Water Department at 6.4 days.";
    }
    if (lower.includes("critical")) {
      const crit = complaints.filter(c => c.severity === "CRITICAL");
      return crit.length ? `There are ${crit.length} CRITICAL complaints open right now, including "${crit[0].title}" in ${crit[0].ward}.` : "No CRITICAL complaints are currently open.";
    }
    if (lower.includes("priorit")) {
      return "Based on severity and repeat reports, the Panchayat should prioritize the electrical hazard in Ward 5 and the school-zone road damage in Ward 4.";
    }
    return "Across the village, Road Damage and Water Leakage are the two most reported categories this month, with Ward 3 and Ward 4 needing the most attention.";
  }

  function send() {
    if (!input.trim()) return;
    const q = input;
    setMsgs(m => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMsgs(m => [...m, { role: "ai", text: answer(q) }]), 500);
  }

  return (
    <div className="ge-card" style={{ padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><MessageSquare size={16} color="var(--paddy)" /> AI Analytics Assistant</div>
      <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%",
            background: m.role === "user" ? "var(--paddy)" : "rgba(31,77,54,0.06)", color: m.role === "user" ? "#fff" : "var(--ink-text)",
            padding: "9px 13px", borderRadius: 14, fontSize: 13, lineHeight: 1.5
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Which ward needs attention?" style={{ flex: 1, border: "1.5px solid var(--line-dark)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }} />
        <button className="ge-btn ge-btn-primary" onClick={send}><Send size={14} /></button>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN COMPLAINT MANAGEMENT
   ============================================================ */
function AdminComplaints({ complaints, updateComplaint }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const filtered = complaints
    .filter(c => statusFilter === "ALL" || c.status === statusFilter)
    .filter(c => (c.title + c.id + c.ward + c.category).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  function advance(c) {
    const idx = STATUS_FLOW.indexOf(c.status);
    if (idx < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[idx + 1];
      updateComplaint(c.id, { status: next, progress: next === "RESOLVED" ? 100 : Math.min(95, c.progress + 30) });
    }
  }

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 90px" }}>
      <div className="ge-serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Complaint Management</div>
      <div style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>{filtered.length} of {complaints.length} complaints</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by ID, title, ward…"
            style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: 10, border: "1.5px solid var(--line-dark)", fontSize: 13 }} />
        </div>
        {["ALL", ...STATUS_FLOW, "REOPENED"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className="ge-btn" style={{
            padding: "8px 13px", fontSize: 12,
            background: statusFilter === s ? "var(--ink)" : "var(--husk-2)", color: statusFilter === s ? "#fff" : "var(--ink-text)", border: "1px solid var(--line-dark)"
          }}>{s.replace("_", " ")}</button>
        ))}
      </div>

      <div className="ge-card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "90px 2fr 90px 110px 130px 100px 120px", gap: 10, padding: "12px 18px", fontSize: 11, fontWeight: 700, color: "var(--muted)", borderBottom: "1px solid var(--line-dark)" }} className="ge-table-head">
          <span>ID</span><span>Problem</span><span>Ward</span><span>Severity</span><span>Status</span><span>Progress</span><span>Action</span>
        </div>
        {filtered.map(c => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "90px 2fr 90px 110px 130px 100px 120px", gap: 10, padding: "14px 18px", alignItems: "center", borderBottom: "1px solid var(--line-dark)", fontSize: 12.5 }} className="ge-table-row">
            <span className="ge-mono" style={{ fontSize: 11 }}>{c.id}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><CategoryIcon category={c.category} box={26} />{c.title}</span>
            <span>{c.ward}</span>
            <SeverityBadge severity={c.severity} />
            <StatusBadge status={c.status} />
            <ProgressBar value={c.progress} color={SEVERITY_COLOR[c.severity]} />
            {c.status !== "RESOLVED" ? (
              <button className="ge-btn ge-btn-ghost" style={{ fontSize: 11.5, padding: "6px 10px" }} onClick={() => advance(c)}>Advance →</button>
            ) : <span style={{ color: "var(--low)", fontWeight: 700, fontSize: 11.5 }}>✓ Done</span>}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>No complaints match this filter.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   REWARDS / LEADERBOARD
   ============================================================ */
function RewardsPage({ xp }) {
  const [period, setPeriod] = useState("alltime");
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 90px" }}>
      <div className="ge-serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Rewards & Community</div>
      <div style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 24 }}>Earn XP for reporting and helping resolve village problems.</div>

      <div className="ge-card" style={{ padding: 22, marginBottom: 22, background: "linear-gradient(135deg, var(--ink), var(--paddy))", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Your Progress</div>
            <div className="ge-serif" style={{ fontSize: 30, fontWeight: 600, color: "var(--turmeric)" }}>{xp} XP</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Level {Math.floor(xp / 200) + 1} · {200 - (xp % 200)} XP to next level</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BADGES.slice(0, 2).map((b, i) => (
              <div key={i} className="ge-chip" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}><b.icon size={12} color={b.color} /> {b.name}</div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14 }}><ProgressBar value={(xp % 200) / 2} color="var(--turmeric)" /></div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["weekly", "monthly", "alltime"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className="ge-btn" style={{
            padding: "8px 14px", fontSize: 12.5, background: period === p ? "var(--ink)" : "var(--husk-2)", color: period === p ? "#fff" : "var(--ink-text)", border: "1px solid var(--line-dark)"
          }}>{p === "alltime" ? "All Time" : p[0].toUpperCase() + p.slice(1)}</button>
        ))}
      </div>

      <div className="ge-card" style={{ padding: 8 }}>
        {LEADERBOARD.map((u, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: i < LEADERBOARD.length - 1 ? "1px solid var(--line-dark)" : "none" }}>
            <div className="ge-serif" style={{ width: 26, textAlign: "center", fontWeight: 700, color: i === 0 ? "var(--turmeric)" : "var(--muted)" }}>{i + 1}</div>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: u.name === "You" ? "var(--turmeric)" : "var(--paddy)", color: u.name === "You" ? "#231402" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{u.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{u.name}</div>
              <div style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                {u.badges.map((b, j) => <span key={j} className="ge-chip" style={{ background: "rgba(31,77,54,0.08)", color: "var(--paddy)", fontSize: 10, padding: "2px 8px" }}>{b}</span>)}
              </div>
            </div>
            <div className="ge-mono" style={{ fontWeight: 700, color: "var(--turmeric)" + "" , fontSize: 14}}>{u.xp} XP</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginTop: 22 }} className="ge-5col">
        {BADGES.map((b, i) => (
          <div key={i} className="ge-card" style={{ padding: 14, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 99, background: b.color + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <b.icon size={19} color={b.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function GramEyeApp() {
  const [page, setPage] = useState("landing");
  const [lang, setLang] = useState("en");
  const [role, setRole] = useState("citizen");
  const [complaints, setComplaints] = useState(seedComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [xp, setXp] = useState(340);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("grameye_user");
      return saved ? JSON.parse(saved) : {
        id: "usr-1",
        fullName: "Rahul Sahu",
        mobile: "6268814185",
        role: "citizen",
        ward: "Ward 4",
        village: "Rampur",
        xp: 340
      };
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [voiceSahayakOpen, setVoiceSahayakOpen] = useState(false);
  const [emergencyAlertOpen, setEmergencyAlertOpen] = useState(false);
  const [authToast, setAuthToast] = useState(null);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    const assignedRole = (user.role || "").toLowerCase() === "admin" ? "admin" : "citizen";
    setRole(assignedRole);
    if (user.xp) setXp(user.xp);
    try {
      localStorage.setItem("grameye_user", JSON.stringify(user));
    } catch {}
    setAuthToast(`🎉 Welcome, ${user.fullName}! Successfully signed in.`);
    setTimeout(() => setAuthToast(null), 5000);
  }

  function handleConfirmLogout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem("grameye_user");
    } catch {}
    setRole("citizen");
    setPage("landing");
    setAuthToast("👋 You have logged out safely.");
    setTimeout(() => setAuthToast(null), 5000);
  }

  function addComplaint(c) { setComplaints(prev => [c, ...prev]); }
  function updateComplaint(id, patch) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    if (selectedComplaint?.id === id) setSelectedComplaint(prev => ({ ...prev, ...patch }));
  }
  function addXp(n) { setXp(v => v + n); }

  return (
    <div className="ge-root" style={{ minHeight: "100vh" }}>
      <style>{TOKENS}{`
        /* Grid and Flex Layout Helpers */
        .ge-hero-grid{ grid-template-columns: 1fr; }
        @media (min-width:860px){ .ge-hero-grid{ grid-template-columns: var(--gtc, 1fr 1fr); } }
        .ge-3col{ grid-template-columns: repeat(2,1fr) !important; }
        .ge-4col{ grid-template-columns: repeat(2,1fr) !important; }
        .ge-5col{ grid-template-columns: repeat(2,1fr) !important; }
        .ge-6col{ grid-template-columns: repeat(3,1fr) !important; }
        .ge-2col{ grid-template-columns: 1fr !important; }
        @media (min-width:700px){
          .ge-3col{ grid-template-columns: repeat(3,1fr) !important; }
          .ge-4col{ grid-template-columns: repeat(4,1fr) !important; }
          .ge-5col{ grid-template-columns: repeat(5,1fr) !important; }
          .ge-6col{ grid-template-columns: repeat(6,1fr) !important; }
          .ge-2col{ grid-template-columns: 1fr 1fr !important; }
        }
        .ge-table-head, .ge-table-row{ grid-template-columns: 70px 1.6fr 70px 90px 100px 80px 90px !important; }
        @media (min-width:640px){ .ge-table-head, .ge-table-row{ grid-template-columns: 90px 2fr 90px 110px 130px 100px 120px !important; } }

        /* Responsive Navbar & Mobile Drawer */
        @media (max-width: 920px) {
          .ge-desktop-nav { display: none !important; }
          .ge-mobile-menu-btn { display: flex !important; }
          .ge-hide-md { display: none !important; }
        }
        @media (min-width: 921px) {
          .ge-desktop-nav { display: flex !important; }
          .ge-mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 640px) {
          html, body, #root, .ge-root {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          .ge-hide-sm { display: none !important; }
          .ge-mobile-nav { display: flex !important; width: 100% !important; max-width: 100vw !important; }
          .ge-mobile-nav-spacer { height: 75px !important; display: block !important; }

          /* All Page Outer Containers Mobile Indentation */
          div[style*="max-width: 1100"],
          div[style*="maxWidth: 1100"],
          div[style*="maxWidth: 1140"],
          div[style*="max-width: 1140"],
          div[style*="maxWidth: 1160"],
          div[style*="max-width: 1160"],
          div[style*="maxWidth: 1180"],
          div[style*="max-width: 1180"],
          div[style*="maxWidth: 1240"],
          div[style*="max-width: 1240"] {
            padding: 18px 12px 85px !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }

          /* All Cards Mobile Padding & Margin */
          .ge-card {
            padding: 16px 12px !important;
            border-radius: 16px !important;
            margin-bottom: 14px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Headings on Mobile */
          .ge-serif {
            word-break: break-word !important;
          }
          .ge-serif[style*="font-size: clamp"],
          .ge-serif[style*="fontSize: clamp"] {
            font-size: clamp(22px, 6.5vw, 34px) !important;
            line-height: 1.15 !important;
          }

          .ge-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .ge-hero-cta {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .ge-hero-cta .ge-btn {
            width: 100% !important;
            justify-content: center !important;
          }

          /* Grids collapsing on mobile */
          .ge-2col { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ge-3col { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ge-4col { grid-template-columns: 1fr !important; gap: 12px !important; }
          .ge-5col {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .ge-5col > :last-child:nth-child(odd) {
            grid-column: span 2;
          }

          .ge-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
            padding: 16px 12px !important;
          }
          .ge-stats-grid .ge-serif {
            font-size: 24px !important;
          }

          /* Tables horizontal scroll */
          table {
            display: block !important;
            width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }

          input, select, textarea {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        }
        @media (min-width: 641px) {
          .ge-mobile-nav { display: none !important; }
          .ge-mobile-nav-spacer { display: none !important; }
        }
      `}</style>

      {/* Floating Auth Toast Notification */}
      {authToast && (
        <div
          style={{
            position: "fixed",
            top: 75,
            right: 24,
            zIndex: 999,
            background: "#132A1C",
            color: "#FBF8F0",
            border: "1.5px solid var(--turmeric)",
            borderRadius: 12,
            padding: "12px 18px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.4)",
            fontSize: 13.5,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "geFadeUp 0.3s ease-out"
          }}
        >
          <span>{authToast}</span>
          <button
            onClick={() => setAuthToast(null)}
            style={{ background: "none", border: "none", color: "#8EAA97", cursor: "pointer", padding: 2 }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <Navbar
        page={page}
        setPage={setPage}
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
        xp={xp}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenLogoutModal={() => setLogoutModalOpen(true)}
        onOpenVoiceSahayak={() => setVoiceSahayakOpen(true)}
        onOpenEmergencyAlert={() => setEmergencyAlertOpen(true)}
      />

      {page === "landing" && <Landing setPage={setPage} lang={lang} complaints={complaints} />}
      {page === "citizenDashboard" && <CitizenDashboard complaints={complaints} setPage={setPage} setSelectedComplaint={setSelectedComplaint} xp={xp} />}
      {page === "report" && <ReportFlow complaints={complaints} addComplaint={addComplaint} setPage={setPage} setSelectedComplaint={setSelectedComplaint} addXp={addXp} lang={lang} />}
      {page === "complaintDetail" && <ComplaintDetail complaint={selectedComplaint} setPage={setPage} updateComplaint={updateComplaint} addXp={addXp} />}
      {page === "map" && <MapPage complaints={complaints} />}
      {page === "noticeBoard" && <NoticeBoard currentUser={currentUser} role={role} addXp={addXp} lang={lang} />}
      {page === "kisanPortal" && <KisanPortal addXp={addXp} />}
      {page === "certificates" && <CertificatePortal currentUser={currentUser} addXp={addXp} />}
      {page === "gramNidhi" && <GramNidhi complaints={complaints} />}
      {page === "gramSabha" && <GramSabha addXp={addXp} />}
      {page === "rewards" && <RewardsPage xp={xp} />}
      {page === "adminDashboard" && <AdminDashboard complaints={complaints} setPage={setPage} />}
      {page === "adminComplaints" && <AdminComplaints complaints={complaints} updateComplaint={updateComplaint} />}

      <Footer setPage={setPage} />

      <div style={{ height: 60 }} className="ge-mobile-nav-spacer" />
      <MobileBottomNav page={page} setPage={setPage} role={role} />

      {/* Floating AI Voice Sahayak Widget Button (Bottom Right) */}
      <button
        type="button"
        className="ge-hide-sm"
        onClick={() => setVoiceSahayakOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 70,
          background: "linear-gradient(135deg, #0B1710 0%, #1F4D36 100%)",
          color: "#FBF8F0",
          border: "2px solid var(--turmeric)",
          borderRadius: 999,
          padding: "11px 18px",
          boxShadow: "0 10px 32px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 13.5,
          animation: "gePulseGlow 3s infinite"
        }}
        title="Open AI Voice Sahayak (बोलकर सवाल पूछें)"
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 99,
            background: "var(--turmeric)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Mic size={16} color="#231402" />
        </div>
        <span>AI Voice Sahayak (बोलें)</span>
      </button>

      {/* Interactive Phone + OTP Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Animated Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        userName={currentUser?.fullName || "Citizen"}
      />

      {/* Interactive AI Voice Sahayak Modal */}
      <VoiceSahayakModal
        isOpen={voiceSahayakOpen}
        onClose={() => setVoiceSahayakOpen(false)}
        lang={lang}
        setPage={setPage}
      />

      {/* Emergency Aapda Siren & Alert Modal */}
      <EmergencyAlertModal
        isOpen={emergencyAlertOpen}
        onClose={() => setEmergencyAlertOpen(false)}
        role={role}
      />
    </div>
  );
}
