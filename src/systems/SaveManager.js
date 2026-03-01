/* ============================
   DROPER — Save Manager
   ============================ */

const SAVE_KEY = 'droper_save_v1';
const CHECKSUM_KEY = 'droper_checksum';
const INTEGRITY_SECRET = 'DrP_s3cur!ty_K3y_v080';

export class SaveManager {
    constructor() {
        this.data = {};
    }

    _generateChecksum(jsonStr) {
        // Simple but effective hash: FNV-1a + secret salt
        let hash = 0x811c9dc5;
        const input = INTEGRITY_SECRET + jsonStr + INTEGRITY_SECRET;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193);
        }
        return (hash >>> 0).toString(16).padStart(8, '0');
    }

    loadAll() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            const storedChecksum = localStorage.getItem(CHECKSUM_KEY);
            if (raw) {
                // 🔒 Vérification d'intégrité
                const expectedChecksum = this._generateChecksum(raw);
                if (storedChecksum && storedChecksum !== expectedChecksum) {
                    console.warn('⚠️ ALERTE SÉCURITÉ : Sauvegarde modifiée manuellement détectée ! Reset forcé.');
                    this.data = this.getDefaultSave();
                    this.saveAll();
                    return;
                }
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
            const jsonStr = JSON.stringify(this.data);
            localStorage.setItem(SAVE_KEY, jsonStr);
            // 🔒 Signer les données
            localStorage.setItem(CHECKSUM_KEY, this._generateChecksum(jsonStr));
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
                safe: { upgradesLeft: 5, lastClaim: 0, currentRarity: 1 },
                dailyRewards: {
                    lastClaimDate: null,
                    consecutiveDays: 0,
                    claimedToday: false
                }
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
            favorites: {
                items: [], // Array of item IDs
                skins: {}, // Object: { heroId: [skinIds] }
            },
            customMaps: [], // v0.4.5 — Maps créées par le joueur
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
