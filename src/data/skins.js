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
    blade: [
        { id: 'blade_default', name: 'Standard', heroId: 'blade', bodyColor: '#94a3b8', glowColor: '#475569', trailColor: 'rgba(148,163,184,0.3)', rarity: RARITIES.COMMON, price: 0, owned: true },
        { id: 'blade_shadow', name: 'Ombre Mora', heroId: 'blade', bodyColor: '#0f172a', glowColor: '#334155', trailColor: 'rgba(15,23,42,0.6)', rarity: RARITIES.MYTHIC, price: 4000, owned: false },
    ],
};

export function getSkinsForHero(heroId) {
    return SKINS[heroId] || [];
}

export function getSkinById(heroId, skinId) {
    const list = SKINS[heroId] || [];
    return list.find(s => s.id === skinId);
}
