import { Storage } from './storage.js';

export const ThemeEngine = {
    init() {
        const savedTheme = Storage.getTheme();
        this.applyTheme(savedTheme);
        this.setupEventListeners();
    },

    applyTheme(theme) {
        const body = document.body;
        const themeBtn = document.getElementById('theme-toggle');
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.querySelector('span');

        if (theme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }

        Storage.setTheme(theme);
    },

    toggleTheme() {
        const currentTheme = Storage.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    },

    setupEventListeners() {
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn.addEventListener('click', () => this.toggleTheme());

        // System theme detection
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('unidash_theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
};
