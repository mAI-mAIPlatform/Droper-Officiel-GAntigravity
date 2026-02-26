/* ============================
   DROPER — Pistes musicales par mode 🎵
   ============================ */

export const MUSIC_TRACKS = {
    menu: {
        id: 'menu', name: 'Ambiance Menu', bpm: 90, mood: 'chill',
        baseFreq: 220, scale: [0, 3, 7, 10, 12],
        volume: 0.12, filterFreq: 800,
    },
    ranked: {
        id: 'ranked', name: 'Mode Classé — Dynamique', bpm: 140, mood: 'intense',
        baseFreq: 330, scale: [0, 2, 5, 7, 10, 12],
        volume: 0.15, filterFreq: 2000,
    },
    nanopuces: {
        id: 'nanopuces', name: 'Nanopuces — Synthwave', bpm: 120, mood: 'synth',
        baseFreq: 261, scale: [0, 4, 7, 11, 12],
        volume: 0.13, filterFreq: 1200,
    },
    last_survivor: {
        id: 'last_survivor', name: 'Last Survivor — Tension', bpm: 100, mood: 'dark',
        baseFreq: 196, scale: [0, 1, 5, 7, 8],
        volume: 0.14, filterFreq: 600,
    },
    hack_server: {
        id: 'hack_server', name: 'Hack — Glitch', bpm: 130, mood: 'glitch',
        baseFreq: 294, scale: [0, 3, 6, 7, 10],
        volume: 0.13, filterFreq: 1500,
    },
    cyber_ball: {
        id: 'cyber_ball', name: 'Cyber-Ball — Sport', bpm: 135, mood: 'energy',
        baseFreq: 350, scale: [0, 2, 4, 7, 9, 12],
        volume: 0.14, filterFreq: 1800,
    },
    prime_digitale: {
        id: 'prime_digitale', name: 'Prime — Combat', bpm: 145, mood: 'aggressive',
        baseFreq: 370, scale: [0, 1, 4, 5, 7, 8, 11],
        volume: 0.15, filterFreq: 2200,
    },
    zone_surcharge: {
        id: 'zone_surcharge', name: 'Zone — Pulse', bpm: 110, mood: 'pulse',
        baseFreq: 246, scale: [0, 2, 3, 7, 8, 10],
        volume: 0.12, filterFreq: 1000,
    },
};

export function getTrackForMode(modeId) {
    return MUSIC_TRACKS[modeId] || MUSIC_TRACKS.menu;
}
