import { ITEM_CATEGORIES, getItemById } from '../../data/inventory.js';
import { AURAS } from '../../data/auras.js';
import { TRAILS } from '../../data/trails.js';
import { EMOTES } from '../../data/emotes.js';
import { toast } from '../components/ToastManager.js';

export class InventoryPage {
  constructor(app) {
    this.app = app;
    this.activeTab = 'cosmetics'; // Default to the new section
  }

  render() {
    return `
      <style>
        .cosmetic-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cosmetic-item:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .cosmetic-item.active {
          border-color: var(--color-accent-blue) !important;
          background: rgba(var(--color-accent-blue-rgb), 0.1) !important;
          box-shadow: 0 0 15px rgba(var(--color-accent-blue-rgb), 0.3);
        }
        .cosmetic-item.locked {
          cursor: not-allowed;
        }
        .cosmetic-item.featured {
          border: 1px solid rgba(251, 191, 36, 0.2);
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.05), rgba(0,0,0,0));
        }
        .cosmetic-item.featured.active {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }
      </style>
      <div class="page anim-fade-in">
        <div class="page__header" style="margin-bottom: var(--spacing-xl);">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> MON INVENTAIRE
          </h1>
        </div>

        <!-- Navigation par onglets v1.1.3 -->
        <div class="row" style="gap: var(--spacing-md); margin-bottom: var(--spacing-xl); background: rgba(255,255,255,0.03); padding: 5px; border-radius: 12px; border: 1px solid var(--color-border);">
          <button class="btn btn--sm ${this.activeTab === 'cosmetics' ? 'btn--accent' : 'btn--ghost'}" data-tab="cosmetics" style="flex: 1;">✨ COSMÉTIQUES</button>
          <button class="btn btn--sm ${this.activeTab === 'items' ? 'btn--accent' : 'btn--ghost'}" data-tab="items" style="flex: 1;">🎒 OBJETS</button>
          <button class="btn btn--sm ${this.activeTab === 'emotes' ? 'btn--accent' : 'btn--ghost'}" data-tab="emotes" style="flex: 1;">🎭 EMOTES</button>
        </div>

        <div id="inventory-content">
          ${this.renderTabs()}
        </div>
      </div>
    `;
  }

  renderTabs() {
    if (this.activeTab === 'cosmetics') return this.renderCosmetics();
    if (this.activeTab === 'items') return this.renderItems();
    if (this.activeTab === 'emotes') return this.renderEmoteGrid();
    return '';
  }

