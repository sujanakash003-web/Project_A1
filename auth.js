// ============================================================================
// Authentication & Partner Presence Controller
// ============================================================================

class AuthController {
  static init() {
    this.bindEvents();
    this.renderPresenceBadges();
    
    // Subscribe to state updates to keep presence badges fresh
    window.State.subscribe(() => {
      this.renderPresenceBadges();
    });
  }

  static bindEvents() {
    const loginForm = document.getElementById('login-form');
    const loginCodeInput = document.getElementById('login-code-input');
    const toggleCodeVisibility = document.getElementById('toggle-code-visibility');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = loginCodeInput ? loginCodeInput.value : '';
        this.attemptLogin(code);
      });

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const code = loginCodeInput ? loginCodeInput.value : '';
          this.attemptLogin(code);
        });
      }
    }

    if (toggleCodeVisibility && loginCodeInput) {
      toggleCodeVisibility.addEventListener('click', () => {
        const type = loginCodeInput.type === 'password' ? 'text' : 'password';
        loginCodeInput.type = type;
        const icon = toggleCodeVisibility.querySelector('i');
        if (icon) {
          icon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        }
      });
    }

    // Quick Partner Selection Chips on Welcome Screen (convenience)
    document.querySelectorAll('[data-quick-login]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetUser = btn.getAttribute('data-quick-login');
        const state = window.State.state;
        const partnerCode = state.auth[targetUser]?.code;
        if (partnerCode && loginCodeInput) {
          loginCodeInput.value = partnerCode;
          this.attemptLogin(partnerCode);
        }
      });
    });

    // Settings Modal
    const settingsBtn = document.getElementById('nav-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');

    if (settingsBtn && settingsModal) {
      settingsBtn.addEventListener('click', () => {
        this.openSettingsModal();
      });
    }

    if (closeSettingsBtn && settingsModal) {
      closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
      });
    }

    // Backup & Restore handlers in Settings
    const exportBackupBtn = document.getElementById('btn-export-backup');
    if (exportBackupBtn) {
      exportBackupBtn.addEventListener('click', () => {
        const res = window.State.exportBackup();
        if (res.success) {
          this.showToast(`Backup saved to computer: ${res.filename}`, 'success');
        } else {
          this.showToast("Export failed: " + res.error, 'error');
        }
      });
    }

    const importBackupInput = document.getElementById('input-import-backup');
    if (importBackupInput) {
      importBackupInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          if (confirm("Restoring this backup will replace current workspace data. Continue?")) {
            const res = window.State.importBackup(content);
            if (res.success) {
              this.showToast("Backup restored successfully!", "success");
              if (settingsModal) settingsModal.classList.add('hidden');
              window.location.reload();
            } else {
              this.showToast("Restore failed: " + res.error, "error");
            }
          }
        };
        reader.readAsText(file);
      });
    }

    const resetDefaultsBtn = document.getElementById('btn-reset-defaults');
    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener('click', () => {
        if (confirm("Reset all project data to development defaults? This cannot be undone unless you have a backup.")) {
          window.State.resetToDefault();
          window.location.reload();
        }
      });
    }

    // Switch profile button from top navigation
    const navSwitchBtn = document.getElementById('nav-switch-btn');
    if (navSwitchBtn) {
      navSwitchBtn.addEventListener('click', () => {
        this.promptSwitchPartner();
      });
    }

    // Logout Button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.State.logout();
        if (window.App) window.App.navigateTo('welcome');
        this.showToast("Logged out of workspace.", "info");
      });
    }
  }

  static attemptLogin(rawCode) {
    const errorEl = document.getElementById('login-error-msg');
    const inputEl = document.getElementById('login-code-input');

    // Clean input: remove whitespace and surrounding quotes
    const code = (rawCode || '').trim().replace(/^["']|["']$/g, '').trim();

    if (!code) {
      if (errorEl) {
        errorEl.textContent = "Please enter your access code.";
        errorEl.classList.remove('hidden');
      }
      return;
    }

    const state = window.State.state;
    const milanStoredCode = ((state && state.auth && state.auth.milan && state.auth.milan.code) || "BusinessSlut@2167").trim();
    const sujanStoredCode = ((state && state.auth && state.auth.sujan && state.auth.sujan.code) || "PatnerInSlut@1557").trim();

    let matchedUser = null;
    
    // Check Milan
    if (
      code === milanStoredCode ||
      code.toLowerCase() === milanStoredCode.toLowerCase() ||
      code.toLowerCase() === "businessslut@2167"
    ) {
      matchedUser = 'milan';
    } 
    // Check Sujan (supports both 'PatnerInSlut@1557' and 'PartnerInSlut@1557')
    else if (
      code === sujanStoredCode ||
      code.toLowerCase() === sujanStoredCode.toLowerCase() ||
      code.toLowerCase() === "patnerinslut@1557" ||
      code.toLowerCase() === "partnerinslut@1557"
    ) {
      matchedUser = 'sujan';
    }

    if (matchedUser) {
      if (errorEl) errorEl.classList.add('hidden');
      
      // Perform state login
      window.State.login(matchedUser);

      // Trigger celebration / quote
      if (window.QuoteManager) {
        window.QuoteManager.getNextQuote();
      }
      
      // Navigate to main dashboard
      if (window.App) {
        window.App.navigateTo('dashboard');
        const name = (state.auth && state.auth[matchedUser] && state.auth[matchedUser].name) || (matchedUser === 'milan' ? 'Milan Jadhav' : 'Sujan Akash');
        this.showToast(`Welcome back, ${name}!`, 'success');
      }
    } else {
      if (errorEl) {
        errorEl.textContent = "Invalid access code. Please check your credentials.";
        errorEl.classList.remove('hidden');
      }
      if (inputEl) {
        inputEl.classList.add('shake-anim', 'border-rose-500');
        setTimeout(() => inputEl.classList.remove('shake-anim'), 600);
      }
    }
  }

  static promptSwitchPartner() {
    const currentUser = window.State.getCurrentUser();
    const otherUser = window.State.getOtherUser();
    const currentName = currentUser ? window.State.state.auth[currentUser].name : 'Current User';
    const otherName = otherUser ? window.State.state.auth[otherUser].name : 'Co-Founder';

    const confirmed = confirm(`Switching profile will log out ${currentName}.\n\nTo enter ${otherName}'s profile, their secret passcode must be entered on the login screen.\n\nDo you want to log out and switch now?`);
    if (confirmed) {
      this.switchProfile();
    }
  }

  static switchProfile() {
    const otherUser = window.State.getOtherUser();
    const otherName = otherUser ? window.State.state.auth[otherUser].name : 'Co-Founder';

    // Log out current user
    window.State.logout();

    // Close settings modal if open
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('hidden');

    // Return to login screen
    if (window.App) {
      window.App.navigateTo('welcome');
    }

    // Reset login input and focus
    const inputEl = document.getElementById('login-code-input');
    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
    }

    this.showToast(`Logged out. Please enter credentials for ${otherName} to proceed.`, 'info');
  }

  static openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    // Render co-founder credentials dynamically based on active session
    this.renderSettingsCredentials();

    const networkUrlSpan = document.getElementById('text-network-access-url');
    const copyUrlBtn = document.getElementById('btn-copy-network-url');

    // Detect network URL from server
    if (networkUrlSpan) {
      if (window.location.protocol.startsWith('http')) {
        fetch('/api/network-info')
          .then(r => r.json())
          .then(info => {
            if (info.network_url) {
              networkUrlSpan.textContent = info.network_url;
              if (copyUrlBtn) {
                copyUrlBtn.onclick = () => {
                  navigator.clipboard.writeText(info.network_url);
                  AuthController.showToast("Network URL copied to clipboard!", "success");
                };
              }
            }
          })
          .catch(() => {
            networkUrlSpan.textContent = window.location.origin;
          });
      } else {
        networkUrlSpan.textContent = "Run 'python server.py' to enable Wi-Fi sharing";
      }
    }

    modal.classList.remove('hidden');
  }

  static renderSettingsCredentials() {
    const container = document.getElementById('settings-credentials-container');
    if (!container) return;

    const state = window.State.state;
    const currentUser = window.State.getCurrentUser();
    const otherUser = window.State.getOtherUser();

    if (!currentUser || !state.auth[currentUser]) {
      container.innerHTML = `
        <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-400">
          Please log in to manage your access credentials.
        </div>
      `;
      return;
    }

    const myData = state.auth[currentUser];
    const otherData = otherUser ? state.auth[otherUser] : null;
    const isMilan = currentUser === 'milan';
    const activeColorClass = isMilan ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400';
    const activeBtnClass = isMilan ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 text-blue-400 border border-zinc-700';
    const activeFocusClass = isMilan ? 'focus:border-emerald-500' : 'focus:border-blue-500';

    container.innerHTML = `
      <div class="space-y-4">
        <h4 class="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-amber-400"></i> Profile Passcode & Isolation
          </span>
          <span class="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <i class="fa-solid fa-lock text-[9px]"></i> Protected
          </span>
        </h4>

        <!-- ACTIVE PROFILE: YOUR CREDENTIALS -->
        <div class="p-4 rounded-2xl bg-zinc-950 border ${activeColorClass} space-y-3 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow" style="background-color: ${myData.color}">
                ${myData.avatar}
              </div>
              <div>
                <div class="text-xs font-bold text-white flex items-center gap-2">
                  <span>${myData.name}</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                    Active Session
                  </span>
                </div>
                <div class="text-[10px] text-zinc-400">Your confidential access credentials</div>
              </div>
            </div>

            <!-- Current Passcode with Show/Hide -->
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-zinc-500">Code:</span>
              <button type="button" id="btn-toggle-my-pwd-view" class="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 px-2 py-1 bg-zinc-900 rounded-lg border border-zinc-800 font-mono">
                <span id="text-my-pwd-display">••••••••</span>
                <i class="fa-solid fa-eye text-[11px] text-zinc-400" id="icon-my-pwd-eye"></i>
              </button>
            </div>
          </div>

          <!-- Update Your Passcode Form -->
          <div class="space-y-1.5 pt-1 border-t border-zinc-900">
            <label class="text-[11px] font-semibold text-zinc-300">Change Your Login Passcode</label>
            <div class="flex gap-2">
              <input type="text" id="input-active-user-new-code" placeholder="Enter new passcode for ${myData.name.split(' ')[0]}..."
                class="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none ${activeFocusClass} font-mono" />
              <button type="button" id="btn-update-active-user-code" class="px-3.5 py-2 ${activeBtnClass} text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-check text-xs"></i>
                <span>Update</span>
              </button>
            </div>
            <p class="text-[10px] text-zinc-500">Only you can update your own login passcode.</p>
          </div>
        </div>

        <!-- PROTECTED CO-FOUNDER (LOCKED PROFILE) -->
        ${otherData ? `
        <div class="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400 bg-zinc-800 border border-zinc-700">
                ${otherData.avatar}
              </div>
              <div>
                <div class="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <span>${otherData.name}</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-lock text-[9px] text-amber-400"></i> Protected
                  </span>
                </div>
                <div class="text-[10px] text-zinc-500 font-mono">Cross-profile modification prohibited</div>
              </div>
            </div>
            <span class="text-xs text-zinc-600 font-mono select-none tracking-widest">••••••••••••</span>
          </div>

          <div class="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
            <i class="fa-solid fa-shield-halved text-amber-400 mt-0.5 text-xs"></i>
            <div>
              <span>You cannot view or modify <strong>${otherData.name}</strong>'s credentials from this account. To change their passcode or access their workspace, you must log out and authenticate with their credentials.</span>
            </div>
          </div>

          <div class="flex justify-end pt-1">
            <button type="button" id="btn-settings-switch-partner" class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer">
              <i class="fa-solid fa-right-from-bracket text-zinc-400"></i>
              <span>Log Out & Switch to ${otherData.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
        ` : ''}
      </div>
    `;

    // Toggle reveal password
    let isPwdRevealed = false;
    const toggleBtn = document.getElementById('btn-toggle-my-pwd-view');
    const pwdDisplay = document.getElementById('text-my-pwd-display');
    const eyeIcon = document.getElementById('icon-my-pwd-eye');

    if (toggleBtn && pwdDisplay && eyeIcon) {
      toggleBtn.onclick = () => {
        isPwdRevealed = !isPwdRevealed;
        if (isPwdRevealed) {
          pwdDisplay.textContent = myData.code;
          eyeIcon.className = 'fa-solid fa-eye-slash text-[11px] text-amber-400';
        } else {
          pwdDisplay.textContent = '••••••••';
          eyeIcon.className = 'fa-solid fa-eye text-[11px] text-zinc-400';
        }
      };
    }

    // Update password
    const updateBtn = document.getElementById('btn-update-active-user-code');
    const inputEl = document.getElementById('input-active-user-new-code');

    if (updateBtn && inputEl) {
      updateBtn.onclick = () => {
        const val = inputEl.value.trim();
        if (val.length < 4) {
          alert("Passcode must be at least 4 characters long.");
          return;
        }
        const res = window.State.updatePassword(currentUser, val);
        if (res.success) {
          this.showToast(`Your login passcode has been updated successfully!`, 'success');
          inputEl.value = '';
          this.renderSettingsCredentials();
        } else {
          this.showToast(res.error || "Failed to update passcode.", 'error');
        }
      };
    }

    // Switch partner button
    const switchPartnerBtn = document.getElementById('btn-settings-switch-partner');
    if (switchPartnerBtn) {
      switchPartnerBtn.onclick = () => {
        this.promptSwitchPartner();
      };
    }
  }

  static renderPresenceBadges() {
    const state = window.State.state;
    const currentUser = window.State.getCurrentUser();

    // Elements on welcome page and top navigation
    const milanStatusNodes = document.querySelectorAll('.presence-milan');
    const sujanStatusNodes = document.querySelectorAll('.presence-sujan');

    const updatePresenceUI = (nodes, userKey, name) => {
      const p = state.presence[userKey];
      const isSelf = currentUser === userKey;
      const isOnline = isSelf || (p && p.isOnline);

      nodes.forEach(el => {
        el.innerHTML = `
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isOnline 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-zinc-900/60 border-zinc-700 text-zinc-400'
          }">
            <span class="relative flex h-2.5 w-2.5">
              ${isOnline ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>' : ''}
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-600'}"></span>
            </span>
            <span class="font-semibold text-zinc-200">${name}</span>
            <span class="text-[10px] opacity-80">(${isOnline ? 'Online' : 'Away'})</span>
          </div>
        `;
      });
    };

    updatePresenceUI(milanStatusNodes, 'milan', 'Milan Jadhav');
    updatePresenceUI(sujanStatusNodes, 'sujan', 'Sujan Akash');

    // Update active user avatar badge in navbar (informative only, no auto-switch)
    const activeUserBadge = document.getElementById('nav-active-user-badge');
    if (activeUserBadge && currentUser) {
      const uData = state.auth[currentUser];
      activeUserBadge.innerHTML = `
        <div class="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 rounded-full border border-zinc-800" title="Active Profile: ${uData.name}">
          <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style="background-color: ${uData.color}">
            ${uData.avatar}
          </div>
          <span class="text-xs font-semibold text-zinc-200">${uData.name}</span>
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      `;
    }
  }

  static showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colorClasses = {
      success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
      error: 'bg-rose-900/90 border-rose-500 text-rose-100',
      info: 'bg-blue-900/90 border-blue-500 text-blue-100'
    }[type] || 'bg-zinc-800 border-zinc-600 text-white';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium transform transition-all duration-300 translate-y-2 opacity-0 ${colorClasses}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-400' : type === 'error' ? 'fa-triangle-exclamation text-rose-400' : 'fa-circle-info text-blue-400'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-4');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

window.AuthController = AuthController;
