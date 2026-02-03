# 🚀 UniDash – Smart Personal Dashboard

**“Your Universal Productivity Suite. One Dash. Total Control.”**

UniDash is a modern, high-performance personal dashboard built with 100% Vanilla JavaScript. It demonstrates a wide range of core and advanced JS concepts in a real-world application, featuring a sleek glassmorphism UI, offline support, and persistent data storage.

## 🪐 Features

- **✅ Task Control System**: CRUD operations, drag & drop reordering, and search filters.
- **💰 Expense Orbit**: Track income/expenses with category-based summaries and CSV export.
- **☁️ Weather Pulse**: Live local weather updates (powered by wttr.in).
- **📝 Notes Gravity**: Rich notes with autosave functionality and character counting.
- **🕒 Time Core**: Dynamic greetings and a real-time digital clock.
- **🌓 Theme Engine**: Seamless toggling between light and dark modes with persistence.
- **👤 Profile Simulation**: Personalized experience with avatar uploads and username storage.
- **📶 Offline Mode**: PWA-ready with Service Workers for offline accessibility.

## 🛠️ Tech Stack

- **Language**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Pure CSS3 (Glassmorphism design system)
- **State Management**: Browser LocalStorage & Memory
- **APIs**: wttr.in (Weather)
- **Environment**: No frameworks, no build tools, pure web standards.

## 📂 Architecture

```text
/UniDash
│
├── index.html          # Main entry point
├── manifest.json       # PWA Manifest
├── service-worker.js   # Offline & Caching logic
│
├── css/
│   └── style.css       # Design system & Animations
│
├── js/
│   ├── app.js          # Main Orchestrator
│   ├── tasks.js        # Task Management Logic
│   ├── expenses.js     # Finance Tracking Logic
│   ├── weather.js      # Weather API Integration
│   ├── notes.js        # Note-taking Logic
│   ├── profile.js      # User Profile Logic
│   ├── theme.js        # UI Theme Engine
│   ├── time.js         # Clock & Greetings Logic
│   └── storage.js      # Persistence Layer (Abstraction)
│
└── assets/             # Icons & Media
```

## 🧩 JavaScript Concepts Covered

This project is a masterclass in Vanilla JS, covering:
- **Modules**: Clean separation of concerns using ES Imports/Exports.
- **Asynchronous JS**: `async/await` and `fetch` for API interactions.
- **DOM Manipulation**: Advanced event delegation and dynamic rendering.
- **Browser APIs**: `localStorage`, `FileReader`, `ServiceWorker`, `Geolocation`.
- **Logic**: Array methods (`map`, `filter`, `reduce`), Destructuring, Spread Operators, Closures.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/UniDash.git
   ```
2. Open `index.html` in any modern browser.
3. (Optional) Use a local server (like Live Server in VS Code) for the best Service Worker experience.

## 📦 Deployment

The project is ready for **GitHub Pages** or **Netlify**.
- **GitHub Pages**: Push to the `main` branch and enable "GitHub Pages" in the repository settings.
- **Netlify**: Drag and drop the folder into the Netlify dashboard.

---
Created with ❤️ by UniDash Team
