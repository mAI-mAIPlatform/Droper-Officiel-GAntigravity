/* ============================
   DROPER — Mastery Rewards Data
   ============================ */

export const MASTERY_LEVELS = 50;
export const XP_PER_MASTERY_LEVEL = 1000;

export const MASTERY_REWARDS = {
    // Shared rewards for all heroes at specific levels
    1: { type: 'coins', amount: 500, emoji: '💰' },
    5: { type: 'gems', amount: 20, emoji: '💎' },
    10: { type: 'emote', emoteId: 'emote_gg', emoji: '🎉', label: 'GG !' },
    15: { type: 'coins', amount: 2000, emoji: '💰' },
    20: { type: 'title', title: 'Disciple', color: '#8b95a8' },
    25: { type: 'item', itemId: 'crate_epic', amount: 1, emoji: '✨' },
    30: { type: 'emote', emoteId: 'emote_cool', emoji: '😎', label: 'Master' },
    40: { type: 'title', title: 'Grand Maître', color: '#a855f7' },
    50: { type: 'special', id: 'mastery_aura', name: 'Aura de Maîtrise', emoji: '👑' }
};

// Hero specific rewards (optional, can be empty or override shared)
export const HERO_SPECIFIC_REWARDS = {
    'soldier': {
        10: { type: 'skin', skinId: 'soldier_master', name: 'Soldat d\'Élite' }
    },
    'tank': {
        10: { type: 'skin', skinId: 'tank_master', name: 'Forteresse Vivante' }
    }
    // ... other heroes
};

export function getMasteryReward(heroId, level) {
    return HERO_SPECIFIC_REWARDS[heroId]?.[level] || MASTERY_REWARDS[level] || null;
}
