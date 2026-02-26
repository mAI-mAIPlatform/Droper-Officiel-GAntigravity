/* ============================
   DROPER — Page Événement Saison 1 (v0.0.4 — lore chapitres)
   ============================ */

import { SEASON_1 } from '../../data/season1.js';

export class SeasonEventPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const s1 = SEASON_1;
    const stats = this.app.playerManager.getStats();

    return `
      <div class="page">
        <!-- Bannière Saison -->
        <div class="card anim-fade-in-up" style="
          background: ${s1.banner.gradient};
          border: none; padding: var(--spacing-2xl); text-align: center;
          margin-bottom: var(--spacing-xl); position: relative; overflow: hidden;
        ">
          <div style="position: relative; z-index: 1;">
            <div style="font-size: 3rem; margin-bottom: var(--spacing-sm);">${s1.emoji}</div>
            <h1 style="font-size: var(--font-size-3xl); font-weight: 900; letter-spacing: 3px; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              ${s1.banner.title}
            </h1>
            <p style="color: rgba(255,255,255,0.85); font-size: var(--font-size-md); margin-top: var(--spacing-md); max-width: 500px; margin-left: auto; margin-right: auto;">
              ${s1.banner.description}
            </p>
          </div>
        </div>

        <!-- Chapitres de lore -->
        <div class="section anim-fade-in-up anim-delay-1">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">📖 L'HISTOIRE DE L'ÉVEIL</h2>
          <div class="stack">
            ${s1.lore.map(chapter => `
              <div class="card" style="padding: var(--spacing-lg);">
                <div class="row" style="gap: var(--spacing-md); margin-bottom: var(--spacing-sm);">
                  <span class="badge badge--common" style="font-size: var(--font-size-xs);">Chapitre ${chapter.chapter}</span>
                  <strong style="font-size: var(--font-size-md);">${chapter.title}</strong>
                </div>
                <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); line-height: 1.7; font-style: italic;">
                  « ${chapter.text} »
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Événements spéciaux -->
        <div class="section anim-fade-in-up anim-delay-2" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">🎉 ÉVÉNEMENTS ACTIFS</h2>
          <div class="grid-3">
            ${s1.events.map(event => `
              <div class="card" style="text-align: center; opacity: ${event.active ? 1 : 0.4}; border-color: ${event.active ? 'var(--color-accent-gold)' : 'var(--color-border-card)'};">
                <span style="font-size: 2rem;">${event.emoji}</span>
                <strong style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-xs);">${event.name}</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs);">${event.description}</p>
                <span class="badge" style="margin-top: var(--spacing-sm); ${event.active ? 'background: var(--color-accent-green); color: white;' : ''}">
                  ${event.active ? '✅ ACTIF' : '🔒 Bientôt'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quêtes Saisonnières -->
        <div class="section anim-fade-in-up anim-delay-3" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">🏆 QUÊTES SAISONNIÈRES</h2>
          <div class="stack">
            ${s1.seasonQuests.map(quest => {
      const progress = this.getSeasonQuestProgress(quest.id, stats);
      const pct = Math.min(100, (progress / quest.target) * 100);
      const done = progress >= quest.target;
      return `
                <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg); ${done ? 'border-color: var(--color-accent-green);' : ''}">
                  <div style="flex: 1;">
                    <strong style="font-size: var(--font-size-sm);">${quest.title}</strong>
                    <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${quest.description}</p>
                    <div class="progress-bar" style="height: 5px; margin-top: var(--spacing-sm); max-width: 300px;">
                      <div class="progress-bar__fill" style="width: ${pct}%; ${done ? 'background: var(--color-accent-green);' : ''}"></div>
                    </div>
                    <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${progress} / ${quest.target}</span>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 1.2rem;">${quest.reward.emoji}</span>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); font-weight: 600;">
                      ${done ? '✅ Complété' : quest.reward.label || `+${quest.reward.amount}`}
                    </div>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getSeasonQuestProgress(questId, stats) {
    switch (questId) {
      case 'season_kills_500': return stats.kills || 0;
      case 'season_wave_15': return stats.maxWave || 0;
      case 'season_games_50': return stats.gamesPlayed || 0;
      case 'season_score_5000': return stats.totalScore || 0;
      case 'season_boss_10': return stats.bossKills || 0;
      default: return 0;
    }
  }

  afterRender() { }
}
