/* ============================
   DROPER — Multiplayer Manager (WebSocket + Fallback Bots)
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class MultiplayerManager {
    constructor(app) {
        this.app = app;
        this.ws = null;
        this.connected = false;
        this.roomId = null;
        this.playerId = null;
        this.players = new Map();
        this.onMatchFound = null;
        this.onPlayerUpdate = null;
        this.onMatchEnd = null;
        this.searching = false;
        this.serverUrl = 'ws://localhost:3001';
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this._onlineGameActive = false;
    }

    connect(serverUrl) {
        if (serverUrl) this.serverUrl = serverUrl;

        // Éviter les reconnexions multiples simultanées
        if (this.isReconnecting) return Promise.resolve(false);

        return new Promise((resolve) => {
            try {
                this.ws = new WebSocket(this.serverUrl);

                this.ws.onopen = () => {
                    this.connected = true;
                    this.isReconnecting = false;
                    this.reconnectAttempts = 0;
                    this.playerId = this.app.playerManager.tag;
                    toast.success('🌐 Connecté au serveur !');
                    resolve(true);
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        this.handleMessage(msg);
                    } catch (e) {
                        console.warn('⚠️ Message réseau invalide', e);
                    }
                };

                this.ws.onclose = () => {
                    this.connected = false;
                    this.searching = false;
                    this.roomId = null;

                    if (this.app.uiManager && this.app.uiManager.currentPageId === 'game' && this._onlineGameActive) {
                        toast.error('🔌 Déconnecté du serveur en pleine partie');
                        this.app.uiManager.showPage('lobby');
                        this._onlineGameActive = false;
                    } else if (!this.isReconnecting) {
                        toast.info('🔌 Déconnecté du serveur');
                    }

                    // Auto-reconnect
                    this.attemptReconnect();
                    resolve(false);
                };

                this.ws.onerror = () => {
                    this.connected = false;
                    resolve(false);
                };

                // Timeout fallback
                setTimeout(() => {
                    if (!this.connected) {
                        resolve(false);
                    }
                }, 3000);
            } catch (e) {
                resolve(false);
            }
        });
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= 3) {
            toast.error('❌ Échec de reconnexion au serveur.');
            this.isReconnecting = false;
            return;
        }

        this.isReconnecting = true;
        this.reconnectAttempts = (this.reconnectAttempts || 0) + 1;
        toast.info(`🔄 Tentative de reconnexion (${this.reconnectAttempts}/3)...`);

        setTimeout(() => {
            this.connect();
        }, 3000); // Wait 3s before retrying
    }

    async searchMatch(modeId) {
        if (!this.connected) {
            const ok = await this.connect();
            if (!ok) {
                toast.info('🤖 Serveur indisponible — Match contre bots');
                return { online: false };
            }
        }

        this.searching = true;
        this.send({ type: 'search_match', modeId, playerId: this.playerId });
        toast.info('🔍 Recherche d\'adversaires...');

        return new Promise((resolve) => {
            this._matchResolve = resolve;
            // Timeout: if no match in 60s, fallback to bots
            setTimeout(() => {
                if (this.searching) {
                    this.searching = false;
                    this.cancelSearch();
                    toast.info('🤖 Aucun joueur trouvé — Match contre bots');
                    resolve({ online: false });
                }
            }, 60000);
        });
    }

    cancelSearch() {
        this.searching = false;
        if (this.connected) {
            this.send({ type: 'cancel_search' });
        }
    }

    handleMessage(msg) {
        switch (msg.type) {
            case 'match_found':
                this.searching = false;
                this.roomId = msg.roomId;
                this._onlineGameActive = true;
                toast.success('⚔️ Match trouvé !');
                if (this._matchResolve) {
                    this._matchResolve({ online: true, roomId: msg.roomId, players: msg.players });
                    this._matchResolve = null;
                }
                break;

            case 'player_update':
                if (this.onPlayerUpdate) this.onPlayerUpdate(msg.data);
                break;

            case 'player_shoot':
                if (this.onPlayerUpdate) this.onPlayerUpdate({ type: 'shoot', ...msg.data });
                break;

            case 'match_end':
                if (this.onMatchEnd) this.onMatchEnd(msg.data);
                this.roomId = null;
                this._onlineGameActive = false;
                break;

            case 'player_left':
                this.players.delete(msg.playerId);
                toast.info(`👤 Un joueur a quitté`);
                break;
        }
    }

    sendPosition(x, y, angle) {
        if (!this.connected || !this.roomId) return;
        this.send({ type: 'position', roomId: this.roomId, x, y, angle });
    }

    sendShoot(x, y, angle) {
        if (!this.connected || !this.roomId) return;
        this.send({ type: 'shoot', roomId: this.roomId, x, y, angle });
    }

    sendDamage(targetId, damage) {
        if (!this.connected || !this.roomId) return;
        this.send({ type: 'damage', roomId: this.roomId, targetId, damage });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
        this.roomId = null;
        this.searching = false;
    }

    get isOnline() {
        return this.connected && this.roomId !== null;
    }
}
