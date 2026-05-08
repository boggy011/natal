/**
 * Client-side natal chart calculator.
 * Uses astronomy-engine (CDN global) for planet positions.
 * Implements house cusp calculations (Placidus, Equal, Whole Sign, Koch, Regiomontanus, Campanus).
 */

const A = () => window.Astronomy;

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const ASPECT_DEFS = {
  conjunction:  { angle: 0,   orb: 8 },
  opposition:   { angle: 180, orb: 8 },
  trine:        { angle: 120, orb: 7 },
  square:       { angle: 90,  orb: 7 },
  sextile:      { angle: 60,  orb: 5 },
  quincunx:     { angle: 150, orb: 3 },
  semisextile:  { angle: 30,  orb: 2 },
};

const PLANET_BODIES = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
function mod360(x) { return ((x % 360) + 360) % 360; }
function sinD(d) { return Math.sin(d * DEG); }
function cosD(d) { return Math.cos(d * DEG); }
function tanD(d) { return Math.tan(d * DEG); }
function asinD(x) { return Math.asin(Math.max(-1, Math.min(1, x))) * RAD; }
function acosD(x) { return Math.acos(Math.max(-1, Math.min(1, x))) * RAD; }
function atan2D(y, x) { return Math.atan2(y, x) * RAD; }

function lonToSign(lon) { return SIGNS[Math.floor(mod360(lon) / 30) % 12]; }

function angularDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function findHouse(lon, cusps) {
  const l = mod360(lon);
  for (let i = 0; i < 12; i++) {
    const s = cusps[i];
    const e = cusps[(i + 1) % 12];
    if (s < e) { if (l >= s && l < e) return i + 1; }
    else { if (l >= s || l < e) return i + 1; }
  }
  return 12;
}

// ── Timezone conversion ────────────────────────────────────────────────
function localToUTC(year, month, day, hour, minute, timezone) {
  try {
    const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    const inTz = new Date(guess.toLocaleString("en-US", { timeZone: timezone }));
    const offset = inTz.getTime() - guess.getTime();
    const utc = new Date(guess.getTime() - offset);
    const verify = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
    const offset2 = verify.getTime() - utc.getTime();
    if (Math.abs(offset - offset2) > 60000) return new Date(guess.getTime() - offset2);
    return utc;
  } catch {
    return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  }
}

// ── Planet positions ───────────────────────────────────────────────────
function getPlanetEcliptic(body, time) {
  const ast = A();
  if (body === "Moon") {
    const m = ast.EclipticGeoMoon(time);
    return { lon: mod360(m.lon), lat: m.lat };
  }
  const eqj = ast.GeoVector(body, time, true);
  const ecl = ast.Ecliptic(eqj);
  return { lon: mod360(ecl.elon), lat: ecl.elat };
}

function getPlanetSpeed(body, time) {
  const ast = A();
  const dt = 0.005;
  const t1 = ast.MakeTime(new Date(time.date.getTime() - dt * 86400000));
  const t2 = ast.MakeTime(new Date(time.date.getTime() + dt * 86400000));
  const lon1 = getPlanetEcliptic(body, t1).lon;
  const lon2 = getPlanetEcliptic(body, t2).lon;
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff / (2 * dt);
}

// ── Mean Lunar Node & Lilith ───────────────────────────────────────────
function jdFromTime(time) { return time.ut + 2451545.0; }

function meanLunarNode(jd) {
  const T = (jd - 2451545.0) / 36525;
  return mod360(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000);
}

function meanLilith(jd) {
  const T = (jd - 2451545.0) / 36525;
  return mod360(83.353451 + 4069.0137111 * T - 0.0103 * T * T - T * T * T / 80053);
}

