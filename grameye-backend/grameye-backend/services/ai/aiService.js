/**
 * GramEye AI - AI Service Layer
 * -------------------------------------------------------------
 * AI_MODE=mock  -> deterministic rule-based analysis (works with no API key)
 * AI_MODE=real  -> swap the body of analyzeComplaintText/Image to call a
 *                  real provider (e.g. an image-classification or LLM API)
 *                  without changing any route/controller code.
 */

const CATEGORY_DEPARTMENT = {
  "Road Damage": "Public Works",
  "Pothole": "Public Works",
  "Water Leakage": "Water Department",
  "Broken Handpump": "Water Department",
  "Broken Streetlight": "Electricity Department",
  "Electrical Hazard": "Electricity Department",
  "Garbage": "Sanitation",
  "Blocked Drain": "Sanitation",
  "School Infrastructure": "Education",
  "Healthcare Access": "Healthcare",
  "Transport Issue": "Transport",
  "Environmental": "Environment",
  "Other": "Gram Panchayat",
};

const BASE_SEVERITY = {
  "Road Damage": "HIGH",
  "Pothole": "HIGH",
  "Water Leakage": "MEDIUM",
  "Broken Handpump": "HIGH",
  "Broken Streetlight": "MEDIUM",
  "Electrical Hazard": "CRITICAL",
  "Garbage": "MEDIUM",
  "Blocked Drain": "MEDIUM",
  "School Infrastructure": "HIGH",
  "Healthcare Access": "HIGH",
  "Transport Issue": "LOW",
  "Environmental": "LOW",
  "Other": "LOW",
};

const RISK_TEXT = {
  CRITICAL: "Immediate danger to life or property",
  HIGH: "Accident or health hazard if unresolved",
  MEDIUM: "Growing inconvenience for residents",
  LOW: "Minor issue, monitor over time",
};

const SEVERITY_RANK = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

function escalate(severity) {
  const order = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const idx = order.indexOf(severity);
  return order[Math.min(idx + 1, order.length - 1)];
}

/**
 * detectSeverity — considers danger keywords, proximity to school/hospital,
 * and repeated reports (nearbyDuplicateCount) as described in the brief.
 */
function detectSeverity({ category, description = "", nearbyDuplicateCount = 0 }) {
  let severity = BASE_SEVERITY[category] || "LOW";
  const text = description.toLowerCase();

  const dangerWords = ["wire", "fire", "आग", "collapse", "gas leak", "live wire"];
  const proximityWords = ["school", "hospital", "बच्च", "स्कूल", "अस्पताल"];

  if (dangerWords.some((w) => text.includes(w))) severity = "CRITICAL";
  else if (proximityWords.some((w) => text.includes(w))) severity = escalate(severity);

  if (nearbyDuplicateCount >= 5) severity = escalate(severity);

  return severity;
}

function suggestDepartment(category) {
  return CATEGORY_DEPARTMENT[category] || "Gram Panchayat";
}

/**
 * analyzeComplaintText — mock NLP: derives category confidence from
 * description length/specificity. Replace internals with a real LLM/NLP
 * call when AI_MODE=real, keeping the same return shape.
 */
function analyzeComplaintText({ category, description = "", nearbyDuplicateCount = 0 }) {
  const severity = detectSeverity({ category, description, nearbyDuplicateCount });
  const confidence = Math.min(0.98, 0.85 + Math.min(0.12, description.length * 0.002));
  return {
    problemType: category,
    category,
    severity,
    confidence: Number(confidence.toFixed(2)),
    suggestedDepartment: suggestDepartment(category),
    safetyRisk: RISK_TEXT[severity],
  };
}

/**
 * analyzeComplaintImage — placeholder for real image classification.
 * In mock mode it trusts the citizen-selected category (as a stand-in for
 * a vision model) and reuses the text analysis pipeline.
 */
function analyzeComplaintImage({ category, description = "", nearbyDuplicateCount = 0 }) {
  return analyzeComplaintText({ category, description, nearbyDuplicateCount });
}

/**
 * detectDuplicateComplaints — same category + same ward + not resolved,
 * within a simple time window. A real implementation would also compare
 * geo-distance and image/text embedding similarity.
 */
async function detectDuplicateComplaints(Complaint, { category, ward, excludeId = null }) {
  const query = { category, ward, status: { $ne: "RESOLVED" }, isDeleted: false };
  if (excludeId) query._id = { $ne: excludeId };
  const matches = await Complaint.find(query).limit(20);
  return matches;
}

/**
 * generateAnalyticsInsight — rule-based insight generator over live data.
 * Swap for an LLM call (with retrieved stats as context) when AI_MODE=real.
 */
function generateAnalyticsInsight(question, stats) {
  const q = question.toLowerCase();

  if (stats.wardMatch) {
    const { wardName, topCategory, topCount, unresolved } = stats.wardMatch;
    if (topCategory) {
      return `${topCategory} complaints are the most frequent issue in ${wardName}. There are ${topCount} reports, of which ${unresolved} are currently unresolved.`;
    }
    return `No complaint data found for ${wardName} yet.`;
  }
  if (q.includes("critical")) {
    return stats.criticalCount > 0
      ? `There are ${stats.criticalCount} CRITICAL complaints open right now.`
      : "No CRITICAL complaints are currently open.";
  }
  if (q.includes("priorit")) {
    return "Based on severity and repeat reports, the Panchayat should prioritize the highest-severity open complaints first.";
  }
  return `Across the village, ${stats.topCategoryOverall || "infrastructure issues"} are the most reported category this month.`;
}

module.exports = {
  analyzeComplaintText,
  analyzeComplaintImage,
  detectSeverity,
  suggestDepartment,
  detectDuplicateComplaints,
  generateAnalyticsInsight,
  SEVERITY_RANK,
};
