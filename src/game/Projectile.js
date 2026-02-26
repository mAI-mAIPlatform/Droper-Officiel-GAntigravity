/* ============================
   DROPER — Projectile Entity
   ============================ */

import { Entity } from './Entity.js';

export class Projectile extends Entity {
    constructor(options) {
        super({
            x: options.x,
            y: options.y,
            width: 6,
            height: 6,
            type: 'projectile',
            color: options.owner === 'player' ? '#4a9eff' : '#ef4444',
        });

        this.angle = options.angle || 0;
        this.speed = options.speed || 600;
        this.damage = options.damage || 10;
        this.owner = options.owner || 'player';
        this.lifetime = 2.0; // secondes
        this.trail = [];
        this.maxTrailLength = 6;
    }

    update(dt, engine) {
        // Enregistrer la position pour le trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Mouvement
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;

        // Durée de vie
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.alive = false;
            return;
        }

        // Sortie de l'écran
        if (this.x < -20 || this.x > engine.width + 20 ||
            this.y < -20 || this.y > engine.height + 20) {
            this.alive = false;
            return;
        }

        // Collision avec ennemis (tir du joueur ou bot allié)
        if (this.owner === 'player' || this.owner === 'Botally') {
            for (const entity of engine.entities) {
                if ((entity.type === 'enemy' || (entity.type === 'bot' && entity.teamId !== this.teamId)) && entity.alive && this.collidesWith(entity)) {
                    entity.takeDamage(this.damage);
                    this.alive = false;

                    if (engine.particles) {
                        engine.particles.spawnImpact(this.x, this.y, this.color);
                    }
                    if (engine.audioManager) {
                        engine.audioManager.playHit();
                    }

                    if (!entity.alive) {
                        if (engine.audioManager) engine.audioManager.playEnemyDeath();
                        if (engine.particles) engine.particles.spawnExplosion(entity.x, entity.y, entity.color);
                        engine.onEnemyKilled(entity);
                    }
                    break;
                }
            }
        }

        // Collision avec le joueur (tir ennemi)
        if (this.owner === 'enemy' && engine.player && engine.player.alive) {
            if (this.collidesWith(engine.player)) {
                engine.player.takeDamage(this.damage);
                this.alive = false;

                if (engine.particles) {
                    engine.particles.spawnImpact(this.x, this.y, '#ef4444');
                }
                if (engine.audioManager) {
                    engine.audioManager.playHit();
                }
            }
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        // Trail lumineux
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const alpha = (i / this.trail.length) * 0.4;
            const size = 2 + (i / this.trail.length) * 2;
            ctx.fillStyle = this.owner === 'player'
                ? `rgba(74, 158, 255, ${alpha})`
                : `rgba(239, 68, 68, ${alpha})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Projectile principal
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
