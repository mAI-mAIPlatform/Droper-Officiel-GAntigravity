/* ============================
   DROPER — Cosmétiques (Skins & Emotes)
   ============================ */

export const SKINS = {
    // Skins pour Soldier
    SOLDIER_NEON: { id: 'soldier_neon', heroId: 'soldier', name: 'Néon Hunter', rarity: 'EPIC', color: '#00f2ff' },
    SOLDIER_VOID: { id: 'soldier_void', heroId: 'soldier', name: 'Void Soldier', rarity: 'LEGENDARY', color: '#8b5cf6' },

    // Skins pour Cyber-Ninja
    NINJA_GOLD: { id: 'ninja_gold', heroId: 'cyber_ninja', name: 'Kintsugi Ninja', rarity: 'LEGENDARY', color: '#fbbf24' },
    NINJA_BLOOD: { id: 'ninja_blood', heroId: 'cyber_ninja', name: 'Crimson Blade', rarity: 'EPIC', color: '#ef4444' },

    // Skins pour Astro
    ASTRO_DARK: { id: 'astro_dark', heroId: 'astro', name: 'Dark Matter', rarity: 'ULTRA', color: '#1e293b' },
};

export const EMOTES = {
    GG: { id: 'emoji_gg', name: 'GG', emoji: '🙌', sound: 'success' },
    OK: { id: 'emoji_ok', name: 'OK', emoji: '👌', sound: 'click' },
    SAD: { id: 'emoji_sad', name: 'Sad', emoji: '😢', sound: 'defeat' },
    FIRE: { id: 'emoji_fire', name: 'Fire', emoji: '🔥', sound: 'ultimate' },
    ANGRY: { id: 'emoji_angry', name: 'Angry', emoji: '💢', sound: 'impact' },
};

export function getSkinById(id) {
    return Object.values(SKINS).find(s => s.id === id);
}

export function getEmoteById(id) {
    return Object.values(EMOTES).find(e => e.id === id);
}
