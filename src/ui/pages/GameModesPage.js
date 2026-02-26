/* ============================
   DROPER — Page Sélection de Mode
   ============================ */

import { GAME_MODES } from '../../data/gamemodes.js';

export class GameModesPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> MODES DE JEU
          </h1>
          <p style="color: var(--color-text-muted); margin-top: var(--spacing-xs);">
            Choisis ton mode et affronte les bots !
          </p>
        </div>

        <div class="grid-2" style="gap: var(--spacing-lg);">
          ${GAME_MODES.map((mode, i) => `
            <div class="card mode-card anim-fade-in-up anim-delay-${Math.min(i + 1, 6)}"
                 data-mode-id="${mode.id}"
                 style="cursor: pointer; border-color: ${mode.color}; transition: transform 0.2s;">
              <div class="row" style="gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                <span style="font-size: 2.5rem;">${mode.emoji}</span>
                <div>
                  <strong style="font-size: var(--font-size-lg); display: block;">${mode.name}</strong>
                  <span class="badge" style="background: ${mode.color}; color: white; font-size: var(--font-size-xs);">
                    ${mode.type === 'solo' ? `Solo — ${mode.totalPlayers} joueurs` : `${mode.teamSize}v${mode.teamSize}`}
                  </span>
                </div>
              </div>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
                ${mode.description}
              </p>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                ${mode.rules.map(r => `<div>• ${r}</div>`).join('')}
              </div>
              <div style="margin-top: var(--spacing-md); text-align: center;">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">⏱ ${Math.floor(mode.duration / 60)}:${(mode.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  afterRender() {
    document.querySelectorAll('[data-mode-id]').forEach(card => {
      card.addEventListener('click', () => {
        const modeId = card.dataset.modeId;
        if (this.app.audioManager) this.app.audioManager.playClick();
        // Store selected mode and go to game
        this.app.selectedMode = modeId;
        window.location.hash = '#lobby';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}
