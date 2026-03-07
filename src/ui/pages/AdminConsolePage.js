/* ============================
   DROPER — Interface Admin Console (v1.0.0)
   ============================ */

import { HEROES } from '../../data/heroes.js';

export class AdminConsolePage {
    constructor(app) {
        this.app = app;
        this.activeTab = 'general';
    }

    escapeHTML(str) {
        if (!str || typeof str !== 'string') return str || '';
        return str.replace(/[&<>'"]/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[match]));
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
                    <p style="text-align: center; font-size: 0.6rem; color: var(--color-text-muted);">Console v1.0.0 — Système Htths_Tss</p>
                </div>
            `;
        }

        const config = am.config;

        return `
            <div class="page page--admin">
                <div class="page__header row row--between">
                    <h1 class="section-title">
                        <span class="section-title__prefix">///</span> CONSOLE MANAGER v1.0.0
                    </h1>
                    <button id="btn-logout-admin" class="btn btn--ghost" style="font-size: 0.7rem;">DÉCONNEXION</button>
                </div>

                <div class="row" style="gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'general' ? 'active' : ''}" data-tab="general">GÉNÉRAL</button>
                    <button class="btn btn--outline admin-tab ${this.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">📊 DASHBOARD</button>
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

        if (this.activeTab === 'dashboard') {
            const stats = this.app.saveManager?.data?.stats || {};
            const acReports = this.app.engine?.antiCheat?.getReports() || [];
            const sbmmBadge = this.app.matchmakingManager?.getSkillBadge() || { label: 'N/A', emoji: '❓', color: '#8b95a8' };
            const dbSync = this.app.saveManager?.db?.getSyncBadge() || { label: '⏸ Idle', color: '#8b95a8' };

            return `
                <div class="admin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <!-- Stats Chart -->
                    <div class="card" style="grid-column: span 2;">
                        <h3 style="margin-bottom: 10px;">📊 Statistiques Joueur</h3>
                        <canvas id="admin-stats-chart" width="600" height="200" style="width: 100%; border-radius: 8px; background: rgba(0,0,0,0.2);"></canvas>
                    </div>

                    <!-- SBMM -->
                    <div class="card">
                        <h3 style="margin-bottom: 10px;">🎯 SBMM</h3>
                        <div style="text-align: center; padding: 10px;">
                            <div style="font-size: 2rem;">${sbmmBadge.emoji}</div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: ${sbmmBadge.color};">${sbmmBadge.label}</div>
                            <div style="font-size: 0.65rem; color: var(--color-text-muted); margin-top: 5px;">Rating: ${this.app.matchmakingManager?.skillRating || 'N/A'}</div>
                        </div>
                    </div>

                    <!-- DB Sync -->
                    <div class="card">
                        <h3 style="margin-bottom: 10px;">☁️ Base de Données</h3>
                        <div style="text-align: center; padding: 10px;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: ${dbSync.color};">${dbSync.label}</div>
                            <div style="font-size: 0.6rem; color: var(--color-text-muted); margin-top: 8px;">Type: ${this.app.saveManager?.db?.type || 'local'}</div>
                            <button id="btn-force-sync" class="btn btn--outline" style="margin-top: 10px; font-size: 0.7rem;">🔄 FORCER SYNC</button>
                        </div>
                    </div>

                    <!-- Anti-Cheat Rapports -->
                    <div class="card" style="grid-column: span 2;">
                        <h3 style="margin-bottom: 10px;">🛡️ Rapports Anti-Cheat (${acReports.length})</h3>
                        <div style="max-height: 200px; overflow-y: auto; font-size: 0.7rem;">
                            ${acReports.length === 0 ? '<div style="color: var(--color-text-muted); text-align: center; padding: 20px;">Aucun rapport 🎉</div>' :
                    `<table style="width: 100%; border-collapse: collapse;">
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
                                    <th style="padding: 6px;">Type</th>
                                    <th style="padding: 6px;">Détail</th>
                                    <th style="padding: 6px;">Date</th>
                                </tr>
                                ${acReports.slice(-10).reverse().map(r => `
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                        <td style="padding: 6px; color: #ef4444; font-weight: 700;">${this.escapeHTML(r.type)}</td>
                                        <td style="padding: 6px;">${this.escapeHTML(r.detail)}</td>
                                        <td style="padding: 6px; color: var(--color-text-muted);">${new Date(r.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                `).join('')}
                            </table>`}
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
            const events = this.app.flashEventManager ? this.app.flashEventManager.events : [];
            const currentEvent = this.app.flashEventManager ? this.app.flashEventManager.currentEvent : null;

            return `
                <div class="admin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="card">
                        <h3>⚡ GESTION DES ÉVÉNEMENTS FLASH</h3>
                        <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 15px;">
                            Forcer le démarrage ou l'arrêt d'un événement en cours sans redémarrer le serveur.
                        </p>
                        
                        <div class="row row--between" style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                            <div>
                                <strong style="font-size: 0.8rem; color: var(--color-accent-blue);">Événement Actif :</strong>
                                <div style="font-size: 0.9rem; margin-top: 4px;">
                                    ${currentEvent ? `${currentEvent.emoji} <span style="color: ${currentEvent.color || '#fff'}">${currentEvent.name}</span>` : '<span style="color: var(--color-text-muted);">🚫 Aucun</span>'}
                                </div>
                            </div>
                            ${currentEvent ? `<button id="btn-stop-event" class="btn btn--outline" style="border-color: #ef4444; color: #ef4444; padding: 5px 15px; font-size: 0.7rem;">STOPPER</button>` : ''}
                        </div>

                        <div class="stack" style="gap: 8px; max-height: 250px; overflow-y: auto;">
                            ${events.map(ev => `
                                <div class="row row--between" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;">
                                    <div>
                                        <div style="font-weight: 700; font-size: 0.8rem;">${ev.emoji} ${ev.name}</div>
                                    </div>
                                    <button class="btn btn--ghost btn-force-event" data-id="${ev.id}" style="color: var(--color-accent-green); font-size: 0.65rem; padding: 4px 10px; border: 1px solid var(--color-accent-green);">▶ DÉMARRER</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
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

        // Draw charts
        this.drawStatsChart();
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

        const stopEventBtn = document.getElementById('btn-stop-event');
        if (stopEventBtn && this.app.flashEventManager) {
            stopEventBtn.onclick = () => {
                this.app.flashEventManager.stopCurrentEvent(this.app.engine);
                this.refresh();
            };
        }

        document.querySelectorAll('.btn-force-event').forEach(btn => {
            btn.onclick = () => {
                if (this.app.flashEventManager) {
                    this.app.flashEventManager.forceEvent(btn.dataset.id);
                    if (this.app.engine) this.app.flashEventManager.applyModifiers(this.app.engine);
                    this.refresh();
                }
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

    drawStatsChart() {
        const canvas = document.getElementById('admin-stats-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const stats = this.app.saveManager?.data?.stats || {};

        const data = [
            { label: 'Kills', value: stats.kills || 0, color: '#ef4444' },
            { label: 'Parties', value: stats.gamesPlayed || 0, color: '#3b82f6' },
            { label: 'Victoires', value: stats.wins || 0, color: '#22c55e' },
            { label: 'Max Vague', value: stats.maxWave || 0, color: '#fbbf24' },
            { label: 'Temps (min)', value: Math.round((stats.totalPlaytime || 0) / 60), color: '#a855f7' },
        ];

        const maxVal = Math.max(...data.map(d => d.value), 1);
        const barW = 60;
        const gap = 30;
        const startX = 50;
        const chartH = 150;
        const baseY = 180;

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        for (let i = 0; i <= 4; i++) {
            const y = baseY - (chartH / 4) * i;
            ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(canvas.width - 10, y); ctx.stroke();
        }

        // Bars
        data.forEach((d, i) => {
            const x = startX + i * (barW + gap);
            const h = (d.value / maxVal) * chartH;

            // Gradient bar
            const grad = ctx.createLinearGradient(x, baseY, x, baseY - h);
            grad.addColorStop(0, d.color + '44');
            grad.addColorStop(1, d.color);
            ctx.fillStyle = grad;
            ctx.fillRect(x, baseY - h, barW, h);

            // Border
            ctx.strokeStyle = d.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, baseY - h, barW, h);

            // Value on top
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(d.value, x + barW / 2, baseY - h - 6);

            // Label below
            ctx.fillStyle = '#8b95a8';
            ctx.font = '9px sans-serif';
            ctx.fillText(d.label, x + barW / 2, baseY + 14);
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
