/* ============================
   DROPER — Données Skins Héros 👕
   ============================ */

import { RARITIES } from './heroes.js';

export const SKINS = {
    soldier: [
        { id: 'soldier_default', name: 'Standard', heroId: 'soldier', bodyColor: '#4a9eff', glowColor: '#2563eb', trailColor: 'rgba(74,158,255,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'soldier_crimson', name: 'Crimson Ops', heroId: 'soldier', bodyColor: '#ef4444', glowColor: '#dc2626', trailColor: 'rgba(239,68,68,0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'soldier_gold', name: 'Golden Elite', heroId: 'soldier', bodyColor: '#fbbf24', glowColor: '#f59e0b', trailColor: 'rgba(251,191,36,0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'soldier_arctic', name: 'Arctic Storm', heroId: 'soldier', bodyColor: '#e0f2fe', glowColor: '#7dd3fc', trailColor: 'rgba(186,230,253,0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'soldier_neon', name: 'Neon Strike', heroId: 'soldier', bodyColor: '#a855f7', glowColor: '#d946ef', trailColor: 'rgba(168, 85, 247, 0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'soldier_void', name: 'Void Walker', heroId: 'soldier', bodyColor: '#1e1b4b', glowColor: '#4338ca', trailColor: 'rgba(30, 27, 75, 0.4)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'soldier_justice', name: 'Justice Bringer', heroId: 'soldier', bodyColor: '#ffffff', glowColor: '#3b82f6', trailColor: 'rgba(255, 255, 255, 0.3)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    drone: [
        { id: 'drone_default', name: 'Standard', heroId: 'drone', bodyColor: '#22d3ee', glowColor: '#06b6d4', trailColor: 'rgba(34,211,238,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'drone_neon', name: 'Neon Rush', heroId: 'drone', bodyColor: '#e879f9', glowColor: '#d946ef', trailColor: 'rgba(232,121,249,0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'drone_stealth', name: 'Stealth Mode', heroId: 'drone', bodyColor: '#374151', glowColor: '#1f2937', trailColor: 'rgba(55,65,81,0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'drone_hornet', name: 'Yellow Hornet', heroId: 'drone', bodyColor: '#eab308', glowColor: '#ca8a04', trailColor: 'rgba(234, 179, 8, 0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'drone_stealth_wing', name: 'Stealth Wing', heroId: 'drone', bodyColor: '#475569', glowColor: '#1e293b', trailColor: 'rgba(71, 85, 105, 0.3)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'drone_hyper', name: 'Hyper Velocity', heroId: 'drone', bodyColor: '#ec4899', glowColor: '#db2777', trailColor: 'rgba(236, 72, 153, 0.3)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    tank: [
        { id: 'tank_default', name: 'Standard', heroId: 'tank', bodyColor: '#22c55e', glowColor: '#16a34a', trailColor: 'rgba(34,197,94,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'tank_lava', name: 'Lave', heroId: 'tank', bodyColor: '#f97316', glowColor: '#ea580c', trailColor: 'rgba(249,115,22,0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'tank_diamond', name: 'Diamant', heroId: 'tank', bodyColor: '#a78bfa', glowColor: '#8b5cf6', trailColor: 'rgba(167,139,250,0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'tank_bastion', name: 'Bastion', heroId: 'tank', bodyColor: '#451a03', glowColor: '#f59e0b', trailColor: 'rgba(69,26,3,0.5)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'tank_steel_bastion', name: 'Steel Bastion', heroId: 'tank', bodyColor: '#94a3b8', glowColor: '#64748b', trailColor: 'rgba(148, 163, 184, 0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'tank_colossus', name: 'Titanium Colossus', heroId: 'tank', bodyColor: '#1e293b', glowColor: '#0f172a', trailColor: 'rgba(30, 41, 59, 0.4)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'tank_volcanic_core', name: 'Volcanic Core', heroId: 'tank', bodyColor: '#ef4444', glowColor: '#b91c1c', trailColor: 'rgba(239, 68, 68, 0.4)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
        { id: 'tank_frost', name: 'Frost Giant', heroId: 'tank', bodyColor: '#f0f9ff', glowColor: '#0ea5e9', trailColor: 'rgba(240, 249, 255, 0.3)', rarity: RARITIES.ULTRA, price: 7000, owned: false },
    ],
    sniper: [
        { id: 'sniper_default', name: 'Standard', heroId: 'sniper', bodyColor: '#ef4444', glowColor: '#dc2626', trailColor: 'rgba(239,68,68,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'sniper_ghost', name: 'Fantôme', heroId: 'sniper', bodyColor: '#cbd5e1', glowColor: '#94a3b8', trailColor: 'rgba(203,213,225,0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'sniper_toxic', name: 'Toxique', heroId: 'sniper', bodyColor: '#84cc16', glowColor: '#65a30d', trailColor: 'rgba(132,204,22,0.3)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'sniper_viper', name: 'Viper Strike', heroId: 'sniper', bodyColor: '#14532d', glowColor: '#22c55e', trailColor: 'rgba(20,83,45,0.4)', rarity: RARITIES.RARE, price: 1000, owned: false },
    ],
    phantom: [
        { id: 'phantom_default', name: 'Standard', heroId: 'phantom', bodyColor: '#a855f7', glowColor: '#9333ea', trailColor: 'rgba(168,85,247,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'phantom_void', name: 'Void', heroId: 'phantom', bodyColor: '#1e1b4b', glowColor: '#4338ca', trailColor: 'rgba(67,56,202,0.3)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'phantom_solar', name: 'Solaire', heroId: 'phantom', bodyColor: '#fb923c', glowColor: '#f97316', trailColor: 'rgba(251,146,60,0.3)', rarity: RARITIES.EPIC, price: 2000, isEvent: true, eventPrice: 250, owned: false },
    ],
    titan: [
        { id: 'titan_default', name: 'Standard', heroId: 'titan', bodyColor: '#fbbf24', glowColor: '#f59e0b', trailColor: 'rgba(251,191,36,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'titan_dark', name: 'Dark Matter', heroId: 'titan', bodyColor: '#171717', glowColor: '#ef4444', trailColor: 'rgba(239,68,68,0.3)', rarity: RARITIES.ULTRA, price: 7000, owned: false },
        { id: 'titan_cyber', name: 'Cybernétique', heroId: 'titan', bodyColor: '#06b6d4', glowColor: '#0891b2', trailColor: 'rgba(6,182,212,0.3)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    volt: [
        { id: 'volt_default', name: 'Standard', heroId: 'volt', bodyColor: '#60a5fa', glowColor: '#3b82f6', trailColor: 'rgba(96,165,250,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'volt_overload', name: 'Surcharge', heroId: 'volt', bodyColor: '#fbbf24', glowColor: '#ef4444', trailColor: 'rgba(251,191,36,0.5)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    brave: [
        { id: 'brave_default', name: 'Standard', heroId: 'brave', bodyColor: '#94a3b8', glowColor: '#475569', trailColor: 'rgba(148,163,184,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'brave_shadow', name: 'Ombre Mora', heroId: 'brave', bodyColor: '#0f172a', glowColor: '#334155', trailColor: 'rgba(15,23,42,0.6)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'brave_crimson', name: 'Lame Écarlate', heroId: 'brave', bodyColor: '#dc2626', glowColor: '#991b1b', trailColor: 'rgba(220,38,38,0.4)', rarity: RARITIES.EPIC, price: 2000, owned: false },
    ],
    cyber_ninja: [
        { id: 'cyber_ninja_default', name: 'Standard', heroId: 'cyber_ninja', bodyColor: '#10b981', glowColor: '#059669', trailColor: 'rgba(16,185,129,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'cyber_ninja_blood', name: 'Ninja Sanglant', heroId: 'cyber_ninja', bodyColor: '#ef4444', glowColor: '#b91c1c', trailColor: 'rgba(239,68,68,0.4)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'cyber_ninja_ice', name: 'Frost Ninja', heroId: 'cyber_ninja', bodyColor: '#7dd3fc', glowColor: '#0284c7', trailColor: 'rgba(125,211,252,0.3)', rarity: RARITIES.EPIC, price: 2000, owned: false },
    ],
    overlord: [
        { id: 'overlord_default', name: 'Standard', heroId: 'overlord', bodyColor: '#f43f5e', glowColor: '#e11d48', trailColor: 'rgba(244,63,94,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'overlord_void', name: 'Seigneur du Vide', heroId: 'overlord', bodyColor: '#1e1b4b', glowColor: '#6366f1', trailColor: 'rgba(99,102,241,0.5)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    nova: [
        { id: 'nova_default', name: 'Standard', heroId: 'nova', bodyColor: '#fde047', glowColor: '#eab308', trailColor: 'rgba(253,224,71,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'nova_nebula', name: 'Nébuleuse', heroId: 'nova', bodyColor: '#c084fc', glowColor: '#a855f7', trailColor: 'rgba(192,132,252,0.4)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'nova_supernova', name: 'Supernova', heroId: 'nova', bodyColor: '#ffffff', glowColor: '#fbbf24', trailColor: 'rgba(255,255,255,0.5)', rarity: RARITIES.ULTRA, price: 7000, owned: false },
    ],
    rex: [
        { id: 'rex_default', name: 'Standard', heroId: 'rex', bodyColor: '#4d7c0f', glowColor: '#365314', trailColor: 'rgba(77,124,15,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'rex_alpha', name: 'Alpha Prédateur', heroId: 'rex', bodyColor: '#1c1917', glowColor: '#ef4444', trailColor: 'rgba(28,25,23,0.5)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
    ],
    viper: [
        { id: 'viper_default', name: 'Standard', heroId: 'viper', bodyColor: '#10b981', glowColor: '#059669', trailColor: 'rgba(16,185,129,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'viper_king_cobra', name: 'King Cobra', heroId: 'viper', bodyColor: '#854d0e', glowColor: '#a16207', trailColor: 'rgba(133,77,14,0.4)', rarity: RARITIES.EPIC, price: 2000, owned: false },
        { id: 'viper_mamba', name: 'Black Mamba', heroId: 'viper', bodyColor: '#0f172a', glowColor: '#22c55e', trailColor: 'rgba(15,23,42,0.5)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    glitch: [
        { id: 'glitch_default', name: 'Standard', heroId: 'glitch', bodyColor: '#d946ef', glowColor: '#c026d3', trailColor: 'rgba(217,70,239,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'glitch_matrix', name: 'Matrice', heroId: 'glitch', bodyColor: '#22c55e', glowColor: '#0f172a', trailColor: 'rgba(34,197,94,0.4)', rarity: RARITIES.RARE, price: 1000, owned: false },
        { id: 'glitch_corrupted', name: 'Corrompu', heroId: 'glitch', bodyColor: '#ef4444', glowColor: '#7f1d1d', trailColor: 'rgba(239,68,68,0.5)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
    ],
    solar: [
        { id: 'solar_default', name: 'Standard', heroId: 'solar', bodyColor: '#f97316', glowColor: '#ea580c', trailColor: 'rgba(249,115,22,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'solar_eclipse', name: 'Éclipse', heroId: 'solar', bodyColor: '#1e293b', glowColor: '#f97316', trailColor: 'rgba(30,41,59,0.5)', rarity: RARITIES.EPIC, price: 2000, owned: false },
    ],
    astro: [
        { id: 'astro_default', name: 'Standard', heroId: 'astro', bodyColor: '#ffffff', glowColor: '#3b82f6', trailColor: 'rgba(59,130,246,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'astro_nebula', name: 'Explorateur Nébuleux', heroId: 'astro', bodyColor: '#a855f7', glowColor: '#7c3aed', trailColor: 'rgba(168,85,247,0.4)', rarity: RARITIES.LEGENDARY, price: 5000, owned: false },
    ],
    glacier: [
        { id: 'glacier_default', name: 'Standard', heroId: 'glacier', bodyColor: '#bae6fd', glowColor: '#0ea5e9', trailColor: 'rgba(186,230,253,0.4)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'glacier_blizzard', name: 'Blizzard', heroId: 'glacier', bodyColor: '#ffffff', glowColor: '#38bdf8', trailColor: 'rgba(255,255,255,0.5)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
        { id: 'glacier_volcanic_ice', name: 'Glace Volcanique', heroId: 'glacier', bodyColor: '#ef4444', glowColor: '#bae6fd', trailColor: 'rgba(239,68,68,0.3)', rarity: RARITIES.ULTRA, price: 7000, owned: false },
    ],
};

export function getSkinsForHero(heroId) {
    return SKINS[heroId] || [];
}

export function getSkinById(heroId, skinId) {
    const list = SKINS[heroId] || [];
    return list.find(s => s.id === skinId);
}
