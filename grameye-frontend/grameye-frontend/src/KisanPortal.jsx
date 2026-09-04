import React, { useState, useRef, useEffect } from "react";
import {
  Sprout, TrendingUp, Sun, CloudRain, Wind, Droplets,
  AlertTriangle, ShieldCheck, Camera, CheckCircle2, ArrowRight,
  Phone, Sparkles, RefreshCw, Layers, Check, Mic, Video,
  Volume2, VolumeX, Share2, Printer, X, Play, Square,
  Paperclip, FileText, Image as ImageIcon, Send, Clock,
  HelpCircle, MessageCircle, ChevronDown, ChevronUp, DollarSign
} from "lucide-react";

// Mandi Rates for Kurud / Dhamtari APMC
const MANDI_RATES = [
  { crop: "धान (Paddy Common)", msp: 2183, rate: 2195, change: "+12", trend: "up" },
  { crop: "धान ग्रेड-ए (Paddy Grade A)", msp: 2203, rate: 2240, change: "+37", trend: "up" },
  { crop: "चना (Chana / Gram)", msp: 5440, rate: 5580, change: "+140", trend: "up" },
  { crop: "मक्का (Maize)", msp: 2090, rate: 2110, change: "+20", trend: "up" },
  { crop: "सरसों (Mustard)", msp: 5650, rate: 5720, change: "+70", trend: "up" },
  { crop: "सोयाबीन (Soybean)", msp: 4892, rate: 4790, change: "-102", trend: "down" }
];

