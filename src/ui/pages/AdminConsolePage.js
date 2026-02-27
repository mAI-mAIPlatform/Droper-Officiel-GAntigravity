/* ============================
   DROPER — Interface Admin Console (v0.2.6 Security Update)
   ============================ */

import { HEROES } from '../../data/heroes.js';

export class AdminConsolePage {
    constructor(app) {
        this.app = app;
        this.activeTab = 'general';
    }

    render() {
        const am = this.app.adminManager;
        if (!am.isAuthenticated) {
            return `
                <div class="page admin-login">
                    <div class="page__header">
                        <h1 class="section-title">ACCÈS MANAGER SÉCURISÉ</h1>
                    </div>
                    <div class="card" style="max-width: 400px; margin: 40px auto; padding: 30px; border: 1px solid var(--color-accent-blue);">
                        <div class="stack" style="gap: 15px;">
                            <input type="text" id="admin-login" class="input" placeholder="Login Administrateur" style="width: 100%;">
                            <input type="password" id="admin-pass" class="input" placeholder="Mot de passe" style="width: 100%;">
                            <input type="text" id="admin-code" class="input" placeholder="Code de vérification" style="width: 100%;">
                            <button id="btn-login-admin" class="btn btn--accent" style="width: 100%; margin-top: 10px;">VALIDER L'ACCÈS</button>
                        </div>
                    </div>
                    <p style="text-align: center; font-size: 0.6rem; color: var(--color-text-muted);">Console v0.2.6 — Système Htths_Tss</p>
                </div>
            `;
        }

        const config = am.config;

        return `
            <div class="page page--admin">
                <div class="page__header row row--between">
                    <h1 class="section-title">
                        <span class="section-title__prefix">///</span> CONSOLE MANAGER v0.2.6
                    </h1>
                    <button id="btn-logout-admin" class="btn btn--ghost" style="font-size: 0.7rem;">DÉCONNEXION</button>
                </div>

                <div class="row" style="gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'general' ? 'active' : ''}" data-tab="general">GÉNÉRAL</button>
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'economy' ? 'active' : ''}" data-tab="economy">ÉCONOMIE</button>
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'starters' ? 'active' : ''}" data-tab="starters">STARTERS</button>
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'event' ? 'active' : ''}" data-tab="event">ÉVÉNEMENTS</button>
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'news' ? 'active' : ''}" data-tab="news">ACTUALITÉS</button>
                </div>

                <div id="admin-tab-content">
                    ${this.renderActiveTab(config)}
                </div>
            </div>
        `;
    }

