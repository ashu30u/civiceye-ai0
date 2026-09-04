import React, { useState, useEffect, useRef } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, Sparkles, Send, Image as ImageIcon,
  Video, Compass, Film, MessageSquare, PlusSquare, User, TrendingUp, Trophy,
  Users, CheckCircle2, MoreHorizontal, X, Smile, Search, Filter, Flame,
  Award, Play, Pause, Volume2, VolumeX, Eye, ArrowRight, Check, MapPin
} from "lucide-react";

export default function CoodenestConnect({ currentUser, addXp }) {
  const [activeTab, setActiveTab] = useState("feed"); // feed, explore, shorts, messages, collabs, challenges, profile
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
        // Fallback seed
        setPosts([
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
        setNewHashtags(data.hashtags || ["#CoodenestConnect", "#RuralInnovation"]);
        setAiGenerating(false);
        showToast("✨ AI Caption & Hashtags Generated!");
      })
      .catch(() => {
        setNewCaption("Bridging rural empowerment with modern digital architecture. Building sustainable futures together 🌾💻");
        setNewHashtags(["#CoodenestConnect", "#Innovation", "#RuralTech"]);
        setAiGenerating(false);
      });
  };

  const handlePublishPost = () => {
    if (!newCaption.trim()) return;
    const newP = {
      id: `post-${Date.now()}`,
      author: {
        name: currentUser?.fullName || "Tarun Sahu",
        handle: "my_creator",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        verified: true,
        badge: "Creator"
      },
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      caption: newCaption,
      hashtags: newHashtags,
      location: newLocation,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      views: 1,
      category: newCategory,
      createdAt: "Just now"
    };
    setPosts([newP, ...posts]);
    setCreateModalOpen(false);
    setNewCaption("");
    setCreateStep(1);
    if (addXp) addXp(10);
    showToast("🚀 Post Published Successfully! +10 XP earned");
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px 80px" }}>
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
            <span style={{ fontSize: 24 }}>🚀</span>
            <span className="ge-serif" style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800 }}>
              Coodenest <span style={{ color: "var(--turmeric)" }}>Connect</span>
            </span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            Create. Share. Connect. Collaborate. • Social Media + Creator Platform + AI Community
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
          ["profile", "👤 Creator Hub & XP"]
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
                onClick={() => showToast("📸 Story upload ready! Click 'Create Post' to share your story.")}
                style={{ textAlign: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  border: "2px dashed var(--turmeric)", display: "flex",
                  alignItems: "center", justifyContent: "center", background: "rgba(232,163,61,0.1)"
                }}>
                  <PlusSquare size={22} color="#8B5E34" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Your Story</div>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  <div style={{ maxHeight: 480, overflow: "hidden", background: "#000" }}>
                    <img
                      src={p.mediaUrl}
                      alt="Post visual"
                      style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }}
                    />
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

      {/* CREATOR HUB & XP PROFILE */}
      {activeTab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Bar */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center"
          }} className="ge-2col">
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--paddy)" }}>340 XP</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Creator Karma</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--turmeric)" }}>Level 4</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Creator Level</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--tank)" }}>1.8K</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Post Reach</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#D64545" }}>89</div>
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
                { name: "⭐ Kodebod Pioneer", desc: "Founding member of Coodenest Connect" }
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
                🚀 Create Post on Coodenest Connect
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 22 }}>
              {/* AI Assistant Banner */}
              <div style={{
                background: "linear-gradient(135deg, rgba(31,77,54,0.08) 0%, rgba(232,163,61,0.12) 100%)",
                border: "1px solid rgba(232,163,61,0.3)", borderRadius: 14, padding: "12px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={18} color="#8B5E34" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#8B5E34" }}>
                    Coodenest AI Assistant
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
