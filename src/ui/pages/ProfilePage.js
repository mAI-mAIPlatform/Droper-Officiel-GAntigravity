/* ============================
   DROPER — Page Profil (v0.0.4)
   ============================ */

import { toast } from '../components/ToastManager.js';

export class ProfilePage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const player = this.app.playerManager;
    const stats = player.getStats();
    const hero = this.app.heroManager.getFullHero(player.selectedHero);
    const economy = this.app.economyManager;
    const xpPct = player.xpToNext > 0 ? (player.xp / player.xpToNext * 100) : 0;

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> PROFIL
          </h1>
        </div>

        <!-- Carte Profil -->
        <div class="profile-card anim-fade-in-up">
          <div class="profile-card__identity">
            <div class="avatar">
              ${player.avatarEmoji}
              <div class="avatar__edit" id="btn-edit-avatar" title="Modifier l'avatar">✏️</div>
            </div>
            <div class="profile-card__info">
              <div class="profile-card__label">Identité</div>
              <div class="profile-card__name">
                ${player.username}
                <span class="player-tag">${player.tag}</span>
              </div>
              <div class="profile-card__bio">
                ${player.bio || 'Aucune bio définie...'}
              </div>
            </div>
          </div>

          <div class="profile-card__badges">
            <span class="badge badge--level">⚡ LVL ${player.level}</span>
            <span class="badge badge--common">🏆 ${stats.trophies || 0}</span>
            <span class="badge badge--rare">👑 ${hero ? hero.name : 'Aucun'}</span>
            <span class="badge badge--epic">🎮 ${stats.gamesPlayed || 0}</span>
          </div>

          <!-- XP Bar -->
          <div style="margin-top: var(--spacing-md);">
            <div class="row row--between" style="margin-bottom: 4px;">
              <span style="font-size: var(--font-size-xs); font-weight: 600;">Progression</span>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${player.xp} / ${player.xpToNext} XP</span>
            </div>
            <div class="progress-bar" style="height: 6px;">
              <div class="progress-bar__fill" style="width: ${xpPct}%"></div>
            </div>
          </div>

          <span class="profile-card__version">v${this.app.version}</span>
        </div>

        <!-- Statistiques détaillées -->
        <div class="section anim-fade-in-up anim-delay-1" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">📊 STATISTIQUES</h2>
          <div class="grid-4">
            ${this.renderStatCard('☠️', 'Kills totaux', stats.kills || 0)}
            ${this.renderStatCard('🌊', 'Vague max', stats.maxWave || 0)}
            ${this.renderStatCard('🎮', 'Parties', stats.gamesPlayed || 0)}
            ${this.renderStatCard('🏆', 'Trophées', stats.trophies || 0)}
            ${this.renderStatCard('⭐', 'Score total', stats.totalScore || 0)}
            ${this.renderStatCard('💀', 'Boss vaincus', stats.bossKills || 0)}
            ${this.renderStatCard('🪙', 'Pièces totales', economy.coins)}
            ${this.renderStatCard('💎', 'Gemmes totales', economy.gems)}
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="section anim-fade-in-up anim-delay-2" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">✏️ PERSONNALISATION</h2>
          <div class="grid-2">
            <button class="btn btn--accent" id="btn-edit-name">✏️ Modifier le pseudo</button>
            <button class="btn btn--purple" id="btn-edit-bio">📝 Modifier la bio</button>
            <button class="btn btn--ghost" id="btn-edit-emoji">😀 Changer l'avatar</button>
            <a href="#armurerie" class="btn btn--ghost" style="text-align: center;">⚔️ Changer de héros</a>
          </div>
        </div>

        <!-- Paramètres -->
        <div class="section anim-fade-in-up anim-delay-3" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">⚙️ PARAMÈTRES</h2>
          <div class="stack">
            <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg);">
              <div>
                <strong style="font-size: var(--font-size-sm);">🔊 Volume Effets Sonores</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Ajuster le volume des sons</p>
              </div>
              <input type="range" id="volume-slider" min="0" max="100" value="80"
                     style="width: 120px; accent-color: var(--color-accent-blue);">
            </div>

            <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg);">
              <div>
                <strong style="font-size: var(--font-size-sm);">💾 Exporter la sauvegarde</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Copie tes données dans le presse-papier</p>
              </div>
              <button class="btn btn--ghost" id="btn-export" style="font-size: var(--font-size-xs);">📋 Copier</button>
            </div>

            <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg);">
              <div>
                <strong style="font-size: var(--font-size-sm);">📥 Importer une sauvegarde</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Coller des données exportées</p>
              </div>
              <button class="btn btn--ghost" id="btn-import" style="font-size: var(--font-size-xs);">📥 Importer</button>
            </div>

            <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg);">
              <div>
                <strong style="font-size: var(--font-size-sm); color: var(--color-accent-red);">🗑️ Réinitialiser tout</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Supprime toutes les données</p>
              </div>
              <button class="btn btn--ghost" id="btn-reset" style="font-size: var(--font-size-xs); color: var(--color-accent-red);">⚠️ Reset</button>
            </div>

            <div class="card row row--between" style="padding: var(--spacing-md) var(--spacing-lg); border: 1px dashed var(--color-accent-blue);">
              <div>
                <strong style="font-size: var(--font-size-sm); color: var(--color-accent-blue);">🛡️ Console Manager</strong>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Accès développeur (Mot de passe requis)</p>
              </div>
              <a href="#admin" class="btn btn--outline" style="font-size: var(--font-size-xs);">ACCÉDER</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStatCard(emoji, label, value) {
    return `
      <div class="card" style="text-align: center; min-height: auto; padding: var(--spacing-md);">
        <span style="font-size: 1.4rem;">${emoji}</span>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; display: block;">${label}</span>
        <strong style="font-size: var(--font-size-lg);">${value}</strong>
      </div>
    `;
  }

  afterRender() {
    // Edit name
    document.getElementById('btn-edit-name')?.addEventListener('click', () => {
      const name = prompt('Nouveau pseudo (max 20 caractères) :', this.app.playerManager.username);
      if (name && name.trim()) {
        this.app.playerManager.setUsername(name.trim());
        toast.success('✏️ Pseudo modifié !');
        this.refresh();
      }
    });

    // Edit bio
    document.getElementById('btn-edit-bio')?.addEventListener('click', () => {
      const bio = prompt('Nouvelle bio (max 100 caractères) :', this.app.playerManager.bio);
      if (bio !== null) {
        this.app.playerManager.setBio(bio.trim());
        toast.success('📝 Bio modifiée !');
        this.refresh();
      }
    });

    // Edit avatar emoji
    document.getElementById('btn-edit-emoji')?.addEventListener('click', () => {
      const emojis = ['😎', '🤖', '👾', '🎮', '🚀', '⚡', '🔥', '💀', '👑', '🐉', '🌟', '🎯'];
      const choice = prompt(`Choisis un avatar :\n${emojis.join(' ')}`, this.app.playerManager.avatarEmoji);
      if (choice && choice.trim()) {
        this.app.playerManager.data.avatarEmoji = choice.trim().slice(0, 2);
        this.app.playerManager.persist();
        toast.success('😀 Avatar modifié !');
        this.refresh();
      }
    });
    document.getElementById('btn-edit-avatar')?.addEventListener('click', () => {
      document.getElementById('btn-edit-emoji')?.click();
    });

    // Export
    document.getElementById('btn-export')?.addEventListener('click', () => {
      const data = this.app.saveManager.exportAll();
      navigator.clipboard.writeText(data).then(() => {
        toast.success('📋 Sauvegarde copiée !');
      }).catch(() => {
        toast.error('Erreur de copie');
      });
    });

    // Import
    document.getElementById('btn-import')?.addEventListener('click', () => {
      const data = prompt('Colle tes données de sauvegarde :');
      if (data && data.trim()) {
        try {
          this.app.saveManager.importAll(data.trim());
          toast.success('📥 Sauvegarde importée ! Rechargement...');
          setTimeout(() => window.location.reload(), 1000);
        } catch (e) {
          toast.error('❌ Données invalides');
        }
      }
    });

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (confirm('⚠️ Supprimer TOUTES les données ? Cette action est irréversible.')) {
        this.app.saveManager.reset();
        toast.info('🗑️ Données réinitialisées. Rechargement...');
        setTimeout(() => window.location.reload(), 1000);
      }
    });

    // Volume
    document.getElementById('volume-slider')?.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value) / 100;
      if (this.app.audioManager) {
        this.app.audioManager.setVolume(vol);
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
