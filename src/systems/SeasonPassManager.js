/* ============================
   DROPER — Season Pass Manager (v0.0.4 + Éveil Pass)
   ============================ */

import { SEASON_PASS } from '../data/seasonpass.js';
import { EVEIL_PASS } from '../data/eveilpass.js';
import { RANKED_PASS } from '../data/rankedpass.js';
import { toast } from '../ui/components/ToastManager.js';

export class SeasonPassManager {
    constructor(saveManager, economyManager, heroManager) {
        this.save = saveManager;
        this.economy = economyManager;
        this.heroManager = heroManager;
        this.inventoryManager = null;
        this.data = null;
    }

    setInventoryManager(inv) {
        this.inventoryManager = inv;
    }

    load() {
        this.data = this.save.get('seasonPass') || this.getDefaultData();
    }

    persist() {
        this.save.set('seasonPass', this.data);
    }

    getDefaultData() {
        return {
            seasonId: SEASON_PASS.id,
            xp: 0,
            tier: 0,
            premium: false,
            claimedFree: [],
            claimedPremium: [],
            eveil: {
                tokens: 0,
                claimedTiers: [],
            },
            rankedPass: {
                seasonId: RANKED_PASS.id,
                premium: false,
                claimedFree: [],
                claimedPremium: [],
            }
        };
    }

    get currentTier() { return this.data.tier; }
    get currentXp() { return this.data.xp; }
    get isPremium() { return this.data.premium; }

    get xpToNextTier() { return SEASON_PASS.xpPerTier; }
    get xpProgress() { return this.data.xp % SEASON_PASS.xpPerTier; }

    // === Season Pass ===
    addXp(amount) {
        this.data.xp += amount;
        const newTier = Math.min(
            Math.floor(this.data.xp / SEASON_PASS.xpPerTier),
            SEASON_PASS.maxTier
        );
        if (newTier > this.data.tier) {
            this.data.tier = newTier;
            toast.success(`⭐ Palier ${newTier} atteint !`);
        }
        this.persist();
    }

    canClaimFree(tier) {
        return tier <= this.data.tier && !this.data.claimedFree.includes(tier);
    }

    canClaimPremium(tier) {
        return this.data.premium && tier <= this.data.tier && !this.data.claimedPremium.includes(tier);
    }

    claimFree(tier) {
        if (!this.canClaimFree(tier)) return false;
        const tierData = SEASON_PASS.tiers.find(t => t.tier === tier);
        if (!tierData) return false;
        this.processReward(tierData.free);
        this.data.claimedFree.push(tier);
        this.persist();
        return true;
    }

    claimPremium(tier) {
        if (!this.canClaimPremium(tier)) return false;
        const tierData = SEASON_PASS.tiers.find(t => t.tier === tier);
        if (!tierData) return false;
        this.processReward(tierData.premium);
        this.data.claimedPremium.push(tier);
        this.persist();
        return true;
    }

    processReward(reward) {
        if (reward.type === 'coins') {
            this.economy.addCoins(reward.amount);
        } else if (reward.type === 'gems') {
            this.economy.addGems(reward.amount);
        } else if (reward.type === 'hero') {
            this.heroManager.unlock(reward.heroId);
            toast.unlock(`${reward.emoji} ${reward.label} débloqué !`);
        } else if (reward.type === 'item' && this.inventoryManager) {
            this.inventoryManager.addItem(reward.itemId, reward.amount);
        }
    }

    activatePremium() {
        this.data.premium = true;
        this.persist();
        toast.success('⭐ Pass Premium activé !');
    }

    getTierStatus(tier) {
        return {
            reached: tier <= this.data.tier,
            freeClaimed: this.data.claimedFree.includes(tier),
            premiumClaimed: this.data.claimedPremium.includes(tier),
        };
    }

    // === Éveil Pass ===
    get eveilTokens() {
        return this.data.eveil ? this.data.eveil.tokens : 0;
    }

    addEveilTokens(amount) {
        if (!this.data.eveil) this.data.eveil = { tokens: 0, claimedTiers: [] };
        this.data.eveil.tokens += amount;
        this.persist();
        toast.reward(`+${amount} 🌅 Jetons Éveil`);
    }