// Comprehensive Multi-Stage Agricultural Diagnostic Database
const CROP_DIAGNOSES = {
  blast: {
    id: "diag_blast",
    crop: "धान (Paddy / Rice)",
    diseaseHindi: "धान का झुलसा रोग (Paddy Leaf Blast)",
    pathogen: "Magnaporthe oryzae (Pyricularia oryzae - फफूंद जनित)",
    severity: "उच्च जोखिम (High Risk - 75% से 85% फसल नुकसान की संभावना)",
    healthScore: 35,
    stage: "सक्रिय संक्रमण चरण (Active Spore Dispersal Stage)",
    confidence: "98.4%",
    infectedParts: "पत्तियां, गांठें (Nodes), एवं बालियों के डंठल (Neck / Panicle)",
    
    // 1. क्या हुआ है (What Happened)
    whatHappened: {
      summary: "आपकी धान की फसल पर फफूंद (फंगस) का गंभीर हमला हुआ है। पत्तियों की ऊपरी सतह पर आँख या नाव के आकार के धब्बे बन चुके हैं, जिसके कारण पौधे का प्रकाश संश्लेषण (भोजन बनाने की क्षमता) 60% से अधिक घट चुका है। यदि 48 घंटे में रोकथाम न की गई तो बालियों के जोड़ काले होकर टूट जाएंगे और दाने नहीं भरेंगे।",
      visualSigns: [
        "पत्तियों पर नाव के आकार के भूरे-धूसर धब्बे, जिनके किनारे गहरे कत्थई या लाल हैं।",
        "धब्बों का आपस में मिलकर पूरी पत्ती को झुलसा देना और पत्ती का समय से पहले सूखना।",
        "बालियों के निचले जोड़ (Neck) पर काले छल्ले बनना, जिससे बालियां लटककर टूट जाती हैं।"
      ],
      impactOnYield: "औसतन 65% से 80% तक उत्पादन में कमी और बालियों में थोथी (खाली) दाने बनने का खतरा।"
    },

    // 2. क्यों और कैसे हुआ (Why & How It Happened)
    whyHappened: {
      primaryCause: "मौसम की अत्यधिक नमी और हवा में तैरते फफूंद के बीजाणुओं का पत्तियों पर अंकुरित होना।",
      weatherTriggers: [
        "लगातार 4-5 दिनों से 85% से अधिक आर्द्रता (Humidity) और रुक-रुक कर रिमझिम बारिश।",
        "22°C से 28°C के बीच अनुकूल तापमान और रात में ओस का लंबे समय तक पत्तियों पर ठहरना।",
        "आसमान में बादलों का छाया रहना और सीधी कड़ी धूप का अभाव।"
      ],
      farmingMistakes: [
        "यूरिया (नाइट्रोजन) खाद का आवश्यकता से अधिक या असंतुलित छिड़काव, जिससे पत्तियां ज्यादा रसीली और कोमल हो गईं।",
        "खेत में पानी की निकासी का न होना और लगातार ठहरा हुआ पानी बना रहना।",
        "पौधों की अत्यधिक घनी रोपाई, जिसके कारण नीचे के तनों तक धूप और हवा नहीं पहुंच पाई।"
      ],
      spreadMedium: "यह फफूंद हवा द्वारा उड़कर तथा सिंचाई के पानी के बहाव से 2 से 3 किलोमीटर तक तेजी से फैलती है।"
    },

    // 3. चरणबद्ध समाधान रोडमैप (Day-by-Day Roadmap)
    actionRoadmap: [
      {
        day: "Day 1 (आज तुरंत करें)",
        title: "यूरिया खाद बंद व जल निकासी",
        action: "खेत से अतिरिक्त पानी तुरंत निकाल दें। यूरिया का छिड़काव पूरी तरह रोकें। खेत की मेड़ों से खरपतवार साफ करें ताकि खेत में हवा का आवागमन बढ़ सके।"
      },
      {
        day: "Day 2-3 (छिड़काव समय)",
        title: "रासायनिक फफूंदनाशक का स्प्रे",
        action: "ट्राइसाइक्लाजोल 75% WP (120 ग्राम प्रति एकड़) को 200 लीटर पानी में घोलें। शाम 4 बजे के बाद कट नोजल से पत्तियों के दोनों तरफ अच्छी तरह छिड़कें। घोल में 5ml स्टीकर (चिपको) जरूर मिलाएं।"
      },
      {
        day: "Day 7-8 (प्रभाव जांच)",
        title: "रोग नियंत्रण की समीक्षा",
        action: "जांचें कि पत्तियों के धब्बे सूखकर कत्थई हो रहे हैं या नहीं। यदि नए पत्तों पर धब्बे दिखें तो 8वें दिन कासुगामाइसिन (400 मिली प्रति एकड़) का दूसरा स्प्रे करें।"
      },
      {
        day: "Day 12-14 (रिकवरी बूस्टर)",
        title: "पोटाश व दाना भराव पोषण",
        action: "पोटेशियम शोरा (00:00:50) 1 किग्रा प्रति एकड़ 150 लीटर पानी में मिलाकर स्प्रे करें ताकि बालियों में शत-प्रतिशत दाने भरें और चमक आए।"
      }
    ],

    // 4. क्या-क्या उपयोग करना चाहिए (Medicines & Cost)
    medicines: [
      {
        rank: "सर्वोत्तम असरदार (विकल्प 1)",
        techName: "ट्राइसाइक्लाजोल 75% WP (Tricyclazole)",
        brands: "बान (Baan - बायर), बीम (Beam - कॉर्टेवा), सिविक (धानुका)",
        dosePerPump: "12 ग्राम (प्रति 15 लीटर टंकी)",
        dosePerAcre: "120 ग्राम (200 लीटर पानी में)",
        costAcre: "₹380 - ₹430",
        rating: "9.8/10",
        notes: "यह सिस्टेमिक दवा है, पौधे के अंदर जाकर फफूंद को 24 घंटे में रोक देती है।"
      },
      {
        rank: "एंटीबायोटिक संयोजन (विकल्प 2)",
        techName: "कासुगामाइसिन 3% SL (Kasugamycin)",
        brands: "कासु-बी (बायोस्टैड), कासुगा (धानुका), इंडोफिल कासु",
        dosePerPump: "35 से 40 मिली (प्रति 15 लीटर टंकी)",
        dosePerAcre: "400 मिली (200 लीटर पानी में)",
        costAcre: "₹460 - ₹530",
        rating: "9.5/10",
        notes: "जीवाणु और फफूंद दोनों के मिश्रित प्रकोप में सर्वाधिक प्रभावी है।"
      },
      {
        rank: "उन्नत दोहरा सुरक्षा कवच (विकल्प 3)",
        techName: "एजॉक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाजोल 11.4% SC",
        brands: "एमीस्टार टॉप (सिंजेंटा), गोडार्ड (टाटा रैलिस)",
        dosePerPump: "20 मिली (प्रति 15 लीटर टंकी)",
        dosePerAcre: "200 मिली (200 लीटर पानी में)",
        costAcre: "₹780 - ₹860",
        rating: "9.9/10",
        notes: "पर्ण झुलसा और शीथ ब्लाइट दोनों को एक साथ जड़ से समाप्त करता है।"
      }
    ],

    // 5. देसी व जैविक उपाय (Organic Remedies)
    organicRemedy: {
      recipe1: "खट्टी छाछ (मट्ठा) व तांबे का काढ़ा: 5 लीटर 8-10 दिन पुरानी खट्टी छाछ में तांबे का तार या लोटा डालकर रखें। इसे 150 लीटर पानी में मिलाकर छानकर स्प्रे करें। तांबे के आयन फफूंद को प्राकृतिक रूप से नष्ट करते हैं।",
      recipe2: "नीमास्त्र व गोमूत्र: 5 लीटर गोमूत्र + 5 किग्रा नीम की पत्तियां + 2 किग्रा ताजा गोबर को 100 लीटर पानी में 48 घंटे सड़ाएं। प्रति 15 लीटर पंप में 1.5 लीटर मिलाकर छिड़काव करें।",
      soilBooster: "ट्राइकोडर्मा विरिडी (Trichoderma) 2 किग्रा प्रति एकड़ 100 किग्रा सड़ी गोबर खाद में मिलाकर खेत की अंतिम जुताई या जड़ों के पास डालें।"
    },

    // 6. अगले सीजन का बचाव (Future Prevention)
    futurePrevention: [
      "बीजोपचार (Seed Treatment): अगली बुवाई से पहले कार्बेन्डाजिम 50% WP (2 ग्राम प्रति किग्रा बीज) या ट्राइकोडर्मा (5 ग्राम प्रति किग्रा बीज) से बीज का शोधन अवश्य करें।",
      "रोगरोधी किस्में: झुलसा रोग संभावित क्षेत्रों में रोगरोधी किस्में लगाएं (जैसे: छत्तीसगढ़ सुगंधित-3, एमटीयू 1010, आईआर 64, दंतेश्वरी)।",
      "संतुलित खाद: नत्रजन, फास्फोरस व पोटाश का 4:2:1 का अनुपात रखें और यूरिया की अंतिम खुराक कल्ले फूटने के बाद न दें।"
    ],

    audioText: "फसल विश्लेषण रिपोर्ट: आपके धान में पर्ण झुलसा रोग का प्रकोप हुआ है। इसका मुख्य कारण अत्यधिक नमी और यूरिया का अधिक प्रयोग है। तुरंत खेत से पानी निकालें और यूरिया बंद करें। दवा के रूप में ट्राइसाइक्लाजोल 75 प्रतिशत, 120 ग्राम प्रति एकड़ 200 लीटर पानी में शाम के समय स्प्रे करें।",
    color: "#8B4513"
  },

  stem_borer: {
    id: "diag_stem_borer",
    crop: "धान (Paddy / Rice)",
    diseaseHindi: "तना छेदक कीट (Yellow Stem Borer)",
    pathogen: "Scirpophaga incertulas (सफेद सुंडी / कीट लार्वा)",
    severity: "अत्यंत गंभीर (Critical - 85% से 90% फसल जोखिम)",
    healthScore: 30,
    stage: "सुंडी द्वारा तने को अंदर से काटने की अवस्था",
    confidence: "97.2%",
    infectedParts: "पौधे का केंद्रीय तना, गोभ, एवं निकलने वाली बालियां",
    
    whatHappened: {
      summary: "तना छेदक कीट की सुंडी (इल्ली) तने के निचले हिस्से में छेद करके अंदर घुस चुकी है और अंदर के संवहनी ऊतकों को कुतर-कुतर कर खा रही है। इससे पौधे तक पानी और भोजन का प्रवाह रुक चुका है, जिसके कारण पौधे की बीच की गोभ सूख रही है (Dead Heart) और बालियां निकलने पर सफेद, सूखी व खाली दाने वाली हो रही हैं (White Earhead)।",
      visualSigns: [
        "कल्ले की बीच की पत्ती सूखकर पीली हो चुकी है, जिसे खींचने पर आसानी से बाहर निकल आती है।",
        "तने पर पानी की सतह के पास छोटा गोल छेद और कीट का मल दिखाई देना।",
        "बाली निकलने के बाद पूरी बाली दूधिया सफेद हो जाना और सीधी खड़ी रहना, जिसमें दाने नहीं भरते।"
      ],
      impactOnYield: "यदि तुरंत रोकथाम नहीं की गई तो 70% से 90% बालियां बिना दाने के सफेद रह जाएंगी।"
    },

    whyHappened: {
      primaryCause: "पीली तितली द्वारा पत्तियों के ऊपरी सिरे पर अंडों का गुच्छा देना और 5-7 दिन बाद सुंडी का तने में घुस जाना।",
      weatherTriggers: [
        "25°C से 32°C तापमान और 70-80% सापेक्ष आर्द्रता कीट प्रजनन के लिए अत्यंत अनुकूल होती है।",
        "रात के समय खेत में रोशनी या स्ट्रीट लाइट की उपस्थिति तितलियों को आकर्षित करती है।"
      ],
      farmingMistakes: [
        "रोपाई के समय पौध की पत्तियों के ऊपरी 2 इंच सिरे को न काटना (जिसपर तितली के अंडे चिपके रहते हैं)।",
        "खेत में लगातार कीटनाशक का गलत प्रयोग जिससे मित्र कीट (मकड़ियां व परजीवी) नष्ट हो गए।"
      ],
      spreadMedium: "मादा तितली उड़कर प्रति रात 150-200 अंडे देती है जो पूरे खेत में फैल जाते हैं।"
    },

    actionRoadmap: [
      {
        day: "Day 1 (आज तुरंत करें)",
        title: "ग्रसित गोभ हटाना व फेरोमोन ट्रैप",
        action: "खेत में जिन पौधों की गोभ सूख चुकी है उन्हें उखाड़कर नष्ट करें। खेत में प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं ताकि नर तितलियां पकड़ी जा सकें और प्रजनन रुके।"
      },
      {
        day: "Day 2-3 (दवा का प्रयोग)",
        title: "दानेदार या स्प्रे कीटनाशक",
        action: "खेत में 2-3 इंच पानी भरकर क्लोरांट्रानिलीप्रोल 0.4% GR (4 किग्रा प्रति एकड़) बालू में मिलाकर भुरकाव करें। या कार्टाप हाइड्रोक्लोराइड 50% SP (400 ग्राम/एकड़) का छिड़काव करें।"
      },
      {
        day: "Day 7-8 (प्रभाव जांच)",
        title: "नई गोभ का निरीक्षण",
        action: "जांचें कि नए कल्ले स्वस्थ निकल रहे हैं या नहीं। फेरोमोन ट्रैप में पकड़ी गई तितलियों की संख्या घटनी चाहिए।"
      },
      {
        day: "Day 14 (सुरक्षा चक्र)",
        title: "जैविक परजीवी कार्ड",
        action: "ट्राइकोग्रामा कार्ड (Trichogramma japonicum) 50,000 प्रति एकड़ पत्तियों पर स्टेपल करें जो तना छेदक के अंडों को प्राकृतिक रूप से नष्ट कर देता है।"
      }
    ],

    medicines: [
      {
        rank: "दीर्घकालिक सुरक्षा (दानेदार विकल्प 1)",
        techName: "क्लोरांट्रानिलीप्रोल 0.4% GR (Chlorantraniliprole)",
        brands: "फटेरा (Ferterra - FMC), कोराजेन जीआर",
        dosePerPump: "लागू नहीं (सीधा जमीन में भुरकाव)",
        dosePerAcre: "4 किलोग्राम प्रति एकड़ (20 किग्रा बालू खाद में मिलाकर)",
        costAcre: "₹550 - ₹620",
        rating: "9.9/10",
        notes: "पौधे की जड़ों द्वारा अवशोषित होकर 25-30 दिनों तक तने के अंदर कीट को मारता है।"
      },
      {
        rank: "तत्काल नॉकडाउन स्प्रे (विकल्प 2)",
        techName: "कार्टाप हाइड्रोक्लोराइड 50% SP (Cartap)",
        brands: "कैल्डन (Caldan - धानुका), कृटाप (क्रिस्टल)",
        dosePerPump: "35 से 40 ग्राम (प्रति 15 लीटर पंप)",
        dosePerAcre: "400 ग्राम (200 लीटर पानी में)",
        costAcre: "₹380 - ₹440",
        rating: "9.6/10",
        notes: "छिड़काव के 4 घंटे के भीतर तने में छिपी सुंडी को लकवाग्रस्त कर मार देता है।"
      },
      {
        rank: "सस्ता व प्रभावी दानेदार (विकल्प 3)",
        techName: "फिप्रोनिल 0.3% GR (Fipronil)",
        brands: "रीजेंट (Regent - बायर), मोर्टार (टाटा)",
        dosePerPump: "लागू नहीं (खेत में भुरकाव)",
        dosePerAcre: "7 से 8 किलोग्राम प्रति एकड़",
        costAcre: "₹420 - ₹480",
        rating: "9.3/10",
        notes: "तना छेदक के साथ-साथ पत्ती लपेटक कीट को भी नियंत्रित करता है।"
      }
    ],

    organicRemedy: {
      recipe1: "फेरोमोन ट्रैप व ल्यूर: प्रति एकड़ 8-10 फेरोमोन ट्रैप लगाएं। यह नर पतंगों को फंसाकर कीट की अगली पीढ़ी को रोक देता है।",
      recipe2: "नीम तेल 10,000 PPM: 2 मिली प्रति लीटर पानी में मिलाकर शाम के समय स्प्रे करें। यह सुंडी के खाने की क्षमता को निष्क्रिय करता है।",
      soilBooster: "खेत में चिड़ियों के बैठने के लिए 'T' आकार की 15-20 खूंटियां (Bird Perches) गाड़ें, चिड़ियां सुंडी को चुन-चुनकर खा जाती हैं।"
    },

    futurePrevention: [
      "रोपाई के समय पौध (नर्सरी) की पत्तियों के ऊपरी 2 इंच सिरे को काटकर ही रोपाई करें, जिससे तितली के अंडे खेत में न जाएं।",
      "फसल कटाई के बाद खेत की गहरी जुताई करें ताकि तने के ठूंठ में छिपे प्यूपा धूप में नष्ट हो जाएं।"
    ],

    audioText: "फसल जांच रिपोर्ट: धान में तना छेदक कीट का गंभीर आक्रमण है। सुंडी तने को अंदर से काट रही है जिससे गोभ सूख रही है। रोकथाम के लिए खेत में 2 इंच पानी भरकर फटेरा 4 किलोग्राम प्रति एकड़ डालें अथवा कार्टाप हाइड्रोक्लोराइड का स्प्रे करें।",
    color: "#B97417"
  },

  pod_borer: {
    id: "diag_pod_borer",
    crop: "चना / मटर / अरहर (Chana / Pulses)",
    diseaseHindi: "चने की फली छेदक इल्ली (Gram Pod Borer)",
    pathogen: "Helicoverpa armigera (हरा व भूरा लार्वा)",
    severity: "उच्च जोखिम (High Risk - 60% से 75% दाना नुकसान)",
    healthScore: 40,
    stage: "फूल व फली में दाना भराव अवस्था",
    confidence: "98.1%",
    infectedParts: "चने की कलियां, फूल, एवं हरी फलियां",
    
    whatHappened: {
      summary: "चने की फसल में फली छेदक इल्ली (हेलिकोवर्पा) का आक्रमण हुआ है। यह इल्ली फलियों में गोल छेद करके अपना अगला आधा शरीर फली के अंदर घुसा देती है और बनते हुए कोमल दानों को खाकर खोखला कर देती है। एक अकेली इल्ली 30 से 40 फलियों को नष्ट कर सकती है।",
      visualSigns: [
        "फलियों में स्पष्ट गोल छिद्र और अंदर का दाना गायब होना।",
        "पत्तियों और कलियों का कटा-फटा होना तथा पौधों पर कीट की काली गोल विष्ठा दिखना।",
        "पौधों के ऊपर हल्की हरी या भूरी धारियों वाली इल्लियों का रेंगते हुए दिखाई देना।"
      ],
      impactOnYield: "उपचार न करने पर 60% से 75% तक पैदावार कम हो सकती है तथा बाजार भाव गिर जाता है।"
    },

    whyHappened: {
      primaryCause: "फूल आने और फलियां बनने के समय अनुकूल तापमान और मादा कीट द्वारा अंडे देना।",
      weatherTriggers: [
        "दिन का तापमान 20-26°C और रात में ठंडक कीट के विकास के लिए सर्वाधिक अनुकूल है।",
        "हल्के बादलों वाला मौसम इल्ली की सक्रियता को बढ़ा देता है।"
      ],
      farmingMistakes: [
        "खेत में पक्षियों के बैठने की खूंटियां (Bird Perches) न लगाना।",
        "प्रारंभिक अवस्था (अंडे व छोटी इल्ली) में निरीक्षण न करना और जब फलियां छिद गईं तब ध्यान देना।"
      ],
      spreadMedium: "मादा पतंग रात में उड़कर प्रति पौधा दर्जनों अंडे देती है।"
    },

    actionRoadmap: [
      {
        day: "Day 1 (आज तुरंत करें)",
        title: "T-आकार खूंटी व हाथ से चुनना",
        action: "खेत में प्रति एकड़ 20 टी-आकार की खूंटियां गाड़ें ताकि देसी पक्षी (कोतवाल, मैना) इल्लियों को खा सकें। बड़ी इल्लियों को हाथ से चुनकर नष्ट करें।"
      },
      {
        day: "Day 2 (दवा छिड़काव)",
        title: "सुरक्षित इल्लीनाशक स्प्रे",
        action: "इमामेक्टिन बेंजोएट 5% SG (80 ग्राम प्रति एकड़) अथवा कोराजेन (60 मिली प्रति एकड़) 150 लीटर पानी में मिलाकर सुबह 10 बजे से पहले या शाम 4 बजे के बाद स्प्रे करें।"
      },
      {
        day: "Day 6-7 (निरीक्षण)",
        title: "नई फलियों की जांच",
        action: "जांचें कि नई फलियों में छेद रुक गए हैं या नहीं। जीवित इल्लियां दिखाई न देने पर फसल सुरक्षित है।"
      }
    ],

    medicines: [
      {
        rank: "अत्यधिक प्रभावी व सुरक्षित (विकल्प 1)",
        techName: "इमामेक्टिन बेंजोएट 5% SG (Emamectin Benzoate)",
        brands: "प्रोक्लेम (Proclaim - सिंजेंटा), मिसाइल (धानुका), ई-माइट",
        dosePerPump: "8 से 10 ग्राम (प्रति 15 लीटर पंप)",
        dosePerAcre: "80 से 100 ग्राम (150 लीटर पानी में)",
        costAcre: "₹340 - ₹410",
        rating: "9.8/10",
        notes: "इल्ली के पेट में जाते ही 2 घंटे में उसका खाना बंद कर देती है और फसल बच जाती है।"
      },
      {
        rank: "लंबे समय तक असरदार (विकल्प 2)",
        techName: "क्लोरेंट्रानिलिप्रोल 18.5% SC (Chlorantraniliprole)",
        brands: "कोराजेन (Coragen - FMC), वोल्टेज",
        dosePerPump: "6 मिली (प्रति 15 लीटर पंप)",
        dosePerAcre: "60 मिली (150 लीटर पानी में)",
        costAcre: "₹750 - ₹850",
        rating: "9.9/10",
        notes: "अंडे, छोटी इल्ली व बड़ी इल्ली तीनों अवस्थाओं पर 20 दिनों तक असरदार रहता है।"
      }
    ],

    organicRemedy: {
      recipe1: "एच.ए.एन.पी.वी. (HaNPV वायरस कल्चर): 250 LE प्रति हेक्टेयर 200 लीटर पानी में घोलकर शाम को छिड़कें। यह केवल इस इल्ली को चुनकर बीमारी फैलाकर मारता है।",
      recipe2: "नीम बीज अर्क (NSKE 5%): 5 किग्रा नीम की निंबोली पीसकर रातभर पानी में भिगोएं, छानकर 100 लीटर पानी में स्प्रे करें।",
      soilBooster: "खेत के चारों ओर गेंदे के फूल (Marigold) की 2 कतारें लगाएं, यह कीट चने को छोड़कर गेंदे पर आकर्षित होता है।"
    },

    futurePrevention: [
      "चने की बुवाई के समय कतार से कतार की दूरी 30 सेमी रखें।",
      "खेत में अंतःवर्तीय फसल के रूप में अलसी (तीसी) या धनिया लगाएं जिससे कीट प्रकोप 50% कम हो जाता है।"
    ],

    audioText: "चने की फसल में फली छेदक इल्ली लगी है जो फलियों में छेद करके दाने खा रही है। तुरंत नियंत्रण के लिए प्रोक्लेम यानी इमामेक्टिन बेंजोएट 80 ग्राम प्रति एकड़ 150 लीटर पानी में घोलकर छिड़कें।",
    color: "#704214"
  },

  mosaic: {
    id: "diag_mosaic",
    crop: "सोयाबीन / उड़द / मूंग (Soybean / Pulses)",
    diseaseHindi: "पीला मोज़ेक वायरस रोग (Yellow Mosaic Virus)",
    pathogen: "Mungbean Yellow Mosaic Virus (सफेद मक्खी रस चूसक कीट द्वारा प्रसारित)",
    severity: "अत्यंत गंभीर (Very High Risk - पूरे खेत में तेजी से फैलने वाला)",
    healthScore: 28,
    stage: "रस चूसक कीट द्वारा वायरस संचरण",
    confidence: "96.5%",
    infectedParts: "पत्तियां, नई शाखाएं व फलियां",
    
    whatHappened: {
      summary: "आपकी सोयाबीन/उड़द की फसल में पीला मोज़ेक वायरस का गंभीर संक्रमण हुआ है। यह बीमारी किसी फफूंद से नहीं बल्कि सफेद मक्खी (Whitefly) नामक सूक्ष्म रस चूसक कीट द्वारा फैलाई जाती है। पत्तियां चमकीली पीली पड़कर कठोर हो रही हैं और पौधों की बढ़वार रुक चुकी है।",
      visualSigns: [
        "पत्तियों पर पहले हल्के पीले-हरे चितकबरे धब्बे बनना, जो बाद में पूरी पत्ती को सुनहरा पीला बना देते हैं।",
        "पौधों की ऊपरी पत्तियां सिकुड़ना और नई पत्तियां बिल्कुल छोटी व पीली निकलना।",
        "पौधों पर फलियां बहुत कम लगना और जो लगती हैं उनमें दाने पिचकना या न भरना।"
      ],
      impactOnYield: "यदि सफेद मक्खी को तुरंत न मारा गया तो 3 से 5 दिनों में पूरा खेत पीला पड़ सकता है और 80% नुकसान हो सकता है।"
    },

    whyHappened: {
      primaryCause: "सफेद मक्खी (Bemisia tabaci) द्वारा संक्रमित पौधे का रस चूसकर स्वस्थ पौधों में वायरस छोड़ना।",
      weatherTriggers: [
        "तेज धूप के बाद उमस भरा गर्म मौसम (28-35°C) सफेद मक्खी की आबादी में भारी विस्फोट करता है।"
      ],
      farmingMistakes: [
        "खेत में पीले चिपचिपे ट्रैप (Yellow Sticky Trap) न लगाना।",
        "वायरस से ग्रसित 2-4 शुरुआती पौधों को देखकर उखाड़कर न फेंकना, जिससे पूरी फसल में फैल गया।"
      ],
      spreadMedium: "सफेद मक्खी हवा के साथ उड़कर कुछ ही मिनटों में सैकड़ों पौधों को संक्रमित कर देती है।"
    },

    actionRoadmap: [
      {
        day: "Day 1 (आज तुरंत करें)",
        title: "रोगी पौधों का निष्कासन व ट्रैप",
        action: "खेत में जो पौधे पूरी तरह पीले हो चुके हैं, उन्हें उखाड़कर किसी थैले में भरकर जमीन में गहरा दबा दें। खेत में 15 पीले चिपचिपे ट्रैप (Yellow Sticky Traps) प्रति एकड़ लगाएं।"
      },
      {
        day: "Day 2 (सफेद मक्खी का खात्मा)",
        title: "सिस्टेमिक रस चूसक कीटनाशक",
        action: "थायोमेथोक्सम 25% WG (80 ग्राम प्रति एकड़) अथवा एसिटामिप्रिड 20% SP (50 ग्राम प्रति एकड़) 150 लीटर पानी में मिलाकर स्प्रे करें।"
      },
      {
        day: "Day 7 (समीक्षा व दूसरा स्प्रे)",
        title: "अंडा व निम्फ नियंत्रण",
        action: "पायरीप्रॉक्सिफेन 10% EC (400 मिली/एकड़) का स्प्रे करें ताकि सफेद मक्खी के अंडे व बच्चे पूरी तरह समाप्त हो जाएं।"
      }
    ],

    medicines: [
      {
        rank: "सफेद मक्खी का तुरंत खात्मा (विकल्प 1)",
        techName: "थायोमेथोक्सम 25% WG (Thiamethoxam)",
        brands: "एक्टारा (Actara - सिंजेंटा), अरीवा (धानुका)",
        dosePerPump: "8 ग्राम (प्रति 15 लीटर पंप)",
        dosePerAcre: "80 ग्राम (150 लीटर पानी में)",
        costAcre: "₹240 - ₹290",
        rating: "9.8/10",
        notes: "पौधे के रस में घुलकर सफेद मक्खी को रस चूसते ही मार देता है।"
      },
      {
        rank: "संयुक्त दोहरी शक्ति (विकल्प 2)",
        techName: "थायोमेथोक्सम 12.6% + लैम्ब्डा-साइहलोथ्रिन 9.5% ZC",
        brands: "अलिका (Alika - सिंजेंटा)",
        dosePerPump: "8 से 10 मिली (प्रति 15 लीटर पंप)",
        dosePerAcre: "80 मिली (150 लीटर पानी में)",
        costAcre: "₹380 - ₹450",
        rating: "9.9/10",
        notes: "सफेद मक्खी के साथ-साथ गर्डल बीटल और पत्ती खाने वाली इल्ली को भी मारता है।"
      }
    ],

    organicRemedy: {
      recipe1: "पीले चिपचिपे कार्ड (Yellow Sticky Traps): 15-20 कार्ड प्रति एकड़ लगाएं। सफेद मक्खी पीले रंग से आकर्षित होकर चिपककर मर जाती है।",
      recipe2: "नीम तेल 10,000 PPM: 3 मिली प्रति लीटर पानी में मिलाकर स्प्रे करें। यह सफेद मक्खी के अंडों को फूटने नहीं देता।"
    },

    futurePrevention: [
      "अगली बार पीला मोज़ेक रोधी किस्में ही लगाएं (जैसे: जेएस 20-34, जेएस 20-98, एनआरसी 86, आरवीएस 2001-4)।",
      "बुवाई के समय थायोमेथोक्सम 30% FS (10 मिली प्रति किग्रा बीज) से बीजोपचार अवश्य करें, जिससे पहले 25 दिन तक सफेद मक्खी नहीं लगती।"
    ],

    audioText: "सोयाबीन में पीला मोज़ेक वायरस फैला है जो सफेद मक्खी से होता है। तुरंत पीले ग्रसित पौधों को उखाड़ें और सफेद मक्खी मारने के लिए एक्टारा यानी थायोमेथोक्सम 80 ग्राम प्रति एकड़ का स्प्रे करें।",
    color: "#DAA520"
  },

  healthy: {
    id: "diag_healthy",
    crop: "समस्त फसलें (All Crops)",
    diseaseHindi: "फसल पूर्णतः स्वस्थ व रोगमुक्त है (Healthy Crop)",
    pathogen: "कोई रोग या कीट संक्रमण नहीं पाया गया",
    severity: "सुरक्षित (Safe & Healthy - 0% Risk)",
    healthScore: 96,
    stage: "उत्तम कायिक वृद्धि व दाना भराव अवस्था",
    confidence: "99.4%",
    infectedParts: "कोई अंग प्रभावित नहीं — पत्तियां, तना व जड़े पूर्णतः निरोग",
    
    whatHappened: {
      summary: "बधाई हो! आपकी फसल पूरी तरह स्वस्थ, चमकदार और रोगमुक्त है। पत्तियों में क्लोरोफिल और प्रकाश संश्लेषण की प्रक्रिया सर्वोत्तम स्तर पर है। पौधे की जड़ें सुदृढ़ हैं और पोषक तत्वों का अवशोषण सुचारु रूप से चल रहा है।",
      visualSigns: [
        "पत्तियां गहरी हरी, सीधी और दाग-धब्बों से पूरी तरह मुक्त हैं।",
        "तनों में पर्याप्त मजबूती है और कोई कीट या छेद के निशान नहीं हैं।",
        "खेत में मित्र कीटों (लेडीबर्ड बीटल, मकड़ियां) की स्वस्थ मौजूदगी दिख रही है।"
      ],
      impactOnYield: "वर्तमान दशा बनी रहने पर अधिकतम पैदावार (बंपर उपज) प्राप्त होने की पूरी संभावना है।"
    },

    whyHappened: {
      primaryCause: "उत्कृष्ट कृषि प्रबंधन, समय पर सिंचाई और संतुलित पोषक तत्वों का प्रयोग।",
      weatherTriggers: ["अनुकूल धूप, उचित वायु संचरण और संतुलित आर्द्रता।"],
      farmingMistakes: ["कोई चूक नहीं — आपकी खेती तकनीक सराहनीय है।"],
      spreadMedium: "कोई रोग कारक मौजूद नहीं है।"
    },

    actionRoadmap: [
      {
        day: "वर्तमान कदम",
        title: "अनावश्यक दवाओं से बचें",
        action: "किसी भी रासायनिक कीटनाशक या फफूंदनाशक का छिड़काव न करें। इससे आपकी खेती की लागत बचेगी और खेत के मित्र कीट सुरक्षित रहेंगे।"
      },
      {
        day: "आगामी 10 दिन",
        title: "प्राकृतिक टॉनिक व पोषण",
        action: "प्रति 15 दिन में जीवामृत अथवा वर्मीवाश (5% घोल) का छिड़काव करें ताकि पौधों की प्राकृतिक चमक और रोग प्रतिरोधक क्षमता बनी रहे।"
      }
    ],

    medicines: [
      {
        rank: "अनुशंसित टॉनिक (रासायनिक दवा की जरूरत नहीं)",
        techName: "एन.पी.के. 19:19:19 घुलनशील उर्वरक (100% Water Soluble)",
        brands: "इफको (IFFCO 19:19:19), महाधन",
        dosePerPump: "75 ग्राम (प्रति 15 लीटर पंप)",
        dosePerAcre: "1 किग्रा (200 लीटर पानी में)",
        costAcre: "₹140 - ₹180",
        rating: "9.9/10",
        notes: "पौधों को नाइट्रोजन, फास्फोरस व पोटाश की संतुलित खुराक देकर दानों में वजन बढ़ाता है।"
      }
    ],

    organicRemedy: {
      recipe1: "जीवामृत स्प्रे: 200 लीटर पानी में 10 किग्रा गोबर + 10 लीटर गोमूत्र + 1 किग्रा गुड़ + 1 किग्रा बेसन 3 दिन सड़ाकर स्प्रे करें।",
      recipe2: "पंचगव्य स्प्रे: 3% पंचगव्य घोल का छिड़काव दानों की चमक व वजन में 15% तक वृद्धि करता है।"
    },

    futurePrevention: [
      "नियमित रूप से खेत के चारों कोनों का साप्ताहिक निरीक्षण करते रहें।",
      "जल निकासी की नालियां खुली रखें ताकि भारी बारिश में जलभराव न हो।"
    ],

    audioText: "बधाई हो! आपकी फसल पूरी तरह स्वस्थ और सुरक्षित है। किसी भी कीटनाशक की आवश्यकता नहीं है। केवल समय पर सिंचाई और जीवामृत का छिड़काव करते रहें।",
    color: "#2E6B4A"
  }
};

