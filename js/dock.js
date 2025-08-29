// js/dock.js

// This function will build and populate the dock and app drawer.
function createDockAndDrawer() {
    const dock = document.getElementById('dock');
    const appDrawer = document.getElementById('app-drawer');
    const appDrawerGrid = appDrawer.querySelector('.app-drawer-grid');
    const appDrawerBtn = document.getElementById('app-drawer-btn');

    // Get all available apps from the main app registry
    const allApps = window.apps;

    // A list of apps to show in the dock (you can customize this)
    const dockApps = ['files', 'notes', 'browser', 'terminal', 'settings'];

    // Populate the dock with selected apps
    dockApps.forEach(appId => {
        const appInfo = allApps[appId];
        if (appInfo) {
            const iconElement = createIconElement(appInfo, 'dock');
            dock.appendChild(iconElement);
        }
    });

    // Populate the app drawer with ALL apps
    for (const appId in allApps) {
        const appInfo = allApps[appId];
        const iconElement = createIconElement(appInfo, 'drawer');
        appDrawerGrid.appendChild(iconElement);
    }

    // Helper function to create an app icon element
    function createIconElement(appInfo, type) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.dataset.app = appInfo.id;
        iconDiv.title = appInfo.name;

        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'emoji';
        emojiDiv.textContent = appInfo.icon;

        iconDiv.appendChild(emojiDiv);

        // Add label for app drawer icons
        if (type === 'drawer') {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = appInfo.name;
            iconDiv.appendChild(labelDiv);
        }

        // Add click listener to open the app
        iconDiv.addEventListener('click', () => {
            if (typeof window.openApp === 'function') {
                window.openApp(appInfo.id);
                // Hide the app drawer after an app is launched
                if (!appDrawer.classList.contains('hidden')) {
                     appDrawer.classList.add('hidden');
                }
            }
        });
        return iconDiv;
    }

    // Toggle the app drawer visibility
    appDrawerBtn.addEventListener('click', () => {
        appDrawer.classList.toggle('show');
    });

    // Hide drawer if you click outside of it
    document.addEventListener('click', (e) => {
        const isClickInside = appDrawer.contains(e.target) || appDrawerBtn.contains(e.target);
        if (!isClickInside && appDrawer.classList.contains('show')) {
            appDrawer.classList.remove('show');
        }
    });
}

// Wait for the DOM to be ready before creating the dock and drawer
document.addEventListener('DOMContentLoaded', createDockAndDrawer);
