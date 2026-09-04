import React, { useState } from "react";
import {
  Users, CheckCircle2, ThumbsUp, Plus, Calendar, Clock,
  MapPin, Sparkles, Award, ArrowRight, MessageSquare, Flame, Check
} from "lucide-react";

const INITIAL_PROPOSALS = [
  {
    id: "PROP-101",
    title: "Install 10 Solar Streetlights on Temple & Crematorium Path",
    description: "The path from Ward 6 towards the crematorium is unlit and dense bushes make evening movement hazardous for women and elderly. Request solar LED installation.",
    proposer: "Anita Patel",
    ward: "Ward 6",
    category: "Electricity",
    votes: 46,
    requiredVotes: 50,
    status: "ACTIVE",
    commentsCount: 14,
    date: "2026-08-27"
  },
  {
    id: "PROP-102",
    title: "Daily Waste Segregation & Compost Pit at Central Market",
    description: "Vegetable waste from the Wednesday market is causing severe odor and stray animal congestion in Ward 3. Establishing a community compost unit will generate organic manure.",
    proposer: "Amit Kumar Sahu",
    ward: "Ward 3",
    category: "Sanitation",
    votes: 52,
    requiredVotes: 50,
    status: "ESCALATED", // reached threshold!
    commentsCount: 22,
    date: "2026-08-22"
  },
  {
    id: "PROP-103",
    title: "Clean Drinking Water RO ATM near Primary Health Sub-Centre",
    description: "Patients and school children often face muddy water during monsoon. Installing a solar-powered 500 LPH RO water dispensing ATM in Ward 4.",
    proposer: "Dr. Suresh Verma",
    ward: "Ward 4",
    category: "Water Supply",
    votes: 38,
    requiredVotes: 50,
    status: "ACTIVE",
    commentsCount: 9,
    date: "2026-08-30"
  },
  {
    id: "PROP-104",
    title: "Concrete Drainage Bunding along Agricultural Feeder Canal",
    description: "Water seepage is eroding topsoil of 12 farmers' paddy fields in Ward 5. Simple stone pitching and concrete lining needed before harvest.",
    proposer: "Rameshwar Dhurve",
    ward: "Ward 5",
    category: "Public Works",
    votes: 29,
    requiredVotes: 50,
    status: "ACTIVE",
    commentsCount: 7,
    date: "2026-09-01"
  }
];

