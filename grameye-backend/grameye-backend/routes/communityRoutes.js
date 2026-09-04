const express = require("express");
const router = express.Router();

// ======================== LOCAL JOBS ========================
let JOBS = [
  {
    id: "job-1",
    title: "सोलर सिंचाई ऑपरेटर व पंप तकनीशियन (Solar Pump Tech)",
    employer: "कुरूद रूरल एनर्जी प्राइवेट लिमिटेड (CREDA Empanelled)",
    category: "Skilled Technical",
    location: "कोड़ेबोड व समीपवर्ती वार्ड",
    distance: "2.5 km",
    salary: "₹16,500 - ₹22,000 / माह",
    jobType: "Full-time",
    verified: true,
    skills: ["Solar Inverter", "Motor Repair", "Wiring"],
    postedDate: "02 Sep 2026",
    urgent: true,
    contact: "+91 98271 45012"
  },
  {
    id: "job-2",
    title: "प्राथमिक शाला कंप्यूटर व डिजिटल साक्षरता शिक्षक",
    employer: "ग्राम शिक्षा समिति, कोड़ेबोड",
    category: "Education",
    location: "शासकीय पूर्व माध्यमिक शाला, कोड़ेबोड",
    distance: "Village Center",
    salary: "₹14,000 / माह",
    jobType: "Contractual",
    verified: true,
    skills: ["Basic Computer", "Hindi/English Typing", "MS Office"],
    postedDate: "30 Aug 2026",
    urgent: false,
    contact: "+91 62688 14185"
  },
  {
    id: "job-3",
    title: "कृषि ट्रैक्टर व हार्वेस्टर चालक (Driver)",
    employer: "पटेल एग्रो सर्विसेज, कुरूद",
    category: "Driver / Agriculture",
    location: "कुरूद - कोड़ेबोड बेल्ट",
    distance: "4.0 km",
    salary: "₹18,000 + दैनिक भत्ता",
    jobType: "Seasonal / Full-time",
    verified: true,
    skills: ["Heavy Vehicle License", "Tractor Handling", "Maintenance"],
    postedDate: "01 Sep 2026",
    urgent: true,
    contact: "+91 94060 21980"
  },
  {
    id: "job-4",
    title: "ग्राम पंचायत जल संरक्षण एवं पाइपलाइन प्लम्बर",
    employer: "जल जीवन मिशन (PHE), धमतरी",
    category: "Skilled Trade",
    location: "कोड़ेबोड (वार्ड 1-6)",
    distance: "Local",
    salary: "₹15,500 / माह",
    jobType: "Govt Scheme Work",
    verified: true,
    skills: ["Plumbing", "PVC Jointing", "Water Pressure Testing"],
    postedDate: "28 Aug 2026",
    urgent: false,
    contact: "+91 77052 24110"
  }
];

