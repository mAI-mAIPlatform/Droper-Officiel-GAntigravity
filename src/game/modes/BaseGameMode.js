/* ============================
   DROPER — Base Game Mode (v1.0.0)
   ============================ */

export class BaseGameMode {
    constructor(engine) {
        this.engine = engine;
        this.id = 'base';
        this.name = 'Mode de Base';
        this.themeColor = '#4a9eff';
        this.accentColor = '#60a5fa';
    }

    // Génère les murs pour ce mode
    generateMap() {
        const margin = 100;
        const w = this.engine.width;
        const h = this.engine.height;
        return [
            { x: w / 2 - 100, y: h / 2 - 150, w: 200, h: 30 },
            { x: w / 2 - 100, y: h / 2 + 120, w: 200, h: 30 },
            { x: margin, y: h / 2 - 100, w: 30, h: 200 },
            { x: w - margin - 30, y: h / 2 - 100, w: 30, h: 200 }
        ];
    }

    // Applique les styles CSS d'ambiance
    applyTheme() {
        document.documentElement.style.setProperty('--color-accent-blue', this.accentColor);
        document.body.style.background = `radial-gradient(circle at center, #0f172a 0%, #020617 100%)`;
    }

    // Logique spécifique à l'update si besoin
    update(dt) {
        // Logique par défaut
    }

    // HUD spécifique
    renderHUD() {
        return '';
    }
}
