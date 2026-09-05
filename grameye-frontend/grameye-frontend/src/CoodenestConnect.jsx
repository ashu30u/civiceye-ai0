import React, { useState, useEffect, useRef } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, Sparkles, Send, Image as ImageIcon,
  Video, Compass, Film, MessageSquare, PlusSquare, User, TrendingUp, Trophy,
  Users, CheckCircle2, MoreHorizontal, X, Smile, Search, Filter, Flame,
  Award, Play, Pause, Volume2, VolumeX, Eye, ArrowRight, Check, MapPin,
  Grid, Camera, Edit3, Settings, ExternalLink, Link2, Trash2
} from "lucide-react";

export default function CoodenestConnect({ currentUser, addXp, initialTab = "feed" }) {
  const [activeTab, setActiveTab] = useState(initialTab || "feed");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newCaption, setNewCaption] = useState("");
  const [newHashtags, setNewHashtags] = useState([]);
  const [newLocation, setNewLocation] = useState("Kodebod, CG");
  const [newCategory, setNewCategory] = useState("Technology");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPosts, setSavedPosts] = useState({});
  const [followingState, setFollowingState] = useState({});
  const [toastMsg, setToastMsg] = useState(null);

  // Post Media Upload State
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // "image" | "video"
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // Direct Message State
  const [selectedChat, setSelectedChat] = useState("usr-101");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState({
    "usr-101": [
      { id: "m-1", sender: "them", text: "Hey! Loved your post about rural IoT sensors in Kodebod!", time: "10:15 AM" },
      { id: "m-2", sender: "me", text: "Thank you! We just deployed the soil moisture nodes near the canal.", time: "10:18 AM" },
      { id: "m-3", sender: "them", text: "Would love to collaborate on the dashboard frontend. Check out my collab request!", time: "10:20 AM" }
    ],
    "usr-102": [
      { id: "m-4", sender: "them", text: "The agricultural weather advisory has been updated for Swarna paddy.", time: "Yesterday" }
    ]
  });

  // Shorts active video
  const [activeShortIdx, setActiveShortIdx] = useState(0);
  const [shortPlaying, setShortPlaying] = useState(true);
  const [shortMuted, setShortMuted] = useState(true);

  // Sync initialTab when passed
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Instagram-style Profile State
  const [profileSubTab, setProfileSubTab] = useState("posts"); // "posts" | "reels" | "saved" | "badges"
  const [userBio, setUserBio] = useState(
    "🌾 Village Pioneer & Rural Creator | Kodebod, Dhamtari (C.G.)\n🚀 Building AI & IoT Solutions for Farmers & Gram Panchayat\n🌐 GramEye AI Contributor | 💡 AgTech Innovations"
  );
  const [userWebsite, setUserWebsite] = useState("grameye.ai/@amit_sahu");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.fullName || "Amit Kumar Sahu");
  const [editBio, setEditBio] = useState(
    "🌾 Village Pioneer & Rural Creator | Kodebod, Dhamtari (C.G.)\n🚀 Building AI & IoT Solutions for Farmers & Gram Panchayat\n🌐 GramEye AI Contributor | 💡 AgTech Innovations"
  );
  const [editWard, setEditWard] = useState(currentUser?.ward || "Ward 3");
  const [editAvatar, setEditAvatar] = useState(
    currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  );
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersSearch, setFollowersSearch] = useState("");
  const [followingSearch, setFollowingSearch] = useState("");
  const [selectedPostDetail, setSelectedPostDetail] = useState(null);
  const [detailCommentInput, setDetailCommentInput] = useState("");

  const [postComments, setPostComments] = useState({
    "post-my-janmashtami": [
      { id: "c-1", user: "Dr. Sunita Verma", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", text: "जय श्री कृष्णा! 🙏🌾 बहुत सुंदर पोस्ट।", time: "1h ago" },
      { id: "c-2", user: "Sarpanch Rameshwar Patel", handle: "sarpanch_kodebod", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", text: "सभी ग्रामवासियों को जन्माष्टमी की शुभकामनाएं! 🚩", time: "45m ago" },
      { id: "c-3", user: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", text: "Great work on the portal Amit bhaiya! 🚀", time: "25m ago" }
    ],
    "post-my-iot": [
      { id: "c-4", user: "Priya Sharma", handle: "priya_ui", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", text: "The live sensor telemetry dashboard is working smoothly!", time: "3h ago" }
    ]
  });

  const [followersList, setFollowersList] = useState([
    { id: "f-1", name: "Dr. Sunita Verma", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", role: "Agri Scientist", isFollowing: true },
    { id: "f-2", name: "Sarpanch Rameshwar Patel", handle: "sarpanch_kodebod", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", role: "Panchayat Head", isFollowing: true },
    { id: "f-3", name: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "IoT Firmware Dev", isFollowing: false },
    { id: "f-4", name: "Priya Sharma", handle: "priya_ui", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", role: "UI/UX Architect", isFollowing: true },
    { id: "f-5", name: "Nitin Dewangan", handle: "nitin_ml", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", role: "ML Engineer", isFollowing: false },
    { id: "f-6", name: "Anita Patel", handle: "anita_kisan", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", role: "Farmer Leader", isFollowing: true },
    { id: "f-7", name: "Kisan Vikas Sangh", handle: "kisan_sangh_cg", avatar: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&auto=format&fit=crop&q=80", role: "Farmer Collective", isFollowing: false }
  ]);

  const [followingList, setFollowingList] = useState([
    { id: "fg-1", name: "Dr. Sunita Verma", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", role: "Agri Scientist", isFollowing: true },
    { id: "fg-2", name: "Sarpanch Rameshwar Patel", handle: "sarpanch_kodebod", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", role: "Panchayat Head", isFollowing: true },
    { id: "fg-3", name: "Priya Sharma", handle: "priya_ui", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", role: "UI/UX Architect", isFollowing: true },
    { id: "fg-4", name: "Anita Patel", handle: "anita_kisan", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", role: "Farmer Leader", isFollowing: true }
  ]);

  const [myReels, setMyReels] = useState([
    {
      id: "my-reel-1",
      author: {
        name: currentUser?.fullName || "Amit Kumar Sahu",
        handle: (currentUser?.fullName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
        avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      },
      caption: "Mahanadi canal water release telemetry testing in Kodebod 💧⚡ #GramEye #KisanTech",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4",
      likes: 840,
      views: "2.4K",
      commentsCount: 38
    },
    {
      id: "my-reel-2",
      author: {
        name: currentUser?.fullName || "Amit Kumar Sahu",
        handle: (currentUser?.fullName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
        avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      },
      caption: "Swarna paddy lush green fields in Ward 3 🌾 Drone view! #RuralChhattisgarh",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
      likes: 1250,
      views: "4.1K",
      commentsCount: 62
    },
    {
      id: "my-reel-3",
      author: {
        name: currentUser?.fullName || "Amit Kumar Sahu",
        handle: (currentUser?.fullName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
        avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      },
      caption: "Panchayat solar water pump automated scheduling test ☀️💧 #GreenEnergy",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4",
      likes: 910,
      views: "3.2K",
      commentsCount: 45
    }
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch initial data from backend or fallback seed
  useEffect(() => {
    fetch("/api/social/feed")
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {
        const authorName = currentUser?.fullName || "Amit Kumar Sahu";
        const authorHandle = (currentUser?.fullName || "amit_sahu").toLowerCase().replace(/\s+/g, "_");
        const authorAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

        setPosts([
          {
            id: "post-my-janmashtami",
            author: {
              name: authorName,
              handle: authorHandle,
              avatar: authorAvatar,
              verified: true,
              badge: currentUser?.role === "admin" ? "Panchayat Admin" : "Creator"
            },
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=900&auto=format&fit=crop&q=80",
            caption: "श्री कृष्ण जन्माष्टमी की हार्दिक शुभकामनाएं! 🙏✨🌾 विश्वास हमारी पहचान, सुरक्षा हमारी प्राथमिकता। कृष्ण की बंशी की मधुर धुन आपके जीवन में सुख, समृद्धि और शांति लेकर आए।",
            hashtags: ["#Janmashtami", "#GramConnect", "#Kodebod", "#VillageLife"],
            location: "Kodebod, CG",
            likes: 142,
            likedByMe: true,
            commentsCount: 3,
            views: 1250,
            category: "Civic",
            createdAt: "Just now",
            isMyPost: true
          },
          {
            id: "post-my-iot",
            author: {
              name: authorName,
              handle: authorHandle,
              avatar: authorAvatar,
              verified: true,
              badge: currentUser?.role === "admin" ? "Panchayat Admin" : "Creator"
            },
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80",
            caption: "Deployed 6 new solar soil moisture & temperature telemetry nodes across Swarna paddy fields in Ward 3! Live data streaming to GramEye AI. 📡🌾",
            hashtags: ["#SmartFarming", "#IoT", "#GramEyeAI", "#RuralInnovation"],
            location: "Ward 3, Kodebod",
            likes: 284,
            likedByMe: false,
            commentsCount: 1,
            views: 2100,
            category: "Technology",
            createdAt: "Yesterday",
            isMyPost: true
          },
          {
            id: "post-my-canal",
            author: {
              name: authorName,
              handle: authorHandle,
              avatar: authorAvatar,
              verified: true,
              badge: currentUser?.role === "admin" ? "Panchayat Admin" : "Creator"
            },
            mediaType: "video",
            mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4",
            caption: "Kurud feeder canal water release telemetry demonstration for early morning transplantation! 💧🌾",
            hashtags: ["#Agriculture", "#CanalIrrigation", "#Kodebod"],
            location: "Kurud Feeder, Dhamtari",
            likes: 410,
            likedByMe: true,
            commentsCount: 2,
            views: 3480,
            category: "Agriculture",
            createdAt: "3 days ago",
            isMyPost: true
          },
          {
            id: "post-1",
            author: { name: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", verified: true, badge: "Top Creator" },
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80",
            caption: "Building our decentralized village intelligence network with AI vision & IoT sensors! Empowering rural communities through tech 🌾🚀",
            hashtags: ["#AI", "#RuralTech", "#GramEye", "#Innovation"],
            location: "Kodebod, Chhattisgarh",
            likes: 342,
            likedByMe: false,
            commentsCount: 28,
            views: 1840,
            category: "Technology",
            createdAt: "2 hours ago"
          },
          {
            id: "post-2",
            author: { name: "Dr. Sunita Verma", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", verified: true, badge: "Agri Scientist" },
            mediaType: "image",
            mediaUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&auto=format&fit=crop&q=80",
            caption: "Mahanadi canal water release schedule is live! Recommend early morning transplantation for Swarna paddy to maximize nitrogen absorption 💧🌾",
            hashtags: ["#Agriculture", "#KisanLife", "#CanalIrrigation"],
            location: "Kurud Feeder, Dhamtari",
            likes: 512,
            likedByMe: true,
            commentsCount: 42,
            views: 2950,
            category: "Agriculture",
            createdAt: "5 hours ago"
          }
        ]);
      });

    fetch("/api/social/stories")
      .then(res => res.json())
      .then(data => {
        if (data.stories) setStories(data.stories);
      })
      .catch(() => {
        setStories([
          { id: "s-1", author: { name: "Tarun S.", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }, text: "Deploying Kodebod sensor firmware! ⚡", time: "2h" },
          { id: "s-2", author: { name: "Dr. Sunita", handle: "sunita_agro", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" }, text: "Soil testing camp this Saturday 🧪", time: "4h" },
          { id: "s-3", author: { name: "Aman D.", handle: "aman_ui", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }, text: "Dark mode glassmorphism update live 🔥", time: "6h" }
        ]);
      });

    fetch("/api/social/shorts")
      .then(res => res.json())
      .then(data => {
        if (data.shorts) setShorts(data.shorts);
      })
      .catch(() => {
        setShorts([
          {
            id: "sh-1",
            author: { name: "Tarun Sahu", handle: "tarun_dev", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
            caption: "AI Vision training on local paddy leaf blights 🌾🤖",
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4",
            likes: 1420,
            likedByMe: false
          }
        ]);
      });
  }, []);

  // Story Progress Timer
  useEffect(() => {
    if (!activeStory) return;
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          setActiveStory(null);
          return 0;
        }
        return prev + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleLike = (id) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newLiked = !p.likedByMe;
          if (newLiked && addXp) addXp(2);
          return { ...p, likedByMe: newLiked, likes: p.likes + (newLiked ? 1 : -1) };
        }
        return p;
      })
    );
  };

  const handleSave = (id) => {
    setSavedPosts(prev => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? "🔖 Post saved to your collections!" : "Removed from saved posts.");
      return next;
    });
  };

  const handleFollowToggle = (handle) => {
    setFollowingState(prev => {
      const next = { ...prev, [handle]: !prev[handle] };
      showToast(next[handle] ? `Followed @${handle} ✓` : `Unfollowed @${handle}`);
      if (next[handle] && addXp) addXp(5);
      return next;
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: chatInput.trim(),
      time: "Just now"
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));
    setChatInput("");
    if (addXp) addXp(1);

    // Auto reply simulation
    setTimeout(() => {
      const reply = {
        id: `m-reply-${Date.now()}`,
        sender: "them",
        text: "Thanks for reaching out! Let's connect on Coodenest workspace.",
        time: "Just now"
      };
      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), reply]
      }));
    }, 1200);
  };

  // AI Caption Generator
  const handleGenerateAiCaption = (tone = "inspirational") => {
    setAiGenerating(true);
    fetch("/api/social/ai/caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: newCategory, tone })
    })
      .then(res => res.json())
      .then(data => {
        setNewCaption(data.caption);
        setNewHashtags(data.hashtags || ["#GramConnect", "#GramEyeAI", "#RuralInnovation"]);
        setAiGenerating(false);
        showToast("✨ AI Caption & Hashtags Generated!");
      })
      .catch(() => {
        setNewCaption("Bridging rural empowerment with modern digital architecture. Building sustainable futures together 🌾💻");
        setNewHashtags(["#GramConnect", "#GramEyeAI", "#RuralTech"]);
        setAiGenerating(false);
      });
  };

  const handlePublishPost = () => {
    if (!newCaption.trim() && !mediaPreviewUrl) return;
    const newP = {
      id: `post-${Date.now()}`,
      author: {
        name: currentUser?.fullName || editName || "Amit Kumar Sahu",
        handle: (currentUser?.fullName || editName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
        avatar: editAvatar || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        verified: true,
        badge: currentUser?.role === "admin" ? "Panchayat Admin" : "Creator"
      },
      mediaType: mediaPreviewUrl ? mediaType : "image",
      mediaUrl: mediaPreviewUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      caption: newCaption || "गाँव की नई तस्वीर और विकास की ओर बढ़ता भारत 🌾📸",
      hashtags: newHashtags.length > 0 ? newHashtags : ["#GramConnect", "#GramEyeAI", "#Innovation"],
      location: newLocation,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      views: 1,
      category: newCategory,
      createdAt: "Just now",
      isMyPost: true
    };
    setPosts([newP, ...posts]);
    setCreateModalOpen(false);
    setNewCaption("");
    handleRemoveMedia();
    setCreateStep(1);
    if (addXp) addXp(10);
    showToast("🚀 Post Published Successfully! +10 XP earned");
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px 80px" }}>
      {/* Instagram Profile & Modal Styles */}
      <style>{`
        .ge-insta-profile-card {
          background: #fff;
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 24px;
        }
        .ge-insta-header {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .ge-insta-avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .ge-insta-avatar-ring {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          padding: 3.5px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 22px rgba(220, 39, 67, 0.28);
        }
        .ge-insta-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 3px solid #fff;
        }
        .ge-insta-avatar-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: var(--turmeric);
          color: #231402;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2.5px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(0,0,0,0.25);
          transition: transform 0.2s;
        }
        .ge-insta-avatar-badge:hover {
          transform: scale(1.1);
        }
        .ge-insta-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ge-insta-top-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .ge-insta-stats-row {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .ge-insta-stat-item {
          cursor: pointer;
          font-size: 15px;
          color: var(--ink-text);
          transition: opacity 0.15s;
          user-select: none;
        }
        .ge-insta-stat-item:hover {
          opacity: 0.75;
          text-decoration: underline;
        }
        .ge-insta-stat-num {
          font-weight: 800;
          color: var(--ink-text);
          margin-right: 5px;
        }
        .ge-insta-bio-box {
          font-size: 13.5px;
          line-height: 1.55;
          color: #222;
        }
        .ge-insta-highlights-row {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          padding: 20px 0 6px;
          border-top: 1px solid rgba(0,0,0,0.06);
          margin-top: 24px;
          scrollbar-width: none;
        }
        .ge-insta-highlight-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ge-insta-highlight-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F7FAF8;
          font-size: 26px;
          transition: all 0.2s;
        }
        .ge-insta-highlight-item:hover .ge-insta-highlight-circle {
          border-color: var(--turmeric);
          transform: scale(1.05);
        }
        .ge-insta-tabs-nav {
          display: flex;
          justify-content: center;
          border-top: 1px solid rgba(0,0,0,0.08);
          margin-bottom: 22px;
          gap: 16px;
        }
        .ge-insta-tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 14px 22px;
          background: none;
          border: none;
          border-top: 2px solid transparent;
          color: var(--muted);
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .ge-insta-tab-btn.active {
          color: var(--ink-text);
          border-top-color: var(--paddy);
          font-weight: 800;
        }
        .ge-insta-posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .ge-insta-grid-item {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 14px;
          overflow: hidden;
          background: #111;
          cursor: pointer;
        }
        .ge-insta-grid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }
        .ge-insta-grid-item:hover .ge-insta-grid-img {
          transform: scale(1.03);
        }
        .ge-insta-grid-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .ge-insta-grid-item:hover .ge-insta-grid-overlay {
          opacity: 1;
        }
        .ge-insta-reel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .ge-insta-reel-item {
          position: relative;
          aspect-ratio: 9/16;
          border-radius: 16px;
          overflow: hidden;
          background: #0B1710;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }
        .ge-insta-reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 680px) {
          .ge-insta-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 18px;
          }
          .ge-insta-stats-row {
            justify-content: center;
            gap: 18px;
          }
          .ge-insta-top-row {
            justify-content: center;
          }
          .ge-insta-posts-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }
          .ge-insta-grid-item {
            border-radius: 4px;
          }
          .ge-insta-tab-btn {
            padding: 12px 10px;
            font-size: 11px;
          }
        }
      `}</style>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: "#0E1A13", color: "#FBF8F0", border: "1.5px solid var(--turmeric)",
          borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 13.5,
          boxShadow: "0 16px 36px rgba(0,0,0,0.5)", animation: "geFadeUp .25s ease"
        }}>
          {toastMsg}
        </div>
      )}

      {/* Main Top Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 14, marginBottom: 24,
        background: "linear-gradient(135deg, rgba(14,26,19,0.92) 0%, rgba(31,77,54,0.85) 100%)",
        padding: "20px 24px", borderRadius: 20, color: "#fff",
        boxShadow: "0 14px 40px rgba(0,0,0,0.25)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌐</span>
            <span className="ge-serif" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800 }}>
              Gram<span style={{ color: "var(--turmeric)" }}>Connect</span>{" "}
              <span style={{ fontSize: "clamp(16px, 2.5vw, 22px)", opacity: 0.9, fontWeight: 700 }}>(ग्राम कनेक्ट)</span>
            </span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", marginTop: 4, fontWeight: 500 }}>
            🌾 गाँव का सोशल व क्रिएटर मंच • Village Social Media + Rural Creator Hub + AI Network
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="ge-btn"
            style={{
              background: "var(--turmeric)", color: "#231402", fontWeight: 800,
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12
            }}
          >
            <PlusSquare size={17} />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20,
        scrollbarWidth: "none"
      }}>
        {[
          ["feed", "🏠 Home Feed"],
          ["explore", "🔎 Explore"],
          ["shorts", "🎬 Shorts (Reels)"],
          ["messages", "💬 Messages"],
          ["collabs", "🤝 Collaborations"],
          ["challenges", "🏆 Challenges"],
          ["profile", "👤 My Profile (मेरी प्रोफ़ाइल)"]
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="ge-btn"
            style={{
              background: activeTab === key ? "var(--paddy)" : "rgba(14,26,19,0.06)",
              color: activeTab === key ? "#fff" : "var(--ink-text)",
              fontWeight: activeTab === key ? 800 : 600,
              fontSize: 13.5, padding: "8px 16px", borderRadius: 12, whiteSpace: "nowrap"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3-COLUMN LAYOUT FOR FEED */}
      {activeTab === "feed" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }} className="ge-hero-grid">
          {/* CENTER FEED COLUMN */}
          <div>
            {/* STORIES STRIP */}
            <div style={{
              background: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 22,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)", display: "flex", gap: 14, overflowX: "auto",
              alignItems: "center"
            }}>
              {/* Add My Story Button */}
              <div
                onClick={() => setActiveTab("profile")}
                style={{ textAlign: "center", cursor: "pointer", flexShrink: 0 }}
                title="View your Instagram Profile & Reels"
              >
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  border: "2px dashed var(--turmeric)", display: "flex",
                  alignItems: "center", justifyContent: "center", background: "rgba(232,163,61,0.1)"
                }}>
                  <PlusSquare size={22} color="#8B5E34" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Your Profile</div>
              </div>

              {/* Story Items */}
              {stories.map(s => (
                <div
                  key={s.id}
                  onClick={() => setActiveStory(s)}
                  style={{ textAlign: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <div style={{
                    width: 62, height: 62, borderRadius: "50%",
                    padding: 2.5,
                    background: s.seen ? "#ccc" : "linear-gradient(45deg, #E8A33D, #1F4D36, #3C87A6)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <img
                      src={s.author.avatar}
                      alt={s.author.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", background: "#fff", border: "2px solid #fff" }}
                    />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.author.name}
                  </div>
                </div>
              ))}
            </div>

            {/* POSTS LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {posts.map(p => (
                <div
                  key={p.id}
                  style={{
                    background: "#fff", borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)"
                  }}
                >
                  {/* Post Author Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
                    <div
                      onClick={() => {
                        if (p.isMyPost || p.author.handle === authorHandle) {
                          setActiveTab("profile");
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: (p.isMyPost || p.author.handle === authorHandle) ? "pointer" : "default"
                      }}
                      title={(p.isMyPost || p.author.handle === authorHandle) ? "Click to view your Instagram Profile" : undefined}
                    >
                      <img
                        src={p.author.avatar}
                        alt={p.author.name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontWeight: 800, fontSize: 14 }}>{p.author.name}</span>
                          {p.author.verified && <CheckCircle2 size={15} color="#1F4D36" fill="rgba(31,77,54,0.15)" />}
                          {p.author.badge && (
                            <span style={{ fontSize: 10, background: "rgba(232,163,61,0.2)", color: "#8B5E34", padding: "1px 6px", borderRadius: 6, fontWeight: 700 }}>
                              {p.author.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span>@{p.author.handle}</span>
                          <span>•</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <MapPin size={11} /> {p.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFollowToggle(p.author.handle)}
                      className="ge-btn"
                      style={{
                        padding: "5px 12px", fontSize: 12, borderRadius: 20, fontWeight: 700,
                        background: followingState[p.author.handle] ? "rgba(0,0,0,0.06)" : "var(--paddy)",
                        color: followingState[p.author.handle] ? "var(--ink-text)" : "#fff"
                      }}
                    >
                      {followingState[p.author.handle] ? "Following" : "Follow"}
                    </button>
                  </div>

                  {/* Media Content */}
                  <div style={{ maxHeight: 480, overflow: "hidden", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.mediaType === "video" ? (
                      <video
                        src={p.mediaUrl}
                        controls
                        playsInline
                        style={{ width: "100%", maxHeight: 480, objectFit: "contain", display: "block" }}
                      />
                    ) : (
                      <img
                        src={p.mediaUrl}
                        alt="Post visual"
                        style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }}
                      />
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                          onClick={() => handleLike(p.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                        >
                          <Heart
                            size={23}
                            color={p.likedByMe ? "#D64545" : "#333"}
                            fill={p.likedByMe ? "#D64545" : "none"}
                          />
                          <span style={{ fontWeight: 800, fontSize: 13.5 }}>{p.likes}</span>
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#333" }}>
                          <MessageCircle size={22} />
                          <span style={{ fontWeight: 800, fontSize: 13.5 }}>{p.commentsCount}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: "Coodenest Connect", text: p.caption, url: window.location.href });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              showToast("🔗 Post link copied to clipboard!");
                            }
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#333" }}
                        >
                          <Share2 size={21} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleSave(p.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Bookmark
                          size={22}
                          color={savedPosts[p.id] ? "#E8A33D" : "#333"}
                          fill={savedPosts[p.id] ? "#E8A33D" : "none"}
                        />
                      </button>
                    </div>

                    {/* Caption & Hashtags */}
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-text)" }}>
                      <span style={{ fontWeight: 800, marginRight: 6 }}>{p.author.name}</span>
                      {p.caption}
                    </div>

                    {/* Hashtags Strip */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {(p.hashtags || []).map((h, i) => (
                        <span key={i} style={{ color: "var(--paddy)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                      Viewed by {p.views.toLocaleString()} creators • {p.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR (CREATOR DISCOVERY & TRENDING) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Suggested Creators */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontWeight: 800, fontSize: 14.5 }}>👥 Suggested Creators</span>
                <span style={{ fontSize: 11.5, color: "var(--paddy)", fontWeight: 700, cursor: "pointer" }}>See all</span>
              </div>

              {[
                { name: "Rahul Sahu", handle: "rahul_dev", role: "Fullstack • Kodebod", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
                { name: "Priya Sharma", handle: "priya_designs", role: "UI Architect • Raipur", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
                { name: "Nitin Dewangan", handle: "nitin_ai", role: "ML Engineer • Dhamtari", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" }
              ].map(c => (
                <div key={c.handle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={c.avatar} alt={c.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(c.handle)}
                    className="ge-btn"
                    style={{
                      padding: "4px 10px", fontSize: 11.5, borderRadius: 16,
                      background: followingState[c.handle] ? "rgba(0,0,0,0.06)" : "var(--paddy)",
                      color: followingState[c.handle] ? "var(--ink-text)" : "#fff",
                      fontWeight: 700
                    }}
                  >
                    {followingState[c.handle] ? "Added" : "+ Follow"}
                  </button>
                </div>
              ))}
            </div>

            {/* Trending Hashtags */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Flame size={18} color="#E0703A" />
                <span>Trending in Chhattisgarh</span>
              </div>
              {[
                { tag: "#RuralAI", posts: "14.2K posts" },
                { tag: "#KodebodDigital", posts: "8.6K posts" },
                { tag: "#MahanadiCanal", posts: "6.1K posts" },
                { tag: "#GramEyeAI", posts: "5.4K posts" },
                { tag: "#ChhattisgarhiTech", posts: "3.9K posts" }
              ].map(t => (
                <div key={t.tag} style={{ padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--paddy)" }}>{t.tag}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.posts}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPLORE PAGE */}
      {activeTab === "explore" && (
        <div>
          {/* Search Box */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "12px 18px", display: "flex",
            alignItems: "center", gap: 12, marginBottom: 20, boxShadow: "0 4px 18px rgba(0,0,0,0.05)"
          }}>
            <Search size={20} color="var(--muted)" />
            <input
              type="text"
              placeholder="Search creators, hashtags, projects, village tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", outline: "none", width: "100%", fontSize: 14, fontFamily: "inherit" }}
            />
          </div>

          {/* Explore Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80", title: "Edge AI Microcontrollers for Soil Moisture", creator: "Tarun Sahu", likes: 890 },
              { img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&auto=format&fit=crop&q=80", title: "Drone Survey of Kodebod Canal Network", creator: "Dr. Sunita", likes: 1240 },
              { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80", title: "Vernacular Mobile UX Systems", creator: "Aman Dewangan", likes: 640 },
              { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80", title: "Satellite Remote Sensing of Dhamtari Crops", creator: "Kisan Cell", likes: 1520 },
              { img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&auto=format&fit=crop&q=80", title: "Hackathon: Smart Village Chhattisgarh", creator: "Coodenest Team", likes: 980 },
              { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80", title: "Open Source Public Ledger for Panchayats", creator: "Rahul Sahu", likes: 730 }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 16, overflow: "hidden", background: "#fff",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", position: "relative"
                }}
              >
                <img src={item.img} alt={item.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink-text)", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--muted)" }}>
                    <span>By {item.creator}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 700, color: "var(--paddy)" }}>
                      <Heart size={13} fill="var(--paddy)" /> {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHORTS / REELS SECTION */}
      {activeTab === "shorts" && (
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{
            position: "relative", width: "100%", height: "75vh", minHeight: 520, maxHeight: 680,
            borderRadius: 24, overflow: "hidden", background: "#000", boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
          }}>
            <video
              src={shorts[activeShortIdx]?.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1730-large.mp4"}
              autoPlay={shortPlaying}
              loop
              muted={shortMuted}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Play/Pause & Sound overlay controls */}
            <div style={{ position: "absolute", top: 18, right: 18, display: "flex", gap: 10 }}>
              <button
                onClick={() => setShortMuted(!shortMuted)}
                style={{ background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", padding: 8, borderRadius: "50%", cursor: "pointer" }}
              >
                {shortMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Bottom Caption & Creator Info */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px",
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)", color: "#fff"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--turmeric)", display: "flex", alignItems: "center", justifyContent: "center", color: "#231402", fontWeight: 800 }}>
                  TS
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{shorts[activeShortIdx]?.author?.name || "Tarun Sahu"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>@tarun_dev</div>
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                {shorts[activeShortIdx]?.caption || "Building real-time village intelligence networks in Chhattisgarh 🌾🚀"}
              </div>
            </div>

            {/* Vertical Interaction Sidebar */}
            <div style={{
              position: "absolute", right: 14, bottom: 80, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 16, color: "#fff"
            }}>
              <button
                onClick={() => showToast("❤️ Liked short!")}
                style={{ background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", padding: 10, borderRadius: "50%", cursor: "pointer" }}
              >
                <Heart size={22} />
              </button>
              <button
                onClick={() => showToast("💬 Commenting on shorts...")}
                style={{ background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", padding: 10, borderRadius: "50%", cursor: "pointer" }}
              >
                <MessageCircle size={22} />
              </button>
              <button
                onClick={() => showToast("🔗 Link copied!")}
                style={{ background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", padding: 10, borderRadius: "50%", cursor: "pointer" }}
              >
                <Share2 size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT MESSAGES CHAT */}
      {activeTab === "messages" && (
        <div style={{
          display: "grid", gridTemplateColumns: "300px 1fr", height: 560, background: "#fff",
          borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)"
        }} className="ge-hero-grid">
          {/* Conversation List */}
          <div style={{ borderRight: "1px solid rgba(0,0,0,0.08)", overflowY: "auto", padding: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 16, padding: "8px 8px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              Messages & Creator DMs
            </div>
            {[
              { id: "usr-101", name: "Tarun Sahu", lastMsg: "Check out my collab request!", time: "10:20 AM", online: true },
              { id: "usr-102", name: "Dr. Sunita Verma", lastMsg: "Paddy advisory updated.", time: "Yesterday", online: false }
            ].map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedChat(c.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 12,
                  background: selectedChat === c.id ? "rgba(31,77,54,0.08)" : "transparent", cursor: "pointer"
                }}
              >
                <div style={{ position: "relative" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--paddy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#48BB78", position: "absolute", bottom: 0, right: 0, border: "2px solid #fff" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Chat Window */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Chat Top Header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>
                {selectedChat === "usr-101" ? "Tarun Sahu (@tarun_dev)" : "Dr. Sunita Verma (@sunita_agro)"}
              </div>
              <span style={{ fontSize: 11, background: "rgba(72,187,120,0.15)", color: "#2E6B4A", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                ● Online
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {(messages[selectedChat] || []).map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === "me" ? "flex-end" : "flex-start",
                    maxWidth: "75%",
                    background: m.sender === "me" ? "var(--paddy)" : "#F0F4F2",
                    color: m.sender === "me" ? "#fff" : "var(--ink-text)",
                    padding: "10px 14px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.45
                  }}
                >
                  <div>{m.text}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 10 }}>
              <input
                type="text"
                placeholder="Type a message or share a link..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                style={{ flex: 1, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: "10px 14px", fontSize: 13.5, outline: "none" }}
              />
              <button
                onClick={handleSendMessage}
                className="ge-btn"
                style={{ background: "var(--paddy)", color: "#fff", padding: "0 18px", borderRadius: 12 }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLLABORATIONS SECTION */}
      {activeTab === "collabs" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ge-2col">
          {[
            {
              title: "🌾 AI Solar Irrigation Automation",
              creator: "Tarun Sahu (@tarun_dev)",
              desc: "Connecting soil moisture telemetry with solar canal pumps in Kodebod. Looking for React Native & ESP32 developers.",
              skills: ["React Native", "ESP32 Firmware", "MQTT Telemetry"],
              applicants: 6,
              status: "OPEN"
            },
            {
              title: "🎙️ Chhattisgarhi Speech Translation Model",
              creator: "Dr. Sunita Verma (@sunita_agro)",
              desc: "Fine-tuning audio models on vernacular Chhattisgarhi dialects to make farming advisory voice bots accessible to elderly villagers.",
              skills: ["Whisper / PyTorch", "Audio Datasets", "Vernacular NLP"],
              applicants: 9,
              status: "OPEN"
            }
          ].map((collab, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)" }}>{collab.title}</div>
                <span style={{ fontSize: 11, background: "rgba(31,77,54,0.1)", color: "var(--paddy)", padding: "3px 8px", borderRadius: 8, fontWeight: 800 }}>
                  {collab.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Created by {collab.creator}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#444", marginBottom: 16 }}>{collab.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {collab.skills.map(s => (
                  <span key={s} style={{ fontSize: 11, background: "#F4F7F5", color: "var(--paddy)", padding: "4px 10px", borderRadius: 8, fontWeight: 700 }}>
                    {s}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>👥 {collab.applicants} Applicants</span>
                <button
                  onClick={() => showToast("🚀 Application submitted! The creator will review your profile.")}
                  className="ge-btn"
                  style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, fontSize: 12.5, padding: "8px 16px", borderRadius: 10 }}
                >
                  Join Collaboration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHALLENGES SECTION */}
      {activeTab === "challenges" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            {
              title: "🌾 Rural AI Innovation Challenge 2026",
              desc: "Build an AI model or prototype tackling water canal management, crop disease detection, or vernacular voice interfaces for village panchayats.",
              prize: "₹50,000 + Grant Support",
              participants: 482,
              deadline: "12 Days Remaining"
            },
            {
              title: "🎨 Panchayati Raj Vernacular UI Challenge",
              desc: "Design an accessible citizen portal experience designed specifically for first-time smartphone users in rural districts.",
              prize: "₹25,000 + National Recognition",
              participants: 310,
              deadline: "18 Days Remaining"
            }
          ].map((ch, idx) => (
            <div
              key={idx}
              style={{
                background: "linear-gradient(135deg, #132A1C 0%, #1F4D36 100%)", color: "#fff",
                borderRadius: 20, padding: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
              }}
            >
              <div style={{ maxWidth: 650 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--turmeric)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Active Challenge
                </div>
                <div className="ge-serif" style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{ch.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 6, lineHeight: 1.5 }}>{ch.desc}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
                  <span>🏆 Prize: <b>{ch.prize}</b></span>
                  <span>👥 {ch.participants} Participants</span>
                  <span>⏳ {ch.deadline}</span>
                </div>
              </div>
              <button
                onClick={() => showToast("🎉 You joined the challenge! Submit your post tag to participate.")}
                className="ge-btn"
                style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, padding: "12px 24px", borderRadius: 12 }}
              >
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INSTAGRAM-STYLE PROFILE & CREATOR HUB */}
      {activeTab === "profile" && (() => {
        const currentUserName = currentUser?.fullName || editName || "Amit Kumar Sahu";
        const currentUserHandle = (currentUser?.fullName || editName || "amit_sahu").toLowerCase().replace(/\s+/g, "_");
        const myPosts = posts.filter(
          p => p.isMyPost === true ||
               p.author?.name === currentUserName ||
               p.author?.handle === currentUserHandle
        );
        const mySavedPosts = posts.filter(p => savedPosts[p.id]);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Instagram Profile Header Card */}
            <div className="ge-insta-profile-card">
              <div className="ge-insta-header">
                {/* Profile Picture with Colorful Instagram Story Ring */}
                <div className="ge-insta-avatar-wrapper">
                  <div className="ge-insta-avatar-ring">
                    <img
                      src={editAvatar || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={currentUserName}
                      className="ge-insta-avatar-img"
                    />
                  </div>
                  <div
                    className="ge-insta-avatar-badge"
                    onClick={() => setEditProfileOpen(true)}
                    title="Change Profile Photo / Edit Profile"
                  >
                    <Camera size={15} color="#231402" />
                  </div>
                </div>

                {/* Profile Info Column */}
                <div className="ge-insta-info">
                  {/* Top Row: Handle, Badges & Action Buttons */}
                  <div className="ge-insta-top-row">
                    <span style={{ fontSize: "clamp(20px, 2.8vw, 24px)", fontWeight: 800, color: "var(--ink-text)", letterSpacing: "-0.02em" }}>
                      @{currentUserHandle}
                    </span>
                    <CheckCircle2 size={20} color="#1F4D36" fill="rgba(31,77,54,0.18)" />
                    <span style={{
                      fontSize: 11.5,
                      background: currentUser?.role === "admin" ? "rgba(232,163,61,0.2)" : "rgba(31,77,54,0.1)",
                      color: currentUser?.role === "admin" ? "#8B5E34" : "var(--paddy)",
                      padding: "3px 10px",
                      borderRadius: 8,
                      fontWeight: 800
                    }}>
                      {currentUser?.role === "admin" ? "🛡️ Panchayat Admin" : "🌾 Village Creator"}
                    </span>

                    <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setEditProfileOpen(true)}
                        className="ge-btn"
                        style={{
                          background: "#F0F4F2",
                          color: "var(--ink-text)",
                          fontSize: 12.5,
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          border: "1px solid rgba(0,0,0,0.08)"
                        }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(`https://grameye.ai/@${currentUserHandle}`);
                          }
                          showToast("📋 Profile link copied to clipboard!");
                        }}
                        className="ge-btn"
                        style={{
                          background: "#F0F4F2",
                          color: "var(--ink-text)",
                          fontSize: 12.5,
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          border: "1px solid rgba(0,0,0,0.08)"
                        }}
                      >
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="ge-btn"
                        style={{
                          background: "var(--turmeric)",
                          color: "#231402",
                          fontSize: 12.5,
                          fontWeight: 800,
                          padding: "7px 16px",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6
                        }}
                      >
                        <PlusSquare size={14} />
                        <span>+ New Post</span>
                      </button>
                    </div>
                  </div>

                  {/* Second Row: Interactive Instagram Stats (Posts, Followers, Following, XP) */}
                  <div className="ge-insta-stats-row">
                    <div
                      className="ge-insta-stat-item"
                      onClick={() => setProfileSubTab("posts")}
                      title="View all posts"
                    >
                      <span className="ge-insta-stat-num">{myPosts.length}</span>
                      <span>posts</span>
                    </div>

                    <div
                      className="ge-insta-stat-item"
                      onClick={() => setFollowersModalOpen(true)}
                      title="Click to view followers list"
                    >
                      <span className="ge-insta-stat-num">{followersList.length.toLocaleString()}</span>
                      <span>followers</span>
                    </div>

                    <div
                      className="ge-insta-stat-item"
                      onClick={() => setFollowingModalOpen(true)}
                      title="Click to view following list"
                    >
                      <span className="ge-insta-stat-num">{followingList.length}</span>
                      <span>following</span>
                    </div>

                    <div
                      className="ge-insta-stat-item"
                      onClick={() => setProfileSubTab("badges")}
                      title="View badges & honors"
                      style={{ color: "var(--paddy)", fontWeight: 700 }}
                    >
                      <span className="ge-insta-stat-num">⭐ {currentUser?.xp || 375}</span>
                      <span>Karma XP</span>
                    </div>
                  </div>

                  {/* Third Row: User Bio & Location */}
                  <div className="ge-insta-bio-box">
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--ink-text)", marginBottom: 3 }}>
                      {currentUserName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>
                      🌾 Rural Innovator • Public Representative
                    </div>
                    <div style={{ whiteSpace: "pre-line", marginBottom: 6, fontSize: 13.5, color: "#333" }}>
                      {editBio || userBio}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: 12.5, color: "var(--muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={13} color="var(--paddy)" />
                        <b>{editWard || currentUser?.ward || "Ward 3"}</b>, Kodebod, Dhamtari (CG)
                      </span>
                      <a
                        href={`https://${userWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--tank)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}
                      >
                        <Link2 size={13} />
                        <span>{userWebsite}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Highlights Strip */}
              <div className="ge-insta-highlights-row">
                {[
                  { icon: "🌾", title: "Agri IoT" },
                  { icon: "💧", title: "Canal Flow" },
                  { icon: "🚜", title: "Paddy Camp" },
                  { icon: "🏛️", title: "Panchayat" },
                  { icon: "🏆", title: "Awards" },
                  { icon: "💡", title: "Solar Light" }
                ].map((hl, idx) => (
                  <div
                    key={idx}
                    className="ge-insta-highlight-item"
                    onClick={() => showToast(`Opening highlight: ${hl.title}`)}
                  >
                    <div className="ge-insta-highlight-circle">
                      <span>{hl.icon}</span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-text)" }}>
                      {hl.title}
                    </span>
                  </div>
                ))}
                <div
                  className="ge-insta-highlight-item"
                  onClick={() => showToast("Add a new Story Highlight from your published stories!")}
                >
                  <div className="ge-insta-highlight-circle" style={{ borderStyle: "dashed", background: "rgba(232,163,61,0.08)" }}>
                    <span style={{ fontSize: 22, color: "var(--turmeric)" }}>+</span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>
                    New
                  </span>
                </div>
              </div>
            </div>

            {/* Instagram Profile Tabs Navigation Bar */}
            <div className="ge-insta-tabs-nav">
              <button
                type="button"
                className={`ge-insta-tab-btn ${profileSubTab === "posts" ? "active" : ""}`}
                onClick={() => setProfileSubTab("posts")}
              >
                <Grid size={15} />
                <span>Posts ({myPosts.length})</span>
              </button>

              <button
                type="button"
                className={`ge-insta-tab-btn ${profileSubTab === "reels" ? "active" : ""}`}
                onClick={() => setProfileSubTab("reels")}
              >
                <Film size={15} />
                <span>Reels ({myReels.length})</span>
              </button>

              <button
                type="button"
                className={`ge-insta-tab-btn ${profileSubTab === "saved" ? "active" : ""}`}
                onClick={() => setProfileSubTab("saved")}
              >
                <Bookmark size={15} />
                <span>Saved ({mySavedPosts.length})</span>
              </button>

              <button
                type="button"
                className={`ge-insta-tab-btn ${profileSubTab === "badges" ? "active" : ""}`}
                onClick={() => setProfileSubTab("badges")}
              >
                <Trophy size={15} />
                <span>Honors & XP</span>
              </button>
            </div>

            {/* TAB CONTENT 1: POSTS GRID */}
            {profileSubTab === "posts" && (
              <div>
                {myPosts.length === 0 ? (
                  <div style={{
                    background: "#fff", borderRadius: 20, padding: "48px 24px", textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>📸</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink-text)", marginBottom: 6 }}>
                      No Posts Yet
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 360, margin: "0 auto 18px" }}>
                      When you share photos and videos from village developments or agricultural tech, they will appear on your profile.
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(true)}
                      className="ge-btn"
                      style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "10px 22px", borderRadius: 12 }}
                    >
                      Share Your First Post 🚀
                    </button>
                  </div>
                ) : (
                  <div className="ge-insta-posts-grid">
                    {myPosts.map((p) => (
                      <div
                        key={p.id}
                        className="ge-insta-grid-item"
                        onClick={() => setSelectedPostDetail(p)}
                        title="Click to view post"
                      >
                        {p.mediaType === "video" ? (
                          <video
                            src={p.mediaUrl}
                            muted
                            playsInline
                            className="ge-insta-grid-img"
                          />
                        ) : (
                          <img
                            src={p.mediaUrl}
                            alt={p.caption}
                            className="ge-insta-grid-img"
                            loading="lazy"
                          />
                        )}

                        {/* Video Icon Badge */}
                        {p.mediaType === "video" && (
                          <div style={{
                            position: "absolute", top: 10, right: 10,
                            background: "rgba(0,0,0,0.65)", color: "#fff",
                            borderRadius: 8, padding: "4px 7px", fontSize: 11,
                            display: "flex", alignItems: "center", gap: 4, zIndex: 2
                          }}>
                            <Film size={12} />
                            <span>Video</span>
                          </div>
                        )}

                        {/* Hover Overlay with Likes & Comments Count */}
                        <div className="ge-insta-grid-overlay">
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Heart size={18} fill="#fff" color="#fff" />
                            <span>{p.likes}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <MessageCircle size={18} fill="#fff" color="#fff" />
                            <span>{(postComments[p.id] || []).length || p.commentsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: REELS GRID */}
            {profileSubTab === "reels" && (
              <div className="ge-insta-reel-grid">
                {myReels.map((reel) => (
                  <div
                    key={reel.id}
                    className="ge-insta-reel-item"
                    onClick={() => {
                      // Switch to shorts view with this video
                      setActiveTab("shorts");
                      showToast(`Playing Reel: ${reel.caption.slice(0, 30)}...`);
                    }}
                    title="Click to watch Reel"
                  >
                    <video
                      src={reel.videoUrl}
                      muted
                      playsInline
                      className="ge-insta-reel-video"
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
                      display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 14, color: "#fff"
                    }}>
                      <div style={{ alignSelf: "flex-end", background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        🎬 Reel
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 800, marginBottom: 4 }}>
                          <Play size={14} fill="#fff" />
                          <span>{reel.views} views</span>
                        </div>
                        <div style={{ fontSize: 11.5, lineHeight: 1.35, opacity: 0.9, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {reel.caption}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 3: SAVED POSTS GRID */}
            {profileSubTab === "saved" && (
              <div>
                {mySavedPosts.length === 0 ? (
                  <div style={{
                    background: "#fff", borderRadius: 20, padding: "48px 24px", textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🔖</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink-text)", marginBottom: 6 }}>
                      Save Posts
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 360, margin: "0 auto" }}>
                      Save photos and videos from the feed that you want to refer back to later. Only you can see what you have saved.
                    </div>
                  </div>
                ) : (
                  <div className="ge-insta-posts-grid">
                    {mySavedPosts.map((p) => (
                      <div
                        key={p.id}
                        className="ge-insta-grid-item"
                        onClick={() => setSelectedPostDetail(p)}
                      >
                        <img
                          src={p.mediaUrl}
                          alt={p.caption}
                          className="ge-insta-grid-img"
                        />
                        <div className="ge-insta-grid-overlay">
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Heart size={18} fill="#fff" color="#fff" />
                            <span>{p.likes}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <MessageCircle size={18} fill="#fff" color="#fff" />
                            <span>{p.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: BADGES & XP HONORS */}
            {profileSubTab === "badges" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Stats Grid */}
                <div style={{
                  background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
                  display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center"
                }} className="ge-2col">
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "var(--paddy)" }}>{currentUser?.xp || 375} XP</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Creator Karma</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "var(--turmeric)" }}>Level 4</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Creator Level</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "var(--tank)" }}>3.2K</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Total Post Reach</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#D64545" }}>{myPosts.reduce((acc, c) => acc + (c.likes || 0), 0)}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Applauds & Likes</div>
                  </div>
                </div>

                {/* Badges Earned */}
                <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>🏆 Creator Badges & Honors</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {[
                      { name: "🌾 Grassroots Innovator", desc: "Posted 5+ rural technology solutions" },
                      { name: "🤖 AI Explorer", desc: "Used AI Vision & Caption tools" },
                      { name: "🤝 Active Collaborator", desc: "Joined an open-source project" },
                      { name: "⭐ Kodebod Pioneer", desc: "Founding member of GramConnect (ग्राम कनेक्ट)" },
                      { name: "🛡️ Panchayat Champion", desc: "Verified community official & civic contributor" }
                    ].map(b => (
                      <div key={b.name} style={{ background: "#F4F7F5", padding: "12px 18px", borderRadius: 14, border: "1px solid rgba(31,77,54,0.1)" }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: "var(--paddy)" }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* INSTAGRAM POST DETAIL MODAL (LIGHTBOX) */}
      {selectedPostDetail && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            backdropFilter: "blur(8px)"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPostDetail(null);
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 960, maxHeight: "88vh",
            display: "grid", gridTemplateColumns: "1.2fr 1fr", overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
          }} className="ge-lightbox-grid">
            {/* Left Media Area */}
            <div style={{ background: "#0E1A13", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: 380 }}>
              {selectedPostDetail.mediaType === "video" ? (
                <video
                  src={selectedPostDetail.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: "100%", maxHeight: "85vh", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={selectedPostDetail.mediaUrl}
                  alt={selectedPostDetail.caption}
                  style={{ width: "100%", maxHeight: "85vh", objectFit: "contain" }}
                />
              )}
            </div>

            {/* Right Interactive Comments & Info Area */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={selectedPostDetail.author?.avatar || editAvatar}
                    alt={selectedPostDetail.author?.name}
                    style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{selectedPostDetail.author?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>📍 {selectedPostDetail.location || "Kodebod, CG"}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPostDetail(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <X size={20} color="var(--muted)" />
                </button>
              </div>

              {/* Scrollable Comments & Caption Area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Author's Caption */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <img
                    src={selectedPostDetail.author?.avatar || editAvatar}
                    alt={selectedPostDetail.author?.name}
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ fontSize: 13, lineHeight: 1.45 }}>
                    <span style={{ fontWeight: 800, marginRight: 6 }}>{selectedPostDetail.author?.name}</span>
                    <span>{selectedPostDetail.caption}</span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                      {(selectedPostDetail.hashtags || []).map(h => (
                        <span key={h} style={{ fontSize: 12, color: "var(--tank)", fontWeight: 700 }}>{h}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{selectedPostDetail.createdAt || "Recently"}</div>
                  </div>
                </div>

                {/* Existing Comments */}
                {(postComments[selectedPostDetail.id] || []).map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <img
                      src={c.avatar}
                      alt={c.user}
                      style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 800, marginRight: 6 }}>{c.user}</span>
                      <span>{c.text}</span>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "12px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleLike(selectedPostDetail.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <Heart
                        size={22}
                        color={selectedPostDetail.likedByMe ? "#E0245E" : "var(--ink-text)"}
                        fill={selectedPostDetail.likedByMe ? "#E0245E" : "none"}
                      />
                    </button>
                    <MessageCircle size={22} color="var(--ink-text)" style={{ cursor: "pointer" }} />
                    <Share2
                      size={22}
                      color="var(--ink-text)"
                      style={{ cursor: "pointer" }}
                      onClick={() => showToast("Link copied to clipboard!")}
                    />
                  </div>
                  <Bookmark
                    size={22}
                    color={savedPosts[selectedPostDetail.id] ? "var(--turmeric)" : "var(--ink-text)"}
                    fill={savedPosts[selectedPostDetail.id] ? "var(--turmeric)" : "none"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSave(selectedPostDetail.id)}
                  />
                </div>

                <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 2 }}>
                  {selectedPostDetail.likes} likes
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                  {selectedPostDetail.createdAt || "AUGUST 2026"}
                </div>
              </div>

              {/* Add Comment Input Bar */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "10px 18px", display: "flex", gap: 10, alignItems: "center" }}>
                <Smile size={18} color="var(--muted)" style={{ cursor: "pointer" }} />
                <input
                  type="text"
                  placeholder="Add a comment... (टिप्पणी जोड़ें)"
                  value={detailCommentInput}
                  onChange={(e) => setDetailCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && detailCommentInput.trim()) {
                      const newC = {
                        id: `c-${Date.now()}`,
                        user: currentUser?.fullName || editName || "Amit Kumar Sahu",
                        handle: (currentUser?.fullName || editName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
                        avatar: editAvatar || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                        text: detailCommentInput.trim(),
                        time: "Just now"
                      };
                      setPostComments(prev => ({
                        ...prev,
                        [selectedPostDetail.id]: [...(prev[selectedPostDetail.id] || []), newC]
                      }));
                      setPosts(prev => prev.map(p => p.id === selectedPostDetail.id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
                      setDetailCommentInput("");
                      showToast("💬 Comment posted!");
                    }
                  }}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" }}
                />
                <button
                  type="button"
                  disabled={!detailCommentInput.trim()}
                  onClick={() => {
                    if (!detailCommentInput.trim()) return;
                    const newC = {
                      id: `c-${Date.now()}`,
                      user: currentUser?.fullName || editName || "Amit Kumar Sahu",
                      handle: (currentUser?.fullName || editName || "amit_sahu").toLowerCase().replace(/\s+/g, "_"),
                      avatar: editAvatar || currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                      text: detailCommentInput.trim(),
                      time: "Just now"
                    };
                    setPostComments(prev => ({
                      ...prev,
                      [selectedPostDetail.id]: [...(prev[selectedPostDetail.id] || []), newC]
                    }));
                    setPosts(prev => prev.map(p => p.id === selectedPostDetail.id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
                    setDetailCommentInput("");
                    showToast("💬 Comment posted!");
                  }}
                  style={{
                    background: "none", border: "none",
                    color: detailCommentInput.trim() ? "var(--tank)" : "#ccc",
                    fontWeight: 800, fontSize: 13, cursor: detailCommentInput.trim() ? "pointer" : "default"
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWERS LIST MODAL */}
      {followersModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setFollowersModalOpen(false);
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 22, width: "100%", maxWidth: 440,
            overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Followers ({followersList.length})</div>
              <button
                type="button"
                onClick={() => setFollowersModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: "12px 20px" }}>
              <input
                type="text"
                placeholder="Search followers..."
                value={followersSearch}
                onChange={(e) => setFollowersSearch(e.target.value)}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)", fontSize: 13, outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: "auto", padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {followersList
                .filter(f => f.name.toLowerCase().includes(followersSearch.toLowerCase()) || f.handle.toLowerCase().includes(followersSearch.toLowerCase()))
                .map((user) => (
                  <div key={user.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{user.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>@{user.handle} • {user.role}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFollowersList(prev => prev.map(f => f.id === user.id ? { ...f, isFollowing: !f.isFollowing } : f));
                        showToast(user.isFollowing ? `Unfollowed @${user.handle}` : `Now following @${user.handle}!`);
                      }}
                      className="ge-btn"
                      style={{
                        padding: "6px 14px", fontSize: 12, borderRadius: 8, fontWeight: 700,
                        background: user.isFollowing ? "#F0F4F2" : "var(--paddy)",
                        color: user.isFollowing ? "var(--ink-text)" : "#fff"
                      }}
                    >
                      {user.isFollowing ? "Following" : "Follow Back"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWING LIST MODAL */}
      {followingModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setFollowingModalOpen(false);
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 22, width: "100%", maxWidth: 440,
            overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Following ({followingList.length})</div>
              <button
                type="button"
                onClick={() => setFollowingModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: "12px 20px" }}>
              <input
                type="text"
                placeholder="Search following..."
                value={followingSearch}
                onChange={(e) => setFollowingSearch(e.target.value)}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)", fontSize: 13, outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: "auto", padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {followingList
                .filter(f => f.name.toLowerCase().includes(followingSearch.toLowerCase()) || f.handle.toLowerCase().includes(followingSearch.toLowerCase()))
                .map((user) => (
                  <div key={user.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{user.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>@{user.handle} • {user.role}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFollowingList(prev => prev.filter(f => f.id !== user.id));
                        showToast(`Unfollowed @${user.handle}`);
                      }}
                      className="ge-btn"
                      style={{
                        padding: "6px 14px", fontSize: 12, borderRadius: 8, fontWeight: 700,
                        background: "#F0F4F2", color: "var(--ink-text)", border: "1px solid rgba(0,0,0,0.1)"
                      }}
                    >
                      Following
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditProfileOpen(false);
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 22, width: "100%", maxWidth: 500,
            overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>✏️ Edit Profile (प्रोफ़ाइल संपादित करें)</div>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Full Name (पूरा नाम)</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 13.5, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Bio (परिचय)</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Ward (वार्ड)</label>
                  <input
                    type="text"
                    value={editWard}
                    onChange={(e) => setEditWard(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Website / Link</label>
                  <input
                    type="text"
                    value={userWebsite}
                    onChange={(e) => setUserWebsite(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 5 }}>Profile Photo URL</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 12.5, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="ge-btn"
                  style={{ padding: "9px 18px", borderRadius: 10, background: "#eee", fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserBio(editBio);
                    setEditProfileOpen(false);
                    showToast("✅ Profile updated successfully!");
                  }}
                  className="ge-btn"
                  style={{ padding: "9px 22px", borderRadius: 10, background: "var(--paddy)", color: "#fff", fontWeight: 800, fontSize: 13 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            position: "relative", width: "100%", maxWidth: 420, height: 620,
            borderRadius: 20, overflow: "hidden", background: "#111", color: "#fff",
            display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            {/* Story Progress Bar */}
            <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.3)", position: "relative" }}>
              <div style={{ width: `${storyProgress}%`, height: "100%", background: "var(--turmeric)", transition: "width .2s linear" }} />
            </div>

            {/* Story Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={activeStory.author.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%" }} />
                <div style={{ fontWeight: 800, fontSize: 13 }}>{activeStory.author.name}</div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Story Text / Visual */}
            <div style={{ padding: "0 24px", textAlign: "center" }}>
              <div className="ge-serif" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.4 }}>
                {activeStory.text}
              </div>
            </div>

            {/* Story Reply Bar */}
            <div style={{ padding: "14px 16px", display: "flex", gap: 10 }}>
              <input
                type="text"
                placeholder="Reply to story..."
                style={{ flex: 1, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, padding: "8px 14px", color: "#fff", fontSize: 12.5 }}
              />
              <button
                onClick={() => {
                  showToast("❤️ Sent reaction!");
                  setActiveStory(null);
                }}
                className="ge-btn"
                style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, padding: "6px 14px", borderRadius: 20 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-STEP CREATE POST MODAL */}
      {createModalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, width: "100%", maxWidth: 580,
            overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 22px", borderBottom: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                🚀 Create Post on GramConnect (ग्राम कनेक्ट)
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 22, maxHeight: "82vh", overflowY: "auto" }}>
              {/* AI Assistant Banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(31,77,54,0.08) 0%, rgba(232,163,61,0.12) 100%)",
                border: "1px solid rgba(232,163,61,0.3)", borderRadius: 14, padding: "12px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={18} color="#8B5E34" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#8B5E34" }}>
                    GramConnect AI Assistant
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => handleGenerateAiCaption("inspirational")}
                    disabled={aiGenerating}
                    className="ge-btn"
                    style={{ fontSize: 11, background: "var(--paddy)", color: "#fff", padding: "4px 10px", borderRadius: 8 }}
                  >
                    ✨ Inspiring
                  </button>
                  <button
                    onClick={() => handleGenerateAiCaption("technical")}
                    disabled={aiGenerating}
                    className="ge-btn"
                    style={{ fontSize: 11, background: "var(--turmeric)", color: "#231402", padding: "4px 10px", borderRadius: 8, fontWeight: 700 }}
                  >
                    ✨ Technical
                  </button>
                </div>
              </div>

              {/* Photo / Video Attachment Controls */}
              <div style={{ marginBottom: 16, background: "#F7FAF8", padding: 14, borderRadius: 14, border: "1px dashed rgba(31,77,54,0.25)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink-text)", display: "flex", alignItems: "center", gap: 6 }}>
                    <ImageIcon size={15} color="var(--paddy)" /> फ़ोटो या वीडियो अपलोड करें (Upload Media)
                  </label>
                  {mediaPreviewUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      style={{ background: "rgba(214,69,69,0.1)", color: "#D64545", border: "none", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      ❌ हटाएं (Remove)
                    </button>
                  )}
                </div>

                {/* Hidden Native File Inputs */}
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMediaType("image");
                      setMediaFile(file);
                      setMediaPreviewUrl(URL.createObjectURL(file));
                      showToast("📸 फोटो सफलतापूर्वक चुनी गई (Photo attached)!");
                    }
                  }}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMediaType("video");
                      setMediaFile(file);
                      setMediaPreviewUrl(URL.createObjectURL(file));
                      showToast("🎥 वीडियो सफलतापूर्वक चुना गया (Video attached)!");
                    }
                  }}
                />

                {/* Buttons to open file browser */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="ge-btn"
                    style={{
                      flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 10, border: "1.5px solid #2E6B4A",
                      background: mediaType === "image" && mediaPreviewUrl ? "rgba(46,107,74,0.15)" : "#fff",
                      color: "#1F4D36", fontWeight: 700, fontSize: 13, cursor: "pointer"
                    }}
                  >
                    <ImageIcon size={17} color="#1F4D36" />
                    <span>📷 फ़ोटो जोड़ें (Add Photo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="ge-btn"
                    style={{
                      flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E8A33D",
                      background: mediaType === "video" && mediaPreviewUrl ? "rgba(232,163,61,0.2)" : "#fff",
                      color: "#8B5E34", fontWeight: 700, fontSize: 13, cursor: "pointer"
                    }}
                  >
                    <Video size={17} color="#8B5E34" />
                    <span>🎥 वीडियो जोड़ें (Add Video)</span>
                  </button>
                </div>

                {/* Live Media Preview if selected */}
                {mediaPreviewUrl && (
                  <div style={{
                    marginTop: 12, borderRadius: 12, overflow: "hidden", position: "relative",
                    background: "#000", border: "1.5px solid rgba(0,0,0,0.1)"
                  }}>
                    {mediaType === "video" ? (
                      <video
                        src={mediaPreviewUrl}
                        controls
                        playsInline
                        style={{ width: "100%", maxHeight: 220, display: "block", objectFit: "contain" }}
                      />
                    ) : (
                      <img
                        src={mediaPreviewUrl}
                        alt="Selected media"
                        style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
                      />
                    )}
                    <div style={{
                      position: "absolute", bottom: 8, left: 8, right: 8,
                      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
                      color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11,
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span>{mediaType === "video" ? "🎥 वीडियो फ़ाइल (Video)" : "📷 फ़ोटो फ़ाइल (Photo)"}</span>
                      <span style={{ opacity: 0.85, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {mediaFile?.name || "Ready to upload"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption Textarea */}
              <label style={{ fontSize: 12.5, fontWeight: 700, display: "block", marginBottom: 6 }}>
                What are you building or sharing?
              </label>
              <textarea
                rows={4}
                placeholder="Share your progress, insights, or agricultural tech innovations..."
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
                style={{
                  width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)",
                  fontSize: 13.5, fontFamily: "inherit", outline: "none", resize: "vertical", marginBottom: 14
                }}
              />

              {/* Category & Location Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, display: "block", marginBottom: 4 }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 12.5 }}
                  >
                    <option value="Technology">Technology & AI</option>
                    <option value="Agriculture">Agriculture & Farming</option>
                    <option value="Design">UI/UX & Design</option>
                    <option value="Civic">Civic Community</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, display: "block", marginBottom: 4 }}>Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 12.5 }}
                  />
                </div>
              </div>

              {/* AI Moderation Check Status */}
              <div style={{ fontSize: 11.5, color: "#2E6B4A", display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
                <CheckCircle2 size={14} color="#2E6B4A" />
                <span>AI Moderation: Safe for public community publication (Zero violations detected)</span>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="ge-btn"
                  style={{ background: "#eee", padding: "10px 18px", borderRadius: 10, fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishPost}
                  className="ge-btn"
                  style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "10px 22px", borderRadius: 10, fontSize: 13 }}
                >
                  Publish Post 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
