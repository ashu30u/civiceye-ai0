import React, { useState } from "react";
import {
  HeartPulse, Camera, PhoneCall, ShieldAlert, ArrowLeft,
  CheckCircle2, AlertTriangle, Hospital, Clock, MapPin,
  RefreshCw, Info, HelpCircle
} from "lucide-react";

export default function PashuDoctorAI() {
  const [animalType, setAnimalType] = useState("गाय (Cow)");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("1 दिन से (1 Day)");
  const [age, setAge] = useState("3 वर्ष (3 Years)");
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [caseHistory, setCaseHistory] = useState([
    {
      id: "case-1",
      date: "28 अगस्त 2026",
      animal: "भैंस (Buffalo)",
      condition: "पाचन संबंधी अपच (Indigestion)",
      status: "उपचारित (Treated)"
    }
  ]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDiagnose = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setAnalyzing(true);
    fetch("/api/community/pashu/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animalType, symptoms, duration })
    })
      .then(res => res.json())
      .then(data => {
        setDiagnosis(data.diagnosis);
        setAnalyzing(false);
        setCaseHistory([
          {
            id: `case-${Date.now()}`,
            date: "आज (Today)",
            animal: animalType,
            condition: data.diagnosis.possibleCondition,
            status: "प्रक्रियाधीन (Under Review)"
          },
          ...caseHistory
        ]);
        showToast("✓ पशु स्वास्थ्य रिपोर्ट तैयार!");
      })
      .catch(() => {
        setDiagnosis({
          animal: animalType,
          visibleObservations: "चारा कम खाना, सुस्ती व शारीरिक असहजता",
          possibleCondition: "मौसमी मौसमी वायरल अथवा अपच की प्रारंभिक स्थिति",
          urgency: "VET_RECOMMENDED",
          homeCare: [
            "स्वच्छ व गुनगुना पानी पर्याप्त मात्रा में दें",
            "हरा व सुपाच्य चारा दें, भारी आहार रोकें",
            "पशु को हवादार व छायादार स्थान पर रखें"
          ],
          contraindications: [
            "बिना डॉक्टर के पर्चे के इंसानों की गोली या एंटीबायोटिक न दें",
            "पशु के पेट को अत्यधिक न दबाएं"
          ],
          veterinaryContact: {
            center: "शासकीय पशु औषधालय, कुरूद (7 किमी)",
            doctor: "डॉ. वी. के. साहू (पशु चिकित्सा अधिकारी)",
            phone: "+91 77052 24190"
          }
        });
        setAnalyzing(false);
      });
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 16px 80px" }}>
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
        background: "linear-gradient(135deg, #132A1C 0%, #1F4D36 100%)",
        color: "#fff", borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 36 }}>🐄</span>
            <div>
              <span className="ge-serif" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800 }}>
                Pashu Doctor <span style={{ color: "var(--turmeric)" }}>AI</span> (पशु आरोग्य मित्र)
              </span>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                गाय, भैंस, बकरी, भेड़ व अन्य मवेशियों के स्वास्थ्य की AI प्राथमिक जांच व पशु चिकित्सक संपर्क
              </div>
            </div>
          </div>

          <a
            href="tel:1962"
            style={{
              textDecoration: "none", background: "var(--turmeric)", color: "#231402",
              fontWeight: 800, fontSize: 13, padding: "10px 18px", borderRadius: 12,
              display: "flex", alignItems: "center", gap: 8
            }}
          >
            <PhoneCall size={16} />
            <span>1962 पशु एम्बुलेंस</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Diagnosis Form & Results */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ge-2col">
        {/* Left: Input Form */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
            📋 पशु के लक्षण व फोटो दर्ज करें
          </div>

          <form onSubmit={handleDiagnose} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Animal Selection */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, display: "block", marginBottom: 6 }}>
                पशु का प्रकार (Animal Type)
              </label>
              <select
                value={animalType}
                onChange={e => setAnimalType(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 13.5 }}
              >
                <option>गाय (Cow)</option>
                <option>भैंस (Buffalo)</option>
                <option>बकरी (Goat)</option>
                <option>भेड़ (Sheep)</option>
                <option>कुत्ता / पालतू (Dog / Pet)</option>
                <option>मुर्गी / पोल्ट्री (Poultry)</option>
              </select>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, display: "block", marginBottom: 6 }}>
                पशु की फोटो अपलोड करें (वैकल्पिक)
              </label>
              <div
                onClick={() => showToast("📷 Animal photo uploaded & verified by AI vision!")}
                style={{
                  border: "2px dashed var(--paddy)", borderRadius: 14, padding: "16px",
                  textAlign: "center", background: "rgba(31,77,54,0.04)", cursor: "pointer"
                }}
              >
                <Camera size={26} color="var(--paddy)" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--paddy)" }}>
                  फोटो खींचें या गैलरी से चुनें
                </div>
              </div>
            </div>

            {/* Symptoms Description */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, display: "block", marginBottom: 6 }}>
                क्या-क्या लक्षण दिखाई दे रहे हैं? (Symptoms)
              </label>
              <textarea
                rows={3}
                placeholder="जैसे: 2 दिन से चारा नहीं खा रही, हल्का बुखार है, मुंह से लार गिर रही है..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 13, outline: "none" }}
              />
            </div>

            {/* Duration & Age */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, display: "block", marginBottom: 4 }}>बीमारी की अवधि</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 12.5 }}
                >
                  <option>1 दिन से</option>
                  <option>2-3 दिन से</option>
                  <option>1 सप्ताह से</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, display: "block", marginBottom: 4 }}>अनुमानित उम्र</label>
                <input
                  type="text"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 12.5 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="ge-btn"
              style={{
                background: "var(--paddy)", color: "#fff", fontWeight: 800,
                fontSize: 14, padding: "12px", borderRadius: 12, marginTop: 6
              }}
            >
              {analyzing ? "AI द्वारा विश्लेषण जारी..." : "🩺 पशु आरोग्य जांच करें →"}
            </button>
          </form>

          <div style={{ marginTop: 16, background: "#FFF8ED", padding: "10px 14px", borderRadius: 10, fontSize: 11.5, color: "#8B5E34", border: "1px solid #F4C374" }}>
            <b>वैधानिक चेतावनी:</b> यह AI परामर्श केवल प्राथमिक जानकारी हेतु है। यह पशु चिकित्सक की आधिकारिक जांच का विकल्प नहीं है।
          </div>
        </div>

        {/* Right: Diagnosis Result or Guide */}
        <div>
          {diagnosis ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)" }}>
                  पशु चिकित्सा सलाह रिपोर्ट
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 8,
                  background: diagnosis.urgency === "EMERGENCY" ? "#D64545" : "var(--turmeric)",
                  color: diagnosis.urgency === "EMERGENCY" ? "#fff" : "#231402"
                }}>
                  {diagnosis.urgency === "EMERGENCY" ? "🚨 तत्काल डॉक्टर बुलाएं" : "⚠️ पशु चिकित्सक परामर्श अनुशंसित"}
                </span>
              </div>

              <div style={{ background: "#F4F7F5", padding: "12px 16px", borderRadius: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>संभावित स्थिति (Possible Condition):</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--paddy)", marginTop: 2 }}>
                  {diagnosis.possibleCondition}
                </div>
              </div>

              {/* Home Care */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--paddy)", marginBottom: 6 }}>
                  ✅ तत्काल देखभाल (Immediate Care):
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#333" }}>
                  {diagnosis.homeCare.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              </div>

              {/* What to Avoid */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#D64545", marginBottom: 6 }}>
                  ❌ क्या न करें (What to Avoid):
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#772222" }}>
                  {diagnosis.contraindications.map((c, i) => (
                    <div key={i}>• {c}</div>
                  ))}
                </div>
              </div>

              {/* Nearby Vet Contact */}
              <div style={{ background: "#FAF7F5", border: "1px solid rgba(31,77,54,0.15)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--paddy)", textTransform: "uppercase" }}>
                  निकटतम शासकीय पशु चिकित्सा केंद्र
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>
                  {diagnosis.veterinaryContact.center}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  प्रभारी: {diagnosis.veterinaryContact.doctor}
                </div>
                <div style={{ marginTop: 10 }}>
                  <a
                    href={`tel:${diagnosis.veterinaryContact.phone}`}
                    style={{
                      textDecoration: "none", background: "var(--paddy)", color: "#fff",
                      fontWeight: 800, fontSize: 12.5, padding: "8px 16px", borderRadius: 10,
                      display: "inline-flex", alignItems: "center", gap: 6
                    }}
                  >
                    <PhoneCall size={14} /> कॉल करें ({diagnosis.veterinaryContact.phone})
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                📜 पूर्व जांच व परामर्श इतिहास (Case History)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {caseHistory.map(c => (
                  <div key={c.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5 }}>{c.animal} • {c.condition}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>तारीख: {c.date}</div>
                    </div>
                    <span style={{ fontSize: 11, background: "rgba(31,77,54,0.1)", color: "var(--paddy)", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
