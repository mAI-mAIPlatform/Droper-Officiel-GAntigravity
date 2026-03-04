/* ============================
   DROPER — Composant Sidebar (v1.0.0)
   ============================ */

const NAV_ITEMS = [
  { id: 'accueil', label: 'Accueil', icon: '🏠' },
  { id: 'modes', label: 'Modes', icon: '🎮' },
  { id: 'armurerie', label: 'Armurerie', icon: '⚔️' },
  { id: 'boutique', label: 'Boutique', icon: '🛒' },
  { id: 'collection', label: 'Collection', icon: '🎒' },
  { id: 'quetes', label: 'Quêtes', icon: '📜' },
  { id: 'pass-saison', label: 'Pass Saison', icon: '⭐' },
  { id: 'stats', label: 'Statistiques', icon: '📊' },
  { id: 'amis', label: 'Social', icon: '👥' },
  { id: 'actualites', label: 'Actualités', icon: '📰' },
  { id: 'classe', label: 'Classé', icon: '🏆' },
  { id: 'saison-1', label: 'Saison 1', icon: '🌅' },
  { id: 'profil', label: 'Profil', icon: '👤' },
];

export class Navbar {
  constructor(activeRoute, app) {
    this.activeRoute = activeRoute;
    this.app = app;
  }

  render() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    const coins = this.app ? this.app.economyManager.coins : 0;
    const gems = this.app ? this.app.economyManager.gems : 0;
    const records = this.app && this.app.recordManager ? this.app.recordManager.total : 0;
    const version = this.app ? this.app.version : '1.0.0';

    sidebar.innerHTML = `
      <div class="sidebar__logo">
        <div class="sidebar__logo-title">DROPER</div>
        <div class="sidebar__logo-version">v${version}</div>
      </div>

      <nav class="sidebar__nav">
        ${NAV_ITEMS.map(item => `
          <a href="#${item.id}" 
             class="sidebar__item ${this.activeRoute === item.id ? 'sidebar__item--active' : ''}"
             id="nav-${item.id}">
            <span class="sidebar__icon">${item.icon}</span>
            <span class="sidebar__label">${item.label}</span>
          </a>
        `).join('')}

        <div class="sidebar__divider"></div>

        <a href="#game" class="sidebar__item sidebar__item--play" id="nav-play">
          <span class="sidebar__icon">▶️</span>
          <span class="sidebar__label">Jouer</span>
        </a>
      </nav>

      <div class="sidebar__footer">
        <div class="sidebar__currencies">
          <div class="currency-item">🪙 ${coins}</div>
          <div class="currency-item">💎 ${gems}</div>
          <div class="currency-item">🎫 ${records}</div>
        </div>
      </div>
    `;

    return sidebar;
  }
}
