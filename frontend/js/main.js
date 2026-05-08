import { renderHome } from "./views/home.js";
import { renderChartView } from "./views/chart.js";
import { renderTransitsView } from "./views/transits.js";
import { renderSettings } from "./views/settings.js";
import { getLang, setLang, updatePageStrings } from "./i18n.js";

const app = document.getElementById("app");
const LANG_CYCLE = ["en", "sr", "de"];
const LANG_LABELS = { en: "EN", sr: "SR", de: "DE" };

function route() {
  const hash = window.location.hash || "#/";
  const parts = hash.slice(2).split("/");

  updatePageStrings();
  updateActiveNav(hash);
  updateLangButton();

  if (parts[0] === "" || parts[0] === undefined) {
    renderHome(app);
  } else if (parts[0] === "new") {
    renderHome(app);
  } else if (parts[0] === "chart" && parts[1]) {
    renderChartView(app, parts[1]);
  } else if (parts[0] === "transits" && parts[1]) {
    renderTransitsView(app, parts[1]);
  } else if (parts[0] === "settings") {
    renderSettings(app);
  } else {
    renderHome(app);
  }
}

function updateActiveNav(hash) {
  document.querySelectorAll(".header-nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}

function updateLangButton() {
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = LANG_LABELS[getLang()] || "EN";
}

document.getElementById("lang-toggle").addEventListener("click", () => {
  const cur = getLang();
  const idx = LANG_CYCLE.indexOf(cur);
  const next = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
  setLang(next);
  route();
});

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
