/* ============================
   DROPER — Données Maps par mode
   ============================ */

const WALL = 'wall';
const BLOCK = 'block';

export const MAPS = {
    // 3v3 maps — petites
    small_arena: {
        id: 'small_arena', name: 'Petite Arène', emoji: '🏟️',
        width: 900, height: 600,
        spawns: {
            0: [{ x: 80, y: 300 }, { x: 80, y: 200 }, { x: 80, y: 400 }],
            1: [{ x: 820, y: 300 }, { x: 820, y: 200 }, { x: 820, y: 400 }],
        },
        obstacles: [
            { type: BLOCK, x: 350, y: 200, w: 40, h: 40 },
            { type: BLOCK, x: 510, y: 200, w: 40, h: 40 },
            { type: BLOCK, x: 350, y: 360, w: 40, h: 40 },
            { type: BLOCK, x: 510, y: 360, w: 40, h: 40 },
            { type: WALL, x: 430, y: 250, w: 40, h: 100 },
        ],
    },
    cyber_corridor: {
        id: 'cyber_corridor', name: 'Corridor Cyber', emoji: '🌃',
        width: 1000, height: 500,
        spawns: {
            0: [{ x: 60, y: 250 }, { x: 60, y: 150 }, { x: 60, y: 350 }],
            1: [{ x: 940, y: 250 }, { x: 940, y: 150 }, { x: 940, y: 350 }],
        },
        obstacles: [
            { type: WALL, x: 300, y: 100, w: 20, h: 150 },
            { type: WALL, x: 300, y: 300, w: 20, h: 150 },
            { type: WALL, x: 680, y: 100, w: 20, h: 150 },
            { type: WALL, x: 680, y: 300, w: 20, h: 150 },
            { type: BLOCK, x: 480, y: 220, w: 40, h: 60 },
        ],
    },

    // Solo / Duo — moyennes
    neon_field: {
        id: 'neon_field', name: 'Champ Néon', emoji: '💡',
        width: 1200, height: 800,
        spawns: {
            0: [{ x: 100, y: 400 }],
            solo: Array.from({ length: 10 }, (_, i) => ({
                x: 150 + Math.floor(Math.random() * 900),
                y: 100 + Math.floor(Math.random() * 600),
            })),
        },
        obstacles: [
            { type: BLOCK, x: 300, y: 250, w: 50, h: 50 },
            { type: BLOCK, x: 600, y: 400, w: 60, h: 40 },
            { type: BLOCK, x: 850, y: 200, w: 40, h: 60 },
            { type: WALL, x: 500, y: 100, w: 20, h: 200 },
            { type: WALL, x: 500, y: 500, w: 20, h: 200 },
            { type: BLOCK, x: 200, y: 550, w: 50, h: 50 },
            { type: BLOCK, x: 900, y: 600, w: 50, h: 50 },
        ],
    },

    // Battle Royale — grande
    wasteland: {
        id: 'wasteland', name: 'Terrain Vague', emoji: '🏜️',
        width: 1600, height: 1000,
        spawns: {
            solo: Array.from({ length: 10 }, (_, i) => ({
                x: 100 + Math.floor(Math.random() * 1400),
                y: 100 + Math.floor(Math.random() * 800),
            })),
        },
        obstacles: [
            { type: WALL, x: 400, y: 200, w: 20, h: 250 },
            { type: WALL, x: 800, y: 100, w: 20, h: 200 },
            { type: WALL, x: 1100, y: 400, w: 20, h: 300 },
            { type: BLOCK, x: 300, y: 600, w: 60, h: 60 },
            { type: BLOCK, x: 600, y: 500, w: 80, h: 40 },
            { type: BLOCK, x: 1000, y: 300, w: 50, h: 50 },
            { type: BLOCK, x: 1300, y: 700, w: 60, h: 60 },
            { type: BLOCK, x: 500, y: 150, w: 40, h: 40 },
            { type: BLOCK, x: 900, y: 800, w: 50, h: 50 },
        ],
    },

    // Cyber-Ball — spéciale
    stadium: {
        id: 'stadium', name: 'Stade Cyber', emoji: '⚽',
        width: 1100, height: 600,
        spawns: {
            0: [{ x: 200, y: 300 }, { x: 150, y: 200 }, { x: 150, y: 400 }],
            1: [{ x: 900, y: 300 }, { x: 950, y: 200 }, { x: 950, y: 400 }],
        },
        obstacles: [
            { type: BLOCK, x: 400, y: 250, w: 30, h: 30 },
            { type: BLOCK, x: 670, y: 250, w: 30, h: 30 },
            { type: BLOCK, x: 400, y: 320, w: 30, h: 30 },
            { type: BLOCK, x: 670, y: 320, w: 30, h: 30 },
        ],
    },

    // Lave Flash — map rectangulaire avec obstacles au centre
    lava_pit: {
        id: 'lava_pit', name: 'Fosse de Lave', emoji: '🌋',
        width: 1400, height: 900,
        spawns: {
            solo: Array.from({ length: 10 }, (_, i) => ({
                x: 200 + Math.floor(Math.random() * 1000),
                y: 150 + Math.floor(Math.random() * 600),
            })),
        },
        obstacles: [
            { type: BLOCK, x: 500, y: 300, w: 60, h: 60 },
            { type: BLOCK, x: 800, y: 450, w: 50, h: 50 },
            { type: WALL, x: 650, y: 200, w: 20, h: 200 },
            { type: WALL, x: 650, y: 500, w: 20, h: 200 },
            { type: BLOCK, x: 350, y: 550, w: 40, h: 40 },
            { type: BLOCK, x: 1000, y: 250, w: 40, h: 40 },
        ],
    },

    // Kill Life — ville 2.5D (obstacles minimaux, le mode gère les bâtiments)
    kill_life_city: {
        id: 'kill_life_city', name: 'Ville Urbaine', emoji: '🏙️',
        width: 1600, height: 1000,
        spawns: {
            solo: Array.from({ length: 10 }, (_, i) => ({
                x: 100 + Math.floor(Math.random() * 1400),
                y: 100 + Math.floor(Math.random() * 800),
            })),
        },
        obstacles: [],
    },

    // Rotation — Maps supplémentaires
    aqua_arena: {
        id: 'aqua_arena', name: 'Arène Aquatique', emoji: '🌊',
        width: 1000, height: 700,
        terrain: 'water',
        spawns: {
            0: [{ x: 80, y: 350 }, { x: 80, y: 250 }, { x: 80, y: 450 }],
            1: [{ x: 920, y: 350 }, { x: 920, y: 250 }, { x: 920, y: 450 }],
            solo: Array.from({ length: 10 }, () => ({
                x: 100 + Math.floor(Math.random() * 800),
                y: 80 + Math.floor(Math.random() * 540),
            })),
        },
        obstacles: [
            { type: BLOCK, x: 400, y: 200, w: 50, h: 50 },
            { type: BLOCK, x: 550, y: 400, w: 50, h: 50 },
            { type: WALL, x: 300, y: 300, w: 20, h: 120 },
            { type: WALL, x: 680, y: 250, w: 20, h: 140 },
        ],
    },

    forest_glade: {
        id: 'forest_glade', name: 'Clairière Verdoyante', emoji: '🌲',
        width: 1100, height: 750,
        terrain: 'grass',
        spawns: {
            0: [{ x: 90, y: 375 }, { x: 90, y: 275 }, { x: 90, y: 475 }],
            1: [{ x: 1010, y: 375 }, { x: 1010, y: 275 }, { x: 1010, y: 475 }],
            solo: Array.from({ length: 10 }, () => ({
                x: 100 + Math.floor(Math.random() * 900),
                y: 80 + Math.floor(Math.random() * 590),
            })),
        },
        obstacles: [
            { type: BLOCK, x: 300, y: 200, w: 45, h: 45 },
            { type: BLOCK, x: 750, y: 500, w: 45, h: 45 },
            { type: BLOCK, x: 500, y: 350, w: 60, h: 40 },
            { type: WALL, x: 200, y: 400, w: 20, h: 180 },
            { type: WALL, x: 850, y: 180, w: 20, h: 160 },
        ],
    },

    circuit_neon: {
        id: 'circuit_neon', name: 'Circuit Néon', emoji: '🏎️',
        width: 1300, height: 850,
        spawns: {
            0: [{ x: 100, y: 425 }, { x: 100, y: 325 }, { x: 100, y: 525 }],
            1: [{ x: 1200, y: 425 }, { x: 1200, y: 325 }, { x: 1200, y: 525 }],
            solo: Array.from({ length: 10 }, () => ({
                x: 120 + Math.floor(Math.random() * 1060),
                y: 80 + Math.floor(Math.random() * 690),
            })),
        },
        obstacles: [
            { type: WALL, x: 350, y: 150, w: 20, h: 250 },
            { type: WALL, x: 900, y: 400, w: 20, h: 280 },
            { type: BLOCK, x: 600, y: 350, w: 70, h: 40 },
            { type: BLOCK, x: 200, y: 550, w: 50, h: 50 },
            { type: BLOCK, x: 1050, y: 200, w: 50, h: 50 },
        ],
    },
};

