import { t, getLang } from "../i18n.js";
import { getChart } from "../store.js";
import { renderWheel } from "../components/chart-wheel.js";
import { SIGN_GLYPHS, PLANET_GLYPHS, ASPECT_SYMBOLS, formatDegree, formatSpeed } from "../lib/astro-utils.js";
import { computeChart, interpretChart } from "../api.js";
import { saveChart } from "../store.js";

export function renderChartView(container, id) {
  const chart = getChart(id);
  if (!chart) {
    container.innerHTML = `<div class="empty-state"><p>Chart not found.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <h2>${chart.birth.name || t("chart.title")}</h2>
      <div class="toolbar">
        <select id="house-select" class="btn btn-sm">
          <option value="placidus" ${chart.config.house_system === "placidus" ? "selected" : ""}>${t("house.placidus")}</option>
          <option value="koch" ${chart.config.house_system === "koch" ? "selected" : ""}>${t("house.koch")}</option>
          <option value="equal" ${chart.config.house_system === "equal" ? "selected" : ""}>${t("house.equal")}</option>
          <option value="whole_sign" ${chart.config.house_system === "whole_sign" ? "selected" : ""}>${t("house.whole_sign")}</option>
          <option value="regiomontanus" ${chart.config.house_system === "regiomontanus" ? "selected" : ""}>${t("house.regiomontanus")}</option>
          <option value="campanus" ${chart.config.house_system === "campanus" ? "selected" : ""}>${t("house.campanus")}</option>
        </select>
        <button class="btn btn-sm" id="btn-transits">${t("chart.transits")}</button>
        <button class="btn btn-sm" id="btn-export">${t("chart.export_json")}</button>
      </div>
    </div>

    <div class="chart-layout">
      <div class="chart-wheel-container">
        <svg id="chart-wheel"></svg>
      </div>
      <div class="chart-data">
        <div class="card">
          <h4 style="margin-bottom:0.5rem">${t("chart.angles")}</h4>
          ${anglesTable(chart)}
        </div>

        <div class="card">
          <h4 style="margin-bottom:0.5rem">${t("chart.planets")}</h4>
          ${planetsTable(chart)}
        </div>

        <div class="card">
          <h4 style="margin-bottom:0.5rem">${t("chart.aspects")}</h4>
          <div id="aspect-filter" class="chip-group"></div>
          <div id="aspects-body">${aspectsTable(chart, null)}</div>
        </div>
      </div>
    </div>

    <div class="card reading-card" style="margin-top:1.5rem">
      <h3 style="margin-bottom:1rem">${t("chart.reading")}</h3>
      <div class="tabs" id="reading-tabs">
        <span class="tab active" data-topic="love">${t("chart.tab.love")}</span>
        <span class="tab" data-topic="work">${t("chart.tab.work")}</span>
        <span class="tab" data-topic="health">${t("chart.tab.health")}</span>
      </div>
      <div id="reading-body">
        <div class="loading">${t("chart.reading_loading")}</div>
      </div>
    </div>
  `;

  const svg = document.getElementById("chart-wheel");
  renderWheel(svg, chart);

  setupAspectFilter(chart);

  document.getElementById("btn-transits").addEventListener("click", () => {
    window.location.hash = `#/transits/${id}`;
  });

  document.getElementById("btn-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(chart, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `natal-chart-${chart.birth.name || "chart"}.json`;
    a.click();
  });

  document.getElementById("house-select").addEventListener("change", async (e) => {
    const newSystem = e.target.value;
    try {
      const updated = await computeChart(chart.birth, { ...chart.config, house_system: newSystem });
      saveChart(id, updated);
      renderChartView(container, id);
    } catch (err) {
      console.error("Failed to recompute chart:", err);
    }
  });

  loadReadings(chart);
}

