/* ============================
   DROPER — Player Manager
   ============================ */

export class PlayerManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
    }

    load() {
        this.data = this.save.get('player') || {
            username: 'Joueur',
            level: 1,
            xp: 0,
            xpToNext: 100,
            reputation: 100,
            rankPoints: 0,
            rank: 'Bronze I',
            selectedHero: 'soldier'
        };
    }

    persist() {
        this.save.set('player', this.data);
    }

    get username() { return this.data.username; }
    get tag() { return this.data.tag; }
    get bio() { return this.data.bio; }
    get level() { return this.data.level; }
    get xp() { return this.data.xp; }
    get xpToNext() { return this.data.xpToNext; }
    get selectedHero() { return this.data.selectedHero; }
    get avatarEmoji() { return this.data.avatarEmoji; }

    setUsername(name) {
        this.data.username = name.slice(0, 20);
        this.persist();
    }

    setBio(bio) {
        this.data.bio = bio.slice(0, 100);
        this.persist();
    }

    addXp(amount) {
        this.data.xp += amount;
        this.data.totalXp = (this.data.totalXp || 0) + amount;

        // Level-up check
        while (this.data.xp >= this.data.xpToNext) {
            this.data.xp -= this.data.xpToNext;
            this.data.level += 1;
            this.data.xpToNext = this.calculateXpToNext(this.data.level);
            console.log(`🎉 Niveau ${this.data.level} atteint !`);
        }

        this.persist();
        return this.data.level;
    }

    calculateXpToNext(level) {
        return Math.floor(100 * Math.pow(1.15, level - 1));
    }

    selectHero(heroId) {
        this.data.selectedHero = heroId;
        this.persist();
    }

    getStats() {
        return this.save.get('stats') || {};
    }

    updateStat(key, value) {
        const stats = this.save.get('stats') || {};
        stats[key] = value;
        this.save.set('stats', stats);
    }

    incrementStat(key, amount = 1) {
        const stats = this.save.get('stats') || {};
        stats[key] = (stats[key] || 0) + amount;
        this.save.set('stats', stats);
    }
}
