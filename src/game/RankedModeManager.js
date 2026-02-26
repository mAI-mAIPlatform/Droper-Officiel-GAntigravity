/* ============================
   DROPER — Ranked Mode Manager
   ============================ */

export class RankedModeManager {
    constructor(engine, leagueManager) {
        this.engine = engine;
        this.league = leagueManager;
    }

    applyDifficulty(botEntities) {
        const mult = this.league.getBotMultiplier();

        for (const bot of botEntities) {
            bot.hp = Math.floor(bot.hp * mult);
            bot.maxHp = Math.floor(bot.maxHp * mult);
            bot.attack = Math.floor((bot.attack || 10) * mult);
            bot.speed = Math.floor((bot.speed || 100) * (0.9 + mult * 0.15));
            bot.bulletDamage = Math.floor((bot.bulletDamage || 8) * mult);
            bot.bulletSpeed = Math.floor((bot.bulletSpeed || 200) * (0.9 + mult * 0.1));
            bot.shootRate = Math.max(0.4, (bot.shootRate || 1.5) / (0.5 + mult * 0.5));
        }
    }

    onMatchEnd(won) {
        if (won) {
            this.engine.app.recordManager.add('win', 1);
        }
        this.engine.app.recordManager.add('gamePlayed', 1);
        this.league.checkPromotion();
    }

    getDifficultyLabel() {
        const div = this.league.getCurrentDivision();
        return `${div.emoji} ${div.label}`;
    }

    getBotMultiplier() {
        return this.league.getBotMultiplier();
    }
}
