/* ============================
   DROPER — Record Manager
   ============================ */

import { RECORDS } from '../data/records.js';
import { toast } from '../ui/components/ToastManager.js';

export class RecordManager {
    constructor(saveManager, economyManager, inventoryManager) {
        this.save = saveManager;
        this.economy = economyManager;
        this.inventory = inventoryManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('records') || { total: 0, claimedMilestones: [] };
    }

    persist() {
        this.save.set('records', this.data);
    }

    get total() { return this.data.total; }

    add(action, count = 1) {
        const rate = RECORDS.earnRates[action] || 0;
        const earned = rate * count;
        if (earned <= 0) return;

        this.data.total += earned;
        this.persist();

        // Check milestones
        this.checkMilestones();
    }

    checkMilestones() {
        for (const ms of RECORDS.milestones) {
            if (this.data.total >= ms.threshold && !this.data.claimedMilestones.includes(ms.id)) {
                this.claimMilestone(ms);
            }
        }
    }

    claimMilestone(milestone) {
        this.data.claimedMilestones.push(milestone.id);
        const r = milestone.reward;

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

        toast.reward(`🎫 Palier ${milestone.id} — ${r.label} !`);
        this.persist();
    }

    getMilestoneStatus() {
        return RECORDS.milestones.map(ms => ({
            ...ms,
            claimed: this.data.claimedMilestones.includes(ms.id),
            reached: this.data.total >= ms.threshold,
        }));
    }

    getProgress() {
        const nextUnclaimed = RECORDS.milestones.find(
            ms => !this.data.claimedMilestones.includes(ms.id)
        );
        return {
            total: this.data.total,
            nextThreshold: nextUnclaimed ? nextUnclaimed.threshold : null,
            nextId: nextUnclaimed ? nextUnclaimed.id : null,
            completedCount: this.data.claimedMilestones.length,
            totalMilestones: RECORDS.milestones.length,
        };
    }
}
