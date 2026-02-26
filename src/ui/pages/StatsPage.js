/* ============================
   DROPER — Page Statistiques Consolidée (v0.1.5)
   ============================ */

import { StatCard } from '../components/StatCard.js';
import { getModeById } from '../../data/gamemodes.js';

export class StatsPage {
  constructor(app) {
    this.app = app;
    this.activeTab = 'infos'; // infos, history, league
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
                <div class="row" style="gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'infos' ? 'active' : ''}" data-tab="infos">INFOS</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'history' ? 'active' : ''}" data-tab="history">HISTORIQUE</button>
                    <button class="btn btn--outline stats-tab ${this.activeTab === 'league' ? 'active' : ''}" data-tab="league">CLASSEMENT</button>
                </div>

                <div id="stats-tab-content" class="anim-fade-in">
                    ${this.renderActiveTab()}
                </div>
            </div>
        `;
  }

  renderActiveTab() {
    if (this.activeTab === 'infos') return this.renderInfosTab();
    if (this.activeTab === 'history') return this.renderHistoryTab();
    if (this.activeTab === 'league') return this.renderLeagueTab();
  }

  renderInfosTab() {
    const stats = this.app.playerManager.getStats();
    const statCards = [
      new StatCard('Kills', stats.kills || 0, '☠️'),
      new StatCard('Max Vague', stats.maxWave || 0, '🌊'),
      new StatCard('Parties', stats.gamesPlayed || 0, '🎮'),
      new StatCard('Victoires', stats.victories || 0, '⚔️'),
    ];

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
                <strong style="display: block; font-size: var(--font-size-2xl); color: var(--color-accent-cyan); margin-top: var(--spacing-xs);">✨ ${stats.totalXp || 0}</strong>
            </div>
        `;
  }

  renderHistoryTab() {
    const history = this.app.matchHistoryManager.getHistory();
    const stats = this.app.matchHistoryManager.getStats();

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
                        <p style="color: var(--color-text-muted);">Aucun match enregistré.</p>
                    </div>
                ` : history.map(match => this.renderMatchItem(match)).join('')}
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
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