async function loadReadings(chart) {
  const body = document.getElementById("reading-body");
  const tabs = document.getElementById("reading-tabs");
  if (!body || !tabs) return;

  try {
    const readings = await interpretChart(chart, getLang());
    let activeTopic = "love";

    function renderTopic(topic) {
      const data = readings[topic];
      if (!data) {
        body.innerHTML = `<p class="text-muted">${t("chart.reading_error")}</p>`;
        return;
      }
      body.innerHTML = data.sections.map(s => `
        <div class="reading-section">
          <div class="reading-heading">
            <span class="reading-label">${s.heading}</span>
            <span class="reading-placement">${SIGN_GLYPHS[s.sign] || ""} ${t("sign." + s.sign)}</span>
          </div>
          <p class="reading-text">${s.text}</p>
        </div>
      `).join("");
    }

    renderTopic(activeTopic);

    tabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      tabs.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTopic = tab.dataset.topic;
      renderTopic(activeTopic);
    });
  } catch (err) {
    console.error("Failed to load readings:", err);
    body.innerHTML = `<p style="color:var(--text-muted)">${t("chart.reading_error")}</p>`;
  }
}

function anglesTable(chart) {
  const h = chart.houses;
  const rows = [
    ["ASC", h.ascendant],
    ["MC", h.midheaven],
    ["DSC", h.descendant],
    ["IC", h.imum_coeli],
  ];
  return `
    <table class="data-table">
      <tbody>
        ${rows.map(([name, lon]) => `
          <tr>
            <td>${name}</td>
            <td>${SIGN_GLYPHS[lonToSign(lon)] || ""} ${t("sign." + lonToSign(lon))}</td>
            <td>${formatDegree(lon % 30)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function planetsTable(chart) {
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>${t("chart.col.planet")}</th>
          <th>${t("chart.col.sign")}</th>
          <th>${t("chart.col.degree")}</th>
          <th>${t("chart.col.house")}</th>
          <th>${t("chart.col.retro")}</th>
        </tr>
      </thead>
      <tbody>
        ${chart.planets.map(p => `
          <tr>
            <td>${PLANET_GLYPHS[p.name] || ""} ${t("planet." + p.name)}</td>
            <td>${SIGN_GLYPHS[p.sign] || ""} ${t("sign." + p.sign)}</td>
            <td>${formatDegree(p.sign_degree)}</td>
            <td>${p.house}</td>
            <td>${p.is_retrograde ? '<span class="retro">R</span>' : ""}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function aspectsTable(chart, filterAspect) {
  let aspects = [...chart.aspects].sort((a, b) => a.orb - b.orb);
  if (filterAspect) {
    aspects = aspects.filter(a => a.aspect === filterAspect);
  }

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>${t("chart.col.p1")}</th>
          <th>${t("chart.col.aspect")}</th>
          <th>${t("chart.col.p2")}</th>
          <th>${t("chart.col.orb")}</th>
        </tr>
      </thead>
      <tbody>
        ${aspects.map(a => {
          const cls = ["square", "opposition"].includes(a.aspect) ? "hard-aspect" : "soft-aspect";
          return `
            <tr>
              <td>${PLANET_GLYPHS[a.planet1] || ""} ${t("planet." + a.planet1)}</td>
              <td class="${cls}">${ASPECT_SYMBOLS[a.aspect] || ""} ${t("aspect." + a.aspect)}</td>
              <td>${PLANET_GLYPHS[a.planet2] || ""} ${t("planet." + a.planet2)}</td>
              <td>${a.orb.toFixed(2)}°</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function setupAspectFilter(chart) {
  const filterEl = document.getElementById("aspect-filter");
  const bodyEl = document.getElementById("aspects-body");
  const types = [...new Set(chart.aspects.map(a => a.aspect))];

  const allChip = document.createElement("span");
  allChip.className = "chip active";
  allChip.textContent = "All";
  allChip.addEventListener("click", () => {
    filterEl.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    allChip.classList.add("active");
    bodyEl.innerHTML = aspectsTable(chart, null);
  });
  filterEl.appendChild(allChip);

  for (const type of types) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = t("aspect." + type);
    chip.addEventListener("click", () => {
      filterEl.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      bodyEl.innerHTML = aspectsTable(chart, type);
    });
    filterEl.appendChild(chip);
  }
}

function lonToSign(lon) {
  const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                 "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  return signs[Math.floor(lon / 30) % 12];
}
