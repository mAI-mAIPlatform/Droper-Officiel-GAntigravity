/* ============================
   DROPER — Map Renderer (obstacles, murs, décors)
   ============================ */

export class MapRenderer {
    constructor(mapData) {
        this.map = mapData;
        this.obstacles = mapData ? mapData.obstacles : [];
    }

    setMap(mapData) {
        this.map = mapData;
        this.obstacles = mapData ? mapData.obstacles : [];
    }

    getWidth() { return this.map ? this.map.width : 1200; }
    getHeight() { return this.map ? this.map.height : 800; }

    // Check collision with obstacles
    collidesWithObstacle(x, y, w, h) {
        for (const obs of this.obstacles) {
            if (x + w / 2 > obs.x && x - w / 2 < obs.x + obs.w &&
                y + h / 2 > obs.y && y - h / 2 < obs.y + obs.h) {
                return obs;
            }
        }
        return null;
    }

    // Push entity out of obstacles
    resolveCollision(entity) {
        for (const obs of this.obstacles) {
            const ex = entity.x, ey = entity.y;
            const ew = entity.width / 2, eh = entity.height / 2;

            if (ex + ew > obs.x && ex - ew < obs.x + obs.w &&
                ey + eh > obs.y && ey - eh < obs.y + obs.h) {
                // Find smallest push-out
                const pushLeft = (ex + ew) - obs.x;
                const pushRight = (obs.x + obs.w) - (ex - ew);
                const pushUp = (ey + eh) - obs.y;
                const pushDown = (obs.y + obs.h) - (ey - eh);

                const min = Math.min(pushLeft, pushRight, pushUp, pushDown);
                if (min === pushLeft) entity.x -= pushLeft;
                else if (min === pushRight) entity.x += pushRight;
                else if (min === pushUp) entity.y -= pushUp;
                else entity.y += pushDown;
            }
        }
    }

    // Check if projectile hits an obstacle
    projectileHitsObstacle(x, y) {
        for (const obs of this.obstacles) {
            if (x >= obs.x && x <= obs.x + obs.w && y >= obs.y && y <= obs.y + obs.h) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        if (!this.map) return;

        // Map border
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.map.width, this.map.height);

        // Obstacles
        for (const obs of this.obstacles) {
            if (obs.type === 'wall') {
                // Mur — couleur néon
                ctx.fillStyle = 'rgba(74, 158, 255, 0.3)';
                ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.strokeStyle = '#4a9eff';
                ctx.lineWidth = 1;
                ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

                // Glow effect
                ctx.shadowColor = '#4a9eff';
                ctx.shadowBlur = 6;
                ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
                ctx.shadowBlur = 0;
            } else if (obs.type === 'block') {
                // Bloc — solide
                ctx.fillStyle = 'rgba(139, 149, 168, 0.3)';
                ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.strokeStyle = 'rgba(139, 149, 168, 0.6)';
                ctx.lineWidth = 1;
                ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

                // Cross pattern
                ctx.strokeStyle = 'rgba(139, 149, 168, 0.15)';
                ctx.beginPath();
                ctx.moveTo(obs.x, obs.y);
                ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
                ctx.moveTo(obs.x + obs.w, obs.y);
                ctx.lineTo(obs.x, obs.y + obs.h);
                ctx.stroke();
            }
        }

        // Map name label
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`🗺️ ${this.map.name}`, this.map.width - 10, this.map.height - 8);
    }

    getSpawnPoints(teamId) {
        if (!this.map || !this.map.spawns) return [{ x: 100, y: 100 }];
        return this.map.spawns[teamId] || this.map.spawns.solo || [{ x: 100, y: 100 }];
    }
}
