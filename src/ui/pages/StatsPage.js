/* ============================
   DROPER — Page Statistiques (v0.9.6)
   Filtres, graphes, classements
   ============================ */

import { StatCard } from '../components/StatCard.js';
import { ProgressionGraph } from '../components/ProgressionGraph.js';
import { LeaderboardWidget } from '../components/LeaderboardWidget.js';
import { getModeById, GAME_MODES } from '../../data/gamemodes.js';
import { HEROES } from '../../data/heroes.js';

export class StatsPage {
    constructor(app) {
        this.app = app;
        this.activeTab = 'infos'; // infos, history, progression, league, leaderboard
        this.filterMode = 'all';
        this.filterHero = 'all';
        this.filterPeriod = 'all';
    }

    render() {
        return `
            <div class="page page--stats">
                <div class="page__header row row--between">
                    <h1 class="section-title">
                        <span class="section-title__prefix">///</span> STATS & CLASSEMENT
                    </h1>
                </div>

                <!-- Onglets -->
                <div class="row" style="gap: 8px; margin-bottom: 20px; overflow-x: auto; white-space: nowrap; padding-bottom: 5px; -ms-overflow-style: none; scrollbar-width: none;">
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'infos' ? 'active' : ''}" data-tab="infos">INFOS</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'history' ? 'active' : ''}" data-tab="history">MODES</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'progression' ? 'active' : ''}" data-tab="progression">GRAPHE</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'leaderboard' ? 'active' : ''}" data-tab="leaderboard">🏆 CLASSEMENT</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'league' ? 'active' : ''}" data-tab="league">RANGS</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">🏅 SUCCÈS</button>
                </div>

                <!-- Filtres (v0.9.6) -->
                ${(this.activeTab !== 'league' && this.activeTab !== 'achievements') ? this.renderFilters() : ''}

                <div id="stats-tab-content" class="anim-fade-in">
                    ${this.renderActiveTab()}
                </div>
            </div>
        `;
    }

    renderFilters() {
        const modes = GAME_MODES || [];
        const heroes = HEROES || [];

        return `
            <div class="card" style="padding: 12px; margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase;">🔍 Filtres :</span>
                
                <select id="filter-mode" class="stats-filter-select" style="
                    background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--color-border);
                    padding: 5px 10px; border-radius: 6px; font-size: 0.7rem; font-family: 'Outfit', sans-serif;
                ">
                    <option value="all" ${this.filterMode === 'all' ? 'selected' : ''}>Tous les modes</option>
                    ${modes.map(m => `<option value="${m.id}" ${this.filterMode === m.id ? 'selected' : ''}>${m.emoji} ${m.name}</option>`).join('')}
                </select>

                <select id="filter-hero" class="stats-filter-select" style="
                    background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--color-border);
                    padding: 5px 10px; border-radius: 6px; font-size: 0.7rem; font-family: 'Outfit', sans-serif;
                ">
                    <option value="all" ${this.filterHero === 'all' ? 'selected' : ''}>Tous les héros</option>
                    ${heroes.map(h => `<option value="${h.id}" ${this.filterHero === h.id ? 'selected' : ''}>${h.emoji} ${h.name}</option>`).join('')}
                </select>

                <select id="filter-period" class="stats-filter-select" style="
                    background: rgba(255,255,255,0.05); color: #fff; border: 1px solid var(--color-border);
                    padding: 5px 10px; border-radius: 6px; font-size: 0.7rem; font-family: 'Outfit', sans-serif;
                ">
                    <option value="all" ${this.filterPeriod === 'all' ? 'selected' : ''}>Toute la période</option>
                    <option value="7d" ${this.filterPeriod === '7d' ? 'selected' : ''}>7 derniers jours</option>
                    <option value="30d" ${this.filterPeriod === '30d' ? 'selected' : ''}>30 derniers jours</option>
                </select>
            </div>
        `;
    }

    getActiveFilters() {
        const filters = {};
        if (this.filterMode !== 'all') filters.modeId = this.filterMode;
        if (this.filterHero !== 'all') filters.heroId = this.filterHero;
        if (this.filterPeriod !== 'all') filters.period = this.filterPeriod;
        return filters;
    }

