/* ============================
   DROPER — Game Engine 2D (v1.0.6)
   ============================ */

import { Player } from './Player.js';
import { Projectile } from './Projectile.js';
import { WaveManager } from './WaveManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { DropSystem } from './DropSystem.js';
import { SpriteRenderer } from './SpriteRenderer.js';
import { EmojiSystem } from './EmojiSystem.js';
import { AnimationManager } from './AnimationManager.js';
import { Payload } from './Payload.js';
import { Enemy } from './Enemy.js';
import { WeatherSystem } from './WeatherSystem.js';
import { EventManager } from '../systems/events/EventManager.js';
import { ReplaySystem } from '../systems/ReplaySystem.js';
import { AntiCheatLogger } from '../systems/AntiCheatLogger.js';
import { NetworkSync } from './NetworkSync.js';

// Modes v1.0.0
import { BaseGameMode } from './modes/BaseGameMode.js';
import { KillLifeMode } from './modes/KillLifeMode.js';
import { LaveDynaMode } from './modes/LaveDynaMode.js';
import { CyberBallMode } from './modes/CyberBallMode.js';

export class GameEngine {
    constructor(app) {
        this.app = app;
        this.canvas = null;
        this.ctx = null;
        this.running = false;
        this.paused = false;
        this.gameOver = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.entities = [];
        this.keys = {};
        this.wave = 0;
        this.score = 0;
        this.kills = 0;
        this.gameTime = 0;
        this.walls = [];
        this.currentMode = null; // Instantiated mode object v1.0.0

        // Sous-systèmes
        this.player = null;
        this.waveManager = null;
        this.particles = null;
        this.dropSystem = null;
        this.spriteRenderer = null;
        this.emojiSystem = null;
        this.animationManager = new AnimationManager(this);
        this.payload = null;
        this.bossEntity = null;
        this.weatherSystem = new WeatherSystem(this);
        this.audioManager = app ? app.audioManager : null;

        // Replay & Achievements (v0.9.7)
        this.replaySystem = new ReplaySystem(this);
        this._replayState = null;
        this.isReplaying = false;
        this.antiCheat = new AntiCheatLogger(this);
        this.networkSync = new NetworkSync(this.app); // v0.9.9 Multiplayer
        this.eventManager = new EventManager(this.app); // v1.0.2 Events

        // --- CAVEAUX SYSTEM ---
        this.gasCenter = { x: 0, y: 0 };
        this.gasRadius = 3000;
        this.targetGasRadius = 3000;
        this.gasShrinkRate = 50; // pixels per sec
        this.isCaveaux = false;

        // Combat Feed
        this.combatFeed = [];
        this.streak = 0;
        this.streakTimer = 0;

        // Souris
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        // Screen shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;

        // Announcements [NEW] v0.2.6
        this.announcements = []; // List of { text, timer }

        // Étoiles du fond
        this.stars = [];

        // FPS
        this.width = 0;
        this.height = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTimer = 0;

        // Callback game over
        this.onGameOverCallback = null;

        // Bind events
        this._onKeyDown = (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Escape') this.togglePause();
            // Emoji reactions (1-5)
            if (e.key >= '1' && e.key <= '5' && !this.gameOver && !this.paused) {
                this.emojiSystem.playerReaction(parseInt(e.key) - 1);
            }
            // Ultimate activation (Q)
            if (e.code === 'KeyQ' && this.player && !this.gameOver && !this.paused) {
                this.player.useUltimate();
            }
            // Power activation (G) - Level 5+
            if (e.code === 'KeyG' && this.player && !this.gameOver && !this.paused) {
                if (this.player.hero && this.player.hero.state.level >= 5) {
                    this.player.activatePower();
                } else {
                    console.log("Niveau 5 requis pour utiliser un Pouvoir !");
                }
            }
            // Chip activation (P) - Level 9+
            if (e.code === 'KeyP' && this.player && !this.gameOver && !this.paused) {
                if (this.player.hero && this.player.hero.state.level >= 9) {
                    this.player.activateChips();
                } else {
                    console.log("Niveau 9 requis pour utiliser une Puce !");
                }
            }
            // Supercharge activation (C) - Level 10+
            if (e.code === 'KeyC' && this.player && !this.gameOver && !this.paused) {
                if (this.player.hero && this.player.hero.state.level >= 10 && this.player.hero.state.superchargeUnlocked) {
                    const activated = this.player.activateSupercharge();
                    if (activated) {
                        this.particles.spawnSuperchargeAura(this.player.x, this.player.y);
                        // Optional sound
                    }
                }
            }
        };
        this._onKeyUp = (e) => { this.keys[e.code] = false; };
        this._onMouseMove = (e) => this.handleMouseMove(e);
        this._onMouseDown = (e) => { if (e.button === 0) this.mouseDown = true; };
        this._onMouseUp = (e) => { if (e.button === 0) this.mouseDown = false; };
        this._onResize = () => this.resize();
        this._onContextMenu = (e) => e.preventDefault();
    }

