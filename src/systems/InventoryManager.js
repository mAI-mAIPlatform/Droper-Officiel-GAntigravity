/* ============================
   DROPER — Inventory Manager
   ============================ */

import { getItemById } from '../data/inventory.js';
import { toast } from '../ui/components/ToastManager.js';
import { rollSafeRarity, rollSafeLoot } from '../data/safeLoot.js';

export class InventoryManager {
    constructor(saveManager, economyManager) {
        this.save = saveManager;
        this.economy = economyManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('inventory') || { items: {} };
    }

    persist() {
        this.save.set('inventory', this.data);
    }

    addItem(itemId, amount = 1) {
        if (!this.data.items[itemId]) {
            this.data.items[itemId] = 0;
        }
        this.data.items[itemId] += amount;
        this.persist();

        const item = getItemById(itemId);
        if (item) {
            toast.reward(`+${amount} ${item.emoji} ${item.name}`);
        }
    }

    removeItem(itemId, amount = 1) {
        if (!this.data.items[itemId] || this.data.items[itemId] < amount) return false;
        this.data.items[itemId] -= amount;
        if (this.data.items[itemId] <= 0) delete this.data.items[itemId];
        this.persist();
        return true;
    }

    hasItem(itemId, amount = 1) {
        return (this.data.items[itemId] || 0) >= amount;
    }

    getCount(itemId) {
        return this.data.items[itemId] || 0;
    }

    getAllItems() {
        const result = [];
        for (const [itemId, count] of Object.entries(this.data.items)) {
            if (count > 0) {
                const item = getItemById(itemId);
                if (item) {
                    result.push({ ...item, count });
                }
            }
        }
        return result;
    }

    getRecentDrops(limit = 5) {
        // Retourne les items avec le plus grand count (proxy pour "récents")
        return this.getAllItems()
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    openCrate(crateId) {
        const crate = getItemById(crateId);
        if (!crate || crate.category !== 'crate') {
            toast.error('❌ Cet item n\'est pas une caisse.');
            return null;
        }

        if (!this.hasItem(crateId)) {
            toast.error('❌ Tu n\'as pas cette caisse.');
            return null;
        }

        // Check if special crate needs a key
        if (crateId === 'crate_epic' && !this.hasItem('key_gold')) {
            toast.lock('🔑 Tu as besoin d\'une Clé Dorée.');
            return null;
        }
        if (crateId === 'crate_season' && !this.hasItem('key_season')) {
            toast.lock('🗝️ Tu as besoin d\'une Clé Saisonnière.');
            return null;
        }

        // Consume crate (and key if needed)
        this.removeItem(crateId);
        if (crateId === 'crate_epic') this.removeItem('key_gold');
        if (crateId === 'crate_season') this.removeItem('key_season');

        // Roll loot
        let rewards = [];
        if (crateId === 'crate_safe') {
            const rarity = rollSafeRarity();
            rewards = [rollSafeLoot(rarity, this.app.skinManager, this.app.emoteManager)];
            rewards.safeRarity = rarity;
        } else {
            rewards = this.rollLoot(crate.loot);
        }

        // Apply rewards
        for (const r of rewards) {
            if (r.type === 'coins') {
                this.economy.addCoins(r.amount);
            } else if (r.type === 'gems') {
                this.economy.addGems(r.amount);
            } else if (r.type === 'item') {
                this.addItem(r.itemId, r.amount);
            } else if (r.type === 'skin') {
                if (this.app.skinManager) {
                    this.app.skinManager.unlock(r.skinId);
                    toast.reward(`👕 Skin débloqué : ${r.name} !`);
                }
            } else if (r.type === 'emote') {
                if (this.app.emoteManager) {
                    this.app.emoteManager.unlock(r.emoteId);
                    toast.reward(`💬 Emote débloquée : ${r.emoji} ${r.name} !`);
                }
            }
        }

        toast.success(`📦 ${crate.name} ouverte !`);
        return rewards;
    }

    rollLoot(lootTable) {
        const totalWeight = lootTable.reduce((sum, l) => sum + l.weight, 0);
        const results = [];

        // Roll 2-3 rewards per crate
        const rollCount = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < rollCount; i++) {
            let roll = Math.random() * totalWeight;
            for (const entry of lootTable) {
                roll -= entry.weight;
                if (roll <= 0) {
                    const amount = entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));
                    results.push({
                        type: entry.type,
                        amount,
                        itemId: entry.itemId || null,
                    });
                    break;
                }
            }
        }

        return results;
    }
}
