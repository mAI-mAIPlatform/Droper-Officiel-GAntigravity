/* ============================
   DROPER — Save Manager
   ============================ */

const SAVE_KEY = 'droper_save_v1';

export class SaveManager {
    constructor() {
        this.data = {};
    }

    loadAll() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (raw) {
                this.data = JSON.parse(raw);
            } else {
                this.data = this.getDefaultSave();
                this.saveAll();
            }
        } catch (e) {
            console.warn('⚠️ Erreur de chargement de sauvegarde, reset.', e);
            this.data = this.getDefaultSave();
            this.saveAll();
        }
    }

    saveAll() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('❌ Erreur de sauvegarde', e);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.saveAll();
    }

    getDefaultSave() {
        const tag = this.generateTag();
        return {
            player: {
                username: 'Joueur',
                tag: tag,
                bio: '',
                level: 1,
                xp: 0,
                xpToNext: 100,
                selectedHero: 'soldier',
                selectedPet: null,
                avatarEmoji: '👤',
                createdAt: Date.now(),
            },
            economy: {
                coins: 0,
                gems: 0,
            },
            heroes: {
                soldier: { unlocked: true, level: 1, xp: 0 },
                drone: { unlocked: true, level: 1, xp: 0 },
                tank: { unlocked: false, level: 1, xp: 0 },
                sniper: { unlocked: false, level: 1, xp: 0 },
                phantom: { unlocked: false, level: 1, xp: 0 },
                titan: { unlocked: false, level: 1, xp: 0 },
            },
            stats: {
                kills: 0,
                maxWave: 0,
                gamesPlayed: 0,
                victories: 0,
                totalXp: 0,
                trophies: 0,
            },
            quests: {
                daily: [],
                weekly: [],
                lastDailyReset: null,
                lastWeeklyReset: null,
            },
            shop: {
                claimedOffers: [],
                lastFreeGemsClaim: null,
                safe: { upgradesLeft: 5, lastClaim: 0, currentRarity: 1 }
            },
            seasonPass: {
                seasonId: 'season_1',
                xp: 0,
                tier: 0,
                premium: false,
                claimedFree: [],
                claimedPremium: [],
                eveil: {
                    tokens: 0,
                    claimedTiers: [],
                },
            },
            inventory: {
                items: {},
            },
            claimedOffers: [],
            records: {
                total: 0,
                claimedMilestones: [],
            },
            league: {
                claimedPromotions: [],
            },
            club: null,
            friends: {
                list: [],
                pending: [],
                chats: {},
            },
            skins: {
                owned: {},
                equipped: {},
            },
            emotes: null,
            matchHistory: [],
        };
    }

    generateTag() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let tag = '#';
        for (let i = 0; i < 5; i++) {
            tag += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return tag;
    }

    resetAll() {
        this.data = this.getDefaultSave();
        this.saveAll();
        console.log('🔄 Sauvegarde réinitialisée.');
    }

    exportAll() {
        return JSON.stringify(this.data);
    }

    importAll(jsonStr) {
        const parsed = JSON.parse(jsonStr);
        this.data = parsed;
        this.saveAll();
    }

    reset() {
        this.resetAll();
    }
}
