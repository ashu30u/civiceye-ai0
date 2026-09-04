import os
import base64
import subprocess

# Paths
logo_path = r"C:\Users\dmtam\.gemini\antigravity-ide\brain\04417456-f13c-4d21-8ed8-860d61a43e09\grameye_logo_1788548152620.jpg"
workspace_dir = r"c:\Users\dmtam\OneDrive\Desktop\gramproject"
public_dir = os.path.join(workspace_dir, "grameye-frontend", "grameye-frontend", "public")
os.makedirs(public_dir, exist_ok=True)

# Read logo as base64
with open(logo_path, "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")
logo_data_uri = f"data:image/jpeg;base64,{logo_b64}"

# Also save copy of logo to public folder
public_logo_path = os.path.join(public_dir, "grameye_logo.jpg")
with open(public_logo_path, "wb") as f:
    with open(logo_path, "rb") as src:
        f.write(src.read())

html_content = f"""<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>GramEye AI — संपूर्ण प्रोजेक्ट फीचर्स व विशेषताएं</title>
<style>
  @page {{
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Nirmala UI', 'Segoe UI', sans-serif;
    color: #1a2e22;
    background: #ffffff;
    line-height: 1.55;
    font-size: 13.5px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  /* HEADER COVER */
  .cover-header {{
    background: linear-gradient(135deg, #092316 0%, #123d27 50%, #1a5637 100%);
    color: #ffffff;
    padding: 26px 28px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 24px;
    box-shadow: 0 6px 18px rgba(9, 35, 22, 0.2);
    margin-bottom: 22px;
    border: 2px solid #e8a33d;
  }}

  .logo-img {{
    width: 105px;
    height: 105px;
    border-radius: 50%;
    border: 3px solid #e8a33d;
    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
    background: #ffffff;
    flex-shrink: 0;
  }}

  .header-text {{
    flex: 1;
  }}

  .badge-tag {{
    display: inline-block;
    background: #e8a33d;
    color: #1c1303;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }}

  .doc-title {{
    font-size: 26px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.2px;
    line-height: 1.25;
  }}

  .doc-title span {{
    color: #f7c35f;
  }}

  .doc-subtitle {{
    font-size: 13px;
    color: #c9e4d4;
    margin-top: 5px;
  }}

  .meta-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 14px;
    background: rgba(255,255,255,0.08);
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.15);
  }}

  .meta-item {{
    font-size: 11px;
    color: #e2f0e8;
  }}

  .meta-item strong {{
    display: block;
    color: #f7c35f;
    font-size: 11.5px;
  }}

  /* SECTION CARDS */
  .section {{
    margin-bottom: 18px;
    page-break-inside: avoid;
  }}

  .section-title {{
    font-size: 17px;
    font-weight: 800;
    color: #0c2e1d;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid #e8a33d;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }}

  .section-title .icon-box {{
    background: #e8a33d;
    color: #123d27;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 900;
  }}

  .feature-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }}

  .card {{
    background: #fbfdfb;
    border: 1px solid #d5e5db;
    border-left: 4px solid #1a5637;
    border-radius: 8px;
    padding: 12px 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  }}

  .card.highlight {{
    border-left-color: #e8a33d;
    background: #fffdf9;
  }}

  .card-title {{
    font-size: 14px;
    font-weight: 700;
    color: #0c2e1d;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }}

  .card-title span.tag {{
    font-size: 10px;
    background: #e2f0e8;
    color: #0f4327;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
  }}

  .card-desc {{
    font-size: 12.5px;
    color: #334e3f;
    line-height: 1.45;
  }}

  .card-list {{
    margin-top: 6px;
    padding-left: 16px;
    font-size: 12px;
    color: #334e3f;
  }}

  .card-list li {{
    margin-bottom: 3px;
  }}

  /* FULL WIDTH CARD */
  .full-card {{
    grid-column: span 2;
    background: #fbfdfb;
    border: 1px solid #d5e5db;
    border-left: 4px solid #1a5637;
    border-radius: 8px;
    padding: 12px 14px;
  }}

  /* EMERGENCY STRIP */
  .sos-strip {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 6px;
  }}

  .sos-item {{
    background: #fdf2f2;
    border: 1px solid #f8d7da;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 11.5px;
    color: #842029;
    font-weight: 600;
  }}

  .sos-item strong {{
    color: #c92a2a;
    font-size: 13px;
    display: block;
  }}

  /* PAGE BREAK CLASS */
  .page-break {{
    page-break-after: always;
  }}

  /* FOOTER */
  .doc-footer {{
    margin-top: 20px;
    border-top: 1px solid #d5e5db;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #617d6e;
  }}

  .doc-footer a {{
    color: #0c2e1d;
    text-decoration: none;
    font-weight: 700;
  }}
</style>
</head>
<body>

  <!-- COVER HEADER -->
  <div class="cover-header">
    <img class="logo-img" src="{logo_data_uri}" alt="GramEye AI Logo" />
    <div class="header-text">
      <div class="badge-tag">आधिकारिक प्रोजेक्ट दस्तावेज · 2026</div>
      <div class="doc-title">GramEye <span>AI</span> — स्मार्ट ग्राम पंचायत इकोसिस्टम</div>
      <div class="doc-subtitle">ग्रामीण गवर्नेंस, सोशल क्रिएटर हब, स्वास्थ्य, कृषि, मौसम एवं आपातकालीन सुरक्षा का संपूर्ण डिजिटल मंच</div>
      <div class="meta-grid">
        <div class="meta-item">
          <strong>लाइव वेबसाइट URL</strong>
          https://civiceye-ai0.vercel.app
        </div>
        <div class="meta-item">
          <strong>आदर्श ग्राम कार्यक्षेत्र</strong>
          कोडेबोड (कुरुद, धमतरी, छ.ग.)
        </div>
        <div class="meta-item">
          <strong>सेंसस व पिन कोड</strong>
          कोड: 446794 · पिन: 493663
        </div>
        <div class="meta-item">
          <strong>प्रोजेक्ट एडिशन</strong>
          v2.4 Enterprise Civic AI
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 1: विज़न व परिचय -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">🌟</div>
      प्रोजेक्ट विज़न व उद्देश्य (Executive Overview)
    </div>
    <div class="full-card" style="border-left-color: #0c2e1d;">
      <div class="card-desc">
        <strong>GramEye AI</strong> भारत के ग्रामीण क्षेत्रों को आत्मनिर्भर, डिजिटल और सुरक्षित बनाने के उद्देश्य से विकसित किया गया एक आधुनिक फुल-स्टैक वेब व मोबाइल प्लेटफॉर्म है। यह केवल एक प्रशासनिक वेबसाइट नहीं है, बल्कि यह ग्राम पंचायत की शिकायत निवारण प्रणाली, किसानों के मौसम व कृषि सलाहकार, चौबीसों घंटे स्वास्थ्य व पशु चिकित्सा, स्थानीय रोजगार और युवाओं के लिए एक सुरक्षित ग्रामीण सोशल मीडिया नेटवर्क को एक ही मंच पर जोड़ता है।
      </div>
    </div>
  </div>

  <!-- SECTION 2: 10 प्रमुख मॉड्यूल्स -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">1</div>
      स्मार्ट ग्राम पंचायत गवर्नेंस व जन-शिकायत निवारण (Civic Governance)
    </div>
    <div class="feature-grid">
      <div class="card">
        <div class="card-title">
          1-क्लिक शिकायत दर्ज करना
          <span class="tag">AI Camera & GPS</span>
        </div>
        <div class="card-desc">
          टूटी सड़कें, बंद स्ट्रीटलाइट, जल संकट या कचरे की समस्या को ग्रामीण सीधे फोटो खींचकर और ऑटोमैटिक जीपीएस लोकेशन के साथ 10 सेकंड में रिपोर्ट कर सकते हैं।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          AI स्वचालित प्राथमिकता निर्धारण
          <span class="tag">Smart Triage</span>
        </div>
        <div class="card-desc">
          AI समस्या की गंभीरता (Low, Medium, Critical) को स्वयं वर्गीकृत करता है और सीधे संबंधित पंचायत सचिव या वार्ड लाइनमैन को अलर्ट भेजता है।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          पारदर्शी लाइव ट्रैकिंग
          <span class="tag">Status Pipeline</span>
        </div>
        <div class="card-desc">
          हर शिकायत का एक यूनीक ट्रैकिंग नंबर होता है। ग्रामीण देख सकते हैं कि काम शुरू हुआ या नहीं (दर्ज ➔ प्रगति पर ➔ समाधान)।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          डिजिटल नोटिस बोर्ड
          <span class="tag">Panchayat Notices</span>
        </div>
        <div class="card-desc">
          ग्राम सभा की बैठक, टीकाकरण अभियान, राशन दुकान वितरण और सरकारी योजनाओं (PM आवास, किसान सम्मान निधि) की आधिकारिक सूचनाएं।
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 3: COODENEST CONNECT -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">2</div>
      Coodenest Connect (ग्रामीण सोशल मीडिया व क्रिएटर नेटवर्क)
    </div>
    <div class="feature-grid">
      <div class="card highlight">
        <div class="card-title">
          आधुनिक सोशल फीड व स्टोरीज
          <span class="tag">Feed & Stories</span>
        </div>
        <div class="card-desc">
          इंस्टाग्राम जैसा प्रीमियम अनुभव! 24 घंटे वाली स्टोरीज, अनसीन ग्लो रिंग, फुल स्क्रीन स्टोरी व्यूअर, इमोजी रिएक्शंस, और कम्युनिटी पोस्ट्स (लाइक, कमेंट, शेयर)।
        </div>
      </div>
      <div class="card highlight">
        <div class="card-title">
          वर्टिकल Shorts / Reels प्लेयर
          <span class="tag">Video Shorts</span>
        </div>
        <div class="card-desc">
          शॉर्ट-फॉर्म वीडियो प्लेयर जिसमें ऑटोप्ले, म्यूट/अनम्यूट टॉगल, डबल-टैप हार्ट लाइक एनीमेशन और क्रिएटर प्रोफाइल लिंक मौजूद है।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          Direct Messaging (DMs)
          <span class="tag">Realtime Chat</span>
        </div>
        <div class="card-desc">
          गाँव के युवाओं, कारीगरों और क्रिएटर्स के बीच सुरक्षित वन-ऑन-वन चैट, ऑनलाइन स्टेटस इंडिकेटर और इंस्टेंट मैसेज डिलीवरी।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          AI पावर्ड पोस्ट क्रिएटर
          <span class="tag">Generative AI</span>
        </div>
        <div class="card-desc">
          <strong>AI Caption Generator:</strong> 5 अलग-अलग टोन में कैप्शन लिखें。<br>
          <strong>AI Hashtags:</strong> टॉपिक अनुसार बेस्ट हैशटैग。<br>
          <strong>AI Moderation:</strong> गलत या अश्लील पोस्ट को रोकने की स्वचालित जांच।
        </div>
      </div>
      <div class="card full-card">
        <div class="card-title">
          सहयोग व गेमिफिकेशन (Collabs, Hackathons & XP Points)
          <span class="tag">Karma & Badges</span>
        </div>
        <div class="card-desc">
          गाँव के टेक प्रोजेक्ट्स में टीम बनाने के लिए कोलैबोरेशन बोर्ड, रूरल इनोवेशन चैलेंज, लीडरबोर्ड, तथा पोस्ट करने पर +10 XP, लाइक पर +2 XP और स्पेशल बैज (Grassroots Innovator)।
        </div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 4: HEALTHGUARD AI -->
  <div class="section" style="margin-top: 10px;">
    <div class="section-title">
      <div class="icon-box">3</div>
      HealthGuard AI (24x7 स्वास्थ्य व आपातकालीन परामर्श)
    </div>
    <div class="feature-grid">
      <div class="card full-card" style="border-left-color: #c92a2a; background: #fff8f8;">
        <div class="card-title" style="color: #901b1b;">
          🚨 सुरक्षा पहले — ऑटोमैटिक इमरजेंसी एस्केलेशन (Deterministic Triage)
          <span class="tag" style="background: #f8d7da; color: #842029;">Life Safety Priority</span>
        </div>
        <div class="card-desc" style="color: #631212;">
          यदि मरीज को सीने में दर्द, सांस लेने में अत्यधिक तकलीफ, स्ट्रोक के लक्षण (FAST) या भारी खून बहने जैसी आपात स्थिति हो, तो AI बिना देर किए <strong>🚨 रेड अलर्ट</strong> चालू कर देता है और <strong>108 एम्बुलेंस</strong> व पास के 24x7 अस्पताल को 1-क्लिक कॉल का बटन दिखाता है।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          📷 फोटो से जांच (Visual Triage)
          <span class="tag">Photo AI</span>
        </div>
        <div class="card-desc">
          दाने, घाव, सूजन या जलने की फोटो अपलोड करके सुरक्षित प्राथमिक राय। फोटो की रोशनी व क्लैरिटी की पूर्व-जांच भी शामिल है।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          🩺 लक्षण विवरण (Symptom Checker)
          <span class="tag">Clinical Flow</span>
        </div>
        <div class="card-desc">
          शरीर का अंग, दर्द का स्तर (0 से 10 स्केल) और दिनों के आधार पर वैज्ञानिक विश्लेषण व प्राथमिक मार्गदर्शन।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          🚑 दुर्घटना व ट्रॉमा (Trauma First Aid)
          <span class="tag">Emergency Care</span>
        </div>
        <div class="card-desc">
          गिरना, हड्डी टूटना, करंट लगना, कुत्ते या सांप का काटना - तुरंत क्या करें (First Aid) और क्या गलती से भी न करें।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          🎙️ वॉयस मोड (Voice Consultation)
          <span class="tag">Vernacular Voice</span>
        </div>
        <div class="card-desc">
          हिंदी और बोलचाल की भाषा में बोलकर परामर्श प्राप्त करें। बुजुर्ग और कम पढ़े-लिखे लोगों के लिए विशेष सुगम।
        </div>
      </div>
      <div class="card full-card">
        <div class="card-title">
          अस्पताल व डॉक्टर डायरेक्टरी (CHC कुरुद व धमतरी)
          <span class="tag">Verified Directory</span>
        </div>
        <div class="card-desc">
          सामुदायिक स्वास्थ्य केंद्र (CHC) कुरुद और जिला अस्पताल धमतरी के 24x7 इमरजेंसी नंबर, कोडेबोड से दूरी, डॉक्टर लिस्टिंग और डिजिटल प्रिंटेबल हेल्थ समरी रिपोर्ट।
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 5: SMART WEATHER AI -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">4</div>
      Smart Weather AI (स्मार्ट मौसम वैज्ञानिक व किसान वेदर)
    </div>
    <div class="feature-grid">
      <div class="card">
        <div class="card-title">
          लाइव जीपीएस व ऑटो-सर्च
          <span class="tag">Geolocation & Autocomplete</span>
        </div>
        <div class="card-desc">
          फोन की जीपीएस लोकेशन से तुरंत लाइव मौसम देखें या भारत के किसी भी गाँव, तहसील या पिनकोड को तुरंत खोजें।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          ग्लासमॉर्फिज्म एनिमेटेड स्क्रीन
          <span class="tag">Dynamic Skies</span>
        </div>
        <div class="card-desc">
          दिन में सुनहरी धूप, रात में टिमटिमाते तारे, बादलों की आवाजाही और बारिश की बूंदों के जीवंत एनिमेशन।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          9 मुख्य मौसम आंकड़े
          <span class="tag">9-Metrics Grid</span>
        </div>
        <div class="card-desc">
          तापमान, RealFeel, हवा की रफ्तार व दिशा, नमी, विजिबिलिटी, यूवी इंडेक्स, बारिश की संभावना, एयर प्रेशर और मौसम चेतावनी।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          घंटेवार व 7 दिनों का पूर्वानुमान
          <span class="tag">Hourly & 7-Day</span>
        </div>
        <div class="card-desc">
          दिन भर कब बारिश होगी और अगले एक हफ्ते का सटीक अनुमान क्षैतिज स्क्रोलिंग कार्ड्स में प्रदर्शित।
        </div>
      </div>
      <div class="card full-card highlight">
        <div class="card-title">
          🌾 किसान स्पेशल मोड (धमतरी के धान किसानों हेतु)
          <span class="tag">Agriculture Intelligence</span>
        </div>
        <div class="card-desc">
          <strong>नहर जल प्रवाह सलाह:</strong> गंगरेल/महानदी नहर जल वितरण के अनुसार सिंचाई प्लान。<br>
          <strong>कीटनाशक छिड़काव अलर्ट:</strong> हवा की तेज रफ्तार में दवा न उड़ाने की चेतावनी。<br>
          <strong>कटाई व खाद:</strong> बारिश से पहले फसल कटाई व यूरिया छिड़कने की वैज्ञानिक टाइमिंग।
        </div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 6: PASHU DOCTOR AI -->
  <div class="section" style="margin-top: 10px;">
    <div class="section-title">
      <div class="icon-box">5</div>
      Pashu Doctor AI (पशु डॉक्टर - वेटरनरी एआई)
    </div>
    <div class="feature-grid">
      <div class="card">
        <div class="card-title">
          पशु रोग लक्षण व फोटो विश्लेषण
          <span class="tag">Multi-Animal Triage</span>
        </div>
        <div class="card-desc">
          गाय, भैंस, बकरी, भेड़, कुत्ता और मुर्गियों के मुंह-पका खुर-पका (FMD), पेट फूलना, बुखार या त्वचा संक्रमण की जांच।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          सुरक्षित प्राथमिक देखभाल व निषेध
          <span class="tag">Safe Protocols</span>
        </div>
        <div class="card-desc">
          तात्कालिक सुरक्षित घरेलू उपाय और ऐसे हानिकारक उपचारों की सख्त मनाही जो पशु के जीवन को खतरे में डाल सकते हैं।
        </div>
      </div>
      <div class="card full-card" style="border-left-color: #c92a2a;">
        <div class="card-title">
          🚑 1962 मोबाइल पशु चिकित्सा एम्बुलेंस इंटीग्रेशन
          <span class="tag" style="background: #f8d7da; color: #842029;">1-Tap Call</span>
        </div>
        <div class="card-desc">
          गंभीर स्थिति में सरकारी <strong>1962 मोबाइल वेटरनरी एम्बुलेंस</strong> और कुरुद शासकीय पशु चिकित्सालय को सीधे कॉल करने की सुविधा।
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 7: EMERGENCY HUB -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">6</div>
      GramAI Emergency Hub (आपातकालीन 1-टैप सहायता)
    </div>
    <div class="full-card">
      <div class="card-desc">
        ग्रामीण नागरिकों की सुरक्षा हेतु हाई-कंट्रास्ट, बड़े बटनों वाला इमरजेंसी रिस्पॉन्स सिस्टम:
      </div>
      <div class="sos-strip">
        <div class="sos-item">
          <strong>🚑 108 एम्बुलेंस</strong>
          आपातकालीन मेडिकल सेवा
        </div>
        <div class="sos-item">
          <strong>🚓 112 / 100 पुलिस</strong>
          तत्काल पुलिस सहायता
        </div>
        <div class="sos-item">
          <strong>🔥 101 अग्निशमन</strong>
          दमकल नियंत्रण कक्ष
        </div>
        <div class="sos-item">
          <strong>🏥 CHC कुरुद</strong>
          +91 77052 24108
        </div>
        <div class="sos-item">
          <strong>👮 ग्राम पंचायत कक्ष</strong>
          +91 62688 14185
        </div>
        <div class="sos-item">
          <strong>🌊 1077 आपदा राहत</strong>
          बाढ़ व प्राकृतिक आपदा
        </div>
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #0c2e1d; font-weight: 600;">
        📍 <strong>लाइव लोकेशन ब्रॉडकास्ट:</strong> एक बटन दबाते ही जीपीएस निर्देशांक और पता व्हाट्सएप या एसएमएस से परिजनों व पुलिस को भेजा जा सकता है।
      </div>
    </div>
  </div>

  <!-- SECTION 8: LOCAL JOBS & POWER & FARMER -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">7</div>
      रोजगार, बिजली निगरानी व किसान चौपाल
    </div>
    <div class="feature-grid">
      <div class="card">
        <div class="card-title">
          💼 GramAI Local Jobs
          <span class="tag">Rural Employment</span>
        </div>
        <div class="card-desc">
          स्थानीय नौकरियां (सोलर टेक्नीशियन, ट्रैक्टर/हार्वेस्टर चालक, कंप्यूटर शिक्षक, प्लंबर)। 1-क्लिक आवेदन और व्यापारियों हेतु 'Post a Job' सुविधा।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          ⚡ GramAI Power Report
          <span class="tag">Electricity Safety</span>
        </div>
        <div class="card-desc">
          तार टूटने, ट्रांसफार्मर खराबी व बिजली कटौती की फोटो सहित रिपोर्ट। 1912 CSPDCL हेल्पलाइन और हाई-वोल्टेज सुरक्षा चेतावनी।
        </div>
      </div>
      <div class="card full-card">
        <div class="card-title">
          🌾 GramAI Farmer Community (किसान चौपाल)
          <span class="tag">Krishi Q&A</span>
        </div>
        <div class="card-desc">
          किसानों के लिए परिचर्चा मंच। किसान के सवाल पूछते ही <strong>AI कृषि सहायक</strong> तुरंत वैज्ञानिक दवा, सही मात्रा व कीट निवारण की सलाह पोस्ट करता है।
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 9: MY VILLAGE HUB (KODEBOD) -->
  <div class="section">
    <div class="section-title">
      <div class="icon-box">8</div>
      My Village Hub (कोडेबोड - 360° डिजिटल गाँव दर्शन)
    </div>
    <div class="feature-grid">
      <div class="card">
        <div class="card-title">
          आधिकारिक सेंसस 2011 डेटा
          <span class="tag">Official Census</span>
        </div>
        <div class="card-desc">
          जनसंख्या: 2,746 · पुरुष: 1,353 · महिलाएं: 1,393 · लिंगानुपात: 1,029 · कुल साक्षरता: 79.52% · कुल परिवार: 548 (ऐतिहासिक सरकारी रिकॉर्ड)।
        </div>
      </div>
      <div class="card">
        <div class="card-title">
          गाँव की प्रमुख सुविधाएं
          <span class="tag">Facilities & Navigation</span>
        </div>
        <div class="card-desc">
          प्राथमिक व पूर्व माध्यमिक स्कूल, स्वास्थ्य उप-केंद्र, बैंक मित्र ग्राहक सेवा केंद्र, पीडीएस राशन दुकान व पंचायत भवन की सीधी जानकारी।
        </div>
      </div>
      <div class="card full-card highlight">
        <div class="card-title">
          🤖 "Ask About This Village" AI असिस्टेंट
          <span class="tag">Interactive Village AI</span>
        </div>
        <div class="card-desc">
          कोडेबोड गाँव के इतिहास, मुख्य फसलें (धान), जल स्रोत (महानदी कुरुद कैनाल), वार्ड व्यवस्था और पंचायत प्रतिनिधियों के बारे में कोई भी प्रश्न पूछें - AI तुरंत सटीक उत्तर देता है।
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="doc-footer">
    <div>
      <strong>GramEye AI</strong> · ग्राम कोडेबोड, तहसील कुरूद, जिला धमतरी, छत्तीसगढ़
    </div>
    <div>
      लाइव पोर्टल: <a href="https://civiceye-ai0.vercel.app">civiceye-ai0.vercel.app</a>
    </div>
  </div>

</body>
</html>
"""

# Save HTML file
html_file_path = os.path.join(workspace_dir, "GramEye_AI_Features_Guide.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"HTML saved to {html_file_path}")

# Output PDF paths
pdf_output_path = os.path.join(workspace_dir, "GramEye_AI_Features_Guide.pdf")
public_pdf_path = os.path.join(public_dir, "GramEye_AI_Features_Guide.pdf")

# Convert to PDF using headless Edge
edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-software-rasterizer",
    f"--print-to-pdf={pdf_output_path}",
    html_file_path
]

print("Converting HTML to PDF via Edge headless...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stderr:", res.stderr)

if os.path.exists(pdf_output_path):
    pdf_size = os.path.getsize(pdf_output_path)
    print(f"Success! PDF created at: {pdf_output_path} (Size: {pdf_size} bytes)")
    
    # Copy to public folder for web download
    with open(pdf_output_path, "rb") as src, open(public_pdf_path, "wb") as dst:
        dst.write(src.read())
    print(f"Copied to public folder for direct download: {public_pdf_path}")
else:
    print("Error: PDF file was not generated.")
