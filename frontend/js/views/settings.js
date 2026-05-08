import { t, getLang, setLang, updatePageStrings } from "../i18n.js";
import { getSettings, saveSetting, resetAll } from "../store.js";

export function renderSettings(container) {
  const settings = getSettings();

  container.innerHTML = `
    <h2>${t("settings.title")}</h2>

    <div class="card" style="margin-top:1rem">
      <div class="form-group">
        <label>${t("settings.language")}</label>
        <select id="s-lang">
          <option value="en" ${getLang() === "en" ? "selected" : ""}>English</option>
          <option value="sr" ${getLang() === "sr" ? "selected" : ""}>Srpski</option>
        </select>
      </div>

      <div class="form-group">
        <label>${t("settings.house_system")}</label>
        <select id="s-house">
          <option value="placidus" ${settings.house_system === "placidus" ? "selected" : ""}>${t("house.placidus")}</option>
          <option value="koch" ${settings.house_system === "koch" ? "selected" : ""}>${t("house.koch")}</option>
          <option value="equal" ${settings.house_system === "equal" ? "selected" : ""}>${t("house.equal")}</option>
          <option value="whole_sign" ${settings.house_system === "whole_sign" ? "selected" : ""}>${t("house.whole_sign")}</option>
          <option value="regiomontanus" ${settings.house_system === "regiomontanus" ? "selected" : ""}>${t("house.regiomontanus")}</option>
          <option value="campanus" ${settings.house_system === "campanus" ? "selected" : ""}>${t("house.campanus")}</option>
        </select>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <button class="btn btn-danger" id="btn-reset">${t("settings.reset")}</button>
    </div>
  `;

  document.getElementById("s-lang").addEventListener("change", (e) => {
    setLang(e.target.value);
    updatePageStrings();
    renderSettings(container);
  });

  document.getElementById("s-house").addEventListener("change", (e) => {
    saveSetting("house_system", e.target.value);
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm(t("settings.reset_confirm"))) {
      resetAll();
      window.location.hash = "#/";
      window.location.reload();
    }
  });
}
