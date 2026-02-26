/* ============================
   DROPER — Quêtes de Club (Hebdomadaires)
   ============================ */

export const CLUB_QUESTS = [
    {
        id: 'cq_kills_100',
        name: 'Chasseurs en équipe',
        emoji: '☠️',
        description: 'Éliminer 100 ennemis au total (club entier)',
        type: 'kills',
        target: 100,
        reward: { type: 'coins', amount: 500, emoji: '🪙', label: '500 Pièces par membre' },
    },
    {
        id: 'cq_games_30',
        name: 'Joueurs actifs',
        emoji: '🎮',
        description: 'Jouer 30 parties au total',
        type: 'gamesPlayed',
        target: 30,
        reward: { type: 'gems', amount: 15, emoji: '💎', label: '15 Gemmes par membre' },
    },
    {
        id: 'cq_wins_10',
        name: 'Victoires collectives',
        emoji: '🏆',
        description: 'Remporter 10 matchs',
        type: 'wins',
        target: 10,
        reward: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁', label: 'Caisse Rare par membre' },
    },
    {
        id: 'cq_records_200',
        name: 'Collecteurs de Records',
        emoji: '🎫',
        description: 'Gagner 200 Records au total',
        type: 'records',
        target: 200,
        reward: { type: 'gems', amount: 25, emoji: '💎', label: '25 Gemmes par membre' },
    },
    {
        id: 'cq_goals_15',
        name: 'Tireurs de Cyber-Ball',
        emoji: '⚽',
        description: 'Marquer 15 buts en Cyber-Ball',
        type: 'goals',
        target: 15,
        reward: { type: 'coins', amount: 800, emoji: '🪙', label: '800 Pièces par membre' },
    },
    {
        id: 'cq_zones_20',
        name: 'Maîtres de zone',
        emoji: '⚡',
        description: 'Capturer 20 zones',
        type: 'zoneCaptures',
        target: 20,
        reward: { type: 'item', itemId: 'booster_xp', amount: 2, emoji: '⚡', label: '2 Boosters XP par membre' },
    },
];

export function getWeeklyQuests() {
    // Rotate quests based on week number
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const count = 3;
    const start = weekNum % CLUB_QUESTS.length;
    const quests = [];
    for (let i = 0; i < count; i++) {
        quests.push(CLUB_QUESTS[(start + i) % CLUB_QUESTS.length]);
    }
    return quests;
}
