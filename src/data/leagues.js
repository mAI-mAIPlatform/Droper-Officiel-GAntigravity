/* ============================
   DROPER — Données Ligues / Classement
   ============================ */

export const LEAGUES = [
    {
        id: 'bronze', name: 'Bronze', emoji: '🥉', color: '#cd7f32',
        divisions: [
            { div: 1, label: 'Bronze I', threshold: 0, botMult: 1.0, reward: { type: 'coins', amount: 50, emoji: '🪙' } },
            { div: 2, label: 'Bronze II', threshold: 30, botMult: 1.15, reward: { type: 'coins', amount: 100, emoji: '🪙' } },
            { div: 3, label: 'Bronze III', threshold: 70, botMult: 1.3, reward: { type: 'gems', amount: 5, emoji: '💎' } },
        ],
    },
    {
        id: 'silver', name: 'Argent', emoji: '🥈', color: '#c0c0c0',
        divisions: [
            { div: 1, label: 'Argent I', threshold: 120, botMult: 1.4, reward: { type: 'coins', amount: 200, emoji: '🪙' } },
            { div: 2, label: 'Argent II', threshold: 180, botMult: 1.55, reward: { type: 'gems', amount: 10, emoji: '💎' } },
            { div: 3, label: 'Argent III', threshold: 260, botMult: 1.7, reward: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁' } },
        ],
    },
    {
        id: 'gold', name: 'Or', emoji: '🥇', color: '#fbbf24',
        divisions: [
            { div: 1, label: 'Or I', threshold: 360, botMult: 1.8, reward: { type: 'coins', amount: 400, emoji: '🪙' } },
            { div: 2, label: 'Or II', threshold: 480, botMult: 1.95, reward: { type: 'gems', amount: 20, emoji: '💎' } },
            { div: 3, label: 'Or III', threshold: 620, botMult: 2.1, reward: { type: 'item', itemId: 'crate_epic', amount: 1, emoji: '✨' } },
        ],
    },
    {
        id: 'platinum', name: 'Platine', emoji: '💠', color: '#06b6d4',
        divisions: [
            { div: 1, label: 'Platine I', threshold: 800, botMult: 2.2, reward: { type: 'gems', amount: 30, emoji: '💎' } },
            { div: 2, label: 'Platine II', threshold: 1000, botMult: 2.35, reward: { type: 'item', itemId: 'key_gold', amount: 1, emoji: '🔑' } },
            { div: 3, label: 'Platine III', threshold: 1250, botMult: 2.5, reward: { type: 'item', itemId: 'crate_season', amount: 1, emoji: '🌅' } },
        ],
    },
    {
        id: 'mythic', name: 'Mythique', emoji: '🔮', color: '#8b5cf6',
        divisions: [
            { div: 1, label: 'Mythique I', threshold: 1500, botMult: 2.6, reward: { type: 'gems', amount: 50, emoji: '💎' } },
            { div: 2, label: 'Mythique II', threshold: 1800, botMult: 2.75, reward: { type: 'item', itemId: 'fragment_hero', amount: 10, emoji: '🧩' } },
            { div: 3, label: 'Mythique III', threshold: 2200, botMult: 2.9, reward: { type: 'item', itemId: 'crate_epic', amount: 2, emoji: '✨' } },
        ],
    },
    {
        id: 'legendary', name: 'Légendaire', emoji: '👑', color: '#ef4444',
        divisions: [
            { div: 1, label: 'Légendaire I', threshold: 2800, botMult: 3.0, reward: { type: 'mixed', coins: 1000, gems: 50, emoji: '🔥' } },
            { div: 2, label: 'Légendaire II', threshold: 3500, botMult: 3.2, reward: { type: 'mixed', coins: 1500, gems: 75, emoji: '🔥' } },
            { div: 3, label: 'Légendaire III', threshold: 4200, botMult: 3.4, reward: { type: 'mixed', coins: 2000, gems: 100, emoji: '👑' } },
        ],
    },
    {
        id: 'pro', name: 'Pro', emoji: '🏆', color: '#10b981',
        divisions: [
            { div: 1, label: 'Pro I', threshold: 5000, botMult: 3.6, reward: { type: 'mixed', coins: 2500, gems: 150, emoji: '🏆' } },
            { div: 2, label: 'Pro II', threshold: 6000, botMult: 3.8, reward: { type: 'mixed', coins: 3000, gems: 200, emoji: '🏆' } },
            { div: 3, label: 'Pro III', threshold: 7500, botMult: 4.0, reward: { type: 'mixed', coins: 5000, gems: 300, emoji: '🏆' } },
        ],
    },
];

// Flat list of all divisions in order
export function getAllDivisions() {
    const result = [];
    for (const league of LEAGUES) {
        for (const div of league.divisions) {
            result.push({ ...div, leagueId: league.id, leagueName: league.name, emoji: league.emoji, color: league.color });
        }
    }
    return result;
}

export function getDivisionByRecords(records) {
    const allDivs = getAllDivisions();
    let current = allDivs[0];
    for (const div of allDivs) {
        if (records >= div.threshold) current = div;
    }
    return current;
}

export function getNextDivision(records) {
    const allDivs = getAllDivisions();
    for (const div of allDivs) {
        if (records < div.threshold) return div;
    }
    return null;
}
