/* ============================
   DROPER — Network Sync (interpolation & prédiction)
   ============================ */

export class NetworkSync {
    constructor() {
        this.remotePlayers = new Map();
        this.interpolationDelay = 100; // ms
    }

    updateRemotePlayer(playerId, data) {
        if (!this.remotePlayers.has(playerId)) {
            this.remotePlayers.set(playerId, {
                x: data.x, y: data.y, angle: data.angle || 0,
                targetX: data.x, targetY: data.y, targetAngle: data.angle || 0,
                hp: data.hp || 100, maxHp: data.maxHp || 100,
                alive: true, color: data.color || '#ef4444',
                lastUpdate: Date.now(),
            });
        } else {
            const rp = this.remotePlayers.get(playerId);
            rp.targetX = data.x;
            rp.targetY = data.y;
            rp.targetAngle = data.angle || rp.targetAngle;
            if (data.hp != null) rp.hp = data.hp;
            if (data.alive != null) rp.alive = data.alive;
            rp.lastUpdate = Date.now();
        }
    }

    removeRemotePlayer(playerId) {
        this.remotePlayers.delete(playerId);
    }

    update(dt) {
        const lerpSpeed = 10;
        for (const [id, rp] of this.remotePlayers) {
            // Interpolate position
            rp.x += (rp.targetX - rp.x) * lerpSpeed * dt;
            rp.y += (rp.targetY - rp.y) * lerpSpeed * dt;

            // Lerp angle
            let angleDiff = rp.targetAngle - rp.angle;
            if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            rp.angle += angleDiff * lerpSpeed * dt;

            // Timeout: remove stale players
            if (Date.now() - rp.lastUpdate > 5000) {
                rp.alive = false;
            }
        }
    }

    draw(ctx) {
        for (const [id, rp] of this.remotePlayers) {
            if (!rp.alive) continue;

            const s = 11;
            ctx.fillStyle = rp.color;
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, s, 0, Math.PI * 2);
            ctx.fill();

            // HP bar
            if (rp.hp < rp.maxHp) {
                const barW = 24;
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(rp.x - barW / 2, rp.y - s - 8, barW, 3);
                const pct = rp.hp / rp.maxHp;
                ctx.fillStyle = pct > 0.5 ? '#22c55e' : '#ef4444';
                ctx.fillRect(rp.x - barW / 2, rp.y - s - 8, barW * pct, 3);
            }

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(id, rp.x, rp.y - s - 12);
        }
    }

    getRemotePlayers() {
        return Array.from(this.remotePlayers.values()).filter(rp => rp.alive);
    }

    clear() {
        this.remotePlayers.clear();
    }
}
