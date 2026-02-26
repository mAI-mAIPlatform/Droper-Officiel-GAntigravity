/* ============================
   DROPER — Quest Manager
   ============================ */

import { getRandomDailyQuests, WEEKLY_CHALLENGES, MONTHLY_QUESTS, generateDailyResetTime, formatTimeRemaining } from '../data/quests.js';

export class QuestManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('quests') || {};
        this.checkResets();
    }

    persist() {
        this.save.set('quests', this.data);
    }

    checkResets() {
        const now = Date.now();

        // Reset quotidien (5 quêtes aléatoires)
        if (!this.data.lastDailyReset || this.isDayPassed(this.data.lastDailyReset)) {
            this.resetDailyQuests();
        }

        // Reset hebdomadaire
        if (!this.data.lastWeeklyReset || this.isWeekPassed(this.data.lastWeeklyReset)) {
            this.resetWeeklyQuests();
        }

        // Reset mensuel
        if (!this.data.lastMonthlyReset || this.isMonthPassed(this.data.lastMonthlyReset)) {
            this.resetMonthlyQuests();
        }
    }

    isDayPassed(timestamp) {
        const last = new Date(timestamp);
        const now = new Date();
        return last.toDateString() !== now.toDateString();
    }

    isMonthPassed(timestamp) {
        const diffMs = Date.now() - timestamp;
        return diffMs > 30 * 24 * 60 * 60 * 1000;
    }

    resetDailyQuests() {
        this.data.daily = getRandomDailyQuests(5).map(q => ({ ...q, progress: 0 }));
        this.data.lastDailyReset = Date.now();
        this.persist();
    }

    resetWeeklyQuests() {
        this.data.weekly = WEEKLY_CHALLENGES.map(q => ({ ...q, progress: 0 }));
        this.data.lastWeeklyReset = Date.now();
        this.persist();
    }

    resetMonthlyQuests() {
        this.data.monthly = MONTHLY_QUESTS.map(q => ({
            ...q,
            progress: 0,
            unlocked: q.cost === 0
        }));
        this.data.lastMonthlyReset = Date.now();
        this.persist();
    }

    getDailyQuests() {
        return this.data.daily || [];
    }

    getWeeklyQuests() {
        return this.data.weekly || [];
    }

    getMonthlyQuests() {
        return this.data.monthly || [];
    }

    buyMonthlyQuest(questId, econ) {
        const quest = (this.data.monthly || []).find(q => q.id === questId);
        if (!quest || quest.unlocked) return false;
        if (econ.spendCoins(quest.cost)) {
            quest.unlocked = true;
            this.persist();
            return true;
        }
        return false;
    }

    updateProgress(questId, amount) {
        const quest = this.findQuest(questId);
        if (!quest) return null;

        quest.progress = Math.min(quest.progress + amount, quest.target);
        this.persist();
        return quest;
    }

    findQuest(questId) {
        const daily = (this.data.daily || []).find(q => q.id === questId);
        if (daily) return daily;
        const weekly = (this.data.weekly || []).find(q => q.id === questId);
        if (weekly) return weekly;
        return (this.data.monthly || []).find(q => q.id === questId);
    }

    isQuestComplete(questId) {
        const quest = this.findQuest(questId);
        if (!quest) return false;
        return quest.progress >= quest.target;
    }

    getTimeUntilDailyReset() {
        return generateDailyResetTime();
    }

    getFormattedResetTime() {
        return formatTimeRemaining(this.getTimeUntilDailyReset());
    }

    getDailyCompletionCount() {
        return (this.data.daily || []).filter(q => q.progress >= q.target).length;
    }

    getTotalDailyQuests() {
        return (this.data.daily || []).length;
    }
}
