/* ============================
   DROPER — Données Emotes 😎
   ============================ */

import { RARITIES } from './heroes.js';

export const EMOTES = [
    { id: 'emote_gg', emoji: '🎉', label: 'GG !', sound: 'high', key: 1, rarity: RARITIES.COMMON, price: 0 },
    { id: 'emote_rage', emoji: '😤', label: 'Rage', sound: 'low', key: 2, rarity: RARITIES.COMMON, price: 0 },
    { id: 'emote_laugh', emoji: '😂', label: 'LOL', sound: 'mid', key: 3, rarity: RARITIES.COMMON, price: 0 },
    { id: 'emote_thumbsup', emoji: '👍', label: 'Bien joué', sound: 'high', key: 4, rarity: RARITIES.COMMON, price: 0 },
    { id: 'emote_rip', emoji: '💀', label: 'RIP', sound: 'low', key: 5, rarity: RARITIES.RARE, price: 1000 },
    { id: 'emote_fire', emoji: '🔥', label: 'En feu !', sound: 'high', key: null, rarity: RARITIES.EPIC, price: 2000 },
    { id: 'emote_cool', emoji: '😎', label: 'Cool', sound: 'mid', key: null, rarity: RARITIES.MYTHIC, price: 4000 },
    { id: 'emote_cry', emoji: '😭', label: 'Noooo', sound: 'low', key: null, rarity: RARITIES.RARE, price: 1000 },
    { id: 'emote_love', emoji: '❤️', label: 'Love', sound: 'high', key: null, rarity: RARITIES.EPIC, price: 2000 },
    { id: 'emote_think', emoji: '🤔', label: 'Hmm', sound: 'mid', key: null, rarity: RARITIES.MYTHIC, price: 4000 },
    { id: 'emote_flex', emoji: '💪', label: 'Flex', sound: 'high', key: null, rarity: RARITIES.LEGENDARY, price: 5000 },
    { id: 'emote_sleep', emoji: '😴', label: 'Zzz', sound: 'low', key: null, rarity: RARITIES.RARE, price: 1000 },
    { id: 'emote_clap', emoji: '👏', label: 'Bravo', sound: 'mid', key: null, rarity: RARITIES.EPIC, price: 2000 },
    { id: 'emote_shock', emoji: '😱', label: 'Choqué', sound: 'high', key: null, rarity: RARITIES.LEGENDARY, price: 5000 },
    { id: 'emote_wave', emoji: '👋', label: 'Salut', sound: 'mid', key: null, rarity: RARITIES.ULTRA, price: 7000, isEvent: true, eventPrice: 150 },
];

export function getEmoteByKey(key) {
    return EMOTES.find(e => e.key === key);
}

export function getEquippableEmotes() {
    return EMOTES;
}
