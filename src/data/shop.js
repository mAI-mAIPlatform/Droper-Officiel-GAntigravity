/* ============================
   DROPER — Données Boutique (v0.0.3 — 12 offres)
   ============================ */

export const SHOP_OFFERS = [
    // --- FLASH ---
    {
        id: 'mega_coins',
        name: 'Mega Pack de Pièces',
        emoji: '🪙',
        description: 'Un énorme pack de pièces.',
        reward: { type: 'coins', amount: 5000 },
        cost: { type: 'gems', amount: 80 },
        category: 'flash',
    },
    {
        id: 'flash_crate',
        name: 'Caisse Flash',
        emoji: '📦',
        description: 'Caisse basique à prix réduit !',
        reward: { type: 'item', itemId: 'crate_basic', amount: 1 },
        cost: { type: 'coins', amount: 800 },
        category: 'flash',
    },

    // --- PACKS HÉROS ---
    {
        id: 'pack_tank',
        name: 'Pack Tank',
        emoji: '🛡️',
        description: 'Débloque le Tank + 5 Fragments.',
        reward: { type: 'hero_pack', heroId: 'tank', fragments: 5 },
        cost: { type: 'gems', amount: 200 },
        category: 'hero',
    },
    {
        id: 'pack_sniper',
        name: 'Pack Sniper',
        emoji: '🎯',
        description: 'Débloque le Sniper + 5 Fragments.',
        reward: { type: 'hero_pack', heroId: 'sniper', fragments: 5 },
        cost: { type: 'gems', amount: 200 },
        category: 'hero',
    },
    {
        id: 'pack_astro',
        name: 'Pack Astro',
        emoji: '🚀',
        description: 'Débloque Astro + 10 Fragments.',
        reward: { type: 'hero_pack', heroId: 'astro', fragments: 10 },
        cost: { type: 'gems', amount: 400 },
        category: 'hero',
    },
    {
        id: 'pack_glacier',
        name: 'Pack Glacier',
        emoji: '❄️',
        description: 'Débloque Glacier + 10 Fragments.',
        reward: { type: 'hero_pack', heroId: 'glacier', fragments: 10 },
        cost: { type: 'gems', amount: 350 },
        category: 'hero',
    },

    // --- CAISSES ---
    {
        id: 'buy_crate_rare',
        name: 'Caisse Rare',
        emoji: '🎁',
        description: 'Récompenses plus généreuses.',
        reward: { type: 'item', itemId: 'crate_rare', amount: 1 },
        cost: { type: 'gems', amount: 120 },
        category: 'crate',
    },
    {
        id: 'buy_crate_epic',
        name: 'Caisse Épique + Clé',
        emoji: '✨',
        description: 'Caisse Épique avec la Clé Dorée.',
        reward: { type: 'item_bundle', items: [{ itemId: 'crate_epic', amount: 1 }, { itemId: 'key_gold', amount: 1 }] },
        cost: { type: 'gems', amount: 350 },
        category: 'crate',
    },
    {
        id: 'buy_safe',
        name: 'Coffre-fort',
        emoji: '🔒',
        description: 'Ouvre un mystérieux Coffre-fort.',
        reward: { type: 'item', itemId: 'crate_safe', amount: 1 },
        cost: { type: 'coins', amount: 100 },
        category: 'crate',
    },
    {
        id: 'buy_event_tokens',
        name: 'Jetons d\'Événement x50',
        emoji: '🎟️',
        description: 'Achète de la monnaie événementielle.',
        reward: { type: 'eventTokens', amount: 50 },
        cost: { type: 'gems', amount: 20 },
        category: 'season',
    },

    // --- SAISON ---
    {
        id: 'season_crate',
        name: 'Caisse Saison 1',
        emoji: '🌅',
        description: 'Exclusif Saison 1 + Clé.',
        reward: { type: 'item_bundle', items: [{ itemId: 'crate_season', amount: 1 }, { itemId: 'key_season', amount: 1 }] },
        cost: { type: 'gems', amount: 500 },
        category: 'season',
    },
    {
        id: 'season_fragments',
        name: 'Fragments Saisonniers x5',
        emoji: '🌟',
        description: 'Fragments exclusifs S1.',
        reward: { type: 'item', itemId: 'fragment_season', amount: 5 },
        cost: { type: 'gems', amount: 300 },
        category: 'season',
    },

    // --- BOOSTS ---
    {
        id: 'starter_pack',
        name: 'Pack Débutant',
        emoji: '🎁',
        description: 'Tout pour bien commencer.',
        reward: { type: 'mixed', coins: 2000, gems: 50 },
        cost: { type: 'gems', amount: 100 },
        category: 'boost',
    },
    {
        id: 'starter_pro',
        name: 'Starter Pro',
        emoji: '🛡️',
        description: 'Pour les compétiteurs sérieux.',
        reward: { type: 'mixed', coins: 10000, gems: 250 },
        cost: { type: 'gems', amount: 400 },
        category: 'boost',
    },
    {
        id: 'starter_elite',
        name: 'Starter Elite',
        emoji: '👑',
        description: 'Le pack ultime du champion.',
        reward: { type: 'mixed', coins: 50000, gems: 1000 },
        cost: { type: 'gems', amount: 1200 },
        category: 'boost',
    },
    {
        id: 'xp_boost',
        name: 'Boost XP x2',
        emoji: '⚡',
        description: 'Double ton XP pendant 1 heure.',
        reward: { type: 'item', itemId: 'booster_xp', amount: 1 },
        cost: { type: 'gems', amount: 50 },
        category: 'boost',
    },
    {
        id: 'coin_boost',
        name: 'Boost Pièces x2',
        emoji: '💰',
        description: 'Double les pièces pendant 1 heure.',
        reward: { type: 'item', itemId: 'booster_coins', amount: 1 },
        cost: { type: 'gems', amount: 50 },
        category: 'boost',
    },
    // --- PUCES (NANO-MODS) v0.2.4 ---
    {
        id: 'chip_speed',
        name: 'Puce de Vitesse',
        emoji: '💨',
        description: 'Boost de vitesse (+30%) pendant 10s.',
        cost: { type: 'coins', amount: 150 },
        category: 'chips',
    },
    {
        id: 'chip_tir',
        name: 'Puce de Tir',
        emoji: '🔥',
        description: 'Vitesse de tir accrue (+50%) pendant 10s.',
        cost: { type: 'coins', amount: 150 },
        category: 'chips',
    },

    // --- COSMETIQUES (v0.9.9) ---
    {
        id: 'cosm_aura_neon',
        name: 'Aura Néon',
        emoji: '💜',
        description: 'Débloque l\'Aura Néon Pulse.',
        reward: { type: 'cosmetic', cosmType: 'aura', cosmId: 'neon' },
        cost: { type: 'gems', amount: 150 },
        category: 'cosmetic',
    },
    {
        id: 'cosm_trail_stars',
        name: 'Trace Étoiles',
        emoji: '✨',
        description: 'Débloque la Trace Étoiles Filantes.',
        reward: { type: 'cosmetic', cosmType: 'trail', cosmId: 'stars_trail' },
        cost: { type: 'gems', amount: 150 },
        category: 'cosmetic',
    },
    {
        id: 'cosm_aura_shadow',
        name: 'Aura Ombre',
        emoji: '🖤',
        description: 'Débloque l\'Aura Ombre Noire.',
        reward: { type: 'cosmetic', cosmType: 'aura', cosmId: 'shadow' },
        cost: { type: 'gems', amount: 250 },
        category: 'cosmetic',
    },
];

export function getOffersByCategory(category) {
    return SHOP_OFFERS.filter(o => o.category === category);
}

export function getFlashOffers() {
    return getOffersByCategory('flash');
}
