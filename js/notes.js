// notes.js - নোটস অ্যাপ
function launchNotes() {
  const wrap = document.createElement("div");
  wrap.className = "app-notes";
  
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "10px";
  
  const title = document.createElement("h3");
  title.textContent = "Notes";
  title.style.margin = "0";
  
  const wordCount = document.createElement("div");
  wordCount.className = "word-count";
  wordCount.style.fontSize = "0.9em";
  wordCount.style.opacity = "0.7";
  
  header.append(title, wordCount);
  wrap.appendChild(header);
  
  const ta = document.createElement("textarea");
  ta.placeholder = "Write your notes here... (auto-saves)";
  ta.style.width = "100%";
  ta.style.height = "calc(100% - 50px)";
  ta.style.border = "0";
  ta.style.outline = "none";
  ta.style.background = "transparent";
  ta.style.font = "inherit";
  ta.style.resize = "none";
  
  // Load saved notes
  ta.value = localStorage.getItem("webos.notes") || "";
  
  // Update word count
  function updateWordCount() {
    const text = ta.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    wordCount.textContent = `${words} words, ${characters} characters`;
  }
  
  updateWordCount();
  
  ta.addEventListener("input", () => {
    localStorage.setItem("webos.notes", ta.value);
    updateWordCount();
  });
  
  wrap.appendChild(ta);
  createWindow("Notes", wrap, "notes");
}