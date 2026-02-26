/* ============================
   DROPER — Player Entity
   ============================ */

import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor(heroData, x, y) {
        super({
            x, y,
            width: 32,
            height: 32,
            hp: heroData ? heroData.stats.hp : 100,
            maxHp: heroData ? heroData.stats.hp : 100,
            attack: heroData ? heroData.stats.attack : 15,
            defense: heroData ? heroData.stats.defense : 10,
            color: heroData?.bodyColor || '#4a9eff',
            type: 'player',
        });

        // Modificateurs Admin [NEW] v0.2.6
        const adminConfig = window.app?.adminManager?.config || {};
        if (adminConfig.doubleHP) {
            this.maxHp *= 2;
            this.hp = this.maxHp;
        }
        if (adminConfig.smallPlayer) {
            this.width *= 0.6;
            this.height *= 0.6;
        }

        this.hero = heroData;
        const baseSpeed = heroData ? heroData.stats.speed * 30 + 100 : 200;
        this.speed = baseSpeed * 0.6; // Reduced to 60% speed v0.3.0
        this.shootCooldown = 0;
        this.shootRate = 0.18;
        this.mouseX = 0;
        this.mouseY = 0;
        this.angle = 0;
        this.invincibleTimer = 0;

        this.ultimateCharge = 0;
        this.ultimateMax = heroData && heroData.ultimate ? heroData.ultimate.chargeRequired : 1000;
        this.ultimateReady = false;
        this.ultimateActive = false;
        this.ultimateTimer = 0;

        this.maxAmmo = 5;
        this.ammo = 5;
        this.reloadTimer = 0;
        this.isReloading = false;

        this.powerCharges = 3;
        this.powerTimer = 0;
        this.powerActive = false;
        this.chipsActive = false;
        this.chipsTimer = 0;

        this.activeBoosts = {
            damage: 1,
            speed: 1,
            shootRate: 1,
            reloadSpeed: 1,
            healthRegen: 0
        };
    }

    update(dt, engine) {
        let dx = 0, dy = 0;
        if (engine.isKeyDown('KeyW') || engine.isKeyDown('ArrowUp')) dy -= 1;
        if (engine.isKeyDown('KeyS') || engine.isKeyDown('ArrowDown')) dy += 1;
        if (engine.isKeyDown('KeyA') || engine.isKeyDown('ArrowLeft')) dx -= 1;
        if (engine.isKeyDown('KeyD') || engine.isKeyDown('ArrowRight')) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const norm = 1 / Math.sqrt(2);
            dx *= norm; dy *= norm;
        }

        const adminConfig = engine.app?.adminManager?.config || {};
        let finalSpeed = this.speed * this.activeBoosts.speed;
        if (adminConfig.playerSpeedBoost) finalSpeed *= adminConfig.playerSpeedBoost;

        this.x += dx * finalSpeed * dt;
        this.y += dy * finalSpeed * dt;

        this.x = Math.max(this.width / 2, Math.min(engine.width - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(engine.height - this.height / 2, this.y));

        this.angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);

        if (this.shootCooldown > 0) this.shootCooldown -= dt;

        if ((engine.isKeyDown('KeyR') || this.ammo <= 0) && this.ammo < this.maxAmmo) {
            this.isReloading = true;
        }

        if (this.isReloading || this.ammo < this.maxAmmo) {
            this.reloadTimer += dt * this.activeBoosts.reloadSpeed;
            if (this.reloadTimer >= 1.0) {
                this.ammo++;
                this.reloadTimer = 0;
                if (this.ammo === this.maxAmmo) this.isReloading = false;
            }
        }

        if (this.powerActive) {
            this.powerTimer -= dt;
            if (this.powerTimer <= 0) { this.powerActive = false; this.activeBoosts.damage = 1; }
        }

        if (this.chipsActive) {
            this.chipsTimer -= dt;
            if (this.chipsTimer <= 0) {
                this.chipsActive = false;
                this.activeBoosts.speed = 1;
                this.activeBoosts.shootRate = 1;
                this.activeBoosts.reloadSpeed = 1;
                this.activeBoosts.healthRegen = 0;
            }
            if (this.activeBoosts.healthRegen > 0) {
                this.hp = Math.min(this.maxHp, this.hp + this.activeBoosts.healthRegen * dt);
            }
        }

        if (this.ultimateActive) {
            this.ultimateTimer -= dt;
            if (this.ultimateTimer <= 0) {
                this.ultimateActive = false;
                const baseSpeed = this.hero ? this.hero.stats.speed * 30 + 100 : 200;
                this.speed = baseSpeed * 0.8;
            }
        }

        if (this.ultimateCharge >= this.ultimateMax) this.ultimateReady = true;
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    }

    canShoot() {
        return this.shootCooldown <= 0 && !this.isReloading && this.ammo > 0;
    }

    getShootRate() {
        let rate = this.shootRate / this.activeBoosts.shootRate;
        const adminConfig = window.app?.adminManager?.config || {};
        if (adminConfig.doubleFireRate) rate /= 2;
        return rate;
    }

    shoot() {
        if (!this.canShoot()) return null;
        this.shootCooldown = this.getShootRate();
        this.ammo--;
        return {
            x: this.x + Math.cos(this.angle) * 20,
            y: this.y + Math.sin(this.angle) * 20,
            angle: this.angle,
            damage: this.attack * this.activeBoosts.damage,
            speed: 600,
            owner: 'player',
        };
    }

    activatePower() {
        if (this.powerActive || this.powerCharges <= 0) return false;
        this.powerCharges--;
        this.powerActive = true;
        this.powerTimer = 5;
        this.activeBoosts.damage *= 2;
        return true;
    }

    activateChips() {
        if (this.chipsActive) return false;
        this.chipsActive = true;
        this.chipsTimer = 10;
        if (this.hero?.state?.equippedChips) {
            this.hero.state.equippedChips.forEach(c => {
                if (c === 'speed') this.activeBoosts.speed *= 1.3;
                if (c === 'tir') this.activeBoosts.shootRate *= 1.5;
                if (c === 'health_regen') this.activeBoosts.healthRegen = 2;
            });
        }
        return true;
    }

    addUltimateCharge(amount) {
        if (this.ultimateReady || this.ultimateActive) return;
        this.ultimateCharge = Math.min(this.ultimateMax, this.ultimateCharge + amount);
    }

    useUltimate() {
        if (!this.ultimateReady || !this.hero?.ultimate) return false;
        this.ultimateReady = false;
        this.ultimateCharge = 0;
        this.ultimateActive = true;
        if (this.hero.ultimate.id === 'blade_dash') {
            this.ultimateTimer = 0.5; this.speed *= 4;
        } else {
            this.ultimateTimer = 3.0;
        }
        return true;
    }

    takeDamage(amount) {
        if (this.invincibleTimer > 0) return 0;
        const dmg = super.takeDamage(amount);
        this.invincibleTimer = 0.3;
        return dmg;
    }

    draw(ctx, spriteRenderer) {
        if (!this.alive) return;
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer * 10) % 2 === 0) return;
        const state = this.shootCooldown > this.shootRate * 0.7 ? 'shoot' : 'idle';
        if (spriteRenderer) {
            spriteRenderer.drawPlayer(ctx, this.x, this.y, this.angle, state, this.color);
        } else {
            ctx.save();
            ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            ctx.fillStyle = this.color; ctx.fillRect(-15, -15, 30, 30);
            ctx.restore();
        }

        // Barre de vie
        const barW = 40; const barH = 4; const barX = this.x - barW / 2;
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(barX, this.y + 24, barW, barH);
        const pct = this.hp / this.maxHp;
        ctx.fillStyle = pct > 0.5 ? '#22c55e' : '#ef4444';
        ctx.fillRect(barX, this.y + 24, barW * pct, barH);

        // Munitions
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(barX, this.y + 32, barW, barH);
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(barX, this.y + 32, barW * (this.ammo / this.maxAmmo), barH);
    }
}
