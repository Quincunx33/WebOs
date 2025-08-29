// Basic in-browser "filesystem" using localStorage
const FS_KEY = "webos.fs";
const SETTINGS_KEY = "webos.settings";
const defaults = {
  files: [
    { id: "welcome.txt", type: "text", content: "Welcome to Web OS Lite!\n\n- Double-click icons to open apps\n- Drag windows by the title bar\n- Minimize/Maximize from top-right\n- Notes auto-save\n- Files live in your browser storage", updatedAt: Date.now() }
  ],
  settings: {
    theme: "light",
    wallpaper: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    brightness: 100,
    notifications: true,
    pointer: 1,
    textScale: 1
  }
};

function loadFS() {
  try {
    return JSON.parse(localStorage.getItem(FS_KEY)) || defaults.files;
  } catch {
    return defaults.files;
  }
}

function saveFS(files) {
  localStorage.setItem(FS_KEY, JSON.stringify(files));
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || defaults.settings;
  } catch {
    return defaults.settings;
  }
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// Boot
const boot = document.getElementById("boot-screen");
const desktop = document.getElementById("desktop");
const wallpaper = document.getElementById("wallpaper");
const clock = document.getElementById("clock");
const startBtn = document.getElementById("start-btn");
const startMenu = document.getElementById("start-menu");
const shutdown = document.getElementById("shutdown");
const lockDesktopBtn = document.getElementById("lock-desktop");
const desktopIcons = document.getElementById("desktop-icons");
const taskbarApps = document.getElementById("taskbar-apps");
const windowTpl = document.getElementById("window-template");
let zCounter = 10;
let windows = [];
let tasks = new Map();

// Settings
let settings = loadSettings();

// Apply all settings
function applySettings() {
  // Theme
  desktop.className = settings.theme === "dark" ? "theme-dark" : "theme-light";
  
  // Wallpaper
  wallpaper.src = settings.wallpaper || defaults.settings.wallpaper;
  
  // Display
  if (settings.resolution) document.body.style.transform = `scale(${settings.resolution})`;
  if (settings.brightness) document.body.style.filter = `brightness(${settings.brightness}%)`;
  if (settings.nightLight) document.body.style.filter = "sepia(0.5) hue-rotate(20deg)";
  
  // Accent color
  if (settings.accent) document.documentElement.style.setProperty("--accent", settings.accent);
  
  // Text size
  if (settings.textScale) document.body.style.fontSize = settings.textScale + "em";
  
  // Pointer speed
  if (settings.pointer) document.body.style.setProperty("--cursor-scale", settings.pointer);
  
  // Username
  if (settings.username) console.log("User:", settings.username);
}

// Boot animation
setTimeout(() => boot.style.display = "none", 1200);

// Clock
function updateClock() {
  const d = new Date();
  clock.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "  " + d.toLocaleDateString();
}
updateClock();
setInterval(updateClock, 1000);

// Start menu toggle
startBtn.addEventListener("click", () => {
  startMenu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!startMenu.classList.contains("hidden")) {
    const inside = e.target.closest("#start-menu") || e.target.closest("#start-btn");
    if (!inside) startMenu.classList.add("hidden");
  }
});

// Open apps from start menu and icons
startMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu-item");
  if (!item) return;
  const app = item.dataset.app;
  if (app) openApp(app);
  if (item.id === "shutdown") powerOff();
  if (item.id === "lock-desktop") lockDesktop();
});

desktopIcons.addEventListener("dblclick", (e) => {
  const icon = e.target.closest(".icon");
  if (!icon) return;
  const app = icon.dataset.app;
  if (app) openApp(app);
});

// Power / Lock
function powerOff() {
  // Simulate shutdown -> boot
  boot.style.display = "flex";
  setTimeout(() => location.reload(), 900);
}

function lockDesktop() {
  let overlay = document.querySelector(".lock-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lock-overlay";
    overlay.innerHTML = `<div>Desktop Locked</div><input type="password" placeholder="Type password to unlock"/>`;
    document.body.appendChild(overlay);
    overlay.querySelector("input").addEventListener("keydown", ev => {
      if (ev.key === "Enter") { overlay.classList.remove("show"); }
    });
  }
  overlay.classList.add("show");
}

// Apply immediately at boot
applySettings();