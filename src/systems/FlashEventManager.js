/* ============================
   DROPER — Flash Event Manager (v0.9.7-beta)
   Modes temporaires avec rotation 24h
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

const FLASH_EVENTS = [
    {
        id: 'zero_gravity',
        name: 'Gravité Zéro',
        emoji: '🪐',
        description: 'Les projectiles rebondissent sur les murs et les joueurs flottent !',
        color: '#a855f7',
        modifiers: {
            playerSpeedMult: 1.3,
            bulletBouncesEnabled: true,
            playerFloatEffect: true,
            gravityMult: 0.3,
        }
    },
    {
        id: 'speed_x2',
        name: 'Hypervitesse',
        emoji: '⚡',
        description: 'Tout va 2x plus vite — joueurs, ennemis ET projectiles !',
        color: '#fbbf24',
        modifiers: {
            playerSpeedMult: 2.0,
            enemySpeedMult: 2.0,
            bulletSpeedMult: 2.0,
            shootRateMult: 0.5,
        }
    },
    {
        id: 'explosive_ammo',
        name: 'Munitions Explosives',
        emoji: '💥',
        description: 'Chaque tir explose en AOE au contact ! Dégâts de zone garantis.',
        color: '#ef4444',
        modifiers: {
            bulletAOE: true,
            bulletAOERadius: 60,
            bulletDamageMult: 0.7,
            screenShakeOnHit: true,
        }
    },
    {
        id: 'glass_cannon',
        name: 'Canon de Verre',
        emoji: '🔮',
        description: 'Dégâts x3 mais HP divisés par 2 pour tout le monde !',
        color: '#06b6d4',
        modifiers: {
            damageMult: 3.0,
            hpMult: 0.5,
        }
    },
    {
        id: 'vampire_mode',
        name: 'Mode Vampire',
        emoji: '🧛',
        description: 'Chaque kill restaure 30% de tes HP max !',
        color: '#dc2626',
        modifiers: {
            vampireHeal: 0.3,
            nightOverlay: true,
        }
    },
];

export class FlashEventManager {
    constructor() {
        this.events = FLASH_EVENTS;
        this.currentEvent = null;
    }

    getCurrentEvent() {
        // Rotation basée sur le jour de l'année
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const index = dayOfYear % this.events.length;
        this.currentEvent = this.events[index];
        return this.currentEvent;
    }

    getTimeUntilNextEvent() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes, totalMs: diff };
    }

    getNextEvent() {
        const current = this.getCurrentEvent();
        const currentIndex = this.events.indexOf(current);
        return this.events[(currentIndex + 1) % this.events.length];
    }

    applyModifiers(engine) {
        const event = this.getCurrentEvent();
        if (!event) return;
        const mods = event.modifiers;

        // Stocker les modificateurs sur le moteur pour que les systèmes les lisent
        engine._flashModifiers = mods;

        toast.info(`⚡ Événement Flash : ${event.emoji} ${event.name} !`);
    }
}

export { FLASH_EVENTS };
