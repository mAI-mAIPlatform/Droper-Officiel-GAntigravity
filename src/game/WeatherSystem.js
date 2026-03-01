/* ============================
   DROPER — Weather System (v0.9.2)
   ============================ */

export class WeatherSystem {
    constructor(engine) {
        this.engine = engine;
        this.currentWeather = 'clear'; // 'clear', 'rain', 'snow'
        this.timer = 0;
        this.nextChange = 10 + Math.random() * 10;
        this.speedMultiplier = 1.0;
        this.active = false;
    }

    init() {
        this.active = this.engine.app.selectedMode === 'dynamic_flash';
        this.currentWeather = 'clear';
        this.speedMultiplier = 1.0;
        this.timer = 0;
        this.nextChange = 10 + Math.random() * 10;
    }

    update(dt) {
        if (!this.active) return;

        this.timer += dt;
        if (this.timer >= this.nextChange) {
            this.timer = 0;
            this.changeWeather();
            this.nextChange = 15 + Math.random() * 15;
        }

        // Particules de météo
        if (this.currentWeather === 'rain') {
            this.engine.particles.spawnRain(this.engine.width, this.engine.height);
        } else if (this.currentWeather === 'snow') {
            this.engine.particles.spawnSnow(this.engine.width, this.engine.height);
        }
    }

    changeWeather() {
        const types = ['clear', 'rain', 'snow'];
        const old = this.currentWeather;

        // Choisir un nouveau type different
        let next;
        do {
            next = types[Math.floor(Math.random() * types.length)];
        } while (next === old);

        this.currentWeather = next;

        if (this.currentWeather === 'rain') {
            this.speedMultiplier = 0.9;
            this.engine.addAnnouncement('⛈️ ORAGE : Vitesse -10%');
        } else if (this.currentWeather === 'snow') {
            this.speedMultiplier = 0.8;
            this.engine.addAnnouncement('❄️ BLIZZARD : Vitesse -20%');
        } else {
            this.speedMultiplier = 1.0;
            this.engine.addAnnouncement('☀️ LE CIEL SE DÉGAGE');
        }
    }

    getSpeedMultiplier() {
        return this.speedMultiplier;
    }
}
