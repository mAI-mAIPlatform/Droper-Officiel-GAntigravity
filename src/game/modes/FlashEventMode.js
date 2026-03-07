/* ============================
   DROPER — Flash Event Mode (v0.9.7-beta)
   Mode de jeu temporaire avec modificateurs
   ============================ */

export class FlashEventMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teamManager = teamManager;
        this.modifiers = {};
        this.particles = [];
        this.timer = 0;
        this.killScores = {}; // playerId -> kills
    }

    init() {
        // Récupérer les modificateurs du FlashEventManager
        const flashMgr = this.engine.app?.flashEventManager;
        if (flashMgr) {
            const event = flashMgr.getCurrentEvent();
            this.modifiers = event?.modifiers || {};
        }

        // Appliquer les modificateurs aux joueurs et bots
        this.applyModifiersToEntities();
    }

    applyModifiersToEntities() {
        const mods = this.modifiers;

        // Appliquer au joueur
        if (this.engine.player) {
            if (mods.playerSpeedMult) {
                this.engine.player.speed *= mods.playerSpeedMult;
            }
            if (mods.hpMult) {
                this.engine.player.maxHp = Math.floor(this.engine.player.maxHp * mods.hpMult);
                this.engine.player.hp = this.engine.player.maxHp;
            }
        }

        // Appliquer aux bots
        for (const bot of this.engine.gameMode?.bots || []) {
            if (mods.enemySpeedMult) bot.speed *= mods.enemySpeedMult;
            if (mods.hpMult) {
                bot.maxHp = Math.floor(bot.maxHp * mods.hpMult);
                bot.hp = bot.maxHp;
            }
        }
    }

    update(dt) {
        this.timer += dt;
        const mods = this.modifiers;

        // Effet de flottement (gravité zéro)
        if (mods.playerFloatEffect && this.engine.player) {
            this.engine.player.y += Math.sin(this.timer * 3) * 0.5;
        }

        // Vampire heal
        if (mods.vampireHeal) {
            // Vérifié dans GameEngine.onEntityKilled
        }

        // Night overlay géré dans draw()

        // Génération de particules d'ambiance
        if (this.timer % 0.5 < dt) {
            this.particles.push({
                x: Math.random() * this.engine.width,
                y: Math.random() * this.engine.height,
                size: 2 + Math.random() * 4,
                alpha: 0.5 + Math.random() * 0.5,
                life: 1 + Math.random(),
                maxLife: 1 + Math.random(),
            });
        }

        // Mettre à jour les particules
        this.particles = this.particles.filter(p => {
            p.life -= dt;
            p.alpha = (p.life / p.maxLife) * 0.5;
            return p.life > 0;
        });

        return null; // Le mode ne se termine pas automatiquement
    }

    draw(ctx) {
        const mods = this.modifiers;

        // Night overlay pour le mode vampire
        if (mods.nightOverlay) {
            ctx.fillStyle = 'rgba(20, 0, 30, 0.35)';
            ctx.fillRect(0, 0, this.engine.width, this.engine.height);
        }

        // Particules d'ambiance
        const flashMgr = this.engine.app?.flashEventManager;
        const eventColor = flashMgr?.currentEvent?.color || '#fff';
        for (const p of this.particles) {
            ctx.fillStyle = eventColor + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bannière Event en haut
        const event = flashMgr?.getCurrentEvent();
        if (event) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.engine.width / 2 - 100, 35, 200, 22);
            ctx.fillStyle = event.color;
            ctx.font = 'bold 11px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${event.emoji || '⚡'} ${(event.name?.toString() || 'ÉVÉNEMENT').toUpperCase()}`, this.engine.width / 2, 50);
        }
    }

    getContext() {
        return { modifiers: this.modifiers };
    }

    getWinnerOnTimeout() {
        return this.engine.player?.alive ? 'player' : 'enemies';
    }
}
