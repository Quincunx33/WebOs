// shortcuts.js - কীবোর্ড শর্টকাট সিস্টেম
class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.pressedKeys = new Set();
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', (e) => {
      this.pressedKeys.add(e.key.toLowerCase());
      this.checkShortcuts();
    });
    
    document.addEventListener('keyup', (e) => {
      this.pressedKeys.delete(e.key.toLowerCase());
    });
    
    // ডিফল্ট শর্টকাট রেজিস্টার করুন
    this.registerDefaultShortcuts();
  }
  
  register(keys, description, callback) {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    const normalizedKeys = keyArray.map(k => k.toLowerCase());
    this.shortcuts.set(normalizedKeys.join('+'), { callback, description });
  }
  
  checkShortcuts() {
    for (const [keyCombo, { callback }] of this.shortcuts) {
      const keys = keyCombo.split('+');
      if (keys.every(key => this.pressedKeys.has(key))) {
        callback();
        // একবার ট্রিগার করার পর কীগুলি রিসেট করুন
        this.pressedKeys.clear();
        break;
      }
    }
  }
  
  registerDefaultShortcuts() {
      // অ্যাপ শর্টকাট
      this.register(['ctrl', 'n'], 'Open Notes app', () => openApp('notes'));
      this.register(['ctrl', 'f'], 'Open Files app', () => openApp('files'));
      this.register(['ctrl', 'b'], 'Open Browser app', () => openApp('browser'));
      this.register(['ctrl', 's'], 'Open Settings app', () => openApp('settings'));
      this.register(['ctrl', 't'], 'Open Terminal app', () => openApp('terminal'));
      
      // সিস্টেম শর্টকাট
      this.register(['ctrl', 'l'], 'Lock desktop', () => lockDesktop());
      this.register(['alt', 'f4'], 'Close active window', () => {
        if (windows.length > 0) {
          closeWindow(windows[windows.length - 1].id);
        }
      });
      this.register(['alt', 'tab'], 'Switch between windows', () => {
        if (windows.length > 1) {
          const activeWindowIndex = windows.findIndex(w => w.el.style.zIndex === window.highestZIndex);
          const nextIndex = (activeWindowIndex + 1) % windows.length;
          focusWindow(windows[nextIndex].id);
        }
      });
  }
}

// এই কোডটি ফাইল থেকে বাদ দেওয়া হয়েছে:
// const shortcuts = new ShortcutManager();
