/* ============================
   DROPER — Page de Jeu (Fullscreen Canvas)
   ============================ */

import { GameEngine } from '../../game/GameEngine.js';

export class GamePage {
  constructor(app) {
    this.app = app;
    this.engine = null;
  }

  render() {
    return `
      <div id="game-wrapper" style="width: 100%; height: 100vh; position: relative; background: #080c16;">
        <div id="game-container" style="width: 100%; height: 100%;"></div>

        <!-- HUD Overlay -->
        <div class="game-hud" id="game-hud">
          <div class="game-hud__left">
            <div class="game-hud__stat" id="hud-wave">🌊 Vague : 0</div>
            <div class="game-hud__stat" id="hud-kills">☠️ Kills : 0</div>
            <div class="game-hud__stat" id="hud-score">⭐ Score : 0</div>
            
            <div class="game-hud__abilities" style="display: flex; gap: 10px; margin-top: 10px;">
              <div class="game-hud__ability" id="hud-power" style="opacity: 0.5;">
                <span style="font-size: 1.2rem;">🔥</span> <span style="font-weight: bold;">[G]</span>
                <div id="hud-power-charges" style="display: flex; gap: 2px; margin-top: 2px;">
                  <span style="width: 5px; height: 5px; border-radius: 50%; background: #fff;"></span>
                  <span style="width: 5px; height: 5px; border-radius: 50%; background: #fff;"></span>
                  <span style="width: 5px; height: 5px; border-radius: 50%; background: #fff;"></span>
                </div>
              </div>
              <div class="game-hud__ability" id="hud-chips" style="opacity: 0.5;">
                <span style="font-size: 1.2rem;">💎</span> <span style="font-weight: bold;">[P]</span>
              </div>
            </div>
          </div>
          <div class="game-hud__right">
            <div class="game-hud__stat" id="hud-hp">❤️ HP : 100</div>
            <div class="game-hud__stat" id="hud-fps">FPS : 0</div>
            <button class="game-hud__btn" id="btn-quit-game">✕ Quitter</button>
          </div>
        </div>

        <!-- Game Over Overlay (caché) -->
        <div class="game-over" id="game-over-overlay" style="display: none;">
          <div class="game-over__content">
            <h1 class="game-over__title">💀 GAME OVER</h1>
            <div class="game-over__stats" id="game-over-stats"></div>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn--accent" id="btn-restart" style="flex: 1;">🔄 Rejouer</button>
              <button class="btn btn--purple" id="btn-back-menu" style="flex: 1;">🏠 Menu</button>
            </div>
          </div>
        </div>

        <!-- Combat Announcements Overlay -->
        <div id="combat-announcements" style="
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            z-index: 100;
        "></div>
      </div>
    `;
  }

