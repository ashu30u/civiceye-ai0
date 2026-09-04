require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const aiRoutes = require("./routes/aiRoutes");
const villageRoutes = require("./routes/villageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const socialRoutes = require("./routes/socialRoutes");
const healthRoutes = require("./routes/healthRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({ message: "GramEye AI API is running", aiMode: process.env.AI_MODE || "mock" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/village", villageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/community", communityRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🌾 GramEye AI backend running on http://localhost:${PORT}`));
});
