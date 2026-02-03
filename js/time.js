export const TimeCore = {
    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.updateGreeting();
        this.updateDate();
    },

    updateClock() {
        const clockEl = document.getElementById('clock');
        if (!clockEl) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        clockEl.textContent = timeStr;
    },

    updateGreeting() {
        const greetingEl = document.getElementById('greeting');
        if (!greetingEl) return;

        const hour = new Date().getHours();
        let greeting = 'Good Evening';

        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 18) greeting = 'Good Afternoon';

        greetingEl.textContent = greeting;
    },

    updateDate() {
        const dateEl = document.getElementById('current-date');
        if (!dateEl) return;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString(undefined, options);
    }
};
