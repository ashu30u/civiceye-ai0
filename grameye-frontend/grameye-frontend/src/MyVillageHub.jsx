import React, { useState } from "react";
import {
  Home, MapPin, Sun, Droplets, Zap, ShieldAlert, Users,
  BookOpen, Sparkles, Building2, Bell, Briefcase, ChevronRight,
  Send, Bot, HelpCircle, MessageSquare
} from "lucide-react";

export default function MyVillageHub({ setPage }) {
  const [selectedVillage, setSelectedVillage] = useState("Kodebod");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      q: "कोड़ेबोड में कौन-कौन सी प्राथमिक सुविधाएं उपलब्ध हैं?",
      a: "कोड़ेबोड (कुरूद, धमतरी) में 1 शासकीय प्राथमिक शाला, 1 पूर्व माध्यमिक शाला, 1 उप-स्वास्थ्य केंद्र (Ward 3), आँगनवाड़ी केंद्र, पंचायत भवन, शीतला मंदिर व 2 सार्वजनिक निस्तारी तालाब उपलब्ध हैं। गाँव 100% विद्युतीकृत है और हर घर नल जल योजना से आच्छादित है।"
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const villageData = {
    name: "कोड़ेबोड (Kodebod)",
    district: "धमतरी (Dhamtari)",
    tehsil: "कुरूद (Kurud - 7 km)",
    state: "छत्तीसगढ़ (Chhattisgarh)",
    pincode: "493663",
    censusCode: "446794",
    population: "1,870 (Census 2011)",
    households: "365",
    literacy: "79.34%",
    sexRatio: "1,050",
    sarpanch: "रामेश्वर पटेल",
    secretary: "संतोष साहू"
  };

  const handleAiAsk = (customQ) => {
    const q = (customQ || aiQuestion).trim();
    if (!q) return;

    setAiLoading(true);
    setAiQuestion("");

    setTimeout(() => {
      let reply = "कोड़ेबोड ग्राम पंचायत धमतरी जिले के कुरूद ब्लॉक में स्थित एक आदर्श कृषि बहुल गाँव है।";
      const lq = q.toLowerCase();

      if (lq.includes("मौसम") || lq.includes("weather")) {
        reply = "कोड़ेबोड में वर्तमान मौसम सुहावना है (28°C, हल्की धूप व छांव)। हवा की गति 11 किमी/घंटा है और फसलों पर छिड़काव हेतु स्थिति अनुकूल है।";
      } else if (lq.includes("सुविधा") || lq.includes("facility") || lq.includes("school") || lq.includes("hospital")) {
        reply = "गाँव में वार्ड 3 में उप-स्वास्थ्य केंद्र, 2 शासकीय शालाएं, पंचायत सूचना केंद्र, पक्की सड़कें (PMGSY) व 24x7 बिजली आपूर्ति उपलब्ध है।";
      } else if (lq.includes("शिकायत") || lq.includes("problem") || lq.includes("complaint")) {
        reply = "हाल ही में वार्ड 4 में स्ट्रीटलाइट और वार्ड 2 में पेयजल पाइपलाइन के त्वरित निराकरण हेतु कार्य आदेश जारी किए गए हैं। कुल समाधान दर 94% है।";
      } else if (lq.includes("योजना") || lq.includes("scheme")) {
        reply = "गाँव में प्रधानमंत्री आवास योजना, महतारी वंदन योजना, राजीव गांधी किसान न्याय योजना और जल जीवन मिशन का 100% क्रियान्वयन प्रगति पर है।";
      }

      setAiChatHistory(prev => [{ q, a: reply }, ...prev]);
      setAiLoading(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 16px 90px" }}>
      {/* Top Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #132A1C 0%, #1F4D36 60%, #2E6B4A 100%)",
        color: "#fff", borderRadius: 24, padding: "32px 28px", marginBottom: 24,
        boxShadow: "0 16px 40px rgba(19,42,28,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--turmeric)", fontWeight: 800, textTransform: "uppercase" }}>
              <Home size={18} />
              <span>MY VILLAGE DIGITAL IDENTITY • डिजिटल ग्राम पंचायत</span>
            </div>
            <div className="ge-serif" style={{ fontSize: "clamp(26px, 4.5vw, 36px)", fontWeight: 800, marginTop: 4 }}>
              {villageData.name}
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
              तहसील: {villageData.tehsil} • जिला: {villageData.district} • पिन: {villageData.pincode} • जनगणना कोड: {villageData.censusCode}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setPage && setPage("kodebod")}
              className="ge-btn"
              style={{
                background: "var(--turmeric)", color: "#231402", fontWeight: 800,
                fontSize: 13, padding: "10px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6
              }}
            >
              🌾 Live Kodebod दर्शन <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 24,
          background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: "16px 20px"
        }} className="ge-2col">
          <div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>कुल जनसंख्या</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{villageData.population}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>साक्षरता दर</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{villageData.literacy}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>लिंगानुपात (Sex Ratio)</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{villageData.sexRatio}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>कुल परिवार (Households)</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{villageData.households}</div>
          </div>
        </div>
      </div>

      {/* 360 Village Services Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }} className="ge-3col">
        {[
          { title: "🌦️ मौसम व वर्षा", desc: "28°C धूप-छांव • सिंचाई व कृषि सलाह", page: "smartWeather", color: "#3C87A6" },
          { title: "🌾 कृषि व किसान चौपाल", desc: "महानदी नहर जल • रोग जांच व खाद सलाह", page: "farmerCommunity", color: "#1F4D36" },
          { title: "🩺 स्वास्थ्य व आपातकाल", desc: "उप-स्वास्थ्य केंद्र Ward 3 • 108 एम्बुलेंस", page: "healthGuard", color: "#D64545" },
          { title: "🐄 पशु डॉक्टर AI", desc: "मवेशी रोग जांच • 1962 पशु एम्बुलेंस", page: "pashuDoctor", color: "#8B5E34" },
          { title: "⚡ बिजली निगरानी", desc: "100% विद्युतीकृत • लाइनमैन तुरंत अलर्ट", page: "powerReport", color: "#E8A33D" },
          { title: "💼 ग्रामीण रोजगार", desc: "कुशल तकनीकी, ड्राइवर, शिक्षक कार्य", page: "localJobs", color: "#2B6CB0" },
          { title: "📜 प्रमाण पत्र पोर्टल", desc: "डिजिटल निवास, जाति व आय प्रमाण पत्र", page: "certificates", color: "#4A5568" },
          { title: "💰 ग्राम निधि (बजट)", desc: "100% पारदर्शी सार्वजनिक विकास खर्च", page: "gramNidhi", color: "#2F855A" },
          { title: "🚀 Coodenest Connect", desc: "गाँव का सोशल हब • रील्स, विचार व सहयोग", page: "coodenest", color: "#9F7AEA" }
        ].map((svc, idx) => (
          <div
            key={idx}
            onClick={() => setPage && setPage(svc.page)}
            style={{
              background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer", display: "flex", flexDirection: "column",
              justifyContent: "space-between", transition: "transform .2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)", marginBottom: 6 }}>
                {svc.title}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>
                {svc.desc}
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: svc.color, display: "flex", alignItems: "center", gap: 4 }}>
              खोलें (Open) <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* "ASK ABOUT THIS VILLAGE" AI ASSISTANT */}
      <div style={{
        background: "#fff", borderRadius: 24, padding: 28, boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
        border: "1.5px solid rgba(31,77,54,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(31,77,54,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={22} color="var(--paddy)" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink-text)" }}>
              Ask About This Village (गाँव के बारे में AI से पूछें)
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              कोड़ेबोड की सुविधाओं, इतिहास, कृषि, योजनाओं व विकास कार्यों के बारे में सवाल पूछें
            </div>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            "कोड़ेबोड में कौन-कौन सी प्राथमिक सुविधाएं हैं?",
            "वर्तमान में गाँव का मौसम कैसा है?",
            "गाँव में हाल ही में कौन से विकास कार्य हुए हैं?",
            "धान उपार्जन व कृषि योजनाएं क्या हैं?"
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleAiAsk(prompt)}
              className="ge-btn"
              style={{
                fontSize: 12, background: "#F4F7F5", color: "var(--paddy)", fontWeight: 700,
                padding: "6px 12px", borderRadius: 10, border: "1px solid rgba(31,77,54,0.15)"
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Question Input Box */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="कोड़ेबोड के बारे में कोई भी सवाल लिखें..."
            value={aiQuestion}
            onChange={e => setAiQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAiAsk()}
            style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: "1px solid #ccc", fontSize: 13.5, outline: "none" }}
          />
          <button
            onClick={() => handleAiAsk()}
            disabled={aiLoading}
            className="ge-btn"
            style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "0 22px", borderRadius: 12 }}
          >
            {aiLoading ? "खोज रहे हैं..." : "पूछें →"}
          </button>
        </div>

        {/* Q&A Stream */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {aiChatHistory.map((item, idx) => (
            <div key={idx} style={{ background: "#F9FCFA", border: "1px solid rgba(31,77,54,0.1)", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink-text)", marginBottom: 6 }}>
                ❓ {item.q}
              </div>
              <div style={{ fontSize: 13, color: "#333", lineHeight: 1.55 }}>
                💡 {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