// ── Obliquity ──────────────────────────────────────────────────────────
function obliquity(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

// ── House calculations ─────────────────────────────────────────────────
function computeMC(ramc, eps) {
  let mc = atan2D(sinD(ramc), cosD(ramc) * cosD(eps));
  mc = mod360(mc);
  const ramcQ = Math.floor(ramc / 90);
  const mcQ = Math.floor(mc / 90);
  if (ramcQ !== mcQ) {
    if ((ramcQ === 1 || ramcQ === 2) && (mcQ === 0 || mcQ === 3)) mc = mod360(mc + 180);
    else if ((ramcQ === 0 || ramcQ === 3) && (mcQ === 1 || mcQ === 2)) mc = mod360(mc + 180);
  }
  return mc;
}

function computeASC(ramc, eps, lat) {
  return mod360(atan2D(cosD(ramc), -(sinD(ramc) * cosD(eps) + tanD(lat) * sinD(eps))));
}

function wholeSignHouses(asc) {
  const start = Math.floor(asc / 30) * 30;
  return Array.from({ length: 12 }, (_, i) => mod360(start + i * 30));
}

function equalHouses(asc) {
  return Array.from({ length: 12 }, (_, i) => mod360(asc + i * 30));
}

function placidusHouses(ramc, eps, lat, asc, mc) {
  const cusps = new Array(12);
  cusps[0] = asc;
  cusps[3] = mod360(mc + 180);
  cusps[6] = mod360(asc + 180);
  cusps[9] = mc;

  cusps[10] = placidusCusp(ramc, eps, lat, 1 / 3, true);
  cusps[11] = placidusCusp(ramc, eps, lat, 2 / 3, true);
  cusps[1]  = placidusCusp(ramc, eps, lat, 2 / 3, false);
  cusps[2]  = placidusCusp(ramc, eps, lat, 1 / 3, false);

  cusps[4] = mod360(cusps[10] + 180);
  cusps[5] = mod360(cusps[11] + 180);
  cusps[7] = mod360(cusps[1] + 180);
  cusps[8] = mod360(cusps[2] + 180);
  return cusps;
}

function placidusCusp(ramc, eps, lat, frac, above) {
  let cusp = above ? mod360(ramc + frac * 90) : mod360(ramc + 180 + frac * 90);
  for (let i = 0; i < 50; i++) {
    const dec = asinD(sinD(eps) * sinD(cusp));
    const tanLtanD = tanD(lat) * tanD(dec);
    const clamp = Math.max(-1, Math.min(1, -tanLtanD));
    const sa = acosD(clamp);
    let newRA;
    if (above) newRA = mod360(ramc + frac * sa);
    else newRA = mod360(ramc + 180 + frac * (180 - sa));
    const newCusp = mod360(atan2D(sinD(newRA), cosD(newRA) * cosD(eps)));
    let diff = Math.abs(newCusp - cusp);
    if (diff > 180) diff = 360 - diff;
    cusp = newCusp;
    if (diff < 0.0005) break;
  }
  return cusp;
}

function kochHouses(ramc, eps, lat, asc, mc) {
  const cusps = new Array(12);
  cusps[0] = asc;
  cusps[3] = mod360(mc + 180);
  cusps[6] = mod360(asc + 180);
  cusps[9] = mc;

  const decMC = asinD(sinD(eps) * sinD(mc));
  const tanLtanD = tanD(lat) * tanD(decMC);
  const clamp = Math.max(-1, Math.min(1, -tanLtanD));
  const sa = acosD(clamp);

  cusps[10] = computeASC(mod360(ramc - sa / 3), eps, lat);
  cusps[11] = computeASC(mod360(ramc - 2 * sa / 3), eps, lat);
  cusps[1]  = computeASC(mod360(ramc + 2 * sa / 3 + 180), eps, lat);
  cusps[2]  = computeASC(mod360(ramc + sa / 3 + 180), eps, lat);

  cusps[4] = mod360(cusps[10] + 180);
  cusps[5] = mod360(cusps[11] + 180);
  cusps[7] = mod360(cusps[1] + 180);
  cusps[8] = mod360(cusps[2] + 180);
  return cusps;
}

function regiomontanusHouses(ramc, eps, lat, asc, mc) {
  const cusps = new Array(12);
  cusps[0] = asc;
  cusps[3] = mod360(mc + 180);
  cusps[6] = mod360(asc + 180);
  cusps[9] = mc;
  const houseOffsets = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  for (let i = 0; i < 12; i++) {
    if (i === 0 || i === 3 || i === 6 || i === 9) continue;
    const rh = mod360(ramc + houseOffsets[i]);
    const num = cosD(rh);
    const den = -(sinD(rh) * cosD(eps) + tanD(lat) * sinD(eps));
    cusps[i] = mod360(atan2D(num, den));

  }
  return cusps;
}

function campanusHouses(ramc, eps, lat, asc, mc) {
  const cusps = new Array(12);
  cusps[0] = asc;
  cusps[3] = mod360(mc + 180);
  cusps[6] = mod360(asc + 180);
  cusps[9] = mc;
  const offsets = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  for (let i = 0; i < 12; i++) {
    if (i === 0 || i === 3 || i === 6 || i === 9) continue;
    const pv = offsets[i];
    const az = atan2D(sinD(pv), cosD(pv) * cosD(lat));
    const alt = asinD(sinD(lat) * cosD(pv));
    const dec = asinD(sinD(alt) * sinD(lat) + cosD(alt) * cosD(lat) * cosD(az));
    const ra = mod360(ramc + atan2D(sinD(az) * cosD(alt), cosD(az) * cosD(alt) * sinD(lat) - sinD(alt) * cosD(lat)));
    cusps[i] = mod360(atan2D(sinD(ra), cosD(ra) * cosD(eps)));
  }
  return cusps;
}

function computeHouseCusps(time, lat, lon, system) {
  const ast = A();
  const lstDeg = mod360(ast.SiderealTime(time) * 15 + lon);
  const ramc = lstDeg;
  const jd = jdFromTime(time);
  const eps = obliquity(jd);
  const mc = computeMC(ramc, eps);
  const asc = computeASC(ramc, eps, lat);

  let cusps;
  switch (system) {
    case "whole_sign":    cusps = wholeSignHouses(asc); break;
    case "equal":         cusps = equalHouses(asc); break;
    case "koch":          cusps = kochHouses(ramc, eps, lat, asc, mc); break;
    case "regiomontanus": cusps = regiomontanusHouses(ramc, eps, lat, asc, mc); break;
    case "campanus":      cusps = campanusHouses(ramc, eps, lat, asc, mc); break;
    default:              cusps = placidusHouses(ramc, eps, lat, asc, mc);
  }
  return { cusps, ascendant: asc, midheaven: mc, descendant: mod360(asc + 180), imum_coeli: mod360(mc + 180) };
}

// ── Main compute function ──────────────────────────────────────────────
export function computeChart(birth, config = {}) {
  const ast = A();
  const houseSystem = config.house_system || "placidus";
  const orbMul = config.orb_multiplier || 1.0;
  const includeChiron = config.include_chiron !== false;
  const includeLilith = config.include_lilith === true;
  const aspectNames = config.aspects || Object.keys(ASPECT_DEFS);

  const utc = localToUTC(birth.year, birth.month, birth.day, birth.hour, birth.minute, birth.timezone);
  const time = ast.MakeTime(utc);
  const jd = jdFromTime(time);
  const eps = obliquity(jd);

  const houses = computeHouseCusps(time, birth.latitude, birth.longitude, houseSystem);

  const planets = [];
  for (const name of PLANET_BODIES) {
    const ecl = getPlanetEcliptic(name, time);
    const speed = getPlanetSpeed(name, time);
    planets.push({
      name,
      longitude: ecl.lon,
      latitude: ecl.lat,
      speed,
      sign: lonToSign(ecl.lon),
      sign_degree: ecl.lon % 30,
      house: findHouse(ecl.lon, houses.cusps),
      is_retrograde: speed < 0,
    });
  }

  const nodeLon = meanLunarNode(jd);
  planets.push({
    name: "North Node",
    longitude: nodeLon, latitude: 0, speed: -0.053,
    sign: lonToSign(nodeLon), sign_degree: nodeLon % 30,
    house: findHouse(nodeLon, houses.cusps), is_retrograde: true,
  });

  if (includeChiron) {
    // Chiron approximation using a simplified orbital model
    const T = (jd - 2451545.0) / 36525;
    const chironLon = mod360(209.39 + 1.871 * 360 * T / 50.76);
    planets.push({
      name: "Chiron",
      longitude: chironLon, latitude: 0, speed: 0.02,
      sign: lonToSign(chironLon), sign_degree: chironLon % 30,
      house: findHouse(chironLon, houses.cusps), is_retrograde: false,
    });
  }

  if (includeLilith) {
    const lilithLon = meanLilith(jd);
    planets.push({
      name: "Lilith",
      longitude: lilithLon, latitude: 0, speed: 0.11,
      sign: lonToSign(lilithLon), sign_degree: lilithLon % 30,
      house: findHouse(lilithLon, houses.cusps), is_retrograde: false,
    });
  }

  const aspects = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const ang = angularDist(planets[i].longitude, planets[j].longitude);
      for (const aspName of aspectNames) {
        const def = ASPECT_DEFS[aspName];
        if (!def) continue;
        const diff = Math.abs(ang - def.angle);
        if (diff <= def.orb * orbMul) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            aspect: aspName,
            exact_angle: def.angle,
            actual_angle: ang,
            orb: Math.round(diff * 10000) / 10000,
          });
        }
      }
    }
  }

  return {
    birth,
    config: { house_system: houseSystem, planets: planets.map(p => p.name), aspects: aspectNames, orb_multiplier: orbMul, include_chiron: includeChiron, include_lilith: includeLilith },
    planets,
    houses,
    aspects,
    julian_day: jd,
    obliquity: eps,
  };
}

