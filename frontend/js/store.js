const CHARTS_KEY = "natal_charts";
const SETTINGS_KEY = "natal_settings";

export function getCharts() {
  const raw = localStorage.getItem(CHARTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getChart(id) {
  return getCharts()[id] || null;
}

export function saveChart(id, chart) {
  const charts = getCharts();
  charts[id] = { ...chart, _savedAt: new Date().toISOString() };
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
}

export function deleteChart(id) {
  const charts = getCharts();
  delete charts[id];
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
}

export function getSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? JSON.parse(raw) : { house_system: "placidus", lang: "en" };
}

export function saveSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function resetAll() {
  localStorage.removeItem(CHARTS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
