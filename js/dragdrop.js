// dragdrop.js - ড্রাগ এন্ড ড্রপ functionality
class DragDropManager {
  constructor() {
    this.isDragging = false;
    this.dragSource = null;
    this.dropTarget = null;
    this.init();
  }
  
  init() {
    this.setupFileDragDrop();
    this.setupIconDragDrop();
  }
  
  setupFileDragDrop() {
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      // Show drop zone indication
    });
    
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      this.handleFileDrop(e);
    });
  }
  
  setupIconDragDrop() {
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
      icon.draggable = true;
      
      icon.addEventListener('dragstart', (e) => {
        this.isDragging = true;
        this.dragSource = icon;
        e.dataTransfer.setData('text/plain', icon.dataset.app);
        e.dataTransfer.effectAllowed = 'move';
      });
      
      icon.addEventListener('dragend', () => {
        this.isDragging = false;
        this.dragSource = null;
      });
    });
    
    // Desktop as drop target
    const desktop = document.getElementById('desktop');
    desktop.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (this.isDragging) {
        e.dataTransfer.dropEffect = 'move';
      }
    });
    
    desktop.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.isDragging && this.dragSource) {
        this.moveIconToPosition(this.dragSource, e.clientX, e.clientY);
      }
    });
  }
  
  handleFileDrop(e) {
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('text/') || file.type === '') {
        this.uploadFile(file);
      }
    });
  }
  
  async uploadFile(file) {
    const content = await this.readFileContent(file);
    const files = secureLoadFS();
    files.push({
      id: file.name,
      type: 'text',
      content: content,
      updatedAt: Date.now()
    });
    secureSaveFS(files);
    
    showNotification('File uploaded', `${file.name} has been added to files`, { type: 'success' });
  }
  
  readFileContent(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  }
  
  moveIconToPosition(icon, x, y) {
    icon.style.position = 'absolute';
    icon.style.left = (x - 48) + 'px'; // Center the icon
    icon.style.top = (y - 46) + 'px';
  }
}

// Initialize drag and drop
window.dragDropManager = new DragDropManager();