export default function GramSabha({ addXp }) {
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [votedMap, setVotedMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // New proposal inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("Ward 3");
  const [category, setCategory] = useState("Public Works");
  const [toastMsg, setToastMsg] = useState(null);

  const handleSupport = (id) => {
    if (votedMap[id]) return;
    setVotedMap((prev) => ({ ...prev, [id]: true }));
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newVotes = p.votes + 1;
          const newStatus = newVotes >= p.requiredVotes ? "ESCALATED" : p.status;
          return { ...p, votes: newVotes, status: newStatus };
        }
        return p;
      })
    );
    if (addXp) addXp(10);
    setToastMsg("👍 Thank you for voting! You earned +10 Citizen XP.");
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCreateProposal = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProp = {
      id: `PROP-${100 + proposals.length + 1}`,
      title: title.trim(),
      description: description.trim(),
      proposer: "You (Citizen)",
      ward,
      category,
      votes: 1,
      requiredVotes: 50,
      status: "ACTIVE",
      commentsCount: 0,
      date: "2026-09-03"
    };

    setProposals([newProp, ...proposals]);
    setVotedMap((prev) => ({ ...prev, [newProp.id]: true }));
    if (addXp) addXp(25);
    setModalOpen(false);
    setTitle("");
    setDescription("");
    setToastMsg("🎉 Your proposal is live! Villagers can now vote. Earned +25 XP.");
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 24px 90px" }}>
      {/* Toast Notification */}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🗳️</span>
            <div className="ge-serif" style={{ fontSize: 28, fontWeight: 700, color: "var(--ink-text)" }}>
              Digital Gram Sabha & Citizen Voting
            </div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            Direct democracy in action: Propose village development projects and vote before the official Gram Sabha meeting.
          </div>
        </div>

        <button
          type="button"
          className="ge-btn ge-btn-primary"
          onClick={() => setModalOpen(true)}
          style={{ fontSize: 13.5 }}
        >
          <Plus size={16} /> Propose New Village Work
        </button>
      </div>

      {/* Next Gram Sabha Meeting Alert Banner */}
      <div
        className="ge-card"
        style={{
          padding: "18px 22px",
          background: "linear-gradient(135deg, rgba(31,77,54,0.12) 0%, rgba(232,163,61,0.12) 100%)",
          border: "1.5px solid var(--turmeric)",
          borderRadius: 16,
          marginBottom: 30,
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
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "var(--turmeric)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px rgba(232,163,61,0.4)"
            }}
          >
            <Calendar size={24} color="#231402" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8B5E34", textTransform: "uppercase" }}>
              UPCOMING OFFICIAL GRAM SABHA (ग्राम सभा बैठक)
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink-text)", marginTop: 2 }}>
              15 September 2026 • 10:30 AM at Panchayat Bhavan Rampur
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Any proposal with 50+ citizen votes gets automatic formal discussion on the Sarpanch's agenda!
            </div>
          </div>
        </div>

        <div className="ge-chip" style={{ background: "var(--paddy)", color: "#fff", fontSize: 12, padding: "8px 16px" }}>
          1 Proposal Escalated to Agenda ✓
        </div>
      </div>

      {/* Proposals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ge-2col">
        {proposals.map((p) => {
          const hasVoted = votedMap[p.id];
          const percent = Math.min(100, Math.round((p.votes / p.requiredVotes) * 100));
          const isEscalated = p.status === "ESCALATED";

          return (
            <div
              key={p.id}
              className="ge-card"
              style={{
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                border: isEscalated ? "2px solid var(--low)" : "1px solid var(--line-dark)"
              }}
            >
              <div>
                {/* Top Tags */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span className="ge-chip" style={{ background: "rgba(31,77,54,0.08)", color: "var(--paddy)", fontSize: 11 }}>
                      {p.category}
                    </span>
                    <span className="ge-chip" style={{ background: "rgba(60,135,166,0.1)", color: "var(--tank)", fontSize: 11 }}>
                      <MapPin size={11} /> {p.ward}
                    </span>
                  </div>

                  {isEscalated ? (
                    <span className="ge-chip" style={{ background: "rgba(95,168,114,0.18)", color: "var(--low)", fontWeight: 800, fontSize: 11 }}>
                      ✓ Agenda Approved
                    </span>
                  ) : (
                    <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700 }}>
                      {p.requiredVotes - p.votes} more votes needed
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink-text)", lineHeight: 1.35, marginBottom: 8 }}>
                  {p.title}
                </div>

                <p style={{ fontSize: 13, color: "#546A5B", lineHeight: 1.55, marginBottom: 16 }}>
                  {p.description}
                </p>
              </div>

              <div>
                {/* Progress Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ color: "var(--muted)" }}>Citizen Consensus</span>
                    <span style={{ color: isEscalated ? "var(--low)" : "var(--turmeric)" }}>
                      {p.votes} / {p.requiredVotes} Votes ({percent}%)
                    </span>
                  </div>

                  <div style={{ height: 8, borderRadius: 99, background: "var(--line-dark)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: isEscalated ? "var(--low)" : "var(--turmeric)",
                        borderRadius: 99,
                        transition: "width .4s ease"
                      }}
                    />
                  </div>
                </div>

                {/* Proposer Info & Vote Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line-dark)", paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Proposed by: <b style={{ color: "var(--ink-text)" }}>{p.proposer}</b>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSupport(p.id)}
                    disabled={hasVoted}
                    className="ge-btn"
                    style={{
                      padding: "8px 16px",
                      fontSize: 12.5,
                      background: hasVoted ? "rgba(95,168,114,0.15)" : "var(--turmeric)",
                      color: hasVoted ? "var(--low)" : "#231402",
                      border: hasVoted ? "1px solid var(--low)" : "none",
                      cursor: hasVoted ? "default" : "pointer"
                    }}
                  >
                    {hasVoted ? (
                      <>
                        <Check size={14} /> Voted
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={14} /> Support Proposal (+10 XP)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Proposal Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(8, 19, 12, 0.8)",
            backdropFilter: "blur(12px)",
            animation: "geFadeIn 0.25s ease-out"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            className="ge-card"
            style={{
              width: "100%",
              maxWidth: 520,
              padding: "30px 24px",
              borderRadius: 20,
              animation: "geFadeUp 0.25s ease-out"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="ge-serif" style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-text)" }}>
                Submit a Village Development Proposal
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  Proposal Title (प्रस्ताव का शीर्षक)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 New Solar Streetlights on Temple Road..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 12px",
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
                    Ward (वार्ड)
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1.5px solid var(--line-dark)",
                      padding: "10px 12px",
                      fontSize: 13,
                      background: "#fff",
                      outline: "none"
                    }}
                  >
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                    <option value="Ward 4">Ward 4</option>
                    <option value="Ward 5">Ward 5</option>
                    <option value="Ward 6">Ward 6</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>
                    Category (विभाग)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1.5px solid var(--line-dark)",
                      padding: "10px 12px",
                      fontSize: 13,
                      background: "#fff",
                      outline: "none"
                    }}
                  >
                    <option value="Public Works">Public Works (Roads)</option>
                    <option value="Water Supply">Water Supply (PHE)</option>
                    <option value="Electricity">Electricity & Solar</option>
                    <option value="Sanitation">Sanitation & Drainage</option>
                    <option value="Education">School & Education</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6, display: "block" }}>
                  Detailed Description (विवरण व आवश्यकता)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why this project is important for the village and who will benefit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-dark)",
                    padding: "10px 12px",
                    fontSize: 13,
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="ge-btn ge-btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ge-btn ge-btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Publish Proposal & Earn +25 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
