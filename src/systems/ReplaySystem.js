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
            bullets: this.engine.bullets.map(b => ({
                x: b.x,
                y: b.y,
                radius: b.radius,
                color: b.color
            })),
            particles: this.engine.gameMode.particles ? [...this.engine.gameMode.particles] : []
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
}
