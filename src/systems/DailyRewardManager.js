/* ============================
   DROPER — Daily Reward Manager (v0.9.2)
   ============================ */

export class DailyRewardManager {
    constructor(app) {
        this.app = app;
        this.rewards = [
            { day: 1, type: 'coins', amount: 800, emoji: '💰' },
            { day: 2, type: 'gems', amount: 15, emoji: '💎' },
            { day: 3, type: 'mixed', coins: 1500, gems: 10, emoji: '⚖️' },
            { day: 4, type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁' },
            { day: 5, type: 'gems', amount: 30, emoji: '💎' },
            { day: 6, type: 'coins', amount: 4000, emoji: '💰' },
            { day: 7, type: 'mixed', coins: 10000, gems: 100, emoji: '👑' },
        ];
    }

    init() {
        this.checkDaily();
    }

    checkDaily() {
        const shopData = this.app.saveManager.get('shop') || {};
        const daily = shopData.dailyRewards || { lastClaimDate: null, consecutiveDays: 0, claimedToday: false };

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        if (daily.lastClaimDate !== todayStr) {
            daily.claimedToday = false;

            // Si on a loupé un jour (plus de 24h+marge depuis le dernier claim)
            if (daily.lastClaimDate) {
                const lastDate = new Date(daily.lastClaimDate);
                const diffTime = Math.abs(now - lastDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    // Reset de la série si plus d'un jour d'écart
                    daily.consecutiveDays = 0;
                }
            }
        }

        shopData.dailyRewards = daily;
        this.app.saveManager.set('shop', shopData);
    }

    claim() {
        const shopData = this.app.saveManager.get('shop');
        const daily = shopData.dailyRewards;

        if (daily.claimedToday) {
            return { success: false, reason: 'Récompense déjà récupérée aujourd\'hui !' };
        }

        const dayIndex = daily.consecutiveDays % 7;
        const reward = this.rewards[dayIndex];

        // Appliquer la récompense via EconomyManager
        if (this.app.economyManager) {
            this.app.economyManager.processReward(reward);
        }

        daily.claimedToday = true;
        daily.lastClaimDate = new Date().toISOString().split('T')[0];
        daily.consecutiveDays++;

        shopData.dailyRewards = daily;
        this.app.saveManager.set('shop', shopData);

        return { success: true, reward };
    }

    getStatus() {
        const shopData = this.app.saveManager.get('shop');
        return shopData.dailyRewards || { lastClaimDate: null, consecutiveDays: 0, claimedToday: false };
    }
}
