/* ============================
   DROPER — Données Emotes 😎
   ============================ */

export const EMOTES = [
    { id: 'emote_gg', emoji: '🎉', label: 'GG !', sound: 'high', key: 1 },
    { id: 'emote_rage', emoji: '😤', label: 'Rage', sound: 'low', key: 2 },
    { id: 'emote_laugh', emoji: '😂', label: 'LOL', sound: 'mid', key: 3 },
    { id: 'emote_thumbsup', emoji: '👍', label: 'Bien joué', sound: 'high', key: 4 },
    { id: 'emote_rip', emoji: '💀', label: 'RIP', sound: 'low', key: 5 },
    { id: 'emote_fire', emoji: '🔥', label: 'En feu !', sound: 'high', key: null },
    { id: 'emote_cool', emoji: '😎', label: 'Cool', sound: 'mid', key: null },
    { id: 'emote_cry', emoji: '😭', label: 'Noooo', sound: 'low', key: null },
    { id: 'emote_love', emoji: '❤️', label: 'Love', sound: 'high', key: null },
    { id: 'emote_think', emoji: '🤔', label: 'Hmm', sound: 'mid', key: null },
    { id: 'emote_flex', emoji: '💪', label: 'Flex', sound: 'high', key: null },
    { id: 'emote_sleep', emoji: '😴', label: 'Zzz', sound: 'low', key: null },
    { id: 'emote_clap', emoji: '👏', label: 'Bravo', sound: 'mid', key: null },
    { id: 'emote_shock', emoji: '😱', label: 'Choqué', sound: 'high', key: null },
    { id: 'emote_wave', emoji: '👋', label: 'Salut', sound: 'mid', key: null },
];

export function getEmoteByKey(key) {
    return EMOTES.find(e => e.key === key);
}

export function getEquippableEmotes() {
    return EMOTES;
}
