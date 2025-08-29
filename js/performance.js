// performance.js - পারফরমেন্স অপ্টিমাইজেশন
class PerformanceOptimizer {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupMemoryManagement();
    this.optimizeDOMOperations();
  }
  
  setupIntersectionObserver() {
    // Lazy loading for images and content
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.lazyLoadContent(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe images and iframes
    document.querySelectorAll('img[data-src], iframe[data-src]').forEach(el => {
      this.observer.observe(el);
    });
  }
  
  lazyLoadContent(element) {
    if (element.dataset.src) {
      element.src = element.dataset.src;
      element.removeAttribute('data-src');
    }
  }
  
  setupMemoryManagement() {
    // Clean up unused resources
    setInterval(() => {
      this.cleanupMemory();
    }, 30000); // Every 30 seconds
    
    // Window close event listener for cleanup
    const originalCloseWindow = window.closeWindow;
    window.closeWindow = function(id) {
      // Perform cleanup
      performanceOptimizer.cleanupWindowResources(id);
      
      // Call original function
      if (typeof originalCloseWindow === 'function') {
        originalCloseWindow(id);
      }
    };
  }
  
  cleanupMemory() {
    // Clean up unused DOM elements
    const unusedElements = document.querySelectorAll('.temp-element, .cache-element');
    unusedElements.forEach(el => {
      if (!el.isConnected || el.offsetParent === null) {
        el.remove();
      }
    });
    
    // Clear memory cache
    if (window.performance && window.performance.memory) {
      if (window.performance.memory.usedJSHeapSize > 50000000) { // 50MB threshold
        this.forceGarbageCollection();
      }
    }
  }
  
  cleanupWindowResources(windowId) {
    // Clean up resources for specific window
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
      // Remove event listeners
      const clone = windowEl.cloneNode(true);
      windowEl.parentNode.replaceChild(clone, windowEl);
    }
  }
  
  forceGarbageCollection() {
    // Force garbage collection (browser specific)
    if (window.gc) {
      window.gc();
    } else if (window.CollectGarbage) {
      window.CollectGarbage();
    }
  }
  
  optimizeDOMOperations() {
    // Batch DOM updates
    let updateQueue = [];
    let updateTimeout = null;
    
    window.batchDOMUpdate = (callback) => {
      updateQueue.push(callback);
      
      if (!updateTimeout) {
        updateTimeout = setTimeout(() => {
          // Process all updates at once
          const fragment = document.createDocumentFragment();
          updateQueue.forEach(callback => callback(fragment));
          
          if (fragment.children.length > 0) {
            document.body.appendChild(fragment);
          }
          
          updateQueue = [];
          updateTimeout = null;
        }, 100); // Batch every 100ms
      }
    };
    
    // Debounce expensive operations
    window.debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
  }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Lazy loading for app components
function lazyLoadApp(appId) {
  return import(`./apps/${appId}.js`)
    .then(module => {
      console.log(`Lazy loaded ${appId} app`);
      return module;
    })
    .catch(error => {
      console.error(`Failed to lazy load ${appId}:`, error);
    });
}

// Update openApp function to use lazy loading
const originalOpenApp = window.openApp;
window.openApp = function(appId) {
  // Lazy load app if not already loaded
  if (!window[`launch${appId.charAt(0).toUpperCase() + appId.slice(1)}`]) {
    lazyLoadApp(appId).then(() => {
      originalOpenApp(appId);
    });
  } else {
    originalOpenApp(appId);
  }
};