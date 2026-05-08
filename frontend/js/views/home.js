import { t } from "../i18n.js";
import { getCharts, getSettings, saveSetting, saveChart, deleteChart, generateId } from "../store.js";
import { computeChart } from "../api.js";
import { initPlaceSearch } from "../components/place-search.js";
import { SIGN_GLYPHS, formatDegree } from "../lib/astro-utils.js";

let selectedPlace = null;

export function renderHome(container) {
  const charts = getCharts();
  const ids = Object.keys(charts).sort((a, b) => {
    const ta = charts[b]._savedAt || "";
    const tb = charts[a]._savedAt || "";
    return ta.localeCompare(tb);
  });

  const hasKey = !!(getSettings().gemini_api_key || window.__NATAL_API_KEY);

  container.innerHTML = `
    ${!hasKey ? `
    <div class="ai-setup-guide card">
      <div class="ai-setup-icon">✨</div>
      <h3>${t("home.ai_guide_title")}</h3>
      <p>${t("home.ai_guide_desc")}</p>
      <ol class="ai-setup-steps">
        <li>${t("home.ai_step1")}</li>
        <li>${t("home.ai_step2")}</li>
      </ol>
      <div class="ai-setup-input">
        <input type="password" id="home-gemini-key" placeholder="${t("settings.ai_key")}" style="flex:1">
        <button class="btn btn-primary" id="btn-save-home-key">${t("settings.ai_save")}</button>
      </div>
      <span id="home-key-status" style="font-size:0.82rem;color:var(--teal);margin-top:0.4rem;display:block"></span>
    </div>
    ` : ""}
    <div class="section-header">
      <h2>${t("home.title")}</h2>
      <button class="btn btn-primary" id="btn-new">${t("home.new")}</button>
    </div>
    <div id="new-chart-form" style="display:none">
      <div class="card">
        <div class="form-group">
          <label>${t("form.name")}</label>
          <input type="text" id="f-name" placeholder="e.g. John Doe">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>${t("form.date")}</label>
            <input type="date" id="f-date" value="1990-01-01">
          </div>
          <div class="form-group">
            <label>${t("form.time")}</label>
            <input type="time" id="f-time" value="12:00">
            <div class="checkbox-group" style="margin-top:0.3rem">
              <input type="checkbox" id="f-time-unknown">
              <label for="f-time-unknown">${t("form.time_unknown")}</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>${t("form.place")}</label>
          <div>
            <input type="text" id="f-place" placeholder="${t("form.place_ph")}">
          </div>
          <div id="place-info" style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem"></div>
        </div>
        <div class="form-group">
          <label>${t("form.house_system")}</label>
          <select id="f-house">
            <option value="placidus">${t("house.placidus")}</option>
            <option value="koch">${t("house.koch")}</option>
            <option value="equal">${t("house.equal")}</option>
            <option value="whole_sign">${t("house.whole_sign")}</option>
            <option value="regiomontanus">${t("house.regiomontanus")}</option>
            <option value="campanus">${t("house.campanus")}</option>
          </select>
        </div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary" id="btn-compute">${t("form.compute")}</button>
        </div>
        <div id="form-error" style="color:var(--pink);margin-top:0.5rem;font-size:0.85rem"></div>
      </div>
    </div>

    ${ids.length === 0
      ? `<div class="empty-state"><p>${t("home.empty")}</p></div>`
      : `<div class="profiles-grid">${ids.map(id => profileCard(id, charts[id])).join("")}</div>`
    }
  `;

  document.getElementById("btn-new").addEventListener("click", () => {
    const form = document.getElementById("new-chart-form");
    form.style.display = form.style.display === "none" ? "block" : "none";
    if (form.style.display === "block") {
      selectedPlace = null;
      initPlaceSearch(document.getElementById("f-place"), (result) => {
        selectedPlace = result;
        document.getElementById("place-info").textContent =
          `${result.latitude.toFixed(4)}°N, ${result.longitude.toFixed(4)}°E — ${result.timezone}`;
      });
    }
  });

  document.getElementById("btn-save-home-key")?.addEventListener("click", () => {
    const key = document.getElementById("home-gemini-key").value.trim();
    if (key) {
      saveSetting("gemini_api_key", key);
      const status = document.getElementById("home-key-status");
      status.textContent = t("home.ai_saved");
      setTimeout(() => { renderHome(container); }, 1500);
    }
  });

  document.getElementById("btn-compute")?.addEventListener("click", handleCompute);

  container.querySelectorAll(".profile-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-danger")) return;
      window.location.hash = `#/chart/${card.dataset.id}`;
    });
  });

  container.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      deleteChart(id);
      renderHome(container);
    });
  });
}

function profileCard(id, chart) {
  const b = chart.birth;
  const dateStr = `${b.year}-${String(b.month).padStart(2, "0")}-${String(b.day).padStart(2, "0")}`;
  const timeStr = `${String(b.hour).padStart(2, "0")}:${String(b.minute).padStart(2, "0")}`;
  const sun = chart.planets?.find(p => p.name === "Sun");
  const sunSign = sun ? `☉ ${SIGN_GLYPHS[sun.sign] || ""} ${sun.sign}` : "";

  return `
    <div class="card profile-card" data-id="${id}">
      <div class="actions">
        <button class="btn btn-sm btn-danger btn-delete" data-id="${id}">✕</button>
      </div>
      <h3>${b.name || t("home.unnamed")}</h3>
      <div class="meta">${dateStr} ${timeStr}</div>
      <div class="meta">${b.place_name || ""}</div>
      <div class="meta" style="margin-top:0.25rem">${sunSign}</div>
    </div>
  `;
}

async function handleCompute() {
  const errEl = document.getElementById("form-error");
  errEl.textContent = "";

  if (!selectedPlace) {
    errEl.textContent = t("home.place_error");
    return;
  }

  const dateVal = document.getElementById("f-date").value;
  const timeUnknown = document.getElementById("f-time-unknown").checked;
  const timeVal = timeUnknown ? "12:00" : document.getElementById("f-time").value;
  const [year, month, day] = dateVal.split("-").map(Number);
  const [hour, minute] = timeVal.split(":").map(Number);

  const birth = {
    name: document.getElementById("f-name").value || null,
    year, month, day, hour, minute,
    latitude: selectedPlace.latitude,
    longitude: selectedPlace.longitude,
    timezone: selectedPlace.timezone,
    place_name: selectedPlace.display_name,
  };

  const config = {
    house_system: document.getElementById("f-house").value,
  };

  const btn = document.getElementById("btn-compute");
  btn.disabled = true;
  btn.textContent = t("home.computing");

  try {
    const chart = await computeChart(birth, config);
    const id = generateId();
    saveChart(id, chart);
    window.location.hash = `#/chart/${id}`;
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = t("form.compute");
  }
}
