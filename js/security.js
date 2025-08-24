// security.js - সিকিউরিটি utilities
class SecurityManager {
  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
  }
  
  // এনক্রিপশন key generate করা
  generateEncryptionKey() {
    const key = localStorage.getItem('webos_encryption_key');
    if (key) return key;
    
    const newKey = 'webos_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('webos_encryption_key', newKey);
    return newKey;
  }
  
  // ডেটা এনক্রিপ্ট করা
  encrypt(data) {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      // Simple XOR encryption (production-এ better algorithm use করুন)
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
      }
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }
  
  // ডেটা ডিক্রিপ্ট করা
  decrypt(encryptedData) {
    try {
      const decoded = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
      }
      
      // JSON parse করার চেষ্টা করুন
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }
  
  // XSS prevention - HTML sanitization
  sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  // Input validation
  validateInput(input, type = 'text') {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      number: /^[0-9]+$/,
      text: /^[\w\s.,!?@#$%^&*()\-+={}[\];:'"<>/\\|~`]+$/i
    };
    
    if (type === 'text') {
      return patterns.text.test(input);
    }
    return patterns[type] ? patterns[type].test(input) : true;
  }
  
  // Secure localStorage functions
  secureSetItem(key, value) {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }
  
  secureGetItem(key) {
    const encrypted = localStorage.getItem(key);
    return encrypted ? this.decrypt(encrypted) : null;
  }
}

// Global security instance
window.security = new SecurityManager();

// Secure versions of loadFS and saveFS
function secureLoadFS() {
  const encrypted = localStorage.getItem("webos.fs");
  if (!encrypted) return [];
  
  try {
    return security.decrypt(encrypted) || [];
  } catch (error) {
    console.error('Failed to decrypt filesystem:', error);
    return [];
  }
}

function secureSaveFS(files) {
  try {
    const encrypted = security.encrypt(files);
    localStorage.setItem("webos.fs", encrypted);
  } catch (error) {
    console.error('Failed to encrypt filesystem:', error);
  }
}

// Secure settings functions
function secureLoadSettings() {
  const encrypted = localStorage.getItem("webos.settings");
  if (!encrypted) return defaults.settings;
  
  try {
    return security.decrypt(encrypted) || defaults.settings;
  } catch (error) {
    console.error('Failed to decrypt settings:', error);
    return defaults.settings;
  }
}

function secureSaveSettings(settings) {
  try {
    const encrypted = security.encrypt(settings);
    localStorage.setItem("webos.settings", encrypted);
  } catch (error) {
    console.error('Failed to encrypt settings:', error);
  }
}