/* ============================
   DROPER — Sprite Renderer (Canvas Vectoriel Animé)
   ============================ */

// Animations frame-by-frame via shapes vectoriels
// Chaque sprite a des états : idle, move, shoot, death

const TWO_PI = Math.PI * 2;

export class SpriteRenderer {
    constructor() {
        this.time = 0;
    }

    update(dt) {
        this.time += dt;
    }

    // === JOUEUR ===
    drawPlayer(ctx, x, y, angle, state = 'idle', color = '#4a9eff') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const pulse = 1 + Math.sin(this.time * 4) * 0.03;
        const breathe = Math.sin(this.time * 2) * 1.5;

        // Thruster glow
        const thrusterFlicker = 0.5 + Math.random() * 0.3;
        ctx.fillStyle = `rgba(74, 158, 255, ${thrusterFlicker * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(-14, 0, 6 + Math.random() * 3, 4, 0, 0, TWO_PI);
        ctx.fill();

        // Wings
        ctx.fillStyle = shadeColor(color, -20);
        ctx.beginPath();
        ctx.moveTo(-8, -14 * pulse);
        ctx.lineTo(4, -8);
        ctx.lineTo(-2, 0);
        ctx.lineTo(4, 8);
        ctx.moveTo(-8, 14 * pulse);
        ctx.lineTo(4, 8);
        ctx.fill();

        // Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, -10 + breathe);
        ctx.quadraticCurveTo(-14, 0, -10, 10 - breathe);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.ellipse(4, 0, 5, 3.5, 0, 0, TWO_PI);
        ctx.fill();

        // Cannon
        ctx.fillStyle = '#c8d0e0';
        ctx.fillRect(12, -2.5, 12, 5);
        ctx.fillStyle = '#e8ecf4';
        ctx.fillRect(22, -1.5, 3, 3);

        // Shooting flash
        if (state === 'shoot') {
            ctx.fillStyle = `rgba(255, 255, 200, ${0.5 + Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(26, 0, 3 + Math.random() * 2, 0, TWO_PI);
            ctx.fill();
        }

        // Shield glow outline
        ctx.strokeStyle = `rgba(74, 158, 255, ${0.15 + Math.sin(this.time * 3) * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, TWO_PI);
        ctx.stroke();

        ctx.restore();
    }

    // === ENNEMIS ===
    drawEnemy(ctx, x, y, typeId, size, color, state = 'idle') {
        ctx.save();
        ctx.translate(x, y);

        const wobble = Math.sin(this.time * 4 + x * 0.1) * 0.06;
        const scale = 1 + wobble;
        ctx.scale(scale, scale);

        const s = size / 2;

        switch (typeId) {
            case 'basic':
                this.drawBasicEnemy(ctx, s, color);
                break;
            case 'fast':
                this.drawFastEnemy(ctx, s, color);
                break;
            case 'heavy':
                this.drawHeavyEnemy(ctx, s, color);
                break;
            case 'boss':
                this.drawBossEnemy(ctx, s, color);
                break;
            default:
                this.drawBasicEnemy(ctx, s, color);
        }

        if (state === 'death') {
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(0, 0, s, 0, TWO_PI);
            ctx.fill();
        }

        ctx.restore();
    }

    drawBasicEnemy(ctx, s, color) {
        // Body — pulsing circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, TWO_PI);
        ctx.fill();

        // Inner ring
        ctx.strokeStyle = shadeColor(color, 30);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.6, 0, TWO_PI);
        ctx.stroke();

        // Eyes
        this.drawEyes(ctx, s);

        // Spikes
        ctx.strokeStyle = shadeColor(color, -30);
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
            const a = (TWO_PI / 6) * i + this.time * 0.5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            ctx.lineTo(Math.cos(a) * (s + 4), Math.sin(a) * (s + 4));
            ctx.stroke();
        }
    }

    drawFastEnemy(ctx, s, color) {
        // Diamond body
        const stretch = 1.2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -s * stretch);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s * stretch);
        ctx.lineTo(-s, 0);
        ctx.closePath();
        ctx.fill();

        // Speed lines
        ctx.strokeStyle = `rgba(255,255,255,0.2)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const offset = (-10 - i * 6) + (this.time * 40 % 20);
            ctx.beginPath();
            ctx.moveTo(-s - 5 + offset, -3 + i * 3);
            ctx.lineTo(-s - 12 + offset, -3 + i * 3);
            ctx.stroke();
        }

        // Eyes
        this.drawEyes(ctx, s * 0.7);
    }

    drawHeavyEnemy(ctx, s, color) {
        // Rounded square
        const r = 5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-s, -s, s * 2, s * 2, r);
        ctx.fill();

        // Armor plates
        ctx.strokeStyle = shadeColor(color, -20);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-s + 4, -s);
        ctx.lineTo(-s + 4, s);
        ctx.moveTo(s - 4, -s);
        ctx.lineTo(s - 4, s);
        ctx.stroke();

        // Cross pattern
        ctx.strokeStyle = `rgba(255,255,255,0.1)`;
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();

        // Eyes — angry
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-s * 0.4, -s * 0.2, s * 0.3, s * 0.15);
        ctx.fillRect(s * 0.15, -s * 0.2, s * 0.3, s * 0.15);
    }

    drawBossEnemy(ctx, s, color) {
        // Hexagon
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6 + this.time * 0.2;
            const px = Math.cos(a) * s;
            const py = Math.sin(a) * s;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner hexagon
        ctx.strokeStyle = shadeColor(color, 30);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6 + this.time * 0.2;
            const px = Math.cos(a) * s * 0.5;
            const py = Math.sin(a) * s * 0.5;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Boss eye — large centered
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.2, 0, TWO_PI);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,0.8)`;
        ctx.beginPath();
        ctx.arc(Math.cos(this.time) * 2, Math.sin(this.time) * 2, s * 0.08, 0, TWO_PI);
        ctx.fill();
    }

    drawEyes(ctx, s) {
        const eyeSize = Math.max(2, s * 0.2);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(-s * 0.3, -s * 0.15, eyeSize, 0, TWO_PI);
        ctx.arc(s * 0.3, -s * 0.15, eyeSize, 0, TWO_PI);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(-s * 0.28, -s * 0.18, eyeSize * 0.4, 0, TWO_PI);
        ctx.arc(s * 0.32, -s * 0.18, eyeSize * 0.4, 0, TWO_PI);
        ctx.fill();
    }
}

function shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
