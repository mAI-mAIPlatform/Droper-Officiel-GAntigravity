/* ============================
   DROPER — Mode Kill Life (v1.0.0)
   ============================ */

import { BaseGameMode } from './BaseGameMode.js';

export class KillLifeMode extends BaseGameMode {
    constructor(engine) {
        super(engine);
        this.id = 'kill_life';
        this.name = 'Kill Life';
        this.themeColor = '#10b981'; // Vert cyberpunk
        this.accentColor = '#34d399';
    }

    generateMap() {
        const w = this.engine.width;
        const h = this.engine.height;
        // Disposition Urbaine (passages et bâtiments)
        return [
            // Bloc central
            { x: w / 2 - 150, y: h / 2 - 100, w: 300, h: 200 },
            // Murs extérieurs structurés
            { x: 100, y: 100, w: 40, h: 200 },
            { x: w - 140, y: 100, w: 40, h: 200 },
            { x: 100, y: h - 300, w: 40, h: 200 },
            { x: w - 140, y: h - 300, w: 40, h: 200 }
        ];
    }

    applyTheme() {
        super.applyTheme();
        document.documentElement.style.setProperty('--color-accent-blue', this.themeColor);
        document.body.style.background = `radial-gradient(circle at center, #06110a 0%, #020617 100%)`;
    }
}
