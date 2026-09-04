import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert, AlertTriangle, Phone, Volume2, VolumeX, X,
  Radio, MapPin, CheckCircle2, Siren, BellRing, ArrowRight, Plus
} from "lucide-react";

export default function EmergencyAlertModal({
  isOpen,
  onClose,
  role = "citizen"
}) {
  const [soundActive, setSoundActive] = useState(false);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: "ALERT-801",
      title: "⚠️ भारी बारिश व आकाशीय बिजली गिरने की चेतावनी (Lightning Hazard)",
      level: "CRITICAL",
      affectedWards: "Ward 4, Ward 5, Ward 6 (खेत व तालाब क्षेत्र)",
      time: "15 मिनट पूर्व जारी",
      message: "मौसम विभाग एवं आपदा प्रबंधन प्रकोष्ठ द्वारा अगले 3 घंटों में कुरूद/धमतरी क्षेत्र में गरज-चमक के साथ भारी बारिश व वज्रपात (बिजली गिरने) का ऑरेंज अलर्ट जारी किया गया है।",
      instructions: [
        "खेतों में काम कर रहे किसान भाई तुरंत ऊंचे पेड़ों और बिजली के खंभों से दूर हो जाएं।",
        "पक्के मकानों या पंचायत शेड में शरण लें, लोहे के कृषि यंत्रों को खुले मैदान में न छुएं।",
        "मवेशियों को तालाब या खुले बाड़े से हटाकर सुरक्षित स्थान पर बांधें।"
      ],
      helplines: [
        { label: "पुलिस / आपातकाल", number: "112" },
        { label: "एम्बुलेंस सेवा", number: "108" },
        { label: "विद्युत सबस्टेशन", number: "1912" },
        { label: "सरपंच इमरजेंसी सेल", number: "6268814185" }
      ]
    }
  ]);

  // Form for Sarpanch to broadcast new alert
  const [bTitle, setBTitle] = useState("");
  const [bLevel, setBLevel] = useState("CRITICAL");
  const [bWards, setBWards] = useState("Ward 1, Ward 2, Ward 3, Ward 4, Ward 5, Ward 6");
  const [bMsg, setBMsg] = useState("");

  // Web Audio API Siren Sound Synthesis
  useEffect(() => {
    let interval;
    if (soundActive) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        oscRef.current = osc;

        osc.type = "sawtooth";
        gain.gain.value = 0.12;

        let high = false;
        interval = setInterval(() => {
          if (ctx.state === "running") {
            osc.frequency.setValueAtTime(high ? 750 : 960, ctx.currentTime);
            high = !high;
          }
        }, 400);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      } catch (e) {
        console.log("Audio not allowed without gesture", e);
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    }

    return () => {
      clearInterval(interval);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, [soundActive]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!bTitle.trim() || !bMsg.trim()) return;

    const newAlert = {
      id: `ALERT-${800 + activeAlerts.length + 1}`,
      title: bTitle.trim(),
      level: bLevel,
      affectedWards: bWards,
      time: "अभी-अभी जारी (Just now)",
      message: bMsg.trim(),
      instructions: [
        "ग्राम पंचायत के सभी नागरिक सतर्क रहें और सुरक्षा प्रोटोकॉल का पालन करें।",
        "किसी भी आपात स्थिति में सीधे पंचायत हेल्पलाइन 6268814185 पर संपर्क करें।"
      ],
      helplines: [
        { label: "आपातकाल", number: "112" },
        { label: "एम्बुलेंस", number: "108" },
        { label: "सरपंच हेल्पलाइन", number: "6268814185" }
      ]
    };

    setActiveAlerts([newAlert, ...activeAlerts]);
    setBroadcastModal(false);
    setBTitle("");
    setBMsg("");
    setSoundActive(true); // Sound the alarm
  };

  if (!isOpen) return null;

  const current = activeAlerts[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(10, 0, 0, 0.85)",
        backdropFilter: "blur(14px)",
        animation: "geFadeIn 0.25s ease-out"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSoundActive(false);
          onClose();
        }
      }}
    >
      <style>{`
        @keyframes geSirenFlash {
          0%, 100% {
            box-shadow: 0 0 35px rgba(214, 69, 69, 0.6), inset 0 0 20px rgba(214, 69, 69, 0.3);
            border-color: #D64545;
          }
          50% {
            box-shadow: 0 0 70px rgba(214, 69, 69, 0.95), inset 0 0 40px rgba(214, 69, 69, 0.5);
            border-color: #FF2E2E;
          }
        }
      `}</style>

      <div
        className="ge-card"
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#130A0A",
          color: "#FBF8F0",
          border: "2px solid #D64545",
          borderRadius: 24,
          overflow: "hidden",
          animation: "geSirenFlash 1.6s infinite ease-in-out, geFadeUp 0.3s ease-out",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Siren Header */}
        <div
          style={{
            padding: "16px 22px",
            background: "linear-gradient(90deg, #571212 0%, #8A1C1C 50%, #571212 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.15)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 99,
                background: "#FF2E2E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px #FF2E2E"
              }}
            >
              <Siren size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: "#FFF" }}>
                ग्राम पंचायत आपातकालीन आपदा सायरन अलर्ट
              </div>
              <div style={{ fontSize: 11, color: "#FFB0B0" }}>
                EMERGENCY DISASTER BROADCAST • GRAM PANCHAYAT RAMPUR
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Siren Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundActive(!soundActive)}
              style={{
                background: soundActive ? "#FF2E2E" : "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer"
              }}
              title="Toggle Siren Sound"
            >
              {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundActive ? "सायरन बज रहा है" : "सायरन बजाएं"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSoundActive(false);
                onClose();
              }}
              style={{
                background: "none",
                border: "none",
                color: "#FFB0B0",
                cursor: "pointer",
                padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
          {/* Main Alert Banner */}
          <div
            style={{
              background: "rgba(214, 69, 69, 0.15)",
              border: "1.5px solid rgba(214, 69, 69, 0.4)",
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span
                style={{
                  background: "#D64545",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 900,
                  padding: "3px 10px",
                  borderRadius: 99,
                  textTransform: "uppercase"
                }}
              >
                🔴 तत्काल कार्रवाई (IMMEDIATE ACTION)
              </span>
              <span style={{ fontSize: 12, color: "#FF9C9C" }}>{current.time}</span>
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: "#FFF", lineHeight: 1.35, marginBottom: 8 }}>
              {current.title}
            </div>

            <p style={{ fontSize: 13.5, color: "#FFCECE", lineHeight: 1.6, marginBottom: 12 }}>
              {current.message}
            </p>

            <div style={{ fontSize: 12, color: "#FFA2A2", display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={14} />
              <span>प्रभावित क्षेत्र: <b>{current.affectedWards}</b></span>
            </div>
          </div>

          {/* Do's & Don'ts Checklist */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#FBF8F0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={16} color="#FF5A5A" />
              <span>नागरिक सुरक्षा निर्देश (Safety Protocols):</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {current.instructions.map((inst, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderLeft: "3px solid #D64545",
                    padding: "10px 14px",
                    borderRadius: "0 10px 10px 0",
                    fontSize: 12.5,
                    color: "#F0D8D8",
                    lineHeight: 1.45
                  }}
                >
                  {inst}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helplines Grid with 1-Click Call */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FBF8F0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={15} color="#FF5A5A" />
              <span>आपातकालीन हेल्पलाइन नंबर (Emergency Contacts):</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {current.helplines.map((hl, idx) => (
                <a
                  key={idx}
                  href={`tel:${hl.number}`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(214,69,69,0.3)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "#FFF",
                    transition: "all .15s"
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#FF9C9C" }}>{hl.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#FFF" }}>{hl.number}</div>
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 99,
                      background: "rgba(214,69,69,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Phone size={13} color="#FF8080" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Sarpanch Broadcast Trigger Option */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ fontSize: 11.5, color: "#8E7272" }}>
            कंट्रोल रूम: ग्राम पंचायत भवन, रामपुर • 24x7 अलर्ट एक्टिव
          </div>

          <button
            type="button"
            onClick={() => setBroadcastModal(true)}
            style={{
              background: "#D64545",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Radio size={14} /> नया आपदा अलर्ट जारी करें (Sarpanch)
          </button>
        </div>
      </div>

      {/* Sarpanch Broadcast Alert Modal */}
      {broadcastModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(0,0,0,0.85)"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setBroadcastModal(false);
          }}
        >
          <div
            className="ge-card"
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#1F1212",
              border: "1.5px solid #D64545",
              color: "#FFF",
              padding: 24,
              borderRadius: 20
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>नया आपातकालीन अलर्ट जारी करें</div>
              <button
                type="button"
                onClick={() => setBroadcastModal(false)}
                style={{ background: "none", border: "none", color: "#FF9C9C", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcast}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                  अलर्ट का प्रकार / शीर्षक
                </label>
                <input
                  type="text"
                  placeholder="e.g. बाढ़ / जंगली जानवर / दूषित जल चेतावनी..."
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid rgba(214,69,69,0.4)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    padding: "9px 12px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                  प्रभावित वार्ड
                </label>
                <input
                  type="text"
                  value={bWards}
                  onChange={(e) => setBWards(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid rgba(214,69,69,0.4)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    padding: "9px 12px",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, display: "block" }}>
                  नागरिकों के लिए चेतावनी संदेश
                </label>
                <textarea
                  rows={3}
                  placeholder="नागरिकों को क्या सावधानी बरतनी है..."
                  value={bMsg}
                  onChange={(e) => setBMsg(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid rgba(214,69,69,0.4)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    padding: "9px 12px",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setBroadcastModal(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "none",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: 10,
                    borderRadius: 8,
                    border: "none",
                    background: "#FF2E2E",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  🚨 सायरन बजाएं व प्रसारित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