    canClaimEveil(tier) {
        if (!this.data.eveil) return false;
        const tierData = EVEIL_PASS.tiers.find(t => t.tier === tier);
        if (!tierData) return false;
        const totalTokensNeeded = EVEIL_PASS.tiers
            .filter(t => t.tier <= tier)
            .reduce((sum, t) => sum + t.cost, 0);
        const totalSpent = this.data.eveil.claimedTiers
            .reduce((sum, t) => {
                const td = EVEIL_PASS.tiers.find(x => x.tier === t);
                return sum + (td ? td.cost : 0);
            }, 0);
        return this.data.eveil.tokens >= tierData.cost &&
            !this.data.eveil.claimedTiers.includes(tier) &&
            (tier === 1 || this.data.eveil.claimedTiers.includes(tier - 1));
    }

    claimEveil(tier) {
        if (!this.canClaimEveil(tier)) return false;
        const tierData = EVEIL_PASS.tiers.find(t => t.tier === tier);
        if (!tierData) return false;

        this.data.eveil.tokens -= tierData.cost;
        this.data.eveil.claimedTiers.push(tier);
        this.processReward(tierData.reward);
        this.persist();
        toast.success(`🌅 Éveil Pass — Palier ${tier} réclamé !`);
        return true;
    }

    getEveilTierStatus(tier) {
        if (!this.data.eveil) return { claimed: false, canClaim: false };
        return {
            claimed: this.data.eveil.claimedTiers.includes(tier),
            canClaim: this.canClaimEveil(tier),
        };
    }

    // === Ranked Pass ===
    get isRankedPremium() {
        return this.data.rankedPass ? this.data.rankedPass.premium : false;
    }

    activateRankedPremium() {
        if (!this.data.rankedPass) this.data.rankedPass = { seasonId: RANKED_PASS.id, premium: true, claimedFree: [], claimedPremium: [] };
        this.data.rankedPass.premium = true;
        this.persist();
        toast.success('👑 Pass Classé Premium activé !');
    }

    getRankedCurrentTier(playerRankPoints) {
        let currentTier = 0;
        let points = playerRankPoints;
        while (points >= RANKED_PASS.xpPerTier && currentTier < RANKED_PASS.maxTier) {
            currentTier++;
            points -= RANKED_PASS.xpPerTier;
        }
        return currentTier;
    }

    canClaimRankedFree(tier, playerPoints) {
        if (!this.data.rankedPass) return false;
        const currentTier = this.getRankedCurrentTier(playerPoints);
        return tier <= currentTier && !this.data.rankedPass.claimedFree.includes(tier);
    }

    canClaimRankedPremium(tier, playerPoints) {
        if (!this.data.rankedPass) return false;
        const currentTier = this.getRankedCurrentTier(playerPoints);
        return this.isRankedPremium && tier <= currentTier && !this.data.rankedPass.claimedPremium.includes(tier);
    }

    claimRankedFree(tier, playerPoints) {
        if (!this.canClaimRankedFree(tier, playerPoints)) return false;
        const tierData = RANKED_PASS.tiers.find(t => t.tier === tier);
        if (!tierData || !tierData.free) return false;
        this.processReward(tierData.free);
        this.data.rankedPass.claimedFree.push(tier);
        this.persist();
        return true;
    }

    claimRankedPremium(tier, playerPoints) {
        if (!this.canClaimRankedPremium(tier, playerPoints)) return false;
        const tierData = RANKED_PASS.tiers.find(t => t.tier === tier);
        if (!tierData || !tierData.premium) return false;
        this.processReward(tierData.premium);
        this.data.rankedPass.claimedPremium.push(tier);
        this.persist();
        return true;
    }

    getRankedTierStatus(tier, playerPoints) {
        if (!this.data.rankedPass) return { reached: false, freeClaimed: false, premiumClaimed: false };
        const currentTier = this.getRankedCurrentTier(playerPoints);
        return {
            reached: tier <= currentTier,
            freeClaimed: this.data.rankedPass.claimedFree.includes(tier),
            premiumClaimed: this.data.rankedPass.claimedPremium.includes(tier),
        };
    }
}
