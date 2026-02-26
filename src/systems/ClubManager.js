/* ============================
   DROPER — Club Manager
   ============================ */

import { getWeeklyQuests } from '../data/clubQuests.js';
import { toast } from '../ui/components/ToastManager.js';

export class ClubManager {
    constructor(saveManager, chatManager) {
        this.save = saveManager;
        this.chat = chatManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('club') || this.getDefault();
    }

    persist() {
        this.save.set('club', this.data);
    }

    getDefault() {
        return {
            myClub: null,
            clubChat: [],
        };
    }

    get hasClub() { return this.data.myClub !== null; }
    get club() { return this.data.myClub; }

    createClub(name, emoji = '🏠') {
        if (this.hasClub) {
            toast.error('Tu es déjà dans un club !');
            return false;
        }
        this.data.myClub = {
            id: 'club_' + Date.now(),
            name,
            emoji,
            members: [{ tag: 'Toi', role: 'Président', online: true }],
            maxMembers: 30,
            createdAt: new Date().toISOString(),
            questProgress: {},
            trophies: 0,
        };
        // Add bot members
        const botNames = ['NeoBot', 'CyberX', 'DropMaster', 'NightByte', 'PixelK'];
        for (const bn of botNames) {
            this.data.myClub.members.push({
                tag: '#' + Math.random().toString(36).slice(2, 7).toUpperCase(),
                name: bn,
                role: 'Membre',
                online: Math.random() > 0.4,
            });
        }
        this.persist();
        toast.success(`🏠 Club "${name}" créé !`);
        return true;
    }

    joinClub(clubId) {
        if (this.hasClub) {
            toast.error('Quitte ton club actuel d\'abord !');
            return false;
        }
        // Simulated club join
        this.data.myClub = {
            id: clubId || 'club_joined_' + Date.now(),
            name: 'Droper Legends',
            emoji: '⚔️',
            members: [
                { tag: 'Toi', role: 'Membre', online: true },
                { name: 'Alpha', tag: '#A1B2C', role: 'Président', online: true },
                { name: 'Beta', tag: '#C3D4E', role: 'Vice-Président', online: false },
                { name: 'Gamma', tag: '#F5G6H', role: 'Membre', online: true },
            ],
            maxMembers: 30,
            createdAt: '2026-01-15',
            questProgress: {},
            trophies: 250,
        };
        this.persist();
        toast.success('✅ Tu as rejoint le club !');
        return true;
    }

    leaveClub() {
        if (!this.hasClub) return;
        const name = this.data.myClub.name;
        this.data.myClub = null;
        this.data.clubChat = [];
        this.persist();
        toast.info(`👋 Tu as quitté "${name}"`);
    }

    getWeeklyQuests() {
        return getWeeklyQuests().map(q => ({
            ...q,
            progress: this.data.myClub?.questProgress?.[q.id] || 0,
            completed: (this.data.myClub?.questProgress?.[q.id] || 0) >= q.target,
        }));
    }

    addQuestProgress(questType, amount = 1) {
        if (!this.hasClub) return;
        const quests = getWeeklyQuests();
        for (const q of quests) {
            if (q.type === questType) {
                if (!this.data.myClub.questProgress) this.data.myClub.questProgress = {};
                const prev = this.data.myClub.questProgress[q.id] || 0;
                this.data.myClub.questProgress[q.id] = prev + amount;
                if (prev < q.target && prev + amount >= q.target) {
                    toast.reward(`${q.emoji} Quête de club terminée : ${q.name} !`);
                }
            }
        }
        this.persist();
    }

    sendMessage(text) {
        if (!this.hasClub || !text.trim()) return;
        this.data.clubChat.push({
            sender: 'Toi',
            text: text.trim(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        });
        if (this.data.clubChat.length > 50) this.data.clubChat.shift();
        this.persist();

        // Notify WebSocket if available
        if (this.chat) {
            this.chat.sendClubMessage(this.data.myClub.id, text.trim());
        }
    }
}
