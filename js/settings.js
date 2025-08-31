/**
 * settings.js - redesigned with enhanced UI, animations, and new sections
 * Updated to include only System, Network & Internet, Personalizations, Notifications, Account (with Google Sign-In), Time & Language, and About
 * Removed Apps, Gaming, and Accessibility sections
 * Integrated Google Sign-In with provided Client ID
 */

function launchSettingsApp() {
  const wrap = document.createElement("div");
  wrap.className = "settings-app";
  wrap.innerHTML = `
    <div class="settings-sidebar">
      <div class="cat active" data-cat="system">💻 System</div>
      <div class="cat" data-cat="network">🌐 Network & Internet</div>
      <div class="cat" data-cat="personalization">🎨 Personalizations</div>
      <div class="cat" data-cat="notifications">🔔 Notifications</div>
      <div class="cat" data-cat="accounts">👤 Account</div>
      <div class="cat" data-cat="time">⏰ Time & Language</div>
      <div class="cat" data-cat="about">ℹ️ About</div>
    </div>
    <div class="settings-content">
      <div class="settings-header">
        <h2>Settings</h2>
        <p>Select a category to get started</p>
      </div>
    </div>
  `;
  // Add animation class for entrance effect
  setTimeout(() => {
    wrap.classList.add('loaded');
  }, 50);
  // Category selection with animation
  wrap.querySelectorAll(".cat").forEach(c => {
    c.addEventListener("click", (e) => {
      // Remove active class from all categories
      wrap.querySelectorAll(".cat").forEach(item => {
        item.classList.remove("active");
      });
      
      // Add active class to clicked category with animation
      c.classList.add("active");
      c.style.animation = "pulse 0.3s ease";
      setTimeout(() => {
        c.style.animation = "";
      }, 300);
      
      // Render content with transition
      const contentPanel = wrap.querySelector(".settings-content");
      contentPanel.style.opacity = "0";
      
      setTimeout(() => {
        renderSettingsContent(contentPanel, c.dataset.cat);
        contentPanel.style.opacity = "1";
      }, 200);
    });
  });
  createWindow("Settings", wrap, "settings");
}

