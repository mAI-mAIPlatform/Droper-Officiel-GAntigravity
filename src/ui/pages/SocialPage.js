/* ============================
   DROPER — Page Sociale Consolidée (v0.1.5)
   ============================ */

export class SocialPage {
    constructor(app) {
        this.app = app;
        this.activeTab = 'friends'; // friends, clubs
        this.searchTerm = '';
    }

    render() {
        return `
            <div class="page page--social">
                <div class="page__header">
                    <h1 class="section-title">
                        <span class="section-title__prefix">///</span> SOCIAL
                    </h1>
                </div>

                <!-- Onglets -->
                <div class="row" style="gap: 10px; margin-bottom: 20px;">
                    <button class="btn btn--outline social-tab ${this.activeTab === 'friends' ? 'active' : ''}" data-tab="friends">AMIS</button>
                    <button class="btn btn--outline social-tab ${this.activeTab === 'clubs' ? 'active' : ''}" data-tab="clubs">CLUBS</button>
                </div>

                <div id="social-tab-content" class="anim-fade-in">
                    ${this.renderActiveTab()}
                </div>
                ${this.renderTradeModal()}
            </div>
        `;
    }

    renderActiveTab() {
        if (this.activeTab === 'friends') return this.renderFriendsTab();
        if (this.activeTab === 'clubs') return this.renderClubsTab();
    }

    renderFriendsTab() {
        const friends = this.app.friendManager?.friends || [];
        const filtered = friends.filter(f => f.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

        return `
            <div class="stack" style="gap: 20px;">
                <!-- Recherche Optimisée -->
                <div class="row" style="gap: 10px;">
                    <div class="search-bar" style="flex: 1; margin-bottom: 0;">
                        <span class="search-bar__icon">🔍</span>
                        <input type="text" id="friend-search-input" class="search-bar__input" 
                               placeholder="Rechercher un pseudo..." value="${this.searchTerm}" 
                               style="width: 100%;">
                    </div>
                    <button id="btn-search-friend" class="btn btn--accent" style="width: 50px; flex-shrink: 0; padding: 0;">OK</button>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 15px; font-size: 0.9rem; color: var(--color-accent-blue);">LISTE D'AMIS (${filtered.length})</h3>
                    <div class="stack" style="gap: 10px;">
                        ${filtered.length === 0 ? `
                            <p style="text-align: center; color: var(--color-text-muted); padding: 20px; font-size: 0.8rem;">
                                ${this.searchTerm ? 'Aucun ami trouvé.' : 'Vous n\'avez pas encore d\'amis.'}
                            </p>
                        ` : filtered.map(friend => `
                            <div class="row row--between" style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                                <div class="row" style="gap: 10px;">
                                    <div style="width: 32px; height: 32px; background: var(--color-bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem;">👤</div>
                                    <div>
                                        <div style="font-weight: 700; font-size: 0.9rem;">${friend.name}</div>
                                        <div style="font-size: 0.6rem; color: ${friend.online ? 'var(--color-accent-green)' : 'var(--color-text-muted)'};">
                                            ${friend.online ? '• En ligne' : '• Hors ligne'}
                                        </div>
                                <div class="row" style="gap: 5px;">
                                    <button class="btn btn--primary btn--icon anim-pulse-btn" onclick="window.app.uiManager.showTradeModal('${friend.tag}', '${friend.name}')" title="Échanger un cosmétique" style="font-size: 0.9rem;">🤝</button>
                                    <button class="btn btn--ghost btn--icon" title="Chatter">💬</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn--outline" style="width: 100%;">AJOUTER UN AMI</button>
            </div>
        `;
    }

    renderClubsTab() {
        const club = this.app.clubManager?.club;

        if (!club) {
            return `
                <div class="card anim-fade-in-up" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🛡️</div>
                    <h2 style="margin-bottom: 10px;">REJOINDRE UN CLUB</h2>
                    <p style="color: var(--color-text-muted); font-size: 0.8rem; margin-bottom: 30px;">
                        Collaborez avec d'autres joueurs, participez à des guerres de clubs et débloquez des récompenses exclusives.
                    </p>
                    <div class="stack" style="gap: 10px; max-width: 300px; margin: 0 auto;">
                        <button class="btn btn--accent" style="width: 100%;">RECHERCHER UN CLUB</button>
                        <button class="btn btn--outline" style="width: 100%;">CRÉER UN CLUB</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="card anim-fade-in-up">
                <div class="row row--between" style="margin-bottom: 20px;">
                    <div class="row" style="gap: 15px;">
                        <div style="font-size: 2.5rem;">${club.emoji || '🛡️'}</div>
                        <div>
                            <h2 style="margin: 0;">${club.name}</h2>
                            <div style="font-size: 0.7rem; color: var(--color-accent-gold);">${club.members.length} membres • ${club.trophies} 🏆</div>
                        </div>
                    </div>
                    <button class="btn btn--ghost" style="color: var(--color-accent-red); font-size: 0.7rem;">QUITTER</button>
                </div>
                
                <div class="stack" style="gap: 15px;">
                    <div style="font-size: 0.8rem; font-weight: 700; border-bottom: 1px solid var(--color-border); padding-bottom: 5px; margin-bottom: 5px; display: flex; justify-content: space-between;">
                        <span>CHAT DU CLUB</span>
                        <span style="font-size: 0.6rem; color: var(--color-accent-green); animation: pulse 2s infinite;">• ACTIVITÉ RÉCENTE</span>
                    </div>
                    <div class="chat-mock anim-fade-in" id="club-chat" style="height: 200px; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; font-size: 0.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255,255,255,0.05);">
                        <div class="chat-msg anim-slide-in-right"><strong style="color: var(--color-accent-blue);">System:</strong> Bienvenue dans le club ! 🛡️</div>
                        <div class="chat-msg anim-slide-in-right" style="animation-delay: 0.2s;"><strong style="color: var(--color-accent-green);">[JOIN]</strong> <span style="font-weight: 700;">Alex77</span> a rejoint le club. 🎉</div>
                        <div class="chat-msg anim-slide-in-right" style="animation-delay: 0.4s;"><strong style="color: var(--color-accent-red);">[QUIT]</strong> <span style="font-weight: 700;">Shadow_K</span> a quitté le club. 💨</div>
                        <div class="chat-msg anim-slide-in-right" style="animation-delay: 0.6s;"><strong style="color: var(--color-accent-gold);">System:</strong> Nouvelle guerre de clubs commence dans 2h ! ⚔️</div>
                    </div>
                    <div class="row" style="gap: 10px;">
                        <input type="text" class="input" placeholder="Écris un message..." style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); padding: 10px 15px; border-radius: 8px;">
                        <button class="btn btn--accent btn--icon" style="width: 40px; height: 40px; border-radius: 8px;">➡️</button>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Tabs
        document.querySelectorAll('.social-tab').forEach(tab => {
            tab.onclick = () => {
                this.activeTab = tab.dataset.tab;
                this.refresh();
            };
        });

        // Search Input
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.oninput = (e) => {
                this.searchTerm = e.target.value;
            };
            searchInput.onkeypress = (e) => {
                if (e.key === 'Enter') this.refresh();
            };
        }

