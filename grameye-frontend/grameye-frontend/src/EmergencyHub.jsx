import React, { useState, useEffect } from "react";
import {
  PhoneCall, ShieldAlert, AlertOctagon, Flame, Hospital, Navigation,
  Share2, MapPin, CheckCircle, AlertTriangle, Volume2, UserCheck
} from "lucide-react";

export default function EmergencyHub() {
  const [userLocation, setUserLocation] = useState({
    name: "Kodebod (कोड़ेबोड पंचायत भवन)",
    district: "Kurud, Dhamtari",
    lat: 20.8350,
    lon: 81.7150,
    gpsAccurate: false
  });
  const [sosActive, setSosActive] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Locate User via GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(prev => ({
            ...prev,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            gpsAccurate: true,
            name: `GPS Location (${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`
          }));
        },
        () => {}
      );
    }
  }, []);

  const handleTriggerSOS = () => {
    setSosActive(true);
    showToast("🚨 SOS Emergency Alert Activated! Audio alarm & location broadcast initiated.");
  };

  const emergencyServices = [
    {
      id: "amb",
      title: "108 Ambulance",
      hindi: "एम्बुलेंस सेवा",
      phone: "108",
      color: "#D64545",
      bg: "#FFF0F0",
      icon: "🚑",
      desc: "24x7 निःशुल्क आपातकालीन चिकित्सा व प्रसव वाहन"
    },
    {
      id: "pol",
      title: "112 / 100 Police",
      hindi: "पुलिस सहायता",
      phone: "112",
      color: "#1A365D",
      bg: "#EDF2F7",
      icon: "🚓",
      desc: "डायल 112 एकीकृत आपातकालीन पुलिस व सुरक्षा दस्ता"
    },
    {
      id: "fire",
      title: "101 Fire Brigade",
      hindi: "अग्निशमन दल",
      phone: "101",
      color: "#C53030",
      bg: "#FFF5F5",
      icon: "🔥",
      desc: "कुरूद व धमतरी दमकल केंद्र तुरंत रवाना"
    },
    {
      id: "hosp",
      title: "CHC Kurud Hospital",
      hindi: "सामुदायिक स्वास्थ्य केंद्र",
      phone: "+91 77052 24108",
      color: "#2C7A7B",
      bg: "#E6FFFA",
      icon: "🏥",
      desc: "तहसील मुख्यालय 24x7 ट्रॉमा व इमरजेंसी वार्ड (7 किमी)"
    },
    {
      id: "panch",
      title: "Panchayat Control",
      hindi: "ग्राम पंचायत सचिव / सरपंच",
      phone: "+91 62688 14185",
      color: "#276749",
      bg: "#F0FFF4",
      icon: "👮",
      desc: "कोड़ेबोड स्थानीय राहत व आपदा समन्वय दल"
    },
    {
      id: "disaster",
      title: "1077 Disaster Helpline",
      hindi: "बाढ़ व आपदा प्रबंधन",
      phone: "1077",
      color: "#744210",
      bg: "#FFFFF0",
      icon: "🌊",
      desc: "धमतरी जिला कलेक्टर आपदा नियंत्रण कक्ष"
    }
  ];

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

      {/* SOS Giant Emergency Bar */}
      <div style={{
        background: sosActive
          ? "linear-gradient(135deg, #FF0000 0%, #780206 100%)"
          : "linear-gradient(135deg, #9B1C1C 0%, #D64545 100%)",
        color: "#fff", borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(214,69,69,0.35)", textAlign: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <AlertOctagon size={36} color="#fff" />
          <span className="ge-serif" style={{ fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 900 }}>
            ग्रामआई आपातकालीन सहायता केंद्र (Emergency Hub)
          </span>
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", maxWidth: 680, margin: "0 auto 20px" }}>
          किसी भी संकट, दुर्घटना, आग, स्वास्थ्य विपत्ति में केवल एक टैप से त्वरित सहायता प्राप्त करें।
        </div>

        {/* Big SOS Button */}
        <button
          onClick={handleTriggerSOS}
          style={{
            background: "#fff", color: "#D64545", fontWeight: 900, fontSize: 20,
            padding: "16px 42px", borderRadius: 20, border: "none", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)", display: "inline-flex", alignItems: "center", gap: 10
          }}
        >
          <Volume2 size={24} />
          <span>{sosActive ? "🚨 SOS ACTIVE (आपातकालीन अलर्ट जारी)" : "🚨 TAP TO TRIGGER SOS ALERT"}</span>
        </button>
      </div>

      {/* GPS Location Bar */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: "16px 20px", marginBottom: 24,
        boxShadow: "0 4px 18px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MapPin size={22} color="var(--paddy)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              आपकी वर्तमान स्थिति (Current Location):
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              {userLocation.name} • {userLocation.lat.toFixed(4)}°N, {userLocation.lon.toFixed(4)}°E
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const locStr = `Emergency Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lon}`;
            if (navigator.share) {
              navigator.share({ title: "My Emergency Location", text: locStr });
            } else {
              navigator.clipboard.writeText(locStr);
              showToast("📍 Emergency Location link copied to clipboard!");
            }
          }}
          className="ge-btn"
          style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, fontSize: 13, padding: "8px 16px", borderRadius: 10 }}
        >
          <Share2 size={15} /> स्थान शेयर करें (Share Location)
        </button>
      </div>

      {/* 6 Large High-Contrast Emergency Service Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="ge-2col">
        {emergencyServices.map(srv => (
          <div
            key={srv.id}
            style={{
              background: srv.bg, borderRadius: 20, padding: 22, border: `2px solid ${srv.color}30`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 40 }}>{srv.icon}</span>
                <span style={{
                  fontSize: 18, fontWeight: 900, color: srv.color, background: "#fff",
                  padding: "4px 12px", borderRadius: 10, border: `1px solid ${srv.color}40`
                }}>
                  {srv.phone}
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: 19, color: "#111" }}>{srv.title}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: srv.color, marginTop: 2 }}>{srv.hindi}</div>
              <div style={{ fontSize: 12.5, color: "#555", marginTop: 8, lineHeight: 1.45 }}>{srv.desc}</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <a
                href={`tel:${srv.phone}`}
                style={{
                  textDecoration: "none", background: srv.color, color: "#fff",
                  fontWeight: 900, fontSize: 15, padding: "12px 18px", borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: `0 6px 18px ${srv.color}40`
                }}
              >
                <PhoneCall size={18} />
                <span>अभी कॉल करें (Call {srv.phone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
