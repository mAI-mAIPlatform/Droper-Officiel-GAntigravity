/* ============================
   DROPER — League Manager
   ============================ */

import { getDivisionByRecords, getNextDivision, getAllDivisions } from '../data/leagues.js';
import { toast } from '../ui/components/ToastManager.js';

export class LeagueManager {
    constructor(saveManager, economyManager, inventoryManager, recordManager) {
        this.save = saveManager;
        this.economy = economyManager;
        this.inventory = inventoryManager;
        this.records = recordManager;
        this.data = null;
        this.previousDivLabel = null;
    }

    load() {
        this.data = this.save.get('league') || { claimedPromotions: [] };
        this.previousDivLabel = this.getCurrentDivision().label;
    }

    persist() {
        this.save.set('league', this.data);
    }

    getCurrentDivision() {
        return getDivisionByRecords(this.records.total);
    }

    getNextDivision() {
        return getNextDivision(this.records.total);
    }

    getBotMultiplier() {
        return this.getCurrentDivision().botMult;
    }

    checkPromotion() {
        const current = this.getCurrentDivision();
        if (current.label !== this.previousDivLabel) {
            // Promotion!
            this.previousDivLabel = current.label;

            if (!this.data.claimedPromotions.includes(current.label)) {
                this.data.claimedPromotions.push(current.label);
                this.givePromotionReward(current);
                this.persist();
                toast.success(`🏅 Promotion : ${current.emoji} ${current.label} !`);
            }
        }
    }

    givePromotionReward(division) {
        const r = division.reward;
        if (!r) return;

        if (r.type === 'coins') {
            this.economy.addCoins(r.amount);
        } else if (r.type === 'gems') {
            this.economy.addGems(r.amount);
        } else if (r.type === 'item' && this.inventory) {
            this.inventory.addItem(r.itemId, r.amount);
        } else if (r.type === 'mixed') {
            if (r.coins) this.economy.addCoins(r.coins);
            if (r.gems) this.economy.addGems(r.gems);
        }
    }

    getProgress() {
        const current = this.getCurrentDivision();
        const next = this.getNextDivision();
        const total = this.records.total;

        return {
            division: current,
            nextDivision: next,
            records: total,
            progressPct: next ? Math.min(100, ((total - current.threshold) / (next.threshold - current.threshold)) * 100) : 100,
            allDivisions: getAllDivisions(),
            claimedPromotions: this.data.claimedPromotions,
        };
    }
}
