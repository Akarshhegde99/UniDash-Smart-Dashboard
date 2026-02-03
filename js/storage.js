/**
 * Antigravity Storage Module
 * Handles all localStorage interactions for persistence.
 */

const STORAGE_KEYS = {
    USERS: 'unidash_users',
    SESSION: 'unidash_session',
    // These now act as suffixes to the user Email
    TASKS: '_tasks',
    EXPENSES: '_expenses',
    PROFILE: '_profile',
    THEME: '_theme',
    NOTES_QUICK: '_notes_quick',
    NOTES_LIST: '_notes_list',
    SETTINGS: '_settings'
};

export const Storage = {
    // Current User Context (Unified for local use)
    getActiveUserEmail() {
        return 'local_user';
    },

    getUserKey(suffix) {
        const email = this.getActiveUserEmail();
        return email ? `${email}${suffix}` : null;
    },

    // Generic Get/Set
    get(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set(key, value) {
        if (!key) return false;
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    },

    // User Management
    getUsers() {
        return this.get(STORAGE_KEYS.USERS, []);
    },

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.set(STORAGE_KEYS.USERS, users);
    },

    findUser(email) {
        return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    // Session
    startSession(email) {
        localStorage.setItem(STORAGE_KEYS.SESSION, email);
    },

    endSession() {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    // Feature APIs (Now User-Specific)
    getTasks() {
        return this.get(this.getUserKey(STORAGE_KEYS.TASKS), []);
    },
    saveTasks(tasks) {
        return this.set(this.getUserKey(STORAGE_KEYS.TASKS), tasks);
    },

    getExpenses() {
        return this.get(this.getUserKey(STORAGE_KEYS.EXPENSES), []);
    },
    saveExpenses(expenses) {
        return this.set(this.getUserKey(STORAGE_KEYS.EXPENSES), expenses);
    },

    getProfile() {
        const email = this.getActiveUserEmail();
        return this.get(this.getUserKey(STORAGE_KEYS.PROFILE), {
            name: email ? email.split('@')[0] : 'User',
            avatar: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff',
            status: 'Orbiting'
        });
    },
    saveProfile(profile) {
        return this.set(this.getUserKey(STORAGE_KEYS.PROFILE), profile);
    },

    getTheme() {
        return this.get(this.getUserKey(STORAGE_KEYS.THEME), 'dark');
    },
    setTheme(theme) {
        return this.set(this.getUserKey(STORAGE_KEYS.THEME), theme);
    },

    getQuickNote() {
        return this.get(this.getUserKey(STORAGE_KEYS.NOTES_QUICK), '');
    },
    saveQuickNote(notes) {
        return this.set(this.getUserKey(STORAGE_KEYS.NOTES_QUICK), notes);
    },

    getNotesList() {
        return this.get(this.getUserKey(STORAGE_KEYS.NOTES_LIST), []);
    },
    saveNotesList(notes) {
        return this.set(this.getUserKey(STORAGE_KEYS.NOTES_LIST), notes);
    },

    clearAllData() {
        const email = this.getActiveUserEmail();
        if (!email) return;

        if (confirm('Erase all of your personal data? This cannot be undone.')) {
            Object.values(STORAGE_KEYS).forEach(key => {
                if (key.startsWith('_')) {
                    localStorage.removeItem(email + key);
                }
            });
            window.location.reload();
        }
    }
};
