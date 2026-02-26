/* ============================
   DROPER — Mode Nanopuces 💎 (3v3)
   ============================ */

export class NanopucesMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.puces = [];
        this.totalPuces = 10;
        this.holdTime = { 0: 0, 1: 0 };
        this.holdTarget = 15;
    }

    init() {
        this.puces = [];
        for (let i = 0; i < this.totalPuces; i++) {
            this.puces.push({
                x: this.engine.width / 2 + (Math.random() - 0.5) * 200,
                y: this.engine.height / 2 + (Math.random() - 0.5) * 200,
                collected: false,
                holderId: null,
                holderTeam: null,
            });
        }
    }

    update(dt) {
        // Collect puces
        const allEntities = [this.engine.player, ...this.engine.entities.filter(e => e.type === 'bot' && e.alive)];
        for (const puce of this.puces) {
            if (puce.collected) continue;
            for (const ent of allEntities) {
                if (!ent || !ent.alive) continue;
                const d = Math.hypot(puce.x - ent.x, puce.y - ent.y);
                if (d < 20) {
                    puce.collected = true;
                    puce.holderTeam = ent.teamId;
                    break;
                }
            }
        }

        // Count per team
        const counts = { 0: 0, 1: 0 };
        this.puces.forEach(p => {
            if (p.collected && p.holderTeam != null) counts[p.holderTeam]++;
        });

        // Hold timer
        for (const teamId of [0, 1]) {
            if (counts[teamId] >= this.totalPuces) {
                this.holdTime[teamId] += dt;
                if (this.holdTime[teamId] >= this.holdTarget) {
                    return { finished: true, winner: teamId };
                }
            } else {
                this.holdTime[teamId] = 0;
            }
        }

        // Update team scores
        this.teams.teams[0].score = counts[0];
        this.teams.teams[1].score = counts[1];

        return null;
    }

    getContext() {
        const uncollected = this.puces.find(p => !p.collected);
        return {
            modeId: 'nanopuces',
            pucePos: uncollected ? { x: uncollected.x, y: uncollected.y } : null,
        };
    }

    getWinnerOnTimeout() {
        const c0 = this.puces.filter(p => p.holderTeam === 0).length;
        const c1 = this.puces.filter(p => p.holderTeam === 1).length;
        return c0 >= c1 ? 0 : 1;
    }

    draw(ctx) {
        for (const puce of this.puces) {
            if (puce.collected) continue;
            ctx.fillStyle = '#4a9eff';
            ctx.shadowColor = '#4a9eff';
            ctx.shadowBlur = 8;
            ctx.font = '14px serif';
            ctx.textAlign = 'center';
            ctx.fillText('💎', puce.x, puce.y);
            ctx.shadowBlur = 0;
        }

        // Hold progress
        for (const teamId of [0, 1]) {
            if (this.holdTime[teamId] > 0) {
                const pct = this.holdTime[teamId] / this.holdTarget;
                const x = teamId === 0 ? 10 : this.engine.width - 110;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(x, this.engine.height - 30, 100, 8);
                ctx.fillStyle = teamId === 0 ? '#4a9eff' : '#ef4444';
                ctx.fillRect(x, this.engine.height - 30, 100 * pct, 8);
            }
        }
    }
}
