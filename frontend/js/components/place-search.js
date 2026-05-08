import { geocode } from "../api.js";
import { t } from "../i18n.js";

export function initPlaceSearch(inputEl, onSelect) {
  const wrapper = inputEl.parentElement;
  wrapper.classList.add("place-search-wrapper");

  let dropdown = wrapper.querySelector(".autocomplete-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "autocomplete-dropdown";
    dropdown.style.display = "none";
    wrapper.appendChild(dropdown);
  }

  let debounceTimer = null;

  inputEl.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const q = inputEl.value.trim();
    if (q.length < 2) {
      dropdown.style.display = "none";
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const result = await geocode(q);
        dropdown.innerHTML = "";
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = `${result.display_name} (${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}) — ${result.timezone}`;
        item.addEventListener("click", () => {
          onSelect(result);
          inputEl.value = result.display_name;
          dropdown.style.display = "none";
        });
        dropdown.appendChild(item);
        dropdown.style.display = "block";
      } catch {
        dropdown.innerHTML = `<div class="autocomplete-item" style="color: var(--text-muted)">${t("geocode.no_results")}</div>`;
        dropdown.style.display = "block";
      }
    }, 600);
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}
