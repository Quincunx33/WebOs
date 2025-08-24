// settings.js - সেটিংস অ্যাপ
function launchSettingsApp() {
  const wrap = document.createElement("div");
  wrap.className = "settings-app";
  wrap.innerHTML = `
    <div class="settings-sidebar">
      <div class="cat" data-cat="system">💻 System</div>
      <div class="cat" data-cat="devices">🔌 Bluetooth & Devices</div>
      <div class="cat" data-cat="network">🌐 Network & Internet</div>
      <div class="cat" data-cat="personalization">🎨 Personalization</div>
      <div class="cat" data-cat="apps">📦 Apps</div>
      <div class="cat" data-cat="accounts">👤 Accounts</div>
      <div class="cat" data-cat="time">⏰ Time & Language</div>
      <div class="cat" data-cat="gaming">🎮 Gaming</div>
      <div class="cat" data-cat="access">♿ Accessibility</div>
      <div class="cat" data-cat="privacy">🔒 Privacy & Security</div>
      <div class="cat" data-cat="about">ℹ️ About</div>
    </div>
    <div class="settings-content"><h2>Settings</h2><p>Select a category</p></div>
  `;
  wrap.querySelectorAll(".cat").forEach(c => {
    c.addEventListener("click", () => {
      renderSettingsContent(wrap.querySelector(".settings-content"), c.dataset.cat);
    });
  });

  createWindow("Settings", wrap, "settings");
}

