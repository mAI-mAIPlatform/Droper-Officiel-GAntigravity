/* ============================
   DROPER — Mode Lave Dyna (v1.0.0)
   ============================ */

import { BaseGameMode } from './BaseGameMode.js';

export class LaveDynaMode extends BaseGameMode {
    constructor(engine) {
        super(engine);
        this.id = 'lave_dyna';
        this.name = 'Lave Dyna';
        this.themeColor = '#f97316'; // Orange lave
        this.accentColor = '#fb923c';
    }

    generateMap() {
        const w = this.engine.width;
        const h = this.engine.height;
        // Disposition en cercles / îlots
        return [
            { x: w / 2 - 200, y: h / 2 - 200, w: 80, h: 80 },
            { x: w / 2 + 120, y: h / 2 - 200, w: 80, h: 80 },
            { x: w / 2 - 200, y: h / 2 + 120, w: 80, h: 80 },
            { x: w / 2 + 120, y: h / 2 + 120, w: 80, h: 80 },
            // Murs extérieurs
            { x: 50, y: h / 2 - 10, w: 200, h: 20 },
            { x: w - 250, y: h / 2 - 10, w: 200, h: 20 }
        ];
    }

    applyTheme() {
        super.applyTheme();
        document.documentElement.style.setProperty('--color-accent-blue', this.themeColor);
        document.body.style.background = `radial-gradient(circle at center, #2e1005 0%, #020617 100%)`;
    }
}