// ── Transit scanner ────────────────────────────────────────────────────
const TRANSIT_ORBS = {
  conjunction: 1.5, opposition: 1.5, square: 1.5,
  trine: 1.5, sextile: 1.0, quincunx: 1.0, semisextile: 0.8,
};

export function scanTransits(chart, startDate, endDate, filters = {}) {
  const ast = A();
  const transitPlanets = filters.transit_planets || ["Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
  const natalPoints = filters.natal_points || chart.planets.map(p => p.name).concat(["ASC","MC"]);
  const aspectNames = filters.aspects || ["conjunction","opposition","square","trine","sextile"];

  const natalPos = {};
  for (const p of chart.planets) natalPos[p.name] = p.longitude;
  natalPos["ASC"] = chart.houses.ascendant;
  natalPos["MC"] = chart.houses.midheaven;

  const start = new Date(startDate + "T12:00:00Z");
  const end = new Date(endDate + "T12:00:00Z");
  const rawHits = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const time = ast.MakeTime(d);
    for (const tp of transitPlanets) {
      if (!PLANET_BODIES.includes(tp)) continue;
      const tLon = getPlanetEcliptic(tp, time).lon;
      const tSpeed = getPlanetSpeed(tp, time);
      for (const np of natalPoints) {
        const nLon = natalPos[np];
        if (nLon === undefined) continue;
        const ang = angularDist(tLon, nLon);
        for (const aspName of aspectNames) {
          const exact = ASPECT_DEFS[aspName]?.angle;
          if (exact === undefined) continue;
          const maxOrb = TRANSIT_ORBS[aspName] || 1.5;
          const orb = Math.abs(ang - exact);
          if (orb <= maxOrb) {
            rawHits.push({
              date: d.toISOString(),
              transit_planet: tp,
              natal_point: np,
              aspect: aspName,
              orb_at_exact: Math.round(orb * 1000) / 1000,
              transit_lon: tLon,
              natal_lon: nLon,
              is_retrograde: tSpeed < 0,
            });
          }
        }
      }
    }
  }

  const grouped = {};
  for (const h of rawHits) {
    const key = `${h.transit_planet}-${h.aspect}-${h.natal_point}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  }

  const hits = [];
  for (const arr of Object.values(grouped)) {
    arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    let best = arr[0];
    let windowStart = new Date(arr[0].date);
    for (let i = 1; i < arr.length; i++) {
      const dt = new Date(arr[i].date);
      if (dt - windowStart < 14 * 86400000) {
        if (arr[i].orb_at_exact < best.orb_at_exact) best = arr[i];
      } else {
        hits.push(best);
        best = arr[i];
        windowStart = dt;
      }
    }
    hits.push(best);
  }

  hits.sort((a, b) => new Date(a.date) - new Date(b.date));
  return { natal: chart, range_start: startDate, range_end: endDate, hits };
}