        const searchBtn = document.getElementById('btn-search-friend');
        if (searchBtn) {
            searchBtn.onclick = () => this.refresh();
        }

        // --- Modale d'Échange (Hooks) ---
        window.app.uiManager = window.app.uiManager || {};
        window.app.uiManager.showTradeModal = (tag, name) => {
            document.getElementById('trade-modal').style.display = 'flex';
            document.getElementById('trade-modal-title').innerText = `ÉCHANGER AVEC ${name.toUpperCase()}`;
            document.getElementById('trade-target-tag').value = tag;
        };

        const tradeSend = document.getElementById('btn-trade-send');
        if (tradeSend) {
            tradeSend.onclick = () => {
                const tag = document.getElementById('trade-target-tag').value;
                document.getElementById('trade-modal').style.display = 'none';

                // On simule l'envoi de l'échange via le TradeManager
                if (window.app.tradeManager) {
                    // Sélection factice pour Alpha (idéalement liée à l'inventaire)
                    const myFakeItem = { id: 'skin_sniper_gold', name: 'Sniper Or' };
                    const theirFakeItem = { id: 'emote_gg', name: 'Emote GG' };

                    window.app.tradeManager.proposeTrade(tag, myFakeItem, theirFakeItem);
                }
            };
        }

        const tradeCancel = document.getElementById('btn-trade-cancel');
        if (tradeCancel) {
            tradeCancel.onclick = () => document.getElementById('trade-modal').style.display = 'none';
        }
    }

    renderTradeModal() {
        return `
            <div id="trade-modal" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center;">
                <div class="card anim-scale-in" style="width: 90%; max-width: 400px; padding: 20px; text-align: center; border: 2px solid var(--color-accent-purple); box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);">
                    <h2 id="trade-modal-title" style="margin-bottom: 20px; color: var(--color-accent-purple);">ÉCHANGER</h2>
                    <input type="hidden" id="trade-target-tag">
                    
                    <div class="row row--between" style="margin-bottom: 20px; align-items: stretch;">
                        <div class="card" style="flex: 1; margin-right: 10px; border: 1px dashed var(--color-text-muted); cursor: pointer;">
                            <div style="font-size: 2rem; margin-bottom: 5px;">📦</div>
                            <div style="font-size: 0.7rem; color: var(--color-text-muted);">Ton Offre<br>(Clique pour choisir)</div>
                        </div>
                        <div style="font-size: 1.5rem; display: flex; align-items: center;">🔁</div>
                        <div class="card" style="flex: 1; margin-left: 10px; border: 1px dashed var(--color-text-muted); cursor: pointer;">
                            <div style="font-size: 2rem; margin-bottom: 5px;">❓</div>
                            <div style="font-size: 0.7rem; color: var(--color-text-muted);">Ce que tu veux</div>
                        </div>
                    </div>

                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 20px;">
                        <em>En Alpha, la sélection des objets est simulée aléatoirement.</em>
                    </p>

                    <div class="row" style="gap: 10px; justify-content: center;">
                        <button id="btn-trade-cancel" class="btn btn--outline" style="flex: 1;">ANNULER</button>
                        <button id="btn-trade-send" class="btn btn--primary" style="flex: 1;">PROPOSER</button>
                    </div>
                </div>
            </div>
        `;
    }

    refresh() {
        const container = document.getElementById('page-container');
        if (container) {
            container.innerHTML = this.render();
            this.afterRender();
        }
    }
}
