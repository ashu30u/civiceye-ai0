import React, { useState } from "react";
import {
  Bell, FileText, Vote, MessageSquare, ThumbsUp, Heart,
  Sparkles, CheckCircle2, AlertTriangle, Send, Plus, Paperclip,
  Share2, Calendar, MapPin, Building2, User, ChevronRight,
  ShieldCheck, ArrowRight, CornerDownLeft, Eye, Award, Check
} from "lucide-react";

const INITIAL_NOTICES = [
  {
    id: "NTC-2026-04",
    title: "रविवार को प्राथमिक स्वास्थ्य केंद्र (वार्ड 4) में निःशुल्क सिकल सेल व स्वास्थ्य जांच शिविर",
    dept: "स्वास्थ्य व परिवार कल्याण विभाग (Health Dept)",
    date: "03 सितंबर 2026",
    priority: "HIGH",
    author: "रामेश्वर पटेल (सरपंच) व डॉ. सुरेश वर्मा (BMO)",
    description: "ग्राम पंचायत कोड़ेबोड के समस्त नागरिकों को सूचित किया जाता है कि इस रविवार सुबह 9:00 बजे से दोपहर 3:00 बजे तक वार्ड 4 स्थित प्राथमिक स्वास्थ्य केंद्र में निःशुल्क स्वास्थ्य शिविर आयोजित किया जा रहा है। इसमें सिकल सेल जांच, बीपी, शुगर, मोतियाबिंद की जांच तथा आवश्यक दवाएं पूर्णतः निःशुल्क वितरित की जाएंगी। सभी ग्रामवासी इसका लाभ उठाएं।",
    attachment: "Swasthya_Shivir_Circular_Sep2026.pdf",
    reactions: {
      thumbsUp: 48,
      heart: 29,
      namaste: 36,
      bulb: 14,
      alert: 2
    },
    comments: [
      {
        id: "c-1",
        author: "सुनीता पटेल",
        ward: "Ward 4",
        time: "3 घंटे पहले",
        text: "बहुत अच्छी पहल है! क्या बुजुर्गों के लिए मोतियाबिंद ऑपरेशन की तारीख भी इसी शिविर में तय होगी?"
      },
      {
        id: "c-2",
        author: "डॉ. सुरेश वर्मा (PHC)",
        ward: "Health Post",
        time: "2 घंटे पहले",
        text: "हाँ सुनीता जी, जिला अस्पताल धमतरी के विशेषज्ञ डॉक्टर उपस्थित रहेंगे और जांच उपरांत ऑपरेशन की अग्रिम तारीख दी जाएगी।"
      },
      {
        id: "c-3",
        author: "अमित कुमार साहू",
        ward: "Ward 3",
        time: "45 मिनट पहले",
        text: "वार्ड 3 के युवाओं की टीम बुजुर्गों को शिविर तक लाने में मदद करेगी। धन्यवाद सरपंच जी।"
      }
    ]
  },
  {
    id: "NTC-2026-05",
    title: "शुक्रवार को मुख्य जल टंकी व पाइपलाइन सफाई — सुबह 6:00 से 12:00 बजे तक जलापूर्ति बंद रहेगी",
    dept: "लोक स्वास्थ्य यांत्रिकी विभाग (PHE)",
    date: "02 सितंबर 2026",
    priority: "ALERT",
    author: "ग्राम पंचायत सचिव, कोड़ेबोड",
    description: "वार्ड 1 से वार्ड 6 तक के सभी नागरिकों को सूचित किया जाता है कि बरसात उपरांत जल जनित रोगों की रोकथाम हेतु 50,000 लीटर क्षमता वाली मुख्य टंकी और ब्लीचिंग क्लोरीनेशन का कार्य शुक्रवार को किया जाएगा। अतः सुबह 6:00 से दोपहर 12:00 बजे तक नलों में पानी की सप्लाई बंद रहेगी। कृपया पूर्व दिवस में ही पेयजल सुरक्षित कर लें।",
    attachment: "Water_Tank_Maintenance_Order.pdf",
    reactions: {
      thumbsUp: 34,
      heart: 8,
      namaste: 22,
      bulb: 19,
      alert: 15
    },
    comments: [
      {
        id: "c-4",
        author: "रमेश साहू",
        ward: "Ward 2",
        time: "1 दिन पहले",
        text: "समय पर सूचना देने के लिए धन्यवाद। हम गुरुवार शाम को ही पानी भरकर रख लेंगे।"
      },
      {
        id: "c-5",
        author: "दिनेश कुमार",
        ward: "Ward 1",
        time: "18 घंटे पहले",
        text: "क्या दोपहर 12 बजे के बाद हैंडपंप चालू रहेंगे या वो भी प्रभावित होंगे?"
      },
      {
        id: "c-6",
        author: "पंचायत कंट्रोल रूम",
        ward: "Panchayat",
        time: "15 घंटे पहले",
        text: "हैंडपंप सामान्य रूप से कार्यरत रहेंगे। केवल पाइपलाइन नल-जल योजना प्रभावित होगी।"
      }
    ]
  },
  {
    id: "NTC-2026-06",
    title: "कृषि विभाग द्वारा रबी फसल के लिए निःशुल्क मृदा स्वास्थ्य कार्ड (Soil Health Card) वितरण",
    dept: "कृषि एवं किसान कल्याण (Agriculture Dept)",
    date: "28 अगस्त 2026",
    priority: "NORMAL",
    author: "रामेश्वर पटेल (सरपंच) व ग्रामीण कृषि विस्तार अधिकारी",
    description: "गाँव के किसान भाइयों को सूचित किया जाता है कि जिन किसानों के खेतों की मिट्टी के नमूने पिछले महीने लिए गए थे, उनके मृदा स्वास्थ्य कार्ड पंचायत भवन में आ चुके हैं। किसान भाई अपनी खतौनी/आधार कार्ड दिखाकर अपना कार्ड निःशुल्क प्राप्त कर सकते हैं ताकि आगामी फसल में उर्वरक की सही मात्रा का उपयोग किया जा सके।",
    attachment: "Soil_Health_Card_Beneficiary_List.pdf",
    reactions: {
      thumbsUp: 62,
      heart: 41,
      namaste: 45,
      bulb: 31,
      alert: 1
    },
    comments: [
      {
        id: "c-7",
        author: "बलराम साहू",
        ward: "Ward 5",
        time: "3 दिन पहले",
        text: "मैंने अपना कार्ड आज ही लिया। इसमें यूरिया कम और पोटाश डालने की सलाह दी गई है, इससे हमारी लागत बचेगी।"
      }
    ]
  }
];

