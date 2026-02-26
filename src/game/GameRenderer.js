/* ============================
   DROPER — Game Renderer
   ============================ */

export class GameRenderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    clear(color = '#0a0e1a') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGrid(spacing = 40, color = 'rgba(74, 158, 255, 0.05)') {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        for (let x = 0; x <= this.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }

    drawCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawText(text, x, y, options = {}) {
        const ctx = this.ctx;
        ctx.fillStyle = options.color || '#e8ecf4';
        ctx.font = options.font || '14px Outfit, sans-serif';
        ctx.textAlign = options.align || 'left';
        ctx.textBaseline = options.baseline || 'top';
        ctx.fillText(text, x, y);
    }

    drawHealthBar(x, y, width, height, current, max, bgColor = '#1a2236', fillColor = '#22c55e') {
        // Fond
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y, width, height);

        // Remplissage
        const percent = Math.max(0, Math.min(current / max, 1));
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(x, y, width * percent, height);

        // Bordure
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}
