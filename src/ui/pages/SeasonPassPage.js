/* ============================
   DROPER — Page Pass de Saison (v0.0.4 + Éveil Pass)
   ============================ */

import { SEASON_PASS } from '../../data/seasonpass.js';
import { EVEIL_PASS } from '../../data/eveilpass.js';
import { toast } from '../components/ToastManager.js';

export class SeasonPassPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const sp = this.app.seasonPassManager;
    const am = this.app.adminManager;
    const currentTier = sp.currentTier;
    const xpProgress = sp.xpProgress;
    const xpNeeded = sp.xpToNextTier;
    const isPremium = sp.isPremium;
    const premiumPrice = am.config.prices.droperPass;

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> PASS DE SAISON 1
          </h1>
          <p style="color: var(--color-text-muted); margin-top: var(--spacing-xs);">
            ${SEASON_PASS.emoji} <strong style="color: var(--color-accent-gold);">${SEASON_PASS.name}</strong>
          </p>
        </div>

        <!-- Progression -->
        <div class="card anim-fade-in-up" style="margin-bottom: var(--spacing-xl);">
          <div class="row row--between" style="margin-bottom: var(--spacing-sm);">
            <span style="font-weight: 700;">Palier ${currentTier} / ${SEASON_PASS.maxTier}</span>
            <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
              ${xpProgress} / ${xpNeeded} XP
            </span>
          </div>
          <div class="progress-bar" style="height: 8px;">
            <div class="progress-bar__fill" style="width: ${(xpProgress / xpNeeded) * 100}%"></div>
          </div>
          ${!isPremium ? `
            <button class="btn btn--accent" id="btn-buy-premium" style="margin-top: var(--spacing-md);">
              ⭐ Activer le Pass Premium (${premiumPrice} 💎)
            </button>
          ` : `
            <div style="text-align: center; margin-top: var(--spacing-md); color: var(--color-accent-gold); font-weight: 700;">
              ⭐ PREMIUM ACTIF
            </div>
          `}
        </div>

        <!-- Piste des paliers -->
        <div class="season-pass">
          <div class="season-pass__track">
            ${SEASON_PASS.tiers.map(tier => {
      const status = sp.getTierStatus(tier.tier);
      return this.renderTier(tier, status, isPremium);
    }).join('')}
          </div>
        </div>

        <!-- Éveil Pass -->
        <div class="section anim-fade-in-up" style="margin-top: var(--spacing-2xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-md);">
            🌅 ÉVEIL PASS — <span style="color: var(--color-accent-gold);">${sp.eveilTokens} 🌅</span>
          </h2>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
            Gagne des jetons 🌅 en complétant des quêtes. Chaque palier coûte ${EVEIL_PASS.tokensPerTier} 🌅.
          </p>
          <div class="season-pass__track">
            ${EVEIL_PASS.tiers.map(tier => {
      const status = sp.getEveilTierStatus(tier.tier);
      return this.renderEveilTier(tier, status);
    }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderTier(tierData, status, isPremium) {
    const { tier, free, premium } = tierData;
    const reached = status.reached;

    const freeLabel = free.type === 'hero' ? free.label : `+${free.amount}`;
    const premLabel = premium.type === 'hero' ? premium.label : `+${premium.amount}`;

    return `
      <div class="season-pass__tier" data-tier="${tier}">
        <div class="season-pass__tier-number ${reached ? 'season-pass__tier-number--unlocked' : ''}">
          ${tier}
        </div>
        <div class="season-pass__reward-box ${status.freeClaimed ? 'season-pass__reward-box--claimed' : ''} ${!reached ? 'season-pass__reward-box--locked' : ''}"
             data-claim="free" data-tier="${tier}"
             title="${free.type === 'hero' ? free.label : `${free.amount} ${free.emoji}`}">
          <span style="font-size: 1.3rem;">${free.emoji}</span>
          <span class="season-pass__reward-label">${status.freeClaimed ? '✓' : freeLabel}</span>
        </div>
        <div class="season-pass__reward-box season-pass__reward-box--premium ${status.premiumClaimed ? 'season-pass__reward-box--claimed' : ''} ${!reached || !isPremium ? 'season-pass__reward-box--locked' : ''}"
             data-claim="premium" data-tier="${tier}"
             title="Premium: ${premLabel} ${premium.emoji}">
          <span style="font-size: 1.3rem;">${premium.emoji}</span>
          <span class="season-pass__reward-label">${status.premiumClaimed ? '✓' : premLabel}</span>
          ${!isPremium ? '<span style="font-size: 0.6rem; color: var(--color-accent-gold);">🔒</span>' : ''}
        </div>
      </div>
    `;
  }

  renderEveilTier(tierData, status) {
    const { tier, reward } = tierData;

    return `
      <div class="season-pass__tier" data-eveil-tier="${tier}">
        <div class="season-pass__tier-number ${status.claimed ? 'season-pass__tier-number--unlocked' : ''}">
          ${tier}
        </div>
        <div class="season-pass__reward-box ${status.claimed ? 'season-pass__reward-box--claimed' : ''} ${!status.canClaim && !status.claimed ? 'season-pass__reward-box--locked' : ''}"
             data-claim-eveil="${tier}" style="border-color: var(--color-accent-gold);">
          <span style="font-size: 1.3rem;">${reward.emoji}</span>
          <span class="season-pass__reward-label">${status.claimed ? '✓' : reward.label}</span>
        </div>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${tierData.cost} 🌅</span>
      </div>
    `;
  }

  afterRender() {
    // Free claims
    document.querySelectorAll('[data-claim="free"]').forEach(el => {
      el.addEventListener('click', () => {
        const tier = parseInt(el.dataset.tier);
        if (this.app.seasonPassManager.claimFree(tier)) {
          if (this.app.audioManager) this.app.audioManager.playPurchase();
          this.refresh();
        }
      });
    });

    // Premium claims
    document.querySelectorAll('[data-claim="premium"]').forEach(el => {
      el.addEventListener('click', () => {
        const tier = parseInt(el.dataset.tier);
        if (this.app.seasonPassManager.claimPremium(tier)) {
          if (this.app.audioManager) this.app.audioManager.playPurchase();
          this.refresh();
        }
      });
    });

    // Éveil Pass claims
    document.querySelectorAll('[data-claim-eveil]').forEach(el => {
      el.addEventListener('click', () => {
        const tier = parseInt(el.dataset.claimEveil);
        if (this.app.seasonPassManager.claimEveil(tier)) {
          if (this.app.audioManager) this.app.audioManager.playPurchase();
          this.refresh();
        }
      });
    });

    // Premium purchase
    document.getElementById('btn-buy-premium')?.addEventListener('click', () => {
      const price = this.app.adminManager.config.prices.droperPass;
      if (this.app.economyManager.spendGems(price)) {
        this.app.seasonPassManager.activatePremium();
        if (this.app.audioManager) this.app.audioManager.playLevelUp();
        this.refresh();
      } else {
        toast.error('❌ Pas assez de gemmes !');
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
