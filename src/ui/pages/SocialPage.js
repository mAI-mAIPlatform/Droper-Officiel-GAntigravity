/* ============================
   DROPER — Page Sociale (v0.9.8)
   Amis, Clubs, Chat, Spectateur
   ============================ */

import { CLUB_GRADES } from '../../systems/ClubManager.js';

const CHAT_EMOJIS = [
    { code: ':lol:', emoji: '😂' },
    { code: ':fire:', emoji: '🔥' },
    { code: ':skull:', emoji: '💀' },
    { code: ':gg:', emoji: '👑' },
    { code: ':rage:', emoji: '😡' },
    { code: ':heart:', emoji: '❤️' },
    { code: ':star:', emoji: '⭐' },
    { code: ':thumbsup:', emoji: '👍' },
];

function parseEmojis(text) {
    let result = text;
    for (const e of CHAT_EMOJIS) {
        result = result.replaceAll(e.code, `<span class="emoji-bounce">${e.emoji}</span>`);
    }
    return result;
}

export class SocialPage {
    constructor(app) {
        this.app = app;
        this.activeTab = 'friends';
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
                    <button class="btn btn--outline social-tab ${this.activeTab === 'friends' ? 'active' : ''}" data-tab="friends">👥 AMIS</button>
                    <button class="btn btn--outline social-tab ${this.activeTab === 'clubs' ? 'active' : ''}" data-tab="clubs">🏠 CLUB</button>
                    <button class="btn btn--outline social-tab ${this.activeTab === 'chat' ? 'active' : ''}" data-tab="chat">💬 GLOBAL</button>
                </div>

                <div id="social-tab-content" class="anim-fade-in">
                    ${this.renderActiveTab()}
                </div>
                ${this.renderTradeModal()}
            </div>
            <style>
                .emoji-bounce { display: inline-block; animation: emojiBounce 0.6s ease; }
                @keyframes emojiBounce { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
                .grade-badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; font-weight: 700; }
                .member-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 8px; transition: background 0.2s; }
                .member-row:hover { background: rgba(255,255,255,0.06); }
            </style>
        `;
    }

    renderActiveTab() {
        if (this.activeTab === 'friends') return this.renderFriendsTab();
        if (this.activeTab === 'clubs') return this.renderClubsTab();
        if (this.activeTab === 'chat') return this.renderGlobalChat();
    }

    renderFriendsTab() {
        const friends = this.app.friendManager?.friends || [];
        const filtered = friends.filter(f => f.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

        return `
            <div class="stack" style="gap: 20px;">
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
                            <div class="member-row">
                                <div class="row" style="gap: 10px;">
                                    <div style="width: 36px; height: 36px; background: var(--color-bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">👤</div>
                                    <div>
                                        <div style="font-weight: 700; font-size: 0.9rem;">${friend.name}</div>
                                        <div style="font-size: 0.6rem; color: ${friend.online ? 'var(--color-accent-green)' : 'var(--color-text-muted)'};">
                                            ${friend.online ? (friend.inGame ? '🎮 En Partie' : '🟢 En ligne') : '⚫ Hors ligne'}
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="gap: 5px;">
                                    ${friend.online && friend.inGame ? `
                                        <button class="btn btn--ghost btn--icon btn-spectate" data-friend="${friend.tag}" title="Spectater" style="font-size: 0.85rem; color: #06b6d4;">👁️</button>
                                    ` : ''}
                                    <button class="btn btn--primary btn--icon anim-pulse-btn" onclick="window.app.uiManager.showTradeModal('${friend.tag}', '${friend.name}')" title="Échanger" style="font-size: 0.9rem;">🤝</button>
                                    <button class="btn btn--ghost btn--icon" title="Chatter">💬</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn--outline" style="width: 100%;">➕ AJOUTER UN AMI</button>
            </div>
        `;
    }

    renderClubsTab() {
        const clubMgr = this.app.clubManager;
        const club = clubMgr?.club;

        if (!club) {
            return `
                <div class="stack" style="gap: 15px;">
                    <div class="card anim-fade-in-up" style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🏠</div>
                        <h2 style="margin-bottom: 10px;">REJOINDRE UN CLUB</h2>
                        <p style="color: var(--color-text-muted); font-size: 0.8rem; margin-bottom: 30px;">
                            Collaborez, gagnez des trophées et montez en grade !
                        </p>
                        <div class="stack" style="gap: 10px; max-width: 300px; margin: 0 auto;">
                            <button id="btn-join-club" class="btn btn--accent" style="width: 100%;">⚔️ REJOINDRE</button>
                            <button id="btn-create-club" class="btn btn--outline" style="width: 100%;">🏠 CRÉER</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Trier : Président > Vice > Officier > Membre > Recrue
        const sortedMembers = [...club.members].sort((a, b) => {
            const pa = CLUB_GRADES.find(g => g.id === a.role)?.power || 0;
            const pb = CLUB_GRADES.find(g => g.id === b.role)?.power || 0;
            return pb - pa;
        });

        const chatMsgs = clubMgr?.data?.clubChat || [];

