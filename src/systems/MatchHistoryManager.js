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

    getProgressionData() {
        const now = new Date();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', '');

            const matches = this.history.filter(m => {
                const mDate = typeof m.date === 'string' ? m.date : new Date(m.date).toISOString();
                return mDate.startsWith(dateStr);
            });

            const kills = matches.reduce((sum, m) => sum + (m.kills || 0), 0);
            const maxWave = matches.reduce((max, m) => Math.max(max, m.wave || 0), 0);

            days.push({ date: dateStr, label: dayLabel, kills, maxWave });
        }
        return days;
    }

    // ─── v0.9.6 — Nouvelles méthodes de filtrage ───

    getFilteredHistory(filters = {}) {
        let filtered = [...this.history];

        if (filters.modeId) {
            filtered = filtered.filter(m => m.modeId === filters.modeId);
        }
        if (filters.heroId) {
            filtered = filtered.filter(m => m.heroId === filters.heroId);
        }
        if (filters.period) {
            const now = Date.now();
            const ms = filters.period === '7d' ? 7 * 86400000 :
                filters.period === '30d' ? 30 * 86400000 : Infinity;
            if (ms !== Infinity) {
                filtered = filtered.filter(m => {
                    const mDate = new Date(m.date).getTime();
                    return now - mDate <= ms;
                });
            }
        }

        return filtered;
    }

    getStatsByMode(modeId) {
        const filtered = this.getFilteredHistory({ modeId });
        return this.computeStats(filtered);
    }

    getStatsByHero(heroId) {
        const filtered = this.getFilteredHistory({ heroId });
        return this.computeStats(filtered);
    }

    getStatsForPeriod(period) {
        const filtered = this.getFilteredHistory({ period });
        return this.computeStats(filtered);
    }

    computeStats(matches) {
        const total = matches.length;
        const wins = matches.filter(m => m.won).length;
        const totalKills = matches.reduce((sum, m) => sum + (m.kills || 0), 0);
        const totalDamage = matches.reduce((sum, m) => sum + (m.damage || 0), 0);
        const totalDeaths = matches.reduce((sum, m) => sum + (m.deaths || 0), 0);
        const avgKills = total > 0 ? (totalKills / total).toFixed(1) : 0;
        const kda = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;

        return {
            total,
            wins,
            winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
            totalKills,
            avgKills,
            totalDamage,
            kda,
        };
    }

    getTopKillsPerMatch() {
        return [...this.history]
            .sort((a, b) => (b.kills || 0) - (a.kills || 0))
            .slice(0, 10);
    }

    getBestWinStreaks() {
        let currentStreak = 0;
        let bestStreak = 0;
        for (const m of this.history) {
            if (m.won) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        return bestStreak;
    }
}
