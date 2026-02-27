/* ============================
   DROPER — Mode Manager (sélection et orchestration)
   ============================ */

import { getModeById } from '../data/gamemodes.js';
import { TeamManager } from './TeamManager.js';
import { BotAI } from './BotAI.js';
import { NanopucesMode } from './modes/NanopucesMode.js';
import { LastSurvivorMode } from './modes/LastSurvivorMode.js';
import { HackServerMode } from './modes/HackServerMode.js';
import { CyberBallMode } from './modes/CyberBallMode.js';
import { PrimeDigitaleMode } from './modes/PrimeDigitaleMode.js';
import { ZoneSurchargeMode } from './modes/ZoneSurchargeMode.js';
import { RankedMode } from './modes/RankedMode.js';

const MODE_CLASSES = {
    nanopuces: NanopucesMode,
    last_survivor: LastSurvivorMode,
    hack_server: HackServerMode,
    cyber_ball: CyberBallMode,
    prime_digitale: PrimeDigitaleMode,
    zone_surcharge: ZoneSurchargeMode,
    ranked: RankedMode,
};

export class ModeManager {
    constructor(engine) {
        this.engine = engine;
        this.currentModeId = null;
        this.modeData = null;
        this.modeInstance = null;
        this.teamManager = null;
        this.bots = [];
        this.botAIs = [];
        this.timer = 0;
        this.finished = false;
        this.winner = null;
    }

    setMode(modeId) {
        this.currentModeId = modeId;
        this.modeData = getModeById(modeId);
    }

    init() {
        if (!this.modeData) return;

        this.timer = this.modeData.duration;
        this.finished = false;
        this.winner = null;

        // Create team manager
        this.teamManager = new TeamManager(this.modeData);

        // Create bots
        this.bots = [];
        this.botAIs = [];
        const totalBots = this.modeData.totalPlayers - 1;
        const roles = ['attacker', 'defender', 'support'];

        for (let i = 0; i < totalBots; i++) {
            const botEntity = this.createBotEntity(i);
            const role = roles[i % roles.length];
            const ai = new BotAI(botEntity, role);
            this.bots.push(botEntity);
            this.botAIs.push(ai);
            this.engine.entities.push(botEntity);
        }

        // Setup teams
        this.teamManager.setup(this.engine.player, this.bots);
        this.engine.player.teamId = 0;

        // Init mode instance
        const ModeClass = MODE_CLASSES[this.currentModeId];
        if (ModeClass) {
            this.modeInstance = new ModeClass(this.engine, this.teamManager);
            this.modeInstance.init();
        }
    }

    createBotEntity(index) {
        const w = this.modeData.mapWidth || this.engine.width;
        const h = this.modeData.mapHeight || this.engine.height;

        return {
            type: 'bot',
            alive: true,
            x: 100 + Math.random() * (w - 200),
            y: 100 + Math.random() * (h - 200),
            width: 22,
            height: 22,
            hp: 100,
            maxHp: 100,
            speed: 90 + Math.random() * 40,
            color: '#8b95a8',
            attack: 10,
            teamId: -1,
            isAlly: false,
            isPlayer: false,
            shootRate: 1.5 + Math.random() * 0.5,
            bulletSpeed: 200,
            bulletDamage: 8,
            respawnTimer: 0,
            takeDamage(dmg) {
                this.hp -= dmg;
                if (this.hp <= 0) {
                    this.hp = 0;
                    this.alive = false;
                }
            },
            draw(ctx) {
                if (!this.alive) return;
                const s = this.width / 2;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
                ctx.fill();

                // Health bar
                if (this.hp < this.maxHp) {
                    const barW = this.width + 4;
                    const barH = 3;
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    ctx.fillRect(this.x - barW / 2, this.y - s - 8, barW, barH);
                    const pct = this.hp / this.maxHp;
                    ctx.fillStyle = pct > 0.5 ? '#22c55e' : '#ef4444';
                    ctx.fillRect(this.x - barW / 2, this.y - s - 8, barW * pct, barH);
                }

                // Team label
                if (this.isAlly) {
                    ctx.fillStyle = '#4a9eff';
                    ctx.font = '8px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('🤖', this.x, this.y - s - 12);
                }
            },
            update() { },
        };
    }

    update(dt) {
        if (!this.modeData || this.finished) return;

        // Timer
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = 0;
            this.endByTimeout();
            return;
        }

        // Bot AIs
        const modeContext = this.modeInstance ? this.modeInstance.getContext() : null;
        for (const ai of this.botAIs) {
            ai.update(dt, this.engine, modeContext);
        }

        // Respawn dead bots
        for (const bot of this.bots) {
            if (!bot.alive) {
                bot.respawnTimer -= dt;
                if (bot.respawnTimer <= 0) {
                    bot.alive = true;
                    bot.hp = bot.maxHp;
                    bot.x = 100 + Math.random() * (this.engine.width - 200);
                    bot.y = 100 + Math.random() * (this.engine.height - 200);
                    bot.respawnTimer = 3;
                }
            }
        }

        // Mode-specific update
        if (this.modeInstance) {
            const result = this.modeInstance.update(dt);
            if (result && result.finished) {
                this.finished = true;
                this.winner = result.winner;
            }
        }
    }

    endByTimeout() {
        this.finished = true;
        if (this.modeInstance) {
            this.winner = this.modeInstance.getWinnerOnTimeout();
        }
    }

    draw(ctx) {
        if (this.modeInstance) {
            this.modeInstance.draw(ctx);
        }

        // Timer
        if (this.modeData) {
            const mins = Math.floor(this.timer / 60);
            const secs = Math.floor(this.timer % 60);
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(this.engine.width / 2 - 40, 8, 80, 24);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${mins}:${secs.toString().padStart(2, '0')}`, this.engine.width / 2, 25);
        }

        // Scores
        if (this.teamManager && this.modeData.type === 'team') {
            const scores = this.teamManager.getScores();
            ctx.textAlign = 'left';
            ctx.font = 'bold 12px sans-serif';
            scores.forEach((s, i) => {
                ctx.fillStyle = s.color;
                ctx.fillText(`${s.label}: ${s.score}`, 10, 50 + i * 18);
            });
        }
    }

    clear() {
        this.bots = [];
        this.botAIs = [];
        this.modeInstance = null;
        this.teamManager = null;
        this.finished = false;
    }
}
