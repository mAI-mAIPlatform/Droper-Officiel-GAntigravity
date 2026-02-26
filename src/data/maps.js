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
};

// Map assignment per mode
export const MODE_MAP_ASSIGNMENT = {
    nanopuces: ['small_arena', 'cyber_corridor'],
    last_survivor: ['wasteland'],
    hack_server: ['cyber_corridor', 'small_arena'],
    cyber_ball: ['stadium'],
    prime_digitale: ['small_arena', 'cyber_corridor'],
    zone_surcharge: ['small_arena', 'neon_field'],
};

export function getMapForMode(modeId) {
    const mapIds = MODE_MAP_ASSIGNMENT[modeId] || ['small_arena'];
    const mapId = mapIds[Math.floor(Math.random() * mapIds.length)];
    return MAPS[mapId];
}
