import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Volume2, VolumeX, X, Sparkles, MessageSquare,
  Bot, User, ArrowRight, CornerDownLeft, Sprout, Send
} from "lucide-react";

export default function VoiceSahayakModal({
  isOpen,
  onClose,
  lang = "hi",
  setPage
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: lang === "hi"
        ? "नमस्ते! मैं आपका 'ग्रामआई एआई सहायक' हूँ। आप बोलकर या लिखकर गाँव की किसी भी समस्या, बजट या योजनाओं की जानकारी ले सकते हैं।"
        : "Namaste! I am your GramEye AI Assistant. You can speak or type to ask about village complaints, Gram Nidhi budget, or development proposals."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech helper
  const speakText = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // stop previous speech

    const cleanText = text.replace(/[#*_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Look for Hindi or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find((v) => v.lang.includes(lang === "hi" ? "hi" : "en-IN")) || voices[0];
    if (indVoice) utterance.voice = indVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Process user question and generate smart response
  const processQuery = (userQuery) => {
    const q = userQuery.toLowerCase();
    let reply = "";

    if (q.includes("बजट") || q.includes("budget") || q.includes("निधि") || q.includes("paisa") || q.includes("kharch")) {
      reply = lang === "hi"
        ? "ग्राम पंचायत कोड़ेबोड का कुल स्वीकृत बजट ₹48.50 लाख है। इसमें से ₹32.15 लाख सड़कों और जल आपूर्ति पर खर्च हो चुके हैं और ₹9.54 लाख शेष हैं। आप ग्राम निधि टैब में सभी बिल देख सकते हैं!"
        : "The total sanctioned budget for Gram Panchayat Kodebod is ₹48.50 Lakh. ₹32.15 Lakh has been utilized with ₹9.54 Lakh remaining. Check the Gram Nidhi tab for all itemized bills!";
    } else if (q.includes("पानी") || q.includes("water") || q.includes("नल") || q.includes("pipe")) {
      reply = lang === "hi"
        ? "वार्ड 2 और 4 में पेयजल मरम्मत कार्य जल जीवन मिशन के तहत चल रहा है। यदि आपके घर नल नहीं आ रहा, तो तुरंत 'Report' बटन दबाकर AI फोटो अपलोड करें!"
        : "Drinking water pipeline repairs are active in Ward 2 & 4 under Jal Jeevan Mission. If water is disrupted, click 'Report' to file an instant photo complaint!";
    } else if (q.includes("सड़क") || q.includes("road") || q.includes("gaddha") || q.includes("pothole")) {
      reply = lang === "hi"
        ? "प्राथमिक शाला के सामने सड़क मरम्मत का ₹35,000 का कार्य आदेश जारी हो चुका है। कांट्रेक्टर साहू अर्थमूवर्स को 48 घंटे में काम पूरा करने का निर्देश दिया गया है।"
        : "Work order worth ₹35,000 has been issued for primary school road resurfacing to Shahu Earthmovers with a 48-hour SLA.";
    } else if (q.includes("ग्राम सभा") || q.includes("sabha") || q.includes("meeting") || q.includes("baithak")) {
      reply = lang === "hi"
        ? "अगली औपचारिक ग्राम सभा बैठक 15 सितंबर 2026 को सुबह 10:30 बजे पंचायत भवन में होगी। आप 'ग्राम सभा' टैब में जाकर नए प्रस्तावों पर वोट कर सकते हैं!"
        : "The next official Gram Sabha meeting is on 15 September 2026 at 10:30 AM at Panchayat Bhavan. You can vote on citizen proposals in the Gram Sabha tab!";
    } else if (q.includes("शिकायत") || q.includes("report") || q.includes("complaint")) {
      reply = lang === "hi"
        ? "शिकायत दर्ज करना बहुत आसान है! ऊपर 'Report' पर जाएं, फोटो खींचें और बोलकर समस्या बताएं। AI आपकी शिकायत सीधे पंचायत व संबंधित विभाग को भेज देगा।"
        : "Reporting is super simple! Go to 'Report', take a photo and speak. AI vision will auto-detect the hazard and notify the Panchayat!";
    } else {
      reply = lang === "hi"
        ? `मैंने आपका प्रश्न समझ लिया: "${userQuery}"। आप ग्राम पंचायत कोड़ेबोड के इस AI पोर्टल पर शिकायत दर्ज कर सकते हैं, ग्राम निधि का बजट देख सकते हैं या ग्राम सभा में वोट कर सकते हैं।`
        : `I noted your query: "${userQuery}". You can file complaints with AI vision, inspect public funds in Gram Nidhi, or participate in Gram Sabha voting.`;
    }

    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    speakText(reply);
  };

  // Start Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    rec.onresult = (e) => {
      const spokenText = e.results[0][0].transcript;
      setTranscript(spokenText);
      setMessages((prev) => [...prev, { sender: "user", text: spokenText }]);
      processQuery(spokenText);
    };

    rec.onerror = () => {
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputVal("");
    processQuery(text);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 135,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(8, 19, 12, 0.78)",
        backdropFilter: "blur(12px)",
        animation: "geFadeIn 0.2s ease-out"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ge-card"
        style={{
          width: "100%",
          maxWidth: 580,
          height: 620,
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          animation: "geFadeUp 0.25s ease-out",
          background: "#FBF8F0"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #0B1710 0%, #1F4D36 100%)",
            color: "#FBF8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "var(--turmeric)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(232,163,61,0.4)"
              }}
            >
              <Sprout size={20} color="#231402" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "0.02em" }}>
                Gram Sahayak AI (बोलने वाला सहायक)
              </div>
              <div style={{ fontSize: 11, color: "#95B5A0" }}>
                {isSpeaking ? "🔊 Speaking to you..." : isListening ? "🎙️ Listening to your voice..." : "Voice-enabled Gram Panchayat Assistant"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled && isSpeaking) window.speechSynthesis?.cancel();
                setSoundEnabled(!soundEnabled);
              }}
              style={{
                background: soundEnabled ? "rgba(232,163,61,0.2)" : "rgba(255,255,255,0.1)",
                color: soundEnabled ? "var(--turmeric)" : "#8EAA97",
                border: "none",
                borderRadius: 99,
                padding: "6px",
                cursor: "pointer"
              }}
              title={soundEnabled ? "Mute audio output" : "Unmute audio output"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 99,
                padding: "6px",
                color: "#FBF8F0",
                cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%"
              }}
            >
              {m.sender === "ai" && (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    background: "var(--paddy)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 12
                  }}
                >
                  <Bot size={16} />
                </div>
              )}

              <div
                style={{
                  background: m.sender === "user" ? "var(--paddy)" : "#fff",
                  color: m.sender === "user" ? "#fff" : "var(--ink-text)",
                  border: m.sender === "user" ? "none" : "1px solid var(--line-dark)",
                  borderRadius: 16,
                  padding: "12px 16px",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: "8px 20px", display: "flex", gap: 6, overflowX: "auto" }} className="ge-scroll">
          {[
            "💰 गाँव का बजट कितना है?",
            "💧 पानी की समस्या कब हल होगी?",
            "🛣️ सड़क का वर्क ऑर्डर किसने लिया?",
            "🗳️ अगली ग्राम सभा कब है?"
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const query = chip.replace(/^[^\s]+\s/, "");
                setMessages((prev) => [...prev, { sender: "user", text: query }]);
                processQuery(query);
              }}
              style={{
                background: "#fff",
                border: "1px solid var(--line-dark)",
                borderRadius: 99,
                padding: "5px 12px",
                fontSize: 11.5,
                fontWeight: 600,
                color: "#2C3D32",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all .15s"
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Voice & Text Input Bar */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1px solid var(--line-dark)", background: "#fff" }}>
          <form onSubmit={handleSendText} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Animated Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              style={{
                width: 44,
                height: 44,
                borderRadius: 99,
                border: "none",
                background: isListening ? "var(--crit)" : "var(--turmeric)",
                color: isListening ? "#fff" : "#231402",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isListening
                  ? "0 0 0 6px rgba(214,69,69,0.25)"
                  : "0 4px 14px rgba(232,163,61,0.4)",
                transition: "all .2s",
                animation: isListening ? "gePulseGlow 1s infinite" : "none"
              }}
              title={isListening ? "Stop listening" : "Speak to AI"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening... बोलिए..." : "Type question or click mic to speak..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                borderRadius: 99,
                border: "1.5px solid var(--line-dark)",
                padding: "12px 18px",
                fontSize: 13.5,
                outline: "none",
                background: "#FBF8F0",
                color: "var(--ink-text)"
              }}
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 99,
                border: "none",
                background: inputVal.trim() ? "var(--paddy)" : "var(--line-dark)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: inputVal.trim() ? "pointer" : "default"
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
