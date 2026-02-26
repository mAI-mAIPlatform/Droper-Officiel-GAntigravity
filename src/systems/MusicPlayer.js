/* ============================
   DROPER — Music Player (Web Audio Procedural) 🎵
   ============================ */

import { getTrackForMode } from '../data/musicTracks.js';

export class MusicPlayer {
    constructor() {
        this.ctx = null;
        this.playing = false;
        this.currentTrack = null;
        this.gainNode = null;
        this.oscillators = [];
        this.intervalId = null;
        this.noteIndex = 0;
        this.muted = false;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination);
        this.gainNode.gain.value = 0.12;
    }

    play(modeId) {
        this.stop();
        if (!this.ctx) this.init();
        if (this.muted) return;

        const track = getTrackForMode(modeId);
        this.currentTrack = track;
        this.gainNode.gain.value = track.volume || 0.12;
        this.noteIndex = 0;

        const interval = (60 / track.bpm) * 1000;

        this.intervalId = setInterval(() => {
            this.playNote(track);
        }, interval);

        this.playing = true;
    }

    playNote(track) {
        if (!this.ctx || this.muted) return;

        const now = this.ctx.currentTime;
        const duration = (60 / track.bpm) * 0.8;

        // Pick note from scale
        const scaleNote = track.scale[this.noteIndex % track.scale.length];
        const freq = track.baseFreq * Math.pow(2, scaleNote / 12);

        // Main oscillator
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = this.getOscType(track.mood);
        osc.frequency.setValueAtTime(freq, now);

        // Filter
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(track.filterFreq || 1000, now);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.gainNode);

        // Envelope
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc.stop(now + duration + 0.1);

        // Sub bass (every 4 notes)
        if (this.noteIndex % 4 === 0) {
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(freq / 2, now);
            sub.connect(subGain);
            subGain.connect(this.gainNode);
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);
            sub.start(now);
            sub.stop(now + duration * 1.5 + 0.1);
        }

        this.noteIndex++;

        // Add variation — random octave jump
        if (Math.random() < 0.15) {
            this.noteIndex += Math.floor(Math.random() * 3);
        }
    }

    getOscType(mood) {
        switch (mood) {
            case 'intense': case 'aggressive': return 'sawtooth';
            case 'glitch': return 'square';
            case 'dark': case 'pulse': return 'triangle';
            case 'chill': case 'synth': return 'sine';
            default: return 'sine';
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.playing = false;
        this.currentTrack = null;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stop();
        }
        return this.muted;
    }

    setVolume(vol) {
        if (this.gainNode) {
            this.gainNode.gain.value = Math.max(0, Math.min(1, vol));
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
}
