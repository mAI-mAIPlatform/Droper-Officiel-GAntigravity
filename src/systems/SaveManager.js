/* ============================
   DROPER — Save Manager (v1.0.0)
   + DatabaseAdapter pour migration future
   ============================ */

const SAVE_KEY = 'droper_save_v1';
const CHECKSUM_KEY = 'droper_checksum';
// Obfuscated Integrity Secret to prevent easy scraping
const INTEGRITY_SECRET = atob('RHJQX3MzY3VyIXR5X0szeV92MDgw'); // Base64 for 'DrP_s3cur!ty_K3y_v080'

/**
 * Abstraction DB — Facilite la migration localStorage → Firebase/Supabase
 */
class DatabaseAdapter {
    constructor(type = 'local') {
        this.type = type; // 'local' | 'firebase' | 'supabase'
        this.syncStatus = 'idle'; // idle | syncing | synced | error
        this.lastSyncTime = null;
    }

    async read(key) {
        if (this.type === 'local') {
            return localStorage.getItem(key);
        }
        // Future: return await firebase.firestore().doc(`saves/${userId}`).get();
        return localStorage.getItem(key);
    }

    async write(key, value) {
        if (this.type === 'local') {
            localStorage.setItem(key, value);
            return;
        }
        // Future: await firebase.firestore().doc(`saves/${userId}`).set(JSON.parse(value));
        localStorage.setItem(key, value);
    }

    async remove(key) {
        localStorage.removeItem(key);
    }

    async syncToCloud(fullData) {
        if (!window.db) {
            // Pas de Firebase configuré, fallback local
            this.syncStatus = 'synced';
            this.lastSyncTime = Date.now();
            return;
        }
        try {
            this.syncStatus = 'syncing';
            const { doc, setDoc } = window.firebase;

            // On utilise le tag du joueur combiné à une info persistante (ID unique généré) pour éviter l'IDOR (Insecure Direct Object Reference)
            let uniqueDeviceId = localStorage.getItem('droper_device_id');
            if (!uniqueDeviceId) {
                uniqueDeviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
                localStorage.setItem('droper_device_id', uniqueDeviceId);
            }

            // L'ID du document est une combinaison du tag et du device id
            const userId = fullData?.player?.tag?.replace('#', '') + '-' + uniqueDeviceId || 'anonymous-' + uniqueDeviceId;

            await setDoc(doc(window.db, "saves", userId), fullData);

            // Mise à jour spécifique pour le Leaderboard (plus léger)
            if (fullData.player && fullData.stats) {
                await setDoc(doc(window.db, "leaderboard", userId), {
                    username: fullData.player.username,
                    tag: fullData.player.tag,
                    kills: fullData.stats.kills || 0,
                    score: fullData.stats.maxWave || 0,
                    avatar: fullData.player.avatarEmoji,
                    updatedAt: Date.now()
                });
            }

            this.syncStatus = 'synced';
            this.lastSyncTime = Date.now();
        } catch (e) {
            this.syncStatus = 'error';
            console.error('❌ Sync cloud échouée', e);
        }
    }

    async getLeaderboard() {
        if (!window.db) {
            // Fallback (mocks)
            return [
                { username: 'ProGamer', kills: 15420, score: 85, avatar: '🔥' },
                { username: 'ShadowNinja', kills: 12300, score: 72, avatar: '🥷' },
                { username: 'JoueurLocal', kills: 50, score: 10, avatar: '👤' } // Simulation
            ];
        }

        try {
            const { collection, query, orderBy, limit, getDocs } = window.firebase;
            const q = query(collection(window.db, "leaderboard"), orderBy("kills", "desc"), limit(100));
            const querySnapshot = await getDocs(q);
            const leaders = [];
            querySnapshot.forEach((doc) => {
                leaders.push(doc.data());
            });
            return leaders;
        } catch (e) {
            console.error("Erreur chargement Leaderboard", e);
            return [];
        }
    }

    getSyncBadge() {
        const badges = {
            idle: { label: '⏸ Idle', color: '#8b95a8' },
            syncing: { label: '🔄 Sync...', color: '#fbbf24' },
            synced: { label: '☁️ Synchronisé', color: '#22c55e' },
            error: { label: '❌ Erreur', color: '#ef4444' },
        };
        return badges[this.syncStatus] || badges.idle;
    }
}

export class SaveManager {
    constructor() {
        this.data = {};
        this.db = new DatabaseAdapter('local');
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

            // 🔥 Sync vers Firebase
            this.db.syncToCloud(this.data);

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
                owned: ['soldier_default', 'drone_default'],
                equipped: { soldier: 'soldier_default', drone: 'drone_default' },
            },
            emotes: {
                owned: ['emoji_gg', 'emoji_ok'],
                equipped: ['emoji_gg', 'emoji_ok', null, null, null],
            },
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
