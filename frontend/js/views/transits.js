import { t, getLang } from "../i18n.js";
import { getChart } from "../store.js";
import { scanTransits, interpretTransit } from "../api.js";
import { PLANET_GLYPHS, ASPECT_SYMBOLS } from "../lib/astro-utils.js";

const ALL_TRANSIT_PLANETS = ["Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const ALL_ASPECTS = ["conjunction", "opposition", "square", "trine", "sextile"];

let currentChart = null;

export function renderTransitsView(container, chartId) {
  const chart = getChart(chartId);
  if (!chart) {
    container.innerHTML = `<div class="empty-state"><p>${t("chart.not_found")}</p></div>`;
    return;
  }
  currentChart = chart;

  const today = new Date().toISOString().slice(0, 10);
  const future = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const natalPointNames = chart.planets.map(p => p.name).concat(["ASC", "MC"]);

  container.innerHTML = `
    <div class="section-header">
      <h2>${chart.birth.name ? chart.birth.name + " — " : ""}${t("transits.title")}</h2>
      <button class="btn btn-sm" onclick="window.location.hash='#/chart/${chartId}'">${t("chart.title")}</button>
    </div>

    <div class="filter-bar">
      <div class="form-row">
        <div class="form-group">
          <label>${t("transits.from")}</label>
          <input type="date" id="t-start" value="${today}">
        </div>
        <div class="form-group">
          <label>${t("transits.to")}</label>
          <input type="date" id="t-end" value="${future}">
        </div>
      </div>

      <h4>${t("transits.planets")}</h4>
      <div class="chip-group" id="transit-planets">
        ${ALL_TRANSIT_PLANETS.map(p => `<span class="chip active" data-val="${p}">${t("planet." + p)}</span>`).join("")}
      </div>

      <h4>${t("transits.natal_points")}</h4>
      <div class="chip-group" id="natal-points">
        ${natalPointNames.map(p => `<span class="chip active" data-val="${p}">${t("planet." + p) || p}</span>`).join("")}
      </div>

      <h4>${t("transits.aspects")}</h4>
      <div class="chip-group" id="aspect-types">
        ${ALL_ASPECTS.map(a => `<span class="chip active" data-val="${a}">${t("aspect." + a)}</span>`).join("")}
      </div>

      <div class="orb-slider" style="margin-top:0.5rem">
        <label>${t("transits.max_orb")}:</label>
        <input type="range" id="t-max-orb" min="0.1" max="3.0" step="0.1" value="2.0">
        <span class="orb-value" id="orb-display">2.0°</span>
      </div>

      <button class="btn btn-primary" id="btn-scan" style="margin-top:0.75rem">${t("transits.scan")}</button>
    </div>

    <div id="transit-results">
      <div class="empty-state"><p>${t("transits.configure")}</p></div>
    </div>

    <div id="ai-output" class="ai-output-box" style="display:none">
      <div class="ai-output-header">
        <span id="ai-title"></span>
        <button class="btn btn-sm" id="ai-close">✕</button>
      </div>
      <div id="ai-body" class="ai-body"></div>
    </div>
  `;

  container.querySelectorAll(".chip-group .chip").forEach(chip => {
    chip.addEventListener("click", () => chip.classList.toggle("active"));
  });

  document.getElementById("t-max-orb").addEventListener("input", (e) => {
    document.getElementById("orb-display").textContent = `${e.target.value}°`;
  });

  document.getElementById("btn-scan").addEventListener("click", () => handleScan(chart));

  document.getElementById("ai-close").addEventListener("click", () => {
    document.getElementById("ai-output").style.display = "none";
  });
}

async function handleScan(chart) {
  const resultsEl = document.getElementById("transit-results");
  const btn = document.getElementById("btn-scan");
  btn.disabled = true;
  btn.textContent = t("transits.scanning");
  resultsEl.innerHTML = `<div class="loading"><p>Computing transit positions...</p></div>`;

  const start = document.getElementById("t-start").value;
  const end = document.getElementById("t-end").value;
  const transitPlanets = getActiveChips("transit-planets");
  const natalPoints = getActiveChips("natal-points");
  const aspects = getActiveChips("aspect-types");
  const maxOrb = parseFloat(document.getElementById("t-max-orb").value);

  try {
    const result = await scanTransits(chart, start, end, {
      transit_planets: transitPlanets,
      natal_points: natalPoints,
      aspects: aspects,
    });

    const filtered = result.hits.filter(h => h.orb_at_exact <= maxOrb);
    renderScrollableTable(resultsEl, filtered, chart);
  } catch (e) {
    resultsEl.innerHTML = `<div class="empty-state"><p style="color:var(--pink)">${e.message}</p></div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = t("transits.scan");
  }
}

function renderScrollableTable(container, hits, chart) {
  if (!hits.length) {
    container.innerHTML = `<div class="empty-state"><p>${t("transits.empty")}</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="transit-scroll-wrapper">
      <table class="data-table transit-table">
        <thead>
          <tr>
            <th>${t("transits.col.date")}</th>
            <th>${t("transits.col.transit")}</th>
            <th>${t("transits.col.aspect")}</th>
            <th>${t("transits.col.natal")}</th>
            <th>${t("transits.col.orb")}</th>
            <th>${t("transits.col.retro")}</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <p class="transit-hint">${t("transits.click_hint")}</p>
  `;

  const tbody = container.querySelector("tbody");

  for (const hit of hits) {
    const d = new Date(hit.date);
    const dateStr = d.toLocaleDateString("en-CA");
    const cls = ["square", "opposition"].includes(hit.aspect) ? "hard-aspect" : "soft-aspect";

    const tr = document.createElement("tr");
    tr.className = "transit-row";
    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${PLANET_GLYPHS[hit.transit_planet] || ""} ${t("planet." + hit.transit_planet)}</td>
      <td class="${cls}">${ASPECT_SYMBOLS[hit.aspect] || ""} ${t("aspect." + hit.aspect)}</td>
      <td>${PLANET_GLYPHS[hit.natal_point] || ""} ${t("planet." + hit.natal_point) || hit.natal_point}</td>
      <td>${hit.orb_at_exact.toFixed(2)}°</td>
      <td>${hit.is_retrograde ? '<span class="retro">R</span>' : ""}</td>
    `;

    tr.addEventListener("click", () => {
      tbody.querySelectorAll(".transit-row").forEach(r => r.classList.remove("selected"));
      tr.classList.add("selected");
      loadAIInterpretation(hit, chart);
    });

    tbody.appendChild(tr);
  }
}

async function loadAIInterpretation(hit, chart) {
  const box = document.getElementById("ai-output");
  const title = document.getElementById("ai-title");
  const body = document.getElementById("ai-body");

  const transitLabel = `${hit.transit_planet} ${hit.aspect} ${hit.natal_point}`;
  const dateLabel = new Date(hit.date).toLocaleDateString();

  box.style.display = "block";
  title.textContent = `${transitLabel} — ${dateLabel}`;
  body.innerHTML = `<div class="ai-loading"><span class="ai-spinner"></span> ${t("transits.ai_thinking")}</div>`;
  box.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const text = await interpretTransit(hit, chart, getLang());
    body.innerHTML = formatAIText(text);
  } catch (e) {
    if (e.message === "NO_KEY") {
      body.innerHTML = `<p class="ai-nokey">${t("settings.ai_nokey")} <a href="#/settings" style="color:var(--accent-light)">Settings</a></p>`;
    } else {
      body.innerHTML = `<p class="ai-error">${t("transits.ai_error")} (${e.message})</p>`;
    }
  }
}

function formatAIText(text) {
  return text
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`)
    .join("");
}

function getActiveChips(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} .chip.active`)).map(c => c.dataset.val);
}
