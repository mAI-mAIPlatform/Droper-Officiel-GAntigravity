/* ============================
   DROPER — Admin Manager 🛠️
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class AdminManager {
    constructor(app) {
        this.app = app;
        this.isAuthenticated = false;

        // Sécurisation v0.3.0
        this.adminLogin = 'Mths_Tss';
        this.adminPassword = 'MthsTss2012!';
        this.adminVerifyCode = '2526';

        this.config = null;
        this.loadConfig();
    }

    loadConfig() {
        this.config = this.app.saveManager.get('admin_config') || {
            specialOffers: [],
            prices: {
                droperPass: 100,
                eveilPass: 50,
                starters: {
                    common: 10000,
                    rare: 25000,
                    epic: 50000,
                    legendary: 100000
                }
            },
            timedDiscounts: {}, // { passId: { percent: 20, end: timestamp } }
            gamespeed: 1.0,
            infiniteAmmo: false,
            godMode: false,
            doubleXP: false,
            gravity: 1.0,
            freezeEnemies: false,
            playerSpeedBoost: 1.0,
            nightMode: false,
            partyMode: false,
            doubleFireRate: false, // [NEW] v0.2.6
            doubleHP: false,       // [NEW] v0.2.6
            smallPlayer: false,    // [NEW] v0.2.6
            customNews: [], // Admin created news
            customHeroes: [], // [NEW] v0.2.6
            customSkins: []   // [NEW] v0.2.6
        };
    }

    saveConfig() {
        this.app.saveManager.set('admin_config', this.config);
    }

    authenticate(login, password, code) {
        if (login === this.adminLogin && password === this.adminPassword && code === this.adminVerifyCode) {
            this.isAuthenticated = true;
            toast.success('🛡️ Accès Administrateur accordé');
            return true;
        } else {
            toast.error('❌ Identifiants invalides ou code incorrect');
            return false;
        }
    }

    logout() {
        this.isAuthenticated = false;
        toast.info('Déconnexion de la console');
    }

    // Actions Admin
    addCoins(amount) {
        if (!this.isAuthenticated) return;
        this.app.economyManager.addCoins(amount);
        toast.reward(`💰 ${amount} pièces ajoutées !`);
    }

    unlockHero(heroId) {
        if (!this.isAuthenticated) return;
        this.app.heroManager.unlock(heroId);
        toast.success(`🦸 Héros ${heroId} débloqué !`);
    }

    giveItem(type, itemId) {
        if (!this.isAuthenticated) return;
        // Simuler l'ajout d'objets dans l'inventaire
        if (type === 'skin') {
            // Logique pour débloquer un skin spécifique
            this.app.skinManager.data.owned[itemId] = true;
            this.app.skinManager.persist();
            toast.success(`👕 Skin ${itemId} ajouté !`);
        } else if (type === 'emote') {
            if (!this.app.emoteManager.data.owned.includes(itemId)) {
                this.app.emoteManager.data.owned.push(itemId);
                this.app.emoteManager.persist();
                toast.success(`😎 Emote ${itemId} ajoutée !`);
            }
        }
    }

    setPrice(passId, newPrice) {
        if (!this.isAuthenticated) return;
        if (this.config.prices[passId] !== undefined) {
            this.config.prices[passId] = newPrice;
        } else if (this.config.prices.starters[passId] !== undefined) {
            this.config.prices.starters[passId] = newPrice;
        }
        this.saveConfig();
        toast.info(`Prix de ${passId} mis à jour : ${newPrice}`);
    }

    setGlobalReduction(percent) {
        if (!this.isAuthenticated) return;
        this.config.globalReduction = Math.max(0, Math.min(100, percent));
        this.saveConfig();
        toast.info(`Réduction globale : ${this.config.globalReduction}%`);
    }

    addSpecialOffer(offer) {
        if (!this.isAuthenticated) return;
        this.config.specialOffers.push({
            id: 'custom_' + Date.now(),
            ...offer,
            claimed: false,
            expires: offer.duration ? Date.now() + offer.duration : null
        });
        this.saveConfig();
        toast.success('🎁 Nouvel article créé dans la boutique !');
    }

    giveStarter(rarity) {
        if (!this.isAuthenticated) return;
        const starterId = `starter_${rarity}`;
        // On simule l'obtention immédiate via claimedOffers
        const claimed = this.app.saveManager.get('claimedOffers') || [];
        if (!claimed.includes(starterId)) {
            claimed.push(starterId);
            this.app.saveManager.set('claimedOffers', claimed);
            // On donne les récompenses (coins/gems)
            const rewards = {
                common: { coins: 100, gems: 5 },
                rare: { coins: 300, gems: 20 },
                epic: { coins: 1000, gems: 50 },
                legendary: { coins: 5000, gems: 200 }
            }[rarity];
            if (rewards) {
                this.app.economyManager.addCoins(rewards.coins);
                this.app.economyManager.addGems(rewards.gems);
            }
            toast.reward(`🛡️ Starter ${rarity} offert !`);
            this.app.saveManager.saveAll(); // Force save after giving items
        } else {
            toast.info('Starter déjà possédé.');
        }
    }

    deleteSpecialOffer(offerId) {
        if (!this.isAuthenticated) return;
        this.config.specialOffers = this.config.specialOffers.filter(o => o.id !== offerId);
        this.saveConfig();
        toast.info('Offre supprimée avec succès.');
    }

    forceSave() {
        if (!this.isAuthenticated) return;
        this.saveConfig();
        this.app.saveManager.saveAll();
        toast.info('💾 Sauvegarde forcée effectuée.');
    }

    setTimedDiscount(passId, percent, durationMinutes) {
        if (!this.isAuthenticated) return;
        this.config.timedDiscounts[passId] = {
            percent: Math.max(0, Math.min(100, percent)),
            end: Date.now() + (durationMinutes * 60 * 1000)
        };
        this.saveConfig();
        toast.success(`⏱️ Réduction de ${percent}% activée pour ${passId} !`);
    }

    getEffectivePrice(id, basePrice) {
        // Vérifier réduction temporaire
        const timed = this.config.timedDiscounts[id];
        let reduction = this.config.globalReduction;

        if (timed && timed.end > Date.now()) {
            reduction = Math.max(reduction, timed.percent);
        }

        if (reduction > 0) {
            return Math.ceil(basePrice * (1 - reduction / 100));
        }
        return basePrice;
    }

    setGamespeed(speed) {
        if (!this.isAuthenticated) return;
        this.config.gamespeed = Math.max(0.1, Math.min(5, speed));
        this.saveConfig();
        toast.info(`⚡ Vitesse du jeu réglée à x${this.config.gamespeed}`);
    }

    setAdminFlag(flag, value) {
        if (!this.isAuthenticated) return;
        this.config[flag] = value;
        this.saveConfig();
        toast.info(`🔧 ${flag} : ${value ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
    }

    setGravity(val) {
        if (!this.isAuthenticated) return;
        this.config.gravity = parseFloat(val);
        this.saveConfig();
        toast.info(`🪐 Gravité : x${this.config.gravity}`);
    }

    createNewsArticle(data) {
        if (!this.isAuthenticated) return;
        const article = {
            id: 'admin_news_' + Date.now(),
            date: new Date().toLocaleDateString('fr-FR'),
            ...data,
            type: data.type || 'update',
            content: Array.isArray(data.content) ? data.content : [data.content]
        };
        this.config.customNews.unshift(article);
        this.saveConfig();
        toast.success(`📰 Article "${data.title}" publié !`);
    }

    spawnMegaDrop() {
        if (!this.isAuthenticated) return;
        // Déclencher un flag pour le moteur au prochain update
        this.config.triggerMegaDrop = true;
        this.saveConfig();
        toast.success('📦 Mega-Drop en approche !');
    }

    clearMap() {
        if (!this.isAuthenticated) return;
        this.config.triggerMapClear = true;
        this.saveConfig();
        toast.warning('💥 Nettoyage de la map déclenché !');
    }

    clearSpecialOffers() {
        if (!this.isAuthenticated) return;
        this.config.specialOffers = [];
        this.saveConfig();
        toast.info('Articles personnalisés vidés.');
    }

    createCustomHero(heroData) {
        if (!this.isAuthenticated) return;
        const newHero = {
            id: 'custom_hero_' + Date.now(),
            ...heroData,
            custom: true
        };
        this.config.customHeroes.push(newHero);
        this.saveConfig();
        toast.success(`🦸 Héros ${heroData.name} créé avec succès !`);
        return newHero;
    }

    createCustomSkin(skinData) {
        if (!this.isAuthenticated) return;
        const newSkin = {
            id: 'custom_skin_' + Date.now(),
            ...skinData,
            custom: true
        };
        this.config.customSkins.push(newSkin);
        this.saveConfig();
        toast.success(`👕 Skin ${skinData.name} créé avec succès !`);
        return newSkin;
    }
}
