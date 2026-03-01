/* ============================
   DROPER — Mode Lave Flash 🔥 (v0.9.6)
   Leaderboard, particules, power-ups
   ============================ */

export class LaveFlashMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;

        // Lave
        this.lavaThickness = 0;
        this.lavaGrowRate = 8;
        this.lavaGrowInterval = 10;
        this.lavaGrowTimer = this.lavaGrowInterval;
        this.lavaDamagePerSec = 20;
        this.lavaPhase = 0; // phase d'animation

        // Kill tracking (tous les joueurs)
        this.killCounts = new Map();
        this.botKillCounts = new Map();

        // Effets
        this.flashWarning = false;
        this.flashTimer = 0;
        this.screenShake = 0;
        this.particles = [];
        this.lavaParticles = [];

        // Power-ups
        this.powerUps = [];
        this.playerShieldTimer = 0;
        this.playerSpeedBoost = 0;
        this.nextPowerUpTimer = 15;
    }

    init() {
        this.lavaThickness = 0;
        this.lavaGrowTimer = this.lavaGrowInterval;
        this.killCounts.clear();
        this.killCounts.set('player', 0);
        this.botKillCounts.clear();
        this.particles = [];
        this.lavaParticles = [];
        this.powerUps = [];
        this.playerShieldTimer = 0;
        this.playerSpeedBoost = 0;
        this.nextPowerUpTimer = 15;
        this.screenShake = 0;

        // Init bot kill trackers
        this.engine.entities.forEach((e, i) => {
            if (e.type === 'bot') {
                this.botKillCounts.set(i, { name: `Bot ${i + 1}`, kills: 0 });
            }
        });
    }

    update(dt) {
        const w = this.engine.width;
        const h = this.engine.height;

        this.lavaPhase += dt * 2;

        // ─── Timer de croissance ───
        this.lavaGrowTimer -= dt;
        if (this.lavaGrowTimer <= 0) {
            this.lavaThickness += this.lavaGrowRate;
            this.lavaGrowTimer = this.lavaGrowInterval;

            // Flash warning + screen shake
            this.flashWarning = true;
            this.flashTimer = 0.6;
            this.screenShake = 0.3;

            // Spawn particules de lave
            this.spawnLavaWave(w, h);
        }

        // Flash timer
        if (this.flashWarning) {
            this.flashTimer -= dt;
            if (this.flashTimer <= 0) this.flashWarning = false;
        }

        // Screen shake decay
        if (this.screenShake > 0) this.screenShake -= dt;

        // ─── Zone de sécurité ───
        const safeLeft = this.lavaThickness;
        const safeRight = w - this.lavaThickness;
        const safeTop = this.lavaThickness;
        const safeBottom = h - this.lavaThickness;

        if (safeRight - safeLeft < 40 || safeBottom - safeTop < 40) {
            return { finished: true, winner: this.getWinnerOnTimeout() };
        }

        // ─── Dégâts de lave ───
        const allAlive = [
            this.engine.player,
            ...this.engine.entities.filter(e => e.type === 'bot' && e.alive)
        ].filter(e => e && e.alive);

        for (const ent of allAlive) {
            if (ent.x < safeLeft || ent.x > safeRight ||
                ent.y < safeTop || ent.y > safeBottom) {

                // Shield protège le joueur
                if (ent === this.engine.player && this.playerShieldTimer > 0) {
                    continue;
                }

                ent.takeDamage(this.lavaDamagePerSec * dt);

                // Particules (périodiquement)
                if (Math.random() < 0.1) {
                    this.particles.push({
                        x: ent.x, y: ent.y - 5,
                        text: '🔥', vy: 20 + Math.random() * 15,
                        vx: (Math.random() - 0.5) * 10,
                        life: 0.8, maxLife: 0.8, opacity: 1, size: 10,
                    });
                }
            }
        }

        // ─── Kill tracking ───
        for (const ent of this.engine.entities) {
            if (ent.type === 'bot' && !ent.alive && ent._killedByPlayer) {
                const current = this.killCounts.get('player') || 0;
                this.killCounts.set('player', current + 1);
                ent._killedByPlayer = false;

                // Particule de kill
                this.particles.push({
                    x: ent.x, y: ent.y - 15,
                    text: `+1 ☠️`, color: '#fbbf24',
                    vy: 25, vx: 0, life: 1.2, maxLife: 1.2, opacity: 1, size: 14,
                });
            }
        }

        // Simuler kills des bots
        this.botKillCounts.forEach((data, idx) => {
            if (Math.random() < 0.001 * (1 + this.lavaThickness / 100)) {
                data.kills++;
            }
        });

        // ─── Power-ups ───
        this.nextPowerUpTimer -= dt;
        if (this.nextPowerUpTimer <= 0) {
            this.spawnPowerUp(safeLeft, safeRight, safeTop, safeBottom);
            this.nextPowerUpTimer = 12 + Math.random() * 8;
        }

        // Update power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const pu = this.powerUps[i];
            pu.timer -= dt;
            pu.bobPhase += dt * 3;

            // Expiration
            if (pu.timer <= 0) {
                this.powerUps.splice(i, 1);
                continue;
            }

            // Check pickup par le joueur
            if (this.engine.player && this.engine.player.alive) {
                const dist = Math.hypot(pu.x - this.engine.player.x, pu.y - this.engine.player.y);
                if (dist < 20) {
                    this.activatePowerUp(pu);
                    this.powerUps.splice(i, 1);
                }
            }
        }

        // Shield / speed timers
        if (this.playerShieldTimer > 0) this.playerShieldTimer -= dt;
        if (this.playerSpeedBoost > 0) this.playerSpeedBoost -= dt;

        // ─── Update particules ───
        this.particles = this.particles.filter(p => {
            p.life -= dt;
            p.y -= p.vy * dt;
            p.x += (p.vx || 0) * dt;
            p.opacity = Math.max(0, p.life / p.maxLife);
            return p.life > 0;
        });

        // Update lava particles
        this.lavaParticles = this.lavaParticles.filter(p => {
            p.life -= dt;
            p.y += p.vy * dt;
            p.x += p.vx * dt;
            p.radius *= 0.98;
            return p.life > 0 && p.radius > 0.5;
        });

        // Spawn ambient lava particles
        if (this.lavaThickness > 10 && Math.random() < 0.15) {
            this.spawnLavaBubble(w, h);
        }

        // ─── Check fin ───
        if (!this.engine.player.alive) {
            return { finished: true, winner: -1 };
        }

        const surviving = allAlive.filter(e => e && e.alive);
        if (surviving.length <= 1) {
            const winner = surviving[0] === this.engine.player ? 0 : -1;
            return { finished: true, winner };
        }

        return null;
    }

    spawnPowerUp(safeL, safeR, safeT, safeB) {
        const types = [
            { type: 'shield', emoji: '🛡️', color: '#3b82f6', label: 'Bouclier Anti-Lave' },
            { type: 'speed', emoji: '⚡', color: '#eab308', label: 'Speed Boost' },
            { type: 'heal', emoji: '❤️', color: '#ef4444', label: '+50 HP' },
        ];
        const pu = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push({
            ...pu,
            x: safeL + 30 + Math.random() * (safeR - safeL - 60),
            y: safeT + 30 + Math.random() * (safeB - safeT - 60),
            timer: 10,
            bobPhase: 0,
        });
    }

    activatePowerUp(pu) {
        switch (pu.type) {
            case 'shield':
                this.playerShieldTimer = 5;
                break;
            case 'speed':
                this.playerSpeedBoost = 6;
                break;
            case 'heal':
                if (this.engine.player) {
                    this.engine.player.hp = Math.min(this.engine.player.maxHp || 100, this.engine.player.hp + 50);
                }
                break;
        }
        this.particles.push({
            x: pu.x, y: pu.y - 10,
            text: `${pu.emoji} ${pu.label}`, color: pu.color,
            vy: 20, vx: 0, life: 1.5, maxLife: 1.5, opacity: 1, size: 12,
        });
    }

    spawnLavaWave(w, h) {
        for (let i = 0; i < 15; i++) {
            const side = Math.floor(Math.random() * 4);
            let x, y;
            if (side === 0) { x = Math.random() * this.lavaThickness; y = Math.random() * h; }
            else if (side === 1) { x = w - Math.random() * this.lavaThickness; y = Math.random() * h; }
            else if (side === 2) { x = Math.random() * w; y = Math.random() * this.lavaThickness; }
            else { x = Math.random() * w; y = h - Math.random() * this.lavaThickness; }

            this.lavaParticles.push({
                x, y, radius: 3 + Math.random() * 5,
                vx: (Math.random() - 0.5) * 20,
                vy: -10 - Math.random() * 20,
                life: 1 + Math.random(),
                color: Math.random() < 0.5 ? '#ef4444' : '#f97316',
            });
        }
    }

    spawnLavaBubble(w, h) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const t = this.lavaThickness;
        if (side === 0) { x = Math.random() * t; y = Math.random() * h; }
        else if (side === 1) { x = w - Math.random() * t; y = Math.random() * h; }
        else if (side === 2) { x = Math.random() * w; y = Math.random() * t; }
        else { x = Math.random() * w; y = h - Math.random() * t; }

        this.lavaParticles.push({
            x, y, radius: 2 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 8,
            vy: -5 - Math.random() * 10,
            life: 0.5 + Math.random() * 0.5,
            color: Math.random() < 0.3 ? '#fbbf24' : Math.random() < 0.5 ? '#ef4444' : '#f97316',
        });
    }

    getContext() {
        return {
            modeId: 'lave_flash',
            lavaThickness: this.lavaThickness,
            kills: this.killCounts.get('player') || 0,
            hasShield: this.playerShieldTimer > 0,
            hasSpeed: this.playerSpeedBoost > 0,
        };
    }

    getWinnerOnTimeout() {
        if (this.engine.player && this.engine.player.alive) return 0;
        return -1;
    }

    getLeaderboard() {
        const entries = [
            { name: '🎮 Toi', kills: this.killCounts.get('player') || 0, isPlayer: true },
        ];
        this.botKillCounts.forEach((data) => {
            entries.push({ name: `🤖 ${data.name}`, kills: data.kills, isBot: true });
        });
        entries.sort((a, b) => b.kills - a.kills);
        return entries;
    }

    draw(ctx) {
        const w = this.engine.width;
        const h = this.engine.height;
        const t = this.lavaThickness;

        // Screen shake
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * 6;
            const shakeY = (Math.random() - 0.5) * 6;
            ctx.save();
            ctx.translate(shakeX, shakeY);
        }

        if (t > 0) {
            ctx.save();

            // ─── Lave dégradée ───
            const lavaGrad = ctx.createLinearGradient(0, 0, t, 0);
            lavaGrad.addColorStop(0, 'rgba(185, 28, 28, 0.9)');
            lavaGrad.addColorStop(0.4, 'rgba(220, 38, 38, 0.7)');
            lavaGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.4)');
            lavaGrad.addColorStop(1, 'rgba(251, 191, 36, 0.08)');

            ctx.fillStyle = lavaGrad;
            ctx.fillRect(0, 0, t, h);

            ctx.save();
            ctx.translate(w, 0); ctx.scale(-1, 1);
            ctx.fillStyle = lavaGrad;
            ctx.fillRect(0, 0, t, h);
            ctx.restore();

            const lavaGradV = ctx.createLinearGradient(0, 0, 0, t);
            lavaGradV.addColorStop(0, 'rgba(185, 28, 28, 0.9)');
            lavaGradV.addColorStop(0.4, 'rgba(220, 38, 38, 0.7)');
            lavaGradV.addColorStop(0.7, 'rgba(249, 115, 22, 0.4)');
            lavaGradV.addColorStop(1, 'rgba(251, 191, 36, 0.08)');

            // Lava Area (Death zone)
            ctx.fillStyle = this.colors.red;
            ctx.strokeStyle = this.colors.red;

            // Base red overlay (exterior)
            ctx.beginPath();
            ctx.rect(0, 0, w, h);
            ctx.rect(
                this.engine.map.x + this.lavaZone,
                this.engine.map.y + this.lavaZone,
                this.engine.map.width - this.lavaZone * 2,
                this.engine.map.height - this.lavaZone * 2
            );
            ctx.fillStyle = 'rgba(220, 38, 38, 0.4)'; // Transparent red zone covering outside
            ctx.fill('evenodd');

            // Draw solid burning border with thermal distortion
            ctx.strokeStyle = '#f87171'; // Lighter red
            ctx.lineWidth = 15;
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 40 + Math.sin(this.glowTimer * 10) * 15; // Pulsing glow

            const innerX = this.engine.map.x + this.lavaZone;
            const innerY = this.engine.map.y + this.lavaZone;
            const innerW = this.engine.map.width - this.lavaZone * 2;
            const innerH = this.engine.map.height - this.lavaZone * 2;

            ctx.beginPath();

            // Distorsion thermique
            let points = [];
            const segments = 20;

            // Haut
            for (let i = 0; i <= segments; i++) {
                let px = innerX + (innerW * i / segments);
                let py = innerY + Math.sin((px + Date.now() / 100) * 0.05) * 5;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            // Droite
            for (let i = 0; i <= segments; i++) {
                let py = innerY + (innerH * i / segments);
                let px = innerX + innerW + Math.sin((py + Date.now() / 120) * 0.05) * 5;
                ctx.lineTo(px, py);
            }
            // Bas
            for (let i = segments; i >= 0; i--) {
                let px = innerX + (innerW * i / segments);
                let py = innerY + innerH + Math.sin((px + Date.now() / 110) * 0.05) * 5;
                ctx.lineTo(px, py);
            }
            // Gauche
            for (let i = segments; i >= 0; i--) {
                let py = innerY + (innerH * i / segments);
                let px = innerX + Math.sin((py + Date.now() / 130) * 0.05) * 5;
                ctx.lineTo(px, py);
            }

            ctx.closePath();
            ctx.fillStyle = this.colors.red;

            // Remplir l'extérieur par rapport à la bordure déformée
            ctx.save();
            ctx.beginPath();
            ctx.rect(-100, -100, w + 200, h + 200); // Grand carré englobant
            ctx.fill(); // On remplit tout en rouge...
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'white';

            // ...puis on perce un trou "tremblant" au centre
            ctx.beginPath();
            // Recalcul des points pour percer
            ctx.moveTo(innerX, innerY);
            for (let i = 0; i <= segments; i++) ctx.lineTo(innerX + (innerW * i / segments), innerY + Math.sin((innerX + (innerW * i / segments) + Date.now() / 100) * 0.05) * 5);
            for (let i = 0; i <= segments; i++) ctx.lineTo(innerX + innerW + Math.sin((innerY + (innerH * i / segments) + Date.now() / 120) * 0.05) * 5, innerY + (innerH * i / segments));
            for (let i = segments; i >= 0; i--) ctx.lineTo(innerX + (innerW * i / segments), innerY + innerH + Math.sin((innerX + (innerW * i / segments) + Date.now() / 110) * 0.05) * 5);
            for (let i = segments; i >= 0; i--) ctx.lineTo(innerX + Math.sin((innerY + (innerH * i / segments) + Date.now() / 130) * 0.05) * 5, innerY + (innerH * i / segments));
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Ligne lumineuse de bordure
            ctx.stroke();

            ctx.shadowBlur = 0;

            // ─── Flash warning ───
            if (this.flashWarning) {
                ctx.fillStyle = `rgba(239, 68, 68, ${0.12 + Math.sin(Date.now() / 80) * 0.08})`;
                ctx.fillRect(0, 0, w, h);
            }

            ctx.restore();
        }

        // ─── Lava particles (bulles, flammes) ───
        for (const lp of this.lavaParticles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, lp.life * 0.8);
            ctx.fillStyle = lp.color;
            ctx.beginPath();
            ctx.arc(lp.x, lp.y, lp.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // ─── Power-ups ───
        for (const pu of this.powerUps) {
            ctx.save();
            const bob = Math.sin(pu.bobPhase) * 3;

            // Halo
            ctx.globalAlpha = 0.3 + Math.sin(pu.bobPhase) * 0.1;
            const grad = ctx.createRadialGradient(pu.x, pu.y + bob, 0, pu.x, pu.y + bob, 20);
            grad.addColorStop(0, pu.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(pu.x - 20, pu.y + bob - 20, 40, 40);

            // Emoji
            ctx.globalAlpha = pu.timer < 3 ? 0.4 + Math.sin(Date.now() / 100) * 0.4 : 1;
            ctx.font = '18px serif';
            ctx.textAlign = 'center';
            ctx.fillText(pu.emoji, pu.x, pu.y + bob + 6);
            ctx.restore();
        }

        // ─── Shield indicator ───
        if (this.playerShieldTimer > 0 && this.engine.player && this.engine.player.alive) {
            ctx.save();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.arc(this.engine.player.x, this.engine.player.y, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = 'bold 8px sans-serif';
            ctx.fillStyle = '#3b82f6';
            ctx.textAlign = 'center';
            ctx.fillText(`🛡️ ${this.playerShieldTimer.toFixed(1)}s`, this.engine.player.x, this.engine.player.y - 22);
            ctx.restore();
        }

        // ─── Kill particles ───
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color || '#fbbf24';
            ctx.font = `bold ${p.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
        }

        // ─── HUD ───
        this.drawHUD(ctx, w, h);

        // End screen shake
        if (this.screenShake > 0) {
            ctx.restore();
        }
    }

    drawHUD(ctx, w, h) {
        ctx.save();
        const kills = this.killCounts.get('player') || 0;

        // ─── Panel gauche ───
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1;
        this.roundRect(ctx, 10, 50, 140, 70, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`🔥 ${kills} Kills`, 20, 72);

        // Alive
        const alive = [
            this.engine.player,
            ...this.engine.entities.filter(e => e.type === 'bot' && e.alive)
        ].filter(e => e && e.alive).length;
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`👤 ${alive} restants`, 20, 91);

        // Active power-ups
        let puText = '';
        if (this.playerShieldTimer > 0) puText += '🛡️ ';
        if (this.playerSpeedBoost > 0) puText += '⚡ ';
        if (puText) {
            ctx.fillStyle = '#3b82f6';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(puText, 20, 110);
        }

        // ─── Leaderboard (droite) ───
        const lb = this.getLeaderboard();
        const lbW = 140;
        const lbCount = Math.min(lb.length, 6);
        const lbH = 22 + lbCount * 16;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        this.roundRect(ctx, w - lbW - 10, 50, lbW, lbH, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🏆 CLASSEMENT KILLS', w - lbW - 2, 65);

        lb.slice(0, lbCount).forEach((entry, i) => {
            const y = 80 + i * 16;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            ctx.fillStyle = entry.isPlayer ? '#fbbf24' : 'rgba(255,255,255,0.45)';
            ctx.font = `${entry.isPlayer ? 'bold ' : ''}9px sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText(`${medal} ${entry.name}`, w - lbW - 2, y);
            ctx.textAlign = 'right';
            ctx.fillText(`${entry.kills}`, w - 14, y);
        });

        ctx.restore();
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}