function renderSettingsContent(panel, cat) {
  // Add transition class
  panel.classList.add("transitioning");
  // Clear previous content
  panel.innerHTML = `<div class="settings-header"><h2>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2></div>`;
  setTimeout(() => {
    panel.classList.remove("transitioning");
    
    switch(cat) {
      // ------------------ 1. SYSTEM ------------------
      case "system":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>System</h2>
            <p>Display, sound, and system operations</p>
          </div>
          <div class="group">
            <h3>🖥️ Display</h3>
            <div class="setting-item">
              <label>Resolution Scaling</label>
              <select id="res" class="fancy-select">
                <option value="1" ${settings.resolution == 1 ? "selected" : ""}>100% (Recommended)</option>
                <option value="0.8" ${settings.resolution == 0.8 ? "selected" : ""}>80%</option>
                <option value="0.6" ${settings.resolution == 0.6 ? "selected" : ""}>60%</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Brightness: <span id="bright-value">${settings.brightness || 100}%</span></label>
              <input type="range" id="bright" min="50" max="150" value="${settings.brightness || 100}" class="slider">
            </div>
            <div class="setting-item toggle-item">
              <label>Night Light</label>
              <label class="switch">
                <input type="checkbox" id="night" ${settings.nightLight ? "checked" : ""}>
                <span class="slider-round"></span>
              </label>
            </div>
          </div>
          <div class="group">
            <h3>🔊 Sound</h3>
            <div class="setting-item">
              <label>Volume: <span id="volume-value">${settings.volume || 80}%</span></label>
              <input type="range" id="volume" min="0" max="100" value="${settings.volume || 80}" class="slider">
            </div>
            <div class="setting-item">
              <label>Output Device</label>
              <select id="output-device" class="fancy-select">
                <option value="default">Default</option>
                <option value="headphones">Headphones</option>
                <option value="speakers">Speakers</option>
              </select>
            </div>
            <div class="setting-item toggle-item">
              <label>Sound Effects</label>
              <label class="switch">
                <input type="checkbox" id="sound-effects" ${settings.soundEffects !== false ? "checked" : ""}>
                <span class="slider-round"></span>
              </label>
            </div>
          </div>
          <div class="group">
            <h3>⚡ Power & Battery</h3>
            <div class="setting-item">
              <label>Power Mode</label>
              <select id="power-mode" class="fancy-select">
                <option value="balanced" ${settings.powerMode === "balanced" ? "selected" : ""}>Balanced</option>
                <option value="power-saver" ${settings.powerMode === "power-saver" ? "selected" : ""}>Power Saver</option>
                <option value="performance" ${settings.powerMode === "performance" ? "selected" : ""}>Best Performance</option>
              </select>
            </div>
            <div class="setting-item toggle-item">
              <label>Battery Saver</label>
              <label class="switch">
                <input type="checkbox" id="battery-saver" ${settings.batterySaver ? "checked" : ""}>
                <span class="slider-round"></span>
              </label>
            </div>
            <div class="setting-item">
              <label>Screen Timeout</label>
              <select id="screen-timeout" class="fancy-select">
                <option value="1" ${settings.screenTimeout == 1 ? "selected" : ""}>1 minute</option>
                <option value="5" ${settings.screenTimeout == 5 ? "selected" : ""}>5 minutes</option>
                <option value="10" ${settings.screenTimeout == 10 ? "selected" : ""}>10 minutes</option>
                <option value="30" ${settings.screenTimeout == 30 ? "selected" : ""}>30 minutes</option>
                <option value="0" ${settings.screenTimeout == 0 ? "selected" : ""}>Never</option>
              </select>
            </div>
          </div>
          <div class="group">
            <h3>🛠️ System Operations</h3>
            <div class="setting-item">
              <button id="clear-storage" class="danger-button">Clear All Local Storage</button>
              <p class="help-text">This will remove all files, settings, and app data.</p>
            </div>
          </div>
        `;
        // Event listeners for system settings
        panel.querySelector("#res").onchange = e => {
          settings.resolution = parseFloat(e.target.value);
          saveSettings(settings); 
          applySettings();
          showNotification("Display", `Resolution set to ${e.target.value * 100}%`, {type: "info", icon: "🖥️"});
        };
        panel.querySelector("#bright").oninput = e => {
          settings.brightness = parseInt(e.target.value); 
          panel.querySelector("#bright-value").textContent = `${e.target.value}%`;
          saveSettings(settings); 
          applySettings();
        };
        panel.querySelector("#night").onchange = e => {
          settings.nightLight = e.target.checked;
          saveSettings(settings);
          applySettings();
          showNotification("Display", `Night Light ${e.target.checked ? "enabled" : "disabled"}`, {type: "info", icon: "🖥️"});
        };
        panel.querySelector("#volume").oninput = e => {
          settings.volume = parseInt(e.target.value);
          panel.querySelector("#volume-value").textContent = `${e.target.value}%`;
          saveSettings(settings);
          SettingsWorkable.setVolume(settings.volume);
        };
        panel.querySelector("#output-device").onchange = e => {
          settings.outputDevice = e.target.value;
          saveSettings(settings);
          showNotification("Sound", `Output set to ${e.target.value}`, {type: "info", icon: "🔊"});
        };
        panel.querySelector("#sound-effects").onchange = e => {
          settings.soundEffects = e.target.checked;
          saveSettings(settings);
          SettingsWorkable.enableSounds(settings.soundEffects);
          showNotification("Sound", `Sound Effects ${e.target.checked ? "enabled" : "disabled"}`, {type: "info", icon: "🔊"});
        };
        panel.querySelector("#power-mode").onchange = e => {
          settings.powerMode = e.target.value;
          saveSettings(settings);
          SettingsWorkable.setPowerMode(settings.powerMode);
          showNotification("Power", `Power mode set to ${e.target.value}`, {type: "info", icon: "⚡"});
        };
        panel.querySelector("#battery-saver").onchange = e => {
          settings.batterySaver = e.target.checked;
          saveSettings(settings);
          SettingsWorkable.setBatterySaver(settings.batterySaver);
          showNotification("Power", `Battery Saver ${e.target.checked ? "enabled" : "disabled"}`, {type: "info", icon: "⚡"});
        };
        panel.querySelector("#screen-timeout").onchange = e => {
          settings.screenTimeout = parseInt(e.target.value);
          saveSettings(settings);
          SettingsWorkable.enableScreenTimeout(settings.screenTimeout);
          showNotification("Power", `Screen timeout set to ${e.target.value} minute(s)`, {type: "info", icon: "⚡"});
        };
        panel.querySelector("#clear-storage").onclick = () => {
          localStorage.clear();
          settings = defaults.settings;
          saveSettings(settings);
          applySettings();
          showNotification("System", "All local storage cleared", {type: "warning", icon: "🛠️"});
        };
        break;
      // ------------------ 2. NETWORK & INTERNET ------------------
      case "network":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>Network & Internet</h2>
            <p>Wi-Fi, VPN, data usage, and more</p>
          </div>
          <div class="group">
            <h3>🌍 Network Status</h3>
            <div class="network-info">
              <div class="info-row">
                <span class="label">Wi-Fi</span>
                <span class="status ${navigator.onLine ? 'online' : 'offline'}">${navigator.onLine ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div class="info-row">
                <span class="label">IP Address</span>
                <span class="status">N/A</span>
              </div>
            </div>
          </div>
          <div class="group">
            <h3>📊 Data Usage</h3>
            <div class="data-usage">
              <div class="usage-chart"></div>
              <div class="usage-stats"></div>
            </div>
            <div class="setting-item">
              <button id="clear-usage">Clear Usage Data</button>
            </div>
          </div>
          <div class="group">
            <h3>🔒 Security</h3>
            <div class="setting-item">
              <label>Blocked Domains</label>
              <input type="text" id="block-domain" placeholder="e.g., example.com">
              <button id="add-block">Add</button>
            </div>
            <div id="blocked-list"></div>
          </div>
        `;
        // Event listeners for network
        panel.querySelector("#clear-usage").onclick = () => {
          SettingsWorkable.clearUsage();
          showNotification("Network", "Data usage cleared", {type: "info", icon: "📊"});
        };
        panel.querySelector("#add-block").onclick = () => {
          const input = panel.querySelector("#block-domain");
          if (input.value) {
            SettingsWorkable.addBlockedDomain(input.value);
            input.value = "";
            showNotification("Security", `Blocked ${input.value}`, {type: "info", icon: "🔒"});
          }
        };
        break;
      // ------------------ 3. PERSONALIZATIONS ------------------
      case "personalization":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>Personalizations</h2>
            <p>Customize your desktop experience</p>
          </div>
          <div class="group">
            <h3>🎨 Theme</h3>
            <div class="setting-item">
              <label>Theme</label>
              <select id="theme" class="fancy-select">
                <option value="light" ${settings.theme === "light" ? "selected" : ""}>Light</option>
                <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Dark</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Accent Color</label>
              <div class="color-presets">
                <div class="color-option" style="background:#0078d4" data-color="#0078d4"></div>
                <div class="color-option" style="background:#d40078" data-color="#d40078"></div>
                <div class="color-option" style="background:#00a86b" data-color="#00a86b"></div>
                <div class="color-option" style="background:#a800d4" data-color="#a800d4"></div>
              </div>
            </div>
          </div>
          <div class="group">
            <h3>🖼️ Wallpaper</h3>
            <div class="setting-item">
              <label>Choose Wallpaper</label>
              <input type="file" id="wallpaper-upload" accept="image/*">
              <div id="wallpaper-preview" class="${settings.wallpaper ? 'wall-thumb' : 'no-wallpaper'}">
                ${settings.wallpaper ? `<img src="${settings.wallpaper}" alt="Wallpaper">` : 'No wallpaper selected'}
              </div>
            </div>
          </div>
        `;
        // Event listeners for personalization
        panel.querySelector("#theme").onchange = e => {
          settings.theme = e.target.value;
          saveSettings(settings);
          applySettings();
          showNotification("Theme", `Theme set to ${e.target.value}`, {type: "info", icon: "🎨"});
        };
        panel.querySelectorAll(".color-option").forEach(opt => {
          opt.onclick = () => {
            settings.accent = opt.dataset.color;
            saveSettings(settings);
            applySettings();
            showNotification("Theme", `Accent color updated`, {type: "info", icon: "🎨"});
          };
        });
        panel.querySelector("#wallpaper-upload").onchange = e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              settings.wallpaper = reader.result;
              saveSettings(settings);
              console.log("Wallpaper saved:", settings.wallpaper); // Debug
              console.log("LocalStorage content:", localStorage.getItem(SETTINGS_KEY)); // Debug
              applySettings();
              panel.querySelector("#wallpaper-preview").innerHTML = `<img src="${reader.result}" alt="Wallpaper">`;
              panel.querySelector("#wallpaper-preview").className = "wall-thumb";
              showNotification("Wallpaper", "Wallpaper updated", {type: "info", icon: "🖼️"});
            };
            reader.readAsDataURL(file);
          }
        };
        break;
      // ------------------ 4. NOTIFICATIONS ------------------
      case "notifications":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>Notifications</h2>
            <p>Manage notification preferences</p>
          </div>
          <div class="group">
            <h3>🔔 Notification Settings</h3>
            <div class="setting-item toggle-item">
              <label>Enable Notifications</label>
              <label class="switch">
                <input type="checkbox" id="notifications" ${settings.notifications !== false ? "checked" : ""}>
                <span class="slider-round"></span>
              </label>
            </div>
            <div class="setting-item">
              <button id="clear-notifications">Clear Notification History</button>
            </div>
            <div class="app-notification-list" id="notification-list"></div>
          </div>
        `;
        // Event listeners for notifications
        panel.querySelector("#notifications").onchange = e => {
          settings.notifications = e.target.checked;
          saveSettings(settings);
          showNotification("Notifications", `Notifications ${e.target.checked ? "enabled" : "disabled"}`, {type: "info", icon: "🔔"});
        };
        panel.querySelector("#clear-notifications").onclick = () => {
          SettingsWorkable.history.clear();
          showNotification("Notifications", "Notification history cleared", {type: "info", icon: "🔔"});
        };
        break;
      // ------------------ 5. ACCOUNT (Google Login) ------------------
      case "accounts":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>Account</h2>
            <p>Manage your Google account sign-in</p>
          </div>
          <div class="group">
            <h3>Google Sign-In</h3>
            <div id="g_id_onload"
                 data-client_id="998279555105-rkq9b8ohgf22pfp96m1nim5s1ufnsuc4.apps.googleusercontent.com"
                 data-callback="handleCredentialResponse"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
            </div>
            <div id="user-info" style="margin-top: 20px;"></div>
            ${settings.googleUser ? `
              <div style="margin-top: 20px;">
                <button id="google-signout" class="danger-button">Sign Out</button>
              </div>
            ` : ''}
          </div>
        `;
        
        // Load Google script if not loaded
        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
          const script = document.createElement('script');
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            initializeGoogleSignIn();
          };
          document.body.appendChild(script);
        } else {
          // If script is already loaded, initialize directly
          setTimeout(initializeGoogleSignIn, 100);
        }
        
        // Initialize Google Sign-In
        function initializeGoogleSignIn() {
          if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.initialize({
              client_id: "998279555105-rkq9b8ohgf22pfp96m1nim5s1ufnsuc4.apps.googleusercontent.com",
              callback: handleCredentialResponse,
              auto_select: false
            });
            
            // Render button if user is not already signed in
            if (!settings.googleUser) {
              google.accounts.id.renderButton(
                document.querySelector('.g_id_signin'),
                { theme: "outline", size: "large", width: "250" }
              );
            }
            
            // Display user info if already signed in
            if (settings.googleUser) {
              displayUserInfo(settings.googleUser);
            }
          } else {
            console.error("Google Sign-In library not loaded");
            panel.querySelector('#user-info').innerHTML = 
              '<p style="color: red;">Google Sign-In failed to load. Please refresh the page.</p>';
          }
        }
        
        // Handle sign-out
        if (settings.googleUser) {
          setTimeout(() => {
            const signoutBtn = panel.querySelector("#google-signout");
            if (signoutBtn) {
              signoutBtn.onclick = () => {
                if (window.google && google.accounts && google.accounts.id) {
                  google.accounts.id.disableAutoSelect();
                  google.accounts.id.revoke(settings.googleUser.email, done => {
                    console.log('Consent revoked');
                  });
                }
                
                settings.googleUser = null;
                saveSettings(settings);
                panel.querySelector('#user-info').innerHTML = '';
                showNotification("Account", "Signed out successfully", {type: "info", icon: "👤"});
                
                // Re-render the accounts section
                setTimeout(() => renderSettingsContent(panel, "accounts"), 500);
              };
            }
          }, 100);
        }
        break;
      // ------------------ 6. TIME & LANGUAGE ------------------
      case "time":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>Time & Language</h2>
            <p>Configure time zone and language settings</p>
          </div>
          <div class="group">
            <h3>⏰ Time Zone</h3>
            <div class="setting-item">
              <label>Time Zone</label>
              <select id="timezone" class="fancy-select">
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Dhaka">Asia/Dhaka</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>
          <div class="group">
            <h3>🌐 Language</h3>
            <div class="setting-item">
              <label>Display Language</label>
              <select id="language" class="fancy-select">
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
          </div>
        `;
        // Event listeners for time & language
        panel.querySelector("#timezone").onchange = e => {
          SettingsWorkable.setTimeZone(e.target.value);
          showNotification("Time", `Time zone set to ${e.target.value}`, {type: "info", icon: "⏰"});
        };
        panel.querySelector("#language").onchange = e => {
          SettingsWorkable.setLanguage(e.target.value);
          showNotification("Language", `Language set to ${e.target.value}`, {type: "info", icon: "🌐"});
        };
        break;
      // ------------------ 7. ABOUT ------------------
      case "about":
        panel.innerHTML += `
          <div class="settings-header">
            <h2>About</h2>
            <p>System information and updates</p>
     <h1>This is a demo verson(2). we are soon releasing our beta and next stable version soon .so stay with us<\h1>
               </div>
          <div class="group">
            <h3>ℹ️ System Info</h3>
            <div class="setting-item">
              <label>Version</label>
              <span>${window.APP_VERSION || "2.0.0(demo)"}</span>
            </div>
            <div class="setting-item">
              <button id="check-updates">Check for Updates</button>
            </div>
          </div>
        `;
        // Event listener for about
        panel.querySelector("#check-updates").onclick = () => {
          SettingsWorkable.checkForUpdates().then(result => {
            if (result.update) {
              showNotification("About", `Update available: ${result.version}`, {type: "success", icon: "ℹ️"});
            } else if (result.error) {
              showNotification("About", "Update check failed", {type: "error", icon: "ℹ️"});
            } else {
              showNotification("About", "App is up to date", {type: "info", icon: "ℹ️"});
            }
          });
        };
        break;
      default:
        panel.innerHTML += `<p>No content available for this category.</p>`;
    }
  }, 200);
}

