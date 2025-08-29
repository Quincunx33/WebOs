// files.js - ফাইল ম্যানেজমেন্ট অ্যাপ
function launchFiles() {
  const files = loadFS();
  const wrap = document.createElement("div");
  wrap.className = "app-files";
  
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  const nameIn = document.createElement("input");
  nameIn.placeholder = "new-file.txt";
  const addBtn = document.createElement("button");
  addBtn.textContent = "Create";
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete Selected";
  toolbar.append(nameIn, addBtn, delBtn);
  wrap.appendChild(toolbar);
  
  const list = document.createElement("div");
  list.className = "file-list";
  wrap.appendChild(list);
  
  function render() {
    list.innerHTML = "";
    loadFS().forEach(f => {
      const item = document.createElement("div");
      item.className = "file";
      item.innerHTML = `<div>📄</div><div class="meta"><div class="name">${f.id}</div><div class="sub">${new Date(f.updatedAt).toLocaleString()}</div></div>`;
      item.addEventListener("click", () => item.classList.toggle("sel"));
      item.addEventListener("dblclick", () => openFile(f));
      list.appendChild(item);
    });
  }
  
  function openFile(f) {
    const contentEl = document.createElement("div");
    contentEl.style.height = "100%";
    contentEl.innerHTML = `<textarea style="width:100%;height:100%;border:0;outline:none;background:transparent;font:inherit"></textarea>`;
    const ta = contentEl.querySelector("textarea");
    ta.value = f.content || "";
    ta.addEventListener("input", () => {
      const all = loadFS();
      const idx = all.findIndex(x => x.id === f.id);
      if (idx >= 0) {
        all[idx].content = ta.value;
        all[idx].updatedAt = Date.now();
        saveFS(all);
      }
    });
    createWindow(f.id, contentEl, "file");
  }
  
  addBtn.addEventListener("click", () => {
    const name = (nameIn.value || "untitled.txt").trim();
    if (!name) return;
    const all = loadFS();
    if (all.some(x => x.id === name)) {
      showNotification("File exists", "A file with this name already exists", { type: "warning" });
      return;
    }
    all.push({ id: name, type: "text", content: "", updatedAt: Date.now() });
    saveFS(all);
    render();
    nameIn.value = "";
    showNotification("File created", `"${name}" has been created`, { type: "success" });
  });
  
  delBtn.addEventListener("click", () => {
    const sel = [...list.querySelectorAll(".file.sel")].map(el => el.querySelector(".name").textContent);
    if (!sel.length) {
      showNotification("No selection", "Please select files to delete", { type: "warning" });
      return;
    }
    if (confirm(`Delete ${sel.length} file(s)?`)) {
      const next = loadFS().filter(f => !sel.includes(f.id));
      saveFS(next);
      render();
      showNotification("Files deleted", `${sel.length} file(s) removed`, { type: "info" });
    }
  });
  
  render();
  createWindow("Files", wrap, "files");
}