// workspace.js - ভার্চুয়াল ওয়ার্কস্পেস ম্যানেজমেন্ট
class WorkspaceManager {
  constructor() {
    this.workspaces = ['Main', 'Work', 'Personal', 'Temp'];
    this.currentWorkspace = 0;
    this.windows = new Map(); // workspaceId -> windows array
    this.init();
  }
  
  init() {
    // Load workspace state
    const savedState = security.secureGetItem('webos_workspaces');
    if (savedState) {
      this.workspaces = savedState.workspaces || this.workspaces;
      this.currentWorkspace = savedState.currentWorkspace || 0;
      this.windows = new Map(savedState.windows || []);
    }
    
    this.createWorkspaceUI();
  }
  
  createWorkspaceUI() {
    // Workspace switcher তৈরি করুন
    const switcher = document.createElement('div');
    switcher.id = 'workspace-switcher';
    switcher.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 5px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            padding: 5px;
            border-radius: 8px;
            z-index: 20;
        `;
    
    this.workspaces.forEach((name, index) => {
      const btn = document.createElement('button');
      btn.textContent = `${index + 1}: ${name}`;
      btn.style.cssText = `
                padding: 5px 10px;
                border: none;
                border-radius: 4px;
                background: ${index === this.currentWorkspace ? '#0078d4' : 'transparent'};
                color: ${index === this.currentWorkspace ? 'white' : 'inherit'};
                cursor: pointer;
            `;
      
      btn.addEventListener('click', () => this.switchWorkspace(index));
      switcher.appendChild(btn);
    });
    
    // Add new workspace button
    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.title = 'Add new workspace';
    addBtn.addEventListener('click', () => this.addWorkspace());
    switcher.appendChild(addBtn);
    
    document.body.appendChild(switcher);
  }
  
  switchWorkspace(index) {
    if (index === this.currentWorkspace) return;
    
    // Save current workspace state
    this.saveCurrentWorkspaceState();
    
    // Switch to new workspace
    this.currentWorkspace = index;
    this.loadWorkspaceState();
    
    // Update UI
    this.updateWorkspaceUI();
  }
  
  saveCurrentWorkspaceState() {
    // Save all windows for current workspace
    const windows = Array.from(document.querySelectorAll('.window'));
    this.windows.set(this.currentWorkspace, windows.map(w => ({
      id: w.id,
      appId: w.dataset.appId,
      position: {
        left: w.style.left,
        top: w.style.top,
        width: w.style.width,
        height: w.style.height
      },
      content: w.querySelector('.content').innerHTML
    })));
    
    // Hide all windows
    document.querySelectorAll('.window').forEach(w => {
      w.style.display = 'none';
    });
  }
  
  loadWorkspaceState() {
    const savedWindows = this.windows.get(this.currentWorkspace) || [];
    
    // Remove existing windows
    document.querySelectorAll('.window').forEach(w => w.remove());
    
    // Restore windows for this workspace
    savedWindows.forEach(windowState => {
      const windowEl = createWindowFromState(windowState);
      document.getElementById('desktop').appendChild(windowEl);
    });
  }
  
  addWorkspace() {
    const name = prompt('Enter workspace name:', `Workspace ${this.workspaces.length + 1}`);
    if (name) {
      this.workspaces.push(name);
      this.updateWorkspaceUI();
      this.saveState();
    }
  }
  
  updateWorkspaceUI() {
    const buttons = document.querySelectorAll('#workspace-switcher button');
    buttons.forEach((btn, index) => {
      if (index < this.workspaces.length) {
        btn.textContent = `${index + 1}: ${this.workspaces[index]}`;
        btn.style.background = index === this.currentWorkspace ? '#0078d4' : 'transparent';
        btn.style.color = index === this.currentWorkspace ? 'white' : 'inherit';
      }
    });
  }
  
  saveState() {
    const state = {
      workspaces: this.workspaces,
      currentWorkspace: this.currentWorkspace,
      windows: Array.from(this.windows.entries())
    };
    security.secureSetItem('webos_workspaces', state);
  }
}

// Helper function to create window from saved state
function createWindowFromState(state) {
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = state.id;
  windowEl.dataset.appId = state.appId;
  windowEl.style.cssText = `
        left: ${state.position.left};
        top: ${state.position.top};
        width: ${state.position.width};
        height: ${state.position.height};
    `;
  
  windowEl.innerHTML = `
        <div class="titlebar">
            <div class="title">${state.appId}</div>
            <div class="actions">
                <button class="btn-min">—</button>
                <button class="btn-max">▢</button>
                <button class="btn-close">✕</button>
            </div>
        </div>
        <div class="content">${state.content}</div>
    `;
  
  return windowEl;
}

// Initialize workspace manager
window.workspaceManager = new WorkspaceManager();