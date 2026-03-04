/* ============================
   DROPER — Page Accueil (v0.0.3)
   ============================ */

import { SEASON_1 } from '../../data/season1.js';
import { getDailyChallenge } from '../../data/challenges.js';

export class HomePage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const player = this.app.playerManager;
    const economy = this.app.economyManager;
    const hero = this.app.heroManager.getFullHero(player.selectedHero);
    const stats = player.getStats();
    const sp = this.app.seasonPassManager;
    const s1 = SEASON_1;
    const challenge = getDailyChallenge();
    const inventory = this.app.inventoryManager;
    const recentDrops = inventory.getRecentDrops(4);
    const xpPct = player.xpToNext > 0 ? (player.xp / player.xpToNext * 100) : 0;

    const questManager = this.app.questManager;
    const dailyQuests = questManager ? questManager.getDailyQuests() : [];
    const uncompletedQuests = dailyQuests.filter(q => q.progress < q.target);
    const firstQuest = uncompletedQuests[0] || dailyQuests[0];

    const clubMgr = this.app.clubManager;
    const club = clubMgr ? clubMgr.club : null;

    return `
      <div class="page">
        <!-- Bannière Saison 1 -->
        <div class="card anim-fade-in-up" style="
          background: ${s1.banner.gradient};
          border: none; padding: var(--spacing-lg) var(--spacing-xl);
          margin-bottom: var(--spacing-xl); cursor: pointer;
        " onclick="window.location.hash='#saison-1'">
          <div class="row row--between">
            <div>
              <div style="font-size: var(--font-size-xs); text-transform: uppercase; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 1px;">
                ${s1.emoji} Saison Active
              </div>
              <div style="font-size: var(--font-size-xl); font-weight: 900; color: white; letter-spacing: 2px;">
                ${s1.banner.title}
              </div>
            </div>
            <span style="font-size: 2rem;">→</span>
          </div>
        </div>

        <!-- En-tête joueur -->
        <div class="row row--between anim-fade-in-up anim-delay-1" style="margin-bottom: var(--spacing-xl);">
          <div>
            <h1 style="font-size: var(--font-size-2xl); font-weight: 900; letter-spacing: 1px;">
              Bienvenue, <span style="background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${player.username}</span>
            </h1>
            <div style="margin-top: var(--spacing-xs);">
              <span class="badge badge--level">⚡ Niveau ${player.level}</span>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: var(--spacing-sm);">${player.xp} / ${player.xpToNext} XP</span>
            </div>
            <div class="progress-bar" style="height: 4px; margin-top: 6px; max-width: 250px;">
              <div class="progress-bar__fill" style="width: ${xpPct}%"></div>
            </div>
          </div>
          <div class="row" style="gap: var(--spacing-sm);">
            <div class="currency-item">🪙 ${economy.coins}</div>
            <div class="currency-item">💎 ${economy.gems}</div>
          </div>
        </div>

        <!-- Bouton JOUER Principal -->
        <div class="anim-fade-in-up anim-delay-1" style="text-align: center; margin: var(--spacing-xl) 0;">
          <a href="#game" class="btn btn--large btn--accent btn--shine anim-pulse-btn" style="
            min-width: 280px; font-size: 1.8rem; padding: 20px 40px;
            box-shadow: 0 10px 30px rgba(74, 158, 255, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
          ">
            🚀 JOUER MAINTENANT
          </a>
        </div>

        <!-- Stats + Héros + Pass -->
        <div class="grid-3 anim-fade-in-up anim-delay-2" style="margin-bottom: var(--spacing-xl);">
          <!-- Héros Actif -->
          <div class="card card--hero" style="background: var(--gradient-card-alt);">
            <div style="font-size: var(--font-size-xs); color: var(--color-accent-blue); text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Héros Actif</div>
            <div class="icon-circle icon-circle--large" style="background: rgba(74, 158, 255, 0.1); border: 1px solid rgba(74, 158, 255, 0.2); shadow: 0 0 15px rgba(74, 158, 255, 0.2);">
                <span style="font-size: 3rem;">${hero ? hero.emoji : '❓'}</span>
            </div>
            <div style="font-size: var(--font-size-md); font-weight: 800; text-transform: uppercase;">${hero ? hero.name : 'Aucun'}</div>
            ${hero ? `<div><span class="badge ${hero.rarity.cssClass}">${hero.rarity.label}</span></div>` : ''}
            <a href="#armurerie" class="btn btn--sm btn--purple" style="margin-top: auto; padding: 6px 12px; font-size: 0.7rem;">Changer</a>
          </div>

          <!-- Pass Saison -->
          <div class="card" style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-size: var(--font-size-xs); color: var(--color-accent-gold); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: var(--spacing-sm);">⭐ Pass Saison 1</div>
            <strong style="font-size: var(--font-size-2xl); color: var(--color-accent-gold);">Palier ${sp.currentTier}</strong>
            <div class="progress-bar" style="height: 6px; margin: var(--spacing-sm) 0;">
              <div class="progress-bar__fill" style="width: ${(sp.xpProgress / sp.xpToNextTier) * 100}%; background: var(--gradient-gold);"></div>
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
              ${sp.xpProgress} / ${sp.xpToNextTier} XP
            </div>
            <a href="#pass-saison" style="margin-top: var(--spacing-md); color: var(--color-accent-gold); font-size: var(--font-size-xs); font-weight: 600;">Voir l'aventure →</a>
          </div>

          <!-- Quêtes & Social -->
          <div class="stack" style="gap: var(--spacing-md);">
            <!-- Quête à la une -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 15px;">
              <div>
                <div style="font-size: var(--font-size-xs); color: var(--color-accent-green); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 5px;">✅ Quête en cours</div>
                <div style="font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${firstQuest ? firstQuest.title : 'Toutes terminées !'}</div>
                ${firstQuest ? `
                  <div class="progress-bar" style="height: 4px; margin: 8px 0;">
                    <div class="progress-bar__fill" style="width: ${(firstQuest.progress / firstQuest.target) * 100}%; background: var(--color-accent-green);"></div>
                  </div>
                  <div style="font-size: 0.65rem; color: var(--color-text-muted);">${firstQuest.progress} / ${firstQuest.target}</div>
                ` : ''}
              </div>
              <a href="#quetes" class="btn btn--outline" style="margin-top: 10px; padding: 6px; font-size: 0.7rem;">VOIR TOUT</a>
            </div>

            <!-- Club -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 15px; background: rgba(74, 158, 255, 0.05); border-color: rgba(74, 158, 255, 0.2);">
              <div>
                <div style="font-size: var(--font-size-xs); color: var(--color-accent-blue); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 5px;">🏠 Mon Club</div>
                ${club ? `
                  <div style="font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${club.emoji} ${club.name}</div>
                  <div style="font-size: 0.7rem; color: var(--color-accent-gold); margin-top: 2px;">🏆 ${club.trophies} Trophées</div>
                ` : `
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted);">Aucun club rejoint</div>
                `}
              </div>
              <a href="#social" class="btn btn--accent" style="margin-top: 10px; padding: 6px; font-size: 0.7rem;">${club ? 'LE CLUB' : 'REJOINDRE'}</a>
            </div>
          </div>
        </div>

        <!-- Stats Grille -->
        <div class="grid-4 anim-fade-in-up anim-delay-3" style="margin-bottom: var(--spacing-xl);">
          <div class="card" style="text-align: center; padding: var(--spacing-md);">
            <span style="font-size: 1.2rem;">☠️</span>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600;">Kills</div>
            <strong style="font-size: var(--font-size-lg);">${stats.kills || 0}</strong>
          </div>
          <div class="card" style="text-align: center; padding: var(--spacing-md);">
            <span style="font-size: 1.2rem;">🌊</span>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600;">Max Vague</div>
            <strong style="font-size: var(--font-size-lg);">${stats.maxWave || 0}</strong>
          </div>
          <div class="card" style="text-align: center; padding: var(--spacing-md);">
            <span style="font-size: 1.2rem;">🎮</span>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600;">Parties</div>
            <strong style="font-size: var(--font-size-lg);">${stats.gamesPlayed || 0}</strong>
          </div>
          <div class="card" style="text-align: center; padding: var(--spacing-md);">
            <span style="font-size: 1.2rem;">🏆</span>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600;">Trophées</div>
            <strong style="font-size: var(--font-size-lg);">${stats.trophies || 0}</strong>
          </div>
        </div>

        <div class="grid-2 anim-fade-in-up anim-delay-4">
          <!-- Derniers Drops -->
          <div class="card">
            <div style="font-size: var(--font-size-xs); color: var(--color-accent-purple); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: var(--spacing-md);">🎒 Derniers Trésors</div>
            ${recentDrops.length > 0 ? `
              <div class="row" style="gap: var(--spacing-md);">
                ${recentDrops.map(item => `
                  <div class="icon-circle" style="width: 44px; height: 44px; font-size: 1.2rem; background: rgba(168, 85, 247, 0.1);">
                    ${item.emoji}
                    <span style="position: absolute; bottom: -5px; right: -5px; font-size: 0.6rem; background: var(--color-bg-primary); padding: 1px 4px; border-radius: 4px; border: 1px solid var(--color-border);">x${item.count}</span>
                  </div>
                `).join('')}
              </div>
            ` : `<p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Encore aucun drop !</p>`}
          </div>

          <!-- Contrôles Rapides -->
          <div class="card">
            <div style="font-size: var(--font-size-xs); color: var(--color-accent-blue); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: var(--spacing-sm);">🎮 Commandes</div>
            <div style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.4;">
                <span style="color: white; font-weight: 700;">WASD</span> : Marcher | <span style="color: white; font-weight: 700;">CLIC</span> : Tirer<br>
                <span style="color: white; font-weight: 700;">ESPACE</span> : Capacité | <span style="color: white; font-weight: 700;">E</span> : Interaction
            </div>
          </div>
        </div>


      </div>
    `;
  }

  afterRender() { }
}