router.get("/jobs", (req, res) => {
  const { category, search } = req.query;
  let result = JOBS;
  if (category && category !== "All") {
    result = result.filter(j => j.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    result = result.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.employer.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
  }
  res.json({ success: true, jobs: result });
});

router.post("/jobs/apply", (req, res) => {
  const { jobId, name, mobile, skills } = req.body;
  res.json({
    success: true,
    message: `आवेदन सफलतापूर्वक जमा हो गया! नियोक्ता (+91 ${mobile.slice(-10)}) जल्द ही संपर्क करेंगे।`,
    applicationId: `APP-JOB-${Date.now().toString().slice(-4)}`
  });
});

// ======================== POWER REPORT ========================
let POWER_REPORTS = [
  {
    id: "PWR-2026-01",
    issueType: "ट्रांसफार्मर में स्पार्किंग व ओवरलोड (Transformer Sparking)",
    ward: "Ward 4 (निकट शीतला मंदिर)",
    location: "कोड़ेबोड, धमतरी",
    severity: "HIGH",
    reportedAt: "03 Sep 2026, 04:15 PM",
    status: "IN_PROGRESS",
    assignedCrew: "CSPDCL कुरूद सबस्टेशन लाइन दल",
    description: "ट्रांसफार्मर से चिंगारियां निकल रही हैं, वोल्टेज कम-ज्यादा हो रहा है।",
    safetyWarning: "कृपया 20 मीटर दूर रहें! किसी भी तार या पोल को न छुएं।"
  },
  {
    id: "PWR-2026-02",
    issueType: "सड़क की स्ट्रीट लाइट खराब (Streetlight Outage)",
    ward: "Ward 2 (स्कूल रोड)",
    location: "कोड़ेबोड",
    severity: "LOW",
    reportedAt: "02 Sep 2026, 08:30 PM",
    status: "RESOLVED",
    assignedCrew: "पंचायत विद्युत समिति",
    description: "खंभा क्र. 14 की एलईडी लाइट 2 दिनों से बंद थी, नई लाइट लगा दी गई है।"
  }
];

router.get("/power/reports", (req, res) => {
  res.json({ success: true, reports: POWER_REPORTS });
});

router.post("/power/reports", (req, res) => {
  const { issueType, ward, description, photoUrl } = req.body;
  const newReport = {
    id: `PWR-2026-0${POWER_REPORTS.length + 3}`,
    issueType: issueType || "विद्युत समस्या",
    ward: ward || "Ward 3",
    location: "कोड़ेबोड, धमतरी",
    severity: issueType?.includes("तार") || issueType?.includes("ट्रांसफार्मर") ? "CRITICAL" : "MEDIUM",
    reportedAt: new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    status: "REPORTED",
    assignedCrew: "CSPDCL सबस्टेशन कनिष्ठ अभियंता को अग्रेषित",
    description: description || "नागरिक द्वारा दर्ज शिकायत",
    photoUrl
  };
  POWER_REPORTS.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

// ======================== PASHU DOCTOR AI ========================
router.post("/pashu/diagnose", (req, res) => {
  const { animalType = "Cow", symptoms = "", duration = "1 day" } = req.body;
  const s = symptoms.toLowerCase();

  let assessment = {
    animal: animalType,
    visibleObservations: "सामान्य शारीरिक लक्षण व व्यवहारिक असंतुलन",
    possibleCondition: "पाचन संबंधी विकार अथवा मौसमी संक्रमण की प्रारंभिक अवस्था",
    urgency: "MONITOR",
    homeCare: [
      "स्वच्छ व गुनगुना पानी पर्याप्त मात्रा में दें",
      "हरा चारा सुपाच्य अवस्था में दें, बासी आहार न दें",
      "जानवर को हवादार व छायादार स्थान पर रखें"
    ],
    contraindications: [
      "बिना पशु चिकित्सक परामर्श के एंटीबायोटिक या इंसानी दवा न दें",
      "पशु के पेट को अत्यधिक दबाएं नहीं"
    ],
    veterinaryContact: {
      center: "शासकीय पशु औषधालय, कुरूद (7 किमी)",
      doctor: "डॉ. वी. के. साहू (पशु चिकित्सा अधिकारी)",
      phone: "+91 77052 24190"
    }
  };

  if (s.includes("बुखार") || s.includes("fever") || s.includes("खुर") || s.includes("मुंह me chhale") || s.includes("mouth")) {
    assessment.possibleCondition = "खुरपका-मुंहपका (FMD) या तीव्र वायरल संक्रमण का संदेह";
    assessment.urgency = "VET_RECOMMENDED";
    assessment.homeCare.unshift("संक्रमित पशु को अन्य पशुओं से तत्काल पृथक करें");
  } else if (s.includes("गंभीर") || s.includes("खून") || s.includes("bleeding") || s.includes("behoshi") || s.includes("fracture")) {
    assessment.urgency = "EMERGENCY";
    assessment.possibleCondition = "गंभीर आपातकालीन स्थिति — तत्काल पशु एम्बुलेंस की आवश्यकता";
  }

  res.json({ success: true, diagnosis: assessment });
});

// ======================== FARMER COMMUNITY ========================
let CHOPAL_POSTS = [
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
        author: "GramAI कृषि सहायक",
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
];

router.get("/farmer-chopal", (req, res) => {
  res.json({ success: true, discussions: CHOPAL_POSTS });
});

router.post("/farmer-chopal", (req, res) => {
  const { title, content, category = "General" } = req.body;
  const newPost = {
    id: `chp-${Date.now()}`,
    author: req.body.author || "गाँव के किसान भाई",
    role: "कृषक, कोड़ेबोड",
    title: title || "कृषि संबंधी प्रश्न",
    content: content || "",
    category,
    likes: 1,
    replies: [
      {
        author: "GramAI कृषि सहायक (AI Bot)",
        isAi: true,
        text: "आपका प्रश्न प्राप्त हुआ! मौसम व मिट्टी के स्थानीय मानकों के अनुसार उपयुक्त सलाह तैयार की जा रही है। अनुभवी किसान भाई भी अपने अनुभव साझा करें।"
      }
    ]
  };
  CHOPAL_POSTS.unshift(newPost);
  res.status(201).json({ success: true, discussion: newPost });
});

module.exports = router;
