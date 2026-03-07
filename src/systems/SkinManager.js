/* ============================
   DROPER — Skin Manager 👕
   ============================ */

import { getSkinsForHero } from '../data/skins.js';
import { getHeroById } from '../data/heroes.js';
import { toast } from '../ui/components/ToastManager.js';

export class SkinManager {
    constructor(saveManager, economyManager) {
        this.save = saveManager;
        this.economy = economyManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('skins') || {
            owned: {},
            equipped: {}, // heroId -> skinId
            equippedAura: null,
            equippedTrail: null,
            equippedClothing: null
        };
        // Migration rétrocompatible
        if (!this.data.equippedAura) this.data.equippedAura = null;
        if (!this.data.equippedTrail) this.data.equippedTrail = null;
        if (!this.data.equippedClothing) this.data.equippedClothing = null;
    }

    persist() {
        this.save.set('skins', this.data);
    }

    isOwned(id) {
        if (id.endsWith('_default')) return true;
        return this.data.owned[id] === true;
    }

    unlock(skinId) {
        if (!this.data.owned[skinId]) {
            this.data.owned[skinId] = true;
            this.persist();
            return true;
        }
        return false;
    }

    getEquippedSkin(heroId) {
        return this.data.equipped[heroId] || heroId + '_default';
    }

    getAllSkinsForHero(heroId) {
        const baseSkins = getSkinsForHero(heroId);
        const customSkins = (this.app.adminManager?.config?.customSkins || []).filter(s => s.heroId === heroId || s.targetHero === heroId);
        return [...baseSkins, ...customSkins];
    }

    equip(heroId, skinId, type = 'skin') {
        if (!this.isOwned(skinId)) {
            toast.error('Cosmétique non possédé !');
            return false;
        }

        if (type === 'skin') {
            const hero = getHeroById(heroId);
            const skins = getSkinsForHero(heroId);
            const skin = skins.find(s => s.id === skinId);

            if (hero && skin) {
                if (skin.rarity.value > hero.rarity.value) {
                    toast.error(`Rareté trop élevée (${skin.rarity.label}) pour ce héros !`);
                    return { success: false, reason: "La rareté du cosmétique dépasse celle du héros." };
                }
            }
            this.data.equipped[heroId] = skinId;
        } else if (type === 'aura') {
            this.data.equippedAura = skinId;
        } else if (type === 'trail') {
            this.data.equippedTrail = skinId;
        } else if (type === 'clothing') {
            this.data.equippedClothing = skinId;
        }

        this.persist();
        toast.success('👕 Cosmétique équipé !');
        return { success: true };
    }

    buy(heroId, skinId, type = 'skin') {
        let cosmeticItem = null;

        if (type === 'skin') {
            const skins = getSkinsForHero(heroId);
            cosmeticItem = skins.find(s => s.id === skinId);
        } else {
            // Check global shop offers for general cosmetics
            const { SHOP_OFFERS } = require('../data/shop.js'); // Assuming dynamic or already imported
            const offer = SHOP_OFFERS.find(o => o.reward?.cosmId === skinId);
            if (offer) {
                cosmeticItem = {
                    id: skinId,
                    price: offer.cost.amount,
                    currency: offer.cost.type,
                    name: offer.name
                };
            }
        }

        if (!cosmeticItem) return false;
        if (this.isOwned(skinId)) {
            toast.info('Déjà possédé !');
            return false;
        }

        if (cosmeticItem.isEvent) {
            if (this.economy.eventTokens < cosmeticItem.eventPrice) {
                toast.error("Pas assez de Jetons d'Événement !");
                return false;
            }
            this.economy.spendEventTokens(cosmeticItem.eventPrice);
        } else {
            const currency = cosmeticItem.currency || 'coins';
            if (currency === 'gems') {
                if (this.economy.gems < cosmeticItem.price) {
                    toast.error('Pas assez de gemmes !');
                    return false;
                }
                this.economy.spendGems(cosmeticItem.price);
            } else {
                if (this.economy.coins < cosmeticItem.price) {
                    toast.error('Pas assez de pièces !');
                    return false;
                }
                this.economy.spendCoins(cosmeticItem.price);
            }
        }

        this.data.owned[skinId] = true;
        this.persist();
        toast.reward(`👕 Cosmétique "${cosmeticItem.name}" acheté !`);
        return true;
    }

    getActiveSkinData(heroId) {
        const equippedId = this.getEquippedSkin(heroId);
        const skins = getSkinsForHero(heroId);
        return skins.find(s => s.id === equippedId) || skins[0];
    }

    getEquippedCosmetics() {
        return {
            aura: this.data.equippedAura,
            trail: this.data.equippedTrail,
            clothing: this.data.equippedClothing
        };
    }
}
