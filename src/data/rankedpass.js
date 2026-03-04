/* ============================
   DROPER — Ranked Pass (Saison 1)
   ============================ */

export const RANKED_PASS = {
    id: "ranked_s1",
    name: "Saison 1 Classée : Ascension",
    description: "Gagnez des points de rang pour débloquer des récompenses exclusives à la saison.",
    xpPerTier: 250, // 250 RP per tier
    maxTier: 20,
    tiers: [
        { tier: 1, free: { type: 'coins', amount: 300, emoji: '🪙' }, premium: { type: 'item', itemId: 'skin_cyber_ninja_neon', amount: 1, emoji: '👕' } },
        { tier: 2, free: { type: 'gems', amount: 10, emoji: '💎' }, premium: { type: 'item', itemId: 'emote_gg', amount: 1, emoji: '💬' } },
        { tier: 3, free: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁' }, premium: { type: 'coins', amount: 1000, emoji: '🪙' } },
        { tier: 4, free: { type: 'coins', amount: 500, emoji: '🪙' }, premium: { type: 'item', itemId: 'aura_flame', amount: 1, emoji: '🔥' } },
        { tier: 5, free: { type: 'gems', amount: 20, emoji: '💎' }, premium: { type: 'item', itemId: 'skin_titan_gold', amount: 1, emoji: '👕' } },
        { tier: 6, free: { type: 'item', itemId: 'crate_epic', amount: 1, emoji: '✨' }, premium: { type: 'item', itemId: 'emote_cry', amount: 1, emoji: '💬' } },
        { tier: 7, free: { type: 'coins', amount: 750, emoji: '🪙' }, premium: { type: 'gems', amount: 50, emoji: '💎' } },
        { tier: 8, free: { type: 'item', itemId: 'fragment_hero', amount: 5, emoji: '🧩' }, premium: { type: 'item', itemId: 'trail_stars', amount: 1, emoji: '✨' } },
        { tier: 9, free: { type: 'gems', amount: 30, emoji: '💎' }, premium: { type: 'item', itemId: 'crate_season', amount: 2, emoji: '🌅' } },
        { tier: 10, free: { type: 'item', itemId: 'key_gold', amount: 1, emoji: '🔑' }, premium: { type: 'item', itemId: 'skin_glacier_ice', amount: 1, emoji: '👕' } },
        { tier: 11, free: { type: 'coins', amount: 1000, emoji: '🪙' }, premium: { type: 'item', itemId: 'emote_rage', amount: 1, emoji: '💬' } },
        { tier: 12, free: { type: 'gems', amount: 40, emoji: '💎' }, premium: { type: 'item', itemId: 'aura_lightning', amount: 1, emoji: '⚡' } },
        { tier: 13, free: { type: 'item', itemId: 'crate_epic', amount: 1, emoji: '✨' }, premium: { type: 'coins', amount: 2500, emoji: '🪙' } },
        { tier: 14, free: { type: 'item', itemId: 'fragment_hero', amount: 10, emoji: '🧩' }, premium: { type: 'item', itemId: 'trail_fire', amount: 1, emoji: '🔥' } },
        { tier: 15, free: { type: 'gems', amount: 50, emoji: '💎' }, premium: { type: 'item', itemId: 'skin_astro_void', amount: 1, emoji: '👕' } },
        { tier: 16, free: { type: 'item', itemId: 'crate_season', amount: 1, emoji: '🌅' }, premium: { type: 'item', itemId: 'emote_laugh', amount: 1, emoji: '💬' } },
        { tier: 17, free: { type: 'coins', amount: 1500, emoji: '🪙' }, premium: { type: 'gems', amount: 100, emoji: '💎' } },
        { tier: 18, free: { type: 'item', itemId: 'key_gold', amount: 2, emoji: '🔑' }, premium: { type: 'item', itemId: 'aura_shadow', amount: 1, emoji: '🌑' } },
        { tier: 19, free: { type: 'gems', amount: 75, emoji: '💎' }, premium: { type: 'item', itemId: 'trail_rainbow', amount: 1, emoji: '🌈' } },
        { tier: 20, free: { type: 'item', itemId: 'crate_season', amount: 2, emoji: '🌅' }, premium: { type: 'item', itemId: 'skin_champion_s1', amount: 1, emoji: '🏆' } },
    ]
};
