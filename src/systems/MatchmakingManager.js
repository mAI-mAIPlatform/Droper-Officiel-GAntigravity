/* ============================
   DROPER — Matchmaking Manager (v0.9.7-beta)
   SBMM basé sur les statistiques
   ============================ */

export class MatchmakingManager {
    constructor(matchHistoryManager) {
        this.history = matchHistoryManager;
        this.skillRating = 1000; // Elo-like starting rating
    }

    /**
     * Calcule le Skill Rating basé sur l'historique du joueur
     */
    computeSkillRating() {
        const stats = this.history?.computeStats?.() || {};
        const gamesPlayed = stats.totalGames || 0;

        if (gamesPlayed < 3) {
            // Pas assez de données, rating par défaut (facile)
            this.skillRating = 800;
            return this.skillRating;
        }

        const winRate = stats.winRate || 0;       // 0-100
        const avgKills = stats.avgKills || 0;
        const kda = stats.kda || 1.0;
        const maxWave = stats.maxWave || 1;

        // Formule SBMM simple :
        // Base 1000 + bonus winrate + bonus KDA + bonus kills + bonus vagues
        let rating = 1000;
        rating += (winRate - 50) * 5;              // +/-250 max
        rating += Math.min(kda * 30, 200);         // KDA bonus (cap 200)
        rating += Math.min(avgKills * 5, 150);     // Kills bonus (cap 150)
        rating += Math.min(maxWave * 2, 100);      // Wave bonus (cap 100)

        // Clamp to valid range
        this.skillRating = Math.max(400, Math.min(2000, Math.round(rating)));
        return this.skillRating;
    }

    /**
     * Retourne un multiplicateur de difficulté pour les bots
     * @returns {Object} { hpMult, attackMult, speedMult, shootRateMult }
     */
    getDifficultyMultiplier() {
        const rating = this.computeSkillRating();

        if (rating < 600) {
            // Débutant - bots faciles
            return { hpMult: 0.6, attackMult: 0.5, speedMult: 0.7, shootRateMult: 1.5, label: '🟢 DÉBUTANT' };
        } else if (rating < 900) {
            // Intermédiaire
            return { hpMult: 0.8, attackMult: 0.75, speedMult: 0.85, shootRateMult: 1.2, label: '🟡 INTERMÉDIAIRE' };
        } else if (rating < 1200) {
            // Confirmé
            return { hpMult: 1.0, attackMult: 1.0, speedMult: 1.0, shootRateMult: 1.0, label: '🟠 CONFIRMÉ' };
        } else if (rating < 1500) {
            // Expert
            return { hpMult: 1.3, attackMult: 1.2, speedMult: 1.15, shootRateMult: 0.8, label: '🔴 EXPERT' };
        } else {
            // Légende
            return { hpMult: 1.6, attackMult: 1.5, speedMult: 1.3, shootRateMult: 0.6, label: '💎 LÉGENDE' };
        }
    }

    /**
     * Retourne le badge du skill rating
     */
    getSkillBadge() {
        const rating = this.computeSkillRating();
        if (rating < 600) return { label: 'Bronze', emoji: '🥉', color: '#cd7f32' };
        if (rating < 900) return { label: 'Argent', emoji: '🥈', color: '#c0c0c0' };
        if (rating < 1200) return { label: 'Or', emoji: '🥇', color: '#fbbf24' };
        if (rating < 1500) return { label: 'Platine', emoji: '💎', color: '#06b6d4' };
        return { label: 'Champion', emoji: '👑', color: '#a855f7' };
    }
}
