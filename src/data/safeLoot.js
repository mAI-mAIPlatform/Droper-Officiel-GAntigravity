/* ============================
   DROPER — Taux de Drop et Tables de Coffre-fort (v0.7.5)
   ============================ */

import { RARITIES, HEROES } from './heroes.js';
import { getSkinsForHero } from './skins.js';
import { EMOTES } from './emotes.js';

// Distribution globale pour obtenir une rareté spécifique d'un coffre ("Probabilité d'obtenir un coffre de ce type")
export const SAFE_GLOBAL_DISTRIBUTION = [
    { rarity: 2, label: 'Rare', weight: 50 },
    { rarity: 3, label: 'Épique', weight: 25 },
    { rarity: 4, label: 'Mythique', weight: 20 },
    { rarity: 5, label: 'Légendaire', weight: 3 },
    { rarity: 6, label: 'Ultra', weight: 2 }
];

export const SAFE_LOOT_TABLES = {
    // 1=Common (Niveau 1 du Coffre Évolutif, table de base non précisée par l'utilisateur)
    1: [
        { type: 'coins', amount: 50, weight: 70 },
        { type: 'gems', amount: 5, weight: 30 }
    ],
    // 2=Rare
    2: [
        { type: 'gems', amount: 1, weight: 30 },
        { type: 'gems', amount: 2, weight: 15 },
        { type: 'gems', amount: 5, weight: 5 },
        { type: 'coins', amount: 50, weight: 30 },
        { type: 'coins', amount: 100, weight: 15 },
        { type: 'coins', amount: 200, weight: 5 }
    ],
    // 3=Epic
    3: [
        { type: 'skin', rarityFilter: 2, weight: 10 }, // Skin rare
        { type: 'gems', amount: 5, weight: 20 },
        { type: 'gems', amount: 8, weight: 15 },
        { type: 'gems', amount: 10, weight: 5 },
        { type: 'coins', amount: 200, weight: 20 },
        { type: 'coins', amount: 300, weight: 15 },
        { type: 'coins', amount: 400, weight: 5 },
        { type: 'emote', rarityFilter: 2, weight: 10 } // Emote rare
    ],
    // 4=Mythic
    4: [
        { type: 'coins', amount: 500, weight: 20 },
        { type: 'gems', amount: 10, weight: 20 },
        { type: 'coins', amount: 600, weight: 15 },
        { type: 'gems', amount: 12, weight: 15 },
        { type: 'coins', amount: 700, weight: 5 },
        { type: 'gems', amount: 15, weight: 5 },
        { type: 'skin', rarityFilter: 3, weight: 5 }, // Skin epique
        { type: 'skin', rarityFilter: 2, weight: 5 }, // Skin rare
        { type: 'emote', rarityFilter: 2, weight: 5 }, // Emote rare
        { type: 'emote', rarityFilter: 3, weight: 5 } // Emote epique
    ],
    // 5=Legendary
    5: [
        { type: 'gems', amount: 15, weight: 20 },
        { type: 'gems', amount: 18, weight: 15 },
        { type: 'gems', amount: 20, weight: 5 },
        { type: 'coins', amount: 800, weight: 20 },
        { type: 'coins', amount: 900, weight: 15 },
        { type: 'coins', amount: 1000, weight: 5 },
        { type: 'skin', rarityFilter: 3, weight: 5 }, // Skin epique
        { type: 'skin', rarityFilter: 4, weight: 5 }, // Skin mythique
        { type: 'emote', rarityFilter: 3, weight: 5 }, // Emote epique
        { type: 'emote', rarityFilter: 4, weight: 5 } // Emote mythique
    ],
    // 6=Ultra
    6: [
        { type: 'gems', amount: 25, weight: 20 },
        { type: 'gems', amount: 30, weight: 15 },
        { type: 'gems', amount: 50, weight: 5 },
        { type: 'coins', amount: 1200, weight: 20 },
        { type: 'coins', amount: 1500, weight: 15 },
        { type: 'coins', amount: 2000, weight: 5 },
        { type: 'skin', rarityFilter: 5, weight: 8 }, // Skin legendaire
        { type: 'skin', rarityFilter: 6, weight: 2 }, // Skin ultra
        { type: 'emote', rarityFilter: 5, weight: 8 }, // Emote legendaire
        { type: 'emote', rarityFilter: 6, weight: 2 } // Emote ultra
    ]
};

export function rollSafeRarity() {
    let roll = Math.random() * 100;
    for (const dist of SAFE_GLOBAL_DISTRIBUTION) {
        roll -= dist.weight;
        if (roll <= 0) return dist.rarity;
    }
    return 2; // Default to Rare si souci
}

export function rollSafeLoot(rarityValue, skinManager, emoteManager) {
    const table = SAFE_LOOT_TABLES[rarityValue] || SAFE_LOOT_TABLES[1];
    let roll = Math.random() * 100;
    let chosenEntry = null;

    for (const entry of table) {
        roll -= entry.weight;
        if (roll <= 0) {
            chosenEntry = entry;
            break;
        }
    }
    if (!chosenEntry) chosenEntry = table[0]; // fallback

    // Resolve specific cosmetics
    if (chosenEntry.type === 'skin') {
        const reward = tryRollRandomSkin(chosenEntry.rarityFilter, skinManager);
        if (reward) return reward;
        // Fallback to coins if all skins of this rarity are owned
        return { type: 'coins', amount: chosenEntry.rarityFilter * 200 };
    }

    if (chosenEntry.type === 'emote') {
        const reward = tryRollRandomEmote(chosenEntry.rarityFilter, emoteManager);
        if (reward) return reward;
        // Fallback to coins if all emotes of this rarity are owned
        return { type: 'coins', amount: chosenEntry.rarityFilter * 150 };
    }

    // Default gems/coins
    return { type: chosenEntry.type, amount: chosenEntry.amount };
}

function tryRollRandomSkin(rarityValue, skinManager) {
    if (!skinManager) return null;
    const allSkins = [];

    for (const hero of HEROES) {
        const skins = getSkinsForHero(hero.id);
        for (const s of skins) {
            if (s.rarity.value === rarityValue && !skinManager.isOwned(hero.id, s.id)) {
                allSkins.push({ heroId: hero.id, skin: s });
            }
        }
    }

    if (allSkins.length === 0) return null;
    const picked = allSkins[Math.floor(Math.random() * allSkins.length)];
    return { type: 'skin', heroId: picked.heroId, skinId: picked.skin.id, name: picked.skin.name };
}

function tryRollRandomEmote(rarityValue, emoteManager) {
    if (!emoteManager) return null;
    const validEmotes = EMOTES.filter(e => e.rarity.value === rarityValue && !emoteManager.isOwned(e.id));
    if (validEmotes.length === 0) return null;
    const picked = validEmotes[Math.floor(Math.random() * validEmotes.length)];
    return { type: 'emote', emoteId: picked.id, name: picked.label, emoji: picked.emoji };
}
