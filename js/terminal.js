// terminal.js - উন্নত টার্মিনাল অ্যাপ
function launchTerminal(){
  const wrap = document.createElement("div");
  wrap.className = "app-terminal";
  wrap.style.height = "100%";
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.background = "#000";
  wrap.style.color = "#0f0";
  wrap.style.fontFamily = "'Courier New', monospace";
  wrap.style.fontSize = "14px";

  // টার্মিনাল হেডার
  const header = document.createElement("div");
  header.style.padding = "8px 12px";
  header.style.background = "#1a1a1a";
  header.style.borderBottom = "1px solid #333";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  
  const title = document.createElement("div");
  title.textContent = "Web OS Terminal";
  title.style.fontWeight = "bold";
  
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.color = "#0f0";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.padding = "2px 6px";
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  wrap.appendChild(header);

  const output = document.createElement("div");
  output.id = "terminal-output";
  output.style.flex = "1";
  output.style.overflowY = "auto";
  output.style.padding = "8px";
  output.style.whiteSpace = "pre-wrap";
  output.style.lineHeight = "1.4";

  const inputLine = document.createElement("div");
  inputLine.style.display = "flex";
  inputLine.style.alignItems = "center";
  inputLine.style.padding = "8px";
  inputLine.style.borderTop = "1px solid #333";
  inputLine.style.background = "#0a0a0a";

  const prompt = document.createElement("span");
  prompt.textContent = "user@webos:~$ ";
  prompt.style.color = "#00ff00";
  prompt.style.marginRight = "5px";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "terminal-input";
  input.style.flex = "1";
  input.style.background = "transparent";
  input.style.color = "#0f0";
  input.style.border = "none";
  input.style.outline = "none";
  input.style.fontFamily = "'Courier New', monospace";
  input.style.fontSize = "14px";

  inputLine.append(prompt, input);
  wrap.append(output, inputLine);

  // টার্মিনাল ইতিহাস এবং অবস্থা
  const commandHistory = [];
  let historyIndex = -1;
  let currentDirectory = "~";

  // প্রারম্ভিক বার্তা
  appendToOutput("Web OS Terminal v2.0");
  appendToOutput("Type 'help' for available commands.");
  appendToOutput("");

  // কমান্ড প্রসেসিং ফাংশন
  function processCommand(command) {
    if (!command.trim()) {
      appendPrompt();
      return;
    }

    appendToOutput("user@webos:" + currentDirectory + "$ " + command);
    
    const cmd = command.trim().toLowerCase();
    const args = command.trim().split(" ").slice(1);
    
    switch(cmd) {
      case "help":
        showHelp();
        break;
      case "clear":
        clearTerminal();
        break;
      case "echo":
        appendToOutput(args.join(" "));
        appendPrompt();
        break;
      case "time":
        appendToOutput(new Date().toLocaleString());
        appendPrompt();
        break;
      case "date":
        appendToOutput(new Date().toLocaleDateString());
        appendPrompt();
        break;
      case "ls":
        listFiles();
        break;
      case "pwd":
        appendToOutput(currentDirectory);
        appendPrompt();
        break;
      case "cd":
        changeDirectory(args[0]);
        break;
      case "theme":
        changeTheme(args[0]);
        break;
      case "neofetch":
        showSystemInfo();
        break;
      case "whoami":
        appendToOutput("user");
        appendPrompt();
        break;
      case "exit":
      case "close":
        closeTerminal();
        break;
      default:
        appendToOutput("Command not found: " + command);
        appendToOutput("Type 'help' for available commands.");
        appendPrompt();
    }
    
    commandHistory.push(command);
    historyIndex = commandHistory.length;
  }

  function appendToOutput(text) {
    output.innerHTML += text + "\n";
    output.scrollTop = output.scrollHeight;
  }

  function appendPrompt() {
    appendToOutput("user@webos:" + currentDirectory + "$ ");
  }

  function showHelp() {
    appendToOutput("Available commands:");
    appendToOutput("  help          - Show this help message");
    appendToOutput("  clear         - Clear the terminal");
    appendToOutput("  echo [text]   - Print text to terminal");
    appendToOutput("  time          - Show current time");
    appendToOutput("  date          - Show current date");
    appendToOutput("  ls            - List files");
    appendToOutput("  pwd           - Show current directory");
    appendToOutput("  cd [dir]      - Change directory");
    appendToOutput("  theme [light|dark] - Change system theme");
    appendToOutput("  neofetch      - Show system information");
    appendToOutput("  whoami        - Show current user");
    appendToOutput("  exit/close    - Close terminal");
    appendPrompt();
  }

  function clearTerminal() {
    output.innerHTML = "";
    appendPrompt();
  }

  function listFiles() {
    const files = loadFS();
    if (files.length === 0) {
      appendToOutput("No files found.");
    } else {
      files.forEach(file => {
        const date = new Date(file.updatedAt).toLocaleDateString();
        appendToOutput(file.id + "    " + date);
      });
    }
    appendPrompt();
  }

  function changeDirectory(dir) {
    if (!dir || dir === "~") {
      currentDirectory = "~";
    } else if (dir === "..") {
      // Simple directory navigation simulation
      if (currentDirectory !== "~") {
        currentDirectory = "~";
      }
    } else {
      appendToOutput("cd: no such directory: " + dir);
    }
    appendPrompt();
  }

  function changeTheme(theme) {
    if (theme === "light" || theme === "dark") {
      if (settings) {
        settings.theme = theme;
        saveSettings(settings);
        applySettings();
        appendToOutput("Theme changed to " + theme);
        if (typeof showNotification === 'function') {
          showNotification("Terminal", `Theme changed to ${theme}`, {type: "info"});
        }
      }
    } else {
      appendToOutput("Usage: theme [light|dark]");
    }
    appendPrompt();
  }

  function showSystemInfo() {
    appendToOutput("       \\\\\\\\");
    appendToOutput("        \\\\\\\\");
    appendToOutput("         \\\\\\\\");
    appendToOutput("          \\\\\\\\");
    appendToOutput("       ##\\\\");
    appendToOutput("      ######\\\\");
    appendToOutput("     ##########\\\\");
    appendToOutput("    ##############");
    appendToOutput("   ################");
    appendToOutput(" ####################");
    appendToOutput("");
    appendToOutput("Web OS Lite");
    appendToOutput("-----------");
    appendToOutput("OS: Web OS Lite v2.0");
    appendToOutput("Shell: Web Terminal");
    appendToOutput("Theme: " + (settings?.theme || "light"));
    appendToOutput("Browser: " + navigator.userAgent.split(' ')[0]);
    appendToOutput("Resolution: " + screen.width + "x" + screen.height);
    appendToOutput("");
    appendPrompt();
  }

  function closeTerminal() {
    const terminalWindow = windows.find(w => w.appId === "terminal");
    if (terminalWindow) {
      closeWindow(terminalWindow.id);
    }
  }

  // ইনপুট হ্যান্ডলিং
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value;
      input.value = "";
      processCommand(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex > 0) historyIndex--;
        input.value = commandHistory[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] || "";
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Auto-complete simulation
      if (input.value.startsWith("th")) {
        input.value = "theme ";
      } else if (input.value.startsWith("c")) {
        input.value = "clear";
      }
    }
  });

  // ক্লোজ বাটন ইভেন্ট
  closeBtn.addEventListener("click", closeTerminal);

  // ফোকাস ইনপুটে
  setTimeout(() => {
    input.focus();
  }, 100);

  // প্রম্পট যোগ করুন
  appendPrompt();

  createWindow("Terminal", wrap, "terminal");
}

// টার্মিনালে লেখা append করার সহায়ক ফাংশন
function appendToTerminal(text) {
  const output = document.getElementById("terminal-output");
  if (output) {
    output.innerHTML += text + "\n";
    output.scrollTop = output.scrollHeight;
  }
}

// গ্লোবাল ফাংশন হিসেবে রেজিস্টার করুন
window.launchTerminal = launchTerminal;
window.appendToTerminal = appendToTerminal;