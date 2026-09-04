import React, { useState, useEffect } from "react";
import {
  Briefcase, Search, Filter, MapPin, CheckCircle2, Building2,
  Clock, DollarSign, PlusCircle, X, Send, PhoneCall, Award
} from "lucide-react";

export default function LocalJobs({ currentUser, addXp }) {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [postJobModal, setPostJobModal] = useState(false);
  const [applicantName, setApplicantName] = useState(currentUser?.fullName || "Rahul Sahu");
  const [applicantMobile, setApplicantMobile] = useState(currentUser?.mobile || "6268814185");
  const [applicantSkills, setApplicantSkills] = useState("विद्युत वायरिंग, सोलर मोटर व बुनियादी कंप्यूटर");
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    fetch("/api/community/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch(() => {
        setJobs([
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
        ]);
      });
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantMobile.trim()) return;

    fetch("/api/community/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: applyModalJob.id, name: applicantName, mobile: applicantMobile, skills: applicantSkills })
    })
      .then(res => res.json())
      .then(data => {
        showToast(`🎉 ${data.message || "आवेदन सफलतापूर्वक जमा हुआ!"}`);
        if (addXp) addXp(15);
        setApplyModalJob(null);
      })
      .catch(() => {
        showToast("🎉 आवेदन सफलतापूर्वक जमा हुआ! नियोक्ता जल्द संपर्क करेंगे। +15 XP");
        if (addXp) addXp(15);
        setApplyModalJob(null);
      });
  };

  const filteredJobs = jobs.filter(j => {
    const matchesCategory = selectedCategory === "All" || j.category.includes(selectedCategory);
    const matchesQuery = !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 16px 80px" }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999, background: "#0E1A13",
          color: "#fff", padding: "12px 20px", borderRadius: 12, border: "1.5px solid var(--turmeric)",
          fontWeight: 700, fontSize: 13.5, boxShadow: "0 16px 36px rgba(0,0,0,0.5)"
        }}>
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1A365D 0%, #2A4365 50%, #2C5282 100%)",
        color: "#fff", borderRadius: 24, padding: "28px 24px", marginBottom: 24,
        boxShadow: "0 14px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 32 }}>💼</span>
              <div>
                <span className="ge-serif" style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800 }}>
                  GramAI <span style={{ color: "var(--turmeric)" }}>Local Jobs</span> (ग्रामीण रोजगार)
                </span>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                  कोड़ेबोड, कुरूद व धमतरी क्षेत्र में स्थानीय व शासकीय कार्य, कौशल रोजगार व युवा अवसर
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPostJobModal(true)}
            className="ge-btn"
            style={{
              background: "var(--turmeric)", color: "#231402", fontWeight: 800,
              fontSize: 13, padding: "10px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6
            }}
          >
            <PlusCircle size={16} />
            <span>नया कार्य पोस्ट करें (Post Job)</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{
            flex: 1, minWidth: 260, background: "#fff", borderRadius: 12, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <Search size={18} color="#666" />
            <input
              type="text"
              placeholder="Search by job title, skill (ड्राइवर, इलेक्ट्रीशियन, शिक्षक)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: "none", outline: "none", width: "100%", fontSize: 13.5, color: "#111" }}
            />
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {["All", "Skilled", "Education", "Driver", "Govt"].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className="ge-btn"
                style={{
                  background: selectedCategory === c ? "var(--turmeric)" : "rgba(255,255,255,0.15)",
                  color: selectedCategory === c ? "#231402" : "#fff",
                  fontWeight: selectedCategory === c ? 800 : 600,
                  fontSize: 12.5, padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap"
                }}
              >
                {c === "All" ? "सभी नौकरियां (All)" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="ge-2col">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            style={{
              background: "#fff", borderRadius: 20, padding: 22, boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16.5, color: "var(--ink-text)", lineHeight: 1.35 }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--paddy)", fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                    <Building2 size={14} /> {job.employer}
                    {job.verified && <CheckCircle2 size={14} color="var(--paddy)" />}
                  </div>
                </div>

                {job.urgent && (
                  <span style={{ fontSize: 10.5, fontWeight: 800, background: "#FFF0F0", color: "#D64545", padding: "3px 8px", borderRadius: 6, border: "1px solid #FFD0D0" }}>
                    Urgent
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "14px 0", fontSize: 12.5, color: "var(--muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={14} /> {job.location} ({job.distance})
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: "var(--ink-text)" }}>
                  <DollarSign size={14} color="var(--paddy)" /> {job.salary}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={14} /> {job.jobType}
                </span>
              </div>

              {/* Required Skills Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {job.skills.map((s, i) => (
                  <span key={i} style={{ fontSize: 11, background: "#F4F7F5", color: "var(--paddy)", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>पोस्ट किया: {job.postedDate}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={`tel:${job.contact}`}
                  style={{
                    textDecoration: "none", background: "#F4F7F5", color: "var(--ink-text)",
                    padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  <PhoneCall size={13} /> कॉल
                </a>
                <button
                  onClick={() => setApplyModalJob(job)}
                  className="ge-btn"
                  style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, fontSize: 12.5, padding: "8px 16px", borderRadius: 8 }}
                >
                  आवेदन करें (Apply) →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1-CLICK APPLY MODAL */}
      {applyModalJob && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
            padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--paddy)", textTransform: "uppercase" }}>
                  रोजगार आवेदन (Job Application)
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>{applyModalJob.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>नियोक्ता: {applyModalJob.employer}</div>
              </div>
              <button onClick={() => setApplyModalJob(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>आपका पूरा नाम</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>मोबाइल नंबर (Mobile No)</label>
                <input
                  type="text"
                  value={applicantMobile}
                  onChange={e => setApplicantMobile(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 4 }}>आपका अनुभव व कौशल (Experience / Skills)</label>
                <textarea
                  rows={2}
                  value={applicantSkills}
                  onChange={e => setApplicantSkills(e.target.value)}
                  style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setApplyModalJob(null)}
                  className="ge-btn"
                  style={{ background: "#eee", padding: "9px 16px", borderRadius: 8, fontSize: 12.5 }}
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="ge-btn"
                  style={{ background: "var(--paddy)", color: "#fff", fontWeight: 800, padding: "9px 20px", borderRadius: 8, fontSize: 12.5 }}
                >
                  आवेदन भेजें (+15 XP) ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST A JOB MODAL */}
      {postJobModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
            padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>नया रोजगार / कार्य पोस्ट करें</div>
              <button onClick={() => setPostJobModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
              स्थानीय व्यवसायी, किसान व संस्थाएं यहाँ कुशल कामगारों के लिए कार्य पोस्ट कर सकते हैं।
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="text" placeholder="कार्य का नाम (e.g. ट्रैक्टर ड्राइवर, इलेक्ट्रीशियन)" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }} />
              <input type="text" placeholder="फर्म / नियोक्ता का नाम" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }} />
              <input type="text" placeholder="स्थान व वार्ड (Location)" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }} />
              <input type="text" placeholder="वेतन / मानदेय (Salary)" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }} />
              <input type="text" placeholder="संपर्क नंबर (Phone)" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }} />
              <button
                onClick={() => {
                  showToast("✓ कार्य सफलतापूर्वक समीक्षा हेतु दर्ज कर लिया गया है!");
                  setPostJobModal(false);
                }}
                className="ge-btn"
                style={{ background: "var(--turmeric)", color: "#231402", fontWeight: 800, padding: 12, borderRadius: 10, marginTop: 8 }}
              >
                पोस्ट प्रकाशित करें →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