  afterRender() {
    // Initialiser le moteur de jeu
    this.engine = new GameEngine(this.app);
    this.engine.init('game-container');

    // Callback game over
    this.engine.onGameOverCallback = (stats) => this.showGameOver(stats);

    // Démarrer la partie
    this.engine.startGame();

    // HUD update loop
    this.hudInterval = setInterval(() => this.updateHUD(), 100);

    // Bouton quitter
    document.getElementById('btn-quit-game')?.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment quitter ? Ta réputation baissera.')) {
        if (this.app.playerManager) {
          this.app.playerManager.data.reputation = Math.max(0, (this.app.playerManager.data.reputation || 100) - 5);
          this.app.playerManager.persist();
        }
        this.destroy();
        window.location.hash = '#accueil';
      }
    });

    // Bouton restart
    document.getElementById('btn-restart')?.addEventListener('click', () => {
      document.getElementById('game-over-overlay').style.display = 'none';
      this.engine.startGame();
    });

    // Bouton retour menu
    document.getElementById('btn-back-menu')?.addEventListener('click', () => {
      this.destroy();
      window.location.hash = '#accueil';
    });
  }

  updateHUD() {
    if (!this.engine) return;

    const wave = document.getElementById('hud-wave');
    const kills = document.getElementById('hud-kills');
    const score = document.getElementById('hud-score');
    const hp = document.getElementById('hud-hp');
    const fps = document.getElementById('hud-fps');

    if (wave) wave.textContent = `🌊 Vague : ${this.engine.wave}`;
    if (kills) kills.textContent = `☠️ Kills : ${this.engine.kills}`;
    if (score) score.textContent = `⭐ Score : ${this.engine.score}`;
    if (hp && this.engine.player) {
      hp.textContent = `❤️ HP : ${Math.ceil(this.engine.player.hp)}`;
    }
    if (fps) fps.textContent = `FPS : ${this.engine.fps}`;

    // Update Announcements
    this.updateAnnouncements();

    // Update Abilities
    const p = this.engine.player;
    if (p) {
      const gEl = document.getElementById('hud-power');
      const gCharges = document.getElementById('hud-power-charges');
      const pEl = document.getElementById('hud-chips');

      if (gEl) {
        const hasPower = p.hero && p.hero.state && p.hero.state.equippedPower;
        const levelOk = p.hero && p.hero.state && p.hero.state.level >= 5;
        gEl.style.opacity = (hasPower && levelOk) ? (p.powerActive ? '1' : '0.8') : '0.3';
        if (p.powerActive) gEl.style.color = '#ff914d';
        else gEl.style.color = '#fff';
      }

      if (gCharges) {
        gCharges.innerHTML = '';
        const charges = (p.powerCharges !== undefined) ? p.powerCharges : 0;
        for (let i = 0; i < 3; i++) {
          const color = i < charges ? '#ff914d' : '#444';
          gCharges.innerHTML += `<span style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></span>`;
        }
      }

      if (pEl) {
        const equippedChips = (p.hero && p.hero.state && Array.isArray(p.hero.state.equippedChips))
          ? p.hero.state.equippedChips
          : [];
        const hasChips = equippedChips.length > 0;
        const level9Ok = p.hero && p.hero.state && p.hero.state.level >= 9;
        pEl.style.opacity = (hasChips && level9Ok) ? (p.chipsActive ? '1' : '0.8') : '0.3';
        if (p.chipsActive) pEl.style.color = '#00f7ff';
        else pEl.style.color = '#fff';

        let pCharges = document.getElementById('hud-chips-charges');
        if (!pCharges) {
          pCharges = document.createElement('div');
          pCharges.id = 'hud-chips-charges';
          pCharges.style.display = 'flex';
          pCharges.style.gap = '2px';
          pCharges.style.marginTop = '2px';
          pEl.parentElement.appendChild(pCharges);
        }
        pCharges.innerHTML = '';
        const cCharges = (p.chipsCharges !== undefined) ? p.chipsCharges : 0;
        for (let i = 0; i < 2; i++) {
          const color = i < cCharges ? '#00f7ff' : '#444';
          pCharges.innerHTML += `<span style="width: 6px; height: 6px; border-radius: 50%; background: ${color};"></span>`;
        }
      }
    }
  }

  showGameOver(stats) {
    const overlay = document.getElementById('game-over-overlay');
    const statsEl = document.getElementById('game-over-stats');
    if (!overlay || !statsEl) return;

    // Sécurité contre undefined/NaN
    const safeStats = {
      score: stats?.score || 0,
      kills: stats?.kills || 0,
      wave: stats?.wave || 0,
      time: stats?.time || 0
    };

    const minutes = Math.floor(safeStats.time / 60) || 0;
    const seconds = Math.floor(safeStats.time % 60) || 0;

    statsEl.innerHTML = `
      <div class="game-over__stat">
        <div class="game-over__stat-label">SCORE</div>
        <div class="game-over__stat-value" style="color: var(--color-accent-gold);">⭐ ${safeStats.score}</div>
      </div>
      <div class="game-over__stat">
        <div class="game-over__stat-label">KILLS</div>
        <div class="game-over__stat-value" style="color: var(--color-accent-red);">☠️ ${safeStats.kills}</div>
      </div>
      <div class="game-over__stat">
        <div class="game-over__stat-label">VAGUE MAX</div>
        <div class="game-over__stat-value" style="color: var(--color-accent-blue);">🌊 ${safeStats.wave}</div>
      </div>
      <div class="game-over__stat">
        <div class="game-over__stat-label">TEMPS</div>
        <div class="game-over__stat-value" style="color: var(--color-accent-cyan);">⏱ ${minutes}m ${String(seconds).padStart(2, '0')}s</div>
      </div>
    `;

    overlay.style.display = 'flex';

    // Récompense de Réputation & Rank Points (v0.2.5)
    if (this.app.playerManager) {
      this.app.playerManager.data.reputation = Math.min(100, (this.app.playerManager.data.reputation || 100) + 1);

      // Points de rang basés sur le score
      const rpGain = Math.floor(safeStats.score / 100);
      this.app.playerManager.data.rankPoints = (this.app.playerManager.data.rankPoints || 0) + rpGain;
      this.app.playerManager.persist();

      if (rpGain > 0) toast.info(`📈 +${rpGain} RP débloqués !`);
    }
  }

  updateAnnouncements() {
    const container = document.getElementById('combat-announcements');
    if (!container || !this.engine) return;

    container.innerHTML = '';
    this.engine.combatFeed.forEach(announce => {
      const div = document.createElement('div');
      div.style.cssText = `
            font-size: 2rem;
            font-weight: 900;
            color: #fff;
            text-shadow: 0 0 10px var(--color-accent-blue), 0 0 20px rgba(0,0,0,0.8);
            animation: announceFadeIn 0.3s ease-out forwards;
            letter-spacing: 2px;
            white-space: nowrap;
        `;
      div.textContent = announce.text;
      container.appendChild(div);
    });
  }

  destroy() {
    if (this.hudInterval) {
      clearInterval(this.hudInterval);
      this.hudInterval = null;
    }
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
  }
}
