/* ============================
   DROPER — Page Profil (v1.0.0)
   ============================ */

import { toast } from '../components/ToastManager.js';
import { AURAS } from '../../data/auras.js';
import { TRAILS } from '../../data/trails.js';

export class ProfilePage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const player = this.app.playerManager;
    const stats = player.getStats();
    const hero = this.app.heroManager.getFullHero(player.selectedHero);
    const economy = this.app.economyManager;
    const inventory = this.app.inventoryManager; // NEEDED for unlocking cosmetics
    const xpPct = player.xpToNext > 0 ? (player.xp / player.xpToNext * 100) : 0;

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> PROFIL
          </h1>
        </div>

        <!-- Inputs cachés pour l'import d'images -->
        <input type="file" id="input-banner-upload" accept="image/png, image/jpeg" style="display:none">
        <input type="file" id="input-avatar-upload" accept="image/png, image/jpeg" style="display:none">

        <!-- Carte Profil Redesign -->
        <div class="profile-card anim-fade-in-up" style="padding: 0; overflow: hidden;">
          
          <!-- Banner Section -->
          <div class="profile-banner" style="
            height: 120px; 
            background: ${player.customBannerUrl ? `url(${player.customBannerUrl}) center/cover` : 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))'};
            position: relative;
          ">
            <button class="btn btn--sm" id="btn-edit-banner" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2);">
              🖼️ Modifier Bannière
            </button>
          </div>

          <!-- Info Section -->
          <div style="padding: var(--spacing-lg); position: relative; margin-top: -60px;">
            <div class="profile-card__identity" style="align-items: flex-end; margin-bottom: var(--spacing-md);">
              <div class="avatar" style="width: 100px; height: 100px; border: 4px solid var(--color-surface); font-size: 3rem; background: var(--color-bg);">
                ${player.customAvatarUrl
        ? `<img src="${player.customAvatarUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
        : player.avatarEmoji}
                <div class="avatar__edit" id="btn-edit-avatar" title="Modifier l'avatar">✏️</div>
              </div>
              <div class="profile-card__info" style="margin-bottom: 10px;">
                <div class="profile-card__name" style="font-size: var(--font-size-xl);">
                  ${player.username}
                  <span class="player-tag">${player.tag}</span>
                </div>
                <div class="profile-card__bio">
                  ${player.bio || 'Aucune bio définie...'}
                  <span id="btn-edit-bio" style="cursor:pointer; opacity:0.5; margin-left:5px;">✏️</span>
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
            
            <button class="btn btn--outline btn--sm" id="btn-edit-name" style="margin-top: 15px; width: 100%;">
              ✏️ Modifier le pseudo
            </button>
          </div>
        </div>

        <!-- Cosmétiques -->
        <div class="section anim-fade-in-up anim-delay-1" style="margin-top: var(--spacing-xl);">
          <h2 class="section-title" style="margin-bottom: var(--spacing-lg);">✨ COSMÉTIQUES</h2>
          <div class="grid-2">
            <!-- Auras -->
            <div class="card">
              <h3 style="margin-bottom: 10px; font-size: var(--font-size-md);">Auras</h3>
              <div class="row" style="gap: 10px; flex-wrap: wrap;">
                ${AURAS.map(a => {
          const unlocked = a.id === 'none' || (inventory.data.unlockedCosmetics && inventory.data.unlockedCosmetics.includes(a.id));
          return `
                  <div class="cosmetic-btn cosmetic-aura ${player.equippedAura === a.id ? 'active' : ''}" data-id="${a.id}" data-unlocked="${unlocked}" style="text-align: center; cursor: ${unlocked ? 'pointer' : 'not-allowed'}; padding: 10px; background: ${player.equippedAura === a.id ? 'var(--color-bg)' : 'var(--color-surface)'}; border: 1px solid ${player.equippedAura === a.id ? 'var(--color-accent-blue)' : 'var(--color-border)'}; border-radius: 8px; flex: 1; min-width: 60px; opacity: ${unlocked ? 1 : 0.5}; position: relative;">
                    <div style="font-size: 1.5rem; margin-bottom: 5px;">${a.emoji}</div>
                    <div style="font-size: 0.6rem; color: var(--color-text-muted);">${a.name}</div>
                    ${!unlocked ? '<span style="position: absolute; top: -5px; right: -5px; background: var(--color-bg); border-radius: 50%; padding: 2px;">🔒</span>' : ''}
                  </div>
                `}).join('')}
              </div>
            </div>

             <!-- Trails -->
            <div class="card">
              <h3 style="margin-bottom: 10px; font-size: var(--font-size-md);">Traces de pas</h3>
              <div class="row" style="gap: 10px; flex-wrap: wrap;">
                ${TRAILS.map(t => {
            const unlocked = t.id === 'none' || (inventory.data.unlockedCosmetics && inventory.data.unlockedCosmetics.includes(t.id));
            return `
                  <div class="cosmetic-btn cosmetic-trail ${player.equippedTrail === t.id ? 'active' : ''}" data-id="${t.id}" data-unlocked="${unlocked}" style="text-align: center; cursor: ${unlocked ? 'pointer' : 'not-allowed'}; padding: 10px; background: ${player.equippedTrail === t.id ? 'var(--color-bg)' : 'var(--color-surface)'}; border: 1px solid ${player.equippedTrail === t.id ? 'var(--color-accent-blue)' : 'var(--color-border)'}; border-radius: 8px; flex: 1; min-width: 60px; opacity: ${unlocked ? 1 : 0.5}; position: relative;">
                    <div style="font-size: 1.5rem; margin-bottom: 5px;">${t.emoji}</div>
                    <div style="font-size: 0.6rem; color: var(--color-text-muted);">${t.name}</div>
                    ${!unlocked ? '<span style="position: absolute; top: -5px; right: -5px; background: var(--color-bg); border-radius: 50%; padding: 2px;">🔒</span>' : ''}
                  </div>
                `}).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques détaillées -->
        <div class="section anim-fade-in-up anim-delay-1" style="margin-top: var(--spacing-xl);">
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

    // Edit avatar
    document.getElementById('btn-edit-avatar')?.addEventListener('click', () => {
      document.getElementById('input-avatar-upload')?.click();
    });

    document.getElementById('input-avatar-upload')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) { // 1 MB limit
          toast.error("L'image est trop grande (Max 1 Mo).");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.app.playerManager.setAvatarUrl(event.target.result);
          toast.success('😀 Avatar modifié !');
          this.refresh();
        };
        reader.readAsDataURL(file);
      }
    });

    // Edit Banner
    document.getElementById('btn-edit-banner')?.addEventListener('click', () => {
      document.getElementById('input-banner-upload')?.click();
    });

    document.getElementById('input-banner-upload')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) { // 1 MB limit
          toast.error("L'image est trop grande (Max 1 Mo).");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.app.playerManager.setBannerUrl(event.target.result);
          toast.success('🖼️ Bannière modifiée !');
          this.refresh();
        };
        reader.readAsDataURL(file);
      }
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

    document.getElementById('volume-slider')?.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value) / 100;
      if (this.app.audioManager) {
        this.app.audioManager.setVolume(vol);
      }
    });

    // Cosmétiques
    document.querySelectorAll('.cosmetic-aura').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.app.playerManager.equipAura(id);
        toast.success('✨ Aura équipée');
        this.refresh();
      });
    });

    document.querySelectorAll('.cosmetic-trail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.app.playerManager.equipTrail(id);
        toast.success('👣 Trace équipée');
        this.refresh();
      });
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
