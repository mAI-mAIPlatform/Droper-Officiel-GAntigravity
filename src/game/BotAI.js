/* ============================
   DROPER — Bot AI (alliés + ennemis, par mode)
   ============================ */

import { Projectile } from './Projectile.js';

export class BotAI {
    constructor(entity, role = 'attacker') {
        this.entity = entity;
        this.role = role; // attacker, defender, support
        this.shootTimer = 0;
        this.moveTimer = 0;
        this.targetPos = null;
        this.strafeAngle = Math.random() * Math.PI * 2;
        this.reactionDelay = 0.15 + Math.random() * 0.2;
        this.thinkTimer = 0;
        this.lastTarget = null;
        this.aimSpread = 0.15; // radians spread for accuracy
    }

    update(dt, engine, modeContext) {
        if (!this.entity.alive) return;

        this.thinkTimer += dt;
        this.shootTimer -= dt;

        // Find target
        const target = this.findTarget(engine);
        if (!target) {
            this.lastTarget = null;
            this.wander(dt, engine);
            return;
        }

        this.lastTarget = target;

        const dx = target.x - this.entity.x;
        const dy = target.y - this.entity.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;

        // Mode-specific behavior
        if (modeContext) {
            this.modeBehavior(dt, engine, modeContext, target, dist, nx, ny);
        } else {
            this.defaultBehavior(dt, engine, target, dist, nx, ny);
        }

        // Shooting — always aim at current target position
        if (this.shootTimer <= 0 && dist < 350) {
            this.shootAtTarget(engine, target);
            this.shootTimer = this.entity.shootRate || 1.5;
        }

        // Clamp
        this.entity.x = Math.max(this.entity.width, Math.min(engine.width - this.entity.width, this.entity.x));
        this.entity.y = Math.max(this.entity.height, Math.min(engine.height - this.entity.height, this.entity.y));
    }

    findTarget(engine) {
        let closest = null;
        let closestDist = Infinity;

        for (const e of engine.entities) {
            if (!e.alive || e === this.entity) continue;
            if (e.teamId === this.entity.teamId) continue;
            if (e.type !== 'enemy' && e.type !== 'player' && e.type !== 'bot') continue;

            const d = Math.hypot(e.x - this.entity.x, e.y - this.entity.y);
            if (d < closestDist) {
                closestDist = d;
                closest = e;
            }
        }

        // Also target player if enemy team
        if (engine.player && engine.player.alive && engine.player.teamId !== this.entity.teamId) {
            const d = Math.hypot(engine.player.x - this.entity.x, engine.player.y - this.entity.y);
            if (d < closestDist) {
                closest = engine.player;
            }
        }

        return closest;
    }

    defaultBehavior(dt, engine, target, dist, nx, ny) {
        const speed = this.entity.speed || 100;
        const preferredDist = this.entity.preferredDist || 180;
        const healthPct = this.entity.hp / this.entity.maxHp;

        // Comportement de repli si PV bas
        if (healthPct < 0.3) {
            // Fuite et strafe plus large
            this.strafeAngle += dt * 2.5;
            this.entity.x -= nx * speed * 1.2 * dt;
            this.entity.y -= ny * speed * 1.2 * dt;
            this.entity.x += Math.cos(this.strafeAngle) * speed * 0.4 * dt;
            this.entity.y += Math.sin(this.strafeAngle) * speed * 0.4 * dt;
            return;
        }

        if (dist > preferredDist + 20) {
            this.entity.x += nx * speed * dt;
            this.entity.y += ny * speed * dt;
        } else if (dist < preferredDist - 20) {
            this.entity.x -= nx * speed * 0.8 * dt;
            this.entity.y -= ny * speed * 0.8 * dt;
        } else {
            // Strafe circulaire
            this.strafeAngle += dt * 1.5;
            this.entity.x += Math.cos(this.strafeAngle) * speed * 0.6 * dt;
            this.entity.y += Math.sin(this.strafeAngle) * speed * 0.6 * dt;
        }
    }

    modeBehavior(dt, engine, ctx, target, dist, nx, ny) {
        const speed = this.entity.speed || 100;

        switch (ctx.modeId) {
            case 'nanopuces':
                if (ctx.pucePos && this.role !== 'defender') {
                    const pdx = ctx.pucePos.x - this.entity.x;
                    const pdy = ctx.pucePos.y - this.entity.y;
                    const pd = Math.hypot(pdx, pdy);
                    if (pd > 30) {
                        this.entity.x += (pdx / pd) * speed * dt;
                        this.entity.y += (pdy / pd) * speed * dt;
                        return;
                    }
                }
                break;
            case 'cyber_ball':
                if (ctx.ballPos) {
                    const bdx = ctx.ballPos.x - this.entity.x;
                    const bdy = ctx.ballPos.y - this.entity.y;
                    const bd = Math.hypot(bdx, bdy);
                    if (bd > 20) {
                        this.entity.x += (bdx / bd) * speed * dt;
                        this.entity.y += (bdy / bd) * speed * dt;
                        return;
                    }
                }
                break;
            case 'zone_surcharge':
                if (ctx.zoneCenter) {
                    const zdx = ctx.zoneCenter.x - this.entity.x;
                    const zdy = ctx.zoneCenter.y - this.entity.y;
                    const zd = Math.hypot(zdx, zdy);
                    if (zd > 50) {
                        this.entity.x += (zdx / zd) * speed * dt;
                        this.entity.y += (zdy / zd) * speed * dt;
                        return;
                    }
                }
                break;
            case 'hack_server':
                if (this.role === 'defender' && ctx.ownServer) {
                    const sdx = ctx.ownServer.x - this.entity.x;
                    const sdy = ctx.ownServer.y - this.entity.y;
                    const sd = Math.hypot(sdx, sdy);
                    if (sd > 100) {
                        this.entity.x += (sdx / sd) * speed * dt;
                        this.entity.y += (sdy / sd) * speed * dt;
                        return;
                    }
                }
                break;
        }

        this.defaultBehavior(dt, engine, target, dist, nx, ny);
    }

    wander(dt, engine) {
        const speed = this.entity.speed || 100;
        this.moveTimer -= dt;

        if (this.moveTimer <= 0 || !this.targetPos) {
            this.targetPos = {
                x: 100 + Math.random() * (engine.width - 200),
                y: 100 + Math.random() * (engine.height - 200),
            };
            this.moveTimer = 2 + Math.random() * 3;
        }

        const dx = this.targetPos.x - this.entity.x;
        const dy = this.targetPos.y - this.entity.y;
        const d = Math.hypot(dx, dy);
        if (d > 10) {
            this.entity.x += (dx / d) * speed * 0.5 * dt;
            this.entity.y += (dy / d) * speed * 0.5 * dt;
        }
    }

    shootAtTarget(engine, target) {
        const e = this.entity;
        // Recalculate aim direction from current positions
        const aimDx = target.x - e.x;
        const aimDy = target.y - e.y;
        const aimDist = Math.hypot(aimDx, aimDy);
        if (aimDist === 0) return;

        const baseAngle = Math.atan2(aimDy, aimDx);
        // Add small spread for realism
        const spread = (Math.random() - 0.5) * this.aimSpread;
        const angle = baseAngle + spread;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);

        const projectile = new Projectile({
            x: e.x + nx * (e.width / 2 + 5),
            y: e.y + ny * (e.height / 2 + 5),
            angle: angle,
            speed: e.bulletSpeed || 200,
            damage: e.bulletDamage || 8,
            owner: 'Botally',
        });
        projectile.teamId = e.teamId;
        engine.entities.push(projectile);
    }
}