// Global callback function for Google Sign-In
window.handleCredentialResponse = function(response) {
  console.log("Google Sign-In response received");
  
  try {
    const responsePayload = parseJwt(response.credential);
    const userInfo = document.getElementById('user-info');
    
    if (userInfo) {
      userInfo.innerHTML = `
        <div style="padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
          <p style="font-weight: bold; margin: 0 0 10px 0;">Welcome, ${responsePayload.name}!</p>
          <p style="margin: 5px 0;">Email: ${responsePayload.email}</p>
          <img src="${responsePayload.picture}" alt="Profile Picture" 
               style="border-radius: 50%; width: 80px; height: 80px; margin: 10px 0;">
        </div>
      `;
    }
    
    // Save to settings
    settings.googleUser = {
      name: responsePayload.name,
      email: responsePayload.email,
      picture: responsePayload.picture
    };
    
    saveSettings(settings);
    showNotification("Account", "Successfully signed in with Google!", {type: "success", icon: "👤"});
    
    // Add sign-out button
    setTimeout(() => {
      const userInfoDiv = document.getElementById('user-info');
      if (userInfoDiv) {
        userInfoDiv.innerHTML += `
          <div style="margin-top: 15px;">
            <button id="google-signout-btn" class="danger-button">Sign Out</button>
          </div>
        `;
        
        document.getElementById('google-signout-btn').onclick = () => {
          if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
            google.accounts.id.revoke(responsePayload.email, done => {
              console.log('Consent revoked');
            });
          }
          
          settings.googleUser = null;
          saveSettings(settings);
          userInfoDiv.innerHTML = '';
          showNotification("Account", "Signed out successfully", {type: "info", icon: "👤"});
          
          // Re-render the accounts section
          const settingsPanel = document.querySelector('.settings-content');
          if (settingsPanel) {
            renderSettingsContent(settingsPanel, "accounts");
          }
        };
      }
    }, 100);
    
  } catch (error) {
    console.error("Error handling credential response:", error);
    showNotification("Account", "Sign-in failed. Please try again.", {type: "error", icon: "👤"});
  }
};

