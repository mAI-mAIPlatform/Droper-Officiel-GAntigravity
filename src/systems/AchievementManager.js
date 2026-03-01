import { toast } from '../components/ToastManager.js';

export const ACHIEVEMENTS = [
    { id: 'first_blood', title: 'First Blood', description: 'Faire son premier kill', icon: '🩸' },
    { id: 'serial_killer', title: 'Tueur en Série', description: 'Atteindre un combo x5', icon: '🔥' },
    { id: 'survivor', title: 'Survivant', description: 'Survivre 3 minutes dans une partie', icon: '⏱️' },
    { id: 'marathon', title: 'Marathonien', description: 'Parcourir une longue distance', icon: '🏃' },
    { id: 'untouchable', title: 'Intouchable', description: 'Gagner une partie sans prendre de dégâts', icon: '🛡️' },
    { id: 'lave_master', title: 'Maître de la Lave', description: 'Gagner 5 parties en Lave Flash', icon: '🌋' },
    { id: 'city_hunter', title: 'Chasseur Urbain', description: 'Faire 50 kills en Kill Life', icon: '🏙️' }
];

export class AchievementManager {
    constructor(app) {
        this.app = app;
        this.unlocked = this.loadUnlocked();
        this.stats = this.loadStats();
    }

    loadUnlocked() {
        try {
            const data = localStorage.getItem('droper_achievements');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    loadStats() {
        try {
            const data = localStorage.getItem('droper_achiev_stats');
            return data ? JSON.parse(data) : { totalKills: 0, laveWins: 0, distance: 0 };
        } catch (e) {
            return { totalKills: 0, laveWins: 0, distance: 0 };
        }
    }

    save() {
        localStorage.setItem('droper_achievements', JSON.parse(JSON.stringify(this.unlocked)));
        localStorage.setItem('droper_achiev_stats', JSON.parse(JSON.stringify(this.stats)));
    }

    unlock(id) {
        if (!this.unlocked.includes(id)) {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            if (ach) {
                this.unlocked.push(id);
                this.save();
                toast.success(`🏆 Succès Débloqué : ${ach.title}`, ach.description);
            }
        }
    }

    // --- Hooks ---
    onKill() {
        this.unlock('first_blood');
        this.stats.totalKills++;
        if (this.stats.totalKills >= 50) this.unlock('city_hunter');
        this.save();
    }

    onCombo(combo) {
        if (combo >= 5) this.unlock('serial_killer');
    }

    onMatchEnd(modeId, timeAlive, damageTaken, isWinner) {
        if (timeAlive >= 180) this.unlock('survivor');
        if (isWinner && damageTaken === 0) this.unlock('untouchable');

        if (modeId === 'lave_flash' && isWinner) {
            this.stats.laveWins++;
            if (this.stats.laveWins >= 5) this.unlock('lave_master');
        }
        this.save();
    }

    onMove(dist) {
        this.stats.distance += dist;
        if (this.stats.distance > 50000) this.unlock('marathon'); // Arbitrary goal
    }
}
