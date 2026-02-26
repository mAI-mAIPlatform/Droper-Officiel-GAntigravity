/* ============================
   DROPER — Mode Hack du Serveur 🖥️ (3v3)
   ============================ */

export class HackServerMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.servers = [];
    }

    init() {
        this.servers = [
            { teamId: 0, x: 80, y: this.engine.height / 2, hp: 3000, maxHp: 3000, color: '#4a9eff' },
            { teamId: 1, x: this.engine.width - 80, y: this.engine.height / 2, hp: 3000, maxHp: 3000, color: '#ef4444' },
        ];
    }

    update(dt) {
        // Check projectile hits on servers
        for (const entity of this.engine.entities) {
            if (entity.type !== 'projectile' || !entity.alive) continue;
            for (const server of this.servers) {
                if (server.hp <= 0) continue;
                const d = Math.hypot(entity.x - server.x, entity.y - server.y);
                if (d < 30 && entity.teamId !== server.teamId) {
                    server.hp -= entity.damage || 10;
                    entity.alive = false;
                    if (server.hp <= 0) {
                        server.hp = 0;
                        const winnerTeam = server.teamId === 0 ? 1 : 0;
                        return { finished: true, winner: winnerTeam };
                    }
                }
            }
        }

        // Update scores (server HP %)
        this.servers.forEach(s => {
            const team = this.teams.getTeam(s.teamId === 0 ? 1 : 0);
            if (team) team.score = Math.floor((1 - s.hp / s.maxHp) * 100);
        });

        return null;
    }

    getContext() {
        return {
            modeId: 'hack_server',
            ownServer: this.servers[0],
            enemyServer: this.servers[1],
        };
    }

    getWinnerOnTimeout() {
        const hp0 = this.servers[0].hp / this.servers[0].maxHp;
        const hp1 = this.servers[1].hp / this.servers[1].maxHp;
        return hp0 > hp1 ? 0 : 1;
    }

    draw(ctx) {
        for (const server of this.servers) {
            // Server body
            ctx.fillStyle = server.hp > 0 ? server.color : '#333';
            ctx.fillRect(server.x - 20, server.y - 25, 40, 50);

            // Screen
            ctx.fillStyle = server.hp > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.2)';
            ctx.fillRect(server.x - 15, server.y - 20, 30, 25);

            // Emoji
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.fillText(server.hp > 0 ? '🖥️' : '💥', server.x, server.y - 5);

            // HP bar
            const barW = 50;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(server.x - barW / 2, server.y + 30, barW, 5);
            const pct = server.hp / server.maxHp;
            ctx.fillStyle = pct > 0.5 ? '#22c55e' : '#ef4444';
            ctx.fillRect(server.x - barW / 2, server.y + 30, barW * pct, 5);
        }
    }
}