// Helper function to display user info
function displayUserInfo(user) {
  const userInfo = document.getElementById('user-info');
  if (userInfo) {
    userInfo.innerHTML = `
      <div style="padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
        <p style="font-weight: bold; margin: 0 0 10px 0;">Welcome back, ${user.name}!</p>
        <p style="margin: 5px 0;">Email: ${user.email}</p>
        <img src="${user.picture}" alt="Profile Picture" 
             style="border-radius: 50%; width: 80px; height: 80px; margin: 10px 0;">
      </div>
      <div style="margin-top: 15px;">
        <button id="google-signout-btn" class="danger-button">Sign Out</button>
      </div>
    `;
    
    document.getElementById('google-signout-btn').onclick = () => {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(user.email, done => {
          console.log('Consent revoked');
        });
      }
      
      settings.googleUser = null;
      saveSettings(settings);
      userInfo.innerHTML = '';
      showNotification("Account", "Signed out successfully", {type: "info", icon: "👤"});
      
      // Re-render the accounts section
      const settingsPanel = document.querySelector('.settings-content');
      if (settingsPanel) {
        renderSettingsContent(settingsPanel, "accounts");
      }
    };
  }
}

// JWT parsing function
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

// Settings Workable Module
(function() {
  const LS = {
    get: (key, def) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || def;
      } catch {
        return def;
      }
    },
    set: (key, val) => {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  // ----------------- Power -----------------
  const Power = (() => {
    const setPowerMode = (mode) => {
      settings.powerMode = mode;
      saveSettings(settings);
      applySettings();
    };
    const setBatterySaver = (on) => {
      settings.batterySaver = !!on;
      saveSettings(settings);
      applySettings();
    };
    const enableScreenTimeout = (min) => {
      settings.screenTimeout = min;
      saveSettings(settings);
    };
    return { applyMode: setPowerMode, setBatterySaver, enableScreenTimeout };
  })();

  // ----------------- Sound -----------------
  const Sound = (() => {
    let volume = LS.get("volume", 80);
    let enabled = LS.get("soundEffects", true);
    const setVolume = (vol) => {
      volume = Number(vol);
      LS.set("volume", volume);
      settings.volume = volume;
      saveSettings(settings);
    };
    const setEnabled = (on) => {
      enabled = !!on;
      LS.set("soundEffects", enabled);
      settings.soundEffects = enabled;
      saveSettings(settings);
    };
    const playEffect = (type) => {
      if (!enabled) return;
      // Placeholder for sound effect
      console.log("Playing sound effect:", type);
    };
    return { setVolume, setEnabled, playEffect };
  })();

  // ----------------- Network -----------------
  const Network = (() => {
    let usage = LS.get("usage", []);
    let blocked = LS.get("blockedDomains", []);
    const getUsage = () => usage;
    const clearUsage = () => {
      usage = [];
      LS.set("usage", usage);
    };
    const ping = async (url) => {
      try {
        const start = Date.now();
        await fetch(url, { mode: "no-cors" });
        return Date.now() - start;
      } catch {
        return -1;
      }
    };
    const speedTest = async () => {
      const start = Date.now();
      await fetch("https://via.placeholder.com/150");
      const time = Date.now() - start;
      return Math.round((150 * 8) / (time / 1000));
    };
    const addBlocked = (domain) => {
      blocked.push(domain);
      LS.set("blockedDomains", blocked);
    };
    const removeBlocked = (domain) => {
      blocked = blocked.filter(d => d !== domain);
      LS.set("blockedDomains", blocked);
    };
    const listBlocked = () => blocked;
    return { getUsage, clearUsage, ping, speedTest, addBlocked, removeBlocked, listBlocked };
  })();
  // ----------------- Notifications -----------------
  const notify = (msg, type = "info", sound = "pop") => {
    if (settings.notifications !== false && typeof showNotification === "function") {
      showNotification(type.charAt(0).toUpperCase() + type.slice(1), msg, { type, icon: "🔔", duration: 3000 });
      NotificationHistory.push({ msg, type, time: Date.now() });
      Sound.playEffect(sound);
    }
  };
  // ----------------- Time & Language -----------------
  const I18N = (() => {
    const dict = {
      en: { power: "Power", batterySaver: "Battery Saver", screenLocked: "Screen Locked", updateAvailable: "Update available" },
      bn: { power: "পাওয়ার", batterySaver: "ব্যাটারি সেভার", screenLocked: "স্ক্রিন লকড", updateAvailable: "আপডেট পাওয়া গেছে" }
    };
    let lang = LS.get("lang", "en");
    const setLang = (l) => {
      lang = l in dict ? l : "en";
      LS.set("lang", lang);
      apply();
    };
    const t = (k) => (dict[lang] && dict[lang][k]) || dict["en"][k] || k;
    const apply = () => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
      });
    };
    apply();
    return { setLang, t };
  })();
  const TimeSim = (() => {
    let timeZone = LS.get("tz", Intl.DateTimeFormat().resolvedOptions().timeZone);
    const setTimeZone = (tz) => {
      timeZone = tz;
      LS.set("tz", tz);
      updateClock();
    };
    const format = (d) => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone }).format(d);
    function updateClock() {
      const el = document.getElementById("clock");
      if (el) el.textContent = format(new Date()) + " " + timeZone;
    }
    setInterval(updateClock, 1000);
    updateClock();
    return { setTimeZone, format };
  })();
  // ----------------- About -----------------
  const About = (() => {
    window.APP_VERSION = window.APP_VERSION || "2.0.0(demo)";
    const checkForUpdates = async (url = "https://your-server.com/app-version.json") => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (json?.version && json.version !== window.APP_VERSION) {
          notify(`Update available: ${json.version}`, "success", "ding");
          return { update: true, version: json.version };
        }
        notify("App is up to date", "info", "pop");
        return { update: false, version: window.APP_VERSION };
      } catch (e) {
        notify("Update check failed", "error", "ding");
        return { update: null, error: String(e) };
      }
    };
    return { checkForUpdates };
  })();
  // ----------------- Notification History -----------------
  const NotificationHistory = (() => {
    const key = "notificationHistory";
    const arr = LS.get(key, []);
    const push = (n) => {
      arr.push(n);
      LS.set(key, arr);
    };
    const all = () => arr.slice().reverse();
    const clear = () => {
      arr.length = 0;
      LS.set(key, arr);
    };
    return { push, all, clear };
  })();

  window.SettingsWorkable = {
    setPowerMode: Power.applyMode,
    setBatterySaver: Power.setBatterySaver,
    enableScreenTimeout: Power.enableScreenTimeout,
    getUsage: Network.getUsage,
    clearUsage: Network.clearUsage,
    ping: Network.ping,
    speedTest: Network.speedTest,
    addBlockedDomain: Network.addBlocked,
    removeBlockedDomain: Network.removeBlocked,
    listBlockedDomains: Network.listBlocked,
    setVolume: (v) => Sound.setVolume(Number(v)),
    enableSounds: Sound.setEnabled,
    playEffect: Sound.playEffect,
    setTimeZone: TimeSim.setTimeZone,
    setLanguage: I18N.setLang,
    checkForUpdates: About.checkForUpdates,
    history: NotificationHistory
  };
  console.log("%cSettingsWorkable ready", "color:#0a0;font-weight:bold");
})();
