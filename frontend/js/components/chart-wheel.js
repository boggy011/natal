import { SIGN_GLYPHS, PLANET_GLYPHS, formatDegree } from "../lib/astro-utils.js";
import { t } from "../i18n.js";

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const CX = 340, CY = 340;
const R_OUTER = 310, R_SIGN_INNER = 268, R_HOUSE_INNER = 245, R_ASPECT = 222;
const R_PLANET = 232, R_TICK = 268;
const PLANET_PUSH = 22;

function toRad(deg) { return deg * Math.PI / 180; }

function project(longitude, ascLon, radius) {
  const rel = ((longitude - ascLon) % 360 + 360) % 360;
  const a = toRad(rel);
  return {
    x: CX - radius * Math.cos(a),
    y: CY - radius * Math.sin(a),
  };
}

function polarToXY(angleDeg, radius) {
  const a = toRad(angleDeg);
  return { x: CX - radius * Math.cos(a), y: CY - radius * Math.sin(a) };
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function drawSignBand(g, ascLon) {
  for (let i = 0; i < 12; i++) {
    const startDeg = i * 30;
    const endDeg = (i + 1) * 30;

    const fill = i % 2 === 0 ? "rgba(124,111,224,0.06)" : "rgba(124,111,224,0.02)";

    const s1 = project(startDeg, ascLon, R_OUTER);
    const s2 = project(startDeg, ascLon, R_SIGN_INNER);
    const e1 = project(endDeg, ascLon, R_OUTER);
    const e2 = project(endDeg, ascLon, R_SIGN_INNER);

    const largeArc = 0;
    const d = [
      `M ${s1.x} ${s1.y}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
      `L ${e2.x} ${e2.y}`,
      `A ${R_SIGN_INNER} ${R_SIGN_INNER} 0 ${largeArc} 0 ${s2.x} ${s2.y}`,
      "Z",
    ].join(" ");

    g.appendChild(svgEl("path", { d, fill, stroke: "rgba(136,136,168,0.2)", "stroke-width": "0.5" }));

    const midDeg = startDeg + 15;
    const glyphPos = project(midDeg, ascLon, (R_OUTER + R_SIGN_INNER) / 2);
    const glyph = svgEl("text", {
      x: glyphPos.x, y: glyphPos.y,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: "#a89cf0", "font-size": "20", "font-family": "serif",
    });
    glyph.textContent = SIGN_GLYPHS[SIGNS[i]];
    g.appendChild(glyph);

    const line1 = project(startDeg, ascLon, R_OUTER);
    const line2 = project(startDeg, ascLon, R_SIGN_INNER);
    g.appendChild(svgEl("line", {
      x1: line1.x, y1: line1.y, x2: line2.x, y2: line2.y,
      stroke: "rgba(136,136,168,0.3)", "stroke-width": "0.5",
    }));
  }
}

function drawHouseCusps(g, cusps, ascLon) {
  for (let i = 0; i < 12; i++) {
    const cuspLon = cusps[i];
    const p1 = project(cuspLon, ascLon, R_SIGN_INNER);
    const p2 = project(cuspLon, ascLon, R_ASPECT);

    const isAngle = i === 0 || i === 3 || i === 6 || i === 9;
    g.appendChild(svgEl("line", {
      x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: isAngle ? "rgba(168,156,240,0.6)" : "rgba(136,136,168,0.2)",
      "stroke-width": isAngle ? "1.5" : "0.5",
    }));

    const nextCusp = cusps[(i + 1) % 12];
    let midLon;
    if (nextCusp > cuspLon) {
      midLon = (cuspLon + nextCusp) / 2;
    } else {
      midLon = ((cuspLon + nextCusp + 360) / 2) % 360;
    }
    const labelPos = project(midLon, ascLon, (R_SIGN_INNER + R_HOUSE_INNER) / 2);
    const label = svgEl("text", {
      x: labelPos.x, y: labelPos.y,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: "#888", "font-size": "10",
    });
    label.textContent = String(i + 1);
    g.appendChild(label);
  }
}

function drawPlanets(g, planets, ascLon) {
  const positioned = planets.map((p) => ({
    ...p,
    relDeg: ((p.longitude - ascLon) % 360 + 360) % 360,
  }));
  positioned.sort((a, b) => a.relDeg - b.relDeg);

  for (let i = 0; i < positioned.length; i++) {
    let r = R_PLANET;
    for (let j = 0; j < i; j++) {
      const diff = Math.abs(positioned[i].relDeg - positioned[j].relDeg);
      if (diff < 6) {
        r -= PLANET_PUSH;
        break;
      }
    }

    const pos = project(positioned[i].longitude, ascLon, r);
    const glyph = svgEl("text", {
      x: pos.x, y: pos.y,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: positioned[i].is_retrograde ? "#e06088" : "#e8e8f0",
      "font-size": "15", cursor: "pointer",
      "data-planet": positioned[i].name,
      class: "planet-glyph",
    });
    glyph.textContent = PLANET_GLYPHS[positioned[i].name] || positioned[i].name[0];
    g.appendChild(glyph);

    const tickOuter = project(positioned[i].longitude, ascLon, R_TICK);
    const tickInner = project(positioned[i].longitude, ascLon, R_TICK - 5);
    g.appendChild(svgEl("line", {
      x1: tickOuter.x, y1: tickOuter.y, x2: tickInner.x, y2: tickInner.y,
      stroke: "#888", "stroke-width": "1",
    }));
  }
}

function drawAspects(g, aspects, planets, ascLon) {
  const lonMap = {};
  for (const p of planets) lonMap[p.name] = p.longitude;

  for (const a of aspects) {
    if (a.orb > 5) continue;
    if (a.aspect === "conjunction") continue;

    const p1 = project(lonMap[a.planet1], ascLon, R_ASPECT - 5);
    const p2 = project(lonMap[a.planet2], ascLon, R_ASPECT - 5);

    const isHard = a.aspect === "square" || a.aspect === "opposition";
    const color = isHard ? "rgba(224,96,136,0.4)" : "rgba(80,184,160,0.4)";
    const dash = isHard ? "" : "4,3";

    g.appendChild(svgEl("line", {
      x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: color, "stroke-width": "1",
      "stroke-dasharray": dash,
      "data-aspect": `${a.planet1}-${a.aspect}-${a.planet2}`,
      class: "aspect-line",
    }));
  }
}

function drawOuterCircles(g) {
  for (const r of [R_OUTER, R_SIGN_INNER, R_HOUSE_INNER, R_ASPECT]) {
    g.appendChild(svgEl("circle", {
      cx: CX, cy: CY, r,
      fill: "none", stroke: "rgba(136,136,168,0.2)", "stroke-width": "0.5",
    }));
  }
}

export function renderWheel(svgEl_, chart) {
  svgEl_.innerHTML = "";
  svgEl_.setAttribute("viewBox", "0 0 680 680");
  svgEl_.setAttribute("width", "680");
  svgEl_.setAttribute("height", "680");

  const ascLon = chart.houses.ascendant;

  const bg = svgEl("rect", { x: 0, y: 0, width: 680, height: 680, fill: "#0f0f14", rx: "12" });
  svgEl_.appendChild(bg);

  const mainG = svgEl("g");
  svgEl_.appendChild(mainG);

  drawOuterCircles(mainG);
  drawSignBand(mainG, ascLon);
  drawHouseCusps(mainG, chart.houses.cusps, ascLon);
  drawAspects(mainG, chart.aspects, chart.planets, ascLon);
  drawPlanets(mainG, chart.planets, ascLon);

  const ascLabel = project(ascLon, ascLon, R_OUTER + 18);
  const ascText = svgEl("text", {
    x: ascLabel.x, y: ascLabel.y,
    "text-anchor": "middle", "dominant-baseline": "central",
    fill: "#a89cf0", "font-size": "12", "font-weight": "bold",
  });
  ascText.textContent = "ASC";
  svgEl_.appendChild(ascText);

  const mcPos = project(chart.houses.midheaven, ascLon, R_OUTER + 18);
  const mcText = svgEl("text", {
    x: mcPos.x, y: mcPos.y,
    "text-anchor": "middle", "dominant-baseline": "central",
    fill: "#a89cf0", "font-size": "12", "font-weight": "bold",
  });
  mcText.textContent = "MC";
  svgEl_.appendChild(mcText);

  svgEl_.querySelectorAll(".planet-glyph").forEach((el) => {
    el.addEventListener("click", () => {
      const name = el.dataset.planet;
      svgEl_.querySelectorAll(".aspect-line").forEach((line) => {
        const asp = line.dataset.aspect;
        if (asp.includes(name)) {
          line.setAttribute("stroke-width", "2.5");
          line.setAttribute("stroke-opacity", "1");
        } else {
          line.setAttribute("stroke-opacity", "0.15");
          line.setAttribute("stroke-width", "0.5");
        }
      });
      setTimeout(() => {
        svgEl_.querySelectorAll(".aspect-line").forEach((line) => {
          line.removeAttribute("stroke-opacity");
          line.setAttribute("stroke-width", "1");
        });
      }, 3000);
    });
  });
}
