import { Storage } from './storage.js';

export const AuthManager = {
    isLoggedIn: false,

    init() {
        this.checkAuth();
        this.setupListeners();
    },

    checkAuth() {
        const email = Storage.getActiveUserEmail();
        if (email) {
            this.handleAuthSuccess();
        } else {
            this.showAuthScreen();
        }
    },

    setupListeners() {
        const loginBtn = document.getElementById('auth-submit-btn');
        const signupBtn = document.getElementById('signup-submit-btn');
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');

        switchToSignup?.addEventListener('click', () => {
            document.getElementById('login-form-container').classList.add('hidden');
            document.getElementById('signup-form-container').classList.remove('hidden');
        });

        switchToLogin?.addEventListener('click', () => {
            document.getElementById('signup-form-container').classList.add('hidden');
            document.getElementById('login-form-container').classList.remove('hidden');
        });

        loginBtn?.addEventListener('click', () => {
            const email = document.getElementById('login-username').value.trim();
            const pass = document.getElementById('login-password').value;

            if (email && pass) {
                const user = Storage.findUser(email);
                if (user && user.password === pass) {
                    Storage.startSession(email);
                    this.handleAuthSuccess();
                } else {
                    alert('Invalid email address or password.');
                }
            } else {
                alert('Please enter your credentials.');
            }
        });

        signupBtn?.addEventListener('click', () => {
            const email = document.getElementById('signup-username').value.trim();
            const name = document.getElementById('signup-fullname').value.trim();
            const pass = document.getElementById('signup-password').value;

            if (email && name && pass) {
                if (Storage.findUser(email)) {
                    alert('An account with this email already exists.');
                    return;
                }

                const newUser = { email, name, password: pass };
                Storage.saveUser(newUser);
                Storage.startSession(email);

                // Initialize default profile
                const profile = {
                    name: name,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
                    status: 'Newly Orbiting'
                };
                Storage.saveProfile(profile);

                this.handleAuthSuccess();
            } else {
                alert('Please fill in all registration fields.');
            }
        });

        // Global Logout Button (Top Bar)
        document.getElementById('logout-btn-global')?.addEventListener('click', () => this.logout());

        // Settings Logout Button
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    },

    handleAuthSuccess() {
        this.isLoggedIn = true;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        document.getElementById('logout-btn-global')?.classList.remove('hidden');

        // Refresh UI with user data
        if (window.UniDash) {
            window.UniDash.initFeatureManagers();
        }
    },

    showAuthScreen() {
        this.isLoggedIn = false;
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app-content').classList.add('hidden');
        document.getElementById('logout-btn-global')?.classList.add('hidden');
    },

    logout() {
        Storage.endSession();
        location.reload();
    }
};

window.AuthManager = AuthManager;
