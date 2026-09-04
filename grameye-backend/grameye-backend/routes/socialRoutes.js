const express = require("express");
const router = express.Router();

// Initial seed social data
let POSTS = [
  {
    id: "post-1",
    author: {
      id: "usr-101",
      name: "Tarun Sahu",
      handle: "tarun_dev",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      verified: true,
      badge: "Top Creator"
    },
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80",
    caption: "Building our decentralized village intelligence network with AI vision & IoT sensors! Empowering rural communities through tech 🌾🚀",
    hashtags: ["#AI", "#RuralTech", "#GramEye", "#WebDevelopment", "#Innovation"],
    location: "Kodebod, Chhattisgarh",
    likes: 342,
    likedByMe: false,
    commentsCount: 28,
    comments: [
      { id: "c-1", user: "Priya Sharma", text: "Incredible work! Rural AI is the future.", time: "2h ago", likes: 5 },
      { id: "c-2", user: "Rahul Sahu", text: "Proud to see Kodebod leading rural digitalization!", time: "1h ago", likes: 3 }
    ],
    shares: 45,
    saved: false,
    views: 1840,
    category: "Technology",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "post-2",
    author: {
      id: "usr-102",
      name: "Dr. Sunita Verma",
      handle: "sunita_agro",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      verified: true,
      badge: "Agri Scientist"
    },
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&auto=format&fit=crop&q=80",
    caption: "Mahanadi canal water release schedule is live! Recommend early morning transplantation for Swarna paddy to maximize nitrogen absorption 💧🌾",
    hashtags: ["#Agriculture", "#KisanLife", "#CanalIrrigation", "#DhamtariFarming"],
    location: "Kurud Feeder, Dhamtari",
    likes: 512,
    likedByMe: true,
    commentsCount: 42,
    comments: [
      { id: "c-3", user: "Rameshwar Patel", text: "Very helpful guidance for our panchayat farmers!", time: "3h ago", likes: 8 }
    ],
    shares: 89,
    saved: true,
    views: 2950,
    category: "Agriculture",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "post-3",
    author: {
      id: "usr-103",
      name: "Aman Dewangan",
      handle: "aman_ui",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      verified: false,
      badge: "Rising Creator"
    },
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    caption: "Redesigned the Panchayat Public Ledger dashboard with zero-knowledge cryptographic proofs. Clean typography + dark mode glassmorphism ✨",
    hashtags: ["#UIUX", "#DesignSystem", "#Figma", "#Glassmorphism"],
    location: "Raipur, CG",
    likes: 219,
    likedByMe: false,
    commentsCount: 14,
    comments: [],
    shares: 31,
    saved: false,
    views: 1120,
    category: "Design",
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString()
  }
];

