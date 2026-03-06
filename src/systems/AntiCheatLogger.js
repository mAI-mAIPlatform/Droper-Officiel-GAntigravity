/* ============================
   DROPER — Anti-Cheat Logger (v0.9.7-beta)
   Détection de triche & rapports
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

const AC_CONFIG = {
    maxPlayerSpeed: 300,       // pixels/sec
    maxScorePerFrame: 50,      // points/frame
    maxDPSThreshold: 500,      // dégâts/sec
    maxTeleportDist: 200,      // pixels entre 2 frames
    reportCooldown: 10000,     // ms entre 2 rapports
    warningsBeforeBan: 5,
};

export class AntiCheatLogger {
    constructor(engine) {
        this.engine = engine;
        this.reports = [];
        this.warnings = 0;
        this.lastReportTime = 0;
        this.lastPlayerPos = null;
        this.lastPlayerScore = 0;
        this.damageAccumulator = 0;
        this.damageTimer = 0;
        this.isBanned = false;
    }

    /**
     * Appelé chaque frame dans la boucle update de GameEngine
     */
    check(dt) {
        if (this.isBanned) {
            // Empêcher l'annulation du ban en forçant les valeurs à chaque frame
            if (this.engine.player) {
                this.engine.player.hp = -9999;
                this.engine.player.alive = false;
            }
            return;
        }

        if (!this.engine.player) return;

        const player = this.engine.player;

        // --- 1. Détection de vitesse anormale ---
        if (this.lastPlayerPos) {
            const dx = player.x - this.lastPlayerPos.x;
            const dy = player.y - this.lastPlayerPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = dist / Math.max(dt, 0.001);

            // Téléportation
            if (dist > AC_CONFIG.maxTeleportDist) {
                this.flag('TELEPORT', `Distance: ${dist.toFixed(0)}px en 1 frame`);
            }

            // Vitesse extrême
            if (speed > AC_CONFIG.maxPlayerSpeed * 2) {
                this.flag('SPEED_HACK', `Vitesse: ${speed.toFixed(0)} px/s (max: ${AC_CONFIG.maxPlayerSpeed})`);
            }
        }
        this.lastPlayerPos = { x: player.x, y: player.y };

        // --- 2. Détection de score impossible ---
        const currentScore = this.engine.score || 0;
        const scoreDelta = currentScore - this.lastPlayerScore;
        if (scoreDelta > AC_CONFIG.maxScorePerFrame) {
            this.flag('SCORE_HACK', `+${scoreDelta} score en 1 frame`);
        }
        this.lastPlayerScore = currentScore;

        // --- 3. Détection DPS excessif ---
        this.damageTimer += dt;
        if (this.damageTimer >= 1.0) {
            if (this.damageAccumulator > AC_CONFIG.maxDPSThreshold) {
                this.flag('DPS_HACK', `DPS: ${this.damageAccumulator.toFixed(0)} (max: ${AC_CONFIG.maxDPSThreshold})`);
            }
            this.damageAccumulator = 0;
            this.damageTimer = 0;
        }
    }

    /**
     * Enregistrer les dégâts infligés (appelé depuis le moteur)
     */
    logDamage(amount) {
        this.damageAccumulator += amount;
    }

    /**
     * Signaler une anomalie
     */
    flag(type, detail) {
        const now = Date.now();
        if (now - this.lastReportTime < AC_CONFIG.reportCooldown) return;
        this.lastReportTime = now;

        this.warnings++;
        const report = {
            type,
            detail,
            timestamp: new Date().toISOString(),
            warnings: this.warnings,
            playerTag: this.engine.app?.playerManager?.data?.tag || '???',
        };
        this.reports.push(report);

        console.warn(`🛡️ Anti-Cheat [${type}]: ${detail} (warning ${this.warnings}/${AC_CONFIG.warningsBeforeBan})`);

        // Sauvegarder les rapports localement
        try {
            const stored = JSON.parse(localStorage.getItem('droper_ac_reports') || sessionStorage.getItem('droper_ac_backup') || '[]');
            stored.push(report);
            if (stored.length > 200) stored.splice(0, stored.length - 200);
            localStorage.setItem('droper_ac_reports', JSON.stringify(stored));
            sessionStorage.setItem('droper_ac_backup', JSON.stringify(stored)); // Backup against cache clearing
        } catch (e) { /* ignore */ }

        // Bannissement après trop de warnings
        if (this.warnings >= AC_CONFIG.warningsBeforeBan) {
            this.ban();
        }
    }

    /**
     * Bannir le joueur (simulé)
     */
    ban() {
        this.isBanned = true;
        toast.error('🛡️ ANTI-CHEAT : Comportement anormal détecté. Partie terminée.');
        console.error('🚫 JOUEUR BANNI — Trop de violations anti-cheat.');

        // Forcer Game Over
        if (this.engine.player) {
            this.engine.player.hp = 0;
            this.engine.player.alive = false;
        }
    }

    /**
     * Obtenir les rapports pour l'admin dashboard
     */
    getReports() {
        try {
            return JSON.parse(localStorage.getItem('droper_ac_reports') || sessionStorage.getItem('droper_ac_backup') || '[]');
        } catch {
            return [];
        }
    }

    reset() {
        this.warnings = 0;
        this.lastPlayerPos = null;
        this.lastPlayerScore = 0;
        this.damageAccumulator = 0;
        this.damageTimer = 0;
        this.isBanned = false;
    }
}
