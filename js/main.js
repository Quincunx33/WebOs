// ====================== Main App Logic ======================
// expects: apps (from apps.js), windows/tasks (from window.js), startMenu in DOM

// Ensure globals
window.zCounter = window.zCounter || 10;

// Prevent double-launch: check existing window by appId and focus instead
function openApp(appId) {
  if (!window.apps || !apps[appId]) {
    console.error("App not found:", appId);
    return;
  }

  // যদি আগেই ওপেন থাকে → ফোকাস করে ফেলি
  if (apps[appId].isOpen) {
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
      return;
    } else {
      // edge case: flag true but window missing → reset
      apps[appId].isOpen = false;
    }
  }

  // নতুন লঞ্চ
  try {
    const result = apps[appId].launch(); // expected to return window node (from createWindow)
    // যদি app নিজে return না করে, fallback হিসেবে শেষ তৈরি হওয়া window খুঁজি
    const createdWin =
      (result && result.dataset && result.dataset.appId === appId)
        ? result
        : (windows.slice().reverse().find(w => w.appId === appId)?.el || null);

    if (createdWin) {
      apps[appId].isOpen = true;
      // ছোট্ট শুভেচ্ছা নোটিফিকেশন
      if (typeof showNotification === 'function' && !apps[appId].notified) {
        showNotification(`${apps[appId].name} launched`, `App started successfully`, {
          type: 'info', icon: apps[appId].icon, duration: 1800
        });
        apps[appId].notified = true;
      }
    }
  } catch (err) {
    console.error("Error launching app:", appId, err);
    if (typeof showNotification === 'function') {
      showNotification("App Error", `Failed to launch ${apps[appId].name}`, { type: 'error' });
    }
  }

  // Start menu hide (if exists)
  if (window.startMenu && startMenu.classList) startMenu.classList.add("hidden");
}

// -------- Power Menu (optional UI sugar) --------
function showPowerMenu() {
  const menu = document.createElement('div');
  menu.className = 'power-menu';
  menu.innerHTML = `
    <div class="power-option" data-action="lock">🔒 Lock</div>
    <div class="power-option" data-action="sleep">🌙 Sleep</div>
    <div class="power-option" data-action="restart">↻ Restart</div>
    <div class="power-option" data-action="shutdown">⏻ Shut Down</div>
  `;
  document.body.appendChild(menu);

  // outside click → close
  setTimeout(() => {
    const closeMenu = (e) => {
      if (!menu.contains(e.target) && e.target.id !== 'shutdown-btn') {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    document.addEventListener('click', closeMenu);
  }, 0);

  // actions
  menu.querySelectorAll('.power-option').forEach(option => {
    option.addEventListener('click', () => {
      const action = option.dataset.action;
      menu.remove();
      switch(action) {
        case 'lock':
          if (typeof lockDesktop === 'function') lockDesktop();
          break;
        case 'sleep':
          if (typeof showNotification === 'function') {
            showNotification('Sleep Mode', 'System is going to sleep');
          }
          setTimeout(() => typeof lockDesktop === 'function' && lockDesktop(), 800);
          break;
        case 'restart':
          if (typeof showNotification === 'function') {
            showNotification('Restarting', 'System will restart shortly', { type: 'warning' });
          }
          setTimeout(() => location.reload(), 1200);
          break;
        case 'shutdown':
          if (typeof powerOff === 'function') powerOff();
          break;
      }
    });
  });
}

// Hook shutdown button (if present in your HTML)
const shutdownBtnEl = document.getElementById('shutdown');
if (shutdownBtnEl) shutdownBtnEl.addEventListener('click', showPowerMenu);

// Add a small power button in taskbar (optional)
const taskbarRight = document.querySelector('.taskbar-right');
if (taskbarRight) {
  const powerButton = document.createElement('button');
  powerButton.id = 'shutdown-btn';
  powerButton.textContent = '⏻';
  powerButton.title = 'Power';
  powerButton.addEventListener('click', showPowerMenu);
  taskbarRight.prepend(powerButton);
}

// ===== Init helpers (Notification / Shortcuts) =====
document.addEventListener('DOMContentLoaded', function() {
  if (typeof NotificationSystem !== 'undefined') {
    window.notifications = new NotificationSystem();
    window.showNotification = function(title, message, options) {
      return notifications.show(title, message, options);
    };
  }
  if (typeof ShortcutManager !== 'undefined') {
    window.shortcuts = new ShortcutManager();
  }
});

// expose
window.openApp = openApp;