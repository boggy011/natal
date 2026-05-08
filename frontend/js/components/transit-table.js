import { PLANET_GLYPHS, ASPECT_SYMBOLS, formatDegree } from "../lib/astro-utils.js";
import { t } from "../i18n.js";

export function renderTransitTable(container, hits) {
  if (!hits || hits.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>${t("transits.empty")}</p></div>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "data-table";
  table.innerHTML = `
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
  `;

  const tbody = table.querySelector("tbody");

  for (const hit of hits) {
    const d = new Date(hit.date);
    const dateStr = d.toLocaleDateString("en-CA");

    const aspectType = ["square", "opposition"].includes(hit.aspect) ? "hard-aspect" : "soft-aspect";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${PLANET_GLYPHS[hit.transit_planet] || ""} ${t("planet." + hit.transit_planet)}</td>
      <td class="${aspectType}">${ASPECT_SYMBOLS[hit.aspect] || ""} ${t("aspect." + hit.aspect)}</td>
      <td>${PLANET_GLYPHS[hit.natal_point] || ""} ${t("planet." + hit.natal_point) || hit.natal_point}</td>
      <td>${hit.orb_at_exact.toFixed(2)}°</td>
      <td>${hit.is_retrograde ? '<span class="retro">R</span>' : ""}</td>
    `;
    tbody.appendChild(tr);
  }

  container.innerHTML = "";
  container.appendChild(table);
}
