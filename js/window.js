// ====================== Window Manager ======================
function createWindow(title, contentEl, appId) {
  const node = windowTpl.content.firstElementChild.cloneNode(true);
  node.style.left = (80 + Math.random() * 120) + "px";
  node.style.top = (70 + Math.random() * 90) + "px";
  node.style.zIndex = ++zCounter;
  node.querySelector(".title").textContent = title;
  node.querySelector(".content").appendChild(contentEl);
  desktop.appendChild(node);

  const id = "w" + Math.random().toString(36).slice(2, 7);
  windows.push({ id, el: node, appId, maximized: false });

  // appId bind করে রাখা
  node.dataset.appId = appId;

  // Task button
  const taskBtn = document.createElement("button");
  taskBtn.className = "task-btn active";
  taskBtn.textContent = title;
  taskBtn.dataset.winId = id;

  taskBtn.addEventListener("click", () => focusWindow(id, true));
  taskbarApps.appendChild(taskBtn);
  tasks.set(id, taskBtn);

  // Dragging system
  const bar = node.querySelector(".titlebar");
  let isDragging = false, dx = 0, dy = 0;

  const onMouseMove = (e) => {
    if (isDragging) {
      node.style.left = (e.clientX - dx) + "px";
      node.style.top = (e.clientY - dy) + "px";
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    bar.style.cursor = "grab";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  bar.addEventListener("mousedown", (e) => {
    if (e.target.closest(".actions")) return;
    isDragging = true;
    node.style.zIndex = ++zCounter;
    dx = e.clientX - node.offsetLeft;
    dy = e.clientY - node.offsetTop;
    bar.style.cursor = "grabbing";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // Control buttons
  node.querySelector(".btn-close").addEventListener("click", () => closeWindow(id));
  node.querySelector(".btn-min").addEventListener("click", () => minimizeWindow(id));
  node.querySelector(".btn-max").addEventListener("click", () => toggleMaximize(id));

  focusWindow(id);

  return node;   // ⚡ এখন পুরো window node return করবে
}

function focusWindow(id, toggle = false) {
  const w = windows.find(x => x.id === id);
  if (!w) return;

  const btn = tasks.get(id);

  if (toggle && w.el.style.display !== "none") {
    minimizeWindow(id);
    return;
  }

  // সব inactive
  windows.forEach(x => tasks.get(x.id)?.classList.remove("active"));

  // এই active
  btn?.classList.add("active");
  w.el.style.zIndex = ++zCounter;
  w.el.style.display = "block";
}

function closeWindow(id) {
  const idx = windows.findIndex(x => x.id === id);
  if (idx < 0) return;

  const appId = windows[idx].appId;
  if (apps[appId]) {
    apps[appId].isOpen = false;   // ⚡ অ্যাপ স্টেট রিসেট
    apps[appId].notified = false;
  }

  windows[idx].el.remove();
  tasks.get(id)?.remove();
  tasks.delete(id);
  windows.splice(idx, 1);
}

function minimizeWindow(id) {
  const w = windows.find(x => x.id === id);
  if (!w) return;
  w.el.style.display = "none";
  tasks.get(id)?.classList.remove("active");
}

function toggleMaximize(id) {
  const w = windows.find(x => x.id === id);
  if (!w) return;
  w.maximized = !w.maximized;

  if (w.maximized) {
    w.el.dataset.prev = JSON.stringify({
      left: w.el.style.left,
      top: w.el.style.top,
      width: w.el.style.width,
      height: w.el.style.height
    });
    w.el.style.left = "10px";
    w.el.style.top = "10px";
    w.el.style.width = "calc(100% - 20px)";
    w.el.style.height = "calc(100% - 60px)";
  } else {
    const prev = JSON.parse(w.el.dataset.prev || "{}");
    w.el.style.left = prev.left || "80px";
    w.el.style.top = prev.top || "80px";
    w.el.style.width = prev.width || "640px";
    w.el.style.height = prev.height || "420px";
  }
}