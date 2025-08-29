// browser.js - ওয়েব ব্রাউজার অ্যাপ
function launchBrowser() {
  const wrap = document.createElement("div");
  wrap.className = "app-browser";
  
  const omnibar = document.createElement("div");
  omnibar.className = "omnibar";
  
  const backBtn = document.createElement("button");
  backBtn.textContent = "←";
  backBtn.title = "Back";
  
  const forwardBtn = document.createElement("button");
  forwardBtn.textContent = "→";
  forwardBtn.title = "Forward";
  
  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "↻";
  refreshBtn.title = "Refresh";
  
  const input = document.createElement("input");
  input.placeholder = "Search the web or type a URL...";
  input.type = "text";
  
  const go = document.createElement("button");
  go.textContent = "Go";
  
  omnibar.append(backBtn, forwardBtn, refreshBtn, input, go);
  wrap.append(omnibar);
  
  const frame = document.createElement("iframe");
  frame.referrerPolicy = "no-referrer";
  frame.style.width = "100%";
  frame.style.height = "calc(100% - 40px)";
  frame.style.border = "1px solid #cbd5e1";
  frame.style.borderRadius = "8px";
  frame.style.background = "#fff";
  
  // Set default page
  frame.src = "about:blank";
  
  wrap.append(frame);
  
  const history = [];
  let historyIndex = -1;
  
  function navigate(url) {
    let finalUrl = url;
    
    // Check if it's a URL or search term
    if (!/^(https?|ftp|about|file):\/\//i.test(url)) {
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = 'https://' + url;
      } else {
        finalUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
      }
    }
    
    try {
      frame.src = finalUrl;
      history.push(finalUrl);
      historyIndex = history.length - 1;
      input.value = finalUrl;
      
      // Update button states
      backBtn.disabled = historyIndex <= 0;
      forwardBtn.disabled = true; // Reset forward when navigating to new page
      
    } catch (error) {
      showNotification("Navigation Error", "Could not navigate to the specified URL", { type: "error" });
    }
  }
  
  // Navigation functions
  backBtn.addEventListener("click", () => {
    if (historyIndex > 0) {
      historyIndex--;
      frame.src = history[historyIndex];
      input.value = history[historyIndex];
      forwardBtn.disabled = false;
      backBtn.disabled = historyIndex <= 0;
    }
  });
  
  forwardBtn.addEventListener("click", () => {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      frame.src = history[historyIndex];
      input.value = history[historyIndex];
      backBtn.disabled = false;
      forwardBtn.disabled = historyIndex >= history.length - 1;
    }
  });
  
  refreshBtn.addEventListener("click", () => {
    frame.src = frame.src;
  });
  
  go.addEventListener("click", () => navigate(input.value));
  
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigate(input.value);
  });
  
  // Iframe load event
  frame.addEventListener("load", () => {
    try {
      input.value = frame.contentWindow.location.href;
    } catch (e) {
      // Cross-origin restriction
    }
  });
  
  createWindow("Browser", wrap, "browser");
}