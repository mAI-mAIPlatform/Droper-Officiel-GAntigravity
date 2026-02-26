/* ============================
   DROPER — Mode Last Survivor 👑 (Solo BR)
   ============================ */

export class LastSurvivorMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.toxicRadius = 0;
        this.maxRadius = 0;
        this.shrinkTimer = 0;
        this.shrinkInterval = 30;
        this.shrinkAmount = 40;
        this.lootCrates = [];
    }

    init() {
        this.maxRadius = Math.max(this.engine.width, this.engine.height) / 2 + 50;
        this.toxicRadius = this.maxRadius;
        this.shrinkTimer = this.shrinkInterval;

        // Spawn loot crates
        this.lootCrates = [];
        for (let i = 0; i < 8; i++) {
            this.lootCrates.push({
                x: 80 + Math.random() * (this.engine.width - 160),
                y: 80 + Math.random() * (this.engine.height - 160),
                alive: true,
                type: Math.random() < 0.5 ? 'hp' : 'damage',
                amount: Math.random() < 0.3 ? 50 : 25,
            });
        }
    }

    update(dt) {
        // Shrink cloud
        this.shrinkTimer -= dt;
        if (this.shrinkTimer <= 0) {
            this.toxicRadius -= this.shrinkAmount;
            if (this.toxicRadius < 60) this.toxicRadius = 60;
            this.shrinkTimer = this.shrinkInterval;
        }

        // Toxic damage
        const cx = this.engine.width / 2;
        const cy = this.engine.height / 2;
        const allAlive = [this.engine.player, ...this.engine.entities.filter(e => (e.type === 'bot') && e.alive)];

        for (const ent of allAlive) {
            if (!ent || !ent.alive) continue;
            const d = Math.hypot(ent.x - cx, ent.y - cy);
            if (d > this.toxicRadius) {
                ent.takeDamage(15 * dt);
            }
        }

        // Loot pickup
        for (const crate of this.lootCrates) {
            if (!crate.alive) continue;
            for (const ent of allAlive) {
                if (!ent || !ent.alive) continue;
                if (Math.hypot(crate.x - ent.x, crate.y - ent.y) < 20) {
                    crate.alive = false;
                    if (crate.type === 'hp') {
                        ent.hp = Math.min(ent.maxHp, ent.hp + crate.amount);
                    } else {
                        ent.attack = (ent.attack || 10) + Math.floor(crate.amount / 5);
                    }
                }
            }
        }

        // Check winner
        const surviving = allAlive.filter(e => e && e.alive);
        if (surviving.length <= 1) {
            const winner = surviving[0] === this.engine.player ? 0 : -1;
            return { finished: true, winner };
        }

        return null;
    }

    getContext() {
        return { modeId: 'last_survivor' };
    }

    getWinnerOnTimeout() {
        return this.engine.player && this.engine.player.alive ? 0 : 1;
    }

    draw(ctx) {
        const cx = this.engine.width / 2;
        const cy = this.engine.height / 2;

        // Draw toxic cloud ring
        ctx.save();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, this.toxicRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Fog outside
        ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
        ctx.beginPath();
        ctx.rect(0, 0, this.engine.width, this.engine.height);
        ctx.arc(cx, cy, this.toxicRadius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();

        // Loot crates
        for (const crate of this.lootCrates) {
            if (!crate.alive) continue;
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.fillText(crate.type === 'hp' ? '❤️' : '⚔️', crate.x, crate.y);
        }

        // Alive count
        const alive = [this.engine.player, ...this.engine.entities.filter(e => e.type === 'bot' && e.alive)].filter(e => e && e.alive).length;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`👤 ${alive} restants`, this.engine.width - 10, 50);
    }
}
