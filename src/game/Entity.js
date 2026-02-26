/* ============================
   DROPER — Classe Entity
   ============================ */

export class Entity {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 24;
        this.height = options.height || 24;
        this.speedX = options.speedX || 0;
        this.speedY = options.speedY || 0;
        this.hp = options.hp || 100;
        this.maxHp = options.maxHp || this.hp;
        this.attack = options.attack || 10;
        this.defense = options.defense || 5;
        this.color = options.color || '#4a9eff';
        this.emoji = options.emoji || '⬜';
        this.alive = true;
        this.type = options.type || 'generic'; // 'player', 'enemy', 'projectile'
    }

    update(dt, engine) {
        // Mouvement de base
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;

        // Vérifier la mort
        if (this.hp <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        // Corps
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        // Emoji au centre
        ctx.font = `${Math.min(this.width, this.height) * 0.7}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);

        // Barre de vie (si pas à plein)
        if (this.hp < this.maxHp) {
            const barWidth = this.width + 4;
            const barHeight = 4;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.height / 2 - 8;

            ctx.fillStyle = '#1a2236';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const hpPercent = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#f59e0b' : '#ef4444';
            ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        }
    }

    takeDamage(amount) {
        const reduced = Math.max(1, amount - this.defense * 0.3);
        this.hp -= reduced;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
        return reduced;
    }

    collidesWith(other) {
        return (
            this.x - this.width / 2 < other.x + other.width / 2 &&
            this.x + this.width / 2 > other.x - other.width / 2 &&
            this.y - this.height / 2 < other.y + other.height / 2 &&
            this.y + this.height / 2 > other.y - other.height / 2
        );
    }

    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
