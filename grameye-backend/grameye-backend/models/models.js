const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ---------------- Village & Ward ---------------- */
const villageSchema = new Schema(
  {
    name: { type: String, required: true },
    district: String,
    state: String,
    population: Number,
    developmentScore: { type: Number, default: 0 }, // 0-100, recalculated from complaint data
  },
  { timestamps: true }
);

const wardSchema = new Schema(
  {
    name: { type: String, required: true },
    village: { type: Schema.Types.ObjectId, ref: "Village", required: true },
    population: Number,
  },
  { timestamps: true }
);

/* ---------------- Department ---------------- */
const departmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

/* ---------------- User ---------------- */
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ["CITIZEN", "OFFICER", "ADMIN"], default: "CITIZEN" },
    village: { type: Schema.Types.ObjectId, ref: "Village" },
    ward: { type: Schema.Types.ObjectId, ref: "Ward" },
    department: { type: Schema.Types.ObjectId, ref: "Department" }, // for OFFICER role
    preferredLanguage: { type: String, enum: ["en", "hi"], default: "en" },
    xp: { type: Number, default: 0 },
    badges: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ---------------- Complaint ---------------- */
const complaintSchema = new Schema(
  {
    complaintCode: { type: String, required: true, unique: true }, // e.g. GRM-1042
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED", "REOPENED"],
      default: "PENDING",
    },
    progress: { type: Number, default: 0 }, // 0-100

    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    village: { type: Schema.Types.ObjectId, ref: "Village" },
    ward: { type: Schema.Types.ObjectId, ref: "Ward" },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    assignedOfficer: { type: Schema.Types.ObjectId, ref: "User" },

    images: [{ url: String, type: { type: String, enum: ["BEFORE", "AFTER", "GENERAL"], default: "GENERAL" } }],
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    aiAnalysis: {
      confidence: Number,
      safetyRisk: String,
      suggestedDepartment: String,
      analyzedAt: Date,
    },

    isDuplicateOf: { type: Schema.Types.ObjectId, ref: "Complaint", default: null },
    votes: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ---------------- Complaint Status History ---------------- */
const complaintStatusHistorySchema = new Schema(
  {
    complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true },
    status: { type: String, required: true },
    note: String,
    changedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* ---------------- Notification ---------------- */
const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    relatedComplaint: { type: Schema.Types.ObjectId, ref: "Complaint" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ---------------- Reward / XP log ---------------- */
const rewardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g. "Report submitted", "Citizen verification"
    relatedComplaint: { type: Schema.Types.ObjectId, ref: "Complaint" },
  },
  { timestamps: true }
);

const badgeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    criteria: String,
  },
  { timestamps: true }
);

module.exports = {
  Village: mongoose.model("Village", villageSchema),
  Ward: mongoose.model("Ward", wardSchema),
  Department: mongoose.model("Department", departmentSchema),
  User: mongoose.model("User", userSchema),
  Complaint: mongoose.model("Complaint", complaintSchema),
  ComplaintStatusHistory: mongoose.model("ComplaintStatusHistory", complaintStatusHistorySchema),
  Notification: mongoose.model("Notification", notificationSchema),
  Reward: mongoose.model("Reward", rewardSchema),
  Badge: mongoose.model("Badge", badgeSchema),
};
