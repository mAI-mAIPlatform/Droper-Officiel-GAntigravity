/* ============================
   DROPER — Club Manager (v0.9.7-beta)
   Grades, Trophées, Chat
   ============================ */

import { getWeeklyQuests } from '../data/clubQuests.js';
import { toast } from '../ui/components/ToastManager.js';

export const CLUB_GRADES = [
    { id: 'president', label: 'Président', emoji: '👑', power: 5 },
    { id: 'vice', label: 'Vice-Président', emoji: '⭐', power: 4 },
    { id: 'officier', label: 'Officier', emoji: '🛡️', power: 3 },
    { id: 'membre', label: 'Membre', emoji: '🎮', power: 2 },
    { id: 'recrue', label: 'Recrue', emoji: '🌱', power: 1 },
];

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

    getGradeInfo(roleId) {
        return CLUB_GRADES.find(g => g.id === roleId) || CLUB_GRADES[3];
    }

    createClub(name, emoji = '🏠') {
        if (this.hasClub) {
            toast.error('Tu es déjà dans un club !');
            return false;
        }
        this.data.myClub = {
            id: 'club_' + Date.now(),
            name,
            emoji,
            members: [{ tag: 'Toi', name: 'Toi', role: 'president', online: true }],
            maxMembers: 30,
            createdAt: new Date().toISOString(),
            questProgress: {},
            trophies: 0,
        };
        // Add bot members
        const botNames = ['NeoBot', 'CyberX', 'DropMaster', 'NightByte', 'PixelK'];
        const roles = ['officier', 'membre', 'membre', 'recrue', 'recrue'];
        for (let i = 0; i < botNames.length; i++) {
            this.data.myClub.members.push({
                tag: '#' + Math.random().toString(36).slice(2, 7).toUpperCase(),
                name: botNames[i],
                role: roles[i],
                online: Math.random() > 0.4,
                trophiesContrib: Math.floor(Math.random() * 100),
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
        this.data.myClub = {
            id: clubId || 'club_joined_' + Date.now(),
            name: 'Droper Legends',
            emoji: '⚔️',
            members: [
                { tag: 'Toi', name: 'Toi', role: 'recrue', online: true, trophiesContrib: 0 },
                { name: 'Alpha', tag: '#A1B2C', role: 'president', online: true, trophiesContrib: 450 },
                { name: 'Beta', tag: '#C3D4E', role: 'vice', online: false, trophiesContrib: 280 },
                { name: 'Gamma', tag: '#F5G6H', role: 'officier', online: true, trophiesContrib: 150 },
                { name: 'Delta', tag: '#H8I9J', role: 'membre', online: false, trophiesContrib: 80 },
            ],
            maxMembers: 30,
            createdAt: '2026-01-15',
            questProgress: {},
            trophies: 960,
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

    // --- Grades ---

    promoteMember(tag, newRole) {
        if (!this.hasClub) return false;
        const me = this.data.myClub.members.find(m => m.tag === 'Toi');
        const myPower = this.getGradeInfo(me?.role).power;
        const target = this.data.myClub.members.find(m => m.tag === tag);
        if (!target) return false;
        const targetPower = this.getGradeInfo(target.role).power;
        const newPower = this.getGradeInfo(newRole).power;
        // Can only promote if you have more power and new role < your power
        if (myPower <= targetPower || newPower >= myPower) {
            toast.error('Tu n\'as pas le pouvoir nécessaire !');
            return false;
        }
        target.role = newRole;
        this.persist();
        const gradeLabel = this.getGradeInfo(newRole).label;
        toast.success(`${target.name} est maintenant ${gradeLabel} !`);
        return true;
    }

    kickMember(tag) {
        if (!this.hasClub) return false;
        const me = this.data.myClub.members.find(m => m.tag === 'Toi');
        const myPower = this.getGradeInfo(me?.role).power;
        const target = this.data.myClub.members.find(m => m.tag === tag);
        if (!target || target.tag === 'Toi') return false;
        const targetPower = this.getGradeInfo(target.role).power;
        if (myPower <= targetPower) {
            toast.error('Tu ne peux pas expulser quelqu\'un de rang supérieur !');
            return false;
        }
        this.data.myClub.members = this.data.myClub.members.filter(m => m.tag !== tag);
        this.persist();
        toast.info(`${target.name} a été expulsé du club.`);
        return true;
    }

    // --- Trophées Ranked ---

    addRankedTrophies(amount) {
        if (!this.hasClub || amount <= 0) return;
        this.data.myClub.trophies += amount;
        // Track personal contribution
        const me = this.data.myClub.members.find(m => m.tag === 'Toi');
        if (me) {
            me.trophiesContrib = (me.trophiesContrib || 0) + amount;
        }
        this.persist();
        toast.reward(`🏆 +${amount} trophées pour le club !`);
    }

    // --- Quêtes ---

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

    // --- Chat ---

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

        // Bot auto-response (30% chance)
        if (Math.random() < 0.3) {
            const bots = this.data.myClub.members.filter(m => m.tag !== 'Toi' && m.online);
            if (bots.length > 0) {
                const bot = bots[Math.floor(Math.random() * bots.length)];
                const responses = ['GG !', '🔥🔥🔥', 'On joue ?', 'Bien joué !', '💪', 'Qui est dispo ?', 'Let\'s go !', '😂'];
                setTimeout(() => {
                    this.data.clubChat.push({
                        sender: bot.name,
                        text: responses[Math.floor(Math.random() * responses.length)],
                        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    });
                    if (this.data.clubChat.length > 50) this.data.clubChat.shift();
                    this.persist();
                }, 1000 + Math.random() * 3000);
            }
        }
    }
}

