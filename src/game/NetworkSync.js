/* ============================
   DROPER — Network Sync (v0.9.7-beta)
   Interpolation, Extrapolation, Jitter Buffer, Snapback
   ============================ */

const SYNC_CONFIG = {
    interpolationDelay: 100,   // ms
    extrapolationTimeout: 200, // ms — prédire au-delà de ce seuil
    extrapolationMax: 500,     // ms — ne jamais extrapoler plus loin
    snapbackThreshold: 250,    // pixels — ignorer les téléportations
    jitterBufferSize: 5,       // nombre de samples pour lisser
    staleTimeout: 5000,        // ms — marquer mort si plus de données
};

export class NetworkSync {
    constructor(app) {
        this.app = app;
        this.remotePlayers = new Map();
        this.socket = null;
        this.lastSendTime = 0;
    }

    connect() {
        if (typeof io !== 'undefined') {
            const player = this.app.playerManager;
            const hero = this.app.heroManager.getFullHero(player.selectedHero);

            this.socket = io('http://localhost:3000');

            this.socket.on('connect', () => {
                console.log('🔗 WebSocket connecté !');
                this.socket.emit('join_game', {
                    hp: hero ? hero.stats.hp : 100,
                    maxHp: hero ? hero.stats.hp : 100,
                    color: hero ? hero.glowColor : '#ffffff',
                    alive: true,
                    username: player.username
                });
            });

            this.socket.on('game_state', (players) => {
                players.forEach(p => this.updateRemotePlayer(p.id, p));
            });

            this.socket.on('player_joined', (p) => {
                this.updateRemotePlayer(p.id, p);
            });

            this.socket.on('player_moved', (data) => {
                this.updateRemotePlayer(data.id, data);
            });

            this.socket.on('player_left', (id) => {
                this.removeRemotePlayer(id);
            });
        }
    }

    sendLocalState(playerEntity) {
        if (!this.socket || !this.socket.connected || !playerEntity) return;

        const now = Date.now();
        if (now - this.lastSendTime > 50) { // Limit to 20 updates per second
            this.socket.emit('player_move', {
                x: playerEntity.x,
                y: playerEntity.y,
                angle: playerEntity.angle,
                hp: playerEntity.hp,
                alive: playerEntity.alive
            });
            this.lastSendTime = now;
        }
    }

    updateRemotePlayer(playerId, data) {
        if (!this.remotePlayers.has(playerId)) {
            this.remotePlayers.set(playerId, {
                x: data.x, y: data.y, angle: data.angle || 0,
                targetX: data.x, targetY: data.y, targetAngle: data.angle || 0,
                vx: 0, vy: 0, // Vélocité estimée
                hp: data.hp || 100, maxHp: data.maxHp || 100,
                alive: true, color: data.color || '#ef4444',
                lastUpdate: Date.now(),
                jitterBuffer: [], // Buffer de latences
                latency: 0,
            });
        } else {
            const rp = this.remotePlayers.get(playerId);
            const now = Date.now();
            const timeDelta = (now - rp.lastUpdate) / 1000;

            // --- Snapback Protection ---
            const dx = data.x - rp.targetX;
            const dy = data.y - rp.targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > SYNC_CONFIG.snapbackThreshold) {
                // Téléportation détectée — ignorer cet update, ou snap directement
                console.warn(`🌐 Snapback: ${playerId} téléporté de ${dist.toFixed(0)}px — ignoré.`);
                rp.lastUpdate = now;
                return;
            }

            // Estimer la vélocité
            if (timeDelta > 0) {
                rp.vx = dx / timeDelta;
                rp.vy = dy / timeDelta;
            }

            rp.targetX = data.x;
            rp.targetY = data.y;
            rp.targetAngle = data.angle || rp.targetAngle;
            if (data.hp != null) rp.hp = data.hp;
            if (data.alive != null) rp.alive = data.alive;

            // --- Jitter Buffer ---
            const latencySample = now - rp.lastUpdate;
            rp.jitterBuffer.push(latencySample);
            if (rp.jitterBuffer.length > SYNC_CONFIG.jitterBufferSize) {
                rp.jitterBuffer.shift();
            }
            rp.latency = rp.jitterBuffer.reduce((a, b) => a + b, 0) / rp.jitterBuffer.length;

            rp.lastUpdate = now;
        }
    }

    removeRemotePlayer(playerId) {
        this.remotePlayers.delete(playerId);
    }

    update(dt) {
        const now = Date.now();
        const lerpSpeed = 10;

        for (const [id, rp] of this.remotePlayers) {
            const timeSinceUpdate = now - rp.lastUpdate;

            // --- Extrapolation ---
            if (timeSinceUpdate > SYNC_CONFIG.extrapolationTimeout &&
                timeSinceUpdate < SYNC_CONFIG.extrapolationMax) {
                // Prédire la position via la vélocité estimée
                const extraDt = dt;
                rp.targetX += rp.vx * extraDt;
                rp.targetY += rp.vy * extraDt;
            }

            // Interpolate position (lissé par le jitter buffer)
            const adaptiveLerp = lerpSpeed * (1 + Math.min(rp.latency / 200, 1));
            rp.x += (rp.targetX - rp.x) * adaptiveLerp * dt;
            rp.y += (rp.targetY - rp.y) * adaptiveLerp * dt;

            // Lerp angle
            let angleDiff = rp.targetAngle - rp.angle;
            if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            rp.angle += angleDiff * adaptiveLerp * dt;

            // Timeout: remove stale players
            if (timeSinceUpdate > SYNC_CONFIG.staleTimeout) {
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

            // Name + Latency indicator
            ctx.fillStyle = '#ffffff';
            ctx.font = '8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(id, rp.x, rp.y - s - 12);

            // Ping indicator (colored dot)
            const pingColor = rp.latency < 80 ? '#22c55e' : rp.latency < 150 ? '#fbbf24' : '#ef4444';
            ctx.fillStyle = pingColor;
            ctx.beginPath();
            ctx.arc(rp.x + 15, rp.y - s - 10, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getRemotePlayers() {
        return Array.from(this.remotePlayers.values()).filter(rp => rp.alive);
    }

    clear() {
        this.remotePlayers.clear();
    }
}

