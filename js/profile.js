import { Storage } from './storage.js';
import { ThemeEngine } from './theme.js';

export const ProfileManager = {
    init() {
        this.loadProfile();
        this.setupEventListeners();
        this.setupSettingsView();
    },

    loadProfile() {
        const profile = Storage.getProfile();
        const nameEl = document.getElementById('user-name-display');
        const avatarEl = document.getElementById('user-avatar');
        const greetingEl = document.getElementById('greeting');
        const statusEl = document.querySelector('.user-status');
        const settingsNameInput = document.getElementById('settings-username');

        if (nameEl) nameEl.textContent = profile.name;
        if (avatarEl) avatarEl.src = profile.avatar;
        if (settingsNameInput) settingsNameInput.value = profile.name;
        if (statusEl) statusEl.textContent = `Status: ${profile.status || 'Orbiting'}`;

        if (greetingEl) {
            // Get base greeting (Good Morning etc) from existing text or current state
            const currentText = greetingEl.textContent;
            const baseGreeting = currentText.includes(',') ? currentText.split(',')[0] : currentText;
            greetingEl.textContent = `${baseGreeting}, ${profile.name}`;
        }
    },

    setupEventListeners() {
        const avatarInput = document.getElementById('avatar-upload');
        avatarInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const profile = Storage.getProfile();
                    profile.avatar = event.target.result;
                    Storage.saveProfile(profile);
                    this.loadProfile();
                };
                reader.readAsDataURL(file);
            }
        });
    },

    setupSettingsView() {
        const saveProfileBtn = document.getElementById('save-settings-profile');
        const themeToggleBtn = document.getElementById('settings-theme-toggle');
        const clearDataBtn = document.getElementById('clear-all-data');

        saveProfileBtn?.addEventListener('click', () => {
            const newName = document.getElementById('settings-username').value;
            if (newName && newName.trim()) {
                const profile = Storage.getProfile();
                profile.name = newName.trim();
                Storage.saveProfile(profile);
                this.loadProfile();
                alert('Profile updated successfully!');
            }
        });

        themeToggleBtn?.addEventListener('click', () => {
            ThemeEngine.toggleTheme();
        });

        clearDataBtn?.addEventListener('click', () => {
            Storage.clearAllData();
        });
    }
};