  renderCosmetics() {
    const sm = this.app.skinManager;
    const equipped = sm.getEquippedCosmetics();

    return `
      <div class="anim-fade-in">
        <h2 style="font-size: var(--font-size-xl); font-weight: 900; margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: 10px;">
          ✨ COSMÉTIQUES
        </h2>

        <div class="grid-2" style="gap: var(--spacing-xl); align-items: stretch;">
          
          <!-- AURAS SECTION -->
          <div style="background: rgba(10, 15, 25, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: var(--spacing-lg); border-radius: 20px;">
            <h3 style="font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 20px;">Auras</h3>
            
            <div class="row row--wrap" style="gap: 12px; margin-bottom: 20px;">
              ${AURAS.filter(a => a.id !== 'shadow').map(aura => this.renderCosmeticItem(aura, 'aura', equipped.aura === aura.id)).join('')}
            </div>

            <!-- Featured / Legendary at bottom -->
            ${AURAS.filter(a => a.id === 'shadow').map(aura => `
              <div class="cosmetic-item featured ${equipped.aura === aura.id ? 'active' : ''}" 
                   data-type="aura" data-id="${aura.id}"
                   style="width: 100%; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 15px; display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative;">
                ${!sm.isOwned(aura.id) ? '<span style="position: absolute; top: 10px; right: 10px; font-size: 0.9rem;">🔒</span>' : ''}
                <span style="font-size: 2rem; margin-bottom: 8px;">${aura.emoji}</span>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">${aura.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- TRAILS SECTION (Traces de pas) -->
          <div style="background: rgba(10, 15, 25, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: var(--spacing-lg); border-radius: 20px;">
            <h3 style="font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 20px;">Traces de pas</h3>
            
            <div class="row row--wrap" style="gap: 12px; margin-bottom: 20px;">
              ${TRAILS.filter(t => t.id !== 'shadow_trail').map(trail => this.renderCosmeticItem(trail, 'trail', equipped.trail === trail.id)).join('')}
            </div>

            <!-- Featured / Legendary at bottom -->
            ${TRAILS.filter(t => t.id === 'shadow_trail').map(trail => `
              <div class="cosmetic-item featured ${equipped.trail === trail.id ? 'active' : ''}" 
                   data-type="trail" data-id="${trail.id}"
                   style="width: 100%; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 15px; display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative;">
                ${!sm.isOwned(trail.id) ? '<span style="position: absolute; top: 10px; right: 10px; font-size: 0.9rem;">🔒</span>' : ''}
                <span style="font-size: 2rem; margin-bottom: 8px;">${trail.emoji}</span>
                <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">${trail.name}</span>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;
  }

  renderCosmeticItem(item, type, isActive) {
    const sm = this.app.skinManager;
    const isOwned = sm.isOwned(item.id);

    return `
      <div class="cosmetic-item ${isActive ? 'active' : ''} ${!isOwned ? 'locked' : ''}" 
           data-type="${type}" data-id="${item.id}"
           style="flex: 0 0 calc(33.33% - 8px); aspect-ratio: 0.85; border-radius: 12px; border: 2px solid ${isActive ? 'var(--color-accent-blue)' : 'rgba(255,255,255,0.05)'}; 
                  background: rgba(255,255,255,0.02); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: all 0.2s;">
        ${!isOwned ? '<span style="position: absolute; top: 6px; right: 6px; font-size: 0.7rem; opacity: 0.6;">🔒</span>' : ''}
        <span style="font-size: 1.8rem; margin-bottom: 6px; ${!isOwned ? 'filter: grayscale(1) opacity(0.3);' : ''}">${item.id === 'none' ? '❌' : item.emoji}</span>
        <span style="font-size: 0.6rem; color: var(--color-text-muted); font-weight: 600; text-align: center; padding: 0 4px; ${!isOwned ? 'opacity: 0.4;' : ''}">
          ${item.name}
        </span>
      </div>
    `;
  }

  renderItems() {
    const items = this.app.inventoryManager.getAllItems();
    return `
      <div class="anim-fade-in">
        <div class="grid-4">
          ${items.map(item => `
            <div class="card" style="text-align: center; border-color: rgba(255,255,255,0.1);">
                <span style="font-size: 2rem;">${item.emoji}</span>
                <strong style="font-size: var(--font-size-sm); display: block; margin-top: 8px;">${item.name}</strong>
                <p style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 4px;">${item.description}</p>
                <div style="margin-top: 10px;">
                  <span class="badge" style="background: rgba(255,255,255,0.1);">x${item.count}</span>
                </div>
                ${item.category === 'crate' ? `
                  <button class="btn btn--accent btn--sm" style="margin-top: 10px; width: 100%;" onclick="this.closest('.card').dispatchEvent(new CustomEvent('open-crate', {detail: '${item.id}'}))">
                    OUVRIR
                  </button>
                ` : ''}
            </div>
          `).join('')}
        </div>
        ${items.length === 0 ? '<div class="card" style="text-align: center; padding: 40px; color: var(--color-text-muted);">Ton inventaire est vide.</div>' : ''}
      </div>
    `;
  }

  renderEmoteGrid() {
    const em = this.app.emoteManager;
    const unlockedEmotes = em ? em.data.owned || [] : [];

    return `
      <div class="anim-fade-in">
        <h2 style="font-size: var(--font-size-xl); font-weight: 900; margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: 10px;">
          🎭 EMOTES
        </h2>
        <div class="grid-5" style="gap: 12px;">
          ${EMOTES.map(emote => {
      const isUnlocked = unlockedEmotes.includes(emote.id);
      return `
              <div class="card" style="text-align: center; border-color: ${isUnlocked ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)'}; ${!isUnlocked ? 'opacity: 0.5;' : ''}; cursor: pointer;"
                   onclick="this.dispatchEvent(new CustomEvent('emote-click', {detail: '${emote.id}'}))">
                ${!isUnlocked ? '<div style="position: absolute; top:5px; right:5px; font-size: 0.7rem;">🔒</div>' : ''}
                <span style="font-size: 2rem;">${emote.emoji}</span>
                <div style="font-size: 0.7rem; font-weight: 800; margin-top: 5px;">${emote.label}</div>
                ${isUnlocked ? '<div style="font-size: 0.6rem; color: var(--color-accent-blue); margin-top: 4px;">OBTENU</div>' : `<div style="font-size: 0.6rem; color: var(--color-text-muted); margin-top: 4px;">${emote.price} 🪙</div>`}
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  afterRender() {
    // Tabs switching
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.refresh();
      };
    });

    // Cosmetic interaction
    document.querySelectorAll('.cosmetic-item').forEach(el => {
      el.onclick = () => {
        const { id, type } = el.dataset;
        if (id === 'none' || this.app.skinManager.isOwned(id)) {
          this.app.skinManager.equip(null, id, type); // null because global cosm, not hero skin
          this.refresh();
        } else {
          toast.info("Achetez ce cosmétique dans la boutique !");
        }
      };
    });

    // Opening crates
    document.querySelectorAll('[data-open-crate]').forEach(btn => {
      // Handled via custom event or direct click if in items tab
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
