import { DAILY_MODIFIERS, TEMPORARY_EVENTS } from '../../data/events.js';

export class EventManager {
    constructor(app) {
        this.app = app;
        this.save = app.saveManager;

        this.dailyModifier = null;
        this.activeTempEvents = [];
        this.eventProgress = {}; // { eventId: { objId: progress } }

        this.init();
    }

    init() {
        this.loadProgress();
        this.updateRotations();
    }

    loadProgress() {
        const saved = this.save.get('eventProgress') || {};
        this.eventProgress = saved;
    }

    persistProgress() {
        this.save.set('eventProgress', this.eventProgress);
    }

    updateRotations() {
        const now = new Date();

        // --- 1. Daily Modifier Rotation (Day of Year) ---
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        this.dailyModifier = DAILY_MODIFIERS[dayOfYear % DAILY_MODIFIERS.length];

        // --- 2. Temporary Events Rotation ---
        // Basic logic: Cycle through TEMPORARY_EVENTS based on timestamp
        // For simplicity, we'll pick one event that changes every 3 days
        const cycleIndex = Math.floor(dayOfYear / 3) % TEMPORARY_EVENTS.length;
        this.activeTempEvents = [TEMPORARY_EVENTS[cycleIndex]];
    }

    update() {
        // Periodic check for rotations if needed
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
            this.updateRotations();
        }
    }

    getActiveModifiers() {
        const mods = {};

        // Merge Daily Modifiers
        if (this.dailyModifier) {
            Object.assign(mods, this.dailyModifier.modifiers);
        }

        // Flash events (legacy) fallback or override
        if (this.app.flashEventManager) {
            const flashColor = this.app.flashEventManager.getCurrentEvent()?.modifiers;
            if (flashColor) Object.assign(mods, flashColor);
        }

        return mods;
    }

    // --- Objective Tracking ---

    onMatchEnd(stats) {
        // stats: { kills, rank, isVictory, damageTaken, etc. }
        this.activeTempEvents.forEach(event => {
            if (!event.objectives) return;

            event.objectives.forEach(obj => {
                let progress = 0;

                switch (obj.type) {
                    case 'games': progress = 1; break;
                    case 'kills': progress = stats.kills || 0; break;
                    case 'top3': if (stats.rank <= 3) progress = 1; break;
                    case 'win_streak':
                        if (stats.isVictory) progress = 1;
                        else this.resetProgress(event.id, obj.id);
                        break;
                    case 'survive': if (stats.isVictory || stats.rank === 1) progress = 1; break;
                    case 'win_no_damage': if (stats.isVictory && stats.damageTaken === 0) progress = 1; break;
                }

                if (progress > 0) {
                    this.addProgress(event.id, obj.id, progress, obj.target);
                    // Check if reward should be given
                    if (this.getProgress(event.id, obj.id) >= obj.target) {
                        this.claimReward(obj.reward);
                    }
                }
            });
        });

        this.persistProgress();
    }

    addProgress(eventId, objId, amount, target) {
        if (!this.eventProgress[eventId]) this.eventProgress[eventId] = {};
        const current = this.eventProgress[eventId][objId] || 0;
        this.eventProgress[eventId][objId] = Math.min(current + amount, target);
    }

    resetProgress(eventId, objId) {
        if (this.eventProgress[eventId]) {
            this.eventProgress[eventId][objId] = 0;
        }
    }

    getProgress(eventId, objId) {
        return (this.eventProgress[eventId] && this.eventProgress[eventId][objId]) || 0;
    }

    claimReward(reward) {
        if (!reward) return;

        // Use EconomyManager or InventoryManager based on reward type
        if (reward.type === 'coins') {
            this.app.economyManager.addCoins(reward.amount);
            this.app.toast.success(`✨ Récompense d'événement : +${reward.amount} Coins !`);
        } else if (reward.type === 'cosmetic' || reward.type === 'skin' || reward.type === 'emote') {
            // Mocking inventory add for now - usually calls InventoryManager
            this.app.toast.success(`🎉 Débloqué : ${reward.name || reward.cosmId || reward.skinId} !`);
        }
    }

    getTimeRemainingString() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow - now;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return `${h}h ${m}m`;
    }
}
