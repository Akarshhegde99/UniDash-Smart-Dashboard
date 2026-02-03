export const WeatherPulse = {
    city: 'Bengaluru',
    apiKey: '',

    init() {
        this.fetchWeather();
        this.setupSearch();
        setInterval(() => this.fetchWeather(this.city), 600000);
    },

    setupSearch() {
        const searchInput = document.getElementById('city-search-input');
        const searchBtn = document.getElementById('search-city-btn');

        searchBtn?.addEventListener('click', () => {
            const city = searchInput.value.trim();
            if (city) {
                this.city = city;
                this.fetchWeather(city);
            }
        });

        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = searchInput.value.trim();
                if (city) {
                    this.city = city;
                    this.fetchWeather(city);
                }
            }
        });
    },

    async fetchWeather(city = 'Bengaluru') {
        const statEl = document.querySelector('#stat-weather');
        const valueEl = statEl?.querySelector('.stat-value');
        const labelEl = statEl?.querySelector('.stat-label');

        const mainDisplay = document.getElementById('weather-main-display');
        const forecastGrid = document.getElementById('forecast-grid');

        if (labelEl) labelEl.textContent = 'Updating...';

        try {
            // Using wttr.in as a free alternative
            const response = await fetch(`https://wttr.in/${city}?format=j1`);
            if (!response.ok) throw new Error('Weather data unavailable');

            const data = await response.json();
            const current = data.current_condition[0];
            const temp = current.temp_C;
            const desc = current.weatherDesc[0].value;
            const humidity = current.humidity;
            const wind = current.windspeedKmph;

            // Update Dashboard Stat
            if (valueEl) valueEl.textContent = `${temp}°C`;
            if (labelEl) labelEl.textContent = `${city}: ${desc}`;

            // Update Detailed View
            if (mainDisplay) {
                mainDisplay.innerHTML = `
                    <div class="weather-hero">
                        <i class="fas ${this.getWeatherIcon(desc)}"></i>
                        <div class="temp-large">${temp}°C</div>
                        <h3 style="font-size: 2rem; margin: 1rem 0">${city}</h3>
                        <p style="color: var(--secondary); font-size: 1.2rem">${desc}</p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 3rem; margin-top: 3rem">
                        <div class="weather-meta">
                            <span style="color: var(--secondary)">Humidity</span>
                            <p style="font-size: 1.5rem; font-weight: 700">${humidity}%</p>
                        </div>
                        <div class="weather-meta">
                            <span style="color: var(--secondary)">Wind Speed</span>
                            <p style="font-size: 1.5rem; font-weight: 700">${wind} km/h</p>
                        </div>
                    </div>
                `;
            }

            if (forecastGrid) {
                const forecast = data.weather.slice(0, 3);
                forecastGrid.innerHTML = forecast.map(day => `
                    <div class="forecast-card card glass">
                        <p style="color: var(--secondary)">${day.date}</p>
                        <i class="fas ${this.getWeatherIcon(day.hourly[4].weatherDesc[0].value)}" style="font-size: 1.5rem; margin: 1rem 0; color: var(--primary)"></i>
                        <p style="font-size: 1.2rem; font-weight: 700">${day.maxtempC}° / ${day.mintempC}°</p>
                    </div>
                `).join('');
            }

        } catch (error) {
            console.error('Weather error:', error);
            if (labelEl) labelEl.textContent = 'Offline / Error';
            if (valueEl) valueEl.textContent = '--°C';
            if (mainDisplay) mainDisplay.innerHTML = `<p>Unable to fetch telemetry from ${city}.</p>`;
        }
    },

    getWeatherIcon(desc) {
        const d = desc.toLowerCase();
        if (d.includes('sun') || d.includes('clear')) return 'fa-sun';
        if (d.includes('cloud')) return 'fa-cloud';
        if (d.includes('rain')) return 'fa-cloud-showers-heavy';
        if (d.includes('snow')) return 'fa-snowflake';
        if (d.includes('thunder')) return 'fa-bolt';
        return 'fa-cloud-sun';
    }
};
