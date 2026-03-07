/* ============================
   DROPER — Event Manager (v1.0.2)
   Gestion des événements temporaires et flashs
   ============================ */

export const EVENTS = {
    ALIEN_INVASION: {
        id: 'alien_invasion',
        name: 'Invasion Extraterrestre 👽',
        description: 'Des ovnis apparaissent ! Les ennemis sont plus rapides et le ciel s`assombrit.',
        modifiers: {
            enemySpeed: 1.5,
            enemyHp: 1.2,
            gravity: 0.8, // Low gravity
            nightMode: true
        },
        rewards: {
            xpMultiplier: 1.5,
            coinMultiplier: 2.0
        }
    },
    GOLDEN_HOUR: {
        id: 'golden_hour',
        name: 'L`Heure Dorée 🪙',
        description: 'Toutes les pièces ramassées valent double !',
        modifiers: {},
        rewards: {
            coinMultiplier: 2.0
        }
    },
    CHAOS_MODE: {
        id: 'chaos_mode',
        name: 'Mode Chaos 🔥',
        description: 'Tout va deux fois plus vite, y compris vous !',
        modifiers: {
            gameSpeed: 2.0
        },
        rewards: {}
    }
};

export class EventManager {
    constructor(app) {
        this.app = app;
        this.currentEvent = null;
        this.eventEndTime = 0;
    }

    startEvent(eventId, durationMinutes = 60) {
        if (!EVENTS[eventId]) return false;

        this.currentEvent = EVENTS[eventId];
        this.eventEndTime = Date.now() + (durationMinutes * 60 * 1000);

        // Notify the app
        if (this.app.toastManager) {
            this.app.toastManager.success(`✨ Événement Démarré : ${this.currentEvent.name}`);
        }

        console.log(`[EventManager] Started event: ${this.currentEvent.name}`);
        return true;
    }

    stopEvent() {
        if (this.currentEvent) {
            console.log(`[EventManager] Stopped event: ${this.currentEvent.name}`);
        }
        this.currentEvent = null;
        this.eventEndTime = 0;
    }

    update() {
        if (this.currentEvent && Date.now() > this.eventEndTime) {
            this.stopEvent();
            if (this.app.toastManager) {
                this.app.toastManager.info("⏳ L'événement est terminé !");
            }
        }
    }

    getActiveModifiers() {
        if (!this.currentEvent) return null;
        return this.currentEvent.modifiers;
    }

    getActiveRewards() {
        if (!this.currentEvent) return null;
        return this.currentEvent.rewards;
    }
}
