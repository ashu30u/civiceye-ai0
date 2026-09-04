import React, { useState, useRef } from "react";
import {
  FileText, CheckCircle2, Printer, Download, QrCode,
  ShieldCheck, User, Calendar, MapPin, Building2, Plus, Sparkles, X
} from "lucide-react";

const CERTIFICATE_TYPES = [
  {
    id: "residence",
    title: "निवास प्रमाण पत्र (Residence Certificate)",
    desc: "बैंक खाता, स्कूल प्रवेश व सरकारी योजनाओं में पते के सत्यापन हेतु।",
    fee: "निःशुल्क (₹0)",
    sla: "तुरंत (Instant AI Verified)"
  },
  {
    id: "ration_noc",
    title: "राशन कार्ड अनापत्ति प्रमाण पत्र (Ration Card NOC)",
    desc: "परिवार से नाम पृथक करने या नए राशन कार्ड में नाम जुड़वाने हेतु।",
    fee: "निःशुल्क (₹0)",
    sla: "तुरंत (Instant)"
  },
  {
    id: "character",
    title: "चरित्र प्रमाण पत्र (Character Certificate)",
    desc: "नौकरी, सेना भर्ती, व उच्च शिक्षण संस्थानों में प्रवेश हेतु।",
    fee: "निःशुल्क (₹0)",
    sla: "तुरंत (Instant)"
  },
  {
    id: "family",
    title: "पारिवारिक सदस्यता प्रमाण पत्र (Family Verification)",
    desc: "पेंशन, आवास योजना व पारिवारिक लाभ योजनाओं के लिए।",
    fee: "निःशुल्क (₹0)",
    sla: "तुरंत (Instant)"
  }
];

