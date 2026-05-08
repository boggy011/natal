const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function computeChart(birth, config = {}) {
  return request("/chart", {
    method: "POST",
    body: JSON.stringify({ birth, config }),
  });
}

export function scanTransits(natal, start, end, filters = {}) {
  return request("/transits", {
    method: "POST",
    body: JSON.stringify({ natal, start, end, ...filters }),
  });
}

export function geocode(query) {
  return request(`/geocode?q=${encodeURIComponent(query)}`);
}

export function listProfiles() {
  return request("/profiles");
}

export function createProfile(name, birthData) {
  return request("/profiles", {
    method: "POST",
    body: JSON.stringify({ name, birth_data: birthData }),
  });
}

export function getProfile(id) {
  return request(`/profiles/${id}`);
}

export function deleteProfile(id) {
  return request(`/profiles/${id}`, { method: "DELETE" });
}

export function interpretChart(chart, lang = "en") {
  return request(`/chart/interpret?lang=${encodeURIComponent(lang)}`, {
    method: "POST",
    body: JSON.stringify(chart),
  });
}
