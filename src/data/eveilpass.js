/* ============================
   DROPER — Données Éveil Pass (10 paliers, monnaie 🌅)
   ============================ */

export const EVEIL_PASS = {
    id: 'eveil_pass',
    name: 'Éveil Pass',
    emoji: '🌅',
    currency: 'eveil_tokens',
    maxTier: 10,
    tokensPerTier: 5,
    tiers: [
        { tier: 1, cost: 5, reward: { type: 'coins', amount: 200, emoji: '🪙', label: '200 Pièces' } },
        { tier: 2, cost: 5, reward: { type: 'gems', amount: 10, emoji: '💎', label: '10 Gemmes' } },
        { tier: 3, cost: 5, reward: { type: 'item', itemId: 'crate_basic', amount: 2, emoji: '📦', label: '2 Caisses' } },
        { tier: 4, cost: 5, reward: { type: 'coins', amount: 400, emoji: '🪙', label: '400 Pièces' } },
        { tier: 5, cost: 5, reward: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁', label: '1 Caisse Rare' } },
        { tier: 6, cost: 5, reward: { type: 'gems', amount: 20, emoji: '💎', label: '20 Gemmes' } },
        { tier: 7, cost: 5, reward: { type: 'item', itemId: 'booster_xp', amount: 1, emoji: '⚡', label: 'Booster XP' } },
        { tier: 8, cost: 5, reward: { type: 'coins', amount: 600, emoji: '🪙', label: '600 Pièces' } },
        { tier: 9, cost: 5, reward: { type: 'item', itemId: 'key_gold', amount: 1, emoji: '🔑', label: 'Clé Dorée' } },
        { tier: 10, cost: 5, reward: { type: 'item', itemId: 'crate_season', amount: 1, emoji: '🌅', label: 'Caisse S1' } },
    ],
};