const INITIAL_SCHEME_POLLS = [
  {
    id: "POLL-301",
    title: "गाँव में 75% सरकारी सब्सिडी पर सोलर कृषि पंप वितरण योजना (Panchayat Solar Pump Scheme)",
    description: "गाँव के 50 लघु व सीमांत किसानों को भारी बिजली बिल और अनियमित बिजली कटौती से राहत दिलाने हेतु सौर ऊर्जा संचालित 3HP/5HP कृषि पंप लगाने का प्रस्ताव है। योजना में 60% केंद्र/राज्य सब्सिडी + 15% पंचायत 15वें वित्त आयोग अनुदान वहन करेगी, किसान को मात्र 25% अंशदान देना होगा।",
    proposedBy: "सरपंच रामेश्वर पटेल",
    date: "01 सितंबर 2026",
    endDate: "15 सितंबर 2026",
    budget: "₹22,50,000 (Panchayat Share: ₹3,37,500)",
    options: [
      { key: "yes", label: "✅ हाँ, गाँव में तुरंत लागू करें (Yes, Implement)", votes: 124 },
      { key: "no", label: "❌ नहीं, आवश्यकता नहीं (No, Not Needed)", votes: 11 },
      { key: "modify", label: "🤔 कुछ संशोधनों के साथ (With Modifications)", votes: 9 }
    ]
  },
  {
    id: "POLL-302",
    title: "गाँव के मुख्य चौराहों व स्कूलों में 24x7 निःशुल्क भारतनेट वाई-फाई हॉटस्पॉट",
    description: "गाँव के छात्र-छात्राओं, प्रतियोगी परीक्षाओं की तैयारी कर रहे युवाओं और महिला स्वयं सहायता समूहों के डिजिटल कार्यों हेतु बस स्टैंड, पंचायत भवन और उच्चतर माध्यमिक शाला में हाई-स्पीड वाई-फाई हॉटस्पॉट स्थापित करने का प्रस्ताव।",
    proposedBy: "पंचायत सूचना प्रौद्योगिकी प्रकोष्ठ",
    date: "29 अगस्त 2026",
    endDate: "12 सितंबर 2026",
    budget: "₹1,80,000 (Annual Maintenance: ₹24,000)",
    options: [
      { key: "yes", label: "✅ हाँ, गाँव के युवाओं के लिए अति आवश्यक", votes: 158 },
      { key: "no", label: "❌ नहीं, अन्य प्राथमिकताएं पहले हों", votes: 14 },
      { key: "modify", label: "🤔 केवल स्कूल और लाइब्रेरी में ही सीमित रहे", votes: 18 }
    ]
  },
  {
    id: "POLL-303",
    title: "बुधवार साप्ताहिक हाट बाज़ार में पक्के शेड व महिला स्वयं सहायता समूह कैंटीन निर्माण",
    description: "वर्तमान में बुधवार बाज़ार खुले मैदान में लगता है, जिससे बारिश व धूप में सब्ज़ियां सड़ जाती हैं। 30 पक्के शेड, शुद्ध पेयजल स्टैंड और महिला समूहों द्वारा संचालित स्वदेशी नाश्ता कैंटीन का निर्माण प्रस्तावित है।",
    proposedBy: "ग्राम बाज़ार प्रबंधन समिति",
    date: "25 अगस्त 2026",
    endDate: "10 सितंबर 2026",
    budget: "₹8,40,000 (Financed under Gram Nidhi 2026)",
    options: [
      { key: "yes", label: "✅ हाँ, बाज़ार की व्यवस्था दुरुस्त होगी", votes: 112 },
      { key: "no", label: "❌ नहीं, बजट ज़्यादा है", votes: 19 },
      { key: "modify", label: "🤔 शेड के साथ शौचालय का भी प्रावधान करें", votes: 31 }
    ]
  }
];

