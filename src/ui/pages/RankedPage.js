/* ============================
   DROPER — Page Classé & Ligues (v1.0.0)
   ============================ */

export class RankedPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const player = this.app.playerManager.data;
    const rank = player.rank || 'Bronze I';
    const points = player.rankPoints || 0;

    return `
      <div class="page ranked-page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> MODE CLASSÉ
          </h1>
          <p style="color: var(--color-text-muted); margin-top: var(--spacing-xs);">
            Prouve ta valeur et grimpe dans les Ligues Suprêmes.
          </p>
        </div>

        <div class="ranked-hero-card" style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            border: 2px solid var(--color-accent-blue);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
            margin-bottom: var(--spacing-xl);
            position: relative;
            overflow: hidden;
        ">
          <!-- Effets de fond -->
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%); pointer-events: none;"></div>

          <div style="font-size: 5rem; margin-bottom: 20px; filter: drop-shadow(0 0 15px var(--color-accent-blue));">
            ${this.getRankEmoji(rank)}
          </div>
          
          <h2 style="font-size: 2.5rem; font-weight: 900; letter-spacing: 2px; color: #fff; margin-bottom: 10px;">
            ${rank.toUpperCase()}
          </h2>
          
          <div style="font-size: 1.2rem; color: var(--color-accent-blue); font-weight: 700; margin-bottom: 30px;">
            ${points} RP (Rank Points)
          </div>

          <!-- Barre de progression de ligue -->
          <div style="max-width: 400px; margin: 0 auto;">
            <div class="progress-bar" style="height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px;">
              <div class="progress-bar__fill" style="width: ${(points % 100)}%; background: linear-gradient(90deg, var(--color-accent-blue), #60a5fa); box-shadow: 0 0 10px var(--color-accent-blue);"></div>
            </div>
            <div class="row row--between" style="margin-top: 10px; font-size: 0.7rem; color: var(--color-text-muted);">
              <span>${rank}</span>
              <span>Prochaine Ligue : ${this.getNextRank(rank)}</span>
            </div>
          </div>
        </div>

        <!-- Timeline des prochains Rangs -->
        <h3 style="margin-bottom: 10px; font-size: 1rem; color: var(--color-accent-blue);">PROGRESSION LIGUE</h3>
        <div class="ranked-timeline" style="
            display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; margin-bottom: var(--spacing-xl);
            scrollbar-width: thin; scrollbar-color: var(--color-accent-blue) rgba(255,255,255,0.05);
        ">
            ${this.renderUpcomingRanks(points)}
        </div>

        <div class="grid-3" style="gap: var(--spacing-lg);">
            ${this.renderLeagueCard('Bronze', '🥉', 'Le début du chemin.')}
            ${this.renderLeagueCard('Argent', '🥈', 'Tu commences à comprendre.')}
            ${this.renderLeagueCard('Or', '🥇', 'Un compétiteur sérieux.')}
            ${this.renderLeagueCard('Mythique', '🔮', "L'élite approche.")}
            ${this.renderLeagueCard('Légendaire', '👑', 'Maîtrise totale.')}
            ${this.renderLeagueCard('Pro', '🏆', 'Le sommet absolu.')}
        </div>

      <div style="margin-top: var(--spacing-2xl); text-align: center;">
        <button class="btn btn--accent btn--lg" id="btn-play-ranked" style="padding: 15px 50px; font-size: 1.2rem; box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);">
          ⚔️ RECHERCHER UNE PARTIE
        </button>
      </div>
      </div>
      `;
  }

  getRankEmoji(rank) {
    if (rank.includes('Bronze')) return '🥉';
    if (rank.includes('Argent')) return '🥈';
    if (rank.includes('Or')) return '🥇';
    if (rank.includes('Mythique')) return '🔮';
    if (rank.includes('Légendaire')) return '👑';
    return '🏆';
  }

  getNextRank(rank) {
    const ranks = [
      'Bronze I', 'Bronze II', 'Bronze III',
      'Argent I', 'Argent II', 'Argent III',
      'Or I', 'Or II', 'Or III',
      'Mythique I', 'Mythique II', 'Mythique III',
      'Légendaire I', 'Légendaire II', 'Légendaire III',
      'Pro I', 'Pro II', 'Pro III'
    ];
    const idx = ranks.indexOf(rank);
    return idx < ranks.length - 1 ? ranks[idx + 1] : 'MAX';
  }

  renderLeagueCard(name, emoji, desc) {
    return `
      <div class="card" style="text-align: center; background: rgba(255,255,255,0.02);">
            <div style="font-size: 2rem; margin-bottom: 10px;">${emoji}</div>
            <strong style="display: block; font-size: 1.1rem; margin-bottom: 5px;">${name}</strong>
            <p style="font-size: 0.7rem; color: var(--color-text-muted);">${desc}</p>
        </div>
      `;
  }

  renderUpcomingRanks(currentPoints) {
    // import { LEAGUES } from '../../data/leagues.js'; // imported dynamically via system if needed. We'll reconstruct here or fetch.
    // For simplicity UI visually, let's build the array:
    const ranksData = [
      { id: 'b1', name: 'Bronze I', emoji: '🥉', points: 0, color: '#cd7f32' },
      { id: 'b2', name: 'Bronze II', emoji: '🥉', points: 30, color: '#cd7f32' },
      { id: 'b3', name: 'Bronze III', emoji: '🥉', points: 70, color: '#cd7f32' },
      { id: 'a1', name: 'Argent I', emoji: '🥈', points: 120, color: '#c0c0c0' },
      { id: 'a2', name: 'Argent II', emoji: '🥈', points: 180, color: '#c0c0c0' },
      { id: 'a3', name: 'Argent III', emoji: '🥈', points: 260, color: '#c0c0c0' },
      { id: 'o1', name: 'Or I', emoji: '🥇', points: 360, color: '#fbbf24' },
      { id: 'o2', name: 'Or II', emoji: '🥇', points: 480, color: '#fbbf24' },
      { id: 'o3', name: 'Or III', emoji: '🥇', points: 620, color: '#fbbf24' },
      { id: 'm1', name: 'Mythique I', emoji: '🔮', points: 1500, color: '#8b5cf6' },
      { id: 'm2', name: 'Mythique II', emoji: '🔮', points: 1800, color: '#8b5cf6' },
      { id: 'm3', name: 'Mythique III', emoji: '🔮', points: 2200, color: '#8b5cf6' },
      { id: 'l1', name: 'Légendaire I', emoji: '👑', points: 2800, color: '#ef4444' },
      { id: 'l2', name: 'Légendaire II', emoji: '👑', points: 3500, color: '#ef4444' },
      { id: 'l3', name: 'Légendaire III', emoji: '👑', points: 4200, color: '#ef4444' },
      { id: 'p1', name: 'Pro I', emoji: '🏆', points: 5000, color: '#10b981' },
      { id: 'p2', name: 'Pro II', emoji: '🏆', points: 6000, color: '#10b981' },
      { id: 'p3', name: 'Pro III', emoji: '🏆', points: 7500, color: '#10b981' }
    ];

    // Only show upcoming 5 ranks
    const upcoming = ranksData.filter(r => r.points > currentPoints).slice(0, 5);
    if (upcoming.length === 0) return `<div style="color: var(--color-text-muted);">Vous avez atteint le sommet!</div>`;

    return upcoming.map((r, i) => `
    <div style="
      min-width: 120px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid ${r.color}44;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      opacity: ${1 - (i * 0.15)};
      position: relative;
    ">
      <div style="font-size: 1.5rem; margin-bottom: 5px; filter: drop-shadow(0 0 5px ${r.color});">${r.emoji}</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: ${r.color};">${r.name}</div>
                <div style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 5px;">${r.points} RP</div>
            </div>
      `).join('');
  }

  afterRender() {
    document.getElementById('btn-play-ranked')?.addEventListener('click', () => {
      if (this.app.audioManager) this.app.audioManager.playClick();
      window.location.hash = '#modes';
    });
  }
}
