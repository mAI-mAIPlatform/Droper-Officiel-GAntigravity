/* ============================
   DROPER — Page Boutique (v0.0.4 — achats uniques + caisse animée)
   ============================ */

import { SHOP_OFFERS, getOffersByCategory } from '../../data/shop.js';
import { toast } from '../components/ToastManager.js';
import { CrateAnimation } from '../components/CrateAnimation.js';

export class ShopPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const economy = this.app.economyManager;
    const claimed = this.app.saveManager.get('claimedOffers') || [];
    const sections = [
      { key: 'special', title: '🎁 OFFRES SPÉCIALES', columns: 'grid-2' },
      { key: 'starter', title: '🛡️ STARTERS', columns: 'grid-3' },
      { key: 'flash', title: '🔥 OFFRES FLASH 🔥', columns: 'grid-3' },
      { key: 'hero', title: '⚔️ PACKS HÉROS', columns: 'grid-2' },
      { key: 'crate', title: '📦 CAISSES', columns: 'grid-2' },
      { key: 'season', title: '🌅 SAISON 1 — L\'ÉVEIL', columns: 'grid-2' },
      { key: 'boost', title: '⚡ BOOSTS & PACKS', columns: 'grid-3' },
    ];

    return `
      <div class="page">
        <div class="page__header">
            <div class="row" style="gap: var(--spacing-sm);">
              <div class="currency-item">🪙 ${economy.coins}</div>
              <div class="currency-item">💎 ${economy.gems}</div>
            </div>
          </div>
        </div>

        <!-- Récompense Quotidienne -->
        <div class="section anim-fade-in-up">
           <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">✨ RÉCOMPENSES DU JOUR</h2>
           <div class="grid-1">
             ${this.renderDailyReward()}
           </div>
        </div>

        ${sections.map(section => {
      let offers = [];
      if (section.key === 'special') {
        offers = this.app.adminManager.config.specialOffers;
      } else if (section.key === 'starter') {
        offers = this.getStarters();
      } else {
        offers = getOffersByCategory(section.key);
      }

      if (offers.length === 0) return '';
      return `
            <div class="section anim-fade-in-up">
              <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">${section.title}</h2>
              <div class="${section.columns}">
                ${offers.map(offer => this.renderOffer(offer, economy, claimed)).join('')}
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;
  }

  renderOffer(offer, economy, claimed) {
    const isClaimed = claimed.includes(offer.id);
    const am = this.app.adminManager;

    let cost = { ...offer.cost };
    // Apply global reduction
    if (cost.type !== 'free' && am.config.globalReduction > 0) {
      cost.amount = Math.ceil(cost.amount * (1 - am.config.globalReduction / 100));
    }

    const canAfford = !isClaimed && economy.canAfford(cost.type, cost.amount);
    const costLabel = cost.type === 'free'
      ? 'GRATUIT'
      : cost.type === 'gems'
        ? `${cost.amount} 💎`
        : `${cost.amount} 🪙`;

    const costColor = isClaimed
      ? 'var(--color-text-muted)'
      : cost.type === 'free'
        ? 'var(--color-accent-green)'
        : cost.type === 'gems'
          ? 'var(--color-accent-purple)'
          : 'var(--color-accent-gold)';

    return `
      <div class="card" style="text-align: center; ${isClaimed ? 'opacity: 0.5;' : ''}">
        <span style="font-size: 2.2rem;">${offer.emoji}</span>
        <strong style="font-size: var(--font-size-md); display: block; margin-top: var(--spacing-sm);">${offer.name}</strong>
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs);">${offer.description}</p>
        <button class="btn" data-buy-id="${offer.id}" style="
          margin-top: var(--spacing-md); width: 100%;
          background: ${costColor}; color: white; font-weight: 700;
          opacity: ${canAfford ? 1 : 0.5};
          text-transform: uppercase; letter-spacing: 0.5px;
        " ${isClaimed ? 'disabled' : ''}>
          ${isClaimed ? '✅ Obtenu' : costLabel}
        </button>
      </div>
    `;
  }

  renderDailyReward() {
    const lastClaim = this.app.saveManager.get('shop')?.lastFreeGemsClaim || 0;
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    const timeLeft = lastClaim + cooldown - now;
    const canClaim = timeLeft <= 0;

    if (!canClaim) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `
            <div class="card card--daily-reward" style="background: var(--gradient-card-dark); border-style: dashed; border-color: var(--color-accent-purple);">
                <div class="row row--between">
                    <div>
                        <div style="font-size: var(--font-size-lg); font-weight: 800; color: var(--color-text-muted);">Récompense Récupérée ! ✅</div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-accent-purple); margin-top: 4px;">Reviens dans ${hours}h ${minutes}m</div>
                    </div>
                    <div style="font-size: 2.5rem; opacity: 0.3;">💎</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="card card--daily-reward btn--shine" style="background: var(--gradient-purple); border: 2px solid rgba(255,255,255,0.2); cursor: pointer;" id="claim-daily-btn">
            <div class="row row--between">
                <div>
                    <div style="font-size: var(--font-size-lg); font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">GEMMES GRATUITES ! 🎁</div>
                    <div style="font-size: var(--font-size-xs); color: rgba(255,255,255,0.8); margin-top: 4px;">Réclame tes 10 gemmes quotidiennes</div>
                </div>
                <div style="font-size: 2.5rem;">💎</div>
            </div>
        </div>
    `;
  }

  afterRender() {
    const claimBtn = document.getElementById('claim-daily-btn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => this.handleDailyClaim());
    }

    document.querySelectorAll('[data-buy-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.disabled) this.handlePurchase(btn.dataset.buyId);
      });
    });
  }

  handlePurchase(offerId) {
    let offer = SHOP_OFFERS.find(o => o.id === offerId);
    if (!offer) {
      // Check special offers
      offer = this.app.adminManager.config.specialOffers.find(o => o.id === offerId);
    }
    if (!offer) {
      // Check starters
      offer = this.getStarters().find(o => o.id === offerId);
    }
    if (!offer) return;

    const economy = this.app.economyManager;
    const inventory = this.app.inventoryManager;
    const claimed = this.app.saveManager.get('claimedOffers') || [];

    if (claimed.includes(offerId)) {
      toast.info('✅ Tu as déjà obtenu cette offre.');
      return;
    }

    const am = this.app.adminManager;
    let costAmount = offer.cost.amount;
    if (offer.cost.type !== 'free' && am.config.globalReduction > 0) {
      costAmount = Math.ceil(costAmount * (1 - am.config.globalReduction / 100));
    }

    // Check cost
    if (offer.cost.type === 'gems') {
      if (!economy.spendGems(costAmount)) {
        toast.error('Pas assez de gemmes !');
        return;
      }
    } else if (offer.cost.type === 'coins') {
      if (!economy.spendCoins(costAmount)) {
        toast.error('Pas assez de pièces !');
        return;
      }
    }

    // Mark as claimed
    claimed.push(offerId);
    this.app.saveManager.set('claimedOffers', claimed);

    // Build rewards for animation
    const rewards = this.buildRewards(offer, economy, inventory);

    // Play purchase sound
    if (this.app.audioManager) this.app.audioManager.playPurchase();

    // Show crate animation
    CrateAnimation.show(rewards, () => {
      this.refresh();
    });
  }

  buildRewards(offer, economy, inventory) {
    const rewards = [];
    const reward = offer.reward;

    if (reward.type === 'coins') {
      economy.addCoins(reward.amount);
      rewards.push({ type: 'coins', amount: reward.amount });
    } else if (reward.type === 'gems') {
      economy.addGems(reward.amount);
      rewards.push({ type: 'gems', amount: reward.amount });
    } else if (reward.type === 'mixed') {
      if (reward.coins) {
        economy.addCoins(reward.coins);
        rewards.push({ type: 'coins', amount: reward.coins });
      }
      if (reward.gems) {
        economy.addGems(reward.gems);
        rewards.push({ type: 'gems', amount: reward.gems });
      }
    } else if (reward.type === 'item') {
      inventory.addItem(reward.itemId, reward.amount);
      rewards.push({ type: 'item', itemId: reward.itemId, amount: reward.amount });
    } else if (reward.type === 'item_bundle') {
      for (const item of reward.items) {
        inventory.addItem(item.itemId, item.amount);
        rewards.push({ type: 'item', itemId: item.itemId, amount: item.amount });
      }
    } else if (reward.type === 'hero_pack') {
      this.app.heroManager.unlock(reward.heroId);
      rewards.push({ type: 'hero', amount: 1 });
      if (reward.fragments) {
        inventory.addItem('fragment_hero', reward.fragments);
        rewards.push({ type: 'item', itemId: 'fragment_hero', amount: reward.fragments });
      }
    }

    return rewards;
  }

  handleDailyClaim() {
    const economy = this.app.economyManager;
    const sm = this.app.saveManager;
    const shopData = sm.get('shop') || {};

    const amount = 10;
    economy.addGems(amount);

    shopData.lastFreeGemsClaim = Date.now();
    sm.set('shop', shopData);

    if (this.app.audioManager) this.app.audioManager.playPurchase();

    CrateAnimation.show([{ type: 'gems', amount }], () => {
      this.refresh();
    });
  }

  getStarters() {
    const am = this.app.adminManager;
    const starterPrices = am.config.prices.starters;

    return [
      { id: 'starter_common', name: 'Starter Commun', emoji: '📦', description: 'Pack de base pour débuter.', cost: { type: 'coins', amount: starterPrices.common }, reward: { type: 'mixed', coins: 100, gems: 5 }, rarity: 'common' },
      { id: 'starter_rare', name: 'Starter Rare', emoji: '🎁', description: 'Pack avec objets rares.', cost: { type: 'coins', amount: starterPrices.rare }, reward: { type: 'mixed', coins: 300, gems: 20 }, rarity: 'rare' },
      { id: 'starter_epic', name: 'Starter Épique', emoji: '✨', description: 'Le meilleur pour la progression.', cost: { type: 'coins', amount: starterPrices.epic }, reward: { type: 'mixed', coins: 1000, gems: 50 }, rarity: 'epic' },
      { id: 'starter_legendary', name: 'Starter Légendaire', emoji: '🌌', description: 'Pack ultime administrateur.', cost: { type: 'coins', amount: starterPrices.legendary }, reward: { type: 'mixed', coins: 5000, gems: 200 }, rarity: 'legendary' },
    ];
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
