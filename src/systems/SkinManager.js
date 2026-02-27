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
        this.data = this.save.get('skins') || { owned: {}, equipped: {} };
    }

    persist() {
        this.save.set('skins', this.data);
    }

    isOwned(heroId, skinId) {
        if (skinId.endsWith('_default')) return true;
        return this.data.owned[skinId] === true;
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

    equip(heroId, skinId) {
        if (!this.isOwned(heroId, skinId)) {
            toast.error('Skin non possédé !');
            return false;
        }

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
        this.persist();
        toast.success('👕 Skin équipé !');
        return { success: true };
    }

    buy(heroId, skinId) {
        const skins = getSkinsForHero(heroId);
        const skin = skins.find(s => s.id === skinId);
        if (!skin) return false;
        if (this.isOwned(heroId, skinId)) {
            toast.info('Déjà possédé !');
            return false;
        }

        if (skin.isEvent) {
            if (this.economy.eventTokens < skin.eventPrice) {
                toast.error("Pas assez de Jetons d'Événement !");
                return false;
            }
            this.economy.spendEventTokens(skin.eventPrice);
        } else {
            if (this.economy.coins < skin.price) {
                toast.error('Pas assez de pièces !');
                return false;
            }
            this.economy.spendCoins(skin.price);
        }

        this.data.owned[skinId] = true;
        this.persist();
        toast.reward(`👕 Skin "${skin.name}" acheté !`);
        return true;
    }

    getActiveSkinData(heroId) {
        const equippedId = this.getEquippedSkin(heroId);
        const skins = getSkinsForHero(heroId);
        return skins.find(s => s.id === equippedId) || skins[0];
    }
}