let STORIES = [
  {
    id: "story-1",
    author: { name: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80",
    text: "Deploying Kodebod live sensor dashboard today! 💻🌾",
    time: "2h",
    seen: false
  },
  {
    id: "story-2",
    author: { name: "Dr. Sunita", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    mediaUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&auto=format&fit=crop&q=80",
    text: "Soil testing camp in Ward 3 this Saturday morning 🧪",
    time: "4h",
    seen: false
  },
  {
    id: "story-3",
    author: { name: "Aman D.", handle: "aman_ui", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80",
    text: "New animations live on Coodenest Connect! 🔥",
    time: "6h",
    seen: true
  },
  {
    id: "story-4",
    author: { name: "GramEye", handle: "grameye_official", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80",
    text: "1,870 citizens connected in Kodebod! 🎉",
    time: "8h",
    seen: true
  }
];

let SHORTS = [
  {
    id: "short-1",
    author: { name: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    caption: "How we train AI vision on paddy leaf diseases in real-time! 🌾🤖",
    hashtags: ["#TechShorts", "#AI", "#Agriculture"],
    likes: 1420,
    likedByMe: false,
    comments: 86
  },
  {
    id: "short-2",
    author: { name: "Priya Sharma", handle: "priya_creates", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", verified: true },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41151-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    caption: "Coodenest Connect mobile-first navigation walkthrough! Clean glassmorphism 📱✨",
    hashtags: ["#UIUX", "#MobileApp", "#Design"],
    likes: 980,
    likedByMe: true,
    comments: 42
  }
];

let CHALLENGES = [
  {
    id: "ch-1",
    title: "🌾 Rural AI Innovation Challenge",
    description: "Build an AI solution or workflow addressing water conservation, crop health, or clean energy in village communities.",
    participants: 482,
    deadline: "12 Days left",
    prize: "₹50,000 + Incubation Support",
    tags: ["#AI", "#Rural", "#Sustainability"]
  },
  {
    id: "ch-2",
    title: "🎨 Panchayati Raj UI Redesign",
    description: "Design an accessible, vernacular-first citizen service interface for elderly and first-time smartphone users.",
    participants: 310,
    deadline: "18 Days left",
    prize: "₹25,000 + Internship",
    tags: ["#Design", "#Vernacular", "#Inclusion"]
  }
];

let COLLABORATIONS = [
  {
    id: "collab-1",
    title: "AI Solar Irrigation Automation",
    creator: "Tarun Sahu (@tarun_dev)",
    description: "Looking for an IoT firmware engineer & React Native developer to connect soil moisture sensors with solar pumps.",
    skillsNeeded: ["ESP32 / Arduino", "React Native", "Node.js / MQTT"],
    applicantsCount: 6,
    status: "OPEN"
  },
  {
    id: "collab-2",
    title: "Chhattisgarhi Speech Translation Model",
    creator: "Dr. Sunita Verma (@sunita_agro)",
    description: "Seeking NLP researchers to fine-tune Whisper on local Chhattisgarhi dialects for agricultural advisory bots.",
    skillsNeeded: ["PyTorch / HuggingFace", "Audio Processing", "Hindi/Chhattisgarhi NLP"],
    applicantsCount: 9,
    status: "OPEN"
  }
];

// GET /api/social/feed
router.get("/feed", (req, res) => {
  res.json({ success: true, posts: POSTS, total: POSTS.length });
});

// POST /api/social/posts
router.post("/posts", (req, res) => {
  const { caption, mediaUrl, mediaType = "image", hashtags = [], location = "Kodebod, CG", category = "General" } = req.body;
  const newPost = {
    id: `post-${Date.now()}`,
    author: {
      id: "usr-me",
      name: "Citizen Creator",
      handle: "my_creator",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      verified: false,
      badge: "Rising Creator"
    },
    mediaType,
    mediaUrl: mediaUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80",
    caption: caption || "Exploring new frontiers with Coodenest Connect! 🌾🚀",
    hashtags: hashtags.length ? hashtags : ["#Coodenest", "#Innovation"],
    location,
    likes: 1,
    likedByMe: true,
    commentsCount: 0,
    comments: [],
    shares: 0,
    saved: false,
    views: 12,
    category,
    createdAt: new Date().toISOString()
  };
  POSTS.unshift(newPost);
  res.status(201).json({ success: true, post: newPost });
});

// POST /api/social/posts/:id/like
router.post("/posts/:id/like", (req, res) => {
  const post = POSTS.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });
  post.likedByMe = !post.likedByMe;
  post.likes += post.likedByMe ? 1 : -1;
  res.json({ success: true, likes: post.likes, likedByMe: post.likedByMe });
});

// POST /api/social/posts/:id/comment
router.post("/posts/:id/comment", (req, res) => {
  const post = POSTS.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: "Post not found" });
  const comment = {
    id: `c-${Date.now()}`,
    user: req.body.user || "Citizen",
    text: req.body.text || "",
    time: "Just now",
    likes: 0
  };
  post.comments.push(comment);
  post.commentsCount += 1;
  res.status(201).json({ success: true, comment });
});

// GET /api/social/stories
router.get("/stories", (req, res) => {
  res.json({ success: true, stories: STORIES });
});

// GET /api/social/shorts
router.get("/shorts", (req, res) => {
  res.json({ success: true, shorts: SHORTS });
});

// GET /api/social/challenges
router.get("/challenges", (req, res) => {
  res.json({ success: true, challenges: CHALLENGES });
});

// GET /api/social/collaborations
router.get("/collaborations", (req, res) => {
  res.json({ success: true, collaborations: COLLABORATIONS });
});

// POST /api/social/ai/caption
router.post("/ai/caption", (req, res) => {
  const { topic = "technology", tone = "inspirational" } = req.body;
  const captions = {
    inspirational: "Every line of code and every seed sown transforms tomorrow. Building the future from the grassroots up 🌾✨",
    professional: "Excited to deploy our community-led innovation framework in Kodebod. Scalable, transparent, and built for impact.",
    creative: "Where soil meets silicon: crafting modern solutions under open rural skies 🌻💻",
    minimal: "Grassroots innovation. Code. Connect. Grow. 🌱",
    technical: "Optimized distributed state propagation using lightweight WebSockets & Edge inference for 4G rural latency."
  };
  res.json({
    success: true,
    caption: captions[tone] || captions.inspirational,
    hashtags: ["#CoodenestConnect", "#RuralInnovation", "#GramEye", "#AICommunity"]
  });
});

module.exports = router;
