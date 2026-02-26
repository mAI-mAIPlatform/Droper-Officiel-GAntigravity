/* ============================
   DROPER — Match History Manager
   ============================ */

export class MatchHistoryManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.history = [];
    }

    load() {
        this.history = this.save.get('matchHistory') || [];
    }

    persist() {
        this.save.set('matchHistory', this.history);
    }

    addMatch(data) {
        // data: { modeId, won, kills, score, heroId, duration, date }
        const match = {
            ...data,
            id: 'match_' + Date.now(),
            date: data.date || new Date().toISOString(),
        };

        this.history.unshift(match);
        
        // Limiter à 50 matchs
        if (this.history.length > 50) {
            this.history.pop();
        }

        this.persist();
    }

    getHistory() {
        return this.history;
    }

    getStats() {
        const total = this.history.length;
        const wins = this.history.filter(m => m.won).length;
        const totalKills = this.history.reduce((sum, m) => sum + (m.kills || 0), 0);
        
        return {
            total,
            wins,
            winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
            totalKills
        };
    }
}
