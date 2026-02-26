/* ============================
   DROPER — Wave Manager
   ============================ */

import { Enemy } from './Enemy.js';

export class WaveManager {
    constructor(engine) {
        this.engine = engine;
        this.wave = 0;
        this.enemiesRemaining = 0;
        this.totalEnemiesInWave = 0;
        this.betweenWaves = true;
        this.betweenWaveTimer = 3.0; // 3s avant la première vague
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.spawnInterval = 0.6;
    }

    update(dt) {
        if (this.betweenWaves) {
            this.betweenWaveTimer -= dt;
            if (this.betweenWaveTimer <= 0) {
                this.startNextWave();
            }
            return;
        }

        // Spawn progressif des ennemis
        if (this.spawnQueue.length > 0) {
            this.spawnTimer -= dt;
            if (this.spawnTimer <= 0) {
                this.spawnNext();
                this.spawnTimer = this.spawnInterval;
            }
        }

        // Vérifier si la vague est terminée
        const enemiesAlive = this.engine.entities.filter(e => e.type === 'enemy' && e.alive).length;
        if (enemiesAlive === 0 && this.spawnQueue.length === 0) {
            this.endWave();
        }
    }

    startNextWave() {
        this.wave++;
        this.betweenWaves = false;
        this.engine.wave = this.wave;

        // Générer la composition de la vague
        this.spawnQueue = this.generateWaveComposition(this.wave);
        this.totalEnemiesInWave = this.spawnQueue.length;
        this.enemiesRemaining = this.totalEnemiesInWave;
        this.spawnTimer = 0;

        // Réduire l'intervalle de spawn avec les vagues
        this.spawnInterval = Math.max(0.2, 0.6 - this.wave * 0.02);

        if (this.engine.audioManager) {
            this.engine.audioManager.playWaveStart();
        }

        console.log(`🌊 Vague ${this.wave} — ${this.totalEnemiesInWave} ennemis`);
    }

    generateWaveComposition(wave) {
        const composition = [];
        const multiplier = 1 + (wave - 1) * 0.15; // Difficulté accrue

        // Nombre d'ennemis de base
        const count = 5 + wave * 3;

        for (let i = 0; i < count; i++) {
            let type = 'basic';
            if (wave >= 2 && Math.random() < 0.3) type = 'fast';
            if (wave >= 4 && Math.random() < 0.2) type = 'heavy';
            if (wave >= 7 && Math.random() < 0.1) type = 'sniper'; // Nouveau type d'ennemi simulé

            composition.push({ type, multiplier });
        }

        // Boss toutes les 5 vagues
        if (wave % 5 === 0) {
            composition.push({ type: 'boss', multiplier: multiplier * 2 });
        }

        return composition.sort(() => Math.random() - 0.5);
    }

    spawnNext() {
        if (this.spawnQueue.length === 0) return;

        const { type, multiplier } = this.spawnQueue.shift();
        const { x, y } = this.getSpawnPosition();
        const enemy = new Enemy(type, x, y, multiplier);
        this.engine.addEntity(enemy);
    }

    getSpawnPosition() {
        const w = this.engine.width;
        const h = this.engine.height;
        const margin = 50;
        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0: return { x: Math.random() * w, y: -margin }; // haut
            case 1: return { x: w + margin, y: Math.random() * h }; // droite
            case 2: return { x: Math.random() * w, y: h + margin }; // bas
            case 3: return { x: -margin, y: Math.random() * h }; // gauche
            default: return { x: 0, y: 0 };
        }
    }

    endWave() {
        this.betweenWaves = true;
        this.betweenWaveTimer = 3.0;
        console.log(`✅ Vague ${this.wave} terminée !`);
    }

    getProgress() {
        if (this.totalEnemiesInWave === 0) return 1;
        const alive = this.engine.entities.filter(e => e.type === 'enemy' && e.alive).length + this.spawnQueue.length;
        return 1 - (alive / this.totalEnemiesInWave);
    }

    reset() {
        this.wave = 0;
        this.spawnQueue = [];
        this.betweenWaves = true;
        this.betweenWaveTimer = 3.0;
    }
}