export default function CertificatePortal({ currentUser, addXp }) {
  const [selectedType, setSelectedType] = useState(CERTIFICATE_TYPES[0]);
  const [applicantName, setApplicantName] = useState(currentUser?.fullName || "अमित कुमार साहू");
  const [guardianName, setGuardianName] = useState("श्री देव नारायण साहू");
  const [ward, setWard] = useState(currentUser?.ward || "Ward 3");
  const [aadhaarLast4, setAadhaarLast4] = useState("4185");
  const [purpose, setPurpose] = useState("सरकारी कल्याणकारी योजना व बैंक कार्य हेतु");

  const [generatedCert, setGeneratedCert] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const handleGenerate = (e) => {
    e?.preventDefault();
    const certNum = `GP-RMP/CERT/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    setGeneratedCert({
      certNum,
      dateStr,
      type: selectedType,
      name: applicantName.trim() || "राहुल साहू",
      guardian: guardianName.trim() || "श्री रामेश्वर",
      ward,
      aadhaarLast4: aadhaarLast4.trim() || "4185",
      purpose: purpose.trim() || "सामान्य सत्यापन"
    });

    if (addXp) addXp(20);
    setToastMsg("📜 डिजिटल प्रमाण पत्र सफलतापूर्वक तैयार हुआ! (+20 XP)");
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "34px 24px 90px" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .ge-certificate-paper, .ge-certificate-paper * { visibility: visible; }
          .ge-certificate-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Toast Alert */}
      {toastMsg && (
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
            animation: "geFadeUp 0.3s ease-out"
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 26 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--turmeric)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(232,163,61,0.4)"
              }}
            >
              <FileText size={22} color="#231402" />
            </div>
            <div>
              <div className="ge-serif" style={{ fontSize: 28, fontWeight: 800, color: "var(--ink-text)" }}>
                ग्राम प्रमाण पत्र पोर्टल — 1-Click Digital Certificates
              </div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 2 }}>
                Instant Panchayat Certified Certificates with Digital Stamp & QR Verification
              </div>
            </div>
          </div>
        </div>

        <div className="ge-chip" style={{ background: "var(--paddy)", color: "#fff", fontSize: 12 }}>
          ✓ पंचायत राज अधिनियम 1993 के तहत पूर्णतः वैध
        </div>
      </div>

      {/* 2-Column Grid: Form & Certificate Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 24 }} className="ge-hero-grid">
        {/* LEFT: Application Form */}
        <div className="ge-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)", marginBottom: 14 }}>
            1. प्रमाण पत्र का प्रकार चुनें (Select Certificate):
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 10, marginBottom: 20 }}>
            {CERTIFICATE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: selectedType.id === type.id ? "2px solid var(--paddy)" : "1px solid var(--line-dark)",
                  background: selectedType.id === type.id ? "rgba(31,77,54,0.08)" : "#fff",
                  cursor: "pointer",
                  transition: "all .15s"
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 12.5, color: selectedType.id === type.id ? "var(--paddy)" : "var(--ink-text)" }}>
                  {type.title.split(" (")[0]}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {type.sla}
                </div>
              </button>
            ))}
          </div>

          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)", marginBottom: 14 }}>
            2. आवेदक का विवरण (Applicant Details):
          </div>

          <form onSubmit={handleGenerate}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                आवेदक का पूरा नाम (Full Name)
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1.5px solid var(--line-dark)",
                  padding: "10px 12px",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                पिता / पति का नाम (Father / Husband Name)
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1.5px solid var(--line-dark)",
                  padding: "10px 12px",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                  वार्ड क्रमांक (Ward)
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 12px",
                    fontSize: 13,
                    background: "#fff",
                    outline: "none"
                  }}
                >
                  <option value="Ward 1">वार्ड 1 (प्रवेश द्वार)</option>
                  <option value="Ward 2">वार्ड 2 (जल टंकी पारा)</option>
                  <option value="Ward 3">वार्ड 3 (मुख्य बाज़ार)</option>
                  <option value="Ward 4">वार्ड 4 (प्राथमिक शाला)</option>
                  <option value="Ward 5">वार्ड 5 (खेत व सबस्टेशन)</option>
                  <option value="Ward 6">वार्ड 6 (मंदिर पारा)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                  आधार अंतिम 4 अंक
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ""))}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 12px",
                    fontSize: 13,
                    fontFamily: "monospace",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                प्रमाण पत्र का उद्देश्य (Purpose)
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1.5px solid var(--line-dark)",
                  padding: "10px 12px",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="ge-btn ge-btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: 14 }}
            >
              <Sparkles size={16} /> डिजिटल प्रमाण पत्र तैयार करें (Generate)
            </button>
          </form>
        </div>

        {/* RIGHT: Official Certificate Display */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Action Header for Printable Certificate */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--paddy)" }}>
              📄 आधिकारिक डिजिटल प्रमाण पत्र (Official Copy)
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="ge-btn ge-btn-ghost"
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              <Printer size={14} /> प्रिंट / PDF सुरक्षित करें
            </button>
          </div>

          {/* Certificate Paper */}
          <div
            className="ge-certificate-paper"
            style={{
              background: "#FFFDF7",
              border: "3px double #1F4D36",
              borderRadius: 16,
              padding: "30px 32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              color: "#1B2820",
              fontFamily: "'Manrope', 'Times New Roman', serif",
              lineHeight: 1.6,
              position: "relative"
            }}
          >
            {/* Header / National Seal */}
            <div style={{ textAlign: "center", borderBottom: "2px solid #1F4D36", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#8B5E34", textTransform: "uppercase" }}>
                छत्तीसगढ़ शासन • पंचायत एवं ग्रामीण विकास विभाग
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 800, color: "#1F4D36", margin: "3px 0" }}>
                कार्यालय ग्राम पंचायत कोड़ेबोड
              </div>
              <div style={{ fontSize: 11.5, color: "#486151" }}>
                तहसील: कुरूद, जिला: धमतरी (छ.ग.) • पिन कोड: 493663
              </div>
            </div>

            {/* Cert Ref & Date */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#3B5244", marginBottom: 14 }}>
              <div>प्रमाण पत्र क्र.: <span style={{ color: "#1F4D36", fontFamily: "monospace" }}>{generatedCert ? generatedCert.certNum : "GP-KBD/CERT/2026/4185"}</span></div>
              <div>दिनांक: <span>{generatedCert ? generatedCert.dateStr : "03 सितंबर 2026"}</span></div>
            </div>

            {/* Main Certificate Title */}
            <div style={{ textAlign: "center", margin: "14px 0" }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#1F4D36",
                  borderBottom: "2px solid var(--turmeric)",
                  paddingBottom: 2
                }}
              >
                :: {selectedType.title} ::
              </div>
            </div>

            {/* Hindi Legal Verification Text */}
            <p style={{ fontSize: 13, textAlign: "justify", textIndent: "2em", marginBottom: 14 }}>
              प्रमाणित किया जाता है कि <b>{applicantName}</b>, आत्मज/पत्नी <b>{guardianName}</b>, ग्राम कोड़ेबोड, <b>{ward}</b>, तहसील कुरूद, जिला धमतरी (छ.ग.) के स्थायी निवासी हैं।
            </p>

            <p style={{ fontSize: 13, textAlign: "justify", textIndent: "2em", marginBottom: 14 }}>
              मेरी पूर्ण जानकारी एवं ग्राम पंचायत के अभिलेखों के अनुसार इनका ग्राम में आचरण व चरित्र उत्तम है। यह प्रमाण पत्र इनके अनुरोध पर <b>{purpose}</b> हेतु जारी किया जाता है। इनके आधार कार्ड के अंतिम 4 अंक <b>XXXX-XXXX-{aadhaarLast4}</b> हैं।
            </p>

            {/* Signatures & Seal Block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, paddingTop: 14, borderTop: "1px dashed #CFDDD4" }}>
              {/* QR Verification */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ border: "1px solid #CFDDD4", padding: 4, borderRadius: 6, background: "#fff" }}>
                  <QrCode size={46} color="#1F4D36" />
                </div>
                <div style={{ fontSize: 10, color: "#6A7C70" }}>
                  <div><b>डिजिटल सत्यापन</b></div>
                  <div>GramEye AI Verified</div>
                </div>
              </div>

              {/* Digital Sarpanch Stamp */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    border: "2px solid #2E6B4A",
                    borderRadius: 8,
                    padding: "2px 10px",
                    color: "#2E6B4A",
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: 4,
                    display: "inline-block",
                    transform: "rotate(-2deg)",
                    background: "rgba(46,107,74,0.06)"
                  }}
                >
                  ✓ Digitally Signed & Sealed
                </div>
                <div style={{ fontWeight: 800, fontSize: 12.5, color: "#1F4D36" }}>
                  (रामेश्वर पटेल)
                </div>
                <div style={{ fontSize: 11, color: "#4D6354" }}>
                  सरपंच / सचिव
                </div>
                <div style={{ fontSize: 10, color: "#7C9184" }}>
                  ग्राम पंचायत कोड़ेबोड, धमतरी
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
