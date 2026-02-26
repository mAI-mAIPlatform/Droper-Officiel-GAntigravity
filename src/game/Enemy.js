/* ============================
   DROPER — Enemy Entity (v0.0.4 — IA intelligente)
   ============================ */

import { Entity } from './Entity.js';
import { Projectile } from './Projectile.js';

const ENEMY_TYPES = {
    basic: {
        name: 'Basic', color: '#ef4444', hp: 40, attack: 8, speed: 64, // 80 * 0.8
        width: 22, height: 22, xp: 10, coins: 5,
        shootRate: 2.0, shootRange: 250, bulletSpeed: 180, bulletDamage: 6,
        behavior: 'approach_shoot',
    },
    fast: {
        name: 'Fast', color: '#f59e0b', hp: 25, attack: 6, speed: 128, // 160 * 0.8
        width: 18, height: 18, xp: 15, coins: 8,
        shootRate: 1.5, shootRange: 200, bulletSpeed: 250, bulletDamage: 4,
        behavior: 'strafe',
    },
    heavy: {
        name: 'Heavy', color: '#8b5cf6', hp: 120, attack: 15, speed: 36, // 45 * 0.8
        width: 30, height: 30, xp: 25, coins: 15,
        shootRate: 3.0, shootRange: 300, bulletSpeed: 140, bulletDamage: 12,
        behavior: 'tank',
    },
    boss: {
        name: 'Boss', color: '#dc2626', hp: 500, attack: 25, speed: 28, // 35 * 0.8
        width: 44, height: 44, xp: 100, coins: 50,
        shootRate: 1.2, shootRange: 400, bulletSpeed: 200, bulletDamage: 15,
        behavior: 'boss',
    },
    mega_boss: {
        name: 'Méga-Boss', color: '#7c3aed', hp: 3000, attack: 40, speed: 20, // 25 * 0.8
        width: 80, height: 80, xp: 500, coins: 250,
        shootRate: 0.8, shootRange: 500, bulletSpeed: 250, bulletDamage: 25,
        behavior: 'boss',
    },
};

export class Enemy extends Entity {
    constructor(typeId, x, y, waveMultiplier = 1) {
        const data = ENEMY_TYPES[typeId] || ENEMY_TYPES.basic;
        super({
            x, y,
            width: data.width, height: data.height,
            hp: Math.floor(data.hp * waveMultiplier),
            maxHp: Math.floor(data.hp * waveMultiplier),
            attack: Math.floor(data.attack * waveMultiplier),
            color: data.color, type: 'enemy',
        });

        this.typeId = typeId;
        this.data = data;
        this.speed = data.speed;
        this.xpReward = Math.floor(data.xp * waveMultiplier);
        this.coinReward = Math.floor(data.coins * waveMultiplier);
        this.wobble = 0;

        // Shooting
        this.shootCooldown = Math.random() * data.shootRate;
        this.shootRate = data.shootRate;
        this.shootRange = data.shootRange;
        this.bulletSpeed = data.bulletSpeed;
        this.bulletDamage = Math.floor(data.bulletDamage * waveMultiplier);
        this.behavior = data.behavior;

        // Strafe
        this.strafeAngle = Math.random() * Math.PI * 2;
        this.strafeDir = Math.random() < 0.5 ? 1 : -1;
        this.preferredDist = data.shootRange * 0.7;

        // Boss patterns
        this.bossPhase = 0;
        this.bossTimer = 0;
    }

    update(dt, engine) {
        if (!this.alive) return;

        const player = engine.player;
        if (!player || !player.alive) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;

        this.wobble += dt * 4;

        // Behavior-specific movement
        switch (this.behavior) {
            case 'approach_shoot':
                this.behaviorApproach(dt, nx, ny, dist);
                break;
            case 'strafe':
                this.behaviorStrafe(dt, nx, ny, dist, player);
                break;
            case 'tank':
                this.behaviorTank(dt, nx, ny, dist);
                break;
            case 'boss':
                this.behaviorBoss(dt, nx, ny, dist, player, engine);
                break;
        }

        // Clamp to canvas
        this.x = Math.max(this.width, Math.min(engine.width - this.width, this.x));
        this.y = Math.max(this.height, Math.min(engine.height - this.height, this.y));

        // Shooting
        this.shootCooldown -= dt;
        if (this.shootCooldown <= 0 && dist <= this.shootRange) {
            this.shoot(engine, nx, ny);
            this.shootCooldown = this.shootRate * (0.8 + Math.random() * 0.4);
        }
    }

