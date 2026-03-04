/* ============================
   DROPER — Mode CyberBall (v1.0.0)
   ============================ */

import { BaseGameMode } from './BaseGameMode.js';

export class CyberBallMode extends BaseGameMode {
    constructor(engine) {
        super(engine);
        this.id = 'cyberball';
        this.name = 'CyberBall';
        this.themeColor = '#3b82f6'; // Bleu sport
        this.accentColor = '#60a5fa';
    }

    generateMap() {
        const w = this.engine.width;
        const h = this.engine.height;
        // Terrain de sport (buts et obstacles latéraux)
        return [
            { x: w / 2 - 100, y: 50, w: 200, h: 20 }, // Mur haut
            { x: w / 2 - 100, y: h - 70, w: 200, h: 20 }, // Mur bas
            { x: 100, y: h / 2 - 100, w: 20, h: 200 }, // Obstacle latéral G
            { x: w - 120, y: h / 2 - 100, w: 20, h: 200 }, // Obstacle latéral D
            // Buts (juste visuel mur pour l'instant)
            { x: 0, y: h / 2 - 80, w: 20, h: 160 },
            { x: w - 20, y: h / 2 - 80, w: 20, h: 160 }
        ];
    }

    applyTheme() {
        super.applyTheme();
        document.documentElement.style.setProperty('--color-accent-blue', this.themeColor);
        document.body.style.background = `radial-gradient(circle at center, #05162e 0%, #020617 100%)`;
    }
}
