/* ============================
   DROPER — Données Inventaire
   ============================ */

export const ITEM_CATEGORIES = {
    CRATE: 'crate',
    FRAGMENT: 'fragment',
    BOOSTER: 'booster',
    KEY: 'key',
    MATERIAL: 'material',
};

export const ITEMS = [
    // --- Caisses ---
    {
        id: 'crate_basic',
        name: 'Caisse Basique',
        emoji: '📦',
        description: 'Contient des récompenses aléatoires.',
        category: ITEM_CATEGORIES.CRATE,
        rarity: 'common',
        loot: [
            { type: 'coins', min: 20, max: 80, weight: 50 },
            { type: 'gems', min: 1, max: 5, weight: 25 },
            { type: 'item', itemId: 'fragment_hero', min: 1, max: 2, weight: 20 },
            { type: 'item', itemId: 'booster_xp', min: 1, max: 1, weight: 5 },
        ],
    },
    {
        id: 'crate_rare',
        name: 'Caisse Rare',
        emoji: '🎁',
        description: 'Récompenses plus généreuses.',
        category: ITEM_CATEGORIES.CRATE,
        rarity: 'rare',
        loot: [
            { type: 'coins', min: 80, max: 250, weight: 40 },
            { type: 'gems', min: 5, max: 15, weight: 30 },
            { type: 'item', itemId: 'fragment_hero', min: 2, max: 5, weight: 20 },
            { type: 'item', itemId: 'key_gold', min: 1, max: 1, weight: 10 },
        ],
    },
    {
        id: 'crate_epic',
        name: 'Caisse Épique',
        emoji: '✨',
        description: 'Des trésors épiques t\'attendent !',
        category: ITEM_CATEGORIES.CRATE,
        rarity: 'epic',
        loot: [
            { type: 'coins', min: 200, max: 600, weight: 30 },
            { type: 'gems', min: 15, max: 40, weight: 30 },
            { type: 'item', itemId: 'fragment_hero', min: 5, max: 10, weight: 25 },
            { type: 'item', itemId: 'booster_coins', min: 1, max: 1, weight: 15 },
        ],
    },
    {
        id: 'crate_season',
        name: 'Caisse Saison 1',
        emoji: '🌅',
        description: 'Exclusif à la Saison 1 : L\'Éveil.',
        category: ITEM_CATEGORIES.CRATE,
        rarity: 'legendary',
        loot: [
            { type: 'coins', min: 300, max: 1000, weight: 25 },
            { type: 'gems', min: 20, max: 60, weight: 25 },
            { type: 'item', itemId: 'fragment_hero', min: 5, max: 15, weight: 30 },
            { type: 'item', itemId: 'fragment_season', min: 1, max: 3, weight: 20 },
        ],
    },

    // --- Fragments ---
    {
        id: 'fragment_hero',
        name: 'Fragment de Héros',
        emoji: '🧩',
        description: 'Collecte des fragments pour débloquer des héros.',
        category: ITEM_CATEGORIES.FRAGMENT,
        rarity: 'rare',
    },
    {
        id: 'fragment_season',
        name: 'Fragment Saisonnier',
        emoji: '🌟',
        description: 'Fragment exclusif Saison 1.',
        category: ITEM_CATEGORIES.FRAGMENT,
        rarity: 'epic',
    },

    // --- Boosters ---
    {
        id: 'booster_xp',
        name: 'Booster XP x2',
        emoji: '⚡',
        description: 'Double l\'XP pendant 1 heure.',
        category: ITEM_CATEGORIES.BOOSTER,
        rarity: 'rare',
        duration: 60,
    },
    {
        id: 'booster_coins',
        name: 'Booster Pièces x2',
        emoji: '💰',
        description: 'Double les pièces pendant 1 heure.',
        category: ITEM_CATEGORIES.BOOSTER,
        rarity: 'rare',
        duration: 60,
    },

    // --- Clés ---
    {
        id: 'key_gold',
        name: 'Clé Dorée',
        emoji: '🔑',
        description: 'Ouvre une Caisse Épique.',
        category: ITEM_CATEGORIES.KEY,
        rarity: 'epic',
    },
    {
        id: 'key_season',
        name: 'Clé Saisonnière',
        emoji: '🗝️',
        description: 'Ouvre une Caisse Saison 1.',
        category: ITEM_CATEGORIES.KEY,
        rarity: 'legendary',
    },
];

export function getItemById(id) {
    return ITEMS.find(i => i.id === id) || null;
}

export function getItemsByCategory(cat) {
    return ITEMS.filter(i => i.category === cat);
}