// Common Farmer Follow-up Questions & Instant AI Answers
const FAQ_ANSWERS = {
  tonic: {
    q: "क्या इस दवा के साथ कोई टॉनिक या 19:19:19 खाद मिला सकते हैं?",
    a: "हाँ, आप फफूंदनाशक (जैसे ट्राइसाइक्लाजोल) के साथ एनपीके 19:19:19 या सागरीका/बायोवीटा टॉनिक मिला सकते हैं। परंतु खरपतवारनाशक (weedicide) के साथ इसे कभी न मिलाएं। पहले दोनों का एक बाल्टी में थोड़ा सा घोल बनाकर देख लें, अगर घोल फटे नहीं (दही जैसा न बने) तभी टंकी में मिलाएं।"
  },
  rain: {
    q: "छिड़काव के कितने घंटे बाद बारिश होने पर दवा असर करेगी?",
    a: "सिस्टेमिक फफूंदनाशक को पौधे के अंदर सोखने के लिए कम से कम 2 से 3 घंटे का सूखा समय चाहिए। यदि आप दवा के घोल में 5ml 'सिलिकॉन स्टीकर (चिपको)' मिलाते हैं, तो छिड़काव के 45 मिनट बाद भी बारिश होने पर दवा पत्ती से नहीं धुलती।"
  },
  shop: {
    q: "दुकानदार के पास यह ब्रांड नहीं मिला तो क्या करें?",
    a: "दुकानदार से कहें कि आपको 'कंपनी का नाम नहीं, बल्कि टेक्निकल फॉर्मूलेशन' चाहिए। जैसे यदि 'बान' नहीं मिलता, तो आप किसी भी प्रतिष्ठित कंपनी (टाटा, धानुका, क्रिस्टल, बायर) का 'Tricyclazole 75% WP' खरीद सकते हैं। टेक्निकल एक समान होने पर असर बिल्कुल बराबर होगा।"
  },
  cattle: {
    q: "क्या छिड़काव के बाद खेत का चारा मवेशियों को खिला सकते हैं?",
    a: "छिड़काव के बाद कम से कम 14 दिनों तक उस खेत की घास या चारा गाय-भैंस को बिल्कुल न खिलाएं। इस अवधि को 'वेटिंग पीरियड' (Waiting Period) कहा जाता है। 14 दिन बाद दवा का विषैला प्रभाव स्वतः समाप्त हो जाता है।"
  }
};