    renderActiveTab(config) {
        const am = this.app.adminManager;

        if (this.activeTab === 'general') {
            return `
                <div class="admin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="card">
                        <h3 style="margin-bottom: 15px;">🎁 Cadeaux & Starters</h3>
                        <div class="row" style="gap: 10px; margin-bottom: 15px;">
                            <input type="number" id="coin-amount" class="input" value="1000" style="flex: 1;">
                            <button id="btn-add-coins" class="btn btn--accent">AJOUTER 🪙</button>
                        </div>
                        <div class="row" style="gap: 5px; flex-wrap: wrap; margin-bottom:20px;">
                            <button class="btn btn--outline btn-give-starter" data-rarity="common">COMMUN</button>
                            <button class="btn btn--outline btn-give-starter" data-rarity="rare">RARE</button>
                            <button class="btn btn--outline btn-give-starter" data-rarity="epic">ÉPIQUE</button>
                            <button class="btn btn--outline btn-give-starter" data-rarity="legendary">LÉGENDAIRE</button>
                        </div>
                        <h3 style="margin-bottom: 15px;">🦸 Débloquer Héros</h3>
                        <div class="row" style="gap: 10px;">
                            <select id="gift-hero-select" class="input" style="flex:1;">
                                ${this.app.heroManager.allHeroes.map(h => `<option value="${h.id}">${h.emoji} ${h.name}</option>`).join('')}
                            </select>
                            <button id="btn-give-hero" class="btn btn--purple">DÉBLOQUER</button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.activeTab === 'economy') {
            return `
                <div class="card">
                    <h3 style="margin-bottom: 15px;">🛍️ Créer Offre Spéciale</h3>
                    <div class="stack" style="gap: 10px;">
                        <input type="text" id="offer-name" class="input" placeholder="Titre">
                        <select id="offer-cost-type" class="input"><option value="coins">Coins 🪙</option><option value="gems">Gems 💎</option></select>
                        <input type="number" id="offer-cost-val" class="input" value="1000">
                        <select id="offer-rew-type" class="input"><option value="coins">💰 Coins</option><option value="gems">💎 Gems</option></select>
                        <input type="number" id="offer-rew-val" class="input" value="5000">
                        <button id="btn-create-offer" class="btn btn--green">PUBLIER</button>
                        <button id="btn-force-save" class="btn btn--ghost">💾 FORCE SAVE</button>
                    </div>
                </div>
            `;
        }

        if (this.activeTab === 'starters') {
            return `
                <div class="admin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="card">
                        <h3>🦸 Créer Nouveau Héros</h3>
                        <input type="text" id="new-hero-name" class="input" placeholder="Nom">
                        <input type="text" id="new-hero-emoji" class="input" placeholder="Emoji">
                        <input type="color" id="new-hero-color" class="input" value="#4a9eff">
                        <div class="grid-2">
                            <input type="number" id="new-hero-hp" class="input" value="100" placeholder="HP">
                            <input type="number" id="new-hero-atk" class="input" value="15" placeholder="Atk">
                        </div>
                        <button id="btn-create-hero-admin" class="btn btn--green">💾 CRÉER</button>
                    </div>
                    <div class="card">
                        <h3>👕 Créer Nouveau Skin</h3>
                        <select id="skin-base-hero" class="input">${this.app.heroManager.allHeroes.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}</select>
                        <input type="text" id="new-skin-name" class="input" placeholder="Nom Skin">
                        <input type="color" id="new-skin-color" class="input" value="#ff4444">
                        <button id="btn-create-skin-admin" class="btn btn--purple">🎨 CRÉER</button>
                    </div>
                </div>
            `;
        }

        if (this.activeTab === 'event') {
            return `
                <div class="card">
                    <h3>🌪️ Modificateurs & Debug</h3>
                    <div class="row" style="gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn--purple btn-admin-flag" data-flag="godMode" style="opacity: ${config.godMode ? 1 : 0.5}">😇 GOD MODE</button>
                        <button class="btn btn--purple btn-admin-flag" data-flag="infiniteAmmo" style="opacity: ${config.infiniteAmmo ? 1 : 0.5}">♾️ MUNITIONS INF.</button>
                        <button class="btn btn--purple btn-admin-flag" data-flag="doubleFireRate" style="opacity: ${config.doubleFireRate ? 1 : 0.5}">🔥 TIR RAPIDE x2</button>
                        <button class="btn btn--purple btn-admin-flag" data-flag="doubleHP" style="opacity: ${config.doubleHP ? 1 : 0.5}">❤️ VITA x2</button>
                        <button class="btn btn--purple btn-admin-flag" data-flag="smallPlayer" style="opacity: ${config.smallPlayer ? 1 : 0.5}">🤏 PETIT JOUEUR</button>
                    </div>
                </div>
            `;
        }

        if (this.activeTab === 'news') {
            return `
                <div class="card">
                    <h3>📰 Créer une Actualité</h3>
                    <input type="text" id="news-title" class="input" placeholder="Titre">
                    <textarea id="news-content" class="input" placeholder="Contenu"></textarea>
                    <button id="btn-publish-news" class="btn btn--accent">PUBLIER</button>
                </div>
            `;
        }
    }

    afterRender() {
        const am = this.app.adminManager;
        const loginBtn = document.getElementById('btn-login-admin');
        if (loginBtn) {
            loginBtn.onclick = async () => {
                const login = document.getElementById('admin-login').value;
                const pass = document.getElementById('admin-pass').value;
                const code = document.getElementById('admin-code').value;
                if (await am.authenticate(login, pass, code)) this.refresh();
            };
        }

        const logoutBtn = document.getElementById('btn-logout-admin');
        if (logoutBtn) logoutBtn.onclick = () => { am.logout(); this.refresh(); };

        if (am.isAuthenticated) this.setupActions();
    }

    setupActions() {
        const am = this.app.adminManager;

        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.onclick = () => { this.activeTab = tab.dataset.tab; this.refresh(); };
        });

        const addCoins = document.getElementById('btn-add-coins');
        if (addCoins) addCoins.onclick = () => am.addCoins(parseInt(document.getElementById('coin-amount').value));

        document.querySelectorAll('.btn-give-starter').forEach(btn => {
            btn.onclick = () => am.giveStarter(btn.dataset.rarity);
        });

        const giveHero = document.getElementById('btn-give-hero');
        if (giveHero) giveHero.onclick = () => am.unlockHero(document.getElementById('gift-hero-select').value);

        const createOffer = document.getElementById('btn-create-offer');
        if (createOffer) createOffer.onclick = () => {
            const name = document.getElementById('offer-name').value;
            const costType = document.getElementById('offer-cost-type').value;
            const costVal = parseInt(document.getElementById('offer-cost-val').value);
            const rewType = document.getElementById('offer-rew-type').value;
            const rewVal = parseInt(document.getElementById('offer-rew-val').value);
            if (name) {
                am.addSpecialOffer({ name, cost: { type: costType, amount: costVal }, reward: { type: rewType, amount: rewVal } });
                this.refresh();
            }
        };

        document.querySelectorAll('.btn-admin-flag').forEach(btn => {
            btn.onclick = () => {
                const flag = btn.dataset.flag;
                am.setAdminFlag(flag, !am.config[flag]);
                this.refresh();
            };
        });

        const forceSave = document.getElementById('btn-force-save');
        if (forceSave) forceSave.onclick = () => am.forceSave();

        const publishNews = document.getElementById('btn-publish-news');
        if (publishNews) publishNews.onclick = () => {
            const title = document.getElementById('news-title').value;
            const content = document.getElementById('news-content').value;
            if (title) { am.createNewsArticle({ title, summary: title, content, type: 'update' }); this.refresh(); }
        };

        const createHero = document.getElementById('btn-create-hero-admin');
        if (createHero) createHero.onclick = () => {
            const name = document.getElementById('new-hero-name').value;
            const emoji = document.getElementById('new-hero-emoji').value;
            const color = document.getElementById('new-hero-color').value;
            const hp = parseInt(document.getElementById('new-hero-hp').value);
            const atk = parseInt(document.getElementById('new-hero-atk').value);
            if (name && emoji) {
                am.createCustomHero({ name, emoji, color, stats: { hp, attack: atk, defense: 5, speed: 120 } });
                this.app.heroManager.refreshHeroList();
                this.refresh();
            }
        };

        const createSkin = document.getElementById('btn-create-skin-admin');
        if (createSkin) createSkin.onclick = () => {
            const baseId = document.getElementById('skin-base-hero').value;
            const name = document.getElementById('new-skin-name').value;
            const color = document.getElementById('new-skin-color').value;
            if (name) { am.createCustomSkin({ heroId: baseId, name, color }); this.refresh(); }
        };
    }

    refresh() {
        const container = document.getElementById('page-container');
        if (container) {
            container.innerHTML = this.render();
            this.afterRender();
        }
    }
}
