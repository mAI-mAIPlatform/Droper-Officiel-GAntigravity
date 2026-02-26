/* ============================
   DROPER — Mode Prime Digitale 🎯 (3v3)
   ============================ */

export class PrimeDigitaleMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.primes = new Map(); // entityId → prime value
        this.starCounts = { 0: 0, 1: 0 };
    }

    init() {
        this.primes.clear();
        this.starCounts = { 0: 0, 1: 0 };
    }

    update(dt) {
        // Check for kills (detect dead entities)
        for (const entity of this.engine.entities) {
            if (entity.type !== 'bot' || entity.alive) continue;
            if (entity._primeProcessed) continue;

            entity._primeProcessed = true;

            // Who killed it? The other team gets stars
            const victimTeam = entity.teamId;
            const killerTeam = victimTeam === 0 ? 1 : 0;
            const prime = this.getPrime(entity);

            this.starCounts[killerTeam] += 1 + prime;
            this.teams.addScore(killerTeam, 1 + prime);

            // Reset victim's prime on respawn
            this.primes.delete(entity);
        }

        // Track player death
        if (this.engine.player && !this.engine.player.alive && !this.engine.player._primeProcessed) {
            this.engine.player._primeProcessed = true;
            const prime = this.getPrime(this.engine.player);
            this.starCounts[1] += 1 + prime;
            this.teams.addScore(1, 1 + prime);
        }

        // Reset processed flag on respawn
        for (const entity of this.engine.entities) {
            if (entity.alive && entity._primeProcessed) {
                entity._primeProcessed = false;
                this.primes.delete(entity);
            }
        }
        if (this.engine.player && this.engine.player.alive && this.engine.player._primeProcessed) {
            this.engine.player._primeProcessed = false;
        }

        return null;
    }

    getPrime(entity) {
        return this.primes.get(entity) || 0;
    }

    addKill(killer) {
        const current = this.primes.get(killer) || 0;
        this.primes.set(killer, current + 1);
    }

    getContext() {
        return { modeId: 'prime_digitale' };
    }

    getWinnerOnTimeout() {
        return this.starCounts[0] >= this.starCounts[1] ? 0 : 1;
    }

    draw(ctx) {
        // Show stars count
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`⭐ Bleue: ${this.starCounts[0]}  |  ⭐ Rouge: ${this.starCounts[1]}`,
            this.engine.width / 2, this.engine.height - 15);

        // Show prime above entities with kills
        for (const [entity, prime] of this.primes) {
            if (!entity.alive || prime === 0) continue;
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`🎯${prime}`, entity.x, entity.y - entity.width / 2 - 15);
        }
    }
}
