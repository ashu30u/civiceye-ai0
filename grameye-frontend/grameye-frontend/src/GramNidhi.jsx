import React, { useState } from "react";
import {
  Building2, TrendingUp, IndianRupee, ShieldCheck, CheckCircle2,
  AlertTriangle, Filter, Download, ArrowUpRight, Award, PieChart as PieIcon,
  Search, FileText, Check, ThumbsUp, ThumbsDown
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

const FUND_ALLOCATION = [
  { name: "Public Works (Roads)", amount: 1420000, color: "#E0703A" },
  { name: "Water Supply (PHE)", amount: 840000, color: "#3C87A6" },
  { name: "Electricity & Solar", amount: 415000, color: "#E8A33D" },
  { name: "Sanitation & Drains", amount: 360000, color: "#7A8B4A" },
  { name: "School & Health", amount: 180400, color: "#7A5FBF" },
];

const INITIAL_EXPENSES = [
  {
    id: "EXP-8901",
    complaintId: "GRM-1020",
    title: "Primary school front road pothole cold mix recarpeting",
    ward: "Ward 4",
    contractor: "Shahu Earthmovers & Construction Pvt Ltd",
    amount: 35000,
    status: "PAID",
    date: "2026-08-28",
    scheme: "15th Finance Commission Untied Grant",
    upvotes: 42,
    downvotes: 1
  },
  {
    id: "EXP-8902",
    complaintId: "GRM-1021",
    title: "Main water pipeline valve & high-pressure pipe repair",
    ward: "Ward 2",
    contractor: "Shree Ram Hydro & Sanitation Services",
    amount: 18500,
    status: "PAID",
    date: "2026-08-25",
    scheme: "Jal Jeevan Mission Maintenance Fund",
    upvotes: 56,
    downvotes: 0
  },
  {
    id: "EXP-8903",
    complaintId: "GRM-1024",
    title: "High voltage transformer wire insulator replacement",
    ward: "Ward 5",
    contractor: "CSPDCL Substation Line Crew",
    amount: 24000,
    status: "IN_PROGRESS",
    date: "2026-09-01",
    scheme: "Saubhagya Rural Electrification Scheme",
    upvotes: 29,
    downvotes: 0
  },
  {
    id: "EXP-8904",
    complaintId: "GRM-1022",
    title: "Bus stop solar streetlight bracket & 40W LED replacement",
    ward: "Ward 1",
    contractor: "Surya Urja Rural Tech",
    amount: 8200,
    status: "PENDING_AUDIT",
    date: "2026-09-02",
    scheme: "Panchayat Own Source Revenue (OSR)",
    upvotes: 18,
    downvotes: 2
  },
  {
    id: "EXP-8905",
    complaintId: "GRM-1025",
    title: "Primary school classroom structural wall plastering",
    ward: "Ward 4",
    contractor: "Kodebod Gram Nirman Samiti",
    amount: 45000,
    status: "PAID",
    date: "2026-08-20",
    scheme: "Samagra Shiksha Abhiyan Grant",
    upvotes: 64,
    downvotes: 1
  }
];

export default function GramNidhi({ complaints = [] }) {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [filterDept, setFilterDept] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [userVoted, setUserVoted] = useState({});

  const totalSanctioned = 4850000;
  const totalUtilized = expenses.reduce((sum, e) => sum + e.amount, 3100000);
  const remainingTreasury = totalSanctioned - totalUtilized;
  const utilizationPercent = Math.round((totalUtilized / totalSanctioned) * 100);

  const handleVote = (expId, isUp) => {
    if (userVoted[expId]) return;
    setUserVoted((prev) => ({ ...prev, [expId]: isUp ? "up" : "down" }));
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === expId) {
          return {
            ...e,
            upvotes: isUp ? e.upvotes + 1 : e.upvotes,
            downvotes: !isUp ? e.downvotes + 1 : e.downvotes
          };
        }
        return e;
      })
    );
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 24px 90px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>💰</span>
            <div className="ge-serif" style={{ fontSize: 28, fontWeight: 700, color: "var(--ink-text)" }}>
              Gram Nidhi — Village Financial Ledger
            </div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            100% Transparent, Blockchain-Audit Inspired Public Ledger of Panchayat Kodebod (FY 2026-27)
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="ge-btn ge-btn-ghost"
            style={{ fontSize: 13 }}
            onClick={() => window.print()}
          >
            <Download size={15} /> Download Audit Sheet
          </button>
        </div>
      </div>

      {/* Top 4 Financial Overview Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }} className="ge-4col">
        <div className="ge-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Total Sanctioned Grant
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink-text)", marginTop: 6 }}>
            ₹{(totalSanctioned / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: 11, color: "var(--paddy)", fontWeight: 700, marginTop: 4 }}>
            15th FC + Jal Jeevan + MGNREGA
          </div>
        </div>

        <div className="ge-card" style={{ padding: 20, borderLeft: "4px solid var(--turmeric)" }}>
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Utilized on Grievances & Works
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#B97417", marginTop: 6 }}>
            ₹{(totalUtilized / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            {utilizationPercent}% of Budget Allocated
          </div>
        </div>

        <div className="ge-card" style={{ padding: 20, borderLeft: "4px solid var(--low)" }}>
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Available Treasury Balance
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--low)", marginTop: 6 }}>
            ₹{(remainingTreasury / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: 11, color: "var(--low)", fontWeight: 700, marginTop: 4 }}>
            ✓ Verified Bank Account Balance
          </div>
        </div>

        <div className="ge-card" style={{ padding: 20, borderLeft: "4px solid var(--tank)" }}>
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Citizen Social Audit Score
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--tank)", marginTop: 6 }}>
            94.8%
          </div>
          <div style={{ fontSize: 11, color: "var(--tank)", fontWeight: 700, marginTop: 4 }}>
            245+ Villagers Voted "Genuine"
          </div>
        </div>
      </div>

      {/* Middle Grid: Expense Breakdown Chart & Schemes */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 28 }} className="ge-hero-grid">
        {/* Department Allocation Chart */}
        <div className="ge-card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <PieIcon size={18} color="var(--turmeric)" />
            <span>Fund Allocation by Sector (₹)</span>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUND_ALLOCATION} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(14,26,19,0.06)" />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 100000}L`} fontSize={11} />
                <YAxis dataKey="name" type="category" width={130} fontSize={11} tick={{ fill: "var(--ink-text)" }} />
                <Tooltip formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, "Allocation"]} />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                  {FUND_ALLOCATION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Public Audit Trust Badge */}
        <div className="ge-card" style={{ padding: 22, background: "linear-gradient(145deg, #132A1C 0%, #0B1710 100%)", color: "#FBF8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--turmeric)", fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
            <ShieldCheck size={18} />
            <span>ANTI-CORRUPTION PUBLIC GUARANTEE</span>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.6, color: "#B4C6BA", marginBottom: 18 }}>
            GramEye AI links every single rupee spent by the Panchayat directly to an AI-verified complaint ID and photographic proof. No fake bills can be passed without geotagged Before/After evidence.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={15} color="var(--low)" />
              <span>Public tenders & vendor registration required</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={15} color="var(--low)" />
              <span>Mandatory Social Audit before payment release</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={15} color="var(--low)" />
              <span>QR code on every physical repair spot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Public Expenses Ledger */}
      <div className="ge-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink-text)" }}>
              Itemized Public Repair & Works Ledger
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
              Click thumbs up or down to participate in the citizen social audit of each repair bill.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search contractor, ID, ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: 99,
                  border: "1.5px solid var(--line-dark)",
                  padding: "8px 14px 8px 32px",
                  fontSize: 12.5,
                  outline: "none",
                  background: "#fff",
                  width: 220
                }}
              />
              <Search size={14} color="var(--muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--line-dark)", color: "var(--muted)", fontSize: 11, textTransform: "uppercase" }}>
                <th style={{ padding: "10px 12px" }}>Bill No / Complaint</th>
                <th style={{ padding: "10px 12px" }}>Work & Location</th>
                <th style={{ padding: "10px 12px" }}>Contractor / Vendor</th>
                <th style={{ padding: "10px 12px" }}>Amount (₹)</th>
                <th style={{ padding: "10px 12px" }}>Status</th>
                <th style={{ padding: "10px 12px", textAlign: "center" }}>Citizen Social Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  style={{
                    borderBottom: "1px solid var(--line-dark)",
                    transition: "background .15s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(31,77,54,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Bill No & Complaint */}
                  <td style={{ padding: "14px 12px" }}>
                    <div className="ge-mono" style={{ fontWeight: 800, color: "var(--paddy)", fontSize: 12.5 }}>
                      {exp.id}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>
                      Ref: {exp.complaintId}
                    </div>
                  </td>

                  {/* Work Title & Ward */}
                  <td style={{ padding: "14px 12px", maxWidth: 280 }}>
                    <div style={{ fontWeight: 700, color: "var(--ink-text)", lineHeight: 1.35 }}>
                      {exp.title}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                      📍 {exp.ward} • <span style={{ color: "#8B5E34" }}>{exp.scheme}</span>
                    </div>
                  </td>

                  {/* Contractor */}
                  <td style={{ padding: "14px 12px", fontSize: 12.5 }}>
                    <div style={{ fontWeight: 600 }}>{exp.contractor}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Date: {exp.date}</div>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink-text)" }}>
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 12px" }}>
                    <span
                      className="ge-chip"
                      style={{
                        background:
                          exp.status === "PAID"
                            ? "rgba(95,168,114,0.15)"
                            : exp.status === "IN_PROGRESS"
                            ? "rgba(232,163,61,0.15)"
                            : "rgba(14,26,19,0.08)",
                        color:
                          exp.status === "PAID"
                            ? "var(--low)"
                            : exp.status === "IN_PROGRESS"
                            ? "#B97417"
                            : "var(--ink-text)",
                        fontSize: 11,
                        padding: "3px 9px"
                      }}
                    >
                      {exp.status === "PAID" ? "✓ Paid & Verified" : exp.status === "IN_PROGRESS" ? "⏳ In Progress" : "🔍 Audit Review"}
                    </span>
                  </td>

                  {/* Citizen Social Audit Voting */}
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--husk)", padding: "4px 8px", borderRadius: 99 }}>
                      <button
                        type="button"
                        onClick={() => handleVote(exp.id, true)}
                        disabled={!!userVoted[exp.id]}
                        style={{
                          background: userVoted[exp.id] === "up" ? "var(--low)" : "none",
                          color: userVoted[exp.id] === "up" ? "#fff" : "var(--low)",
                          border: "none",
                          borderRadius: 99,
                          padding: "3px 6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 11.5,
                          fontWeight: 700
                        }}
                        title="Verify that this work was completed genuinely"
                      >
                        <ThumbsUp size={12} /> {exp.upvotes}
                      </button>

                      <span style={{ color: "var(--muted)", fontSize: 10 }}>|</span>

                      <button
                        type="button"
                        onClick={() => handleVote(exp.id, false)}
                        disabled={!!userVoted[exp.id]}
                        style={{
                          background: userVoted[exp.id] === "down" ? "var(--crit)" : "none",
                          color: userVoted[exp.id] === "down" ? "#fff" : "var(--crit)",
                          border: "none",
                          borderRadius: 99,
                          padding: "3px 6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 11.5,
                          fontWeight: 700
                        }}
                        title="Flag discrepancy in this bill"
                      >
                        <ThumbsDown size={12} /> {exp.downvotes}
                      </button>
                    </div>
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
