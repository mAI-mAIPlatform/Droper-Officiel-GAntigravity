/* ============================
   DROPER — Hero Manager
   ============================ */

import { HEROES, getHeroById } from '../data/heroes.js';

export class HeroManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('heroes') || {};
        this.refreshHeroList();
    }

    refreshHeroList() {
        const customHeroes = this.app?.adminManager?.config?.customHeroes || [];
        this.allHeroes = [...HEROES, ...customHeroes];
    }

    persist() {
        this.save.set('heroes', this.data);
    }

    getHeroState(heroId) {
        return this.data[heroId] || {
            unlocked: false,
            level: 1,
            xp: 0,
            powers: [], // List of purchased power IDs
            equippedPower: null,
            chips: [], // List of purchased chip IDs
            equippedChips: [] // Max 2
        };
    }

    isUnlocked(heroId) {
        const state = this.getHeroState(heroId);
        return state.unlocked;
    }

    unlock(heroId) {
        if (!this.data[heroId]) {
            this.data[heroId] = {
                unlocked: true,
                level: 1,
                xp: 0,
                powers: [],
                equippedPower: null,
                chips: [],
                equippedChips: []
            };
        } else {
            this.data[heroId].unlocked = true;
        }
        this.persist();
    }

    addHeroXp(heroId, amount) {
        const state = this.getHeroState(heroId);
        if (!state.unlocked) return state;

        state.xp += amount;
        const xpToNext = this.calculateXpToNext(state.level);

        while (state.xp >= xpToNext) {
            state.xp -= xpToNext;
            state.level += 1;
        }

        this.data[heroId] = state;
        this.persist();
        return state;
    }

    calculateXpToNext(level) {
        return Math.floor(50 * Math.pow(1.2, level - 1));
    }

    getUpgradePrice(level) {
        if (level >= 10) return Infinity;
        // Prix évolutif : 100, 250, 500, 1000, 2000...
        return Math.floor(100 * Math.pow(2, level - 1));
    }

    upgradeHero(heroId, economyManager) {
        const state = this.getHeroState(heroId);
        if (!state.unlocked || state.level >= 10) return { success: false, reason: 'Niveau max ou verrouillé' };

        const price = this.getUpgradePrice(state.level);
        if (economyManager.coins < price) {
            return { success: false, price, reason: 'Pas assez de pièces' };
        }

        economyManager.addCoins(-price);
        state.level += 1;
        this.data[heroId] = state;
        this.persist();

        return { success: true, newLevel: state.level };
    }

    getStatMultiplier(level) {
        // +10% par niveau (Niveau 1 = 1.0, Niveau 10 = 1.9)
        return 1.0 + (level - 1) * 0.1;
    }

    getAllHeroesWithState() {
        return HEROES.map(hero => ({
            ...hero,
            state: this.getHeroState(hero.id),
        }));
    }

    getUnlockedHeroes() {
        return this.getAllHeroesWithState().filter(h => h.state.unlocked);
    }

    getFullHero(heroId) {
        if (!this.allHeroes) this.refreshHeroList();
        const hero = this.allHeroes.find(h => h.id === heroId);
        if (!hero) return null;
        const state = this.getHeroState(heroId);
        const mult = this.getStatMultiplier(state.level);

        // Appliquer le multiplicateur de niveau aux stats de base
        const upgradedStats = {
            hp: Math.floor(hero.stats.hp * mult),
            attack: Math.floor(hero.stats.attack * mult),
            defense: Math.floor(hero.stats.defense * mult),
            speed: Math.floor(hero.stats.speed * (1 + (state.level - 1) * 0.02)), // Vitesse augmente moins vite (+2%/nv)
        };

        return {
            ...hero,
            stats: upgradedStats,
            state: state,
        };
    }

    // --- SYSTEMS V0.2.4 ---

    buyPower(heroId, powerId, economyManager) {
        const state = this.getHeroState(heroId);
        const POWER_PRICE = 600;

        if (state.level < 5) return { success: false, reason: 'Niveau 5 requis' };
        if (state.powers.includes(powerId)) return { success: false, reason: 'Déjà possédé' };
        if (!economyManager.spendCoins(POWER_PRICE)) return { success: false, reason: 'Pas assez de pièces' };

        state.powers.push(powerId);
        if (!state.equippedPower) state.equippedPower = powerId;

        this.data[heroId] = state;
        this.persist();
        return { success: true };
    }

    equipPower(heroId, powerId) {
        const state = this.getHeroState(heroId);
        if (!state.powers.includes(powerId)) return false;
        state.equippedPower = powerId;
        this.persist();
        return true;
    }

    buyChip(heroId, chipId, economyManager) {
        const state = this.getHeroState(heroId);
        const CHIP_PRICE = 150;

        if (state.level < 9) return { success: false, reason: 'Niveau 9 requis' };
        if (state.chips.includes(chipId)) return { success: false, reason: 'Déjà possédé' };
        if (!economyManager.spendCoins(CHIP_PRICE)) return { success: false, reason: 'Pas assez de pièces' };

        state.chips.push(chipId);
        // On équipe automatiquement si de la place
        if (state.equippedChips.length < 2) {
            state.equippedChips.push(chipId);
        }

        this.data[heroId] = state;
        this.persist();
        return { success: true };
    }

    equipChip(heroId, chipId) {
        const state = this.getHeroState(heroId);
        if (!state.chips.includes(chipId)) return false;

        if (state.equippedChips.includes(chipId)) {
            // Déséquiper
            state.equippedChips = state.equippedChips.filter(id => id !== chipId);
        } else {
            // Équiper (max 2)
            if (state.equippedChips.length >= 2) return false;
            state.equippedChips.push(chipId);
        }

        this.persist();
        return true;
    }
}
