/* ============================
   DROPER — Chat Manager (WebSocket pour clubs + amis)
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class ChatManager {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.serverUrl = 'ws://localhost:3001/chat';
        this.onMessage = null;
    }

    async connect() {
        return new Promise((resolve) => {
            try {
                this.ws = new WebSocket(this.serverUrl);
                this.ws.onopen = () => {
                    this.connected = true;
                    resolve(true);
                };
                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        this.handleIncoming(msg);
                    } catch (e) { /* ignore */ }
                };
                this.ws.onclose = () => { this.connected = false; };
                this.ws.onerror = () => { this.connected = false; resolve(false); };
                setTimeout(() => { if (!this.connected) resolve(false); }, 3000);
            } catch (e) {
                resolve(false);
            }
        });
    }

    handleIncoming(msg) {
        switch (msg.type) {
            case 'club_message':
                if (this.onMessage) this.onMessage('club', msg);
                break;
            case 'direct_message':
                if (this.onMessage) this.onMessage('direct', msg);
                toast.info(`💬 ${msg.sender}: ${msg.text.slice(0, 30)}`);
                break;
            case 'friend_request':
                toast.info(`📨 Demande d'ami de ${msg.sender}`);
                break;
        }
    }

    sendClubMessage(clubId, text) {
        this.send({ type: 'club_message', clubId, text, timestamp: Date.now() });
    }

    sendDirectMessage(tag, text) {
        this.send({ type: 'direct_message', to: tag, text, timestamp: Date.now() });
    }

    sendFriendRequest(tag) {
        this.send({ type: 'friend_request', to: tag, timestamp: Date.now() });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.ws) { this.ws.close(); this.ws = null; }
        this.connected = false;
    }
}