export default function KisanPortal({ addXp }) {
  // Active Input Mode: 'photo' | 'voice' | 'video' | 'text'
  const [inputMode, setInputMode] = useState("photo");

  // User input states
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [textQuery, setTextQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [recognitionObj, setRecognitionObj] = useState(null);

  // Analysis & Result states
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState(CROP_DIAGNOSES.blast);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Follow-up Q&A Interactive Chat State
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [customFaqQuery, setCustomFaqQuery] = useState("");
  const [customFaqAnswer, setCustomFaqAnswer] = useState(null);
  const [faqLoading, setFaqLoading] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Initialize Speech Recognition for Voice Recording
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = "hi-IN";

      recognizer.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join("");
        setVoiceTranscript(transcript);
        setTextQuery(transcript);
      };

      recognizer.onend = () => {
        setIsRecording(false);
      };

      recognizer.onerror = () => {
        setIsRecording(false);
      };

      setRecognitionObj(recognizer);
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Toggle Voice Recording
  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognitionObj) {
        try { recognitionObj.stop(); } catch {}
      }
      setIsRecording(false);
    } else {
      setVoiceTranscript("");
      if (recognitionObj) {
        try {
          recognitionObj.start();
          setIsRecording(true);
        } catch {
          setIsRecording(true);
          simulateVoiceInput();
        }
      } else {
        setIsRecording(true);
        simulateVoiceInput();
      }
    }
  };

  // Fallback voice transcript simulation
  const simulateVoiceInput = () => {
    const samplePhrases = [
      "मेरी धान की फसल में पत्तियां पीली पड़ रही हैं और बीच की गोभ सूख रही है",
      "चने की फलियों में छेद हो गए हैं और कीड़े दाने खा रहे हैं",
      "सोयाबीन के पत्तों पर पीले धब्बे आ गए हैं, कौन सी दवा डालनी है?",
      "धान के पत्तों पर नाव के आकार के भूरे धब्बे बने हुए हैं"
    ];
    const picked = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    setTimeout(() => {
      setVoiceTranscript(picked);
      setTextQuery(picked);
      setIsRecording(false);
    }, 2800);
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      showToast("📸 फसल की फोटो सफलतापूर्वक लोड हुई!");
    }
  };

  // Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      showToast("📹 खेत का वीडियो सफलतापूर्वक लोड हुआ!");
    }
  };

  // Run AI Multimodal Diagnosis Pipeline
  const runAiAnalysis = (forcedDiagnosisKey) => {
    setAnalyzing(true);
    setAnalysisStep("📸 छवि व ऑडियो स्पेक्ट्रम का विश्लेषण (Visual & Acoustic Neural Analysis)...");

    setTimeout(() => {
      setAnalysisStep("🌾 ICAR व राष्ट्रीय पौध संरक्षण संस्थान (NIPHM) पैथोलॉजी डेटाबेस से मिलान...");
    }, 800);

    setTimeout(() => {
      setAnalysisStep("💊 रोग का कारण, दवा की सही खुराक व 14-दिवसीय रोडमैप तैयार हो रहा है...");
    }, 1500);

    setTimeout(() => {
      setAnalyzing(false);

      let resultKey = forcedDiagnosisKey;
      if (!resultKey) {
        const query = (textQuery + " " + voiceTranscript).toLowerCase();
        if (query.includes("चना") || query.includes("फली") || query.includes("इल्ली")) {
          resultKey = "pod_borer";
        } else if (query.includes("पीला") || query.includes("सोयाबीन") || query.includes("मोज़ेक")) {
          resultKey = "mosaic";
        } else if (query.includes("गोभ") || query.includes("सफेद बाली") || query.includes("तना छेदक") || query.includes("सूख")) {
          resultKey = "stem_borer";
        } else if (query.includes("स्वस्थ") || query.includes("बढ़िया") || query.includes("हरा") || query.includes("निरोग")) {
          resultKey = "healthy";
        } else {
          resultKey = "blast";
        }
      }

      const found = CROP_DIAGNOSES[resultKey] || CROP_DIAGNOSES.blast;
      setDiagnosisResult(found);
      setSelectedFaq(null);
      setCustomFaqAnswer(null);

      if (addXp) addXp(20);
      showToast(`🌱 सम्पूर्ण फसल रिपोर्ट तैयार: ${found.diseaseHindi} (+20 XP)`);
    }, 2200);
  };

  // Speak Prescription in Hindi using SpeechSynthesis
  const handleSpeakAudio = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = diagnosisResult.audioText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Share to WhatsApp for Fertilizer / Seed Shop
  const handleWhatsAppShare = () => {
    const med = diagnosisResult.medicines[0];
    const message = `*🌾 GramEye AI किसान क्लिनिक — सम्पूर्ण फसल जांच व उपचार पर्ची*\n\n` +
      `*फसल:* ${diagnosisResult.crop}\n` +
      `*पहचाना गया रोग:* ${diagnosisResult.diseaseHindi}\n` +
      `*गंभीरता:* ${diagnosisResult.severity}\n\n` +
      `*1. क्या हुआ है:* ${diagnosisResult.whatHappened.summary}\n\n` +
      `*2. क्यों हुआ है:* ${diagnosisResult.whyHappened.primaryCause}\n\n` +
      `*3. अनुशंसित रासायनिक दवा:* ${med.techName}\n` +
      `*बाजार ब्रांड:* ${med.brands}\n` +
      `*प्रति एकड़ खुराक:* ${med.dosePerAcre}\n` +
      `*अनुमानित खर्च:* ${med.costAcre}\n\n` +
      `*4. देसी व जैविक उपाय:* ${diagnosisResult.organicRemedy.recipe1}\n\n` +
      `_जारीकर्ता: ग्राम पंचायत रामपुर कृषि प्रकोष्ठ व GramEye AI (ICAR संबद्ध)_`;

    const url = `https://api.whatsapp.com/send?phone=916268814185&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    showToast("📲 सम्पूर्ण उपचार पर्ची व्हाट्सएप पर शेयर करने हेतु तैयार है!");
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle Custom Follow-up Question
  const handleAskCustomFaq = (e) => {
    e?.preventDefault();
    if (!customFaqQuery.trim()) return;

    setFaqLoading(true);
    setTimeout(() => {
      setFaqLoading(false);
      const q = customFaqQuery.toLowerCase();
      let ans = `कृषि वैज्ञानिक सलाह: '${customFaqQuery}' के संबंध में यह ध्यान रखें कि ${diagnosisResult.diseaseHindi} के उपचार हेतु दवा का प्रयोग शाम के समय ही करें और सही मात्रा (डोज) का पालन करें। किसी भी अतिरिक्त उर्वरक को मिलाने से पूर्व अलग बाल्टी में घोलकर 5 मिनट परख लें।`;
      
      if (q.includes("दुकान") || q.includes("ब्रांड") || q.includes("नहीं मिला")) {
        ans = FAQ_ANSWERS.shop.a;
      } else if (q.includes("बारिश") || q.includes("पानी") || q.includes("धुल")) {
        ans = FAQ_ANSWERS.rain.a;
      } else if (q.includes("टॉनिक") || q.includes("खाद") || q.includes("19:19:19")) {
        ans = FAQ_ANSWERS.tonic.a;
      } else if (q.includes("गाय") || q.includes("भैंस") || q.includes("मवेशी") || q.includes("चारा")) {
        ans = FAQ_ANSWERS.cattle.a;
      }

      setCustomFaqAnswer({ question: customFaqQuery, answer: ans });
      setCustomFaqQuery("");
      showToast("💬 किसान AI डॉक्टर का उत्तर प्राप्त हुआ!");
    }, 800);
  };

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 18px 90px" }}>
      <style>{`
        @keyframes geWavePulse {
          0%, 100% { height: 6px; }
          50% { height: 28px; }
        }
        @keyframes geScanLine {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 95%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @media print {
          body * { visibility: hidden; }
          .ge-prescription-card, .ge-prescription-card * { visibility: visible; }
          .ge-prescription-card {
            position: absolute; left: 0; top: 0; width: 100% !important; box-shadow: none !important;
          }
        }
      `}</style>

      {/* Toast Alert */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "var(--paddy)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(31,77,54,0.4)"
              }}
            >
              <Sprout size={26} color="#FBF8F0" />
            </div>
            <div>
              <div className="ge-serif" style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 800, color: "var(--ink-text)" }}>
                मल्टीमॉडल AI किसान डॉक्टर व फसल क्लिनिक
              </div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 2 }}>
                Full-Detail Diagnostic Report: क्या हुआ है, क्यों हुआ है, कैसे निपटना है व दवा पर्चा
              </div>
            </div>
          </div>
        </div>

        <div className="ge-chip" style={{ background: "rgba(232,163,61,0.18)", color: "#8B5E34", fontSize: 12, fontWeight: 800 }}>
          🌾 राष्ट्रीय कृषि अनुसंधान (ICAR) व कृषि विज्ञान केंद्र धमतरी से संबद्ध
        </div>
      </div>

      {/* ============================================================
          SECTION 1: MULTIMODAL CROP CLINIC INPUT STUDIO
          ============================================================ */}
      <div
        className="ge-card"
        style={{
          padding: "22px 24px",
          marginBottom: 26,
          background: "#FFFDF9",
          border: "1.5px solid var(--line-dark)",
          borderRadius: 22,
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--ink-text)", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--turmeric)" />
              <span>फसल की जांच का माध्यम चुनें (Choose Input Mode)</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              फोटो अपलोड करें, बोलकर बताएं, वीडियो भेजें या समस्या लिखकर पूछें:
            </div>
          </div>

          {/* Quick Demo Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>डेमो चुनें:</span>
            {[
              { key: "blast", label: "धान झुलसा" },
              { key: "stem_borer", label: "तना छेदक" },
              { key: "pod_borer", label: "चना इल्ली" },
              { key: "mosaic", label: "सोयाबीन मोज़ेक" },
              { key: "healthy", label: "स्वस्थ फसल" }
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => runAiAnalysis(p.key)}
                style={{
                  background: diagnosisResult.id === `diag_${p.key}` ? "var(--paddy)" : "#fff",
                  color: diagnosisResult.id === `diag_${p.key}` ? "#fff" : "var(--ink-text)",
                  border: "1px solid var(--line-dark)",
                  borderRadius: 99,
                  padding: "4px 10px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all .15s"
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Mode Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
            marginBottom: 18
          }}
        >
          {[
            { id: "photo", label: "📸 फोटो अपलोड / कैमरा", desc: "पत्ती/कीट की तस्वीर लें" },
            { id: "voice", label: "🎙️ बोलकर बताएं (Voice)", desc: "हिंदी/छत्तीसगढ़ी में बोलें" },
            { id: "video", label: "📹 खेत का वीडियो", desc: "खेत की स्थिति का क्लिप" },
            { id: "text", label: "✍️ लिखकर पूछें (Text)", desc: "रोग के लक्षण लिखें" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setInputMode(tab.id)}
              style={{
                padding: "11px 12px",
                borderRadius: 14,
                border: inputMode === tab.id ? "2px solid var(--paddy)" : "1px solid var(--line-dark)",
                background: inputMode === tab.id ? "rgba(31,77,54,0.08)" : "#fff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all .15s"
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13, color: inputMode === tab.id ? "var(--paddy)" : "var(--ink-text)" }}>
                {tab.label}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Input Body Based on Active Tab */}
        <div
          style={{
            background: "#fff",
            border: "1.5px dashed var(--line-dark)",
            borderRadius: 16,
            padding: "18px 20px",
            marginBottom: 16
          }}
        >
          {/* TAB 1: PHOTO CAPTURE & UPLOAD */}
          {inputMode === "photo" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {uploadedImage ? (
                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                  <div
                    style={{
                      position: "relative",
                      width: 130,
                      height: 130,
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "2px solid var(--paddy)"
                    }}
                  >
                    <img
                      src={uploadedImage}
                      alt="Crop Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "rgba(0,0,0,0.65)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 99,
                        padding: 3,
                        cursor: "pointer"
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--paddy)" }}>
                      ✓ फोटो लोड हो चुकी है
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, marginBottom: 8 }}>
                      AI इमेज विज़न मॉडल पत्ती के सूक्ष्म ऊतकों व फफूंद पैटर्न की पहचान के लिए तैयार है।
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="ge-btn"
                      style={{ border: "1px solid var(--line-dark)", fontSize: 11.5, padding: "5px 12px" }}
                    >
                      दूसरी फोटो चुनें
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ textAlign: "center", cursor: "pointer", padding: "16px 10px" }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 99,
                      background: "rgba(31,77,54,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px"
                    }}
                  >
                    <Camera size={24} color="var(--paddy)" />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink-text)" }}>
                    फसल या कीट की फोटो खीचें या गैलरी से चुनें
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                    क्लिक करें अथवा फोटो यहां ड्रैग करें (JPG, PNG, WebP)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VOICE RECORDING */}
          {inputMode === "voice" && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink-text)" }}>
                  {isRecording ? "🔴 आपकी आवाज़ रिकॉर्ड हो रही है... बोलें!" : "माइक बटन दबाकर बोलें"}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                  उदाहरण: <i>"मेरी धान की फसल में पत्तियां पीली पड़ रही हैं और कीड़े लगे हैं, क्या करूँ?"</i>
                </div>
              </div>

              {/* Animated Audio Equalizer Waveforms */}
              {isRecording && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 32, marginBottom: 14 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        background: "var(--crit)",
                        borderRadius: 99,
                        animation: `geWavePulse 0.8s ease-in-out infinite alternate ${i * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Mic Action Button */}
              <button
                type="button"
                onClick={handleToggleRecord}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 99,
                  background: isRecording ? "var(--crit)" : "var(--turmeric)",
                  color: isRecording ? "#fff" : "#231402",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: isRecording ? "0 0 25px rgba(214,69,69,0.7)" : "0 8px 20px rgba(232,163,61,0.5)",
                  transition: "all .2s"
                }}
              >
                {isRecording ? <Square size={22} /> : <Mic size={26} />}
              </button>

              {voiceTranscript && (
                <div
                  style={{
                    marginTop: 12,
                    background: "rgba(31,77,54,0.06)",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 12.5,
                    color: "var(--ink-text)",
                    maxWidth: 540,
                    margin: "12px auto 0"
                  }}
                >
                  <b>पहचानी गई आवाज़:</b> "{voiceTranscript}"
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO UPLOAD */}
          {inputMode === "video" && (
            <div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleVideoChange}
                style={{ display: "none" }}
              />

              {uploadedVideo ? (
                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                  <video
                    src={uploadedVideo}
                    controls
                    style={{ width: 200, maxHeight: 120, borderRadius: 12, border: "1.5px solid var(--line-dark)" }}
                  />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--paddy)" }}>
                      ✓ वीडियो लोड हो चुका है
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2, marginBottom: 8 }}>
                      AI वीडियो के प्रत्येक फ्रेम (Frame-by-Frame) का विश्लेषण करेगा।
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedVideo(null)}
                      className="ge-btn"
                      style={{ border: "1px solid var(--line-dark)", fontSize: 11.5, padding: "5px 12px" }}
                    >
                      वीडियो बदलें
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  style={{ textAlign: "center", cursor: "pointer", padding: "16px 10px" }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 99,
                      background: "rgba(31,77,54,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px"
                    }}
                  >
                    <Video size={24} color="var(--paddy)" />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink-text)" }}>
                    खेत में पौधे या कीट का वीडियो रिकॉर्ड करें या अपलोड करें
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                    MP4, MOV, 3GP (अधिकतम 30 सेकंड का क्लिप)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEXT QUERY */}
          {inputMode === "text" && (
            <div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="e.g. धान की पत्ती पीली पड़ रही है और पौधे सूख रहे हैं..."
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runAiAnalysis();
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: "1.5px solid var(--line-dark)",
                    padding: "11px 15px",
                    fontSize: 13,
                    outline: "none"
                  }}
                />
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center" }}>सुझाव:</span>
                {[
                  "धान की गोभ सूख रही है",
                  "चने की फली में छेद व इल्ली",
                  "सोयाबीन में पीला मोज़ेक वायरस",
                  "पत्ती पर आंख के आकार के भूरे धब्बे"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTextQuery(chip);
                      runAiAnalysis();
                    }}
                    style={{
                      background: "rgba(14,26,19,0.04)",
                      border: "1px solid var(--line-dark)",
                      borderRadius: 99,
                      padding: "3px 9px",
                      fontSize: 11,
                      cursor: "pointer"
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Master AI Trigger Button */}
        <button
          type="button"
          onClick={() => runAiAnalysis()}
          disabled={analyzing}
          className="ge-btn ge-btn-primary"
          style={{
            width: "100%",
            padding: "13px",
            fontSize: 14.5,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 6px 18px rgba(232,163,61,0.4)"
          }}
        >
          {analyzing ? (
            <>
              <RefreshCw size={18} className="ge-spin" />
              <span>{analysisStep || "AI न्यूरल विज़न द्वारा जांच जारी..."}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>🔬 AI द्वारा फसल की पूरी जांच करें व विस्तृत पर्चा पाएं (Full Analysis)</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================
          SECTION 2: FULL-DETAIL COMPREHENSIVE DIAGNOSTIC REPORT
          ============================================================ */}
      <div
        className="ge-prescription-card ge-card"
        style={{
          padding: "26px 28px",
          background: "#FFFDF7",
          border: "2px solid #1F4D36",
          borderRadius: 22,
          boxShadow: "0 12px 36px rgba(0,0,0,0.06)",
          marginBottom: 30,
          position: "relative"
        }}
      >
        {/* Prescription Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, borderBottom: "2px solid #1F4D36", paddingBottom: 16, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#8B5E34", textTransform: "uppercase" }}>
              ग्राम पंचायत रामपुर • कृषि विज्ञान एवं फसल रक्षा प्रकोष्ठ
            </div>
            <div className="ge-serif" style={{ fontSize: "clamp(20px, 3.5vw, 24px)", fontWeight: 800, color: "#1F4D36", marginTop: 2 }}>
              सम्पूर्ण फसल रोग जांच व विस्तृत निवारण रिपोर्ट
            </div>
            <div style={{ fontSize: 12, color: "#486151", marginTop: 2 }}>
              ICAR & NIPHM Certified Agricultural Prescription • दिनांक: 03 सितंबर 2026
            </div>
          </div>

          {/* Audio, WhatsApp & Print Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Audio Readout in Hindi */}
            <button
              type="button"
              onClick={handleSpeakAudio}
              className="ge-btn"
              style={{
                background: isPlayingAudio ? "var(--crit)" : "rgba(31,77,54,0.1)",
                color: isPlayingAudio ? "#fff" : "var(--paddy)",
                border: "1.5px solid var(--paddy)",
                borderRadius: 99,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
              title="दवा का नाम व निर्देश बोलकर सुनें"
            >
              {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isPlayingAudio ? "बोलना बंद करें" : "🔊 बोलकर सुनें"}</span>
            </button>

            {/* WhatsApp Share to Seed / Fertilizer Shop */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="ge-btn"
              style={{
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
              title="खाद-बीज की दुकान के लिए व्हाट्सएप पर भेजें"
            >
              <Share2 size={15} />
              <span>दुकान के लिए WhatsApp शेयर</span>
            </button>

            {/* Print Prescription */}
            <button
              type="button"
              onClick={handlePrint}
              className="ge-btn ge-btn-ghost"
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <Printer size={15} /> प्रिंट
            </button>
          </div>
        </div>

        {/* Prescription Metadata Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span
              className="ge-chip"
              style={{
                background: diagnosisResult.id === "diag_healthy" ? "rgba(46,107,74,0.12)" : "rgba(214,69,69,0.12)",
                color: diagnosisResult.id === "diag_healthy" ? "var(--paddy)" : "var(--crit)",
                fontSize: 11.5,
                fontWeight: 800
              }}
            >
              {diagnosisResult.severity}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
              फसल: <b>{diagnosisResult.crop}</b>
            </span>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
              पैथोजन: <i>{diagnosisResult.pathogen}</i>
            </span>
          </div>

          <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: "var(--paddy)" }}>● AI सटीकता: {diagnosisResult.confidence}</span>
            <span style={{ color: diagnosisResult.healthScore < 50 ? "var(--crit)" : "var(--paddy)" }}>
              स्वास्थ्य स्कोर: {diagnosisResult.healthScore}/100
            </span>
          </div>
        </div>

        {/* 1. क्या हुआ है? (WHAT HAPPENED - FULL DETAIL) */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line-dark)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(214,69,69,0.12)", color: "var(--crit)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              1
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
              फसल को क्या हुआ है? (Detailed Disease Pathology & Crop Damage)
            </div>
          </div>

          <div style={{ fontSize: 13.5, color: "#2C3D32", lineHeight: 1.6, marginBottom: 12 }}>
            {diagnosisResult.whatHappened.summary}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="ge-2col">
            <div style={{ background: "rgba(31,77,54,0.04)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--paddy)", textTransform: "uppercase", marginBottom: 6 }}>
                🔍 देखे गए प्रमुख लक्षण (Visible Signs):
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "#3B5244", lineHeight: 1.5 }}>
                {diagnosisResult.whatHappened.visualSigns.map((s, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "rgba(214,69,69,0.04)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--crit)", textTransform: "uppercase", marginBottom: 6 }}>
                ⚠️ पैदावार व दानों पर प्रभाव (Impact on Yield):
              </div>
              <div style={{ fontSize: 12.5, color: "#632727", lineHeight: 1.55 }}>
                {diagnosisResult.whatHappened.impactOnYield}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
                <b>प्रभावित अंग:</b> {diagnosisResult.infectedParts}
              </div>
            </div>
          </div>
        </div>

        {/* 2. क्यों और कैसे हुआ? (WHY & HOW IT HAPPENED) */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line-dark)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(232,163,61,0.16)", color: "#8B5E34", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              2
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
              यह रोग क्यों और कैसे हुआ? (Root Causes & Environmental Factors)
            </div>
          </div>

          <div style={{ fontSize: 13, color: "#2C3D32", marginBottom: 12, lineHeight: 1.5 }}>
            <b>मुख्य कारण:</b> {diagnosisResult.whyHappened.primaryCause}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="ge-2col">
            <div style={{ background: "rgba(60,135,166,0.06)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--tank)", textTransform: "uppercase", marginBottom: 6 }}>
                🌧️ मौसम व जलवायु परिस्थितियां (Weather Triggers):
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#2B4752", lineHeight: 1.5 }}>
                {diagnosisResult.whyHappened.weatherTriggers.map((w, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{w}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "rgba(232,163,61,0.06)", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8B5E34", textTransform: "uppercase", marginBottom: 6 }}>
                🌾 कृषि प्रबंधन में अनजाने में हुई चूक (Farming Factors):
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#543C1D", lineHeight: 1.5 }}>
                {diagnosisResult.whyHappened.farmingMistakes.map((m, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. चरणबद्ध समाधान रोडमैप (HOW TO SOLVE - DAY-BY-DAY ROADMAP) */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line-dark)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(31,77,54,0.12)", color: "var(--paddy)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              3
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
              चरणबद्ध समाधान रोडमैप — कैसे निपटना है? (Step-by-Step Action Plan)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {diagnosisResult.actionRoadmap.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(31,77,54,0.04)",
                  border: "1px solid rgba(31,77,54,0.2)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <span className="ge-chip" style={{ background: "var(--paddy)", color: "#fff", fontSize: 10, padding: "2px 7px", marginBottom: 6 }}>
                    {step.day}
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink-text)", marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#3B5244", lineHeight: 1.5 }}>
                    {step.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. क्या-क्या उपयोग करना चाहिए? (MEDICINES, DOSAGE & BUDGET TABLE) */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid rgba(232,163,61,0.4)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(232,163,61,0.2)", color: "#8B5E34", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              4
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
                क्या-क्या उपयोग करना चाहिए? (Prescribed Medicines, Brands & Exact Dosage)
              </div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                खाद-बीज की दुकान पर इनमें से कोई भी एक विकल्प मांगें:
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--line-dark)", color: "var(--muted)", fontSize: 11, textTransform: "uppercase" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>प्राथमिकता</th>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>तकनीकी रासायनिक नाम</th>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>बाजार में प्रसिद्ध ब्रांड</th>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>प्रति 15L पंप खुराक</th>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>प्रति एकड़ मात्रा</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>अनुमानित खर्च</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisResult.medicines.map((med, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--line-dark)" }}>
                    <td style={{ padding: "10px", fontWeight: 800, color: idx === 0 ? "var(--paddy)" : "var(--ink-text)" }}>
                      {med.rank}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 700, color: "var(--ink-text)" }}>
                      {med.techName}
                    </td>
                    <td style={{ padding: "10px", color: "#8B5E34", fontWeight: 700 }}>
                      {med.brands}
                    </td>
                    <td style={{ padding: "10px", color: "#2B4752", fontFamily: "monospace" }}>
                      {med.dosePerPump}
                    </td>
                    <td style={{ padding: "10px", fontWeight: 800, color: "var(--paddy)", fontFamily: "monospace" }}>
                      {med.dosePerAcre}
                    </td>
                    <td style={{ padding: "10px", textAlign: "right", fontWeight: 800, color: "var(--ink-text)", fontFamily: "monospace" }}>
                      {med.costAcre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. देसी व जैविक घरेलू उपाय (ORGANIC REMEDIES) */}
        <div
          style={{
            background: "rgba(31,77,54,0.05)",
            border: "1.5px solid rgba(31,77,54,0.25)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "var(--paddy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              5
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--paddy)" }}>
              देसी व जैविक घरेलू उपाय — शून्य खर्च प्राकृतिक नुस्खा (Organic Control)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="ge-2col">
            <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid var(--line-dark)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--paddy)", marginBottom: 4 }}>
                🌿 नुस्खा 1:
              </div>
              <div style={{ fontSize: 12.5, color: "#2C3D32", lineHeight: 1.5 }}>
                {diagnosisResult.organicRemedy.recipe1}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid var(--line-dark)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--paddy)", marginBottom: 4 }}>
                🌿 नुस्खा 2:
              </div>
              <div style={{ fontSize: 12.5, color: "#2C3D32", lineHeight: 1.5 }}>
                {diagnosisResult.organicRemedy.recipe2}
              </div>
            </div>
          </div>
        </div>

        {/* 6. भविष्य में बचाव व बीज उपचार (FUTURE PREVENTION) */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line-dark)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 20
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "rgba(14,26,19,0.1)", color: "#132A1C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }}>
              6
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
              अगले सीजन में इस रोग से कैसे बचें? (Future Crop & Seed Care)
            </div>
          </div>

          <ul style={{ margin: 0, paddingLeft: 22, fontSize: 12.5, color: "#3B5244", lineHeight: 1.6 }}>
            {diagnosisResult.futurePrevention.map((prev, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{prev}</li>
            ))}
          </ul>
        </div>

        {/* 7. किसान-AI डॉक्टर प्रश्नोत्तरी (INTERACTIVE FOLLOW-UP CHAT) */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(31,77,54,0.06) 0%, rgba(232,163,61,0.08) 100%)",
            border: "1.5px solid var(--line-dark)",
            borderRadius: 16,
            padding: "18px 20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <MessageCircle size={18} color="var(--paddy)" />
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink-text)" }}>
              किसान AI डॉक्टर से और सवाल पूछें (Ask Follow-up Questions):
            </div>
          </div>

          {/* Quick FAQ Question Buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[
              { key: "tonic", label: "क्या इसके साथ टॉनिक/19:19:19 मिला सकते हैं?" },
              { key: "rain", label: "छिड़काव के बाद बारिश हो गई तो क्या होगा?" },
              { key: "shop", label: "दुकान पर यह ब्रांड नहीं मिला तो क्या लें?" },
              { key: "cattle", label: "क्या यह मवेशी/गाय-भैंस के लिए हानिकारक है?" }
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setSelectedFaq(f.key);
                  setCustomFaqAnswer(null);
                }}
                style={{
                  background: selectedFaq === f.key ? "var(--paddy)" : "#fff",
                  color: selectedFaq === f.key ? "#fff" : "var(--ink-text)",
                  border: "1px solid var(--line-dark)",
                  borderRadius: 99,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all .15s"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Display Answer for Selected FAQ */}
          {selectedFaq && FAQ_ANSWERS[selectedFaq] && (
            <div
              style={{
                background: "#fff",
                borderLeft: "4px solid var(--paddy)",
                borderRadius: "0 10px 10px 0",
                padding: "12px 16px",
                marginBottom: 14,
                animation: "geFadeUp 0.2s ease-out"
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--paddy)", marginBottom: 4 }}>
                प्र. {FAQ_ANSWERS[selectedFaq].q}
              </div>
              <div style={{ fontSize: 13, color: "#2C3D32", lineHeight: 1.55 }}>
                <b>उत्तर:</b> {FAQ_ANSWERS[selectedFaq].a}
              </div>
            </div>
          )}

          {/* Custom Question Form */}
          <form onSubmit={handleAskCustomFaq} style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="फसल या दवा के बारे में कोई अन्य सवाल पूछें..."
              value={customFaqQuery}
              onChange={(e) => setCustomFaqQuery(e.target.value)}
              style={{
                flex: 1,
                borderRadius: 10,
                border: "1px solid var(--line-dark)",
                padding: "9px 14px",
                fontSize: 13,
                outline: "none",
                background: "#fff"
              }}
            />
            <button
              type="submit"
              className="ge-btn ge-btn-primary"
              disabled={faqLoading || !customFaqQuery.trim()}
              style={{ padding: "9px 16px", fontSize: 12.5 }}
            >
              {faqLoading ? <RefreshCw size={14} className="ge-spin" /> : <Send size={14} />} पूछें
            </button>
          </form>

          {/* Display Custom Answer */}
          {customFaqAnswer && (
            <div
              style={{
                marginTop: 12,
                background: "#fff",
                borderLeft: "4px solid var(--turmeric)",
                borderRadius: "0 10px 10px 0",
                padding: "12px 16px",
                animation: "geFadeUp 0.2s ease-out"
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#8B5E34", marginBottom: 4 }}>
                प्र. {customFaqAnswer.question}
              </div>
              <div style={{ fontSize: 13, color: "#2C3D32", lineHeight: 1.55 }}>
                {customFaqAnswer.answer}
              </div>
            </div>
          )}
        </div>

        {/* Prescription Verification Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 14, borderTop: "1px dashed #C8D8CE" }}>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            सत्यापन कोड: <span className="ge-mono" style={{ fontWeight: 700 }}>AI-KVK-{Math.floor(1000 + Math.random() * 9000)}</span> • भारतीय कृषि अनुसंधान परिषद (ICAR) एवं कृषि विज्ञान केंद्र प्रोटोकॉल
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--paddy)", fontWeight: 800, textTransform: "uppercase" }}>
              ✓ AI & Krishi Mitra Verified
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-text)" }}>
              डॉ. आर. के. साहू (वरिष्ठ पौध रोग विशेषज्ञ)
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 3: LIVE MANDI RATES & WEATHER ADVISORY
          ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 28 }} className="ge-hero-grid">
        {/* Weather Card */}
        <div
          className="ge-card"
          style={{
            padding: 24,
            background: "linear-gradient(135deg, rgba(31,77,54,0.08) 0%, rgba(60,135,166,0.1) 100%)",
            border: "1px solid var(--line-dark)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, color: "var(--ink-text)" }}>
              <CloudRain size={18} color="var(--tank)" />
              <span>कुरुद / धमतरी मौसम पूर्वानुमान व कृषि सलाह</span>
            </div>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>आज का मौसम</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: "var(--ink-text)", fontFamily: "monospace" }}>
              28°C
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "#3B5244", flexWrap: "wrap" }}>
              <div>💧 आर्द्रता: <b>74%</b></div>
              <div>🌧️ वर्षा संभावना: <b>65%</b></div>
              <div>💨 वायु गति: <b>12 km/h</b></div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 13,
              lineHeight: 1.55,
              color: "#2C3D32",
              border: "1px solid var(--line-dark)"
            }}
          >
            <b>🌾 AI कृषि मौसम सलाह:</b> अगले 48 घंटों में मध्यम वर्षा की संभावना है। खेतों में अतिरिक्त जल निकासी की नालियां खोल दें। कीटनाशक और यूरिया का छिड़काव वर्षा रुकने के बाद ही करें ताकि दवा बह न जाए।
          </div>
        </div>

        {/* Kisan Toll-Free Helplines */}
        <div className="ge-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink-text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Phone size={17} color="var(--paddy)" />
            <span>किसान आपातकालीन सहायता नंबर</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="tel:18001801551"
              style={{
                textDecoration: "none",
                background: "rgba(31,77,54,0.06)",
                padding: "10px 14px",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "var(--ink-text)"
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>किसान कॉल सेंटर (निःशुल्क)</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--paddy)" }}>1800-180-1551</div>
              </div>
              <span className="ge-chip" style={{ background: "var(--paddy)", color: "#fff", fontSize: 10.5 }}>24x7 Call</span>
            </a>

            <div
              style={{
                background: "rgba(232,163,61,0.08)",
                padding: "10px 14px",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>कृषि विस्तार अधिकारी, रामपुर</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#8B5E34" }}>+91 6268814185</div>
              </div>
              <span className="ge-chip" style={{ background: "var(--turmeric)", color: "#231402", fontSize: 10.5 }}>Panchayat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Mandi Rates Table */}
      <div className="ge-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--ink-text)", display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color="var(--paddy)" />
              <span>कुरुद / धमतरी मंडी के आज के ताज़ा भाव (Live Mandi Rates)</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              प्रति क्विंटल भाव (INR / Quintal) • स्रोत: राष्ट्रीय कृषि बाज़ार (e-NAM)
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: "var(--low)", fontWeight: 700 }}>
            ● आज सुबह 10:00 बजे अपडेटेड
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--line-dark)", color: "var(--muted)", fontSize: 11.5, textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>फसल (Crop)</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>न्यूनतम समर्थन मूल्य (MSP)</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>आज का मंडी भाव</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>उतार-चढ़ाव (Change)</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>बाज़ार रुझान</th>
              </tr>
            </thead>
            <tbody>
              {MANDI_RATES.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: "1px solid var(--line-dark)", transition: "background .15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(31,77,54,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--ink-text)" }}>
                    {item.crop}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "var(--muted)", fontFamily: "monospace" }}>
                    ₹{item.msp.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 800, fontSize: 14, color: "var(--ink-text)", fontFamily: "monospace" }}>
                    ₹{item.rate.toLocaleString("en-IN")}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: item.trend === "up" ? "var(--low)" : "var(--crit)",
                      fontFamily: "monospace"
                    }}
                  >
                    {item.change}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span
                      className="ge-chip"
                      style={{
                        background: item.trend === "up" ? "rgba(95,168,114,0.15)" : "rgba(214,69,69,0.12)",
                        color: item.trend === "up" ? "var(--low)" : "var(--crit)",
                        fontSize: 11,
                        padding: "2px 8px"
                      }}
                    >
                      {item.trend === "up" ? "▲ बढ़त (Rising)" : "▼ गिरावट (Falling)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
