export const SIGN_GLYPHS = {
  Aries: "♈", Taurus: "♉", Gemini: "♊",
  Cancer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Scorpio: "♏", Sagittarius: "♐",
  Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export const PLANET_GLYPHS = {
  Sun: "☉", Moon: "☽", Mercury: "☿",
  Venus: "♀", Mars: "♂", Jupiter: "♃",
  Saturn: "♄", Uranus: "♅", Neptune: "♆",
  Pluto: "♇", "North Node": "☊", Chiron: "⚷",
  Lilith: "⚸",
};

export const ASPECT_SYMBOLS = {
  conjunction: "☌", opposition: "☍", trine: "△",
  square: "□", sextile: "✱", quincunx: "Qx", semisextile: "Sx",
};

export function formatDegree(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export function formatLongitude(lon) {
  const signIdx = Math.floor(lon / 30) % 12;
  const signs = Object.keys(SIGN_GLYPHS);
  const signDeg = lon % 30;
  return `${formatDegree(signDeg)} ${SIGN_GLYPHS[signs[signIdx]]}`;
}

export function formatSpeed(speed) {
  return speed < 0 ? `${speed.toFixed(2)}°/d R` : `${speed.toFixed(2)}°/d`;
}
