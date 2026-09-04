import React, { useState, useEffect } from "react";
import {
  Users, MessageCircle, Heart, Share2, Sparkles, CheckCircle2,
  PlusCircle, Camera, Search, Filter, Send, Sprout, ArrowUpRight
} from "lucide-react";

export default function FarmerCommunity({ currentUser, addXp }) {
  const [discussions, setDiscussions] = useState([]);
  const [askModal, setAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Crop Disease");
  const [replyText, setReplyText] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetch("/api/community/farmer-chopal")
      .then(res => res.json())
      .then(data => {
        if (data.discussions) setDiscussions(data.discussions);
      })
      .catch(() => {
        setDiscussions([
          {
            id: "chp-1",
            author: "रामेश्वर पटेल",
            role: "वरिष्ठ कृषक (वार्ड 2)",
            title: "धान में बालियां निकलने के समय गंधी बग कीट का प्रकोप कैसे रोकें?",
            content: "हमारे खेत में बालियों से दूधिया रस चूसने वाले कीड़े दिखाई दे रहे हैं। जैविक उपाय क्या रहेगा?",
            category: "Crop Disease",
            likes: 24,
            replies: [
              {
                author: "GramAI कृषि सहायक (AI Bot)",
                isAi: true,
                text: "दूधिया अवस्था में नीम तेल (Azadirachtin 1500 PPM) 5 मिली प्रति लीटर पानी का छिड़काव शाम के समय करें। खेत की मेड़ों पर रोशनी का फंदा (Light Trap) लगाएं।"
              },
              {
                author: "डॉ. वीरेन्द्र वर्मा (कृषि वैज्ञानिक, KVK धमतरी)",
                isExpert: true,
                text: "रासायनिक नियंत्रण के लिए मैलाथियान 5% डस्ट 10 किग्रा/एकड़ सुबह ओस सूखने से पहले भुरकाव करें।"
              }
            ]
          },
          {
            id: "chp-2",
            author: "दिलीप कुमार साहू",
            role: "सब्जी उत्पादक किसान",
            title: "महानदी नहर का रबी फसल के लिए जल आवक चक्र कब से शुरू होगा?",
            content: "गेहूं व चना बोने से पहले पलेवा (Pre-sowing irrigation) हेतु पानी कब छोड़ा जाएगा?",
            category: "Irrigation",
            likes: 19,
            replies: [
              {
                author: "सिंचाई विभाग कुरूद नोडल अधिकारी",
                isExpert: true,
                text: "जल उपभोक्ता संथा की बैठक अनुसार 15 नवंबर से नहर में टेल-एंड तक पानी प्रवाहित किया जाएगा।"
              }
            ]
          }
        ]);
      });
  }, []);

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newQ = {
      id: `chp-${Date.now()}`,
      author: currentUser?.fullName || "राहुल साहू (कृषक)",
      role: "किसान भाई, कोड़ेबोड",
      title: newTitle,
      content: newContent,
      category: newCategory,
      likes: 1,
      replies: [
        {
          author: "GramAI कृषि सहायक (AI Bot)",
          isAi: true,
          text: `नमस्ते! "${newTitle}" पर कोड़ेबोड के क्षेत्रीय कृषि विशेषज्ञों और ग्रामआई एआई का परामर्श तैयार किया गया है। जैविक उपचार एवं वैज्ञानिक सलाह हेतु जल्द अनुभवी किसान भी प्रतिक्रिया देंगे।`
        }
      ]
    };

    setDiscussions([newQ, ...discussions]);
    setAskModal(false);
    setNewTitle("");
    setNewContent("");
    if (addXp) addXp(15);
    showToast("🌾 प्रश्न चौपाल पर प्रकाशित हुआ! (+15 XP)");
  };

  const handleReplySubmit = (chpId) => {
    const text = (replyText[chpId] || "").trim();
    if (!text) return;

    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === chpId) {
          return {
            ...d,
            replies: [
              ...d.replies,
              {
                author: currentUser?.fullName || "किसान भाई",
                isExpert: false,
                text
              }
            ]
          };
        }
        return d;
      })
    );
    setReplyText(prev => ({ ...prev, [chpId]: "" }));
    if (addXp) addXp(5);
    showToast("✓ आपका उत्तर जोड़ा गया!");
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
        background: "linear-gradient(135deg, #1F4D36 0%, #132A1C 100%)",
        color: "#fff", borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 32 }}>🧑🌾</span>
              <div>
                <span className="ge-serif" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800 }}>
                  Kisan Chopal <span style={{ color: "var(--turmeric)" }}>(किसान चौपाल)</span>
                </span>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                  गाँव के किसानों का साझा मंच — फसल रोग, मंडी भाव, खाद-बीज व तकनीक पर सवाल पूछें व अनुभव साझा करें
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAskModal(true)}
            className="ge-btn"
            style={{
              background: "var(--turmeric)", color: "#231402", fontWeight: 800,
              fontSize: 13, padding: "10px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6
            }}
          >
            <PlusCircle size={16} />
            <span>प्रश्न पूछें (Ask Question)</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, overflowX: "auto", paddingBottom: 4 }}>
          {["All", "Crop Disease", "Irrigation", "Fertilizer", "Mandi Rates", "Govt Schemes"].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className="ge-btn"
              style={{
                background: selectedCat === c ? "var(--turmeric)" : "rgba(255,255,255,0.15)",
                color: selectedCat === c ? "#231402" : "#fff",
                fontWeight: selectedCat === c ? 800 : 600,
                fontSize: 12, padding: "6px 14px", borderRadius: 10, whiteSpace: "nowrap"
              }}
            >
              {c === "All" ? "सभी विषय (All)" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {discussions.map(d => (
          <div
            key={d.id}
            style={{
              background: "#fff", borderRadius: 20, padding: 22, boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.04)"
            }}
          >
            {/* Post Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 11, background: "rgba(31,77,54,0.1)", color: "var(--paddy)", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>
                  {d.category}
                </span>
                <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink-text)", marginTop: 6 }}>
                  {d.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  पूछा: <b>{d.author}</b> ({d.role})
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#333", marginBottom: 18 }}>
              {d.content}
            </div>

            {/* Replies List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {d.replies.map((rep, idx) => (
                <div
                  key={idx}
                  style={{
                    background: rep.isAi ? "#F3F7F5" : rep.isExpert ? "#FFFDF5" : "#FAF7F5",
                    border: rep.isAi ? "1px solid rgba(31,77,54,0.2)" : rep.isExpert ? "1px solid #F4C374" : "1px solid rgba(0,0,0,0.05)",
                    borderRadius: 12, padding: "12px 16px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 12.5, color: rep.isAi ? "var(--paddy)" : rep.isExpert ? "#8B5E34" : "var(--ink-text)" }}>
                      {rep.author}
                    </span>
                    {rep.isAi && (
                      <span style={{ fontSize: 10, background: "var(--paddy)", color: "#fff", padding: "1px 6px", borderRadius: 6, fontWeight: 800 }}>
                        AI Generated
                      </span>
                    )}
                    {rep.isExpert && (
                      <span style={{ fontSize: 10, background: "var(--turmeric)", color: "#231402", padding: "1px 6px", borderRadius: 6, fontWeight: 800 }}>
                        ✓ Verified Expert
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>
                    {rep.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="अपना अनुभव या उत्तर लिखें..."
                value={replyText[d.id] || ""}
                onChange={e => setReplyText({ ...replyText, [d.id]: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleReplySubmit(d.id)}
                style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13, outline: "none" }}
              />
              <button
                onClick={() => handleReplySubmit(d.id)}
                className="ge-btn"
                style={{ background: "var(--paddy)", color: "#fff", padding: "0 16px", borderRadius: 10 }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ASK QUESTION MODAL */}
      {askModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 500,
            padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 14 }}>
              🌾 किसान चौपाल पर प्रश्न पूछें
            </div>

            <form onSubmit={handleAskSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>विषय श्रेणी (Category)</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                >
                  <option value="Crop Disease">फसल रोग व कीट नियंत्रण (Crop Disease)</option>
                  <option value="Irrigation">नहर व सिंचाई प्रबंधन (Irrigation)</option>
                  <option value="Fertilizer">उर्वरक व खाद की मात्रा (Fertilizer)</option>
                  <option value="Mandi Rates">मंडी भाव व धान उपार्जन (Mandi Rates)</option>
                  <option value="Govt Schemes">शासकीय कृषि योजनाएं (Govt Schemes)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>मुख्य प्रश्न या समस्या</label>
                <input
                  type="text"
                  placeholder="e.g. धान में तना छेदक कीट की रोकथाम के उपाय?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>विस्तृत विवरण</label>
                <textarea
                  rows={3}
                  placeholder="खेत का हाल, फसल की उम्र और क्या दवा डाली है बताएं..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setAskModal(false)}
                  className="ge-btn"
                  style={{ background: "#eee", padding: "9px 16px", borderRadius: 8, fontSize: 12.5 }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="ge-btn"
                  style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "9px 20px", borderRadius: 8, fontSize: 12.5 }}
                >
                  चौपाल पर भेजें (+15 XP) →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
