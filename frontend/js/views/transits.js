import { t } from "../i18n.js";
import { getChart } from "../store.js";
import { scanTransits } from "../api.js";
import { renderTransitTable } from "../components/transit-table.js";

const ALL_TRANSIT_PLANETS = ["Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const ALL_ASPECTS = ["conjunction", "opposition", "square", "trine", "sextile"];

export function renderTransitsView(container, chartId) {
  const chart = getChart(chartId);
  if (!chart) {
    container.innerHTML = `<div class="empty-state"><p>Chart not found.</p></div>`;
    return;
  }

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

    <div id="transit-results" class="loading"><p>Configure filters and press Scan.</p></div>
  `;

  container.querySelectorAll(".chip-group .chip").forEach(chip => {
    chip.addEventListener("click", () => chip.classList.toggle("active"));
  });

  document.getElementById("t-max-orb").addEventListener("input", (e) => {
    document.getElementById("orb-display").textContent = `${e.target.value}°`;
  });

  document.getElementById("btn-scan").addEventListener("click", () => handleScan(chart));
}

async function handleScan(chart) {
  const resultsEl = document.getElementById("transit-results");
  resultsEl.innerHTML = `<div class="loading"><p>Scanning transits...</p></div>`;

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
    renderTransitTable(resultsEl, filtered);
  } catch (e) {
    resultsEl.innerHTML = `<div class="empty-state"><p style="color:var(--pink)">${e.message}</p></div>`;
  }
}

function getActiveChips(containerId) {
  const chips = document.querySelectorAll(`#${containerId} .chip.active`);
  return Array.from(chips).map(c => c.dataset.val);
}
