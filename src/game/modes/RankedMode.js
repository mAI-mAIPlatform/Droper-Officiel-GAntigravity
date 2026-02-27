/* ============================
   DROPER — Ranked Mode Logic
   ============================ */

export class RankedMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teamManager = teamManager;
        this.finished = false;
        this.winner = null;
    }

    init() {
        console.log("🏆 Mode Classé initialisé");
    }

    update(dt) {
        // En mode solo classé, le dernier survivant ou le temps définit le gagnant
        const playersAlive = this.engine.entities.filter(e => e.alive);
        if (playersAlive.length === 1) {
            this.finished = true;
            this.winner = playersAlive[0];
            return { finished: true, winner: this.winner };
        }
        return null;
    }

    getWinnerOnTimeout() {
        // Le joueur avec le plus de HP ou de kills? 
        // Par défaut, prenons le joueur si en vie
        if (this.engine.player.alive) return this.engine.player;
        return null;
    }

    draw(ctx) {
        // HUD spécifique au classé si besoin
    }

    getContext() {
        return { type: 'ranked' };
    }
}
