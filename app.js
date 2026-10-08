// ============================================================================
// Main Application Orchestrator & View Router
// ============================================================================

class ThemeManager {
  static currentTheme = 'dark'; // 'dark' | 'light'

  static init() {
    const saved = localStorage.getItem('founder_theme_mode') || 'dark';
    this.setTheme(saved, false);
    this.bindEvents();
  }

  static setTheme(mode, showNotification = true) {
    this.currentTheme = mode;
    localStorage.setItem('founder_theme_mode', mode);

    const body = document.body;
    const html = document.documentElement;
    const themeIcon = document.getElementById('nav-theme-icon');
    const darkBtn = document.getElementById('btn-theme-dark');
    const lightBtn = document.getElementById('btn-theme-light');

    if (mode === 'light') {
      body.classList.add('theme-light');
      html.classList.add('theme-light');
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-500';

      if (darkBtn && lightBtn) {
        darkBtn.className = 'p-3 rounded-2xl border-2 transition flex items-center gap-3 bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white cursor-pointer';
        lightBtn.className = 'p-3 rounded-2xl border-2 transition flex items-center gap-3 bg-zinc-950 border-zinc-500 text-white cursor-pointer shadow-sm';
      }
    } else {
      body.classList.remove('theme-light');
      html.classList.remove('theme-light');
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-zinc-300';

      if (darkBtn && lightBtn) {
        darkBtn.className = 'p-3 rounded-2xl border-2 transition flex items-center gap-3 bg-zinc-950 border-zinc-500 text-white cursor-pointer shadow-sm';
        lightBtn.className = 'p-3 rounded-2xl border-2 transition flex items-center gap-3 bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white cursor-pointer';
      }
    }

    if (showNotification && window.AuthController) {
      window.AuthController.showToast(`Switched to ${mode === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
    }
  }

  static toggle() {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  static bindEvents() {
    const toggleBtn = document.getElementById('nav-theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = () => this.toggle();
    }

    const darkBtn = document.getElementById('btn-theme-dark');
    const lightBtn = document.getElementById('btn-theme-light');

    if (darkBtn) {
      darkBtn.onclick = () => this.setTheme('dark');
    }
    if (lightBtn) {
      lightBtn.onclick = () => this.setTheme('light');
    }
  }
}

class App {
  static currentView = 'welcome'; // 'welcome' | 'dashboard' | 'finance' | 'marketing' | 'operations' | 'legal' | 'overall'

  static init() {
    // Initialize Theme Manager (Dark / Light)
    ThemeManager.init();

    // Check if this tab already has an active authenticated session
    const tabUser = window.State ? window.State.getCurrentUser() : null;
    if (tabUser) {
      this.currentView = 'dashboard';
    } else {
      // First-time or new tab startup: show login page first
      this.currentView = 'welcome';
    }

    // Initialize Auth & Presence
    window.AuthController.init();

    // Render the initial view
    this.renderCurrentView();

    // Subscribe to State changes
    window.State.subscribe((newState) => {
      const activeUser = window.State ? window.State.getCurrentUser() : null;
      // Only navigate to welcome if THIS TAB's session is logged out
      if (!activeUser && this.currentView !== 'welcome') {
        this.navigateTo('welcome');
      } else if (this.currentView === 'dashboard') {
        window.DashboardController.render();
      }
    });

    // Handle global keyboard shortcuts (e.g. Esc closes modals)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.fixed:not(.hidden)').forEach(modal => {
          modal.classList.add('hidden');
        });
      }
    });
  }

  static navigateTo(viewName) {
    this.currentView = viewName;
    window.currentActiveView = viewName;
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  static renderCurrentView() {
    const views = ['welcome', 'dashboard', 'finance', 'marketing', 'operations', 'legal', 'overall'];
    const navBar = document.getElementById('main-nav-bar');

    // Hide all view containers
    views.forEach(v => {
      const el = document.getElementById(`${v}-view`);
      if (el) el.classList.add('hidden');
    });

    // If on welcome screen, hide top navbar
    if (this.currentView === 'welcome') {
      if (navBar) navBar.classList.add('hidden');
      const welcomeEl = document.getElementById('welcome-view');
      if (welcomeEl) welcomeEl.classList.remove('hidden');
      return;
    }

    // Otherwise show navbar and update active user info
    if (navBar) navBar.classList.remove('hidden');
    window.AuthController.renderPresenceBadges();

    // Show active view container and trigger controller
    const activeEl = document.getElementById(`${this.currentView}-view`);
    if (activeEl) activeEl.classList.remove('hidden');

    try {
      switch (this.currentView) {
        case 'dashboard':
          window.DashboardController.init();
          break;
        case 'finance':
          window.FinanceController.init();
          break;
        case 'marketing':
          window.MarketingController.init();
          break;
        case 'operations':
          window.OperationsController.init();
          break;
        case 'legal':
          window.LegalController.init();
          break;
        case 'overall':
          window.OverallController.init();
          break;
      }
    } catch (err) {
      console.error(`Error rendering division view '${this.currentView}':`, err);
      if (activeEl) {
        activeEl.innerHTML = `
          <div class="p-8 text-center bg-zinc-950 border border-rose-500/40 rounded-2xl max-w-xl mx-auto my-12 space-y-4 shadow-2xl">
            <div class="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 class="text-base font-bold text-white">Temporary Loading Issue in ${this.currentView.toUpperCase()}</h3>
            <p class="text-xs text-zinc-400 font-mono">${err.message || 'An error occurred during division render.'}</p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="window.App.renderCurrentView()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition">
                <i class="fa-solid fa-rotate-right mr-1"></i> Retry Loading
              </button>
              <button onclick="window.App.navigateTo('dashboard')" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition">
                Return to Cockpit
              </button>
            </div>
          </div>
        `;
      }
    }

    // Update body theme attributes for contextual styling
    document.body.setAttribute('data-theme', this.currentView);
  }
}

window.ThemeManager = ThemeManager;
window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