        return `
            <div class="stack" style="gap: 15px;">
                <!-- En-tête Club -->
                <div class="card anim-fade-in-up" style="border: 1px solid var(--color-accent-gold)33;">
                    <div class="row row--between" style="margin-bottom: 15px;">
                        <div class="row" style="gap: 15px; align-items: center;">
                            <div style="font-size: 2.5rem; filter: drop-shadow(0 2px 8px rgba(251,191,36,0.5));">${club.emoji || '🏠'}</div>
                            <div>
                                <h2 style="margin: 0; font-size: 1.1rem;">${club.name}</h2>
                                <div style="font-size: 0.65rem; color: var(--color-text-muted);">
                                    ${club.members.length}/${club.maxMembers} membres
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.3rem; font-weight: 800; color: var(--color-accent-gold);">🏆 ${club.trophies}</div>
                            <button id="btn-leave-club" class="btn btn--ghost" style="color: var(--color-accent-red); font-size: 0.6rem; padding: 2px 8px;">QUITTER</button>
                        </div>
                    </div>

                    <!-- Barre de trophées -->
                    <div style="background: rgba(255,255,255,0.05); border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: 5px;">
                        <div style="height: 100%; width: ${Math.min(100, (club.trophies / 2000) * 100)}%; background: linear-gradient(90deg, #fbbf24, #f59e0b); border-radius: 6px; transition: width 0.5s;"></div>
                    </div>
                    <div style="font-size: 0.6rem; color: var(--color-text-muted); text-align: right;">Objectif: 2000 🏆</div>
                </div>

                <!-- Membres -->
                <div class="card">
                    <h3 style="margin-bottom: 12px; font-size: 0.85rem;">👥 MEMBRES</h3>
                    <div class="stack" style="gap: 6px; max-height: 250px; overflow-y: auto;">
                        ${sortedMembers.map(m => {
            const grade = CLUB_GRADES.find(g => g.id === m.role) || CLUB_GRADES[3];
            const gradeColor = grade.power >= 4 ? '#fbbf24' : grade.power >= 3 ? '#4a9eff' : '#8b95a8';
            const isMe = m.tag === 'Toi';
            return `
                                <div class="member-row">
                                    <div class="row" style="gap: 8px; align-items: center;">
                                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${m.online ? '#22c55e' : '#4b5563'};"></div>
                                        <span style="font-weight: ${isMe ? 800 : 600}; font-size: 0.8rem;">${isMe ? '🫵 Toi' : m.name}</span>
                                        <span class="grade-badge" style="background: ${gradeColor}22; color: ${gradeColor}; border: 1px solid ${gradeColor}44;">
                                            ${grade.emoji} ${grade.label}
                                        </span>
                                        ${m.trophiesContrib ? `<span style="font-size: 0.55rem; color: var(--color-text-muted);">🏆${m.trophiesContrib}</span>` : ''}
                                    </div>
                                    ${!isMe ? `
                                        <div class="row" style="gap: 4px;">
                                            <button class="btn btn--ghost btn--icon btn-promote" data-tag="${m.tag}" style="font-size: 0.7rem;" title="Promouvoir">⬆️</button>
                                            <button class="btn btn--ghost btn--icon btn-kick" data-tag="${m.tag}" style="font-size: 0.7rem; color: var(--color-accent-red);" title="Expulser">🚫</button>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>

                <!-- Chat -->
                <div class="card">
                    <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 10px; display: flex; justify-content: space-between;">
                        <span>💬 CHAT DU CLUB</span>
                        <span style="font-size: 0.55rem; color: var(--color-accent-green); animation: pulse 2s infinite;">• EN DIRECT</span>
                    </div>
                    <div id="club-chat" style="height: 180px; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 12px; font-size: 0.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        ${chatMsgs.length === 0 ? `
                            <div style="color: var(--color-text-muted); text-align: center; padding: 20px;">Aucun message. Sois le premier ! 💬</div>
                        ` : chatMsgs.slice(-20).map(msg => `
                            <div class="anim-slide-in-right">
                                <strong style="color: ${msg.sender === 'Toi' ? 'var(--color-accent-blue)' : 'var(--color-accent-gold)'};">${msg.sender}</strong>
                                <span style="color: var(--color-text-muted); font-size: 0.55rem;"> ${msg.time}</span>
                                <div style="margin-top: 2px;">${parseEmojis(msg.text)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="row" style="gap: 8px; margin-top: 8px;">
                        <input type="text" id="club-chat-input" class="input" placeholder="Message... (:fire: :gg: :lol:)" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); padding: 8px 12px; border-radius: 8px; font-size: 0.8rem;">
                        <button id="btn-club-chat-send" class="btn btn--accent btn--icon" style="width: 38px; height: 38px; border-radius: 8px;">➡️</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderGlobalChat() {
        return `
            <div class="card" style="text-align: center; padding: 30px;">
                <div style="font-size: 2.5rem; margin-bottom: 15px;">🌐</div>
                <h3 style="margin-bottom: 10px;">CHAT GLOBAL</h3>
                <p style="color: var(--color-text-muted); font-size: 0.8rem;">
                    Disponible via WebSocket en mode multijoueur. 
                    Connectez-vous à un serveur pour discuter avec tous les joueurs !
                </p>
                <div style="margin-top: 15px; font-size: 0.7rem; color: var(--color-accent-blue);">
                    🔌 Statut: ${this.app.chatManager?.connected ? '🟢 Connecté' : '🔴 Déconnecté'}
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

        // Search
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.oninput = (e) => { this.searchTerm = e.target.value; };
            searchInput.onkeypress = (e) => { if (e.key === 'Enter') this.refresh(); };
        }
        const searchBtn = document.getElementById('btn-search-friend');
        if (searchBtn) searchBtn.onclick = () => this.refresh();

        // Spectate buttons
        document.querySelectorAll('.btn-spectate').forEach(btn => {
            btn.onclick = () => {
                const tag = btn.dataset.friend;
                if (this.app.spectatorManager) {
                    this.app.spectatorManager.startSpectating(tag, null);
                }
            };
        });

        // Club buttons
        const joinBtn = document.getElementById('btn-join-club');
        if (joinBtn) joinBtn.onclick = () => { this.app.clubManager?.joinClub(); this.refresh(); };

        const createBtn = document.getElementById('btn-create-club');
        if (createBtn) createBtn.onclick = () => {
            const name = prompt('Nom du club :');
            if (name) { this.app.clubManager?.createClub(name); this.refresh(); }
        };

        const leaveBtn = document.getElementById('btn-leave-club');
        if (leaveBtn) leaveBtn.onclick = () => { this.app.clubManager?.leaveClub(); this.refresh(); };

        // Promote / Kick
        document.querySelectorAll('.btn-promote').forEach(btn => {
            btn.onclick = () => {
                const tag = btn.dataset.tag;
                const clubMgr = this.app.clubManager;
                const member = clubMgr?.club?.members?.find(m => m.tag === tag);
                if (!member) return;
                const currentGrade = CLUB_GRADES.find(g => g.id === member.role);
                const nextGrade = CLUB_GRADES.find(g => g.power === (currentGrade?.power || 0) + 1);
                if (nextGrade) { clubMgr.promoteMember(tag, nextGrade.id); this.refresh(); }
            };
        });
        document.querySelectorAll('.btn-kick').forEach(btn => {
            btn.onclick = () => {
                const tag = btn.dataset.tag;
                if (confirm('Expulser ce membre ?')) {
                    this.app.clubManager?.kickMember(tag);
                    this.refresh();
                }
            };
        });

        // Club Chat
        const chatInput = document.getElementById('club-chat-input');
        const chatSend = document.getElementById('btn-club-chat-send');
        if (chatSend && chatInput) {
            const sendMsg = () => {
                const text = chatInput.value.trim();
                if (!text) return;
                this.app.clubManager?.sendMessage(text);
                chatInput.value = '';
                this.refresh();
            };
            chatSend.onclick = sendMsg;
            chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMsg(); };
        }

        // Scroll chat to bottom
        const chatEl = document.getElementById('club-chat');
        if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;

        // Trade Modal
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
                if (window.app.tradeManager) {
                    const myFakeItem = { id: 'skin_sniper_gold', name: 'Sniper Or' };
                    const theirFakeItem = { id: 'emote_gg', name: 'Emote GG' };
                    window.app.tradeManager.proposeTrade(tag, myFakeItem, theirFakeItem);
                }
            };
        }
        const tradeCancel = document.getElementById('btn-trade-cancel');
        if (tradeCancel) tradeCancel.onclick = () => document.getElementById('trade-modal').style.display = 'none';
    }

    renderTradeModal() {
        return `
            <div id="trade-modal" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center;">
                <div class="card anim-scale-in" style="width: 90%; max-width: 400px; padding: 20px; text-align: center; border: 2px solid var(--color-accent-purple); box-shadow: 0 0 20px rgba(168,85,247,0.4);">
                    <h2 id="trade-modal-title" style="margin-bottom: 20px; color: var(--color-accent-purple);">ÉCHANGER</h2>
                    <input type="hidden" id="trade-target-tag">
                    <div class="row row--between" style="margin-bottom: 20px; align-items: stretch;">
                        <div class="card" style="flex: 1; margin-right: 10px; border: 1px dashed var(--color-text-muted); cursor: pointer;">
                            <div style="font-size: 2rem; margin-bottom: 5px;">📦</div>
                            <div style="font-size: 0.7rem; color: var(--color-text-muted);">Ton Offre</div>
                        </div>
                        <div style="font-size: 1.5rem; display: flex; align-items: center;">🔁</div>
                        <div class="card" style="flex: 1; margin-left: 10px; border: 1px dashed var(--color-text-muted); cursor: pointer;">
                            <div style="font-size: 2rem; margin-bottom: 5px;">❓</div>
                            <div style="font-size: 0.7rem; color: var(--color-text-muted);">Ce que tu veux</div>
                        </div>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 20px;"><em>En Alpha, la sélection est simulée.</em></p>
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
