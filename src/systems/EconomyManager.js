/* ============================
   DROPER — Economy Manager
   ============================ */

export class EconomyManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('economy') || { coins: 0, gems: 0 };
    }

    persist() {
        this.save.set('economy', this.data);
    }

    get coins() { return this.data.coins; }
    get gems() { return this.data.gems; }

    addCoins(amount) {
        this.data.coins += amount;
        this.persist();
        return this.data.coins;
    }

    addGems(amount) {
        this.data.gems += amount;
        this.persist();
        return this.data.gems;
    }

    spendCoins(amount) {
        if (this.data.coins < amount) return false;
        this.data.coins -= amount;
        this.persist();
        return true;
    }

    spendGems(amount) {
        if (this.data.gems < amount) return false;
        this.data.gems -= amount;
        this.persist();
        return true;
    }

    canAfford(type, amount) {
        if (type === 'coins') return this.data.coins >= amount;
        if (type === 'gems') return this.data.gems >= amount;
        if (type === 'free') return true;
        return false;
    }

    processReward(reward) {
        if (reward.type === 'coins') {
            this.addCoins(reward.amount);
        } else if (reward.type === 'gems') {
            this.addGems(reward.amount);
        } else if (reward.type === 'mixed') {
            if (reward.coins) this.addCoins(reward.coins);
            if (reward.gems) this.addGems(reward.gems);
        }
    }
}
