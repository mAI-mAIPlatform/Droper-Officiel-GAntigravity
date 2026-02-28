/* ============================
   DROPER — Page Inventaire
   ============================ */

import { ITEM_CATEGORIES, getItemsByCategory } from '../../data/inventory.js';
import { toast } from '../components/ToastManager.js';

export class InventoryPage {
  constructor(app) {
    this.app = app;
    this.filter = 'all';
  }

  render() {
    const items = this.app.inventoryManager.getAllItems();
    const categories = [
      { id: 'all', label: 'Tout', emoji: '🎒' },
      { id: 'crate', label: 'Caisses', emoji: '📦' },
      { id: 'fragment', label: 'Fragments', emoji: '🧩' },
      { id: 'booster', label: 'Boosters', emoji: '⚡' },
      { id: 'key', label: 'Clés', emoji: '🔑' },
    ];

    const favorites = this.app.saveManager.get('favorites') || { items: [], skins: {} };
    const filtered = this.filter === 'all'
      ? items
      : items.filter(i => i.category === this.filter);

    // Sort: favorites first
    filtered.sort((a, b) => {
      const aFav = favorites.items.includes(a.id);
      const bFav = favorites.items.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> INVENTAIRE
          </h1>
          <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
            ${items.length} type(s) d'item — ${items.reduce((s, i) => s + i.count, 0)} au total
          </p>
        </div>

        <!-- Filtres -->
        <div class="row row--wrap" style="margin-bottom: var(--spacing-lg); gap: var(--spacing-sm);">
          ${categories.map(cat => `
            <button class="btn ${this.filter === cat.id ? 'btn--accent' : 'btn--ghost'}" 
                    data-filter="${cat.id}" style="font-size: var(--font-size-sm);">
              ${cat.emoji} ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- Items -->
        ${filtered.length === 0 ? `
          <div class="card" style="text-align: center; padding: var(--spacing-2xl);">
            <span style="font-size: 2rem;">🎒</span>
            <p style="color: var(--color-text-muted); margin-top: var(--spacing-md);">Ton inventaire est vide.</p>
            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Joue pour obtenir des drops !</p>
          </div>
        ` : `
          <div class="grid-4" id="inventory-grid">
            ${filtered.map(item => this.renderItem(item, favorites.items.includes(item.id))).join('')}
          </div>
        `}
      </div>
    `;
  }

  renderItem(item, isFavorite) {
    const rarityColors = {
      common: 'var(--color-rarity-common)',
      rare: 'var(--color-rarity-rare)',
      epic: 'var(--color-rarity-epic)',
      legendary: 'var(--color-rarity-legendary)',
    };
    const borderColor = rarityColors[item.rarity] || rarityColors.common;
    const isCrate = item.category === 'crate';

    return `
      <div class="card anim-fade-in-up" style="text-align: center; border-color: ${borderColor}; cursor: ${isCrate ? 'pointer' : 'default'}; position: relative;"
           ${isCrate ? `data-open-crate="${item.id}"` : ''}>
        <button class="btn-favorite ${isFavorite ? 'active' : ''}" data-fav-item="${item.id}" 
                style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 1.2rem; cursor: pointer; z-index: 2;">
          ${isFavorite ? '⭐' : '☆'}
        </button>
        <span style="font-size: 2rem;">${item.emoji}</span>
        <strong style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-xs);">
          ${item.name}
        </strong>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
          ${item.description}
        </span>
        <div style="margin-top: var(--spacing-sm);">
          <span class="badge" style="background: ${borderColor}; color: white;">x${item.count}</span>
        </div>
        ${isCrate ? `
          <button class="btn btn--accent" style="margin-top: var(--spacing-sm); width: 100%; font-size: var(--font-size-xs);"
                  data-open-crate="${item.id}">
            📦 Ouvrir
          </button>
        ` : ''}
      </div>
    `;
  }

  afterRender() {
    // Filtres
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filter = btn.dataset.filter;
        this.refresh();
      });
    });

    // Ouverture de caisses
    document.querySelectorAll('[data-open-crate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('[data-fav-item]')) return;
        e.stopPropagation();
        const crateId = btn.dataset.openCrate;
        const rewards = this.app.inventoryManager.openCrate(crateId);
        if (rewards) {
          this.refresh();
        }
      });
    });

    // Favoris
    document.querySelectorAll('[data-fav-item]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.favItem;
        this.toggleFavorite(itemId);
      });
    });
  }

  toggleFavorite(itemId) {
    const sm = this.app.saveManager;
    const favorites = sm.get('favorites') || { items: [], skins: {} };
    if (favorites.items.includes(itemId)) {
      favorites.items = favorites.items.filter(id => id !== itemId);
    } else {
      favorites.items.push(itemId);
    }
    sm.set('favorites', favorites);
    this.refresh();
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
