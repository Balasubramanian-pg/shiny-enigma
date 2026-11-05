/**
 * The Mentalist Explorer - Client Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME TOGGLE
  const themeBtn = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme");
      const nextTheme = active === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
  }

  // 2. SEARCH BAR
  const searchInput = document.getElementById("globalSearchInput");
  const searchBtn = document.getElementById("globalSearchBtn");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => executeSearch());
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") executeSearch();
    });
  }

  function executeSearch() {
    const val = searchInput.value.trim();
    if (!val) return;
    fetch(`/api/search?q=${encodeURIComponent(val)}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          window.location.href = data.results[0].url;
        } else {
          alert(`No episodes or characters found matching '${val}'`);
        }
      });
  }

  // 3. EPISODE COMPARE DROPDOWNS
  const ep1Select = document.getElementById("compareEp1");
  const ep2Select = document.getElementById("compareEp2");
  if (ep1Select && ep2Select) {
    const onCompareChange = () => {
      window.location.href = `/compare?ep1=${ep1Select.value}&ep2=${ep2Select.value}`;
    };
    ep1Select.addEventListener("change", onCompareChange);
    ep2Select.addEventListener("change", onCompareChange);
  }

  // 4. CHART BAR CLICK NAVIGATION
  document.querySelectorAll(".chart-col[data-ep-id]").forEach(col => {
    col.addEventListener("click", () => {
      const epId = col.getAttribute("data-ep-id");
      if (epId) window.location.href = `/episodes/${epId}`;
    });
  });
});
