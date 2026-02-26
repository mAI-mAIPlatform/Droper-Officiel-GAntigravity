/* ============================
   DROPER — Team Manager
   ============================ */

export class TeamManager {
    constructor(mode) {
        this.mode = mode;
        this.teams = [];
    }

    setup(playerEntity, botEntities) {
        const teamSize = this.mode.teamSize;
        const teamCount = this.mode.teams;

        this.teams = [];
        const colors = ['#4a9eff', '#ef4444', '#22c55e', '#f59e0b', '#a855f7',
            '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

        if (this.mode.type === 'solo') {
            // Solo: each entity is its own team
            this.teams.push({ id: 0, color: colors[0], members: [playerEntity], score: 0, label: 'Joueur' });
            botEntities.forEach((bot, i) => {
                this.teams.push({ id: i + 1, color: colors[(i + 1) % colors.length], members: [bot], score: 0, label: `Bot ${i + 1}` });
            });
        } else {
            // Team mode
            const team1 = { id: 0, color: colors[0], members: [playerEntity], score: 0, label: 'Équipe Bleue' };
            const team2 = { id: 1, color: colors[1], members: [], score: 0, label: 'Équipe Rouge' };

            let allyCount = 0;
            let enemyCount = 0;

            for (const bot of botEntities) {
                if (allyCount < teamSize - 1) {
                    team1.members.push(bot);
                    bot.teamId = 0;
                    bot.isAlly = true;
                    allyCount++;
                } else {
                    team2.members.push(bot);
                    bot.teamId = 1;
                    bot.isAlly = false;
                    enemyCount++;
                }
            }

            playerEntity.teamId = 0;
            playerEntity.isAlly = true;

            this.teams = [team1, team2];
        }

        // Assign colors
        this.teams.forEach(team => {
            team.members.forEach(m => {
                if (!m.isPlayer) m.color = team.color;
            });
        });
    }

    getTeam(teamId) {
        return this.teams.find(t => t.id === teamId);
    }

    getPlayerTeam() {
        return this.teams[0];
    }

    getEnemyTeam() {
        return this.teams[1];
    }

    addScore(teamId, points) {
        const team = this.getTeam(teamId);
        if (team) team.score += points;
    }

    getScores() {
        return this.teams.map(t => ({ id: t.id, label: t.label, score: t.score, color: t.color }));
    }

    isEnemy(entityA, entityB) {
        return entityA.teamId !== entityB.teamId;
    }

    reset() {
        this.teams.forEach(t => t.score = 0);
    }
}
