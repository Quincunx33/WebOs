// apps.js - একটি মডুলার অ্যাপ ম্যানেজমেন্ট সিস্টেম (ফিক্সড)
const apps = {
  notes: {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    description: 'Take notes and save them locally',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchNotes === 'function') {
        launchNotes();
      } else {
        console.error('launchNotes function not found');
        showError('Notes app could not be launched.');
      }
    }
  },
  files: {
    id: 'files',
    name: 'Files',
    icon: '📁',
    description: 'Manage your files and documents',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchFiles === 'function') {
        launchFiles();
      } else {
        console.error('launchFiles function not found');
        showError('Files app could not be launched.');
      }
    }
  },
  browser: {
    id: 'browser',
    name: 'Browser',
    icon: '🌐',
    description: 'Browse the internet',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchBrowser === 'function') {
        launchBrowser();
      } else {
        console.error('launchBrowser function not found');
        showError('Browser app could not be launched.');
      }
    }
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'System settings and preferences',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchSettingsApp === 'function') {
        launchSettingsApp();
      } else {
        console.error('launchSettingsApp function not found');
        showError('Settings app could not be launched.');
      }
    }
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    description: 'Command line interface',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchTerminal === 'function') {
        launchTerminal();
      } else {
        console.error('launchTerminal function not found');
        showError('Terminal app could not be launched.');
      }
    }
  },
  music: {
    id: 'music',
    name: 'Music Player',
    icon: '🎵',
    description: 'Play your favorite music',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchMusic === 'function') {
        launchMusic();
      } else {
        console.error('Music app not loaded');
        showError('Music player could not be launched');
      }
    }
  },
  calculator: {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    description: 'Scientific calculator with history',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchCalculator === 'function') {
        launchCalculator();
      } else {
        console.error('Calculator app not loaded');
        showError('Calculator could not be launched');
      }
    }
  },
  taskmanager: {
    id: 'taskmanager',
    name: 'Task Manager',
    icon: '✅',
    description: 'Manage your tasks and to-do lists',
    isOpen: false,
    notified: false,
    launch: function() {
      if (typeof launchTaskManager === 'function') {
        launchTaskManager();
      } else {
        console.error('Task Manager app not loaded');
        showError('Task Manager could not be launched');
      }
    }
  }
};
// এরর শো করার ফাংশন
function showError(message) {
  console.error('App Error:', message);
  // শুধুমাত্র notification দেখান, নতুন window না
  if (typeof showNotification === 'function') {
    showNotification("App Error", message, { type: 'error', duration: 3000 });
  }
}

// অ্যাপ ম্যানেজমেন্ট ফাংশন
function openApp(appId) {
  console.log('Opening app:', appId);
  if (apps[appId]) {
    // যদি অ্যাপ ইতিমধ্যে open থাকে, focus করুন
    if (apps[appId].isOpen) {
      console.log('App already open, focusing:', appId);
      const appWindow = window.windows?.find(w => w.appId === appId);
      if (appWindow && typeof focusWindow === 'function') {
        focusWindow(appWindow.id);
        return true;
      }
    }
    
    // Start menu লুকান
    if (window.startMenu && window.startMenu.classList) {
      window.startMenu.classList.add("hidden");
    }
    
    // অ্যাপ লঞ্চ করুন
    try {
      apps[appId].launch();
      apps[appId].isOpen = true;
      
      // নোটিফিকেশন দেখান (শুধুমাত্র প্রথমবার)
      if (typeof showNotification === 'function' && !apps[appId].notified) {
        showNotification(
          `${apps[appId].name} launched`, 
          `App started successfully`, 
          { type: 'info', icon: apps[appId].icon, duration: 2000 }
        );
        apps[appId].notified = true;
      }
      return true;
    } catch (error) {
      console.error('Error launching app:', error);
      showError(`Failed to launch ${apps[appId].name}: ${error.message}`);
      return false;
    }
  }
  
  console.error(`App ${appId} not found`);
  showError(`App "${appId}" not found`);
  return false;
}

function getAllApps() {
  return Object.values(apps);
}

function getAppInfo(appId) {
  return apps[appId] || null;
}

// Window close হলে isOpen status update করার জন্য
const originalCloseWindow = window.closeWindow;
window.closeWindow = function(id) {
  console.log('Closing window:', id);
  const windowObj = window.windows?.find(w => w.id === id);
  if (windowObj && apps[windowObj.appId]) {
    apps[windowObj.appId].isOpen = false;
    apps[windowObj.appId].notified = false; // Reset notification flag
    console.log('App status updated:', windowObj.appId, 'isOpen: false');
  }
  
  if (typeof originalCloseWindow === 'function') {
    return originalCloseWindow(id);
  }
};
// Event listener registration function (একবার만 call হবে)
function setupAppEventListeners() {
  // Start menu event listener
  const startMenu = document.getElementById('start-menu');
  if (startMenu && !startMenu._appListenerAdded) {
    startMenu._appListenerAdded = true;
    startMenu.addEventListener('click', function(e) {
      const menuItem = e.target.closest('.menu-item');
      if (menuItem && menuItem.dataset.app) {
        e.stopPropagation();
        openApp(menuItem.dataset.app);
      }
    });
  }
  
  // Desktop icons event listener
  const desktopIcons = document.getElementById('desktop-icons');
  if (desktopIcons && !desktopIcons._appListenerAdded) {
    desktopIcons._appListenerAdded = true;
    desktopIcons.addEventListener('dblclick', function(e) {
      const icon = e.target.closest('.icon');
      if (icon && icon.dataset.app) {
        e.stopPropagation();
        openApp(icon.dataset.app);
      }
    });
  }
  
  // Lock desktop button
  const lockBtn = document.getElementById('lock-desktop');
  if (lockBtn && !lockBtn._appListenerAdded) {
    lockBtn._appListenerAdded = true;
    lockBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (typeof lockDesktop === 'function') {
        lockDesktop();
      }
    });
  }
  
  // Shutdown button
  const shutdownBtn = document.getElementById('shutdown');
  if (shutdownBtn && !shutdownBtn._appListenerAdded) {
    shutdownBtn._appListenerAdded = true;
    shutdownBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (typeof powerOff === 'function') {
        powerOff();
      }
    });
  }
}

// গ্লোবালভাবে ফাংশনগুলি available করুন
window.apps = apps;
window.openApp = openApp;
window.getAllApps = getAllApps;
window.getAppInfo = getAppInfo;
window.setupAppEventListeners = setupAppEventListeners;
// DOM লোড হওয়ার পর ইভেন্ট লিসেনার সেট আপ করুন (একবার만)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up app listeners');
    setupAppEventListeners();
  });
} else {
  console.log('DOM already ready, setting up app listeners');
  setTimeout(setupAppEventListeners, 100);
}

// ডিবাগিং এর জন্য লগ করুন
console.log('Web OS Lite Apps loaded successfully');
console.log('Available apps:', Object.keys(apps));

