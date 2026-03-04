/* ============================
   DROPER — Spectator Manager (v0.9.7-beta)
   Mode fantôme pour observer les parties
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class SpectatorManager {
    constructor(app) {
        this.app = app;
        this.isSpectating = false;
        this.targetPlayer = null;
        this.spectatingRoom = null;
        this.cameraX = 0;
        this.cameraY = 0;
        this.freeCamera = false;
    }

    /**
     * Commencer à observer un joueur
     * @param {string} playerId - ID ou tag du joueur
     * @param {string} roomId - ID de la room
     */
    startSpectating(playerId, roomId) {
        this.isSpectating = true;
        this.spectatingRoom = roomId || 'room_' + Date.now();
        this.freeCamera = false;

        // Simuler le joueur observé
        this.targetPlayer = {
            id: playerId,
            name: playerId,
            x: 400,
            y: 300,
            hp: 100,
            maxHp: 100,
            kills: 0,
            alive: true,
            hero: 'soldier',
            color: '#4a9eff',
            angle: 0,
        };

        toast.info(`👁️ Tu observes ${playerId} en mode fantôme.`);

        // Simuler des mouvements du joueur observé
        this._simulationInterval = setInterval(() => {
            if (!this.isSpectating || !this.targetPlayer) return;
            // Mouvement aléatoire simulé
            this.targetPlayer.x += (Math.random() - 0.5) * 8;
            this.targetPlayer.y += (Math.random() - 0.5) * 8;
            this.targetPlayer.angle += (Math.random() - 0.5) * 0.3;
            this.targetPlayer.x = Math.max(50, Math.min(750, this.targetPlayer.x));
            this.targetPlayer.y = Math.max(50, Math.min(550, this.targetPlayer.y));

            // Simuler des kills aléatoires
            if (Math.random() < 0.02) {
                this.targetPlayer.kills++;
            }

            // Simuler des dégâts reçus
            if (Math.random() < 0.01) {
                this.targetPlayer.hp = Math.max(0, this.targetPlayer.hp - Math.floor(Math.random() * 20));
                if (this.targetPlayer.hp <= 0) {
                    this.targetPlayer.alive = false;
                    toast.info('💀 Le joueur observé est mort !');
                    // Respawn après 3s
                    setTimeout(() => {
                        if (this.targetPlayer) {
                            this.targetPlayer.alive = true;
                            this.targetPlayer.hp = this.targetPlayer.maxHp;
                        }
                    }, 3000);
                }
            }
        }, 100);
    }

    stopSpectating() {
        this.isSpectating = false;
        this.targetPlayer = null;
        this.spectatingRoom = null;
        if (this._simulationInterval) {
            clearInterval(this._simulationInterval);
            this._simulationInterval = null;
        }
        toast.info('👁️ Mode spectateur désactivé.');
    }

    toggleFreeCamera() {
        this.freeCamera = !this.freeCamera;
        toast.info(this.freeCamera ? '🎥 Caméra libre activée' : '🎯 Caméra centrée sur le joueur');
    }

    /**
     * Rendu du mode spectateur (overlay)
     */
    renderOverlay() {
        if (!this.isSpectating || !this.targetPlayer) return '';

        const tp = this.targetPlayer;
        const hpPct = Math.round((tp.hp / tp.maxHp) * 100);
        const hpColor = hpPct > 50 ? '#22c55e' : hpPct > 25 ? '#fbbf24' : '#ef4444';

        return `
            <div style="position: fixed; inset: 0; z-index: 9000; pointer-events: none;">
                <!-- Bannière Spectateur -->
                <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); 
                     background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
                     padding: 8px 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15);
                     color: #fff; font-family: Outfit, sans-serif; display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.2em;">👁️</span>
                    <span style="font-weight: 700; font-size: 0.85rem;">SPECTATEUR</span>
                    <span style="color: #8b95a8; font-size: 0.75rem;">| ${tp.name}</span>
                </div>

                <!-- Stats joueur observé -->
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
                     background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
                     padding: 12px 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                     color: #fff; font-family: Outfit, sans-serif; display: flex; gap: 20px; align-items: center;">
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; color: #8b95a8;">HP</div>
                        <div style="font-weight: 700; color: ${hpColor};">${tp.hp}/${tp.maxHp}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; color: #8b95a8;">KILLS</div>
                        <div style="font-weight: 700; color: #fbbf24;">${tp.kills}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; color: #8b95a8;">ÉTAT</div>
                        <div style="font-weight: 700; color: ${tp.alive ? '#22c55e' : '#ef4444'};">${tp.alive ? '🟢 VIVANT' : '💀 MORT'}</div>
                    </div>
                </div>

                <!-- Boutons / Contrôles -->
                <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 8px; pointer-events: auto;">
                    <button id="btn-spectator-camera" style="background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.7rem;">
                        🎥 Caméra
                    </button>
                    <button id="btn-spectator-quit" style="background: rgba(239, 68, 68, 0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.7rem;">
                        ✕ Quitter
                    </button>
                </div>
            </div>
        `;
    }

    destroy() {
        this.stopSpectating();
    }
}
