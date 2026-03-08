/* ============================
   DROPER — Données Boutique (v0.0.3 — 12 offres)
   ============================ */

export const SHOP_OFFERS = [
    // --- OFFRES FLASH (FLASH) ---
    {
        id: 'flash_gold_stack',
        name: 'Petit Pactole',
        emoji: '💰',
        description: 'Un petit boost de pièces pour tes achats.',
        reward: { type: 'coins', amount: 1200 },
        cost: { type: 'gems', amount: 25 },
        category: 'flash',
        rarity: 'rare'
    },
    {
        id: 'flash_epic_fragments',
        name: 'Fragments Épiques x10',
        emoji: '🧩',
        description: 'Fragments de héros aléatoires de rareté Épique.',
        reward: { type: 'item', itemId: 'fragment_hero', amount: 10 },
        cost: { type: 'coins', amount: 1800 },
        category: 'flash',
        rarity: 'epic'
    },
    {
        id: 'flash_basic_crate',
        name: 'Caisse de Secours',
        emoji: '📦',
        description: 'Une caisse basique pour les urgences.',
        reward: { type: 'item', itemId: 'crate_basic', amount: 1 },
        cost: { type: 'coins', amount: 450 },
        category: 'flash',
        rarity: 'common'
    },

    // --- HÉROS & PACKS (HERO) ---
    {
        id: 'pack_tank',
        name: 'Pack Tank',
        emoji: '🛡️',
        description: 'Débloque le Tank + 5 Fragments.',
        reward: { type: 'hero_pack', heroId: 'tank', fragments: 5 },
        cost: { type: 'gems', amount: 180 },
        category: 'hero',
        rarity: 'rare'
    },
    {
        id: 'pack_sniper',
        name: 'Pack Sniper',
        emoji: '🎯',
        description: 'Débloque le Sniper + 5 Fragments.',
        reward: { type: 'hero_pack', heroId: 'sniper', fragments: 5 },
        cost: { type: 'gems', amount: 180 },
        category: 'hero',
        rarity: 'rare'
    },
    {
        id: 'pack_astro',
        name: 'Pack Astro',
        emoji: '🚀',
        description: 'Débloque Astro + 10 Fragments.',
        reward: { type: 'hero_pack', heroId: 'astro', fragments: 10 },
        cost: { type: 'gems', amount: 350 },
        category: 'hero',
        rarity: 'epic'
    },
    {
        id: 'pack_glacier',
        name: 'Pack Glacier',
        emoji: '❄️',
        description: 'Débloque Glacier + 10 Fragments.',
        reward: { type: 'hero_pack', heroId: 'glacier', fragments: 10 },
        cost: { type: 'gems', amount: 320 },
        category: 'hero',
        rarity: 'epic'
    },

    // --- COSMÉTIQUES PREMIUM (COSMETIC) ---
    {
        id: 'cosm_aura_neon',
        name: 'Aura Néon Pulse',
        emoji: '💜',
        description: 'Une aura vibrante qui change de couleur.',
        reward: { type: 'cosmetic', cosmType: 'aura', cosmId: 'neon' },
        cost: { type: 'gems', amount: 120 },
        category: 'cosmetic',
        rarity: 'epic'
    },
    {
        id: 'cosm_aura_stars',
        name: 'Aura Étoilée',
        emoji: '⭐',
        description: 'Des étoiles dorées gravitent autour de toi.',
        reward: { type: 'cosmetic', cosmType: 'aura', cosmId: 'stars' },
        cost: { type: 'gems', amount: 450 },
        category: 'cosmetic',
        rarity: 'legendary'
    },
    {
        id: 'cosm_trail_stars',
        name: 'Trace Étoiles Filantes',
        emoji: '✨',
        description: 'Laisse une traînée d\'étoiles derrière toi.',
        reward: { type: 'cosmetic', cosmType: 'trail', cosmId: 'stars_trail' },
        cost: { type: 'gems', amount: 120 },
        category: 'cosmetic',
        rarity: 'epic'
    },
    {
        id: 'cosm_trail_pixel',
        name: 'Trace Pixel Art',
        emoji: '🕹️',
        description: 'Un style rétro pour tes mouvements.',
        reward: { type: 'cosmetic', cosmType: 'trail', cosmId: 'pixel_trail' },
        cost: { type: 'coins', amount: 2000 },
        category: 'cosmetic',
        rarity: 'rare'
    },
    {
        id: 'cosm_clothing_leather',
        name: 'Blouson Cuir Noir',
        emoji: '🧥',
        description: 'Style biker indémodable.',
        reward: { type: 'cosmetic', cosmType: 'clothing', cosmId: 'leather_jacket' },
        cost: { type: 'coins', amount: 1500 },
        category: 'cosmetic',
        rarity: 'rare'
    },
    {
        id: 'cosm_clothing_sport',
        name: 'Veste de Sport',
        emoji: '🎽',
        description: 'Confort et style sur le terrain.',
        reward: { type: 'cosmetic', cosmType: 'clothing', cosmId: 'sport_jacket' },
        cost: { type: 'gems', amount: 60 },
        category: 'cosmetic',
        rarity: 'common'
    },

    // --- RESSOURCES & CAISSES (CRATE) ---
    {
        id: 'buy_crate_rare',
        name: 'Caisse Rare',
        emoji: '🎁',
        description: 'Contient des objets de qualité Rare ou Épique.',
        reward: { type: 'item', itemId: 'crate_rare', amount: 1 },
        cost: { type: 'gems', amount: 90 },
        category: 'crate',
        rarity: 'rare'
    },
    {
        id: 'buy_crate_epic',
        name: 'Pack Multi-Caisse',
        emoji: '📦',
        description: '3 Caisses Basiques + 1 Caisse Épique.',
        reward: { type: 'item_bundle', items: [{ itemId: 'crate_basic', amount: 3 }, { itemId: 'crate_epic', amount: 1 }] },
        cost: { type: 'gems', amount: 300 },
        category: 'crate',
        rarity: 'epic'
    },
    {
        id: 'currency_coins_large',
        name: 'Malle de Pièces',
        emoji: '📦',
        description: '5000 pièces pour vos améliorations.',
        reward: { type: 'coins', amount: 5000 },
        cost: { type: 'gems', amount: 100 },
        category: 'currency',
        rarity: 'rare'
    },
    {
        id: 'currency_gems_medium',
        name: 'Petit Sac de Gemmes',
        emoji: '💎',
        description: 'Vendu par lot de 200 gemmes.',
        reward: { type: 'gems', amount: 200 },
        cost: { type: 'coins', amount: 10000 },
        category: 'currency',
        rarity: 'epic'
    },

    // --- BOOSTS (BOOST) ---
    {
        id: 'booster_xp_pack',
        name: 'Pack de Boosters XP',
        emoji: '⚡',
        description: '3 Boosters XP pour progresser vite.',
        reward: { type: 'item', itemId: 'booster_xp', amount: 3 },
        cost: { type: 'gems', amount: 100 },
        category: 'boost',
        rarity: 'rare'
    },
    {
        id: 'booster_coins_pack',
        name: 'Pack de Boosters Pièces',
        emoji: '💰',
        description: '3 Boosters de pièces.',
        reward: { type: 'item', itemId: 'booster_coins', amount: 3 },
        cost: { type: 'gems', amount: 100 },
        category: 'boost',
        rarity: 'rare'
    },
];

export function getOffersByCategory(category) {
    return SHOP_OFFERS.filter(o => o.category === category);
}

export function getFlashOffers() {
    return getOffersByCategory('flash');
}
