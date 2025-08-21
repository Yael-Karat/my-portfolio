// Theme toggle
(function() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialize AOS and Lucide icons
window.addEventListener('DOMContentLoaded', () => { 
  AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' }); 
  lucide.createIcons(); 
  loadRepos();
});

// Load GitHub repos dynamically
async function loadRepos() {
  try {
    const response = await fetch("https://api.github.com/users/Yael-Karat/repos?sort=updated&per_page=100");
    const repos = await response.json();
    const repoGrid = document.getElementById("repo-grid");
    repoGrid.innerHTML = "";
    repos.forEach(repo => {
      const card = document.createElement("article");
      card.className = "group relative rounded-3xl overflow-hidden soft-shadow border border-white/10 card-gradient-animated";
      card.innerHTML = `
        <div class="h-40 bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/30"></div>
        <div class="p-5">
          <h3 class="font-semibold text-lg">${repo.name}</h3>
          <p class="mt-2 text-sm text-slate-300/90">${repo.description || "No description provided."}</p>
          <div class="mt-3 flex flex-wrap gap-2">${repo.language ? `<span class="tag">${repo.language}</span>` : ""}</div>
          <div class="mt-4 flex gap-3">
            <a href="${repo.html_url}" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition transform hover:-translate-y-0.5 active:translate-y-0 border border-white/20 text-white/90 hover:text-white bg-white/5 backdrop-blur">
              <i data-lucide="github" class="w-5 h-5"></i>Code
            </a>
          </div>
        </div>
      `;
      repoGrid.appendChild(card);
    });
    lucide.createIcons();
  } catch (err) { console.error(err); }
}

document.getElementById('year').textContent = new Date().getFullYear();

    // Handle Formspree submission with fetch + robust loading state
    const formEl = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnDefault = document.getElementById("btn-default");
    const btnLoading = document.getElementById("btn-loading");
    const successEl = document.getElementById("success-message");
    const errorEl = document.getElementById("error-message");

    formEl.addEventListener("submit", async function(e) {
      e.preventDefault();
      successEl.classList.add("hidden");
      errorEl.classList.add("hidden");

      // Disable button + toggle UI state
      submitBtn.disabled = true;
      btnDefault.classList.add("hidden");
      btnLoading.classList.remove("hidden");

      try {
        const data = new FormData(formEl);
        const response = await fetch(formEl.action, {
          method: formEl.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formEl.reset();
          successEl.classList.remove("hidden");
          // Optional: auto-hide success after a few seconds
          setTimeout(() => successEl.classList.add("hidden"), 6000);
        } else {
          errorEl.classList.remove("hidden");
        }
      } catch (err) {
        errorEl.textContent = "⚠️ Network error. Please try again.";
        errorEl.classList.remove("hidden");
      } finally {
        // Restore button
        submitBtn.disabled = false;
        btnLoading.classList.add("hidden");
        btnDefault.classList.remove("hidden");
        // Recreate icons in case DOM changed
        lucide.createIcons();
      }
    });