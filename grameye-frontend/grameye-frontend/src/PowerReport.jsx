import React, { useState, useEffect } from "react";
import {
  Zap, AlertTriangle, Camera, MapPin, CheckCircle2, Clock,
  PhoneCall, ShieldAlert, PlusCircle, Filter, ArrowRight
} from "lucide-react";

export default function PowerReport({ currentUser, addXp }) {
  const [reports, setReports] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [issueType, setIssueType] = useState("ट्रांसफार्मर में स्पार्किंग व ओवरलोड");
  const [ward, setWard] = useState("Ward 4 (निकट शीतला मंदिर)");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetch("/api/community/power/reports")
      .then(res => res.json())
      .then(data => {
        if (data.reports) setReports(data.reports);
      })
      .catch(() => {
        setReports([
          {
            id: "PWR-2026-01",
            issueType: "ट्रांसफार्मर में स्पार्किंग व ओवरलोड (Transformer Sparking)",
            ward: "Ward 4 (निकट शीतला मंदिर)",
            location: "कोड़ेबोड, धमतरी",
            severity: "HIGH",
            reportedAt: "03 Sep 2026, 04:15 PM",
            status: "IN_PROGRESS",
            assignedCrew: "CSPDCL कुरूद सबस्टेशन लाइन दल",
            description: "ट्रांसफार्मर से चिंगारियां निकल रही हैं, वोल्टेज कम-ज्यादा हो रहा है।",
            safetyWarning: "कृपया 20 मीटर दूर रहें! किसी भी तार या पोल को न छुएं।"
          },
          {
            id: "PWR-2026-02",
            issueType: "सड़क की स्ट्रीट लाइट खराब (Streetlight Outage)",
            ward: "Ward 2 (स्कूल रोड)",
            location: "कोड़ेबोड",
            severity: "LOW",
            reportedAt: "02 Sep 2026, 08:30 PM",
            status: "RESOLVED",
            assignedCrew: "पंचायत विद्युत समिति",
            description: "खंभा क्र. 14 की एलईडी लाइट 2 दिनों से बंद थी, नई लाइट लगा दी गई है।"
          }
        ]);
      });
  }, []);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newRep = {
      id: `PWR-2026-0${reports.length + 3}`,
      issueType,
      ward,
      location: "कोड़ेबोड",
      severity: issueType.includes("तार") || issueType.includes("ट्रांसफार्मर") ? "HIGH" : "MEDIUM",
      reportedAt: "Just now",
      status: "REPORTED",
      assignedCrew: "CSPDCL सबस्टेशन लाइनमैन को अग्रेषित",
      description: desc || "नागरिक द्वारा तत्काल रिपोर्ट",
      safetyWarning: "सुरक्षा हेतु टूटे तार या उपकरण से दूरी बनाए रखें।"
    };

    setReports([newRep, ...reports]);
    setSubmitting(false);
    setReportModal(false);
    setDesc("");
    if (addXp) addXp(20);
    showToast("⚡ विद्युत शिकायत दर्ज! सबस्टेशन लाइनमैन को अलर्ट भेजा गया (+20 XP)");
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 16px 80px" }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999, background: "#0E1A13",
          color: "#fff", padding: "12px 20px", borderRadius: 12, border: "1.5px solid var(--turmeric)",
          fontWeight: 700, fontSize: 13.5, boxShadow: "0 16px 36px rgba(0,0,0,0.5)"
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)",
        color: "#fff", borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={24} color="#231402" />
              </div>
              <div>
                <span className="ge-serif" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800 }}>
                  GramAI <span style={{ color: "var(--turmeric)" }}>Power Report</span> (विद्युत निगरानी)
                </span>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                  बिजली गुल, टूटा तार, ट्रांसफार्मर खराबी व स्ट्रीटलाइट की त्वरित रिपोर्ट व लाइव ट्रैकिंग
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href="tel:1912"
              style={{
                textDecoration: "none", background: "rgba(255,255,255,0.15)", color: "#fff",
                padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <PhoneCall size={15} /> CSPDCL 1912
            </a>
            <button
              onClick={() => setReportModal(true)}
              className="ge-btn"
              style={{
                background: "var(--turmeric)", color: "#231402", fontWeight: 800,
                fontSize: 13, padding: "10px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6
              }}
            >
              <PlusCircle size={16} />
              <span>समस्या दर्ज करें (Report)</span>
            </button>
          </div>
        </div>

        {/* High-Voltage Safety Warning */}
        <div style={{
          marginTop: 20, background: "rgba(214,69,69,0.25)", border: "1.5px solid #FF8080",
          borderRadius: 14, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
          color: "#FFE2E2", fontSize: 13
        }}>
          <ShieldAlert size={22} color="#FF6B6B" style={{ flexShrink: 0 }} />
          <span>
            <b>हाई-वोल्टेज सुरक्षा चेतावनी:</b> जमीन पर गिरे बिजली के तारों, खंभों या चिंगारी फेंकते ट्रांसफार्मर से कम से कम 20 मीटर की सुरक्षित दूरी बनाए रखें। किसी भी धातु या गीली लकड़ी से तार को न छुएं!
          </span>
        </div>
      </div>

      {/* Status Pipeline & Active Reports List */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>
            ⚡ गाँव में सक्रिय विद्युत शिकायतें व सुधार स्थिति
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            कुल मामले: {reports.length}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reports.map(r => (
            <div
              key={r.id}
              style={{
                border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 18,
                background: r.status === "RESOLVED" ? "#F9FCFA" : "#FFFDFB",
                borderLeft: `5px solid ${r.status === "RESOLVED" ? "#48BB78" : "#E0703A"}`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink-text)" }}>{r.issueType}</span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                      background: r.severity === "HIGH" ? "#FFE5E5" : "#FFF5EB",
                      color: r.severity === "HIGH" ? "#D64545" : "#E0703A"
                    }}>
                      {r.severity} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={13} /> {r.ward} • {r.reportedAt}
                  </div>
                </div>

                <div style={{
                  fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 8,
                  background: r.status === "RESOLVED" ? "rgba(72,187,120,0.15)" : "rgba(224,112,58,0.15)",
                  color: r.status === "RESOLVED" ? "#22543D" : "#9C4221"
                }}>
                  {r.status === "RESOLVED" ? "✓ समस्या हल (Resolved)" : "⏳ सुधार कार्य प्रगति पर (In Progress)"}
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#444", marginBottom: 10, lineHeight: 1.5 }}>
                {r.description}
              </div>

              <div style={{
                fontSize: 12, color: "var(--paddy)", fontWeight: 700,
                background: "rgba(31,77,54,0.06)", padding: "6px 12px", borderRadius: 8, display: "inline-block"
              }}>
                संबद्ध लाइन दल: {r.assignedCrew}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT SUBMISSION MODAL */}
      {reportModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
            padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>
              ⚡ बिजली समस्या की रिपोर्ट दर्ज करें
            </div>

            <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>समस्या का प्रकार</label>
                <select
                  value={issueType}
                  onChange={e => setIssueType(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                >
                  <option>ट्रांसफार्मर में स्पार्किंग व ओवरलोड</option>
                  <option>सड़क या खेत में टूटा हुआ बिजली तार (DANGER)</option>
                  <option>बिजली का खंभा टेढ़ा / क्षतिग्रस्त</option>
                  <option>स्ट्रीट लाइट खराब (अंधेरा)</option>
                  <option>वार्ड में लंबे समय से बिजली गुल</option>
                  <option>लो-वोल्टेज व मोटर चलने में समस्या</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>स्थल व वार्ड</label>
                <input
                  type="text"
                  value={ward}
                  onChange={e => setWard(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>समस्या का संक्षिप्त विवरण</label>
                <textarea
                  rows={3}
                  placeholder="तार कहाँ गिरा है या क्या हो रहा है..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setReportModal(false)}
                  className="ge-btn"
                  style={{ background: "#eee", padding: "9px 16px", borderRadius: 8, fontSize: 12.5 }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ge-btn"
                  style={{ background: "#D64545", color: "#fff", fontWeight: 800, padding: "9px 20px", borderRadius: 8, fontSize: 12.5 }}
                >
                  सबस्टेशन को अलर्ट भेजें →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
