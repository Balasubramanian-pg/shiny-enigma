/**
 * The Mentalist Explorer - Client Interactions & Motion Feedback Engine
 */

// Global Toast Feedback Function
function showToast(message) {
  let toast = document.getElementById("actionToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "actionToast";
    toast.className = "action-toast";
    toast.innerHTML = `<span class="toast-dot"></span><span id="toastMessage"></span>`;
    document.body.appendChild(toast);
  }
  const msgElem = document.getElementById("toastMessage");
  if (msgElem) msgElem.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME TOGGLE (Clean SVGs, strictly NO emojis)
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
      showToast(`Switched to ${nextTheme === "dark" ? "Dark Mode" : "Light Mode"}`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    if (theme === "dark") {
      // Sun SVG
      themeBtn.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      `;
    } else {
      // Crescent Moon SVG
      themeBtn.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      `;
    }
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
    showToast(`Searching for "${val}"...`);
    fetch(`/api/search?q=${encodeURIComponent(val)}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          showToast(`Found: ${data.results[0].title}`);
          window.location.href = data.results[0].url;
        } else {
          showToast(`No matches found for "${val}"`);
        }
      });
  }

  // 3. EPISODE COMPARE DROPDOWNS
  const ep1Select = document.getElementById("compareEp1");
  const ep2Select = document.getElementById("compareEp2");
  if (ep1Select && ep2Select) {
    const onCompareChange = () => {
      showToast("Updating head-to-head comparison...");
      window.location.href = `/compare?ep1=${ep1Select.value}&ep2=${ep2Select.value}`;
    };
    ep1Select.addEventListener("change", onCompareChange);
    ep2Select.addEventListener("change", onCompareChange);
  }

  // 4. CHART BAR CLICK NAVIGATION & FEEDBACK
  document.querySelectorAll(".chart-col[data-ep-id]").forEach(col => {
    col.addEventListener("click", () => {
      const epId = col.getAttribute("data-ep-id");
      showToast("Navigating to episode detail...");
      if (epId) window.location.href = `/episodes/${epId}`;
    });
  });

  // 5. SEASON TABS INTERACTIVE FEEDBACK
  document.querySelectorAll(".season-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      showToast(`Loading ${tab.innerText.trim()}...`);
    });
  });

  // 6. LIVE MOTION DATA MODEL & DBML TOGGLE
  const motionTabBtn = document.getElementById("toggleMotionView");
  const dbmlTabBtn = document.getElementById("toggleDbmlView");
  const motionContainer = document.getElementById("motionContainer");
  const dbmlBlock = document.getElementById("dbmlBlock");
  const copyDbmlBtn = document.getElementById("copyDbmlBtn");

  if (motionTabBtn && dbmlTabBtn && motionContainer && dbmlBlock) {
    motionTabBtn.addEventListener("click", () => {
      motionTabBtn.classList.add("active");
      dbmlTabBtn.classList.remove("active");
      motionContainer.style.display = "block";
      dbmlBlock.classList.remove("show");
      showToast("Switched to Live Motion Schema Graph");
    });

    dbmlTabBtn.addEventListener("click", () => {
      dbmlTabBtn.classList.add("active");
      motionTabBtn.classList.remove("active");
      motionContainer.style.display = "none";
      dbmlBlock.classList.add("show");
      showToast("Switched to DBML Code Inspector");
    });
  }

  if (copyDbmlBtn) {
    copyDbmlBtn.addEventListener("click", () => {
      const code = document.getElementById("dbmlCodeContent")?.innerText || "";
      navigator.clipboard.writeText(code).then(() => {
        showToast("DBML specification copied to clipboard!");
      });
    });
  }

  // 7. INTERACTIVE TABLE NODE HOVER IN MOTION GRAPH
  const nodeCards = document.querySelectorAll(".model-node-card[data-table]");
  nodeCards.forEach(node => {
    node.addEventListener("mouseenter", () => {
      const table = node.getAttribute("data-table");
      highlightRelationshipWires(table);
    });
    node.addEventListener("mouseleave", () => {
      resetRelationshipWires();
    });
  });

  function highlightRelationshipWires(table) {
    document.querySelectorAll(".rel-wire").forEach(wire => {
      const source = wire.getAttribute("data-source");
      const target = wire.getAttribute("data-target");
      if (source === table || target === table) {
        wire.classList.add("active-wire");
      } else {
        wire.classList.remove("active-wire");
      }
    });
  }

  function resetRelationshipWires() {
    document.querySelectorAll(".rel-wire").forEach(wire => {
      wire.classList.remove("active-wire");
    });
  }
});