    renderActiveTab() {
        if (this.activeTab === 'infos') return this.renderInfosTab();
        if (this.activeTab === 'history') return this.renderHistoryTab();
        if (this.activeTab === 'progression') return this.renderProgressionTab();
        if (this.activeTab === 'leaderboard') return this.renderLeaderboardTab();
        if (this.activeTab === 'league') return this.renderLeagueTab();
        if (this.activeTab === 'achievements') return this.renderAchievementsTab();
    }

    renderAchievementsTab() {
        // Obtenir les trophées via app ou localStorage par défaut
        let unlocked = [];
        let stats = { totalKills: 0, laveWins: 0, distance: 0 };

        if (this.app.achievementManager) {
            unlocked = this.app.achievementManager.unlocked;
            stats = this.app.achievementManager.stats;
        } else {
            try {
                unlocked = JSON.parse(localStorage.getItem('droper_achievements') || '[]');
                stats = JSON.parse(localStorage.getItem('droper_achiev_stats') || '{"totalKills":0,"laveWins":0,"distance":0}');
            } catch (e) { }
        }

        // Mock import since ACHIEVEMENTS isn't imported at top
        const ALL_ACHS = [
            { id: 'first_blood', title: 'First Blood', description: 'Faire son premier kill', icon: '🩸' },
            { id: 'serial_killer', title: 'Tueur en Série', description: 'Atteindre un combo x5', icon: '🔥' },
            { id: 'survivor', title: 'Survivant', description: 'Survivre 3 minutes dans une partie', icon: '⏱️' },
            { id: 'marathon', title: 'Marathonien', description: 'Parcourir une longue distance', icon: '🏃' },
            { id: 'untouchable', title: 'Intouchable', description: 'Gagner une partie sans prendre de dégâts', icon: '🛡️' },
            { id: 'lave_master', title: 'Maître de la Lave', description: 'Gagner 5 parties en Lave Flash', icon: '🌋' },
            { id: 'city_hunter', title: 'Chasseur Urbain', description: 'Faire 50 kills en Kill Life', icon: '🏙️' }
        ];

        const progress = Math.round((unlocked.length / ALL_ACHS.length) * 100);

        return `
            <div class="stack anim-fade-in" style="gap: var(--spacing-lg);">
                <div class="card" style="text-align: center; padding: 15px; background: rgba(34, 197, 94, 0.05); border-color: rgba(34, 197, 94, 0.2);">
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 5px;">Progression Globale</div>
                    <div style="font-size: 2rem; font-weight: 900; color: var(--color-accent-green);">${progress}%</div>
                    <div style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 5px;">${unlocked.length} sur ${ALL_ACHS.length} succès débloqués</div>
                </div>

                <div class="grid-2">
                    ${ALL_ACHS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            const opacity = isUnlocked ? 1 : 0.4;
            const filter = isUnlocked ? 'none' : 'grayscale(100%)';
            const color = isUnlocked ? 'var(--color-accent-gold)' : 'var(--color-text-muted)';

            return `
                        <div class="card" style="display: flex; gap: 12px; align-items: center; opacity: ${opacity}; filter: ${filter}; border-left: 3px solid ${isUnlocked ? 'var(--color-accent-gold)' : 'transparent'};">
                            <div style="font-size: 2rem; width: 40px; text-align: center;">${ach.icon}</div>
                            <div>
                                <div style="font-weight: 800; font-size: 0.9rem; color: ${color};">${ach.title}</div>
                                <div style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 2px;">${ach.description}</div>
                            </div>
                        </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    renderProgressionTab() {
        const progData = this.app.matchHistoryManager.getProgressionData();

        const killsChart = new ProgressionGraph(progData.map(d => ({ label: d.label, value: d.kills })), {
            label: 'Kills par jour',
            color: 'var(--color-accent-red)'
        });

        const wavesChart = new ProgressionGraph(progData.map(d => ({ label: d.label, value: d.maxWave })), {
            label: 'Vague maximale par jour',
            color: 'var(--color-accent-cyan)'
        });

        // v0.9.6 — Graphe de winrate
        const winrateData = progData.map(d => {
            const dayMatches = this.app.matchHistoryManager.getFilteredHistory({}).filter(m => {
                const mDate = typeof m.date === 'string' ? m.date : new Date(m.date).toISOString();
                return mDate.startsWith(d.date);
            });
            const wins = dayMatches.filter(m => m.won).length;
            return { label: d.label, value: dayMatches.length > 0 ? Math.round((wins / dayMatches.length) * 100) : 0 };
        });

        const winrateChart = new ProgressionGraph(winrateData, {
            label: 'Winrate % par jour',
            color: 'var(--color-accent-green)'
        });

        return `
            <div class="stack anim-fade-in" style="gap: var(--spacing-md);">
                ${killsChart.render()}
                ${wavesChart.render()}
                ${winrateChart.render()}
                <div class="card" style="text-align: center; padding: var(--spacing-md); border-color: rgba(255,255,255,0.05);">
                    <p style="font-size: 0.65rem; color: var(--color-text-muted); line-height: 1.4;">
                        Analyses de tes performances sur les 7 derniers jours.<br>
                        Gagne des parties pour voir les courbes évoluer !
                    </p>
                </div>
            </div>
        `;
    }

    renderInfosTab() {
        const filters = this.getActiveFilters();
        const filteredHistory = this.app.matchHistoryManager.getFilteredHistory(filters);
        const stats = this.app.matchHistoryManager.computeStats(filteredHistory);
        const globalStats = this.app.playerManager.getStats();

        const statCards = [
            new StatCard('Kills', stats.totalKills || globalStats.kills || 0, '☠️'),
            new StatCard('Winrate', `${stats.winRate}%`, '🏆'),
            new StatCard('Parties', stats.total || globalStats.gamesPlayed || 0, '🎮'),
            new StatCard('Moy. Kills', stats.avgKills || 0, '📊'),
            new StatCard('KDA', stats.kda || 0, '⚔️'),
            new StatCard('Victoires', stats.wins || globalStats.victories || 0, '🏅'),
        ];

        const bestStreak = this.app.matchHistoryManager.getBestWinStreaks();

        return `
            <div class="grid-2">
                ${statCards.map((card, i) => `
                    <div class="anim-delay-${i + 1}">
                        ${card.render()}
                    </div>
                `).join('')}
            </div>
            <div class="card anim-fade-in-up" style="text-align: center; margin-top: var(--spacing-lg);">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">XP Total</span>
                <strong style="display: block; font-size: var(--font-size-2xl); color: var(--color-accent-cyan); margin-top: var(--spacing-xs);">✨ ${globalStats.totalXp || 0}</strong>
            </div>
            <div class="card anim-fade-in-up" style="text-align: center; margin-top: var(--spacing-md);">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">🔥 Meilleure Série de Victoires</span>
                <strong style="display: block; font-size: var(--font-size-xl); color: var(--color-accent-gold); margin-top: var(--spacing-xs);">${bestStreak} parties</strong>
            </div>
        `;
    }

    renderHistoryTab() {
        const filters = this.getActiveFilters();
        const history = this.app.matchHistoryManager.getFilteredHistory(filters);
        const stats = this.app.matchHistoryManager.computeStats(history);

        return `
            <div class="stats-overview row row--between" style="margin-bottom: var(--spacing-xl);">
                <div class="stat-card card" style="flex: 1; text-align: center; margin-right: var(--spacing-sm);">
                    <div class="stat-card__value" style="font-size: 1.5rem; font-weight: 800;">${stats.total}</div>
                    <div class="stat-card__label" style="font-size: 0.7rem; color: var(--color-text-muted);">PARTIES</div>
                </div>
                <div class="stat-card card" style="flex: 1; text-align: center; margin-right: var(--spacing-sm);">
                    <div class="stat-card__value" style="font-size: 1.5rem; font-weight: 800; color: var(--color-accent-green);">${stats.winRate}%</div>
                    <div class="stat-card__label" style="font-size: 0.7rem; color: var(--color-text-muted);">VICTOIRES</div>
                </div>
                <div class="stat-card card" style="flex: 1; text-align: center;">
                    <div class="stat-card__value" style="font-size: 1.5rem; font-weight: 800; color: var(--color-accent-gold);">${stats.totalKills}</div>
                    <div class="stat-card__label" style="font-size: 0.7rem; color: var(--color-text-muted);">KILLS</div>
                </div>
            </div>
            <div class="history-list stack" style="gap: var(--spacing-sm);">
                ${history.length === 0 ? `
                    <div class="card" style="text-align: center; padding: var(--spacing-xl);">
                        <p style="color: var(--color-text-muted);">Aucun match trouvé avec ces filtres.</p>
                    </div>
                ` : history.slice(0, 20).map(match => this.renderMatchItem(match)).join('')}
            </div>
        `;
    }

    renderMatchItem(match) {
        const mode = getModeById(match.modeId);
        const date = new Date(match.date).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        return `
            <div class="card match-item anim-fade-in-up" style="border-left: 4px solid ${match.won ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}; padding: 12px;">
                <div class="row row--between">
                    <div class="row" style="gap: var(--spacing-md);">
                        <div style="font-size: 1.2rem;">${mode ? mode.emoji : '🎮'}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 0.9rem;">${mode ? mode.name : 'Inconnu'}</div>
                            <div style="font-size: 0.6rem; color: var(--color-text-muted);">${date}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; font-size: 0.8rem; color: ${match.won ? 'var(--color-accent-green)' : 'var(--color-accent-red)'};">${match.won ? 'VICTOIRE' : 'DÉFAITE'}</div>
                        <div style="font-size: 0.7rem;"><span style="color: var(--color-accent-gold);">${match.kills}</span> Kills</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLeaderboardTab() {
        if (!this.leaderboardType) this.leaderboardType = 'local';

        const topMatches = this.app.matchHistoryManager.getTopKillsPerMatch();

        const killsLeaderboard = new LeaderboardWidget('Top Kills par Match',
            topMatches.map((m, i) => {
                const mode = getModeById(m.modeId);
                return {
                    name: `${mode ? mode.emoji : '🎮'} ${mode ? mode.name : 'Inconnu'}`,
                    value: m.kills || 0,
                    isHighlighted: i === 0,
                };
            }), { valueLabel: 'kills', maxEntries: 10 }
        );

        // Winrate par mode
        const modeStats = (GAME_MODES || []).map(mode => {
            const stats = this.app.matchHistoryManager.getStatsByMode(mode.id);
            return { name: `${mode.emoji} ${mode.name}`, value: stats.winRate, emoji: mode.emoji, total: stats.total };
        }).filter(s => s.total > 0);

        const winrateLeaderboard = new LeaderboardWidget('Winrate par Mode (%)',
            modeStats, { valueLabel: '%', maxEntries: 10, highlightColor: 'var(--color-accent-green)' }
        );

        // Kills par héros
        const heroStats = (HEROES || []).map(hero => {
            const stats = this.app.matchHistoryManager.getStatsByHero(hero.id);
            return { name: `${hero.emoji} ${hero.name}`, value: stats.totalKills, emoji: hero.emoji, total: stats.total };
        }).filter(s => s.total > 0);

        const heroLeaderboard = new LeaderboardWidget('Kills par Héros',
            heroStats, { valueLabel: 'kills', maxEntries: 10, highlightColor: 'var(--color-accent-gold)' }
        );

        const bestStreak = this.app.matchHistoryManager.getBestWinStreaks();

        // SIMULATED GLOBAL LEADERBOARD
        let globalUI = '';
        if (this.leaderboardType === 'global') {
            const playerKills = this.app.playerManager.getStats().kills || 0;
            const fakePlayers = [
                { name: 'DarkSlayer', value: Math.max(playerKills + 500, 1500) },
                { name: 'NinjaPro', value: Math.max(playerKills + 200, 1200) },
                { name: 'TTV_NoobMaster', value: Math.max(playerKills + 50, 800) },
                { name: 'Vous (Local)', value: playerKills, isHighlighted: true },
                { name: 'Xx_Sniper_xX', value: Math.max(playerKills - 100, 500) },
                { name: 'CasualGamer', value: Math.max(playerKills - 300, 100) },
            ].sort((a, b) => b.value - a.value);

            const globalLeaderboard = new LeaderboardWidget('Classement Mondial (Kills)',
                fakePlayers, { valueLabel: 'kills', maxEntries: 10, highlightColor: 'var(--color-accent-cyan)' }
            );
            globalUI = globalLeaderboard.render();
        }

        return `
            <div class="stack anim-fade-in" style="gap: var(--spacing-lg);">
                <div class="row row--center" style="gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn--small ${this.leaderboardType === 'local' ? 'btn--primary' : 'btn--outline'}" onclick="document.dispatchEvent(new CustomEvent('toggleLeaderboard', {detail: 'local'}))">Local</button>
                    <button class="btn btn--small ${this.leaderboardType === 'global' ? 'btn--primary' : 'btn--outline'}" onclick="document.dispatchEvent(new CustomEvent('toggleLeaderboard', {detail: 'global'}))">Global</button>
                </div>

                ${this.leaderboardType === 'local' ? `
                    <div class="card" style="text-align: center; padding: 15px; background: rgba(251, 191, 36, 0.05); border-color: rgba(251, 191, 36, 0.2);">
                        <span style="font-size: 2rem;">🔥</span>
                        <div style="font-size: 0.7rem; color: var(--color-text-muted); text-transform: uppercase; font-weight: 700; margin-top: 5px;">Meilleure Série</div>
                        <div style="font-size: 1.8rem; font-weight: 900; color: var(--color-accent-gold);">${bestStreak} victoires</div>
                    </div>
                    ${killsLeaderboard.render()}
                    ${winrateLeaderboard.render()}
                    ${heroLeaderboard.render()}
                ` : globalUI}
            </div>
        `;
    }

    renderLeagueTab() {
        const lm = this.app.leagueManager;
        const progress = lm.getProgress();
        const { division, nextDivision, records, progressPct, allDivisions, claimedPromotions } = progress;

        return `
            <div class="card anim-fade-in-up" style="text-align: center; border-color: ${division.color}; margin-bottom: var(--spacing-xl);">
                <span style="font-size: 3rem;">${division.emoji}</span>
                <div style="font-size: 1.5rem; font-weight: 900; color: ${division.color}; margin-top: 5px;">${division.label}</div>
                <p style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 5px;">🎫 ${records} Records — Difficulté bots ×${division.botMult.toFixed(1)}</p>
                ${nextDivision ? `
                    <div style="margin-top: 15px; max-width: 250px; margin-left: auto; margin-right: auto;">
                        <div class="row row--between" style="font-size: 0.6rem; margin-bottom: 4px;">
                            <span>Prochain : ${nextDivision.emoji}</span>
                            <span>${records} / ${nextDivision.threshold} 🎫</span>
                        </div>
                        <div class="progress-bar" style="height: 6px;"><div class="progress-bar__fill" style="width: ${progressPct}%; background: ${nextDivision.color};"></div></div>
                    </div>
                ` : `<div style="color: var(--color-accent-gold); font-weight: 700; margin-top: 15px; font-size: 0.8rem;">👑 Rang maximum !</div>`}
            </div>
            <div class="league-track stack" style="gap: 8px;">
                ${allDivisions.map(div => {
            const isPassed = records >= div.threshold;
            return `
                        <div class="card league-tier ${isPassed ? 'league-tier--passed' : ''}" style="border-left: 3px solid ${isPassed ? div.color : 'transparent'}; padding: 10px; display: flex; align-items: center; gap: 10px;">
                            <div style="font-size: 1.2rem;">${div.emoji}</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 700; font-size: 0.8rem; color: ${isPassed ? div.color : 'inherit'}">${div.label}</div>
                                <div style="font-size: 0.6rem; color: var(--color-text-muted);">${div.threshold} 🎫</div>
                            </div>
                            <div style="font-size: 0.8rem;">${div.reward.emoji}</div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    afterRender() {
        document.querySelectorAll('.stats-tab').forEach(tab => {
            tab.onclick = () => {
                this.activeTab = tab.dataset.tab;
                this.refresh();
            };
        });

        // Filtres v0.9.6
        document.getElementById('filter-mode')?.addEventListener('change', (e) => {
            this.filterMode = e.target.value;
            this.refresh();
        });
        document.getElementById('filter-hero')?.addEventListener('change', (e) => {
            this.filterHero = e.target.value;
            this.refresh();
        });
        document.getElementById('filter-period')?.addEventListener('change', (e) => {
            this.filterPeriod = e.target.value;
            this.refresh();
        });

        // Toggle Leaderboard
        document.addEventListener('toggleLeaderboard', (e) => {
            if (this.activeTab === 'leaderboard') {
                this.leaderboardType = e.detail;
                this.refresh();
            }
        });
    }

    refresh() {
        const container = document.getElementById('page-container');
        if (container) {
            container.innerHTML = this.render();
            this.afterRender();
        }
    }
}
