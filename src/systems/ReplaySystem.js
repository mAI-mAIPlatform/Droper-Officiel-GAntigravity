export class ReplaySystem {
    constructor(engine, maxDuration = 10) {
        this.engine = engine;
        this.maxDuration = maxDuration; // seconds
        this.history = []; // Array of game state snapshots
        this.isRecording = false;
        this.isPlaying = false;
        this.playbackIndex = 0;
        this.snapshotRate = 1 / 30; // 30 FPS recording
        this.accumulator = 0;
    }

    startRecording() {
        this.history = [];
        this.isRecording = true;
        this.accumulator = 0;
    }

    stopRecording() {
        this.isRecording = false;
    }

    startPlayback() {
        if (this.history.length === 0) return;
        this.isPlaying = true;
        this.playbackIndex = 0;
        this.engine.isReplaying = true; // Tell engine to stop logic updates
    }

    stopPlayback() {
        this.isPlaying = false;
        this.engine.isReplaying = false;
    }

    update(dt) {
        if (this.isRecording && !this.isPlaying) {
            this.accumulator += dt;
            if (this.accumulator >= this.snapshotRate) {
                this.recordSnapshot();
                this.accumulator -= this.snapshotRate;
            }
        }

        if (this.isPlaying) {
            this.accumulator += dt;
            if (this.accumulator >= this.snapshotRate) {
                this.playbackIndex++;
                if (this.playbackIndex >= this.history.length) {
                    this.stopPlayback(); // Auto stop at end
                } else {
                    this.applySnapshot(this.history[this.playbackIndex]);
                }
                this.accumulator -= this.snapshotRate;
            }
        }
    }

    recordSnapshot() {
        // Deep copy essential state
        const state = {
            entities: this.engine.entities.map(e => ({
                id: e.id,
                type: e.type,
                x: e.x,
                y: e.y,
                angle: e.angle,
                alive: e.alive,
                hp: e.hp,
                color: e.color || e.bodyColor,
                heroId: e.hero ? e.hero.id : null,
                _isAlly: e._isAlly
            })),
            bullets: this.engine.entities.filter(e => e.type === 'projectile').map(b => ({
                x: b.x,
                y: b.y,
                radius: b.radius || 4,
                color: b.color || '#fff'
            })),
            particles: this.engine.particles ? (this.engine.particles.particles || []).map(p => ({
                x: p.x,
                y: p.y,
                size: p.size,
                color: p.color || '#fff',
                alpha: p.alpha || 1
            })) : []
        };

        this.history.push(state);

        // Keep buffer size limited (e.g. 10 * 30 = 300 frames)
        if (this.history.length > this.maxDuration / this.snapshotRate) {
            this.history.shift(); // Remove oldest
        }
    }

    applySnapshot(state) {
        // OVERRIDE engine state for rendering
        this.engine._replayState = state;
    }

    getPlaybackState() {
        return this.history[this.playbackIndex] || null;
    }

    // --- Highlight Auto-Save (v0.9.7-beta) ---

    /**
     * Sauvegarde automatique du replay en cours comme "highlight"
     * @param {'victory'|'legendary'|'death'} condition
     */
    autoSaveHighlight(condition) {
        if (this.history.length < 30) return; // Au moins 1 seconde

        try {
            const highlights = this.getSavedHighlights();
            const highlight = {
                condition,
                date: new Date().toISOString(),
                frameCount: this.history.length,
                durationSec: Math.round(this.history.length * this.snapshotRate),
                // On ne sauvegarde pas tous les frames (trop lourd),
                // juste les métadonnées pour identification
                label: condition === 'victory' ? '🏆 Victoire' :
                    condition === 'legendary' ? '💥 Legendary Kill' :
                        '💀 Mort Épique',
            };

            highlights.unshift(highlight);
            // Garder seulement les 3 derniers
            if (highlights.length > 3) highlights.length = 3;

            localStorage.setItem('droper_highlights', JSON.stringify(highlights));
        } catch (e) {
            console.warn('Impossible de sauvegarder le highlight:', e);
        }
    }

    getSavedHighlights() {
        try {
            return JSON.parse(localStorage.getItem('droper_highlights') || '[]');
        } catch {
            return [];
        }
    }
}

