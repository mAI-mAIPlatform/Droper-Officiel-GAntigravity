/* ============================
   DROPER — Page Armurerie (v0.0.4)
   ============================ */

import { toast } from '../components/ToastManager.js';
import { ARCHETYPES } from '../../data/heroes.js';

export class ArmoryPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const heroes = this.app.heroManager.getAllHeroesWithState();
    const selected = this.app.playerManager.selectedHero;

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> ARMURERIE
          </h1>
        </div>

        <!-- Filtres par Archétype -->
        <div class="armory-filters" style="display: flex; gap: 10px; justify-content: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap;">
          <button class="btn btn--sm btn--outline filter-btn active" data-filter="all">Tous</button>
          ${Object.values(ARCHETYPES).map(arch => `
            <button class="btn btn--sm btn--outline filter-btn" data-filter="${arch.id}">${arch.icon} ${arch.label}</button>
          `).join('')}
        </div>

        <div class="grid-3" id="heroes-grid">
          ${heroes.map((hero, i) => {
      const unlocked = hero.state.unlocked;
      const isSelected = hero.id === selected;
      return `
              <div class="card hero-card anim-fade-in-up anim-delay-${Math.min(i + 1, 6)}"
                   data-hero-id="${hero.id}"
                   data-archetype="${hero.archetype.id}"
                   style="cursor: pointer; text-align: center; position: relative;
                          border-color: ${isSelected ? 'var(--color-accent-blue)' : unlocked ? hero.rarity.color : 'var(--color-border-card)'};
                          ${!unlocked ? 'opacity: 0.6;' : ''}">
                ${!unlocked ? '<div class="hero-card__lock">🔒</div>' : ''}
                ${isSelected ? '<div class="hero-card__selected">✅ ACTIF</div>' : ''}
                
                <div style="position: absolute; top: 10px; left: 10px; font-size: 1.5rem;" title="Archétype: ${hero.archetype.label}">
                  ${hero.archetype.icon}
                </div>

                <span style="font-size: 2.5rem;">${hero.emoji}</span>
                <strong style="font-size: var(--font-size-md); display: block; margin-top: var(--spacing-sm);">
                  ${hero.name}
                </strong>
                <span class="badge ${hero.rarity.cssClass}" style="margin-top: var(--spacing-xs);">
                  ${hero.rarity.label}
                </span>
                <div style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent-blue); margin-top: 5px;">
                  NIVEAU ${hero.state.level}
                </div>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs);">
                  ${hero.description}
                </p>
              </div>
            `;
    }).join('')}
        </div>

        <!-- Modal Héros -->
        <div class="modal-overlay" id="hero-modal" style="display: none;">
          <div class="modal" id="hero-modal-content"></div>
        </div>
      </div>
    `;
  }

  afterRender() {
    document.querySelectorAll('[data-hero-id]').forEach(card => {
      card.addEventListener('click', () => {
        this.showHeroModal(card.dataset.heroId);
      });
    });

    document.getElementById('hero-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'hero-modal') this.closeModal();
    });

    // Filtres d'Archétype
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Retirer la classe active
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Filtrer
        const filter = e.target.dataset.filter;
        document.querySelectorAll('.hero-card').forEach(card => {
          if (filter === 'all' || card.dataset.archetype === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  showHeroModal(heroId) {
    const hero = this.app.heroManager.getFullHero(heroId);
    if (!hero) return;

    const unlocked = hero.state.unlocked;
    const isSelected = this.app.playerManager.selectedHero === heroId;

    const modal = document.getElementById('hero-modal-content');
    if (!modal) return;

    modal.innerHTML = `
      <button class="modal__close" id="btn-close-modal" style="z-index: 10;">✕</button>
      
      <!-- En-tête avec Image HD -->
      <div style="
        position: relative; 
        margin: -var(--spacing-lg) -var(--spacing-lg) var(--spacing-xl) -var(--spacing-lg);
        height: 250px;
        background: radial-gradient(circle at center, ${hero.bodyColor}33 0%, transparent 70%);
        border-bottom: 2px solid ${hero.bodyColor};
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        ${hero.coverImage
        ? `<img src="${hero.coverImage}" style="height: 120%; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); transform: scale(1.1);">`
        : `<span style="font-size: 6rem; filter: drop-shadow(0 5px 15px ${hero.glowColor});">${hero.emoji}</span>`
      }
        <!-- Overlay dégradé pour le texte -->
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 100px; background: linear-gradient(to top, var(--color-bg), transparent);"></div>
        
        <div style="position: absolute; bottom: 15px; left: 20px;">
          <h2 style="font-size: var(--font-size-3xl); font-weight: 900; margin: 0; text-transform: uppercase; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">
            ${hero.name}
          </h2>
          <span class="badge ${hero.rarity.cssClass}" style="box-shadow: 0 2px 10px rgba(0,0,0,0.5);">${hero.rarity.label}</span>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: var(--spacing-md); justify-content: center;">
        ${!unlocked ? '<div style="color: var(--color-accent-red); font-weight: 700;">🔒 Verrouillé</div>' : ''}
        ${isSelected ? '<div style="color: var(--color-accent-green); font-weight: 700;">✅ Héros actif</div>' : ''}
      </div>

      <p style="color: var(--color-text-secondary); text-align: center; margin-bottom: var(--spacing-xl);">
        ${hero.description}
      </p>

      <!-- Stats -->
      <div class="grid-2" style="gap: var(--spacing-md); margin-bottom: var(--spacing-xl);">
        ${this.renderStat('❤️ PV', hero.stats.hp, 250, 'var(--color-accent-red)')}
        ${this.renderStat('⚔️ ATK', hero.stats.attack, 35, 'var(--color-accent-gold)')}
        ${this.renderStat('🛡️ DEF', hero.stats.defense, 25, 'var(--color-accent-blue)')}
        ${this.renderStat('💨 VIT', hero.stats.speed, 10, 'var(--color-accent-green)')}
      </div>

      <!-- SYSTÈMES V0.2.4 — POUVOIRS ET PUCES -->
      ${unlocked ? `
        <div class="stack" style="gap: 15px; margin-bottom: var(--spacing-xl);">
          
          <!-- POUVOIR (NIV 5) -->
          <div class="card" style="padding: 10px; border: 1px dashed ${hero.state.level >= 5 ? 'var(--color-accent-gold)' : 'var(--color-border)'};">
            <div class="row row--between">
              <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent-gold);">🔥 POUVOIR [G]</span>
              ${hero.state.level < 5 ? '<span style="font-size: 0.6rem; opacity: 0.6;">NIVEAU 5 REQUIS</span>' : ''}
            </div>
            ${hero.state.level >= 5 ? `
              <div class="row" style="gap: 8px; margin-top: 8px;">
                ${this.renderAbilityItem('damage_boost', 'Force Alpha', '🔥', hero.state.powers.includes('damage_boost'), hero.state.equippedPower === 'damage_boost', 600)}
                ${this.renderAbilityItem('shield_boost', 'Bouclier Alpha', '🛡️', hero.state.powers.includes('shield_boost'), hero.state.equippedPower === 'shield_boost', 600)}
              </div>
            ` : ''}
          </div>

          <!-- PUCES (NIV 9) -->
          <div class="card" style="padding: 10px; border: 1px dashed ${hero.state.level >= 9 ? 'var(--color-accent-cyan)' : 'var(--color-border)'};">
            <div class="row row--between">
              <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent-cyan);">💎 PUCES [P] (${hero.state.equippedChips.length}/2)</span>
              ${hero.state.level < 9 ? '<span style="font-size: 0.6rem; opacity: 0.6;">NIVEAU 9 REQUIS</span>' : ''}
            </div>
            ${hero.state.level >= 9 ? `
              <div class="row" style="gap: 8px; margin-top: 8px; overflow-x: auto; padding-bottom: 5px;">
                ${this.renderChipItem('speed', 'Vitesse', '💨', hero.state.chips.includes('speed'), hero.state.equippedChips.includes('speed'))}
                ${this.renderChipItem('tir', 'Cadence', '🔥', hero.state.chips.includes('tir'), hero.state.equippedChips.includes('tir'))}
                ${this.renderChipItem('reload', 'Recharge', '⚡', hero.state.chips.includes('reload'), hero.state.equippedChips.includes('reload'))}
                ${this.renderChipItem('health_regen', 'Régén', '❤️', hero.state.chips.includes('health_regen'), hero.state.equippedChips.includes('health_regen'))}
              </div>
            ` : ''}
          </div>

          <!-- SUPERCHARGE (NIV 10) -->
          <div class="card" style="padding: 10px; border: 1px solid ${hero.state.level >= 10 ? 'var(--color-accent-purple)' : 'var(--color-border)'}; background: ${hero.state.superchargeUnlocked ? 'rgba(168,85,247,0.1)' : 'transparent'};">
            <div class="row row--between">
              <span style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent-purple);">⚡ SUPERCHARGE [C]</span>
              ${hero.state.level < 10 ? '<span style="font-size: 0.6rem; opacity: 0.6;">NIVEAU 10 REQUIS</span>' : ''}
            </div>
            ${hero.state.level >= 10 ? `
              <div style="margin-top: 8px;">
                ${hero.state.superchargeUnlocked ? `
                  <div style="font-size: 0.8rem; color: var(--color-accent-purple); font-weight: 700; text-align: center; padding: 5px;">
                    ✅ Supercharge Débloquée
                  </div>
                ` : `
                  <button class="btn btn--accent btn--sm" id="btn-buy-supercharge" style="width: 100%; display: flex; justify-content: space-between;">
                    <span>Débloquer</span>
                    <span>🪙 1500 &nbsp; 💎 20</span>
                  </button>
                `}
              </div>
            ` : ''}
          </div>

        </div>
      ` : ''}

      <!-- Niveau héros & Amélioration -->
      ${unlocked ? `
        <div style="margin-bottom: var(--spacing-xl); background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid var(--color-border);">
          <div class="row row--between" style="margin-bottom: 8px;">
            <div class="stack">
                <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-accent-blue);">NIVEAU ${hero.state.level}</span>
                <span style="font-size: 0.6rem; color: var(--color-text-muted);">${hero.state.xp} / ${this.app.heroManager.calculateXpToNext(hero.state.level)} XP</span>
            </div>
            ${hero.state.level < 10 ? `
                <button class="btn btn--accent btn--sm" id="btn-upgrade-hero">
                    🔼 AMÉLIORER (🪙 ${this.app.heroManager.getUpgradePrice(hero.state.level)})
                </button>
            ` : `<span style="font-size: 0.7rem; font-weight: 800; color: var(--color-accent-gold);">⭐ NIVEAU MAX</span>`}
          </div>
          <div class="progress-bar" style="height: 6px; background: rgba(0,0,0,0.3);">
            <div class="progress-bar__fill" style="width: ${(hero.state.xp / this.app.heroManager.calculateXpToNext(hero.state.level)) * 100}%; background: var(--color-accent-blue);"></div>
          </div>
        </div>
      ` : ''}

      <!-- Actions -->
      ${unlocked && !isSelected ? `
        <button class="btn btn--accent" id="btn-select-hero" style="width: 100%;">
          ▶ Jouer avec ${hero.name}
        </button>
      ` : ''}
      ${!unlocked ? `
        <button class="btn btn--ghost" style="width: 100%; opacity: 0.6; cursor: not-allowed;" disabled>
          🔒 Débloque-le via le Pass ou la Boutique
        </button>
      ` : ''}
      ${isSelected ? `
        <button class="btn btn--ghost" style="width: 100%; cursor: default;" disabled>
          ✅ Déjà sélectionné
        </button>
      ` : ''}
    `;

    document.getElementById('hero-modal').style.display = 'flex';

    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());

    document.getElementById('btn-select-hero')?.addEventListener('click', () => {
      this.app.playerManager.selectHero(heroId);
      if (this.app.audioManager) this.app.audioManager.playClick();
      toast.success(`▶ ${hero.name} sélectionné !`);
      this.closeModal();
      this.refresh(); // Refresh ArmoryPage grid
      if (this.app.uiManager) this.app.uiManager.refresh(); // Global refresh if possible
    });

    document.getElementById('btn-upgrade-hero')?.addEventListener('click', () => {
      const result = this.app.heroManager.upgradeHero(heroId, this.app.economyManager);
      if (result.success) {
        if (this.app.audioManager) this.app.audioManager.playReward();
        toast.reward(`✨ ${hero.name} est passé au niveau ${result.newLevel} !`);
        // On rafraîchit la modale et la page
        this.showHeroModal(heroId);
        this.refresh();
      } else {
        if (this.app.audioManager) this.app.audioManager.closeModal(); // Ou un son d'erreur
        toast.error(result.reason === 'Pas assez de pièces' ? `❌ Il te faut 🪙 ${result.price} pour améliorer ce héros.` : result.reason);
      }
    });

    // Écouteurs Pouvoirs
    document.querySelectorAll('[data-buy-power]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.buyPower;
        const res = this.app.heroManager.buyPower(heroId, id, this.app.economyManager);
        if (res.success) {
          toast.reward(`🔥 Pouvoir débloqué !`);
          this.showHeroModal(heroId);
        } else toast.error(res.reason);
      };
    });
    document.querySelectorAll('[data-equip-power]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.equipPower;
        this.app.heroManager.equipPower(heroId, id);
        this.showHeroModal(heroId);
      };
    });

    // Écouteurs Puces
    document.querySelectorAll('[data-buy-chip]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.buyChip;
        const res = this.app.heroManager.buyChip(heroId, id, this.app.economyManager);
        if (res.success) {
          toast.reward(`💎 Puce achetée !`);
          this.showHeroModal(heroId);
        } else toast.error(res.reason);
      };
    });
    document.querySelectorAll('[data-equip-chip]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.equipChip;
        const res = this.app.heroManager.equipChip(heroId, id);
        if (!res && !this.app.heroManager.getHeroState(heroId).equippedChips.includes(id)) {
          toast.error("Maximum 2 puces !");
        } else {
          this.showHeroModal(heroId);
        }
      };
    });

    // Écouteur Supercharge
    document.getElementById('btn-buy-supercharge')?.addEventListener('click', () => {
      if (confirm('Débloquer la Supercharge pour 1500 Pièces et 20 Gemmes ?')) {
        const res = this.app.heroManager.buySupercharge(heroId, this.app.economyManager);
        if (res.success) {
          if (this.app.audioManager) this.app.audioManager.playReward();
          toast.reward(`⚡ Supercharge débloquée pour ${hero.name} !`);
          this.showHeroModal(heroId);
        } else {
          toast.error(res.reason);
        }
      }
    });
  }

  renderAbilityItem(id, name, emoji, owned, equipped, price) {
    return `
      <div class="stack" style="flex:1; gap: 4px; align-items: center; border: 1px solid ${equipped ? 'var(--color-accent-gold)' : 'var(--color-border)'}; padding: 6px; border-radius: 8px;">
        <span style="font-size: 1.2rem;">${emoji}</span>
        <span style="font-size: 0.5rem; text-align: center;">${name}</span>
        ${owned ? `
          <button class="btn btn--sm ${equipped ? 'btn--gold' : 'btn--ghost'}" data-equip-power="${id}" style="font-size: 0.5rem; padding: 2px 5px;">
            ${equipped ? 'ÉQUIPÉ' : 'ÉQUIPER'}
          </button>
        ` : `
          <button class="btn btn--gold btn--sm" data-buy-power="${id}" style="font-size: 0.5rem; padding: 2px 5px;">
            🪙 ${price}
          </button>
        `}
      </div>
    `;
  }

  renderChipItem(id, name, emoji, owned, equipped) {
    return `
      <div class="stack" style="min-width: 60px; gap: 4px; align-items: center; border: 1px solid ${equipped ? 'var(--color-accent-cyan)' : 'var(--color-border)'}; padding: 6px; border-radius: 8px;">
        <span style="font-size: 1.2rem;">${emoji}</span>
        <span style="font-size: 0.5rem; text-align: center;">${name}</span>
        ${owned ? `
          <button class="btn btn--sm ${equipped ? 'btn--purple' : 'btn--ghost'}" data-equip-chip="${id}" style="font-size: 0.5rem; padding: 2px 5px;">
            ${equipped ? 'DÉSÉQUIPER' : 'ÉQUIPER'}
          </button>
        ` : `
          <button class="btn btn--purple btn--sm" data-buy-chip="${id}" style="font-size: 0.5rem; padding: 2px 5px;">
            🪙 150
          </button>
        `}
      </div>
    `;
  }

  renderStat(label, value, max, color) {
    const pct = Math.min(100, (value / max) * 100);
    return `
      <div>
        <div class="row row--between" style="margin-bottom: 4px;">
          <span style="font-size: var(--font-size-xs); font-weight: 600;">${label}</span>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${value}</span>
        </div>
        <div class="progress-bar" style="height: 5px;">
          <div class="progress-bar__fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
      </div>
    `;
  }

  closeModal() {
    document.getElementById('hero-modal').style.display = 'none';
  }

  refresh() {
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = this.render();
      this.afterRender();
    }
  }
}
