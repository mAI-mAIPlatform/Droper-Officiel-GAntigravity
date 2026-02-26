/* ============================
   DROPER — Page Skins 👕
   ============================ */

import { HEROES, drawHeroBody } from '../../data/heroes.js';
import { getSkinsForHero } from '../../data/skins.js';
import { toast } from '../components/ToastManager.js';

export class SkinsPage {
    constructor(app) {
        this.app = app;
        this.selectedHero = 'soldier';
    }

    render() {
        const sm = this.app.skinManager;
        const unlockedHeroes = this.app.heroManager.getUnlockedHeroes();

        return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> SKINS
          </h1>
        </div>

        <!-- Hero selector -->
        <div class="row row--wrap" style="gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);">
          ${HEROES.map(h => {
            const state = this.app.heroManager.getHeroState(h.id);
            const isUnlocked = state.unlocked || h.unlocked;
            return `
              <button class="btn ${this.selectedHero === h.id ? 'btn--accent' : 'btn--ghost'} hero-select-btn"
                      data-hero="${h.id}" ${!isUnlocked ? 'disabled' : ''}
                      style="padding: 6px 14px; font-size: var(--font-size-sm); ${!isUnlocked ? 'opacity:0.4;' : ''}">
                ${h.emoji} ${h.name}
              </button>
            `;
        }).join('')}
        </div>

        <!-- Preview -->
        <div class="row" style="gap: var(--spacing-xl); align-items: flex-start;">
          <!-- Skin preview canvas -->
          <div class="card" style="min-width: 180px; text-align: center;">
            <canvas id="skin-preview" width="150" height="150" style="background: rgba(0,0,0,0.3); border-radius: 12px;"></canvas>
            <div id="skin-active-name" style="margin-top: var(--spacing-sm); font-weight: 700; font-size: var(--font-size-sm);"></div>
          </div>

          <!-- Skin list -->
          <div style="flex: 1;">
            <h3 style="font-size: var(--font-size-md); font-weight: 700; margin-bottom: var(--spacing-md);">
              Skins disponibles
            </h3>
            <div id="skin-list" class="grid-2" style="gap: var(--spacing-sm);"></div>
          </div>
        </div>
      </div>
    `;
    }

    afterRender() {
        // Hero buttons
        document.querySelectorAll('.hero-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedHero = btn.dataset.hero;
                this.app.router.navigateTo('skins');
            });
        });

        this.renderSkins();
        this.renderPreview();
    }

    renderSkins() {
        const sm = this.app.skinManager;
        const skins = getSkinsForHero(this.selectedHero);
        const hero = HEROES.find(h => h.id === this.selectedHero);
        const equippedId = sm.getEquippedSkin(this.selectedHero);
        const container = document.getElementById('skin-list');
        if (!container) return;

        container.innerHTML = skins.map(skin => {
            const owned = sm.isOwned(this.selectedHero, skin.id);
            const equipped = skin.id === equippedId;
            return `
        <div class="card" style="padding: var(--spacing-sm); border-color: ${equipped ? skin.bodyColor : 'var(--color-border-card)'}; cursor: pointer;"
             data-skin-id="${skin.id}">
          <div class="row" style="gap: var(--spacing-sm); align-items: center;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${skin.bodyColor}; border: 2px solid ${skin.glowColor}; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <strong style="font-size: var(--font-size-sm);">${skin.name}</strong>
              ${equipped ? '<div style="font-size: var(--font-size-xs); color: var(--color-accent-green);">✅ Équipé</div>' : ''}
            </div>
            ${!owned ? `<span style="font-size: var(--font-size-xs);">🪙 ${skin.price}</span>` : ''}
          </div>
        </div>
      `;
        }).join('');

        // Click events
        container.querySelectorAll('[data-skin-id]').forEach(card => {
            card.addEventListener('click', () => {
                const skinId = card.dataset.skinId;
                if (sm.isOwned(this.selectedHero, skinId)) {
                    sm.equip(this.selectedHero, skinId);
                } else {
                    sm.buy(this.selectedHero, skinId);
                }
                this.app.router.navigateTo('skins');
            });
        });
    }

    renderPreview() {
        const canvas = document.getElementById('skin-preview');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const sm = this.app.skinManager;
        const hero = HEROES.find(h => h.id === this.selectedHero);
        const skinData = sm.getActiveSkinData(this.selectedHero);

        ctx.clearRect(0, 0, 150, 150);

        // Draw hero with skin colors
        const previewHero = {
            ...hero,
            bodyColor: skinData.bodyColor,
            glowColor: skinData.glowColor,
        };

        drawHeroBody(ctx, 75, 75, previewHero, 2.5);

        // Active skin name
        const nameEl = document.getElementById('skin-active-name');
        if (nameEl) nameEl.textContent = `${hero.emoji} ${skinData.name}`;
    }
}
