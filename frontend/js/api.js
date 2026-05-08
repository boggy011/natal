/**
 * API module — all computation is local (no backend required).
 */

import { computeChart as calcChart, scanTransits as calcTransits } from "./core/calc.js";
import { generateLifeReading } from "./core/readings.js";
export { interpretTransit, interpretChartAI } from "./core/ai.js";

export function computeChart(birth, config = {}) {
  return Promise.resolve(calcChart(birth, config));
}

export function interpretChart(chart, lang = "en") {
  return Promise.resolve(generateLifeReading(chart, lang));
}

export function scanTransits(chart, start, end, filters = {}) {
  return Promise.resolve(calcTransits(chart, start, end, filters));
}

export async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { "User-Agent": "NatalChart-App" } });
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.length) throw new Error("No results");

  const loc = data[0];
  const lat = parseFloat(loc.lat);
  const lon = parseFloat(loc.lon);

  let timezone = "UTC";
  try {
    const tzRes = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`);
    if (tzRes.ok) {
      const tzData = await tzRes.json();
      timezone = tzData.timeZone || "UTC";
    }
  } catch {
    const offset = Math.round(lon / 15);
    timezone = `Etc/GMT${offset <= 0 ? "+" : "-"}${Math.abs(offset)}`;
  }

  return { display_name: loc.display_name, latitude: lat, longitude: lon, timezone };
}
