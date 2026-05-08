import { renderHome } from "./views/home.js";
import { renderChartView } from "./views/chart.js";
import { renderTransitsView } from "./views/transits.js";
import { renderSettings } from "./views/settings.js";
import { getLang, setLang, updatePageStrings } from "./i18n.js";

const app = document.getElementById("app");

function route() {
  const hash = window.location.hash || "#/";
  const parts = hash.slice(2).split("/");

  updatePageStrings();
  updateActiveNav(hash);

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

document.getElementById("lang-toggle").addEventListener("click", () => {
  const newLang = getLang() === "en" ? "sr" : "en";
  setLang(newLang);
  route();
});

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
