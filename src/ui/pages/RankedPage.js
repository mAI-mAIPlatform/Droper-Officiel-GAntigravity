/* ============================
   DROPER — Page Classé & Ligues (v0.2.5)
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

        <div class="grid-3" style="gap: var(--spacing-lg);">
            ${this.renderLeagueCard('Bronze', '🥉', 'Le début du chemin.')}
            ${this.renderLeagueCard('Argent', '🥈', 'Tu commences à comprendre.')}
            ${this.renderLeagueCard('Or', '🥇', 'Un compétiteur sérieux.')}
            ${this.renderLeagueCard('Platine', '💎', 'L\'élite approche.')}
            ${this.renderLeagueCard('Diamant', '✨', 'Maîtrise totale.')}
            ${this.renderLeagueCard('Légende', '👑', 'Le sommet absolu.')}
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
        if (rank.includes('Platine')) return '💎';
        if (rank.includes('Diamant')) return '✨';
        return '👑';
    }

    getNextRank(rank) {
        const ranks = ['Bronze I', 'Bronze II', 'Bronze III', 'Argent I', 'Argent II', 'Argent III', 'Or I', 'Or II', 'Or III', 'Platine I', 'Platine II', 'Platine III', 'Diamant I', 'Diamant II', 'Diamant Suprême', 'Légende'];
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

    afterRender() {
        document.getElementById('btn-play-ranked')?.addEventListener('click', () => {
            if (this.app.audioManager) this.app.audioManager.playClick();
            window.location.hash = '#modes';
        });
    }
}
