/* ============================
   DROPER — Mode Kill Life 🏙️ (2.5D Urbain — v0.9.6)
   Multi simulé, véhicules interactifs, particules, décorations
   ============================ */

export class KillLifeMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;

        // Éléments de la ville 2.5D
        this.buildings = [];
        this.vehicles = [];
        this.decorations = []; // lampadaires, panneaux, etc
        this.pedestrians = []; // PNJ piétons
        this.particles = [];   // Particules de kill

        // Scores
        this.killCount = 0;
        this.comboTimer = 0;
        this.comboMultiplier = 1;
        this.maxCombo = 0;
        this.damageDealt = 0;

        // Multiplayer simulé
        this.allyBot = null;
        this.allyKills = 0;

        // Leaderboard temps réel
        this.leaderboard = [];

        // v0.9.7 — Météo & Spectateur
        this.weather = 'clear'; // clear, rain, night
        this.rainDrops = [];
        this.lightningTimer = 0;
        this.lightningFlash = 0;
        this.isSpectating = false;
        this.spectateTarget = null;
    }

    init() {
        this.killCount = 0;
        this.comboTimer = 0;
        this.comboMultiplier = 1;
        this.maxCombo = 0;
        this.damageDealt = 0;
        this.allyKills = 0;
        this.particles = [];
        this.rainDrops = [];
        this.lightningTimer = 0;
        this.lightningFlash = 0;
        this.isSpectating = false;
        this.spectateTarget = null;

        // Choisir météo aléatoire
        const rand = Math.random();
        if (rand < 0.2) this.weather = 'night';
        else if (rand < 0.6) this.weather = 'rain';
        else this.weather = 'clear';

        this.generateCity();
        this.initAlly();
    }

    initAlly() {
        // Chercher un bot pour le transformer en allié
        const bots = this.engine.entities.filter(e => e.type === 'bot' && e.alive);
        if (bots.length > 1) {
            this.allyBot = bots[0];
            this.allyBot._isAlly = true;
            this.allyBot._allyLabel = '🤝 ALLIÉ';
        }
    }

    generateCity() {
        const w = this.engine.width;
        const h = this.engine.height;
        this.buildings = [];
        this.vehicles = [];
        this.decorations = [];
        this.pedestrians = [];

        // ─── Bâtiments 2.5D ───
        const buildingConfigs = [
            { color: '#e2e8f0', shadowColor: '#94a3b8', emoji: '🏢', type: 'office' },
            { color: '#f1f5f9', shadowColor: '#cbd5e1', emoji: '🏬', type: 'mall' },
            { color: '#dbeafe', shadowColor: '#93c5fd', emoji: '🏨', type: 'hotel' },
            { color: '#e0e7ff', shadowColor: '#a5b4fc', emoji: '🏦', type: 'bank' },
            { color: '#fce7f3', shadowColor: '#f9a8d4', emoji: '🏪', type: 'shop' },
            { color: '#f0fdf4', shadowColor: '#86efac', emoji: '🏥', type: 'hospital' },
            { color: '#fef3c7', shadowColor: '#fcd34d', emoji: '🏫', type: 'school' },
            { color: '#f5f5f4', shadowColor: '#a8a29e', emoji: '🏠', type: 'house' },
        ];

        const gridCols = 6;
        const gridRows = 5;
        const cellW = w / gridCols;
        const cellH = h / gridRows;

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                if (Math.random() < 0.3) continue;

                const config = buildingConfigs[Math.floor(Math.random() * buildingConfigs.length)];
                const bw = 45 + Math.random() * 50;
                const bh = 35 + Math.random() * 35;
                const depth = 18 + Math.random() * 30;

                this.buildings.push({
                    x: col * cellW + cellW / 2 - bw / 2 + (Math.random() - 0.5) * 15,
                    y: row * cellH + cellH / 2 - bh / 2 + (Math.random() - 0.5) * 15,
                    w: bw, h: bh, depth,
                    color: config.color, shadowColor: config.shadowColor,
                    emoji: config.emoji, type: config.type,
                    windowLit: Array.from({ length: 12 }, () => Math.random() < 0.35),
                    get zIndex() { return this.y + this.h; }
                });
            }
        }

        // ─── Véhicules (plus variés + interactifs) ───
        const vehicleTypes = [
            { emoji: '🚗', color: '#ef4444', w: 30, h: 18, speed: 40, name: 'Voiture', damage: 25 },
            { emoji: '🚙', color: '#3b82f6', w: 32, h: 20, speed: 35, name: 'SUV', damage: 30 },
            { emoji: '🚕', color: '#eab308', w: 28, h: 17, speed: 45, name: 'Taxi', damage: 25 },
            { emoji: '🚐', color: '#f8fafc', w: 36, h: 22, speed: 30, name: 'Van', damage: 35 },
            { emoji: '🏍️', color: '#1e293b', w: 20, h: 12, speed: 70, name: 'Moto', damage: 15 },
            { emoji: '🚌', color: '#f97316', w: 50, h: 24, speed: 20, name: 'Bus', damage: 50 },
            { emoji: '🚑', color: '#ffffff', w: 38, h: 20, speed: 55, name: 'Ambulance', damage: 30 },
            { emoji: '🚔', color: '#1e40af', w: 32, h: 18, speed: 60, name: 'Police', damage: 30 },
            { emoji: '🚛', color: '#78716c', w: 48, h: 22, speed: 18, name: 'Camion', damage: 60 },
        ];

        for (let i = 0; i < 14; i++) {
            const vType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
            const horizontal = Math.random() < 0.5;
            this.vehicles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                w: horizontal ? vType.w : vType.h,
                h: horizontal ? vType.h : vType.w,
                emoji: vType.emoji, color: vType.color,
                speed: vType.speed, name: vType.name, damage: vType.damage,
                dx: horizontal ? (Math.random() < 0.5 ? 1 : -1) : 0,
                dy: horizontal ? 0 : (Math.random() < 0.5 ? 1 : -1),
                headlightsOn: true,
                get zIndex() { return this.y + this.h; }
            });
        }

        // ─── Décorations ───
        // Lampadaires
        for (let i = 0; i < 12; i++) {
            this.decorations.push({
                type: 'lamppost',
                x: 60 + Math.random() * (w - 120),
                y: 50 + Math.random() * (h - 100),
                glowRadius: 25 + Math.random() * 15,
                glowPhase: Math.random() * Math.PI * 2,
                get zIndex() { return this.y + 10; }
            });
        }

        // Feux de circulation
        for (let i = 0; i < 6; i++) {
            this.decorations.push({
                type: 'traffic_light',
                x: 80 + Math.random() * (w - 160),
                y: 60 + Math.random() * (h - 120),
                phase: Math.random() * 3,
                timer: 0,
                get zIndex() { return this.y + 8; }
            });
        }

        // Passages piétons
        for (let i = 0; i < 8; i++) {
            const horizontal = Math.random() < 0.5;
            this.decorations.push({
                type: 'crosswalk',
                x: Math.random() * w,
                y: Math.random() * h,
                horizontal,
                get zIndex() { return 0; }
            });
        }

        // ─── Piétons NPC ───
        for (let i = 0; i < 10; i++) {
            this.pedestrians.push({
                x: Math.random() * w,
                y: Math.random() * h,
                speed: 15 + Math.random() * 20,
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2,
                emoji: ['🚶', '🚶‍♀️', '🏃', '🧑‍💼', '👩‍💻', '🧑‍🎤'][Math.floor(Math.random() * 6)],
                fleeTimer: 0,
                get zIndex() { return this.y + 5; }
            });
        }
    }

    update(dt) {
        const w = this.engine.width;
        const h = this.engine.height;

        // Update véhicules
        for (const v of this.vehicles) {
            v.x += v.dx * v.speed * dt;
            v.y += v.dy * v.speed * dt;

            // Wrap around
            if (v.x > w + 60) v.x = -60;
            if (v.x < -60) v.x = w + 60;
            if (v.y > h + 60) v.y = -60;
            if (v.y < -60) v.y = h + 60;

            // ─── Collision joueur-véhicule ───
            if (this.engine.player && this.engine.player.alive) {
                const px = this.engine.player.x;
                const py = this.engine.player.y;
                if (px > v.x && px < v.x + v.w && py > v.y && py < v.y + v.h) {
                    this.engine.player.takeDamage(v.damage * dt);
                    this.spawnParticle(px, py, `💥`, '#ef4444', 0.5);
                }
            }

            // Collision allié-véhicule
            if (this.allyBot && this.allyBot.alive) {
                const ax = this.allyBot.x;
                const ay = this.allyBot.y;
                if (ax > v.x && ax < v.x + v.w && ay > v.y && ay < v.y + v.h) {
                    this.allyBot.takeDamage(v.damage * dt * 0.5);
                }
            }
        }

        // Update piétons
        for (const ped of this.pedestrians) {
            // Fuir si un combat est proche
            const player = this.engine.player;
            if (player && player.alive) {
                const distToPlayer = Math.hypot(ped.x - player.x, ped.y - player.y);
                if (distToPlayer < 100) {
                    ped.fleeTimer = 2;
                    const angle = Math.atan2(ped.y - player.y, ped.x - player.x);
                    ped.dx = Math.cos(angle) * 3;
                    ped.dy = Math.sin(angle) * 3;
                }
            }

            if (ped.fleeTimer > 0) {
                ped.fleeTimer -= dt;
                ped.x += ped.dx * ped.speed * 2 * dt;
                ped.y += ped.dy * ped.speed * 2 * dt;
            } else {
                ped.x += ped.dx * ped.speed * dt;
                ped.y += ped.dy * ped.speed * dt;
            }

            // Rebond
            if (ped.x < 0 || ped.x > w) ped.dx *= -1;
            if (ped.y < 0 || ped.y > h) ped.dy *= -1;
            ped.x = Math.max(0, Math.min(w, ped.x));
            ped.y = Math.max(0, Math.min(h, ped.y));
        }

        // Update feux de circulation
        for (const dec of this.decorations) {
            if (dec.type === 'traffic_light') {
                dec.timer += dt;
                if (dec.timer > 3) {
                    dec.timer = 0;
                    dec.phase = (dec.phase + 1) % 3;
                }
            }
        }

        // Update particules
        this.particles = this.particles.filter(p => {
            p.life -= dt;
            p.y -= p.vy * dt;
            p.x += (p.vx || 0) * dt;
            p.opacity = Math.max(0, p.life / p.maxLife);
            return p.life > 0;
        });

        // Combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.comboMultiplier = 1;
            }
        }

        // Track kills
        for (const ent of this.engine.entities) {
            if (ent.type === 'bot' && !ent.alive && ent._killedByPlayer) {
                const pts = this.comboMultiplier;
                this.killCount += pts;
                this.comboMultiplier = Math.min(8, this.comboMultiplier + 1);
                this.maxCombo = Math.max(this.maxCombo, this.comboMultiplier);
                this.comboTimer = 5;
                ent._killedByPlayer = false;

                // Particule de kill
                this.spawnParticle(ent.x, ent.y - 10, `+${pts}`, '#fbbf24', 1.2);
                this.spawnKillExplosion(ent.x, ent.y);
            }
        }

        // Track allié kills (simulé)
        if (this.allyBot && this.allyBot.alive) {
            if (Math.random() < 0.002) {
                this.allyKills++;
            }
        }

        // Update leaderboard
        this.updateLeaderboard();

        // Météo — Update
        if (this.weather === 'rain') {
            // Ajouter gouttes
            if (Math.random() < 0.3) {
                this.rainDrops.push({
                    x: Math.random() * w,
                    y: -10,
                    length: 10 + Math.random() * 15,
                    vx: -2 + Math.random() * 4,
                    vy: 30 + Math.random() * 20,
                    opacity: 0.3 + Math.random() * 0.4
                });
            }
            // Update gouttes
            this.rainDrops = this.rainDrops.filter(drop => {
                drop.x += drop.vx * dt * 20;
                drop.y += drop.vy * dt * 20;
                return drop.y < h + 20;
            });

            // Éclairs
            this.lightningTimer -= dt;
            if (this.lightningTimer <= 0) {
                if (Math.random() < 0.1) {
                    this.lightningFlash = 1.0;
                }
                this.lightningTimer = 3 + Math.random() * 8;
            }
            if (this.lightningFlash > 0) {
                this.lightningFlash -= dt * 3;
            }
        }

        // Check player death / Spectateur
        if (!this.engine.player.alive) {
            if (this.allyBot && this.allyBot.alive && !this.isSpectating) {
                this.isSpectating = true;
                this.spectateTarget = this.allyBot;
            } else if (!this.isSpectating) {
                return { finished: true, winner: -1 };
            }
        }

        // Si on spectate, on perd si l'allié meurt
        if (this.isSpectating && (!this.allyBot || !this.allyBot.alive)) {
            return { finished: true, winner: -1 };
        }

        // Check si tous les bots ennemis morts
        const enemyBots = this.engine.entities.filter(e => e.type === 'bot' && e.alive && !e._isAlly);
        if (enemyBots.length === 0) {
            return { finished: true, winner: 0 };
        }

        return null;
    }

    spawnParticle(x, y, text, color, duration) {
        this.particles.push({
            x, y, text, color,
            vy: 30 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 20,
            life: duration,
            maxLife: duration,
            opacity: 1,
            size: 14 + Math.random() * 6,
        });
    }

    spawnKillExplosion(x, y) {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            this.particles.push({
                x, y,
                text: '•',
                color: ['#ef4444', '#fbbf24', '#f97316', '#a855f7'][Math.floor(Math.random() * 4)],
                vx: Math.cos(angle) * (40 + Math.random() * 30),
                vy: Math.sin(angle) * (40 + Math.random() * 30) + 10,
                life: 0.6,
                maxLife: 0.6,
                opacity: 1,
                size: 8 + Math.random() * 6,
            });
        }
    }

    updateLeaderboard() {
        this.leaderboard = [
            { name: '🎮 Toi', kills: this.killCount, isPlayer: true },
            { name: '🤝 Allié', kills: this.allyKills, isAlly: true },
        ];
        // Ajouter les bots ennemis (kills simulés)
        const bots = this.engine.entities.filter(e => e.type === 'bot' && !e._isAlly);
        bots.forEach((b, i) => {
            this.leaderboard.push({
                name: `🤖 Bot ${i + 1}`,
                kills: Math.floor(Math.random() * (this.killCount * 0.6 + 1)),
                isBot: true
            });
        });
        this.leaderboard.sort((a, b) => b.kills - a.kills);
    }

    getContext() {
        return {
            modeId: 'kill_life',
            killCount: this.killCount,
            combo: this.comboMultiplier,
            maxCombo: this.maxCombo,
        };
    }

    getWinnerOnTimeout() {
        return this.engine.player && this.engine.player.alive ? 0 : -1;
    }

    draw(ctx) {
        const w = this.engine.width;
        const h = this.engine.height;

        // Spectateur : simuler le suivi de caméra
        ctx.save();
        if (this.isSpectating && this.spectateTarget) {
            // Dans ce moteur, on n'a pas de vraie caméra pour le moment, 
            // mais on va centrer artificiellement l'affichage autour de la cible
            // (Si le jeu supportait le scrolling, on décalerait le ctx ici)
        }

        // ─── Fond asphalte avec texture ───
        ctx.fillStyle = this.weather === 'night' ? '#111827' : '#2d3748';
        ctx.fillRect(0, 0, w, h);

        // Texture route
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.02})`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }

        // Flaques d'eau (si pluie)
        if (this.weather === 'rain') {
            ctx.fillStyle = this.weather === 'night' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 23, 42, 0.3)';
            for (let i = 0; i < 15; i++) {
                ctx.beginPath();
                ctx.ellipse(Math.random() * w, Math.random() * h, 30 + Math.random() * 40, 10 + Math.random() * 15, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ─── Lignes routières ───
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        for (let x = 0; x < w; x += w / 6) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += h / 5) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.setLineDash([]);

        // Trottoirs
        ctx.fillStyle = 'rgba(148, 163, 184, 0.08)';
        for (let x = 0; x < w; x += w / 6) {
            ctx.fillRect(x - 8, 0, 16, h);
        }

        // Passages piétons
        for (const dec of this.decorations) {
            if (dec.type === 'crosswalk') {
                this.drawCrosswalk(ctx, dec);
            }
        }

        // ─── Trier TOUT par Z-index (2.5D) ───
        const allDrawables = [
            ...this.buildings.map(b => ({ type: 'building', data: b, zIndex: b.zIndex })),
            ...this.vehicles.map(v => ({ type: 'vehicle', data: v, zIndex: v.zIndex })),
            ...this.decorations.filter(d => d.type !== 'crosswalk').map(d => ({ type: 'decoration', data: d, zIndex: d.zIndex })),
            ...this.pedestrians.map(p => ({ type: 'pedestrian', data: p, zIndex: p.zIndex })),
        ];
        allDrawables.sort((a, b) => a.zIndex - b.zIndex);

        for (const item of allDrawables) {
            if (item.type === 'building') this.drawBuilding(ctx, item.data);
            else if (item.type === 'vehicle') this.drawVehicle(ctx, item.data);
            else if (item.type === 'decoration') this.drawDecoration(ctx, item.data);
            else if (item.type === 'pedestrian') this.drawPedestrian(ctx, item.data);
        }

        // ─── Particules ───
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.font = `bold ${p.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
        }

        // ─── Indicateur allié ───
        if (this.allyBot && this.allyBot.alive) {
            ctx.save();
            ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🤝 ALLIÉ', this.allyBot.x, this.allyBot.y - 18);
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(this.allyBot.x, this.allyBot.y, 16, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.isSpectating) {
                // Highlight si on le spectate
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath(); ctx.arc(this.allyBot.x, this.allyBot.y, 30, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        }

        // ─── Météo Overlay ───

        // Nuit
        if (this.weather === 'night') {
            ctx.fillStyle = 'rgba(3, 7, 18, 0.65)';
            ctx.fillRect(0, 0, w, h);
        }

        // Pluie
        if (this.weather === 'rain') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            for (const drop of this.rainDrops) {
                ctx.globalAlpha = drop.opacity;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + drop.vx, drop.y + drop.length);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;

            // Éclair
            if (this.lightningFlash > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningFlash * 0.8})`;
                ctx.fillRect(0, 0, w, h);
            }
        }

        // ─── HUD ───
        ctx.restore(); // Restore avant le HUD
        this.drawHUD(ctx, w, h);
    }

    drawHUD(ctx, w, h) {
        ctx.save();

        // Mode spectateur
        if (this.isSpectating) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.fillRect(0, 0, w, 30);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👁️ MODE SPECTATEUR — ' + (this.allyBot ? this.allyBot.name : 'ALLIÉ'), w / 2, 20);
        }

        // Panel gauche — Stats
        const panelW = 160;
        const panelH = 100;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 1;
        this.roundRect(ctx, 10, 50, panelW, panelH, 8);
        ctx.fill();
        ctx.stroke();

        // Kill counter
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`🏙️ ${this.killCount} Kills`, 20, 75);

        // Combo
        if (this.comboMultiplier > 1) {
            const comboCol = this.comboMultiplier >= 5 ? '#ef4444' : this.comboMultiplier >= 3 ? '#f97316' : '#eab308';
            ctx.fillStyle = comboCol;
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(`⚡ COMBO x${this.comboMultiplier}`, 20, 96);

            // Barre de combo
            const barW = panelW - 20;
            const comboPct = Math.min(1, this.comboTimer / 5);
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(20, 103, barW, 4);
            ctx.fillStyle = comboCol;
            ctx.fillRect(20, 103, barW * comboPct, 4);
        }

        // Max combo
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px sans-serif';
        ctx.fillText(`Max combo: x${this.maxCombo}`, 20, 140);

        // Allié kills
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`🤝 Allié: ${this.allyKills} kills`, 20, 125);

        // Badge BÊTA
        ctx.fillStyle = 'rgba(168, 85, 247, 0.85)';
        this.roundRect(ctx, w - 78, 50, 68, 24, 6);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏙️ BÊTA', w - 44, 66);

        // ─── Mini Leaderboard (droite) ───
        const lbW = 130;
        const lbH = 22 + Math.min(this.leaderboard.length, 5) * 16;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.roundRect(ctx, w - lbW - 10, 80, lbW, lbH, 6);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🏆 CLASSEMENT', w - lbW - 2, 95);

        const topEntries = this.leaderboard.slice(0, 5);
        topEntries.forEach((entry, i) => {
            const y = 110 + i * 16;
            ctx.fillStyle = entry.isPlayer ? '#fbbf24' : entry.isAlly ? '#22c55e' : 'rgba(255,255,255,0.5)';
            ctx.font = `${entry.isPlayer ? 'bold ' : ''}9px sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText(`${i + 1}. ${entry.name}`, w - lbW - 2, y);
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

    drawBuilding(ctx, b) {
        ctx.save();

        const shadowOffsetX = 10;
        const shadowOffsetY = -b.depth;

        // Ombre au sol
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(b.x + 5, b.y + b.h, b.w + 5, 6);

        // Face latérale droite (profondeur)
        ctx.fillStyle = b.shadowColor;
        ctx.beginPath();
        ctx.moveTo(b.x + b.w, b.y);
        ctx.lineTo(b.x + b.w + shadowOffsetX, b.y + shadowOffsetY);
        ctx.lineTo(b.x + b.w + shadowOffsetX, b.y + b.h + shadowOffsetY);
        ctx.lineTo(b.x + b.w, b.y + b.h);
        ctx.closePath();
        ctx.fill();

        // Face supérieure (toit)
        ctx.fillStyle = b.shadowColor;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + shadowOffsetX, b.y + shadowOffsetY);
        ctx.lineTo(b.x + b.w + shadowOffsetX, b.y + shadowOffsetY);
        ctx.lineTo(b.x + b.w, b.y);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Face principale
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Fenêtres (avec lumières stables — pas de random chaque frame)
        const winRows = Math.floor(b.h / 12);
        const winCols = Math.floor(b.w / 14);
        for (let r = 0; r < winRows; r++) {
            for (let c = 0; c < winCols; c++) {
                const idx = r * winCols + c;
                const wx = b.x + 5 + c * 14;
                const wy = b.y + 5 + r * 12;
                const isLit = b.windowLit[idx % b.windowLit.length];
                ctx.fillStyle = isLit ? 'rgba(251, 191, 36, 0.7)' : 'rgba(148, 163, 184, 0.3)';
                ctx.fillRect(wx, wy, 8, 6);
            }
        }

        // Emoji du bâtiment
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.emoji, b.x + b.w / 2, b.y - 5);

        ctx.restore();
    }

    drawVehicle(ctx, v) {
        ctx.save();

        // Ombre
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(v.x + 3, v.y + v.h, v.w, 4);

        // Corps du véhicule
        ctx.fillStyle = v.color;
        this.roundRect(ctx, v.x, v.y, v.w, v.h, 4);
        ctx.fill();

        // Reflet
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(v.x + 3, v.y + 2, v.w - 6, v.h * 0.3);

        // Phares (avant)
        if (v.headlightsOn) {
            const frontX = v.dx > 0 ? v.x + v.w : v.x;
            const frontY = v.dy > 0 ? v.y + v.h : v.y;
            ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
            ctx.beginPath();
            ctx.arc(v.dx !== 0 ? frontX : v.x + v.w / 2, v.dy !== 0 ? frontY : v.y + v.h / 2, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Emoji
        ctx.font = '13px serif';
        ctx.textAlign = 'center';
        ctx.fillText(v.emoji, v.x + v.w / 2, v.y + v.h / 2 + 5);

        ctx.restore();
    }

    drawDecoration(ctx, dec) {
        ctx.save();

        if (dec.type === 'lamppost') {
            // Poteau
            ctx.fillStyle = '#64748b';
            ctx.fillRect(dec.x - 1, dec.y - 22, 3, 22);
            // Tête de lampe
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(dec.x - 4, dec.y - 24, 9, 4);
            // Halo lumineux animé
            const glow = 0.15 + Math.sin(Date.now() / 1000 + dec.glowPhase) * 0.05;
            const grad = ctx.createRadialGradient(dec.x, dec.y - 20, 0, dec.x, dec.y - 20, dec.glowRadius);
            grad.addColorStop(0, `rgba(251, 191, 36, ${glow})`);
            grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(dec.x - dec.glowRadius, dec.y - 20 - dec.glowRadius, dec.glowRadius * 2, dec.glowRadius * 2);
        }

        if (dec.type === 'traffic_light') {
            // Poteau
            ctx.fillStyle = '#374151';
            ctx.fillRect(dec.x - 1, dec.y - 20, 3, 20);
            // Boîtier
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(dec.x - 5, dec.y - 30, 11, 14);
            // Feux
            const colors = ['#ef4444', '#eab308', '#22c55e'];
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = Math.floor(dec.phase) === i ? colors[i] : 'rgba(100,100,100,0.3)';
                ctx.beginPath();
                ctx.arc(dec.x, dec.y - 27 + i * 4.5, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    drawCrosswalk(ctx, dec) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        if (dec.horizontal) {
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(dec.x - 20 + i * 10, dec.y, 6, 25);
            }
        } else {
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(dec.x, dec.y - 20 + i * 10, 25, 6);
            }
        }
        ctx.restore();
    }

    drawPedestrian(ctx, ped) {
        ctx.save();
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        // Ombre
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(ped.x, ped.y + 5, 5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Emoji
        ctx.fillText(ped.emoji, ped.x, ped.y);
        // Si en fuite, exclamation
        if (ped.fleeTimer > 0) {
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('❗', ped.x + 8, ped.y - 10);
        }
        ctx.restore();
    }
}
