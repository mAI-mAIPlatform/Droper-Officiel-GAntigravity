/* ============================
   DROPER — Particle System
   ============================ */

class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || (Math.random() - 0.5) * 200;
        this.vy = options.vy || (Math.random() - 0.5) * 200;
        this.size = options.size || 3;
        this.color = options.color || '#4a9eff';
        this.lifetime = options.lifetime || 0.5;
        this.maxLifetime = this.lifetime;
        this.alive = true;
        this.friction = options.friction || 0.95;
        this.gravity = options.gravity || 0;
        this.shrink = options.shrink !== false;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity * dt;
        this.lifetime -= dt;
        if (this.lifetime <= 0) this.alive = false;
    }

    draw(ctx) {
        if (!this.alive) return;
        const alpha = Math.max(0, this.lifetime / this.maxLifetime);
        const size = this.shrink ? this.size * alpha : this.size;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(dt) {
        for (const p of this.particles) {
            p.update(dt);
        }
        this.particles = this.particles.filter(p => p.alive);
    }

    draw(ctx) {
        for (const p of this.particles) {
            p.draw(ctx);
        }
    }

    spawnImpact(x, y, color = '#4a9eff') {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 120;
            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2,
                color,
                lifetime: 0.2 + Math.random() * 0.2,
                friction: 0.92,
            }));
        }
    }

    spawnImpactParticles(x, y, color = '#ffffff') {
        // Étincelles plus vives
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 150 + Math.random() * 250;
            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 2,
                color,
                lifetime: 0.15 + Math.random() * 0.15,
                friction: 0.85,
                gravity: 500, // Gravité pour l'effet étincelle
            }));
        }
    }

    spawnExplosion(x, y, color = '#ef4444') {
        // Cercle de particules
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 200;
            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                color,
                lifetime: 0.3 + Math.random() * 0.3,
                friction: 0.9,
            }));
        }

        // Flash blanc au centre
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(x, y, {
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 60,
                size: 6 + Math.random() * 4,
                color: '#ffffff',
                lifetime: 0.15,
                friction: 0.9,
            }));
        }
    }

    spawnMuzzleFlash(x, y, angle, color = '#4a9eff') {
        for (let i = 0; i < 4; i++) {
            const spread = (Math.random() - 0.5) * 0.6;
            const speed = 100 + Math.random() * 80;
            this.particles.push(new Particle(x, y, {
                vx: Math.cos(angle + spread) * speed,
                vy: Math.sin(angle + spread) * speed,
                size: 2 + Math.random() * 2,
                color,
                lifetime: 0.08 + Math.random() * 0.06,
                friction: 0.88,
            }));
        }
    }

    spawnTrail(x, y, color = 'rgba(74, 158, 255, 0.5)') {
        this.particles.push(new Particle(x, y, {
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            size: 1.5,
            color,
            lifetime: 0.15,
            friction: 0.98,
        }));
    }

    spawnUltimateCharge(x, y, color = '#00f7ff') {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        const tx = x + Math.cos(angle) * dist;
        const ty = y + Math.sin(angle) * dist;
        this.particles.push(new Particle(tx, ty, {
            vx: (x - tx) * 5,
            vy: (y - ty) * 5,
            size: 2,
            color,
            lifetime: 0.3,
            friction: 0.9,
            shrink: true
        }));
    }

    spawnDashTrail(x, y, color = '#10b981') {
        for (let i = 0; i < 3; i++) {
            this.particles.push(new Particle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, {
                vx: (Math.random() - 0.5) * 50,
                vy: (Math.random() - 0.5) * 50,
                size: 3 + Math.random() * 2,
                color,
                lifetime: 0.4,
                friction: 0.95,
                shrink: true
            }));
        }
    }

    clear() {
        this.particles = [];
    }

    get count() {
        return this.particles.length;
    }
}
