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
          <option value="de" ${getLang() === "de" ? "selected" : ""}>Deutsch</option>
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
      <h4 style="margin-bottom:0.75rem">${t("settings.ai_title")}</h4>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">${t("settings.ai_desc")}</p>
      <div class="form-group">
        <label>${t("settings.ai_key")}</label>
        <input type="password" id="s-gemini-key" value="${settings.gemini_api_key || ""}" placeholder="AIzaSy...">
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <button class="btn btn-sm" id="btn-save-key">${t("settings.ai_save")}</button>
        <span id="key-status" style="font-size:0.82rem;color:var(--teal)"></span>
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem">
        ${t("settings.ai_hint")}
      </p>
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

  document.getElementById("btn-save-key").addEventListener("click", () => {
    const key = document.getElementById("s-gemini-key").value.trim();
    saveSetting("gemini_api_key", key);
    const status = document.getElementById("key-status");
    status.textContent = key ? "Saved!" : "Cleared";
    setTimeout(() => { status.textContent = ""; }, 2000);
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm(t("settings.reset_confirm"))) {
      resetAll();
      window.location.hash = "#/";
      window.location.reload();
    }
  });
}
