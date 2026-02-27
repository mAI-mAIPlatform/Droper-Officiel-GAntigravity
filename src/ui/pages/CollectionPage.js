/* ============================
   DROPER — Page Collection (Inventaire + Skins)
   ============================ */

import { ITEM_CATEGORIES } from '../../data/inventory.js';
import { HEROES, drawHeroBody } from '../../data/heroes.js';
import { getSkinsForHero } from '../../data/skins.js';
import { toast } from '../components/ToastManager.js';
import { CrateAnimation } from '../components/CrateAnimation.js';

export class CollectionPage {
  constructor(app) {
    this.app = app;
    this.activeTab = 'items'; // 'items' or 'skins'

    // State for items
    this.itemFilter = 'all';

    // State for skins
    this.selectedHero = 'soldier';
  }

  render() {
    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> MA COLLECTION
          </h1>
        </div>

        <!-- Tabs -->
        <div class="row" style="gap: var(--spacing-md); margin-bottom: var(--spacing-xl); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-sm);">
          <button class="btn ${this.activeTab === 'items' ? 'btn--accent' : 'btn--ghost'}" 
                  data-tab="items" style="width: auto; padding: 10px 30px;">
            🎒 Objets
          </button>
          <button class="btn ${this.activeTab === 'skins' ? 'btn--accent' : 'btn--ghost'}" 
                  data-tab="skins" style="width: auto; padding: 10px 30px;">
            👕 Apparences
          </button>
        </div>

        <div id="collection-content">
          ${this.activeTab === 'items' ? this.renderItems() : this.renderSkins()}
        </div>
      </div>
    `;
  }

  renderItems() {
    const items = this.app.inventoryManager.getAllItems();
    const categories = [
      { id: 'all', label: 'Tout', emoji: '🎒' },
      { id: 'crate', label: 'Caisses', emoji: '📦' },
      { id: 'fragment', label: 'Fragments', emoji: '🧩' },
      { id: 'booster', label: 'Boosters', emoji: '⚡' },
      { id: 'key', label: 'Clés', emoji: '🔑' },
    ];

    const filtered = this.itemFilter === 'all'
      ? items
      : items.filter(i => i.category === this.itemFilter);

    return `
            <div class="anim-fade-in">
                <!-- Filtres -->
                <div class="row row--wrap" style="margin-bottom: var(--spacing-lg); gap: var(--spacing-sm);">
                  ${categories.map(cat => `
                    <button class="btn ${this.itemFilter === cat.id ? 'btn--accent' : 'btn--ghost'}" 
                            data-filter="${cat.id}" style="width: auto; font-size: var(--font-size-sm); padding: 6px 16px;">
                      ${cat.emoji} ${cat.label}
                    </button>
                  `).join('')}
                </div>

                <!-- Items Grid -->
                ${filtered.length === 0 ? `
                  <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
                    <span style="font-size: 2rem;">🎒</span>
                    <p style="color: var(--color-text-muted); margin-top: var(--spacing-md);">Ton inventaire est vide.</p>
                  </div>
                ` : `
                  <div class="grid-4">
                    ${filtered.map(item => this.renderSingleItem(item)).join('')}
                  </div>
                `}
            </div>
        `;
  }

  renderSingleItem(item) {
    const rarityColors = {
      common: 'var(--color-rarity-common)',
      rare: 'var(--color-rarity-rare)',
      epic: 'var(--color-rarity-epic)',
      legendary: 'var(--color-rarity-legendary)',
    };
    const borderColor = rarityColors[item.rarity] || rarityColors.common;
    const isCrate = item.category === 'crate';

    return `
          <div class="card anim-fade-in-up" style="text-align: center; border-color: ${borderColor}; cursor: ${isCrate ? 'pointer' : 'default'};"
               ${isCrate ? `data-open-crate="${item.id}"` : ''}>
            <span style="font-size: 2.2rem;">${item.emoji}</span>
            <strong style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-xs);">
              ${item.name}
            </strong>
            <p style="font-size: 0.75rem; color: var(--color-text-muted); min-height: 2.4em; display: flex; align-items: center; justify-content: center;">
              ${item.description}
            </p>
            <div style="margin-top: var(--spacing-sm);">
              <span class="badge" style="background: ${borderColor}; color: white;">x${item.count}</span>
            </div>
          </div>
        `;
  }

  renderSkins() {
    const sm = this.app.skinManager;
    const hero = HEROES.find(h => h.id === this.selectedHero);
    const skins = getSkinsForHero(this.selectedHero);
    const equippedId = sm.getEquippedSkin(this.selectedHero);
    const skinData = sm.getActiveSkinData(this.selectedHero);

    return `
            <div class="anim-fade-in">
                <!-- Hero selector -->
                <div class="row row--wrap" style="gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
                  ${HEROES.map(h => {
      const state = this.app.heroManager.getHeroState(h.id);
      const isUnlocked = state.unlocked || h.unlocked;
      return `
                      <button class="btn ${this.selectedHero === h.id ? 'btn--accent' : 'btn--ghost'} hero-select-btn"
                              data-hero="${h.id}" ${!isUnlocked ? 'disabled' : ''}
                              style="width: auto; padding: 6px 14px; font-size: var(--font-size-sm); ${!isUnlocked ? 'opacity:0.4;' : ''}">
                        ${h.emoji} ${h.name}
                      </button>
                    `;
    }).join('')}
                </div>

