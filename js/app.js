import { ThemeEngine } from './theme.js';
import { TimeCore } from './time.js';
import { TaskManager } from './tasks.js';
import { ExpenseManager } from './expenses.js';
import { WeatherPulse } from './weather.js';
import { NoteManager } from './notes.js';
import { ProfileManager } from './profile.js';
import { AuthManager } from './auth.js';

class UniDashApp {
    constructor() {
        window.UniDash = this;
        this.init();
    }

    async init() {
        console.log('🚀 UniDash Initializing Core...');

        // Hide loader after a delay
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
        }, 1200);

        // Core Systems (Safe to run before auth)
        ThemeEngine.init();
        TimeCore.init();

        // Initialize Auth
        AuthManager.init();

        this.setupNavigation();
        this.registerServiceWorker();
    }

    // Called after successful login/auth
    initFeatureManagers() {
        console.log('📡 Initializing Feature Telemetry...');
        ProfileManager.init();
        TaskManager.init();
        ExpenseManager.init();
        WeatherPulse.init();
        NoteManager.init();
        console.log('✅ UniDash System Fully Online.');
    }


    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const views = document.querySelectorAll('.view');
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        const mobileBtn = document.getElementById('mobile-menu-btn');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewId = `view-${link.dataset.view}`;

                // Update nav
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update views
                views.forEach(v => {
                    v.classList.remove('active');
                    if (v.id === viewId) v.classList.add('active');
                });

                // Mobile: close sidebar on click
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        });

        // Sidebar Collapse (Desktop)
        toggle?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const icon = toggle.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
        });

        // Mobile Menu Toggle
        mobileBtn?.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
        });

        // Close sidebar if clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                sidebar.classList.contains('mobile-open') &&
                !sidebar.contains(e.target) &&
                !mobileBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => {
                        console.log('SW Registered', reg);
                    })
                    .catch(err => console.log('SW Failed', err));
            });
        }
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    window.UniDash = new UniDashApp();
});
