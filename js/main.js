// ------------------ THEME TOGGLE ------------------
const themeToggleBtn = document.getElementById("theme-toggle");
const htmlEl = document.documentElement;
const themeIconContainer = document.getElementById("theme-icon");

function renderThemeIcon(name) {
  if (!themeIconContainer || !window.lucide || !lucide.icons || !lucide.icons[name]) return;

  const svg = lucide.icons[name].toSvg({ class: "w-5 h-5", stroke: "currentColor", fill: "none" });
  themeIconContainer.innerHTML = svg;

  const icon = themeIconContainer.querySelector("svg");
  if (icon) {
    if (htmlEl.classList.contains("dark")) {
      icon.classList.add("text-amber-500");
      icon.classList.remove("text-slate-200");
    } else {
      icon.classList.add("text-blue-400");
      icon.classList.remove("text-amber-500");
    }
  }
}

function setThemeLabel(label) {
  const btnText = themeToggleBtn?.querySelector("span[data-theme-label]");
  if (btnText) btnText.textContent = `${label} Mode`;
}

function applyTheme(theme) {
  if (theme === "dark") {
    htmlEl.classList.add("dark");
    htmlEl.classList.remove("light");
    renderThemeIcon("sun");
    setThemeLabel("Light");
  } else {
    htmlEl.classList.add("light");
    htmlEl.classList.remove("dark");
    renderThemeIcon("moon");
    setThemeLabel("Dark");
  }
  localStorage.setItem("theme", theme);
}

// Initialize theme
(function () {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
})();

themeToggleBtn?.addEventListener("click", () => {
  applyTheme(htmlEl.classList.contains("dark") ? "light" : "dark");
});

// ------------------ AOS & Lucide Icons ------------------
window.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ once: true, duration: 800, easing: "ease-out-cubic" });
  if (window.lucide && lucide.createIcons) lucide.createIcons();
  renderThemeIcon(htmlEl.classList.contains("dark") ? "moon" : "sun");
});

// ------------------ Mobile Menu ------------------
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });
}

if (menuClose && mobileMenu) {
  menuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
}

// Close menu when clicking a link
const mobileLinks = mobileMenu?.querySelectorAll("a");
mobileLinks?.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});


// ------------------ GitHub Repos ------------------
async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  if (!grid) return;

  try {
    const res = await fetch("https://api.github.com/users/Yael-Karat/repos?sort=updated");
    const repos = await res.json();

    grid.innerHTML = repos.map(repo => `
      <div class="glass rounded-2xl p-5 transition border border-slate-200 dark:border-slate-700">
        <h3 class="font-bold text-lg mb-2">
          <a href="${repo.html_url}" target="_blank" class="hover:text-indigo-600 dark:hover:text-indigo-400">
            ${repo.name}
          </a>
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">${repo.description || "No description"}</p>
        <span class="inline-block text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
          ${repo.language || "Misc"}
        </span>
      </div>
    `).join("");
  } catch (err) {
    grid.innerHTML = `<p class="text-red-500">⚠️ Failed to load projects</p>`;
  }
}
loadRepos();

// ------------------ Footer Year ------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ------------------ Contact Form ------------------
const formEl = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const btnDefault = document.getElementById("btn-default");
const btnLoading = document.getElementById("btn-loading");
const successEl = document.getElementById("success-message");
const errorEl = document.getElementById("error-message");

if (formEl) {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    successEl?.classList.add("hidden");
    errorEl?.classList.add("hidden");

    if (submitBtn) submitBtn.disabled = true;
    btnDefault?.classList.add("hidden");
    btnLoading?.classList.remove("hidden");

    try {
      const data = new FormData(formEl);
      const response = await fetch(formEl.action, {
        method: formEl.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formEl.reset();
        successEl?.classList.remove("hidden");
        setTimeout(() => successEl?.classList.add("hidden"), 6000);
      } else {
        errorEl?.classList.remove("hidden");
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = "⚠️ Network error. Please try again.";
        errorEl.classList.remove("hidden");
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      btnLoading?.classList.add("hidden");
      btnDefault?.classList.remove("hidden");
      if (window.lucide && lucide.createIcons) lucide.createIcons();
    }
  });
}
