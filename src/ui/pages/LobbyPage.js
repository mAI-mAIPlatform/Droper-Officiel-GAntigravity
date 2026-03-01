/* ============================
   DROPER — Page Lobby (matchmaking)
   ============================ */

import { GAME_MODES } from '../../data/gamemodes.js';
import { toast } from '../components/ToastManager.js';

export class LobbyPage {
  constructor(app) {
    this.app = app;
    this.searchTimer = null;
    this.searchTime = 0;
  }

  render() {
    const selectedMode = this.app.selectedMode || 'nanopuces';
    const mode = GAME_MODES.find(m => m.id === selectedMode) || GAME_MODES[0];
    const league = this.app.leagueManager.getCurrentDivision();

    return `
      <div class="page" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh;">
        <div class="card anim-fade-in-up" style="text-align: center; max-width: 420px; width: 100%;">
          <span style="font-size: 3rem;">${mode.emoji}</span>
          <h2 style="font-size: var(--font-size-xl); font-weight: 900; margin-top: var(--spacing-sm);">
            ${mode.name}
          </h2>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--spacing-xs);">
            ${mode.type === 'solo' ? 'Solo' : `${mode.teamSize}v${mode.teamSize}`} — ⏱ ${Math.floor(mode.duration / 60)}:${(mode.duration % 60).toString().padStart(2, '0')}
          </p>

          <!-- League badge -->
          <div style="margin-top: var(--spacing-md);">
            <span class="badge" style="background: ${league.color}; color: white;">
              ${league.emoji} ${league.label} — ×${league.botMult.toFixed(1)}
            </span>
          </div>

          <!-- Buttons -->
          <div class="stack" style="margin-top: var(--spacing-xl); gap: var(--spacing-md);">
            <button class="btn btn--accent" id="btn-play-bots" style="width: 100%; font-size: var(--font-size-md);">
              🤖 Jouer contre Bots
            </button>
            <button class="btn btn--purple" id="btn-play-online" style="width: 100%;">
              🌐 Chercher un Match en Ligne
            </button>
          </div>

          <!-- Search status -->
          <div id="search-status" style="display: none; margin-top: var(--spacing-xl);">
            <div class="loader" style="margin: 0 auto;"></div>
            <p id="search-text" style="color: var(--color-text-muted); margin-top: var(--spacing-sm); font-size: var(--font-size-sm);">
              Recherche en cours...
            </p>
            <button class="btn btn--ghost" id="btn-cancel-search" style="margin-top: var(--spacing-md);">
              ✕ Annuler
            </button>
          </div>
        </div>
        
        <!-- VOTE UI CONTAINER -->
        <div id="map-vote-container">
            ${this.app.mapVoteManager ? this.app.mapVoteManager.renderVoteUI() : ''}
        </div>
      </div>
    `;
  }

  afterRender() {
    const startVoteSequence = (isOnline) => {
      this.app.matchOnline = isOnline;

      // Cacher les boutons
      document.querySelectorAll('.btn').forEach(b => b.style.display = 'none');

      if (this.app.mapVoteManager) {
        this.app.mapVoteManager.startVote(this.app.selectedMode);
        this.refreshVoteUI();
      } else {
        window.location.hash = '#game';
      }
    };

    // Play vs bots
    document.getElementById('btn-play-bots')?.addEventListener('click', () => {
      startVoteSequence(false);
    });

    // Play online
    document.getElementById('btn-play-online')?.addEventListener('click', async () => {
      const btns = document.querySelectorAll('.btn');
      btns.forEach(b => b.style.display = 'none');
      document.getElementById('search-status').style.display = 'block';

      this.searchTime = 0;
      this.searchTimer = setInterval(() => {
        this.searchTime++;
        const text = document.getElementById('search-text');
        if (text) text.textContent = `🔍 Recherche... ${this.searchTime}s`;
      }, 1000);

      const result = await this.app.multiplayerManager.searchMatch(this.app.selectedMode);

      clearInterval(this.searchTimer);
      document.getElementById('search-status').style.display = 'none';

      if (result.online) {
        startVoteSequence(true);
      } else {
        startVoteSequence(false);
      }
    });

    // Cancel search
    document.getElementById('btn-cancel-search')?.addEventListener('click', () => {
      clearInterval(this.searchTimer);
      this.app.multiplayerManager.cancelSearch();
      document.getElementById('search-status').style.display = 'none';
      document.querySelectorAll('.btn').forEach(b => b.style.display = '');
    });

    // Event listeners pour les cartes de vote (délégués)
    const voteContainer = document.getElementById('map-vote-container');
    if (voteContainer) {
      voteContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.map-vote-card');
        if (card && this.app.mapVoteManager && this.app.mapVoteManager.isVoting) {
          const mapId = card.dataset.voteMap;
          this.app.mapVoteManager.playerVoteFor(mapId);
          // On fait un re-render manuel léger partiel de l'UI
          voteContainer.innerHTML = this.app.mapVoteManager.renderVoteUI();
        }
      });
    }
  }

  refreshVoteUI() {
    const container = document.getElementById('map-vote-container');
    if (!container || !this.app.mapVoteManager || !this.app.mapVoteManager.isVoting) return;

    // Force update de l'horloge
    this.app.mapVoteManager.update(1);
    container.innerHTML = this.app.mapVoteManager.renderVoteUI();

    if (this.app.mapVoteManager.isVoting) {
      this.voteInterval = setTimeout(() => this.refreshVoteUI(), 1000);
    } else {
      // Fin du vote
      clearTimeout(this.voteInterval);
      this.app.selectedMap = this.app.mapVoteManager.getSelectedMap();
      window.location.hash = '#game';
    }
  }

  destroy() {
    if (this.searchTimer) clearInterval(this.searchTimer);
  }
}