    init(containerId = 'game-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Conteneur de jeu introuvable.');
            return;
        }

        // Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'game-canvas';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#0a0e1a';
        this.canvas.style.cursor = 'crosshair';
        container.appendChild(this.canvas);

        try {
            this.ctx = this.canvas.getContext('2d');

            if (!this.ctx) {
                console.error("Impossible de récupérer le contexte 2D du canvas !");
                this.displayFallbackError("Impossible de récupérer le contexte 2D.");
                return;
            }
            this.resize();
        } catch (e) {
            console.error("Erreur d'initialisation du canvas:", e);
            this.displayFallbackError(e.message);
            return;
        }

        // Events
        window.addEventListener('resize', this._onResize);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mousedown', this._onMouseDown);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
        this.canvas.addEventListener('contextmenu', this._onContextMenu);

        // Étoiles de fond
        this.generateStars();

        // Particules
        this.particles = new ParticleSystem();

        // Drop System
        this.dropSystem = new DropSystem(this);

        // Sprite Renderer
        this.spriteRenderer = new SpriteRenderer();

        // Emoji System
        this.emojiSystem = new EmojiSystem(this);

        // Wave Manager
        this.waveManager = new WaveManager(this);

        // Audio
        if (this.audioManager) {
            this.audioManager.init();
        }

        // Weather
        this.weatherSystem.init();

        console.log('🎮 GameEngine v0.2.1 initialisé.');
    }

    isKeyDown(code) {
        return this.keys[code] === true;
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                size: 0.5 + Math.random() * 1.5,
                alpha: 0.2 + Math.random() * 0.5,
                speed: 0.1 + Math.random() * 0.3,
            });
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        if (this.player) {
            this.player.mouseX = this.mouseX;
            this.player.mouseY = this.mouseY;
        }
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    startGame() {
        const modeId = this.app.selectedMode;

        // Factory de modes v1.0.0
        if (modeId === 'kill_life') this.currentMode = new KillLifeMode(this);
        else if (modeId === 'lave_dyna') this.currentMode = new LaveDynaMode(this);
        else if (modeId === 'cyberball') this.currentMode = new CyberBallMode(this);
        else this.currentMode = new BaseGameMode(this);

        this.currentMode.applyTheme();
        this.generateMap(modeId);

        this.running = true;
        this.paused = false;
        this.gameOver = false;
        this.score = 0;
        this.kills = 0;
        this.gameTime = 0;
        this.wave = 0;
        this.entities = [];
        this.generateStars();

        // Joueur
        const selectedHero = this.app.heroManager?.selectedHero;
        this.player = new Player(selectedHero, this.width / 2, this.height / 2);
        this.entities.push(this.player);

        // Vagues
        this.waveManager = new WaveManager(this);
        if (this.app.selectedMode !== 'payload' && this.app.selectedMode !== 'boss_hunt') {
            this.waveManager.start();
        }

        // Payload
        if (this.app.selectedMode === 'payload') {
            this.payload = new Payload(this);
        }

        this.start();
    }

    generateMap(modeId) {
        if (this.currentMode) {
            this.walls = this.currentMode.generateMap();
        } else {
            this.walls = [];
            // Fallback
            const margin = 100;
            if (modeId === 'boss_hunt') {
                this.walls.push({ x: this.width * 0.25, y: this.height * 0.25, w: 40, h: 40 });
                this.walls.push({ x: this.width * 0.75, y: this.height * 0.25, w: 40, h: 40 });
                this.walls.push({ x: this.width * 0.25, y: this.height * 0.75, w: 40, h: 40 });
                this.walls.push({ x: this.width * 0.75, y: this.height * 0.75, w: 40, h: 40 });
            } else {
                this.walls.push({ x: this.width / 2 - 100, y: this.height / 2 - 150, w: 200, h: 30 });
                this.walls.push({ x: this.width / 2 - 100, y: this.height / 2 + 120, w: 200, h: 30 });
                this.walls.push({ x: margin, y: this.height / 2 - 100, w: 30, h: 200 });
                this.walls.push({ x: this.width - margin - 30, y: this.height / 2 - 100, w: 30, h: 200 });
            }
        }
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.networkSync.connect();
        try {
            this.loop(this.lastTime);
        } catch (e) {
            console.error("Erreur serveur de jeu :", e);
            this.displayFallbackError(e.message);
        }
    }

    stop() {
        this.running = false;
    }

    displayFallbackError(msg) {
        if (!this.canvas) return;
        this.running = false;
        const parent = this.canvas.parentElement;
        if (parent) {
            parent.innerHTML = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; background:#080c16; color:#ef4444; font-family: Outfit, sans-serif;">
                <h2>Erreur Critique du Jeu</h2>
                <p style="color:#e8ecf4">${msg}</p>
                <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; background:#ef4444; color:white; border:none; border-radius:5px; cursor:pointer;">Recharger</button>
            </div>`;
        }
    }

    togglePause() {
        if (this.gameOver) return;
        this.paused = !this.paused;
        if (!this.paused) {
            this.lastTime = performance.now();
        }
    }

    loop(timestamp) {
        if (!this.running) return;

        try {
            const am = this.app.adminManager;
            const speedMult = (am && am.config.gamespeed) ? am.config.gamespeed : 1.0;
            // Fix Teleport Bug: Cap delta time to 30fps equivalence (0.033s)
            this.deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.033) * speedMult;
            this.lastTime = timestamp;

            // FPS
            this.frameCount++;
            this.fpsTimer += this.deltaTime;
            if (this.fpsTimer >= 1) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.fpsTimer = 0;
            }

            // Gestion Event
            if (this.eventManager) this.eventManager.update();

            if (!this.paused && !this.gameOver && !this.isReplaying) {
                this.update(this.deltaTime);
                this.replaySystem.update(this.deltaTime); // Record frame
                this.antiCheat.check(this.deltaTime); // v0.9.8 Anti-Cheat
            } else if (this.isReplaying) {
                this.replaySystem.update(this.deltaTime); // Playback frame
            }

            this.draw();
            requestAnimationFrame((t) => this.loop(t));
        } catch (e) {
            console.error("Game loop error:", e);
            this.displayFallbackError(e.stack || e.message);
        }
    }

    update(dt) {
        this.gameTime += dt;

        // Effet de particule Ultimate
        if (this.player && this.player.alive && this.player.ultimateReady) {
            if (this.frameCount % 5 === 0) {
                this.particles.spawnUltimateCharge(this.player.x, this.player.y, '#00f7ff');
            }
        }
        if (this.player && this.player.ultimateActive) {
            this.particles.spawnDashTrail(this.player.x, this.player.y, this.player.hero?.bodyColor || '#10b981');
        }

        // v0.4.0 Supercharge effect
        if (this.player && this.player.superchargeActive) {
            if (this.frameCount % 8 === 0) {
                this.particles.spawnSuperchargeAura(this.player.x, this.player.y);
            }
        }

        if (this.isCaveaux) {
            this.updateGas(dt);
        }

        // --- ANNOUNCEMENTS [NEW] v0.2.6 ---
        for (let i = this.announcements.length - 1; i >= 0; i--) {
            this.announcements[i].timer -= dt;
            if (this.announcements[i].timer <= 0) this.announcements.splice(i, 1);
        }

        // Streak timer
        if (this.streakTimer > 0) {
            this.streakTimer -= dt;
            if (this.streakTimer <= 0) this.streak = 0;
        }

        // Joueur
        this.networkSync.update(dt);
        if (this.player && this.player.alive) {
            this.networkSync.sendLocalState(this.player);
            const oldX = this.player.x;
            const oldY = this.player.y;

            this.player.update(dt, this);
            this.checkWallCollision(this.player);

            // Achievements - Distance
            if (this.app.achievementManager) {
                const dist = Math.hypot(this.player.x - oldX, this.player.y - oldY);
                if (dist > 0) this.app.achievementManager.onMove(dist);
            }

            // Tir automatique (maintien clic gauche)
            if (this.mouseDown && this.player.canShoot()) {
                // Admin infinite ammo bypass
                const isInfinite = this.app.adminManager?.config?.infiniteAmmo;
                if (isInfinite) this.player.ammo = this.player.maxAmmo;

                const bulletData = this.player.shoot();
                if (bulletData) {
                    if (Array.isArray(bulletData)) {
                        // v0.4.0 Supercharge 360 multiple bullets
                        bulletData.forEach(bd => {
                            const projectile = new Projectile(bd);
                            this.entities.push(projectile);
                            this.particles.spawnMuzzleFlash(bd.x, bd.y, bd.angle);
                        });
                        if (this.audioManager) this.audioManager.playShoot(this.player.x, this.player.y);
                    } else {
                        // Standard single bullet
                        const projectile = new Projectile(bulletData);
                        this.entities.push(projectile);
                        // Muzzle flash
                        this.particles.spawnMuzzleFlash(bulletData.x, bulletData.y, bulletData.angle);
                        if (this.audioManager) this.audioManager.playShoot(this.player.x, this.player.y);
                    }
                }
            }

            // Set Audio Listener Position
            if (this.audioManager) {
                this.audioManager.setListenerPosition(this.player.x, this.player.y);
            }
        }

        // Update Entités
        const config = this.app.adminManager?.config || {};
        const eventModifiers = this.eventManager?.getActiveModifiers() || {};
        const eventSpeed = eventModifiers.gameSpeed || 1;

        // Triggers Admin
        if (config.triggerMapClear) {
            this.entities = this.entities.filter(e => e.type === 'player' || e.type === 'projectile');
            config.triggerMapClear = false;
        }

        for (const entity of this.entities) {
            // Freeze enemies check
            if (config.freezeEnemies && (entity.type === 'enemy' || entity.type === 'boss')) continue;

            // Speed Boost & Event Modifiers
            let dtMult = dt * eventSpeed;
            if (entity.type === 'player' && config.playerSpeedBoost) {
                dtMult *= config.playerSpeedBoost;
            }
            if ((entity.type === 'enemy' || entity.type === 'boss') && eventModifiers.enemySpeed) {
                dtMult *= eventModifiers.enemySpeed;
            }

            entity.update(dtMult, this);

            // Collision Murs
            if (entity.type === 'enemy' || entity.type === 'boss') {
                this.checkWallCollision(entity);
            } else if (entity.type === 'projectile') {
                this.checkProjectileWallCollision(entity);
            }

            // Blade Dash Damage (Cyber-Ninja)
            if (this.player && this.player.ultimateActive && this.player.hero?.ultimate?.id === 'blade_dash') {
                if (entity.type === 'enemy' && entity.alive) {
                    const d = Math.hypot(entity.x - this.player.x, entity.y - this.player.y);
                    if (d < 40) {
                        entity.takeDamage(this.player.attack * 2);
                        this.particles.spawnExplosion(entity.x, entity.y, '#10b981', 5);
                    }
                }
            }
        }
        this.entities = this.entities.filter(e => e.alive);

        // Particules
        this.particles.update(dt);

        // Weather
        if (this.weatherSystem) {
            this.weatherSystem.update(dt);
        }

        // Drops
        this.dropSystem.update(dt);

        // Emoji
        this.emojiSystem.update(dt);

        // Sprite renderer timing
        this.spriteRenderer.update(dt);

        // Vagues
        if (this.app.selectedMode !== 'boss_hunt' && this.app.selectedMode !== 'payload') {
            this.waveManager.update(dt);
        }

        // Payload logic
        if (this.payload) {
            this.payload.update(dt, this);
            if (this.payload.progress >= 1) {
                this.triggerGameOver(true);
            }
        }

        // Boss Hunt logic
        if (this.bossEntity && !this.bossEntity.alive) {
            this.triggerGameOver(true);
        }

        if (this.app.selectedMode === 'boss_hunt' && this.gameTime > 180) {
            this.triggerGameOver(false); // Time out
        }

        // Screen shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
            this.shakeIntensity *= 0.92;
        }

        // Game over
        if (this.player && !this.player.alive && !this.gameOver) {
            this.triggerGameOver();
        }

        // Graviton Pull logic (Overlord Ultimate)
        if (this.player && this.player.ultimateActive && this.player.hero?.ultimate?.id === 'graviton_pull') {
            const pullRadius = 300;
            for (const e of this.entities) {
                if (e.type === 'enemy' && e.alive) {
                    const dx = this.player.x - e.x;
                    const dy = this.player.y - e.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < pullRadius && dist > 10) {
                        const pullStrength = (pullRadius - dist) / 5;
                        e.x += (dx / dist) * pullStrength * dt * 10;
                        e.y += (dy / dist) * pullStrength * dt * 10;
                    }
                }
            }
        }
    }

    checkWallCollision(entity) {
        // v1.0.0 Refonte Collisions Rigides (AABB vs AABB)
        const halfW = entity.width / 2;
        const halfH = entity.height / 2;

        for (const wall of this.walls) {
            // Check bounding box overlap
            if (entity.x + halfW > wall.x && entity.x - halfW < wall.x + wall.w &&
                entity.y + halfH > wall.y && entity.y - halfH < wall.y + wall.h) {

                // Calculer les distances de pénétration sur les 4 axes
                const penLeft = (entity.x + halfW) - wall.x;
                const penRight = (wall.x + wall.w) - (entity.x - halfW);
                const penTop = (entity.y + halfH) - wall.y;
                const penBottom = (wall.y + wall.h) - (entity.y - halfH);

                // Trouver la pénétration la plus faible (l'axe par lequel on doit repousser)
                const minPen = Math.min(penLeft, penRight, penTop, penBottom);

                // Résolution rigide
                if (minPen === penLeft) {
                    entity.x = wall.x - halfW;
                } else if (minPen === penRight) {
                    entity.x = wall.x + wall.w + halfW;
                } else if (minPen === penTop) {
                    entity.y = wall.y - halfH;
                } else if (minPen === penBottom) {
                    entity.y = wall.y + wall.h + halfH;
                }
            }
        }
    }

    checkProjectileWallCollision(proj) {
        for (const wall of this.walls) {
            if (proj.x > wall.x && proj.x < wall.x + wall.w &&
                proj.y > wall.y && proj.y < wall.y + wall.h) {
                proj.alive = false;
                if (this.particles.spawnImpactParticles) {
                    this.particles.spawnImpactParticles(proj.x, proj.y, proj.color || '#fff');
                }
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.save();

        // Screen shake
        if (this.shakeDuration > 0) {
            const ox = (Math.random() - 0.5) * this.shakeIntensity;
            const oy = (Math.random() - 0.5) * this.shakeIntensity;
            ctx.translate(ox, oy);
        }

        // Fond
        ctx.fillStyle = '#080c16';
        ctx.fillRect(0, 0, this.width, this.height);

        // Étoiles
        for (const star of this.stars) {
            ctx.fillStyle = `rgba(200, 210, 230, ${star.alpha})`;
            ctx.fillRect(
                star.x % this.width,
                (star.y + this.gameTime * star.speed * 20) % this.height,
                star.size,
                star.size
            );
        }

        const config = this.app.adminManager?.config || {};

        // Effets visuels d'événements
        const eventModifiers = this.eventManager?.getActiveModifiers() || {};
        if (config.nightMode || eventModifiers.nightMode) {
            ctx.fillStyle = 'rgba(0, 0, 20, 0.4)';
            ctx.fillRect(0, 0, this.width, this.height);
        }
        if (config.partyMode) {
            const hue = (Date.now() / 20) % 360;
            ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.1)`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Grille subtile
        this.drawGrid(ctx);

        // Murs
        this.drawWalls(ctx);

        // Murs Saisonniers
        this.drawSeasonalBorders(ctx);

        // Entités
        if (this.isReplaying && this._replayState) {
            // Draw REPLAY STATE
            for (const e of this._replayState.entities) {
                // Fake sprite renderer or basic shapes for now since they are simple objects
                if (e.type === 'player') {
                    ctx.fillStyle = e.color || '#fff';
                    ctx.beginPath(); ctx.arc(e.x, e.y, 16, 0, Math.PI * 2); ctx.fill();
                    // Simple cannon
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.angle) * 25, e.y + Math.sin(e.angle) * 25); ctx.stroke();
                } else if (e.type === 'enemy' || e.type === 'boss') {
                    ctx.fillStyle = e.color || '#ef4444';
                    ctx.beginPath(); ctx.arc(e.x, e.y, 14, 0, Math.PI * 2); ctx.fill();
                } else if (e.type === 'bot') {
                    ctx.fillStyle = e._isAlly ? '#22c55e' : '#ef4444';
                    ctx.beginPath(); ctx.arc(e.x, e.y, 16, 0, Math.PI * 2); ctx.fill();
                }
            }

            // Replay Bullets
            for (const b of this._replayState.bullets) {
                ctx.fillStyle = b.color || '#fff';
                ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
            }

        } else {
            // NORMAL DRAW
            for (const entity of this.entities) {
                if (config.godMode && entity.type === 'player') {
                    entity.hp = entity.maxHp;
                }
                entity.draw(ctx, this.spriteRenderer);
            }

            // Joueur
            if (this.player && this.player.alive) {
                this.player.draw(ctx, this.spriteRenderer);
            }
        }

        this.networkSync.draw(ctx);

        // Drops
        this.dropSystem.draw(ctx);

        // Particules
        this.particles.draw(ctx);

        // Payload
        if (this.payload) this.payload.draw(ctx);

        // Emojis
        this.emojiSystem.draw(ctx);

        // Gas Draw
        if (this.isCaveaux) {
            this.drawGas(ctx);
        }

        ctx.restore();

        // HUD (pas de shake)
        this.drawHUD(ctx);

        // Pause overlay
        if (this.paused) {
            this.drawPauseOverlay(ctx);
        }
    }

    drawGrid(ctx) {
        const spacing = 60;
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.03)';
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

    drawSeasonalBorders(ctx) {
        const margin = 10;
        ctx.save();

        // Bordure néon
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.strokeRect(margin, margin, this.width - margin * 2, this.height - margin * 2);

        // Texte saisonnier sur les bords
        ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
        ctx.font = 'bold 12px Mono, monospace';
        ctx.textAlign = 'center';

        const label = '/// DROPER — SAISON 1 : L\'ÉVEIL ///';

        // Haut
        ctx.fillText(label, this.width / 2, margin + 20);
        // Bas
        ctx.fillText(label, this.width / 2, this.height - margin - 10);

        ctx.restore();
    }

    drawHUD(ctx) {
        // Les stats sont affichées dans le HUD HTML overlay
        // On n'affiche ici que le curseur personnalisé
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.6)';
        ctx.lineWidth = 1.5;
        const s = 12;
        ctx.beginPath();
        ctx.moveTo(this.mouseX - s, this.mouseY);
        ctx.lineTo(this.mouseX - s / 3, this.mouseY);
        ctx.moveTo(this.mouseX + s / 3, this.mouseY);
        ctx.lineTo(this.mouseX + s, this.mouseY);
        ctx.moveTo(this.mouseX, this.mouseY - s);
        ctx.lineTo(this.mouseX, this.mouseY - s / 3);
        ctx.moveTo(this.mouseX, this.mouseY + s / 3);
        ctx.lineTo(this.mouseX, this.mouseY + s);
        ctx.stroke();

        // Announcements Draw [v0.2.6]
        if (this.announcements.length > 0) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            this.announcements.forEach((ann, idx) => {
                const alpha = Math.min(1, ann.timer);
                ctx.font = 'bold 24px Outfit, sans-serif';
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.shadowColor = 'rgba(0, 247, 255, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText(ann.text, this.width / 2, this.height * 0.3 + (idx * 30));
            });
            ctx.restore();
        }
    }

    drawWalls(ctx) {
        ctx.save();
        const time = Date.now() / 1000;

        for (const wall of this.walls) {
            // Glow effect
            const glow = 5 + Math.sin(time * 4) * 3;
            ctx.shadowBlur = Math.max(5, glow);
            ctx.shadowColor = '#4a9eff';

            // Fill
            ctx.fillStyle = 'rgba(74, 158, 255, 0.15)';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

            // Stroke (Neon)
            ctx.strokeStyle = '#4a9eff';
            ctx.lineWidth = 2;
            ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

            // Corner details
            ctx.fillStyle = '#4a9eff';
            const s = 4;
            ctx.fillRect(wall.x - s / 2, wall.y - s / 2, s, s);
            ctx.fillRect(wall.x + wall.w - s / 2, wall.y - s / 2, s, s);
            ctx.fillRect(wall.x - s / 2, wall.y + wall.h - s / 2, s, s);
            ctx.fillRect(wall.x + wall.w - s / 2, wall.y + wall.h - s / 2, s, s);
        }
        ctx.restore();
    }

    drawGas(ctx) {
        ctx.save();

        // Zone toxique (extérieur)
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.arc(this.gasCenter.x, this.gasCenter.y, this.gasRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Rouge transparent
        ctx.fill();

        // Cercle limite (Neon)
        ctx.beginPath();
        ctx.arc(this.gasCenter.x, this.gasCenter.y, this.gasRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.stroke();

        ctx.restore();
    }

    updateGas(dt) {
        if (!this.isCaveaux) return;
        if (this.gasRadius > this.targetGasRadius) {
            this.gasRadius -= this.gasShrinkRate * dt;
        }
        if (this.gasRadius < 100) this.gasRadius = 100;

        // Damage players if outside
        if (this.player && this.player.alive) {
            const dist = Math.hypot(this.player.x - this.gasCenter.x, this.player.y - this.gasCenter.y);
            if (dist > this.gasRadius) {
                // Takes 10 damage per second when outside gas!
                this.player.takeDamage(10 * dt);
                if (this.frameCount % 10 === 0) {
                    this.particles.spawnExplosion(this.player.x, this.player.y, '#ef4444', 2);
                }
            }
        }
    }

    drawPauseOverlay(ctx) {
        ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = '#e8ecf4';
        ctx.font = 'bold 36px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⏸ PAUSE', this.width / 2, this.height / 2 - 20);
        ctx.font = '16px Outfit, sans-serif';
        ctx.fillStyle = '#8b95a8';
        ctx.fillText('Appuie sur Échap pour reprendre', this.width / 2, this.height / 2 + 20);
    }

    onEnemyKilled(enemy) {
        this.kills++;
        this.score += enemy.xpReward;

        // Achievements
        if (this.app.achievementManager) {
            this.app.achievementManager.onKill();
        }

        // Charger l'Ultimate du joueur sur le kill
        if (this.player && this.player.alive) {
            this.player.addUltimateCharge(enemy.xpReward * 2);
        }

        // Streak Logic
        this.streak++;
        this.streakTimer = 5.0; // 5s pour continuer la streak

        if (this.streak === 2) this.addAnnouncement('DOUBLE ÉLIMINATION !');
        else if (this.streak === 3) this.addAnnouncement('TROIS ÉLIMINATIONS ! 🔥');
        else if (this.streak === 4) this.addAnnouncement('QUADRUPLE KILL ! ⚡');
        else if (this.streak >= 5) this.addAnnouncement('LÉGENDAIRE ! 👑');

        // Random encouragement
        if (Math.random() > 0.8) {
            const msgs = ['Continue...', 'Incroyable !', 'Magnifique !'];
            this.addAnnouncement(msgs[Math.floor(Math.random() * msgs.length)]);
        }

        // Drops
        this.dropSystem.onEnemyKilled(enemy);

        // Récompenses
        this.app.economyManager.addCoins(enemy.coinReward);
        this.app.playerManager.addXp(enemy.xpReward);

        // Screen shake pour les boss
        if (enemy.typeId === 'boss') {
            this.shake(8, 0.3);
        } else {
            this.shake(2, 0.1);
        }
    }

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    addAnnouncement(text) {
        this.announcements.push({ text, timer: 3.0 }); // 3 seconds
        if (this.announcements.length > 3) this.announcements.shift();
    }

    triggerGameOver() {
        if (this.gameOver) return;
        this.gameOver = true;
        this.running = false;

        const isRanked = (this.app.selectedMode === 'ranked');
        const won = this.player && this.player.hp > 0;

        // Stop recording
        this.replaySystem.stopRecording();

        // Achievements
        if (this.app.achievementManager) {
            this.app.achievementManager.onMatchEnd(
                this.app.selectedMode,
                this.gameTime,
                this.player ? this.player.maxHp - this.player.hp : 0,
                won
            );
        }

        // Sauvegarder les stats classiques
        const stats = this.app.playerManager.getStats();
        this.app.playerManager.incrementStat('kills', this.kills);
        this.app.playerManager.incrementStat('gamesPlayed', 1);
        if (this.wave > (stats.maxWave || 0)) {
            this.app.playerManager.updateStat('maxWave', this.wave);
        }

        // [NEW] v0.8.1 — Anti-cheat: Envoyer le résultat au serveur pour validation
        if (this.app.networkManager && this.app.networkManager.isConnected) {
            this.app.networkManager.send({
                type: 'match_result',
                score: this.score,
                kills: this.kills,
                duration: Math.floor(this.gameTime),
                modeId: this.app.selectedMode
            });
        }

        // [NEW] v0.8.5 — Maîtrise de Héros : Comptabiliser la victoire
        if (won && this.player && this.player.hero) {
            this.app.heroManager?.addWin?.(this.player.hero.id);
        }

        // Enregistrer dans l'historique
        if (this.app.matchHistoryManager) {
            this.app.matchHistoryManager.addMatch({
                modeId: this.app.selectedMode || 'nanopuces',
                won: won,
                kills: this.kills,
                score: this.score,
                heroId: this.player ? this.player.heroId : 'soldier',
                duration: Math.floor(this.gameTime),
                isRanked: isRanked
            });
        }

        // Récompenses différenciées
        if (isRanked) {
            // Uniquement RP (Records) via RankedModeManager
            if (this.rankedModeManager) {
                this.rankedModeManager.onMatchEnd(won);
            }
            // Add a small amount of records based on performance even if not won
            const rpGain = Math.floor(this.score / 10) + (won ? 20 : 0);
            this.app.recordManager.add('total', rpGain);
            console.log(`🏆 Mode Classé : +${rpGain} RP`);
        } else {
            // XP de saison
            if (this.app.seasonPassManager) {
                this.app.seasonPassManager.addXp(this.score);
            }

            // Quêtes
            this.app.questManager.updateProgress('daily_xp_1', this.score);
            this.app.questManager.updateProgress('daily_kills', this.kills);
            this.app.questManager.updateProgress('weekly_games', 1);
        }

        // Animation de fin
        const finalStats = {
            score: this.score,
            kills: this.kills,
            wave: this.wave,
            time: this.gameTime
        };

        if (won) {
            this.animationManager.triggerVictory(() => {
                if (this.onGameOverCallback) this.onGameOverCallback(finalStats);
            });
        } else {
            this.animationManager.triggerDefeat(() => {
                if (this.onGameOverCallback) this.onGameOverCallback(finalStats);
            });
        }

        if (this.audioManager) this.app.musicPlayer.stop();
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    destroy() {
        this.stop();

        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);

        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.canvas.removeEventListener('mousedown', this._onMouseDown);
            this.canvas.removeEventListener('mouseup', this._onMouseUp);
            this.canvas.removeEventListener('contextmenu', this._onContextMenu);
            this.canvas.remove();
            this.canvas = null;
        }

        this.ctx = null;
        this.entities = [];
        this.player = null;
        this.particles = null;
        this.waveManager = null;
    }
}