function renderSettingsContent(panel, cat) {
  switch (cat) {

    // ------------------ 1. SYSTEM ------------------
    case "system":
      panel.innerHTML = `
        <h2>System</h2>
        <div class="group">
          <h3>Display</h3>
          <div><label>Resolution: 
            <select id="res">
              <option value="1" ${settings.resolution == 1 ?
        "selected" : ""}>100%</option>
              <option value="0.8" ${settings.resolution == 0.8 ?
        "selected" : ""}>80%</option>
              <option value="0.6" ${settings.resolution == 0.6 ?
        "selected" : ""}>60%</option>
            </select></label></div>
          <div><label>Brightness: 
            <input type="range" id="bright" min="50" max="150" value="${settings.brightness || 100}"></label></div>
          <div><label><input type="checkbox" id="night" ${settings.nightLight ? "checked" : ""}> Night Light</label></div>
        </div>
        <div class="group">
          <h3>Notifications</h3>
          <div><label><input type="checkbox" id="notif" ${settings.notifications ? "checked" : ""}> Enable Notifications</label></div>
        </div>
        <div class="group">
          <h3>System Operations</h3>
          <div><button id="simulate-sleep">Simulate Sleep</button></div>
          <div><button id="clear-storage">Clear Local Storage</button></div>
        </div>
      `;
      panel.querySelector("#res").onchange = e => {
        settings.resolution = e.target.value; saveSettings(settings); applySettings();
        showNotification("Resolution changed", `Display resolution set to ${e.target.value * 100}%`, { type: "info" });
      };
      panel.querySelector("#bright").oninput = e => {
        settings.brightness = e.target.value; saveSettings(settings); applySettings();
      };
      panel.querySelector("#night").onchange = e => {
        settings.nightLight = e.target.checked; saveSettings(settings); applySettings();
        showNotification("Night Light", e.target.checked ? "Enabled" : "Disabled", { type: "info" });
      };
      panel.querySelector("#notif").onchange = e => {
        settings.notifications = e.target.checked; saveSettings(settings);
        showNotification("Notifications", e.target.checked ? "Enabled" : "Disabled", { type: "info" });
      };
      panel.querySelector("#simulate-sleep").onclick = () => {
        showNotification("Sleep Mode", "System is going to sleep", { type: "warning" });
        setTimeout(() => lockDesktop(), 1000);
      };
      panel.querySelector("#clear-storage").onclick = () => {
        if (confirm("Clear all local storage? This will remove all files and settings.")) {
          localStorage.clear();
          showNotification("Storage cleared", "All data has been removed. Reloading...", { type: "info" });
          setTimeout(() => location.reload(), 1500);
        }
      };
      break;

    // ------------------ 2. DEVICES ------------------
    case "devices":
      panel.innerHTML = `
        <h2>Bluetooth & Devices</h2>
        <div class="group">
          <div><label><input type="checkbox" id="bt" ${settings.bt ? "checked" : ""}> Bluetooth (dummy)</label></div>
          <div><label><input type="checkbox" id="printer" ${settings.printer ? "checked" : ""}> Printer Installed (dummy)</label></div>
          <div><label>Pointer Speed: <input type="range" id="pointer" min="0.5" max="2" step="0.1" value="${settings.pointer || 1}"></label></div>
        </div>
      `;
      panel.querySelector("#bt").onchange = e => {
        settings.bt = e.target.checked; saveSettings(settings);
        showNotification("Bluetooth", e.target.checked ? "Enabled" : "Disabled", { type: "info" });
      };
      panel.querySelector("#printer").onchange = e => {
        settings.printer = e.target.checked; saveSettings(settings);
        showNotification("Printer", e.target.checked ? "Installed" : "Removed", { type: "info" });
      };
      panel.querySelector("#pointer").oninput = e => {
        settings.pointer = e.target.value;
        document.body.style.setProperty("--cursor-scale", settings.pointer);
        saveSettings(settings);
      };
      break;

    // ------------------ 3. NETWORK ------------------
    case "network":
      panel.innerHTML = `
        <h2>Network & Internet</h2>
        <div class="group">
          <p>Dummy connections:</p>
          <button id="wifi">Connect WiFi</button>
          <button id="ether">Toggle Ethernet</button>
          <button id="vpn">Add VPN</button>
          <div>Status: ${settings.netStatus || "Offline"}</div>
        </div>
      `;
      panel.querySelector("#wifi").onclick = () => {
        settings.netStatus = "WiFi Connected"; saveSettings(settings);
        renderSettingsContent(panel, "network");
        showNotification("WiFi Connected", "Successfully connected to WiFi", { type: "success" });
      };
      panel.querySelector("#ether").onclick = () => {
        settings.netStatus = settings.netStatus === "Ethernet" ? "Offline" : "Ethernet"; saveSettings(settings);
        renderSettingsContent(panel, "network");
        showNotification("Ethernet", settings.netStatus === "Ethernet" ? "Connected" : "Disconnected", { type: "info" });
      };
      panel.querySelector("#vpn").onclick = () => {
        settings.netStatus = "VPN Active"; saveSettings(settings);
        renderSettingsContent(panel, "network");
        showNotification("VPN", "VPN connection activated", { type: "success" });
      };
      break;

    // ------------------ 4. PERSONALIZATION ------------------
    case "personalization":
      panel.innerHTML = `
        <h2>Personalization</h2>
        <div class="group">
          <h3>Appearance</h3>
          <div><label>Theme: 
            <select id="theme">
              <option value="light" ${settings.theme === "light" ? "selected" : ""}>Light</option>
              <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Dark</option>
            </select></label></div>
          <div><label>Accent Color: <input type="color" id="accent" value="${settings.accent || "#0078d4"}"></label></div>
        </div>
        <div class="group">
          <h3>Wallpaper</h3>
          <div><label>Wallpaper URL: <input type="url" id="wallurl" value="${settings.wallpaper || ""}"> <button id="applywall">Apply</button></label></div>
          ${settings.wallpaper ? `<img src="${settings.wallpaper}" class="wall-thumb">` : ''}
        </div>
        <div class="group">
          <h3>Taskbar</h3>
          <div><label>Taskbar Position: 
            <select id="taskpos">
              <option value="bottom" ${settings.taskbar === "bottom" ? "selected" : ""}>Bottom</option>
              <option value="top" ${settings.taskbar === "top" ? "selected" : ""}>Top</option>
              <option value="left" ${settings.taskbar === "left" ? "selected" : ""}>Left</option>
              <option value="right" ${settings.taskbar === "right" ? "selected" : ""}>Right</option>
            </select></label></div>
        </div>
      `;
      panel.querySelector("#theme").onchange = e => {
        settings.theme = e.target.value; saveSettings(settings); applySettings();
        showNotification("Theme changed", `${e.target.value} theme applied`, { type: "info" });
      };
      panel.querySelector("#applywall").onclick = () => {
        settings.wallpaper = panel.querySelector("#wallurl").value; saveSettings(settings); applySettings();
        showNotification("Wallpaper", "New wallpaper applied", { type: "success" });
      };
      panel.querySelector("#accent").oninput = e => {
        settings.accent = e.target.value; saveSettings(settings); applySettings();
      };
      panel.querySelector("#taskpos").onchange = e => {
        settings.taskbar = e.target.value; saveSettings(settings);
        showNotification("Taskbar", `Position set to ${settings.taskbar}`, { type: "info" });
      };
      break;
    // ------------------ 5. APPS ------------------
    case "apps":
      panel.innerHTML = `
        <h2>Apps</h2>
        <div class="group">
          <h3>Installed Apps</h3>
          <div class="app-list">
            ${Object.values(apps).map(app => `
              <div class="app-item">
                <div 
                  class="app-icon">${app.icon}</div>
                <div class="app-info">
                  <div class="app-name">${app.name}</div>
                  <div class="app-desc">${app.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="group">
          <h3>App Management</h3>
          <div><button id="reset-apps">Reset Installed Apps</button></div>
        </div>
      `;
      panel.querySelector("#reset-apps").onclick = () => {
        if (confirm("Reset all apps? This will remove all files and data.")) {
          // এটি ফাইল সিস্টেমের ডেটা রিসেট করার পরিবর্তে অ্যাপের ডেটা রিসেট করবে।
          localStorage.removeItem("installedApps");
          showNotification("Apps reset", "All app data has been reset", { type: "info" });
          setTimeout(() => location.reload(), 1500);
        }
      };
      break;

    // ------------------ 6. ACCOUNTS ------------------
    case "accounts":
      panel.innerHTML = `
        <h2>Accounts</h2>
        <div class="group">
          <div><label>Username: <input type="text" id="uname" value="${settings.username || "User"}"></label></div>
          <div><label>Password: <input type="password" id="pwd" placeholder="Enter new password"></label></div>
          <div><button id="save-account">Save Changes</button></div>
        </div>
      `;
      panel.querySelector("#save-account").onclick = () => {
        settings.username = panel.querySelector("#uname").value;
        if (panel.querySelector("#pwd").value) {
          settings.password = panel.querySelector("#pwd").value;
          panel.querySelector("#pwd").value = "";
        }
        saveSettings(settings);
        applySettings();
        showNotification("Account updated", "User settings saved", { type: "success" });
      };
      break;

    // ------------------ 7. TIME ------------------
    case "time":
      panel.innerHTML = `
        <h2>Time & Language</h2>
        <div class="group">
          <div><label><input type="checkbox" id="auto" ${settings.autoTime ? "checked" : ""}> Auto Time</label></div>
          <div><label>Language:
            <select id="lang">
              <option value="en" ${settings.lang === "en" ? "selected" : ""}>English</option>
              <option value="bn" ${settings.lang === "bn" ? "selected" : ""}>বাংলা</option>
            </select></label></div>
        </div>
      `;
      panel.querySelector("#auto").onchange = e => {
        settings.autoTime = e.target.checked; saveSettings(settings);
        showNotification("Auto Time", e.target.checked ? "Enabled" : "Disabled", { type: "info" });
      };
      panel.querySelector("#lang").onchange = e => {
        settings.lang = e.target.value; saveSettings(settings);
        showNotification("Language", `Language set to ${e.target.value}`, { type: "info" });
      };
      break;

    // ------------------ 8. GAMING ------------------
    case "gaming":
      panel.innerHTML = `
        <h2>Gaming</h2>
        <div class="group">
          <label><input type="checkbox" id="xbar" ${settings.gamebar ? "checked" : ""}> Xbox Game Bar Overlay (dummy)</label>
        </div>
      `;
      panel.querySelector("#xbar").onchange = e => {
        settings.gamebar = e.target.checked; saveSettings(settings);
        showNotification("Game Bar", e.target.checked ? "Enabled" : "Disabled", { type: "info" });
      };
      break;

    // ------------------ 9. ACCESSIBILITY ------------------
    case "access":
      panel.innerHTML = `
        <h2>Accessibility</h2>
        <div class="group">
          <div><label>Text Size: <input type="range" id="tscale" min="0.8" max="2" step="0.1" value="${settings.textScale || 1}"></label></div>
          <div><label>Color Filter:
            <select id="cfilter">
              <option value="" ${!settings.cfilter ? "selected" : ""}>None</option>
              <option value="grayscale(1)" ${settings.cfilter == "grayscale(1)" ? "selected" : ""}>Grayscale</option>
              <option value="invert(1)" ${settings.cfilter == "invert(1)" ? "selected" : ""}>Invert</option>
              <option value="sepia(1)" ${settings.cfilter == "sepia(1)" ? "selected" : ""}>Sepia</option>
            </select></label></div>
        </div>
      `;
      panel.querySelector("#tscale").oninput = e => {
        settings.textScale = e.target.value; saveSettings(settings); applySettings();
      };
      panel.querySelector("#cfilter").onchange = e => {
        document.body.style.filter = e.target.value;
        settings.cfilter = e.target.value;
        saveSettings(settings);
        showNotification("Color Filter", e.target.value ? "Filter applied" : "Filter removed", { type: "info" });
      };
      break;
    // ------------------ 10. PRIVACY ------------------
    case "privacy":
      panel.innerHTML = `
        <h2>Privacy & Security</h2>
        <div class="group">
          <div>Status: ✅ Secure (demo)</div>
          <div><label><input type="checkbox" id="loc" ${settings.loc ? "checked" : ""}> Location Access</label></div>
          <div><label><input type="checkbox" id="mic" ${settings.mic ? "checked" : ""}> Microphone Access</label></div>
          <div><label><input type="checkbox" id="cam" ${settings.cam ? "checked" : ""}> Camera Access</label></div>
          <div><button id="update">Check for Updates</button></div>
        </div>
      `;
      panel.querySelector("#loc").onchange = e => {
        settings.loc = e.target.checked; saveSettings(settings);
        showNotification("Location", e.target.checked ? "Access granted" : "Access revoked", { type: "info" });
      };
      panel.querySelector("#mic").onchange = e => {
        settings.mic = e.target.checked; saveSettings(settings);
        showNotification("Microphone", e.target.checked ? "Access granted" : "Access revoked", { type: "info" });
      };
      panel.querySelector("#cam").onchange = e => {
        settings.cam = e.target.checked; saveSettings(settings);
        showNotification("Camera", e.target.checked ? "Access granted" : "Access revoked", { type: "info" });
      };
      panel.querySelector("#update").onclick = () => {
        showNotification("System Update", "Your system is up to date", { type: "success" });
      };
      break;

    // ------------------ 11. ABOUT ------------------
    case "about":
      panel.innerHTML = `
        <h2>About Web OS Lite</h2>
        <div class="about-content">
          <div class="about-logo">Web OS <span>Lite</span></div>
          <div class="about-version">Version 1.0.0</div>
          <div class="about-description">
            A lightweight web-based operating system built with HTML, CSS, and JavaScript.
          </div>
          <div class="about-features">
            <h3>Features:</h3>
            <ul>
              <li>Multi-app support</li>
              <li>File system management</li>
              <li>Window management</li>
              <li>Theme support (Light/Dark)</li>
              <li>Local storage</li>
              <li>Notifications system</li>
              <li>Keyboard shortcuts</li>
            </ul>
          </div>
          <div class="about-stats">
            <h3>System Information:</h3>
            <p>User Agent: ${navigator.userAgent}</p>
            <p>Screen Resolution: ${screen.width}x${screen.height}</p>
            <p>Local Storage: ${Math.round(JSON.stringify(localStorage).length / 1024)} KB used</p>
            <p>Browser: ${navigator.appName} ${navigator.appVersion}</p>
          </div>
        </div>
      `;
      break;
  }
}
