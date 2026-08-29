import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin, Camera, Mic, FileText, ChevronRight, ChevronLeft, CheckCircle2,
  AlertTriangle, TrendingUp, Users, Award, Droplet, Zap, Trash2, Construction,
  School, HeartPulse, Bus, Trees, Home, LayoutDashboard, Map as MapIcon,
  BarChart3, Bell, Settings, LogOut, Search, Sparkles, Upload, X, Star,
  Trophy, Flame, ShieldAlert, Clock, ArrowRight, Menu, Globe, User, Loader2,
  Check, RotateCcw, Sprout, Sun, Waves, Building2, Leaf, MessageSquare, Send
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie,
  Cell, LineChart, Line, CartesianGrid,
} from "recharts";

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
      style={{ position: "relative", height: 420, borderRadius: 24, overflow: "hidden", background: "linear-gradient(180deg,#F4C374 0%, #E8A33D 32%, #1F4D36 33%, #0B1710 100%)" }}
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
   NAVBAR
   ============================================================ */
function Navbar({ page, setPage, lang, setLang, role, setRole, xp }) {
  const [open, setOpen] = useState(false);
  const isDark = page === "landing";
  const links = role === "citizen"
    ? [["citizenDashboard", "Dashboard"], ["report", "Report"], ["map", "Village Map"], ["rewards", "Rewards"]]
    : [["adminDashboard", "Command Center"], ["adminComplaints", "Complaints"], ["map", "Village Map"], ["rewards", "Community"]];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40,
      background: isDark ? "rgba(11,23,16,0.72)" : "rgba(251,248,240,0.85)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(14,26,19,0.08)"}`
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sprout size={19} color="#231402" />
          </div>
          <span className="ge-serif" style={{ fontSize: 19, fontWeight: 600, color: isDark ? "#FBF8F0" : "#132A1C" }}>GramEye <span style={{ color: "var(--turmeric)" }}>AI</span></span>
        </div>

        <div className="ge-scroll" style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {links.map(([key, label]) => (
            <button key={key} onClick={() => setPage(key)} className="ge-btn" style={{
              background: page === key ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(14,26,19,0.08)") : "transparent",
              color: isDark ? "#FBF8F0" : "#132A1C", padding: "9px 14px", fontSize: 13.5, whiteSpace: "nowrap"
            }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="ge-btn" onClick={() => setLang(lang === "en" ? "hi" : "en")} style={{ background: "transparent", color: isDark ? "#FBF8F0" : "#132A1C", padding: "8px 10px", fontSize: 13 }}>
            <Globe size={15} /> {lang === "en" ? "हिं" : "EN"}
          </button>
          <div className="ge-chip" style={{ background: "var(--turmeric)" + "22", color: "#B97417", gap: 6 }}>
            <Flame size={13} /> {xp} XP
          </div>
          <select value={role} onChange={e => { setRole(e.target.value); setPage(e.target.value === "citizen" ? "citizenDashboard" : "adminDashboard"); }}
            style={{ border: "1px solid rgba(140,140,140,0.3)", borderRadius: 999, padding: "8px 12px", fontSize: 12.5, fontWeight: 700, background: isDark ? "rgba(255,255,255,0.08)" : "#fff", color: isDark ? "#FBF8F0" : "#132A1C" }}>
            <option value="citizen">👤 Citizen — Rahul</option>
            <option value="admin">🛡️ Panchayat Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav({ page, setPage, role }) {
  const items = role === "citizen"
    ? [["citizenDashboard", Home, "Home"], ["map", MapIcon, "Map"], ["report", Sparkles, "Report"], ["citizenDashboard", FileText, "Reports"], ["rewards", User, "Profile"]]
    : null;
  if (!items) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#FBF8F0", borderTop: "1px solid rgba(14,26,19,0.08)", display: "flex", zIndex: 50 }} className="ge-mobile-nav">
      {items.map(([key, Icon, label], i) => (
        <button key={i} onClick={() => setPage(key)} style={{
          flex: 1, border: "none", background: "none", padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: page === key ? "var(--paddy)" : "#93a091", cursor: "pointer",
          transform: label === "Report" ? "translateY(-10px)" : "none"
        }}>
          {label === "Report"
            ? <div style={{ width: 44, height: 44, borderRadius: 99, background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px -6px rgba(232,163,61,0.7)" }}><Icon size={20} color="#231402" /></div>
            : <Icon size={19} />}
          <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
        </button>
      ))}
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
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px 40px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }} className="ge-hero-grid">
        <div className="ge-fadeup">
          <div className="ge-chip" style={{ background: "rgba(232,163,61,0.14)", color: "var(--turmeric-light)", marginBottom: 20 }}>
            <Sparkles size={13} /> AI-Powered Village Governance
          </div>
          <h1 className="ge-serif" style={{ fontSize: "clamp(38px,5vw,60px)", lineHeight: 1.05, fontWeight: 600, margin: "0 0 20px" }}>
            {t.tagline.split(". ").map((line, i) => <div key={i}>{line}{i < t.tagline.split(". ").length - 1 ? "." : ""}</div>)}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(251,248,240,0.72)", maxWidth: 480, marginBottom: 30 }}>{t.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="ge-btn ge-btn-primary" onClick={() => setPage("report")} style={{ padding: "15px 26px", fontSize: 15 }}>
              {t.reportProblem} <ArrowRight size={16} />
            </button>
            <button className="ge-btn ge-btn-outline" onClick={() => setPage("map")} style={{ padding: "15px 26px", fontSize: 15 }}>
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
   REPORT FLOW
   ============================================================ */
function ReportFlow({ complaints, addComplaint, setPage, setSelectedComplaint, addXp, lang }) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("photo");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dupChoice, setDupChoice] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const t = T[lang];

  const duplicates = ward && category ? findDuplicates(complaints, { category, ward }) : [];

  function runAnalysis() {
    setAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      const result = mockAnalyze({ category, description });
      setAnalysis(result);
      setAnalyzing(false);
    }, 2200);
  }

  useEffect(() => { if (step === 2 && !analysis && !analyzing) runAnalysis(); }, [step]); // eslint-disable-line

  function submit() {
    const id = `GRM-${1030 + complaints.length}`;
    const record = {
      id, title: description ? description.slice(0, 60) : `${category} reported`,
      category, ward, severity: analysis.severity, status: "PENDING", progress: 0,
      dept: analysis.suggestedDepartment, reporter: "You", createdAt: "2026-08-26",
      confidence: analysis.confidence, votes: 1,
    };
    addComplaint(record);
    addXp(20);
    setSubmitted(record);
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="ge-card ge-fadeup" style={{ padding: 40 }}>
          <div style={{ width: 74, height: 74, borderRadius: 99, background: "var(--low)" + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={38} color="var(--low)" />
          </div>
          <div className="ge-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Complaint Successfully Submitted</div>
          <div className="ge-mono" style={{ fontSize: 15, color: "var(--paddy)", fontWeight: 700, marginBottom: 20 }}>{submitted.id}</div>
          <div className="ge-chip" style={{ background: "rgba(232,163,61,0.14)", color: "#B97417", marginBottom: 24 }}>+20 XP earned</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => { setSelectedComplaint(submitted); setPage("complaintDetail"); }}>Track this report</button>
            <button className="ge-btn ge-btn-primary" onClick={() => setPage("citizenDashboard")}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const steps = ["Describe", "Location", "AI Analysis", "Confirm"];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 90px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 4, background: i <= step ? "var(--turmeric)" : "var(--line-dark)", transition: "background .3s" }} />
            <div style={{ fontSize: 11, marginTop: 6, color: i <= step ? "var(--ink-text)" : "var(--muted)", fontWeight: i === step ? 700 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 24, marginBottom: 4 }}>What's the problem?</h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Choose how you'd like to report, pick a category, and add a short description.</p>

          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            {[["photo", Camera, t.step_photo.replace("📷 ", "")], ["voice", Mic, t.step_voice.replace("🎙️ ", "")], ["text", FileText, "Describe in text"]].map(([key, Icon, label]) => (
              <button key={key} onClick={() => setMethod(key)} className="ge-btn" style={{
                flex: 1, flexDirection: "column", padding: "18px 10px", gap: 8,
                background: method === key ? "rgba(31,77,54,0.08)" : "var(--husk-2)", border: `1.5px solid ${method === key ? "var(--paddy)" : "var(--line-dark)"}`
              }}>
                <Icon size={20} color={method === key ? "var(--paddy)" : "var(--muted)"} />
                <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: "center" }}>{label}</span>
              </button>
            ))}
          </div>

          {method === "photo" && (
            <div style={{ border: "2px dashed var(--line-dark)", borderRadius: 16, padding: "30px 20px", textAlign: "center", marginBottom: 20, background: "rgba(31,77,54,0.03)" }}>
              <Upload size={26} color="var(--muted)" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Tap to upload or take a photo</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>(demo mode — AI will analyze a simulated image)</div>
            </div>
          )}
          {method === "voice" && (
            <div style={{ textAlign: "center", padding: "24px 20px", marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, background: "var(--crit)" + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Mic size={26} color="var(--crit)" />
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Tap and speak — e.g. "मेरे गाँव में तीन दिन से पानी नहीं आ रहा है"</div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, display: "block" }}>Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }} className="ge-3col">
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)} className="ge-btn" style={{
                  flexDirection: "column", padding: "12px 6px", gap: 6,
                  background: category === c.key ? c.color + "1a" : "var(--husk-2)", border: `1.5px solid ${category === c.key ? c.color : "var(--line-dark)"}`
                }}>
                  <c.icon size={17} color={c.color} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{c.key}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8, display: "block" }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Briefly describe the problem…"
              style={{ width: "100%", borderRadius: 12, border: "1.5px solid var(--line-dark)", padding: 12, fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }} />
          </div>

          <button className="ge-btn ge-btn-primary" disabled={!category} style={{ width: "100%" }} onClick={() => setStep(1)}>{t.step_next}</button>
        </div>
      )}

      {step === 1 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 24, marginBottom: 4 }}>{t.step_location}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Select the ward where this problem is located.</p>
          <div className="ge-card" style={{ padding: 14, marginBottom: 18 }}>
            <VillageMap complaints={complaints} onSelectWard={setWard} selectedWard={ward} height={260} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 26 }} className="ge-3col">
            {WARDS.map(w => (
              <button key={w} onClick={() => setWard(w)} className="ge-btn" style={{
                background: ward === w ? "var(--paddy)" : "var(--husk-2)", color: ward === w ? "#fff" : "var(--ink-text)", border: `1.5px solid ${ward === w ? "var(--paddy)" : "var(--line-dark)"}`
              }}><MapPin size={13} /> {w}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(0)}><ChevronLeft size={15} /> Back</button>
            <button className="ge-btn ge-btn-primary" disabled={!ward} style={{ flex: 1 }} onClick={() => setStep(2)}>{t.step_next}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 24, marginBottom: 4 }}>AI Analysis</h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Sit tight — GramEye AI is reading your report.</p>

          <div className="ge-card" style={{ padding: 20, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", height: 120, borderRadius: 12, background: "linear-gradient(135deg,var(--paddy),var(--ink))", marginBottom: 16, overflow: "hidden" }}>
              <CategoryIcon category={category} box={0} size={40} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.createElement(catOf(category).icon, { size: 42, color: "rgba(255,255,255,0.35)" })}
              </div>
              {analyzing && <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "var(--turmeric)", boxShadow: "0 0 12px 3px rgba(232,163,61,0.8)", animation: "geScan 1.6s ease-in-out infinite alternate" }} />}
            </div>

            {analyzing && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--paddy)" }}>
                <Loader2 size={15} style={{ animation: "geSpin 1s linear infinite" }} /> Analyzing your report…
              </div>
            )}

            {analysis && !analyzing && (
              <div className="ge-fadeup">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <InfoTile label="Problem Detected" value={analysis.problemType} />
                  <InfoTile label="Severity" value={analysis.severity} valueColor={SEVERITY_COLOR[analysis.severity]} />
                  <InfoTile label="AI Confidence" value={`${Math.round(analysis.confidence * 100)}%`} />
                  <InfoTile label="Department" value={analysis.suggestedDepartment} />
                </div>
                <div style={{ background: "rgba(214,69,69,0.08)", border: "1px solid rgba(214,69,69,0.2)", borderRadius: 12, padding: 12, display: "flex", gap: 10 }}>
                  <AlertTriangle size={16} color="var(--crit)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12.5 }}><b>Potential Risk:</b> {analysis.safetyRisk}</div>
                </div>
              </div>
            )}
          </div>

          {analysis && duplicates.length > 0 && (
            <div className="ge-card ge-fadeup" style={{ padding: 18, marginBottom: 20, border: "1.5px solid var(--turmeric)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <Sparkles size={16} color="var(--turmeric)" />
                <div style={{ fontWeight: 700, fontSize: 14 }}>Possible duplicate detected</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
                {duplicates.length} similar open report{duplicates.length > 1 ? "s" : ""} found in {ward}. Master complaint: <span className="ge-mono">{duplicates[0].id}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ge-btn" style={{ flex: 1, background: dupChoice === "join" ? "var(--paddy)" : "var(--husk-2)", color: dupChoice === "join" ? "#fff" : "var(--ink-text)", border: "1px solid var(--line-dark)" }} onClick={() => setDupChoice("join")}>Join existing report</button>
                <button className="ge-btn" style={{ flex: 1, background: dupChoice === "separate" ? "var(--paddy)" : "var(--husk-2)", color: dupChoice === "separate" ? "#fff" : "var(--ink-text)", border: "1px solid var(--line-dark)" }} onClick={() => setDupChoice("separate")}>Submit as separate issue</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(1)}><ChevronLeft size={15} /> Back</button>
            <button className="ge-btn ge-btn-primary" disabled={!analysis || (duplicates.length > 0 && !dupChoice)} style={{ flex: 1 }} onClick={() => setStep(3)}>{t.step_next}</button>
          </div>
        </div>
      )}

      {step === 3 && analysis && (
        <div className="ge-fadeup">
          <h2 className="ge-serif" style={{ fontSize: 24, marginBottom: 4 }}>Confirm & Submit</h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 20 }}>Review your report before it's sent to the Panchayat.</p>
          <div className="ge-card" style={{ padding: 20, marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <CategoryIcon category={category} box={48} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{category}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{description || "No additional description"}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <InfoTile label="Location" value={ward} icon={MapPin} />
              <InfoTile label="Severity" value={analysis.severity} valueColor={SEVERITY_COLOR[analysis.severity]} />
              <InfoTile label="Category" value={analysis.category} />
              <InfoTile label="Department" value={analysis.suggestedDepartment} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="ge-btn ge-btn-ghost" onClick={() => setStep(2)}><ChevronLeft size={15} /> Back</button>
            <button className="ge-btn ge-btn-primary" style={{ flex: 1 }} onClick={submit}>Submit Complaint <ArrowRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value, valueColor, icon: Icon }) {
  return (
    <div style={{ background: "rgba(31,77,54,0.05)", borderRadius: 10, padding: "9px 12px" }}>
      <div style={{ fontSize: 10.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>{Icon && <Icon size={10} />}{label}</div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: valueColor || "var(--ink-text)" }}>{value}</div>
    </div>
  );
}

/* ============================================================
   COMPLAINT DETAIL
   ============================================================ */
function ComplaintDetail({ complaint, setPage, updateComplaint, addXp }) {
  if (!complaint) return <div style={{ padding: 60, textAlign: "center" }}>No complaint selected.</div>;
  const [verify, setVerify] = useState(null);
  const stageIndex = STATUS_FLOW.indexOf(complaint.status);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 90px" }}>
      <button className="ge-btn ge-btn-ghost" style={{ marginBottom: 18 }} onClick={() => setPage("citizenDashboard")}><ChevronLeft size={15} /> Back to dashboard</button>

      <div className="ge-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="ge-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{complaint.id}</div>
            <div className="ge-serif" style={{ fontSize: 21, fontWeight: 600, margin: "4px 0" }}>{complaint.title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <SeverityBadge severity={complaint.severity} /><StatusBadge status={complaint.status} />
            </div>
          </div>
          <CategoryIcon category={complaint.category} box={50} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }} className="ge-3col">
          <InfoTile label="Location" value={complaint.ward} icon={MapPin} />
          <InfoTile label="Department" value={complaint.dept} />
          <InfoTile label="Reported" value={complaint.createdAt} icon={Clock} />
        </div>
      </div>

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

  function addComplaint(c) { setComplaints(prev => [c, ...prev]); }
  function updateComplaint(id, patch) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    if (selectedComplaint?.id === id) setSelectedComplaint(prev => ({ ...prev, ...patch }));
  }
  function addXp(n) { setXp(v => v + n); }

  return (
    <div className="ge-root" style={{ minHeight: "100vh" }}>
      <style>{TOKENS}{`
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
        @media (max-width:640px){ .ge-mobile-nav{ display:flex !important; } }
        @media (min-width:641px){ .ge-mobile-nav{ display:none !important; } }
      `}</style>

      <Navbar page={page} setPage={setPage} lang={lang} setLang={setLang} role={role} setRole={setRole} xp={xp} />

      {page === "landing" && <Landing setPage={setPage} lang={lang} complaints={complaints} />}
      {page === "citizenDashboard" && <CitizenDashboard complaints={complaints} setPage={setPage} setSelectedComplaint={setSelectedComplaint} xp={xp} />}
      {page === "report" && <ReportFlow complaints={complaints} addComplaint={addComplaint} setPage={setPage} setSelectedComplaint={setSelectedComplaint} addXp={addXp} lang={lang} />}
      {page === "complaintDetail" && <ComplaintDetail complaint={selectedComplaint} setPage={setPage} updateComplaint={updateComplaint} addXp={addXp} />}
      {page === "map" && <MapPage complaints={complaints} />}
      {page === "rewards" && <RewardsPage xp={xp} />}
      {page === "adminDashboard" && <AdminDashboard complaints={complaints} setPage={setPage} />}
      {page === "adminComplaints" && <AdminComplaints complaints={complaints} updateComplaint={updateComplaint} />}

      <div style={{ height: 60 }} className="ge-mobile-nav-spacer" />
      <MobileBottomNav page={page} setPage={setPage} role={role} />
    </div>
  );
}
