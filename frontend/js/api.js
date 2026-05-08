/**
 * API module — all computation is local (no backend required).
 * Uses core/calc.js for chart computation and core/readings.js for interpretations.
 */

import { computeChart as calcChart } from "./core/calc.js";
import { generateLifeReading } from "./core/readings.js";

export function computeChart(birth, config = {}) {
  return Promise.resolve(calcChart(birth, config));
}

export function interpretChart(chart, lang = "en") {
  return Promise.resolve(generateLifeReading(chart, lang));
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
    timezone = guessTimezone(lon);
  }

  return {
    display_name: loc.display_name,
    latitude: lat,
    longitude: lon,
    timezone,
  };
}

function guessTimezone(lon) {
  const offset = Math.round(lon / 15);
  const abs = Math.abs(offset);
  const sign = offset >= 0 ? "+" : "-";
  return `Etc/GMT${offset <= 0 ? "+" : "-"}${abs}`;
}

export function listProfiles() { return Promise.resolve([]); }
export function createProfile() { return Promise.resolve(null); }
export function getProfile() { return Promise.resolve(null); }
export function deleteProfile() { return Promise.resolve(null); }

export function scanTransits(natal, start, end, filters = {}) {
  return Promise.resolve({ natal, range_start: start, range_end: end, hits: [] });
}
