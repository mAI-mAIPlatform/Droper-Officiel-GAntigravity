/* ============================
   DROPER — Enemy Entity (v1.1.0 — IA Avancée)
   ============================ */

import { Entity } from './Entity.js';
import { Projectile } from './Projectile.js';

const ENEMY_TYPES = {
    basic: {
        name: 'Basic', color: '#ef4444', hp: 35, attack: 8, speed: 48,
        width: 22, height: 22, xp: 10, coins: 5,
        shootRate: 2.0, shootRange: 250, bulletSpeed: 180, bulletDamage: 6,
        behavior: 'approach_shoot',
    },
    fast: {
        name: 'Fast', color: '#f59e0b', hp: 20, attack: 6, speed: 90,
        width: 18, height: 18, xp: 15, coins: 8,
        shootRate: 1.5, shootRange: 200, bulletSpeed: 250, bulletDamage: 4,
        behavior: 'strafe',
    },
    heavy: {
        name: 'Heavy', color: '#8b5cf6', hp: 120, attack: 15, speed: 30,
        width: 30, height: 30, xp: 25, coins: 15,
        shootRate: 3.0, shootRange: 300, bulletSpeed: 140, bulletDamage: 12,
        behavior: 'tank',
    },
    boss: {
        name: 'Boss', color: '#dc2626', hp: 450, attack: 25, speed: 22,
        width: 44, height: 44, xp: 100, coins: 50,
        shootRate: 1.2, shootRange: 400, bulletSpeed: 200, bulletDamage: 15,
        behavior: 'boss',
    },
    mega_boss: {
        name: 'Méga-Boss', color: '#7c3aed', hp: 3000, attack: 40, speed: 20,
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
                this.behaviorApproach(dt, nx, ny, dist, engine);
                break;
            case 'strafe':
                this.behaviorStrafe(dt, nx, ny, dist, player, engine);
                break;
            case 'tank':
                this.behaviorTank(dt, nx, ny, dist, engine);
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

    behaviorApproach(dt, nx, ny, dist, engine) {
        if (dist > this.preferredDist) {
            this.moveToward(dt, engine.player.x, engine.player.y, engine);
        } else if (dist < this.preferredDist * 0.5) {
            this.moveToward(dt, this.x - nx * 100, this.y - ny * 100, engine, 0.5);
        } else {
            const tx = this.x + Math.sin(this.wobble * 0.5) * 50;
            const ty = this.y + Math.cos(this.wobble * 0.5) * 50;
            this.moveToward(dt, tx, ty, engine, 0.2);
        }
    }

    behaviorStrafe(dt, nx, ny, dist, player, engine) {
        this.strafeAngle += this.strafeDir * dt * 1.5;
        const targetX = player.x + Math.cos(this.strafeAngle) * this.preferredDist;
        const targetY = player.y + Math.sin(this.strafeAngle) * this.preferredDist;
        this.moveToward(dt, targetX, targetY, engine);
        if (Math.random() < 0.003) this.strafeDir *= -1;
    }

    behaviorTank(dt, nx, ny, dist, engine) {
        if (dist > this.preferredDist) {
            this.moveToward(dt, engine.player.x, engine.player.y, engine);
        }
    }

    behaviorBoss(dt, nx, ny, dist, player, engine) {
        this.bossTimer += dt;
        if (this.bossTimer > 5) {
            this.bossTimer = 0;
            this.bossPhase = (this.bossPhase + 1) % 3;
        }

        switch (this.bossPhase) {
            case 0: // Approach
                if (dist > 120) {
                    this.moveToward(dt, player.x, player.y, engine, 1.5);
                }
                break;
            case 1: // Circle
                this.strafeAngle += dt * 0.8;
                const tx = player.x + Math.cos(this.strafeAngle) * 200;
                const ty = player.y + Math.sin(this.strafeAngle) * 200;
                this.moveToward(dt, tx, ty, engine);
                break;
            case 2: // Retreat
                if (dist < 250) {
                    this.moveToward(dt, this.x - nx * 100, this.y - ny * 100, engine);
                }
                break;
        }

        if (this.shootCooldown <= 0 && this.bossPhase === 2) {
            for (let i = -1; i <= 1; i++) {
                const spread = i * 0.3;
                const bx = nx * Math.cos(spread) - ny * Math.sin(spread);
                const by = nx * Math.sin(spread) + ny * Math.cos(spread);
                this.shootBullet(engine, bx, by);
            }
            this.shootCooldown = this.shootRate;
        }
    }

    moveToward(dt, tx, ty, engine, speedMult = 1) {
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        let nx = dx / dist;
        let ny = dy / dist;
        const speed = this.speed * speedMult;

        if (this.isBlocking(this.x + nx * speed * dt, this.y + ny * speed * dt, engine)) {
            let found = false;
            for (let i = 1; i <= 8; i++) {
                const angle = (i * 30) * (Math.PI / 180);
                let rx = nx * Math.cos(angle) - ny * Math.sin(angle);
                let ry = nx * Math.sin(angle) + ny * Math.cos(angle);
                if (!this.isBlocking(this.x + rx * speed * dt, this.y + ry * speed * dt, engine)) {
                    nx = rx; ny = ry; found = true; break;
                }
                rx = nx * Math.cos(-angle) - ny * Math.sin(-angle);
                ry = nx * Math.sin(-angle) + ny * Math.cos(-angle);
                if (!this.isBlocking(this.x + rx * speed * dt, this.y + ry * speed * dt, engine)) {
                    nx = rx; ny = ry; found = true; break;
                }
            }
            if (!found) return;
        }

        this.x += nx * speed * dt;
        this.y += ny * speed * dt;
    }

    isBlocking(tx, ty, engine) {
        for (const wall of engine.walls) {
            if (tx + this.width / 2 > wall.x && tx - this.width / 2 < wall.x + wall.w &&
                ty + this.height / 2 > wall.y && ty - this.height / 2 < wall.y + wall.h) {
                return true;
            }
        }
        return false;
    }

    shoot(engine, nx, ny) {
        this.shootBullet(engine, nx, ny);
        if (engine.audioManager) engine.audioManager.playShoot(this.x, this.y);
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
        engine.addEntity(bullet);
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
