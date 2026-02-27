/* ============================
   DROPER — Router SPA (v0.0.5)
   ============================ */

import { Navbar } from './ui/components/Navbar.js';
import { HomePage } from './ui/pages/HomePage.js';
import { ArmoryPage } from './ui/pages/ArmoryPage.js';
import { ShopPage } from './ui/pages/ShopPage.js';
import { QuestsPage } from './ui/pages/QuestsPage.js';
import { StatsPage } from './ui/pages/StatsPage.js';
import { ProfilePage } from './ui/pages/ProfilePage.js';
import { SeasonPassPage } from './ui/pages/SeasonPassPage.js';
import { GamePage } from './ui/pages/GamePage.js';
import { CollectionPage } from './ui/pages/CollectionPage.js';
import { SeasonEventPage } from './ui/pages/SeasonEventPage.js';
import { GameModesPage } from './ui/pages/GameModesPage.js';
import { NewsPage } from './ui/pages/NewsPage.js';
import { LobbyPage } from './ui/pages/LobbyPage.js';
import { RankedPage } from './ui/pages/RankedPage.js';
import { SocialPage } from './ui/pages/SocialPage.js';
// SkinsPage removed in favor of CollectionPage
import { AdminConsolePage } from './ui/pages/AdminConsolePage.js';

export class Router {
    constructor(app) {
        this.app = app;
        this.appEl = document.getElementById('app');
        this.currentPage = null;
        this.navbar = null;

        this.routes = {
            'accueil': HomePage,
            'armurerie': ArmoryPage,
            'boutique': ShopPage,
            'quetes': QuestsPage,
            'stats': StatsPage,
            'profil': ProfilePage,
            'pass-saison': SeasonPassPage,
            'game': GamePage,
            'collection': CollectionPage,
            'inventaire': CollectionPage, // Keep alias
            'skins': CollectionPage,      // Keep alias
            'saison-1': SeasonEventPage,
            'modes': GameModesPage,
            'actualites': NewsPage,
            'records': StatsPage,
            'infos': StatsPage,
            'classement': StatsPage,
            'lobby': LobbyPage,
            'classe': RankedPage,
            'club': SocialPage,
            'amis': SocialPage,
            'historique': StatsPage,
            'admin': AdminConsolePage,
        };

        this.fullscreenRoutes = ['game'];
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        if (!window.location.hash || window.location.hash === '#') {
            history.replaceState(null, null, '#accueil');
            this.handleRoute();
        } else {
            this.handleRoute();
        }
    }

    handleRoute() {
        let hash = window.location.hash.slice(1);
        if (!hash) {
            hash = 'accueil';
            history.replaceState(null, null, '#accueil');
        }

        const PageClass = this.routes[hash];
        if (!PageClass) {
            history.replaceState(null, null, '#accueil');
            this.handleRoute(); // Call explicitly to render fallback
            return;
        }
        this.renderPage(PageClass, hash);
    }

    renderPage(PageClass, routeName) {
        if (this.currentPage && this.currentPage.destroy) {
            this.currentPage.destroy();
        }

        this.appEl.innerHTML = '';
        const isFullscreen = this.fullscreenRoutes.includes(routeName);

        const pageContainer = document.createElement('div');
        pageContainer.id = 'page-container';
        if (isFullscreen) pageContainer.classList.add('page--fullscreen');

        this.currentPage = new PageClass(this.app);
        const pageContent = this.currentPage.render();

        if (typeof pageContent === 'string') {
            pageContainer.innerHTML = pageContent;
        } else if (pageContent instanceof HTMLElement) {
            pageContainer.appendChild(pageContent);
        }

        if (!isFullscreen) {
            this.navbar = new Navbar(routeName, this.app);
            this.appEl.appendChild(this.navbar.render());
        }

        this.appEl.appendChild(pageContainer);

        if (this.currentPage.afterRender) {
            this.currentPage.afterRender();
        }
    }

    navigateTo(route) {
        window.location.hash = `#${route}`;
    }
}