export default function NoticeBoard({ currentUser, role, addXp, lang = "hi" }) {
  const [activeTab, setActiveTab] = useState("notices"); // "notices" | "polls"
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [polls, setPolls] = useState(INITIAL_SCHEME_POLLS);

  // User Reactions Map: { [noticeId]: { [reactionType]: true } }
  const [userReactions, setUserReactions] = useState({});
  // User Polling Votes Map: { [pollId]: optionKey }
  const [userPollVotes, setUserPollVotes] = useState({});

  // Comment input per notice: { [noticeId]: string }
  const [commentInputs, setCommentInputs] = useState({});

  // Modals for Sarpanch
  const [createNoticeOpen, setCreateNoticeOpen] = useState(false);
  const [createPollOpen, setCreatePollOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // New Notice form fields
  const [nTitle, setNTitle] = useState("");
  const [nDept, setNDept] = useState("पंचायत प्रशासन (Administration)");
  const [nPriority, setNPriority] = useState("NORMAL");
  const [nDesc, setNDesc] = useState("");
  const [nFile, setNFile] = useState("");

  // New Scheme Poll form fields
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pBudget, setPBudget] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
  };

  // Handle Emoji Reaction Toggle
  const handleEmojiReact = (noticeId, emojiKey) => {
    const hasReacted = userReactions[noticeId]?.[emojiKey];

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          return {
            ...n,
            reactions: {
              ...n.reactions,
              [emojiKey]: hasReacted
                ? Math.max(0, n.reactions[emojiKey] - 1)
                : n.reactions[emojiKey] + 1
            }
          };
        }
        return n;
      })
    );

    setUserReactions((prev) => ({
      ...prev,
      [noticeId]: {
        ...(prev[noticeId] || {}),
        [emojiKey]: !hasReacted
      }
    }));

    if (!hasReacted && addXp) {
      addXp(5);
      showToast("✨ प्रतिक्रिया दर्ज की गई! (+5 XP)");
    }
  };

  // Handle Adding Citizen Comment
  const handleAddComment = (noticeId) => {
    const text = (commentInputs[noticeId] || "").trim();
    if (!text) return;

    const newComment = {
      id: `c-${Date.now().toString().slice(-4)}`,
      author: currentUser?.fullName || "नागरिक (Citizen)",
      ward: currentUser?.ward || "Ward 3",
      time: "अभी-अभी (Just now)",
      text
    };

    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          return {
            ...n,
            comments: [...n.comments, newComment]
          };
        }
        return n;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [noticeId]: "" }));
    if (addXp) addXp(10);
    showToast("💬 आपकी राय सार्वजनिक रूप से जुड़ गई है! (+10 XP)");
  };

  // Handle Casting a Vote in Scheme Polling Booth
  const handleCastPollVote = (pollId, optionKey) => {
    if (userPollVotes[pollId]) return;

    setUserPollVotes((prev) => ({ ...prev, [pollId]: optionKey }));

    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          return {
            ...p,
            options: p.options.map((opt) =>
              opt.key === optionKey ? { ...opt, votes: opt.votes + 1 } : opt
            )
          };
        }
        return p;
      })
    );

    if (addXp) addXp(15);
    showToast("🗳️ आपका मत सफलतापूर्वक दर्ज हुआ! लोकतंत्र सशक्तिकरण (+15 XP)");
  };

  // Sarpanch Publishes New Notice
  const handlePublishNotice = (e) => {
    e.preventDefault();
    if (!nTitle.trim() || !nDesc.trim()) return;

    const newNotice = {
      id: `NTC-2026-0${notices.length + 4}`,
      title: nTitle.trim(),
      dept: nDept,
      date: new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" }),
      priority: nPriority,
      author: role === "admin" ? "रामेश्वर पटेल (सरपंच), ग्राम पंचायत कोड़ेबोड" : "पंचायत सूचना प्रकोष्ठ",
      description: nDesc.trim(),
      attachment: nFile ? nFile.name || "Panchayat_Aadhes_Notice.pdf" : "Official_Panchayat_Letter.pdf",
      reactions: { thumbsUp: 1, heart: 1, namaste: 1, bulb: 1, alert: 0 },
      comments: []
    };

    setNotices([newNotice, ...notices]);
    setCreateNoticeOpen(false);
    setNTitle("");
    setNDesc("");
    setNFile("");
    if (addXp) addXp(30);
    showToast("📢 नया आधिकारिक नोटिस वेबसाइट पर प्रकाशित कर दिया गया है!");
  };

  // Sarpanch Publishes New Scheme Poll
  const handlePublishPoll = (e) => {
    e.preventDefault();
    if (!pTitle.trim() || !pDesc.trim()) return;

    const newPoll = {
      id: `POLL-${300 + polls.length + 1}`,
      title: pTitle.trim(),
      description: pDesc.trim(),
      proposedBy: "सरपंच रामेश्वर पटेल",
      date: new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" }),
      endDate: "20 सितंबर 2026",
      budget: pBudget.trim() || "₹5,00,000 (Panchayat Fund)",
      options: [
        { key: "yes", label: "✅ हाँ, गाँव में तुरंत लागू करें", votes: 1 },
        { key: "no", label: "❌ नहीं, आवश्यकता नहीं", votes: 0 },
        { key: "modify", label: "🤔 कुछ संशोधनों के साथ", votes: 0 }
      ]
    };

    setPolls([newPoll, ...polls]);
    setUserPollVotes((prev) => ({ ...prev, [newPoll.id]: "yes" }));
    setCreatePollOpen(false);
    setPTitle("");
    setPDesc("");
    setPBudget("");
    if (addXp) addXp(40);
    showToast("🗳️ नई योजना का पोलिंग बूथ नागरिकों के मतदान हेतु लाइव हो गया है!");
  };

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "34px 24px 90px" }}>
      {/* Toast Banner */}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
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
              <Bell size={22} color="#231402" />
            </div>
            <div>
              <div className="ge-serif" style={{ fontSize: 28, fontWeight: 800, color: "var(--ink-text)" }}>
                ग्राम पंचायत नोटिस बोर्ड व योजना पोलिंग
              </div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 2 }}>
                Digital Panchayat Notice Board & Scheme Polling Booth — Gram Panchayat Kodebod (धमतरी)
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for Sarpanch / Citizens */}
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab === "notices" ? (
            <button
              type="button"
              className="ge-btn ge-btn-primary"
              onClick={() => setCreateNoticeOpen(true)}
              style={{ fontSize: 13.5 }}
            >
              <Plus size={16} /> नया नोटिस जारी करें (Attach Notice)
            </button>
          ) : (
            <button
              type="button"
              className="ge-btn ge-btn-primary"
              onClick={() => setCreatePollOpen(true)}
              style={{ fontSize: 13.5 }}
            >
              <Plus size={16} /> नई योजना व पोलिंग शुरू करें
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1.5px solid var(--line-dark)",
          marginBottom: 28,
          gap: 12
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("notices")}
          style={{
            padding: "12px 18px",
            border: "none",
            background: "none",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            color: activeTab === "notices" ? "var(--paddy)" : "var(--muted)",
            borderBottom: activeTab === "notices" ? "3px solid var(--paddy)" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all .2s"
          }}
        >
          <FileText size={18} />
          <span>📢 आधिकारिक ग्राम नोटिस (Official Notices)</span>
          <span
            style={{
              background: activeTab === "notices" ? "var(--paddy)" : "rgba(14,26,19,0.08)",
              color: activeTab === "notices" ? "#fff" : "var(--ink-text)",
              fontSize: 11,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 99
            }}
          >
            {notices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("polls")}
          style={{
            padding: "12px 18px",
            border: "none",
            background: "none",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            color: activeTab === "polls" ? "#995C08" : "var(--muted)",
            borderBottom: activeTab === "polls" ? "3px solid var(--turmeric)" : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all .2s"
          }}
        >
          <Vote size={18} />
          <span>🗳️ योजना पोलिंग बूथ (Scheme Polling Booths)</span>
          <span
            style={{
              background: activeTab === "polls" ? "var(--turmeric)" : "rgba(14,26,19,0.08)",
              color: activeTab === "polls" ? "#231402" : "var(--ink-text)",
              fontSize: 11,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 99
            }}
          >
            {polls.length} Live
          </span>
        </button>
      </div>

      {/* ============================================================
          VIEW 1: OFFICIAL PANCHAYAT NOTICES (WITH EMOJIS & COMMENTS)
          ============================================================ */}
      {activeTab === "notices" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {notices.map((notice) => {
            const userReact = userReactions[notice.id] || {};

            return (
              <div
                key={notice.id}
                className="ge-card"
                style={{
                  padding: "26px 28px",
                  borderRadius: 20,
                  border: notice.priority === "ALERT" ? "2px solid var(--crit)" : "1px solid var(--line-dark)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.04)"
                }}
              >
                {/* Header: Notice ID, Priority Badge & Date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="ge-mono" style={{ fontSize: 12, fontWeight: 800, color: "var(--paddy)" }}>
                      {notice.id}
                    </span>
                    <span
                      className="ge-chip"
                      style={{
                        background:
                          notice.priority === "ALERT"
                            ? "rgba(214,69,69,0.12)"
                            : "rgba(31,77,54,0.08)",
                        color: notice.priority === "ALERT" ? "var(--crit)" : "var(--paddy)",
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      {notice.priority === "ALERT" ? "⚠️ Urgent Alert (आपातकालीन सूचना)" : notice.dept}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={13} /> {notice.date}
                  </div>
                </div>

                {/* Notice Title */}
                <div style={{ fontSize: 19, fontWeight: 800, color: "var(--ink-text)", lineHeight: 1.35, marginBottom: 12 }}>
                  {notice.title}
                </div>

                {/* Notice Body */}
                <p style={{ fontSize: 14, color: "#364A3E", lineHeight: 1.65, marginBottom: 16 }}>
                  {notice.description}
                </p>

                {/* Attachment & Authority Seal */}
                <div
                  style={{
                    background: "rgba(31,77,54,0.04)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 18,
                    border: "1px solid var(--line-dark)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--paddy)", fontWeight: 700 }}>
                    <Paperclip size={15} />
                    <span>सत्यापित अटैचमेंट: <u>{notice.attachment}</u></span>
                  </div>

                  <div style={{ fontSize: 11.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={14} color="var(--low)" />
                    <span>हस्ताक्षर: <b>{notice.author}</b></span>
                  </div>
                </div>

                {/* EMOJI REACTIONS BAR (Interactive with Live Counters) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                    borderTop: "1px solid var(--line-dark)",
                    paddingTop: 14,
                    marginBottom: 16
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
                    नागरिक प्रतिक्रिया (Reactions):
                  </div>

                  {[
                    { key: "thumbsUp", icon: "👍", label: "सहमति", count: notice.reactions.thumbsUp },
                    { key: "heart", icon: "❤️", label: "शानदार", count: notice.reactions.heart },
                    { key: "namaste", icon: "🙏", label: "धन्यवाद", count: notice.reactions.namaste },
                    { key: "bulb", icon: "💡", label: "महत्वपूर्ण", count: notice.reactions.bulb },
                    { key: "alert", icon: "⚠️", label: "चिंताजनक", count: notice.reactions.alert }
                  ].map((emo) => {
                    const isSelected = userReact[emo.key];

                    return (
                      <button
                        key={emo.key}
                        type="button"
                        onClick={() => handleEmojiReact(notice.id, emo.key)}
                        style={{
                          background: isSelected ? "rgba(232,163,61,0.22)" : "#fff",
                          border: isSelected ? "1.5px solid var(--turmeric)" : "1px solid var(--line-dark)",
                          borderRadius: 99,
                          padding: "5px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 700,
                          color: isSelected ? "#8B5E34" : "var(--ink-text)",
                          transition: "all .15s",
                          transform: isSelected ? "scale(1.05)" : "none"
                        }}
                        title={emo.label}
                      >
                        <span>{emo.icon}</span>
                        <span>{emo.count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CITIZEN COMMENTS SECTION (आम जनता की राय व संदेश) */}
                <div style={{ background: "#FAF7F0", borderRadius: 14, padding: "16px 18px", border: "1px solid #ECE4D6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: "var(--ink-text)", marginBottom: 12 }}>
                    <MessageSquare size={16} color="var(--paddy)" />
                    <span>नागरिक चर्चा व राय ({notice.comments.length} संदेश)</span>
                  </div>

                  {/* Comment List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                    {notice.comments.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: "#fff",
                          borderRadius: 10,
                          padding: "10px 14px",
                          border: "1px solid var(--line-dark)",
                          fontSize: 12.5
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontWeight: 800, color: "var(--ink-text)" }}>
                            {c.author} <span style={{ color: "var(--muted)", fontWeight: 500, fontSize: 11 }}>• {c.ward}</span>
                          </span>
                          <span style={{ color: "var(--muted)", fontSize: 11 }}>{c.time}</span>
                        </div>
                        <div style={{ color: "#364A3E", lineHeight: 1.45 }}>{c.text}</div>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input Box */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="इस नोटिस के बारे में अपनी राय या प्रश्न लिखें..."
                      value={commentInputs[notice.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [notice.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment(notice.id);
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 99,
                        border: "1.5px solid var(--line-dark)",
                        padding: "10px 16px",
                        fontSize: 13,
                        outline: "none",
                        background: "#fff"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(notice.id)}
                      disabled={!(commentInputs[notice.id] || "").trim()}
                      className="ge-btn ge-btn-primary"
                      style={{ padding: "8px 16px", borderRadius: 99, fontSize: 12.5 }}
                    >
                      <Send size={14} /> राय भेजें
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================
          VIEW 2: SARPANCH SCHEME POLLING BOOTH (योजना जनमत संग्रह)
          ============================================================ */}
      {activeTab === "polls" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Banner Explanation */}
          <div
            className="ge-card"
            style={{
              padding: "18px 22px",
              background: "linear-gradient(135deg, rgba(232,163,61,0.15) 0%, rgba(31,77,54,0.1) 100%)",
              border: "1.5px solid var(--turmeric)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                <Vote size={22} color="#231402" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#8B5E34", textTransform: "uppercase" }}>
                  गाँव की योजनाओं पर सीधा जनमत संग्रह (DIRECT CITIZEN REFERENDUM)
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)", marginTop: 2 }}>
                  सरपंच द्वारा प्रस्तावित किसी भी योजना को लागू करने से पहले जनता का वोट अनिवार्य है।
                </div>
              </div>
            </div>

            <div className="ge-chip" style={{ background: "var(--paddy)", color: "#fff", fontSize: 12, padding: "6px 14px" }}>
              1 नागरिक = 1 वोट (पारदर्शी लोकतंत्र)
            </div>
          </div>

          {/* Scheme Polls Cards */}
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const userChoice = userPollVotes[poll.id];

            return (
              <div
                key={poll.id}
                className="ge-card"
                style={{
                  padding: "26px 28px",
                  borderRadius: 20,
                  border: "1.5px solid var(--line-dark)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="ge-mono" style={{ fontSize: 12, fontWeight: 800, color: "#995C08" }}>
                      {poll.id}
                    </span>
                    <span className="ge-chip" style={{ background: "rgba(232,163,61,0.15)", color: "#995C08", fontSize: 11, fontWeight: 800 }}>
                      मतदान चालू (Live Poll)
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    मतदान की अंतिम तिथि: <b>{poll.endDate}</b>
                  </div>
                </div>

                <div style={{ fontSize: 19, fontWeight: 800, color: "var(--ink-text)", lineHeight: 1.35, marginBottom: 10 }}>
                  {poll.title}
                </div>

                <p style={{ fontSize: 14, color: "#364A3E", lineHeight: 1.6, marginBottom: 14 }}>
                  {poll.description}
                </p>

                <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--muted)", marginBottom: 20 }}>
                  <div>प्रस्तावक: <b style={{ color: "var(--ink-text)" }}>{poll.proposedBy}</b></div>
                  <div>स्वीकृत बजट अनुमान: <b style={{ color: "var(--paddy)" }}>{poll.budget}</b></div>
                </div>

                {/* Polling Options & Voting Bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  {poll.options.map((opt) => {
                    const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    const isSelected = userChoice === opt.key;

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleCastPollVote(poll.id, opt.key)}
                        style={{
                          background: isSelected ? "rgba(31,77,54,0.08)" : "#fff",
                          border: isSelected ? "2px solid var(--paddy)" : "1.5px solid var(--line-dark)",
                          borderRadius: 14,
                          padding: "12px 18px",
                          cursor: userChoice ? "default" : "pointer",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all .2s"
                        }}
                      >
                        {/* Background Progress Fill */}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${percent}%`,
                            background: isSelected ? "rgba(31,77,54,0.12)" : "rgba(232,163,61,0.12)",
                            zIndex: 0,
                            transition: "width 0.6s ease"
                          }}
                        />

                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 99,
                                border: isSelected ? "2px solid var(--paddy)" : "2px solid var(--muted)",
                                background: isSelected ? "var(--paddy)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 11
                              }}
                            >
                              {isSelected && <Check size={13} />}
                            </div>
                            <span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink-text)" }}>
                              {opt.label}
                            </span>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontWeight: 900, fontSize: 15, color: isSelected ? "var(--paddy)" : "var(--ink-text)" }}>
                              {percent}%
                            </span>
                            <span style={{ fontSize: 11.5, color: "var(--muted)", marginLeft: 6 }}>
                              ({opt.votes} मत)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--muted)" }}>
                  <div>
                    कुल डाले गए मत: <b style={{ color: "var(--ink-text)" }}>{totalVotes} नागरिक मत</b>
                  </div>
                  {userChoice ? (
                    <div style={{ color: "var(--low)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={14} /> आपने अपना मत दर्ज कर दिया है
                    </div>
                  ) : (
                    <div style={{ color: "#995C08", fontWeight: 700 }}>
                      👉 अपने पसंदीदा विकल्प पर क्लिक करके वोट दें (+15 XP)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================
          SARPANCH MODAL 1: CREATE NEW NOTICE (नया नोटिस जारी करें)
          ============================================================ */}
      {createNoticeOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(8, 19, 12, 0.8)",
            backdropFilter: "blur(12px)",
            animation: "geFadeIn 0.25s ease-out"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateNoticeOpen(false);
          }}
        >
          <div
            className="ge-card"
            style={{
              width: "100%",
              maxWidth: 560,
              padding: "32px 28px",
              borderRadius: 22,
              animation: "geFadeUp 0.25s ease-out",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div className="ge-serif" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink-text)" }}>
                  आधिकारिक ग्राम नोटिस जारी करें
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  सरपंच / सचिव डिजिटल नोटिस बोर्ड
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateNoticeOpen(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishNotice}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  नोटिस का शीर्षक (Notice Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. गाँव में राशन कार्ड ई-केवाईसी शिविर की सूचना..."
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "11px 14px",
                    fontSize: 13.5,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    संबंधित विभाग (Department)
                  </label>
                  <select
                    value={nDept}
                    onChange={(e) => setNDept(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1.5px solid var(--line-dark)",
                      padding: "10px 12px",
                      fontSize: 13,
                      outline: "none",
                      background: "#fff"
                    }}
                  >
                    <option value="पंचायत प्रशासन (Administration)">पंचायत प्रशासन</option>
                    <option value="स्वास्थ्य विभाग (Health Dept)">स्वास्थ्य विभाग</option>
                    <option value="लोक स्वास्थ्य यांत्रिकी (PHE - Water)">लोक स्वास्थ्य यांत्रिकी (जल)</option>
                    <option value="विद्युत विभाग (Electricity)">विद्युत विभाग</option>
                    <option value="कृषि विभाग (Agriculture)">कृषि विभाग</option>
                    <option value="राजस्व व खाद्य विभाग (Food/Civil Supplies)">खाद्य व नागरिक आपूर्ति</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    प्राथमिकता (Priority)
                  </label>
                  <select
                    value={nPriority}
                    onChange={(e) => setNPriority(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1.5px solid var(--line-dark)",
                      padding: "10px 12px",
                      fontSize: 13,
                      outline: "none",
                      background: "#fff"
                    }}
                  >
                    <option value="NORMAL">सामान्य सूचना (Normal Notice)</option>
                    <option value="ALERT">⚠️ आपातकालीन चेतावनी (Urgent Alert)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  विस्तृत विवरण (Notice Content / Description)
                </label>
                <textarea
                  rows={4}
                  placeholder="नोटिस का पूरा विवरण लिखें..."
                  value={nDesc}
                  onChange={(e) => setNDesc(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 14px",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  सत्यापित आदेश/सर्कुलर अटैचमेंट (Attachment / PDF)
                </label>
                <input
                  type="file"
                  onChange={(e) => setNFile(e.target.files[0])}
                  style={{ fontSize: 12.5 }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="ge-btn ge-btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setCreateNoticeOpen(false)}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="ge-btn ge-btn-primary"
                  style={{ flex: 1.5 }}
                >
                  📢 नोटिस प्रकाशित करें (+30 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          SARPANCH MODAL 2: CREATE SCHEME POLL (नई योजना व पोलिंग बनाएँ)
          ============================================================ */}
      {createPollOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(8, 19, 12, 0.8)",
            backdropFilter: "blur(12px)",
            animation: "geFadeIn 0.25s ease-out"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreatePollOpen(false);
          }}
        >
          <div
            className="ge-card"
            style={{
              width: "100%",
              maxWidth: 560,
              padding: "32px 28px",
              borderRadius: 22,
              animation: "geFadeUp 0.25s ease-out",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div className="ge-serif" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink-text)" }}>
                  नई योजना का पोलिंग बूथ शुरू करें
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  सरपंच जनता से राय व मत (Referendum) मांगें
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreatePollOpen(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishPoll}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  योजना का नाम (Scheme Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. गाँव में सामुदायिक बायोगैस संयंत्र स्थापना योजना..."
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "11px 14px",
                    fontSize: 13.5,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  योजना का उद्देश्य व लाभ (Scheme Description & Benefits)
                </label>
                <textarea
                  rows={4}
                  placeholder="बताएं कि यह योजना क्यों लाई जा रही है और इससे गाँव को क्या फायदा होगा..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 14px",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  अनुमानित लागत / बजट (Estimated Budget)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹6,50,000 (15th FC Grant + Swachh Bharat Fund)..."
                  value={pBudget}
                  onChange={(e) => setPBudget(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "11px 14px",
                    fontSize: 13.5,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="ge-btn ge-btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setCreatePollOpen(false)}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="ge-btn ge-btn-primary"
                  style={{ flex: 1.5 }}
                >
                  🗳️ पोलिंग बूथ लाइव करें (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
