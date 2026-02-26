/* ============================
   DROPER — Thèmes Saisonniers 🌅
   ============================ */

export const SEASON_THEMES = {
    saison_1: {
        id: 'saison_1',
        name: 'Saison 1 — Neon Night',
        emoji: '🌅',
        // Map
        bgGradient: ['#0a0e1a', '#111827'],
        gridColor: 'rgba(74, 158, 255, 0.06)',
        borderColor: 'rgba(74, 158, 255, 0.15)',
        obstacleColor: 'rgba(74, 158, 255, 0.3)',
        obstacleGlow: '#4a9eff',
        // UI
        accentColor: '#4a9eff',
        accentGradient: 'linear-gradient(135deg, #4a9eff, #2563eb)',
        cardBorder: 'rgba(74, 158, 255, 0.15)',
        starColor: 'rgba(74, 158, 255, 0.4)',
        // Particles
        particleColors: ['#4a9eff', '#60a5fa', '#93c5fd'],
    },
    saison_2: {
        id: 'saison_2',
        name: 'Saison 2 — Cyber Inferno',
        emoji: '🔥',
        bgGradient: ['#1a0a0a', '#27111a'],
        gridColor: 'rgba(239, 68, 68, 0.06)',
        borderColor: 'rgba(239, 68, 68, 0.15)',
        obstacleColor: 'rgba(239, 68, 68, 0.3)',
        obstacleGlow: '#ef4444',
        accentColor: '#ef4444',
        accentGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        cardBorder: 'rgba(239, 68, 68, 0.15)',
        starColor: 'rgba(239, 68, 68, 0.4)',
        particleColors: ['#ef4444', '#f87171', '#fca5a5'],
    },
    saison_3: {
        id: 'saison_3',
        name: 'Saison 3 — Toxic Jungle',
        emoji: '☣️',
        bgGradient: ['#0a1a0a', '#112718'],
        gridColor: 'rgba(34, 197, 94, 0.06)',
        borderColor: 'rgba(34, 197, 94, 0.15)',
        obstacleColor: 'rgba(34, 197, 94, 0.3)',
        obstacleGlow: '#22c55e',
        accentColor: '#22c55e',
        accentGradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
        cardBorder: 'rgba(34, 197, 94, 0.15)',
        starColor: 'rgba(34, 197, 94, 0.4)',
        particleColors: ['#22c55e', '#4ade80', '#86efac'],
    },
    saison_4: {
        id: 'saison_4',
        name: 'Saison 4 — Void Storm',
        emoji: '🌀',
        bgGradient: ['#0e0a1a', '#1a1127'],
        gridColor: 'rgba(168, 85, 247, 0.06)',
        borderColor: 'rgba(168, 85, 247, 0.15)',
        obstacleColor: 'rgba(168, 85, 247, 0.3)',
        obstacleGlow: '#a855f7',
        accentColor: '#a855f7',
        accentGradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
        cardBorder: 'rgba(168, 85, 247, 0.15)',
        starColor: 'rgba(168, 85, 247, 0.4)',
        particleColors: ['#a855f7', '#c084fc', '#d8b4fe'],
    },
};

export function getCurrentSeasonTheme() {
    return SEASON_THEMES.saison_1;
}

export function getSeasonTheme(seasonId) {
    return SEASON_THEMES[seasonId] || SEASON_THEMES.saison_1;
}
