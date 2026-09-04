require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const {
  Village, Ward, Department, User, Complaint, ComplaintStatusHistory, Reward,
} = require("../models/models");

const DEPARTMENTS = [
  "Gram Panchayat", "Water Department", "Electricity Department", "Public Works",
  "Sanitation", "Education", "Healthcare", "Environment", "Transport",
];

const CATEGORY_DEPT = {
  "Road Damage": "Public Works",
  "Water Leakage": "Water Department",
  "Broken Streetlight": "Electricity Department",
  "Garbage & Drainage": "Sanitation",
  "Electrical Hazard": "Electricity Department",
  "School Infrastructure": "Education",
  "Healthcare Access": "Healthcare",
  "Transport Issue": "Transport",
  "Environmental": "Environment",
};

const SEED_COMPLAINTS = [
  ["Large pothole outside primary school", "Road Damage", "Ward 4", "HIGH", "IN_PROGRESS", 64],
  ["Handpump broken for 5 days", "Water Leakage", "Ward 2", "HIGH", "ASSIGNED", 20],
  ["Streetlight out near bus stop", "Broken Streetlight", "Ward 1", "MEDIUM", "PENDING", 0],
  ["Garbage piling near market", "Garbage & Drainage", "Ward 3", "MEDIUM", "IN_PROGRESS", 45],
  ["Exposed live wire near field", "Electrical Hazard", "Ward 5", "CRITICAL", "ASSIGNED", 10],
  ["Cracked classroom wall", "School Infrastructure", "Ward 4", "HIGH", "RESOLVED", 100],
  ["Blocked drain, water stagnating", "Garbage & Drainage", "Ward 2", "MEDIUM", "RESOLVED", 100],
  ["No streetlight on temple road", "Broken Streetlight", "Ward 6", "LOW", "PENDING", 0],
  ["Bus stop shelter damaged", "Transport Issue", "Ward 3", "LOW", "VERIFIED", 12],
  ["Pond edge eroding near farmland", "Environmental", "Ward 6", "MEDIUM", "IN_PROGRESS", 30],
  ["Health sub-centre roof leaking", "Healthcare Access", "Ward 5", "HIGH", "PENDING", 0],
  ["Road washed out after rain", "Road Damage", "Ward 1", "CRITICAL", "IN_PROGRESS", 55],
];

async function run() {
  await connectDB();
  console.log("Clearing existing demo data...");
  await Promise.all([
    Village.deleteMany({}), Ward.deleteMany({}), Department.deleteMany({}),
    User.deleteMany({}), Complaint.deleteMany({}), ComplaintStatusHistory.deleteMany({}), Reward.deleteMany({}),
  ]);

  const village = await Village.create({
    name: "Kodebod Village", district: "Dhamtari", state: "Chhattisgarh",
    population: 1870, developmentScore: 82,
  });

  const wardDocs = {};
  for (const name of ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6"]) {
    wardDocs[name] = await Ward.create({ name, village: village._id, population: 312 });
  }

  const deptDocs = {};
  for (const name of DEPARTMENTS) {
    deptDocs[name] = await Department.create({ name, description: `${name} of Kodebod Panchayat` });
  }

  const password = await bcrypt.hash("Demo@123", 10);

  const citizen = await User.create({
    fullName: "Rahul Sharma", email: "citizen@grameye.demo", mobile: "9876500001",
    password, role: "CITIZEN", village: village._id, ward: wardDocs["Ward 4"]._id, xp: 340,
    badges: ["Village Helper", "Road Reporter"],
  });

  const officer = await User.create({
    fullName: "Suresh Officer", email: "officer@grameye.demo", mobile: "9876500002",
    password, role: "OFFICER", village: village._id, department: deptDocs["Public Works"]._id,
  });

  const admin = await User.create({
    fullName: "Anita Admin", email: "admin@grameye.demo", mobile: "9876500003",
    password, role: "ADMIN", village: village._id,
  });

  // A few more citizens so complaints have varied reporters
  const otherNames = ["Meena Devi", "Suresh Kumar", "Anita Patel", "Ramesh Verma"];
  const others = [];
  for (const n of otherNames) {
    others.push(await User.create({
      fullName: n, email: `${n.split(" ")[0].toLowerCase()}@grameye.demo`,
      password, role: "CITIZEN", village: village._id, ward: wardDocs["Ward " + (1 + others.length % 6)]._id,
      xp: 200 + others.length * 80,
    }));
  }

  console.log("Seeding complaints...");
  for (let i = 0; i < SEED_COMPLAINTS.length; i++) {
    const [title, category, wardName, severity, status, progress] = SEED_COMPLAINTS[i];
    const reporter = i % 3 === 0 ? citizen : others[i % others.length];
    const complaint = await Complaint.create({
      complaintCode: `GRM-${1020 + i}`,
      title, description: title, category, severity, status, progress,
      reporter: reporter._id,
      village: village._id,
      ward: wardDocs[wardName]._id,
      department: deptDocs[CATEGORY_DEPT[category]]._id,
      assignedOfficer: status !== "PENDING" ? officer._id : null,
      votes: 3 + i * 2,
      aiAnalysis: {
        confidence: 0.88 + (i % 7) * 0.01,
        safetyRisk: severity === "CRITICAL" ? "Immediate danger to life or property" : "Accident or health hazard if unresolved",
        suggestedDepartment: CATEGORY_DEPT[category],
        analyzedAt: new Date(),
      },
    });
    await ComplaintStatusHistory.create({ complaint: complaint._id, status: "PENDING", note: "Complaint submitted by citizen" });
    if (status !== "PENDING") {
      await ComplaintStatusHistory.create({ complaint: complaint._id, status, changedBy: officer._id });
    }
    await Reward.create({ user: reporter._id, points: 20, reason: "Report submitted", relatedComplaint: complaint._id });
  }

  console.log("✅ Seed complete.");
  console.log("Demo accounts (password for all: Demo@123):");
  console.log("  Citizen: citizen@grameye.demo");
  console.log("  Officer: officer@grameye.demo");
  console.log("  Admin:   admin@grameye.demo");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
