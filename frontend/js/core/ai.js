/**
 * AI interpretation via Google Gemini API (free tier, 60 req/min).
 * User provides their own API key via Settings.
 */

import { getSettings } from "../store.js";

let CONFIG = { GEMINI_API_KEY: "" };
try {
  const mod = await import("../config.js");
  CONFIG = mod.CONFIG || CONFIG;
} catch (_) { /* config.js not present (e.g. GitHub Pages) — use Settings key */ }

const SYSTEM = `You are a warm, insightful astrologer who gives practical, grounded interpretations.
Speak directly to the person using "you". Use vivid language. Balance cosmic symbolism with real-life advice.
Keep readings around 3-4 paragraphs. Cover emotional, practical, and action-oriented aspects.
Never use scary or fatalistic language. Be empowering.`;

function getApiKey() {
  return getSettings().gemini_api_key || CONFIG.GEMINI_API_KEY || "";
}

function geminiUrl(key) {
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`;
}

export async function interpretTransit(hit, chart, lang) {
  const langLine = lang === "sr" ? "Respond in Serbian." : lang === "de" ? "Respond in German." : "Respond in English.";
  const sun = chart.planets.find(p => p.name === "Sun");
  const moon = chart.planets.find(p => p.name === "Moon");
  const ascSign = signAt(chart.houses.ascendant);

  const prompt = `${langLine}
Interpret this transit for ${chart.birth.name || "this person"} (Sun in ${sun?.sign}, Moon in ${moon?.sign}, ASC ${ascSign}):
Transiting ${hit.transit_planet} ${hit.aspect} natal ${hit.natal_point} around ${new Date(hit.date).toLocaleDateString()}.
Orb: ${hit.orb_at_exact.toFixed(2)}°${hit.is_retrograde ? ", retrograde" : ""}.
Cover: emotions/relationships, career/money, health/energy, and practical advice. 3-4 short paragraphs.`;

  return callGemini(prompt);
}

export async function interpretChartAI(chart, topic, lang) {
  const langLine = lang === "sr" ? "Respond in Serbian." : lang === "de" ? "Respond in German." : "Respond in English.";
  const topicLabels = { love: "Love & Relationships", work: "Career & Money", health: "Health & Wellbeing" };

  const placements = chart.planets.slice(0, 10).map(p =>
    `${p.name} in ${p.sign} (house ${p.house}${p.is_retrograde ? " R" : ""})`
  ).join(", ");

  const aspects = chart.aspects.slice(0, 8).map(a =>
    `${a.planet1} ${a.aspect} ${a.planet2}`
  ).join(", ");

  const prompt = `${langLine}
Detailed natal chart reading for ${chart.birth.name || "this person"} about: ${topicLabels[topic] || topic}.
Placements: ${placements}. ASC: ${signAt(chart.houses.ascendant)}, MC: ${signAt(chart.houses.midheaven)}.
Key aspects: ${aspects}.
Write 4-5 paragraphs. Cross-reference placements. Be warm and practical.`;

  return callGemini(prompt);
}

async function callGemini(userPrompt) {
  const key = getApiKey();
  if (!key) {
    throw new Error("NO_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(geminiUrl(key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    });
    clearTimeout(timeout);

    if (res.status === 400 || res.status === 403) throw new Error("Invalid API key. Check Settings.");
    if (res.status === 429) throw new Error("Rate limit reached. Wait a moment and try again.");
    if (!res.ok) throw new Error(`Gemini returned ${res.status}`);

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini");
    return text.trim();
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === "AbortError") throw new Error("Request timed out — try again.");
    throw e;
  }
}

function signAt(lon) {
  const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return signs[Math.floor(lon / 30) % 12];
}