// Map assignment per mode
export const MODE_MAP_ASSIGNMENT = {
    nanopuces: ['small_arena', 'cyber_corridor'],
    last_survivor: ['wasteland'],
    hack_server: ['cyber_corridor', 'small_arena'],
    cyber_ball: ['stadium'],
    prime_digitale: ['small_arena', 'cyber_corridor'],
    zone_surcharge: ['small_arena', 'neon_field'],
    lave_flash: ['lava_pit'],
    kill_life: ['kill_life_city'],
};

// Rotation quotidienne : maps qui changent toutes les 24h
const ROTATION_POOL = ['small_arena', 'cyber_corridor', 'neon_field', 'aqua_arena', 'forest_glade', 'circuit_neon'];

function getDailySeed() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function getDailyRotationMap() {
    const seed = getDailySeed();
    const index = Math.floor(seededRandom(seed) * ROTATION_POOL.length);
    return MAPS[ROTATION_POOL[index]];
}

export function getMapForMode(modeId) {
    const mapIds = MODE_MAP_ASSIGNMENT[modeId] || ['small_arena'];
    // Pour les modes avec une seule map assignée, utiliser directement
    if (mapIds.length === 1) {
        return MAPS[mapIds[0]];
    }
    // Pour les modes avec plusieurs maps, appliquer la rotation quotidienne
    const seed = getDailySeed();
    const index = Math.floor(seededRandom(seed + modeId.length) * mapIds.length);
    return MAPS[mapIds[index]];
}
