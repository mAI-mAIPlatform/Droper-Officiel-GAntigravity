/* ============================
   DROPER — Friend Manager
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class FriendManager {
    constructor(saveManager, chatManager) {
        this.save = saveManager;
        this.chat = chatManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('friends') || this.getDefault();
    }

    persist() {
        this.save.set('friends', this.data);
    }

    getDefault() {
        return {
            list: [],
            pending: [],
            chats: {},
        };
    }

    get friends() { return this.data.list; }
    get pending() { return this.data.pending; }

    searchPlayer(query) {
        // Simulated search — returns fake players matching query
        const fakePlayers = [
            { name: 'NeoHunter', tag: '#A7X2K', level: 12, league: '🥈 Argent II', online: true },
            { name: 'CyberNova', tag: '#B3Y8M', level: 8, league: '🥉 Bronze III', online: false },
            { name: 'DropKing', tag: '#C9Z1P', level: 20, league: '🥇 Or I', online: true },
            { name: 'NightBlade', tag: '#D5W4R', level: 15, league: '💠 Platine I', online: false },
            { name: 'PixelStorm', tag: '#E2V6T', level: 6, league: '🥉 Bronze I', online: true },
        ];

        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return fakePlayers.filter(p =>
            p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
        );
    }

    sendRequest(player) {
        if (this.data.list.find(f => f.tag === player.tag)) {
            toast.info('Déjà ami(e) !');
            return;
        }
        if (this.data.pending.find(p => p.tag === player.tag)) {
            toast.info('Demande déjà envoyée !');
            return;
        }

        this.data.pending.push({ ...player, sentAt: Date.now() });
        this.persist();
        toast.success(`📨 Demande envoyée à ${player.name}`);

        // Auto-accept after 3s (simulated)
        setTimeout(() => {
            this.acceptRequest(player.tag);
        }, 3000);

        // WebSocket notification
        if (this.chat) {
            this.chat.sendFriendRequest(player.tag);
        }
    }

    acceptRequest(tag) {
        const idx = this.data.pending.findIndex(p => p.tag === tag);
        if (idx < 0) return;
        const player = this.data.pending.splice(idx, 1)[0];
        this.data.list.push({ ...player, addedAt: Date.now() });
        this.data.chats[tag] = [];
        this.persist();
        toast.success(`✅ ${player.name} est maintenant ton ami(e) !`);
    }

    removeFriend(tag) {
        this.data.list = this.data.list.filter(f => f.tag !== tag);
        delete this.data.chats[tag];
        this.persist();
        toast.info('👋 Ami(e) retiré(e)');
    }

    sendMessage(tag, text) {
        if (!text.trim()) return;
        if (!this.data.chats[tag]) this.data.chats[tag] = [];
        this.data.chats[tag].push({
            sender: 'Toi',
            text: text.trim(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        });
        if (this.data.chats[tag].length > 50) this.data.chats[tag].shift();
        this.persist();

        // WebSocket
        if (this.chat) {
            this.chat.sendDirectMessage(tag, text.trim());
        }

        // Simulated bot reply
        setTimeout(() => {
            const replies = ['GG !', 'Bien joué 🔥', 'On refait un match ?', '👍', 'Je suis prêt !', 'Trop fort !'];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const friend = this.data.list.find(f => f.tag === tag);
            if (!this.data.chats[tag]) this.data.chats[tag] = [];
            this.data.chats[tag].push({
                sender: friend ? friend.name : 'Ami',
                text: reply,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            });
            this.persist();
        }, 2000 + Math.random() * 3000);
    }

    getChat(tag) {
        return this.data.chats[tag] || [];
    }
}