    behaviorApproach(dt, nx, ny, dist) {
        // Approach to preferred distance, then hold position with slight drift
        if (dist > this.preferredDist) {
            this.x += nx * this.speed * dt;
            this.y += ny * this.speed * dt;
        } else if (dist < this.preferredDist * 0.5) {
            // Too close, back off
            this.x -= nx * this.speed * 0.5 * dt;
            this.y -= ny * this.speed * 0.5 * dt;
        } else {
            // Slight drift
            this.x += Math.sin(this.wobble * 0.5) * this.speed * 0.2 * dt;
            this.y += Math.cos(this.wobble * 0.5) * this.speed * 0.2 * dt;
        }
    }

    behaviorStrafe(dt, nx, ny, dist, player) {
        // Circle strafe around player
        this.strafeAngle += this.strafeDir * dt * 1.5;

        const targetDist = this.preferredDist;
        const targetX = player.x + Math.cos(this.strafeAngle) * targetDist;
        const targetY = player.y + Math.sin(this.strafeAngle) * targetDist;

        const tdx = targetX - this.x;
        const tdy = targetY - this.y;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy);

        if (tdist > 5) {
            this.x += (tdx / tdist) * this.speed * dt;
            this.y += (tdy / tdist) * this.speed * dt;
        }

        // Randomly change direction
        if (Math.random() < 0.003) this.strafeDir *= -1;
    }

    behaviorTank(dt, nx, ny, dist) {
        // Slow approach, holds ground at range
        if (dist > this.preferredDist) {
            this.x += nx * this.speed * dt;
            this.y += ny * this.speed * dt;
        }
        // Tanks don't retreat — they hold position
    }

    behaviorBoss(dt, nx, ny, dist, player, engine) {
        this.bossTimer += dt;

        // Phase switching every 5s
        if (this.bossTimer > 5) {
            this.bossTimer = 0;
            this.bossPhase = (this.bossPhase + 1) % 3;
        }

        switch (this.bossPhase) {
            case 0: // Approach
                if (dist > 120) {
                    this.x += nx * this.speed * 1.5 * dt;
                    this.y += ny * this.speed * 1.5 * dt;
                }
                break;
            case 1: // Circle
                this.strafeAngle += dt * 0.8;
                this.x = player.x + Math.cos(this.strafeAngle) * 200;
                this.y = player.y + Math.sin(this.strafeAngle) * 200;
                break;
            case 2: // Retreat & burst fire
                if (dist < 250) {
                    this.x -= nx * this.speed * dt;
                    this.y -= ny * this.speed * dt;
                }
                // Triple fire
                if (this.shootCooldown <= 0) {
                    for (let i = -1; i <= 1; i++) {
                        const spread = i * 0.3;
                        const bx = nx * Math.cos(spread) - ny * Math.sin(spread);
                        const by = nx * Math.sin(spread) + ny * Math.cos(spread);
                        this.shootBullet(engine, bx, by);
                    }
                    this.shootCooldown = this.shootRate;
                }
                break;
        }
    }

    shoot(engine, nx, ny) {
        this.shootBullet(engine, nx, ny);
        if (engine.audioManager) engine.audioManager.playShoot();
    }

    shootBullet(engine, dirX, dirY) {
        const bullet = new Projectile({
            x: this.x + dirX * (this.width / 2 + 5),
            y: this.y + dirY * (this.height / 2 + 5),
            angle: Math.atan2(dirY, dirX),
            speed: this.bulletSpeed,
            damage: this.bulletDamage,
            owner: 'enemy',
            color: this.color,
        });
        engine.entities.push(bullet);
    }

    draw(ctx, spriteRenderer) {
        if (!this.alive) return;

        if (spriteRenderer) {
            spriteRenderer.drawEnemy(ctx, this.x, this.y, this.typeId, this.width, this.color, 'idle');
        } else {
            const s = this.width / 2;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
            ctx.fill();
        }

        // Barre de vie
        if (this.hp < this.maxHp) {
            const barW = this.width + 6;
            const barH = 3;
            const barX = this.x - barW / 2;
            const barY = this.y - this.height / 2 - 8;

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(barX, barY, barW, barH);

            const pct = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
            ctx.fillRect(barX, barY, barW * pct, barH);
        }
    }
}

export { ENEMY_TYPES };
