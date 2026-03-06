/* ============================
   DROPER — Economy Manager
   ============================ */

export class EconomyManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
        this._lastTxTimes = []; // Rate limiter array
    }

    load() {
        this.data = this.save.get('economy') || { coins: 0, gems: 0, eventTokens: 0 };
        if (this.data.eventTokens === undefined) this.data.eventTokens = 0;
    }

    _checkRateLimit() {
        const now = Date.now();
        // Remove old transactions (older than 1 second)
        this._lastTxTimes = this._lastTxTimes.filter(t => now - t < 1000);

        // Max 10 transactions par seconde
        if (this._lastTxTimes.length >= 10) {
            console.warn("⚠️ Rate limit: trop de transactions en 1 seconde.");
            return false;
        }

        this._lastTxTimes.push(now);
        return true;
    }

    persist() {
        this.save.set('economy', this.data);
    }

    get coins() { return this.data.coins; }
    get gems() { return this.data.gems; }
    get eventTokens() { return this.data.eventTokens || 0; }

    // 🔒 Plafonds de sécurité v0.8.0
    static MAX_COINS_PER_TX = 50000;
    static MAX_GEMS_PER_TX = 5000;
    static MAX_TOKENS_PER_TX = 1000;

    addCoins(amount) {
        amount = Math.floor(amount);
        if (amount <= 0 || amount > EconomyManager.MAX_COINS_PER_TX || !this._checkRateLimit()) {
            console.warn(`⚠️ Transaction pièces suspecte rejetée: ${amount}`);
            return this.data.coins;
        }
        this.data.coins += amount;
        this.persist();
        return this.data.coins;
    }

    addGems(amount) {
        amount = Math.floor(amount);
        if (amount <= 0 || amount > EconomyManager.MAX_GEMS_PER_TX || !this._checkRateLimit()) {
            console.warn(`⚠️ Transaction gemmes suspecte rejetée: ${amount}`);
            return this.data.gems;
        }
        this.data.gems += amount;
        this.persist();
        return this.data.gems;
    }

    addEventTokens(amount) {
        amount = Math.floor(amount);
        if (amount <= 0 || amount > EconomyManager.MAX_TOKENS_PER_TX || !this._checkRateLimit()) {
            console.warn(`⚠️ Transaction tokens suspecte rejetée: ${amount}`);
            return this.data.eventTokens;
        }
        if (this.data.eventTokens === undefined) this.data.eventTokens = 0;
        this.data.eventTokens += amount;
        this.persist();
        return this.data.eventTokens;
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

    spendEventTokens(amount) {
        if (this.data.eventTokens === undefined) this.data.eventTokens = 0;
        if (this.data.eventTokens < amount) return false;
        this.data.eventTokens -= amount;
        this.persist();
        return true;
    }

    canAfford(type, amount) {
        if (type === 'coins') return this.data.coins >= amount;
        if (type === 'gems') return this.data.gems >= amount;
        if (type === 'eventTokens') return (this.data.eventTokens || 0) >= amount;
        if (type === 'free') return true;
        return false;
    }

    processReward(reward) {
        if (reward.type === 'coins') {
            this.addCoins(reward.amount);
        } else if (reward.type === 'gems') {
            this.addGems(reward.amount);
        } else if (reward.type === 'eventTokens') {
            this.addEventTokens(reward.amount);
        } else if (reward.type === 'mixed') {
            if (reward.coins) this.addCoins(reward.coins);
            if (reward.gems) this.addGems(reward.gems);
            if (reward.eventTokens) this.addEventTokens(reward.eventTokens);
        }
    }
}
