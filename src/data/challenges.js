/* ============================
   DROPER — Données Challenges Quotidiens
   ============================ */

export const DAILY_CHALLENGES = [
    {
        id: 'challenge_survive_10',
        title: 'Survivre 10 min (Mode Survie)',
        type: 'time',
        target: 600,
        reward: { type: 'item', itemId: 'crate_basic', amount: 1, emoji: '📦', label: '1 Caisse' },
    },
    {
        id: 'challenge_kills_50',
        title: 'Éliminer 50 ennemis en une partie',
        type: 'kills_single',
        target: 50,
        reward: { type: 'coins', amount: 300, emoji: '🪙', label: '300 Pièces' },
    },
    {
        id: 'challenge_wave_10',
        title: 'Atteindre la vague 10',
        type: 'wave',
        target: 10,
        reward: { type: 'gems', amount: 15, emoji: '💎', label: '15 Gemmes' },
    },
    {
        id: 'challenge_no_hit_3',
        title: 'Survivre 3 vagues sans être touché',
        type: 'no_hit_waves',
        target: 3,
        reward: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁', label: '1 Caisse Rare' },
    },
    {
        id: 'challenge_boss_2',
        title: 'Vaincre 2 boss en une partie',
        type: 'boss_kills_single',
        target: 2,
        reward: { type: 'item', itemId: 'key_gold', amount: 1, emoji: '🔑', label: '1 Clé Dorée' },
    },
    {
        id: 'challenge_score_1000',
        title: 'Obtenir un score de 1000+',
        type: 'score_single',
        target: 1000,
        reward: { type: 'item', itemId: 'booster_xp', amount: 1, emoji: '⚡', label: '1 Booster XP' },
    },
    {
        id: 'challenge_speed_wave5',
        title: 'Atteindre la vague 5 en moins de 3 min',
        type: 'speed_wave',
        target: 180,
        reward: { type: 'gems', amount: 20, emoji: '💎', label: '20 Gemmes' },
    },
];

export function getDailyChallenge() {
    // Rotation basée sur le jour
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return DAILY_CHALLENGES[dayIndex % DAILY_CHALLENGES.length];
}
