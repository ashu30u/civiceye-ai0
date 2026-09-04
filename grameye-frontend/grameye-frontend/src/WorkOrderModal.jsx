import React, { useRef } from "react";
import {
  X, Printer, Share2, Download, CheckCircle2, ShieldCheck,
  Building2, MapPin, Calendar, Clock, QrCode, FileText, ArrowUpRight
} from "lucide-react";

export default function WorkOrderModal({
  isOpen,
  onClose,
  complaint
}) {
  const printRef = useRef(null);

  if (!isOpen || !complaint) return null;

  const workOrderNo = `GP-RMP/2026/WO/${complaint.id.replace("GRM-", "")}`;
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const estimatedBudget = {
    "Road Damage": "₹35,000 (Pothole Cold Mix Patching)",
    "Water Leakage": "₹18,500 (Pipeline Welding & Gasket Replacement)",
    "Broken Streetlight": "₹8,200 (LED Fixture & Bracket Replacement)",
    "Garbage & Drainage": "₹12,000 (Drain Desilting & Disinfection)",
    "Electrical Hazard": "₹24,000 (Conductor Re-tensioning & Insulator Replacement)",
    "School Infrastructure": "₹45,000 (Plastering & Structural Reinforcement)",
    "Healthcare Access": "₹28,000 (Sub-centre Roof Waterproofing)",
    "Transport Issue": "₹15,000 (Bus Shelter Tin Sheet Restoration)",
    "Environmental": "₹20,000 (Pond Embankment Geo-textile Bunding)"
  }[complaint.category] || "₹22,000 (Standard Panchayat Repair Allocation)";

  const contractorAssigned = {
    "Public Works": "Shahu Earthmovers & Construction Pvt Ltd (Reg: CG-PWD-89)",
    "Water Department": "Shree Ram Hydro & Sanitation Services (PHE Empanelled)",
    "Electricity Department": "CSPDCL Substation Line Crew (Kurud Feeder)",
    "Sanitation": "Gram Swachhta Seva Samiti (Ward 1-6)",
    "Education": "Panchayat Infrastructure Works Committee",
    "Healthcare": "Block Medical Maintenance Wing, Dhamtari",
    "Transport": "Zila Parishad Rural Transport Cell",
    "Environment": "Van Sanrakshan Samiti, Kodebod"
  }[complaint.dept] || "Authorized Panchayat Field Crew";

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*OFFICIAL PANCHAYAT WORK ORDER*\n` +
      `Order No: ${workOrderNo}\n` +
      `Category: ${complaint.category}\n` +
      `Ward: ${complaint.ward}\n` +
      `Assigned Contractor: ${contractorAssigned}\n` +
      `Budget: ${estimatedBudget}\n` +
      `SLA: 48 Hours\n` +
      `View Digital Copy: http://localhost:5173/`
    );
    window.open(`https://wa.me/916268814185?text=${text}`, "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(8, 19, 12, 0.82)",
        backdropFilter: "blur(12px)",
        overflowY: "auto",
        animation: "geFadeIn 0.25s ease-out"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .ge-printable-letterhead, .ge-printable-letterhead * { visibility: visible; }
          .ge-printable-letterhead {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          .ge-no-print { display: none !important; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 780,
          background: "#fff",
          color: "#1B2820",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh"
        }}
      >
        {/* Modal Action Header (No Print) */}
        <div
          className="ge-no-print"
          style={{
            padding: "14px 22px",
            background: "#0E1D14",
            color: "#FBF8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} color="var(--turmeric)" />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Official Government Work Order & Notice Generator</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#FBF8F0",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>

            <button
              onClick={handleWhatsAppShare}
              style={{
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Share2 size={14} /> Share on WhatsApp
            </button>

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#8EAA97",
                cursor: "pointer",
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div
          ref={printRef}
          className="ge-printable-letterhead"
          style={{
            padding: "36px 44px",
            overflowY: "auto",
            fontFamily: "'Manrope', 'Times New Roman', serif",
            lineHeight: 1.5
          }}
        >
          {/* Government Official Header */}
          <div
            style={{
              borderBottom: "3px double #1F4D36",
              paddingBottom: 16,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ textAlign: "center", width: "100%" }}>
              {/* National Emblem / Seal Representation */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "#8B5E34",
                  textTransform: "uppercase"
                }}
              >
                GOVERNMENT OF CHHATTISGARH • PANCHAYAT & RURAL DEVELOPMENT
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1F4D36",
                  margin: "4px 0"
                }}
              >
                कार्यालय ग्राम पंचायत कोड़ेबोड (कुटुंब विकास प्रभाग)
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3C4E43" }}>
                OFFICE OF THE GRAM PANCHAYAT KODEBOD, TEHSIL KURUD, DISTT DHAMTARI (C.G.)
              </div>
              <div style={{ fontSize: 11, color: "#6A7C70", marginTop: 2 }}>
                Digital Governance Portal: GramEye AI (Civic Redressal & Engineering Cell) • PIN: 493663
              </div>
            </div>
          </div>

          {/* Reference No & Date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#2C3D32",
              marginBottom: 16,
              padding: "6px 0",
              borderBottom: "1px solid #E2EAE5"
            }}
          >
            <div>
              पत्र क्रमांक (Ref No): <span style={{ color: "#1F4D36", fontFamily: "monospace" }}>{workOrderNo}</span>
            </div>
            <div>
              दिनांक (Date): <span>{currentDate}</span>
            </div>
          </div>

          {/* Subject Line */}
          <div
            style={{
              background: "#F4F7F5",
              borderLeft: "4px solid #1F4D36",
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13.5
            }}
          >
            <b>विषय (SUBJECT):</b> आपातकालीन ग्राम शिकायत निराकरण कार्य आदेश — <b>{complaint.category}</b> ({complaint.ward})
          </div>

          {/* Recipient Contractor / Officer */}
          <div style={{ fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
            <b>सेवा में (To):</b><br />
            <b>{contractorAssigned}</b><br />
            संबद्ध विभाग: <b>{complaint.dept}</b>, ग्राम पंचायत कोड़ेबोड
          </div>

          <p style={{ fontSize: 13, textAlign: "justify", marginBottom: 18 }}>
            ग्रामआई एआई (GramEye AI) पोर्टल के माध्यम से प्राप्त नागरिक शिकायत क्रमांक <b>{complaint.id}</b> का AI विज़न एवं जीपीएस सत्यापन पूर्ण कर लिया गया है। सक्षम प्राधिकारी (सरपंच/सचिव) द्वारा स्थल निरीक्षण उपरांत तत्काल प्रभाव से निम्नलिखित मरम्मत व सुधार कार्य निष्पादित करने हेतु यह कार्य आदेश जारी किया जाता है:
          </p>

          {/* Technical Specs Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12.5,
              marginBottom: 22,
              border: "1px solid #CFDDD4"
            }}
          >
            <tbody>
              <tr style={{ background: "#EDF3EF" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, width: "35%", border: "1px solid #CFDDD4" }}>शिकायत कोड (Complaint ID)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4", fontFamily: "monospace", fontWeight: 800 }}>{complaint.id}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>समस्या का प्रकार (Category)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4" }}>{complaint.category}</td>
              </tr>
              <tr style={{ background: "#EDF3EF" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>स्थल व वार्ड (Location & Ward)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4" }}>{complaint.ward} (GPS Geotagged)</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>गंभीरता स्तर (Severity Level)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4", fontWeight: 700, color: complaint.severity === "CRITICAL" ? "#D64545" : "#E0703A" }}>
                  {complaint.severity} PRIORITY (Immediate Action)
                </td>
              </tr>
              <tr style={{ background: "#EDF3EF" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>स्वीकृत बजट अनुमान (Sanctioned Budget)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4", fontWeight: 800, color: "#1F4D36" }}>{estimatedBudget}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>कार्य पूर्ण करने की समय-सीमा (SLA)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4", fontWeight: 700 }}>48 घंटे (Within 48 Hours)</td>
              </tr>
              <tr style={{ background: "#EDF3EF" }}>
                <td style={{ padding: "8px 12px", fontWeight: 700, border: "1px solid #CFDDD4" }}>फंड स्रोत (Financing Scheme)</td>
                <td style={{ padding: "8px 12px", border: "1px solid #CFDDD4" }}>15th Finance Commission Untied Grant / Gram Nidhi 2026</td>
              </tr>
            </tbody>
          </table>

          {/* Terms & Conditions */}
          <div style={{ fontSize: 11.5, color: "#45584C", marginBottom: 26, background: "#FAF7F0", padding: "10px 14px", borderRadius: 8, border: "1px solid #EAE2D2" }}>
            <b>निर्देश व शर्तें:</b><br />
            1. कार्य पूर्ण होने के उपरांत ग्रामआई मोबाइल ऐप से <b>BEFORE / AFTER फोटो</b> अपलोड करना अनिवार्य है।<br />
            2. वार्ड पंच एवं संबंधित नागरिक द्वारा डिजिटल सत्यापन के पश्चात ही अंतिम देयक (Final Payment) जारी किया जाएगा।<br />
            3. कार्य निष्पादन में किसी भी प्रकार की लापरवाही पाए जाने पर अनुशासनात्मक कार्रवाई की जाएगी।
          </div>

          {/* Signature & QR Stamp Block */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
            {/* Scannable QR */}
            <div style={{ textAlign: "center", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ border: "1px solid #CFDDD4", padding: 6, borderRadius: 8, background: "#fff" }}>
                <QrCode size={52} color="#1F4D36" />
              </div>
              <div style={{ textAlign: "left", fontSize: 10.5, color: "#6A7C70" }}>
                <div><b>Scan to Verify</b></div>
                <div>GramEye Public Ledger</div>
                <div>Hash: #GRM-SEC-8902</div>
              </div>
            </div>

            {/* Official Stamp & Digital Sign */}
            <div style={{ textAlign: "center", position: "relative" }}>
              {/* Digital Green Stamp */}
              <div
                style={{
                  display: "inline-block",
                  border: "2px solid #2E6B4A",
                  borderRadius: 10,
                  padding: "4px 14px",
                  color: "#2E6B4A",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: 6,
                  transform: "rotate(-3deg)",
                  background: "rgba(46,107,74,0.06)"
                }}
              >
                ✓ Digitally Signed & Sealed
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#1F4D36" }}>
                (रामेश्वर पटेल / Rameshwar Patel)
              </div>
              <div style={{ fontSize: 11.5, color: "#4D6354" }}>
                सरपंच / Sarpanch & सचिव / Secretary
              </div>
              <div style={{ fontSize: 10.5, color: "#7C9184" }}>
                ग्राम पंचायत कोड़ेबोड, जिला धमतरी (छ.ग.)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
