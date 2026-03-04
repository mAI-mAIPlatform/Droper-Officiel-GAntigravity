/* ============================
   DROPER — Trails Data (v0.9.7-beta)
   Traces de pas personnalisées
   ============================ */

export const TRAILS = [
    {
        id: 'none',
        name: 'Aucune',
        emoji: '❌',
        rarity: 'free',
        seasonTier: 0,
        spawnParticle(x, y) { return null; },
    },
    {
        id: 'flames',
        name: 'Flammes',
        emoji: '🔥',
        rarity: 'rare',
        seasonTier: 10,
        spawnParticle(x, y) {
            return {
                x: x + (Math.random() - 0.5) * 6,
                y: y + (Math.random() - 0.5) * 6,
                vx: (Math.random() - 0.5) * 10,
                vy: -20 - Math.random() * 15,
                size: 3 + Math.random() * 3,
                life: 0.4 + Math.random() * 0.3,
                maxLife: 0.7,
                color: `hsl(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`,
            };
        },
    },
    {
        id: 'stars_trail',
        name: 'Étoiles Filantes',
        emoji: '✨',
        rarity: 'epic',
        seasonTier: 20,
        spawnParticle(x, y) {
            return {
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: 2 + Math.random() * 3,
                life: 0.5 + Math.random() * 0.4,
                maxLife: 0.9,
                color: `hsl(${40 + Math.random() * 20}, 100%, 70%)`,
            };
        },
    },
    {
        id: 'pixel_trail',
        name: 'Pixels Rétro',
        emoji: '🕹️',
        rarity: 'rare',
        seasonTier: 8,
        spawnParticle(x, y) {
            return {
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                vx: 0,
                vy: 0,
                size: 4,
                life: 0.3 + Math.random() * 0.3,
                maxLife: 0.6,
                color: ['#ef4444', '#22c55e', '#4a9eff', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 5)],
                isSquare: true,
            };
        },
    },
    {
        id: 'ice_trail',
        name: 'Gel',
        emoji: '🧊',
        rarity: 'epic',
        seasonTier: 30,
        spawnParticle(x, y) {
            return {
                x: x + (Math.random() - 0.5) * 4,
                y: y + (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 5,
                vy: -5 - Math.random() * 5,
                size: 2 + Math.random() * 2,
                life: 0.6 + Math.random() * 0.4,
                maxLife: 1.0,
                color: `rgba(150, 220, 255, ${0.5 + Math.random() * 0.3})`,
            };
        },
    },
    {
        id: 'shadow_trail',
        name: 'Ombres',
        emoji: '🖤',
        rarity: 'mythic',
        seasonTier: 45,
        spawnParticle(x, y) {
            return {
                x, y,
                vx: 0,
                vy: 0,
                size: 6 + Math.random() * 4,
                life: 0.8 + Math.random() * 0.4,
                maxLife: 1.2,
                color: `rgba(80, 0, 120, ${0.3 + Math.random() * 0.2})`,
            };
        },
    },
];

export function getTrailById(id) {
    return TRAILS.find(t => t.id === id) || TRAILS[0];
}