                <div class="row" style="gap: var(--spacing-xl); align-items: flex-start;">
                    <!-- Preview -->
                    <div class="card" style="min-width: 220px; text-align: center; padding: var(--spacing-lg);">
                        <canvas id="skin-preview" width="180" height="180" style="background: rgba(0,0,0,0.3); border-radius: 12px;"></canvas>
                        <div style="margin-top: var(--spacing-md);">
                            <strong style="color: var(--color-accent-blue);">${hero.name.toUpperCase()}</strong>
                            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 4px;">${skinData.name}</div>
                        </div>
                    </div>

                    <!-- Skin list -->
                    <div style="flex: 1;">
                        <div class="grid-2" style="gap: var(--spacing-sm);">
                            ${skins.map(skin => {
      const owned = sm.isOwned(this.selectedHero, skin.id);
      const equipped = skin.id === equippedId;
      return `
                                    <div class="card ${equipped ? 'ult-ready-glow' : ''}" 
                                         style="padding: var(--spacing-md); border-color: ${equipped ? skin.bodyColor : 'var(--color-border-card)'}; cursor: pointer;"
                                         data-skin-id="${skin.id}">
                                      <div class="row" style="gap: var(--spacing-md); align-items: center;">
                                        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${skin.bodyColor}; border: 2px solid ${skin.glowColor}; border-bottom-width: 6px; flex-shrink: 0;"></div>
                                        <div style="flex: 1;">
                                          <strong style="font-size: var(--font-size-sm);">${skin.name}</strong>
                                          ${equipped ? '<div style="font-size: var(--font-size-xs); color: var(--color-accent-green); font-weight: 800;">ÉQUIPÉ</div>' : ''}
                                        </div>
                                        ${!owned ? `<span class="badge ${skin.isEvent ? 'badge--rare' : 'badge--common'}" style="color: ${skin.isEvent ? 'var(--color-accent-purple)' : 'var(--color-accent-gold)'};">${skin.isEvent ? '🎟️' : '🪙'} ${skin.isEvent ? skin.eventPrice : skin.price}</span>` : ''}
                                      </div>
                                    </div>
                                `;
    }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  afterRender() {
    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.refresh();
      };
    });

    if (this.activeTab === 'items') {
      this.afterRenderItems();
    } else {
      this.afterRenderSkins();
    }
  }

  afterRenderItems() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.onclick = () => {
        this.itemFilter = btn.dataset.filter;
        this.refresh();
      };
    });

    document.querySelectorAll('[data-open-crate]').forEach(btn => {
      btn.onclick = (e) => {
        const crateId = btn.dataset.openCrate;
        const rewards = this.app.inventoryManager.openCrate(crateId);
        if (rewards) {
          if (this.app.audioManager) this.app.audioManager.playPurchase();
          const safeRarity = rewards.safeRarity || 1;
          CrateAnimation.show(rewards, () => {
            this.refresh();
          }, safeRarity);
        }
      };
    });
  }

  afterRenderSkins() {
    document.querySelectorAll('.hero-select-btn').forEach(btn => {
      btn.onclick = () => {
        this.selectedHero = btn.dataset.hero;
        this.refresh();
      };
    });

    document.querySelectorAll('[data-skin-id]').forEach(card => {
      card.onclick = () => {
        const skinId = card.dataset.skinId;
        const sm = this.app.skinManager;
        if (sm.isOwned(this.selectedHero, skinId)) {
          sm.equip(this.selectedHero, skinId);
        } else {
          sm.buy(this.selectedHero, skinId);
        }
        this.refresh();
      };
    });

    this.renderPreview();
  }

  renderPreview() {
    const canvas = document.getElementById('skin-preview');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const sm = this.app.skinManager;
    const hero = HEROES.find(h => h.id === this.selectedHero);
    const skinData = sm.getActiveSkinData(this.selectedHero);

    ctx.clearRect(0, 0, 180, 180);
    const previewHero = {
      ...hero,
      bodyColor: skinData.bodyColor,
      glowColor: skinData.glowColor,
    };
    drawHeroBody(ctx, 90, 90, previewHero, 3.0);
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
