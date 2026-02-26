/* ============================
   DROPER — Payload Entity 🚚
   ============================ */

export class Payload {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.speed = 40;
        this.progress = 0; // 0 to 1
        this.alive = true;
        this.type = 'payload';
        this.controllingTeam = -1; // -1: none, 0: player team, 1: enemy team
        this.color = '#f59e0b';
    }

    update(dt, engine) {
        // Détecter les joueurs proches
        const range = 100;
        let pNear = 0;
        let eNear = 0;

        engine.entities.forEach(ent => {
            if (ent.alive && (ent.type === 'player' || ent.type === 'bot')) {
                const d = Math.hypot(ent.x - this.x, ent.y - this.y);
                if (d < range) {
                    if (ent.teamId === 0) pNear++;
                    else eNear++;
                }
            }
        });

        if (pNear > 0 && eNear === 0) {
            this.progress += (this.speed * dt) / engine.width;
            this.x += this.speed * dt;
        } else if (eNear > 0 && pNear === 0) {
            this.progress -= (this.speed * dt) / engine.width;
            this.x -= this.speed * dt;
        }

        this.progress = Math.max(0, Math.min(1, this.progress));
        this.controllingTeam = (pNear > 0 && eNear === 0) ? 0 : (eNear > 0 && pNear === 0) ? 1 : -1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Corps du convoi
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Détails
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, 15, 10);

        // Roues
        ctx.fillStyle = '#111';
        ctx.shadowBlur = 0;
        ctx.fillRect(-this.width / 2 + 5, this.height / 2 - 5, 10, 10);
        ctx.fillRect(this.width / 2 - 15, this.height / 2 - 5, 10, 10);
        ctx.fillRect(-this.width / 2 + 5, -this.height / 2 - 5, 10, 10);
        ctx.fillRect(this.width / 2 - 15, -this.height / 2 - 5, 10, 10);

        // Barre de progression au-dessus
        ctx.restore();

        const barW = 100;
        const barH = 6;
        const barX = this.x - barW / 2;
        const barY = this.y - 40;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX, barY, barW, barH);

        ctx.fillStyle = this.controllingTeam === 0 ? '#4a9eff' : this.controllingTeam === 1 ? '#ef4444' : '#666';
        ctx.fillRect(barX, barY, barW * this.progress, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
    }
}
