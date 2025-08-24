// notifications.js - একটি সম্পূর্ণ নোটিফিকেশন সিস্টেম
class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }
  
  init() {
    // নোটিফিকেশন কন্টেইনার তৈরি করুন
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    document.body.appendChild(this.container);
  }
  
  show(title, message, options = {}) {
    const {
      type = 'info',
        duration = 5000,
        icon = 'ℹ️'
    } = options;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <div style="font-size: 1.2em;">${icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 0.9em; opacity: 0.8;">${message}</div>
        </div>
        <button class="notification-close" style="background: none; border: none; font-size: 1.2em; cursor: pointer;">×</button>
      </div>
    `;
    
    this.container.appendChild(notification);
    this.notifications.push(notification);
    
    // ক্লোজ বাটন ইভেন্ট
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.remove(notification);
    });
    
    // অটো ক্লোজ
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }
    
    return notification;
  }
  
  remove(notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }
  
  clearAll() {
    this.notifications.forEach(notification => {
      this.remove(notification);
    });
  }
}

// নোটিফিকেশন সিস্টেম ইনিশিয়ালাইজ করুন
const notifications = new NotificationSystem();

// নোটিফিকেশন প্রদর্শনের জন্য হেল্পার ফাংশন
function showNotification(title, message, options = {}) {
  return notifications.show(title, message, options);
}