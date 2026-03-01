/* ============================
   DROPER — Page Boutique (v0.0.4 — achats uniques + caisse animée)
   ============================ */

import { SHOP_OFFERS, getOffersByCategory } from '../../data/shop.js';
import { toast } from '../components/ToastManager.js';
import { CrateAnimation } from '../components/CrateAnimation.js';
import { RARITIES } from '../../data/heroes.js';
import { rollSafeLoot } from '../../data/safeLoot.js';

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
              ${economy.eventTokens > 0 ? `<div class="currency-item" style="color:var(--color-accent-purple);">🎟️ ${economy.eventTokens}</div>` : ''}
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
        const adminOffers = this.app.adminManager?.config?.specialOffers || [];
        offers = [...adminOffers];
      } else if (section.key === 'starter') {
        offers = this.getStarters();
      } else {
        const standardOffers = getOffersByCategory(section.key);
        // Inject admin offers into specific categories if they match
        const adminOffers = (this.app.adminManager?.config?.specialOffers || []).filter(o => o.category === section.key);
        offers = [...standardOffers, ...adminOffers];
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

    const rarityKey = (offer.rarity || 'common').toUpperCase();
    const rarity = RARITIES[rarityKey] || RARITIES.COMMON;
    const borderColor = rarity.color;
    const glowColor = `${rarity.color}66`; // ~40% d'opacité

    let cost = { ...offer.cost };
    // Handle free offers from data or admin
    if (!cost || Object.keys(cost).length === 0 || cost.amount === 0 || cost.type === 'free') {
      cost = { type: 'free', amount: 0 };
    }

    // Apply global reduction (only for non-free)
    if (cost.type !== 'free' && am.config && am.config.globalReduction > 0) {
      cost.amount = Math.ceil(cost.amount * (1 - am.config.globalReduction / 100));
    }

    const canAfford = !isClaimed && (cost.type === 'free' || economy.canAfford(cost.type, cost.amount));
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

    const isLegendary = rarityKey === 'LEGENDARY';
    const animationClass = isLegendary ? 'anim-glow-pulse' : '';

    return `
      <div class="card card--offer anim-scale-in ${animationClass}" data-offer-id="${offer.id}" style="
        border: 2px solid ${borderColor}; 
        box-shadow: 0 4px 15px ${glowColor}; 
        position: relative; 
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
        ${isClaimed ? 'opacity: 0.5;' : ''}
      " onmouseover="if(!${isClaimed}) { this.style.transform='scale(1.03)'; this.style.boxShadow='0 8px 25px ${glowColor}'; }" 
        onmouseout="if(!${isClaimed}) { this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px ${glowColor}'; }">
        <span style="font-size: 2.2rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); animation: float 4s ease-in-out infinite;">${offer.emoji}</span>
        <strong style="font-size: var(--font-size-md); display: block; margin-top: var(--spacing-sm);">${offer.name}</strong>
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs);">${offer.description}</p>
        <button class="btn btn--shine" data-buy-id="${offer.id}" style="
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
    const daily = this.app.dailyRewardManager.getStatus();
    const rewards = this.app.dailyRewardManager.rewards;
    const currentDay = (daily.consecutiveDays - (daily.claimedToday ? 1 : 0)) % 7;

    return `
        <div class="card card--daily-reward anim-fade-in-up" style="background: var(--gradient-card-dark); border: 1px solid rgba(255,255,255,0.1); padding: 15px; margin-bottom: 20px;">
            <div class="row row--between" style="margin-bottom: 15px;">
                <h3 style="font-size: 0.85rem; font-weight: 800; color: var(--color-accent-gold); letter-spacing: 0.5px;">🎁 CADEAUX DE CONNEXION</h3>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: white;">Série de ${daily.consecutiveDays} Jours</div>
                    <div style="font-size: 0.6rem; color: var(--color-text-muted);">Récompenses hebdomadaires</div>
                </div>
            </div>
            
            <div class="row" style="gap: 8px; overflow-x: auto; padding-bottom: 10px; -ms-overflow-style: none; scrollbar-width: none; margin: 0 -5px;">
                ${rewards.map((r, i) => {
      const isClaimed = i < currentDay || (i === currentDay && daily.claimedToday);
      const isCurrent = i === currentDay && !daily.claimedToday;
      return `
                        <div class="daily-item ${isCurrent ? 'active' : ''} ${isClaimed ? 'claimed' : ''}" style="
                            flex: 0 0 62px; aspect-ratio: 1; border-radius: 12px;
                            background: ${isCurrent ? 'var(--gradient-gold)' : isClaimed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.03)'};
                            border: 2px solid ${isCurrent ? 'var(--color-accent-gold)' : isClaimed ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.05)'};
                            display: flex; flex-direction: column; align-items: center; justify-content: center;
                            position: relative; transition: all 0.3s ease;
                        ">
                            <span style="font-size: 0.55rem; font-weight: 800; color: ${isCurrent ? 'white' : 'var(--color-text-muted)'}; position: absolute; top: 6px;">J${i + 1}</span>
                            <span style="font-size: 1.4rem; margin-top: 6px; filter: ${isClaimed ? 'grayscale(0.5)' : 'none'}">${r.emoji}</span>
                            <span style="font-size: 0.55rem; font-weight: 700; color: ${isCurrent ? 'white' : 'inherit'}; margin-top: 2px;">
                                ${r.type === 'mixed' ? (r.gems + ' 💎') : (r.amount || r.coins) + (r.type === 'gems' ? ' 💎' : ' 🪙')}
                            </span>
                            ${isClaimed ? '<div style="position: absolute; bottom: -4px; right: -4px; background: var(--color-accent-green); border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 2px solid #0a0e1a; font-size: 8px; color: white;">✓</div>' : ''}
                        </div>
                    `;
    }).join('')}
            </div>

            <button class="btn btn--shine" id="btn-claim-daily" style="
                width: 100%; margin-top: 12px; height: 40px; font-weight: 900; font-size: 0.8rem;
                background: ${daily.claimedToday ? 'rgba(255,255,255,0.05)' : 'var(--gradient-gold)'};
                color: ${daily.claimedToday ? 'var(--color-text-muted)' : 'white'};
                border: none;
            " ${daily.claimedToday ? 'disabled' : ''}>
                ${daily.claimedToday ? 'COMPLÉTÉ' : 'RÉCUPÉRER'}
            </button>
        </div>

        <!-- Coffre Fort Existant -->
        ${this.renderSafeBox()}
    `;
  }

  renderSafeBox() {
    const shopData = this.app.saveManager.get('shop') || {};
    const safeData = shopData.safe || { upgradesLeft: 5, lastClaim: 0, currentRarity: 1 };

    if (!shopData.safe) {
      shopData.safe = safeData;
      this.app.saveManager.set('shop', shopData);
    }

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    const timeLeft = (safeData.lastClaim || 0) + cooldown - now;
    const canClaimOrUpgrade = timeLeft <= 0;

    if (!canClaimOrUpgrade) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `
            <div class="card card--daily-reward" style="background: var(--gradient-card-dark); border-style: dashed; border-color: rgba(255,255,255,0.05);">
                <div class="row row--between" style="align-items: center;">
                    <div>
                        <div style="font-size: var(--font-size-md); font-weight: 800; color: var(--color-text-muted);">Coffre-fort ouvert ! 📦</div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-accent-blue); margin-top: 4px;">Nouveau coffre dans ${hours}h ${minutes}m</div>
                    </div>
                    <div style="font-size: 2rem; opacity: 0.2;">🔒</div>
                </div>
            </div>
        `;
    }

    const rarityKey = Object.keys(RARITIES).find(k => RARITIES[k].value === safeData.currentRarity) || 'COMMON';
    const rarity = RARITIES[rarityKey];

    return `
        <div class="card card--daily-reward" style="background: var(--gradient-purple); border: 2px solid ${rarity.color}; position:relative; overflow:hidden;">
            <div class="row row--between" style="align-items: center;">
                <div style="flex: 1;">
                    <div style="font-size: var(--font-size-md); font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">COFFRE-FORT ÉVOLUTIF</div>
                    <div style="font-size: var(--font-size-xs); color: ${rarity.color}; margin-top: 4px; font-weight: bold;">Rareté: ${rarity.label}</div>
                    <div style="margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn btn--sm" id="btn-upgrade-safe" style="background: var(--color-accent-blue); color: white;" ${safeData.upgradesLeft <= 0 ? 'disabled' : ''}>
                          Améliorer (${safeData.upgradesLeft}/5)
                        </button>
                        <button class="btn btn--sm" id="btn-open-safe" style="background: var(--color-accent-green); color: white;">
                          Ouvrir
                        </button>
                    </div>
                </div>
                <div style="font-size: 3rem; text-align: center; width: 60px;">📦</div>
            </div>
        </div>
    `;
  }

  afterRender() {
    const btnUpgrade = document.getElementById('btn-upgrade-safe');
    if (btnUpgrade) btnUpgrade.addEventListener('click', () => this.handleSafeUpgrade());

    const btnOpen = document.getElementById('btn-open-safe');
    if (btnOpen) btnOpen.addEventListener('click', () => this.handleSafeOpen());

    const btnClaimDaily = document.getElementById('btn-claim-daily');
    if (btnClaimDaily) btnClaimDaily.addEventListener('click', () => this.handleClaimDaily());

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

  handleSafeUpgrade() {
    const sm = this.app.saveManager;
    const shopData = sm.get('shop') || {};
    const safeData = shopData.safe || { upgradesLeft: 5, lastClaim: 0, currentRarity: 1 };

    if (safeData.upgradesLeft > 0) {
      safeData.upgradesLeft--;
      if (safeData.currentRarity < 6) safeData.currentRarity++;
      shopData.safe = safeData;
      sm.set('shop', shopData);
      this.refresh();
    }
  }

  handleSafeOpen() {
    const sm = this.app.saveManager;
    const shopData = sm.get('shop') || {};
    const safeData = shopData.safe;
    if (!safeData) return;

    const rarity = safeData.currentRarity; // 1 to 6
    const rewards = [];
    const economy = this.app.economyManager;
    const inventory = this.app.inventoryManager;

    const rolledReward = rollSafeLoot(rarity, this.app.skinManager, this.app.emoteManager);
    rewards.push(rolledReward);

    rewards.forEach(r => {
      if (r.type === 'coins') economy.addCoins(r.amount);
      else if (r.type === 'gems') economy.addGems(r.amount);
      else if (r.type === 'item' && inventory) inventory.addItem(r.itemId, r.amount);
      else if (r.type === 'skin' && this.app.skinManager) {
        this.app.skinManager.unlock(r.skinId);
        toast.reward(`👕 Skin débloqué : ${r.name} !`);
      }
      else if (r.type === 'emote' && this.app.emoteManager) {
        this.app.emoteManager.unlock(r.emoteId);
        toast.reward(`💬 Emote débloquée : ${r.emoji} ${r.name} !`);
      }
    });

    safeData.lastClaim = Date.now();
    safeData.upgradesLeft = 5;
    safeData.currentRarity = 1; // reset

    shopData.safe = safeData;
    sm.set('shop', shopData);

    if (this.app.audioManager) this.app.audioManager.playPurchase();
    CrateAnimation.show(rewards, () => {
      this.refresh();
    });
  }

  handleClaimDaily() {
    const res = this.app.dailyRewardManager.claim();
    if (res.success) {
      toast.reward(`🎁 Récompense récupérée !`);
      if (this.app.audioManager) this.app.audioManager.playPurchase();

      const rewards = [];
      if (res.reward.type === 'coins') rewards.push({ type: 'coins', amount: res.reward.amount });
      if (res.reward.type === 'gems') rewards.push({ type: 'gems', amount: res.reward.amount });
      if (res.reward.type === 'mixed') {
        if (res.reward.coins) rewards.push({ type: 'coins', amount: res.reward.coins });
        if (res.reward.gems) rewards.push({ type: 'gems', amount: res.reward.gems });
      }

      CrateAnimation.show(rewards, () => {
        this.refresh();
      });
    } else {
      toast.error(res.reason);
    }
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
