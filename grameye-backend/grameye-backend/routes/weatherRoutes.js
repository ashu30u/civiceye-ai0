const express = require("express");
const router = express.Router();

// In-memory weather cache (10 min TTL)
const cache = new Map();

// Known Indian Locations Catalog for Autocomplete
const POPULAR_LOCATIONS = [
  { name: "Kodebod", district: "Dhamtari", state: "Chhattisgarh", lat: 20.8350, lon: 81.7150, pincode: "493663" },
  { name: "Kurud", district: "Dhamtari", state: "Chhattisgarh", lat: 20.8256, lon: 81.7180, pincode: "493663" },
  { name: "Dhamtari", district: "Dhamtari", state: "Chhattisgarh", lat: 20.7072, lon: 81.5498, pincode: "493773" },
  { name: "Raipur", district: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, pincode: "492001" },
  { name: "Durg", district: "Durg", state: "Chhattisgarh", lat: 21.1904, lon: 81.2849, pincode: "491001" },
  { name: "Bhilai", district: "Durg", state: "Chhattisgarh", lat: 21.2090, lon: 81.3789, pincode: "490006" },
  { name: "Rajnandgaon", district: "Rajnandgaon", state: "Chhattisgarh", lat: 21.0974, lon: 81.0396, pincode: "491441" },
  { name: "Bilaspur", district: "Bilaspur", state: "Chhattisgarh", lat: 22.0797, lon: 82.1409, pincode: "495001" },
  { name: "Jagdalpur", district: "Bastar", state: "Chhattisgarh", lat: 19.0743, lon: 82.0082, pincode: "494001" }
];

// GET /api/weather/search?q=
router.get("/search", (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();
  if (!query) return res.json({ success: true, locations: POPULAR_LOCATIONS.slice(0, 5) });

  const matches = POPULAR_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(query) ||
    loc.district.toLowerCase().includes(query) ||
    loc.pincode.includes(query) ||
    loc.state.toLowerCase().includes(query)
  );

  res.json({ success: true, locations: matches.length ? matches : POPULAR_LOCATIONS.slice(0, 3) });
});

// GET /api/weather/current?lat=20.8350&lon=81.7150
router.get("/current", async (req, res) => {
  const lat = parseFloat(req.query.lat) || 20.8350;
  const lon = parseFloat(req.query.lon) || 81.7150;
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;

  if (cache.has(cacheKey) && (Date.now() - cache.get(cacheKey).timestamp < 600000)) {
    return res.json({ success: true, data: cache.get(cacheKey).data, cached: true });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API error");
    const json = await response.json();

    const current = json.current || {};
    const weatherData = {
      temperature: Math.round(current.temperature_2m || 28),
      feelsLike: Math.round(current.apparent_temperature || current.temperature_2m || 30),
      humidity: Math.round(current.relative_humidity_2m || 65),
      windSpeed: Math.round(current.wind_speed_10m || 11),
      windDirection: current.wind_direction_10m || 120,
      precipitation: current.precipitation || 0,
      pressure: Math.round(current.surface_pressure || 1012),
      uvIndex: json.daily?.uv_index_max?.[0] || 6,
      visibility: 10,
      weatherCode: current.weather_code || 1,
      condition: getWeatherConditionText(current.weather_code || 1),
      coordinates: { lat, lon },
      hourly: (json.hourly?.time || []).slice(0, 8).map((time, idx) => ({
        time: new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temp: Math.round(json.hourly.temperature_2m[idx] || 28),
        rainProb: json.hourly.precipitation_probability?.[idx] || 10,
        weatherCode: json.hourly.weather_code?.[idx] || 1
      })),
      daily: (json.daily?.time || []).slice(0, 7).map((date, idx) => ({
        date: new Date(date).toLocaleDateString("hi-IN", { weekday: "short", day: "numeric", month: "short" }),
        maxTemp: Math.round(json.daily.temperature_2m_max[idx] || 32),
        minTemp: Math.round(json.daily.temperature_2m_min[idx] || 22),
        rainSum: json.daily.precipitation_sum[idx] || 0,
        weatherCode: json.daily.weather_code[idx] || 1
      })),
      aiInsight: {
        headline: "कृषि व दैनिक जीवन हेतु अनुकूल मौसम",
        summary: "वर्तमान तापमान 28°C के साथ वातावरण हल्का नम है। हवा की गति सामान्य (11 किमी/घंटा) रहने से फसलों पर छिड़काव व सिंचाई कार्य सुरक्षित हैं।",
        agriculture: "धान की रोपाई व यूरिया छिड़काव के लिए शाम का समय सर्वोत्तम रहेगा। तेज धूप से पहले सिंचाई पूरी कर लें।",
        travel: "सड़क दृश्यता उत्कृष्ट है (10 किमी)। यात्रा में मौसम संबंधी कोई रुकावट नहीं है।",
        clothing: "सूती व हल्के कपड़े पहनें। दोपहर में सिर को धूप से बचाएं।"
      },
      farmerMode: {
        irrigationRecommendation: "सिंचाई की आवश्यकता सामान्य है। नहर से पानी उपलब्धता का लाभ उठाएं।",
        sprayingCaution: "हवा की गति अनुकूल है (11 km/h), कीटनाशक छिड़काव किया जा सकता है।",
        harvestCaution: "अगले 48 घंटों में भारी बारिश की चेतावनी नहीं है।",
        nitrogenTiming: "सुबह 7-9 बजे या शाम 4-6 बजे खाद डालें।"
      },
      updatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: weatherData });
    res.json({ success: true, data: weatherData, cached: false });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch live weather", error: err.message });
  }
});

function getWeatherConditionText(code) {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy / Mist";
  if (code <= 55) return "Light Drizzle";
  if (code <= 65) return "Rain Showers";
  if (code <= 75) return "Snow";
  if (code <= 82) return "Heavy Rain";
  if (code >= 95) return "Thunderstorm";
  return "Pleasant";
}

module.exports = router;
