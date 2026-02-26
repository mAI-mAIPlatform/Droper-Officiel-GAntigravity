/* ============================
   DROPER — Mode Cyber-Ball ⚽ (3v3)
   ============================ */

export class CyberBallMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.ball = null;
        this.goals = [];
        this.goalsToWin = 2;
    }

    init() {
        this.ball = {
            x: this.engine.width / 2,
            y: this.engine.height / 2,
            vx: 0, vy: 0,
            radius: 10,
            carrier: null,
        };
        this.goals = [
            { teamId: 0, x: 0, y: this.engine.height / 2, width: 20, height: 100 },
            { teamId: 1, x: this.engine.width - 20, y: this.engine.height / 2, width: 20, height: 100 },
        ];
    }

    update(dt) {
        if (!this.ball) return null;

        if (this.ball.carrier) {
            // Ball follows carrier
            const c = this.ball.carrier;
            if (!c.alive) {
                this.dropBall(c.x, c.y);
            } else {
                this.ball.x = c.x;
                this.ball.y = c.y;

                // Check goal
                for (const goal of this.goals) {
                    if (goal.teamId === c.teamId) continue;
                    if (this.ball.x >= goal.x && this.ball.x <= goal.x + goal.width &&
                        this.ball.y >= goal.y - goal.height / 2 && this.ball.y <= goal.y + goal.height / 2) {
                        this.teams.addScore(c.teamId, 1);
                        this.resetBall();

                        if (this.teams.getTeam(c.teamId).score >= this.goalsToWin) {
                            return { finished: true, winner: c.teamId };
                        }
                        break;
                    }
                }
            }
        } else {
            // Ball physics
            this.ball.x += this.ball.vx * dt;
            this.ball.y += this.ball.vy * dt;
            this.ball.vx *= 0.98;
            this.ball.vy *= 0.98;

            // Bounce
            if (this.ball.x < 10 || this.ball.x > this.engine.width - 10) this.ball.vx *= -0.8;
            if (this.ball.y < 10 || this.ball.y > this.engine.height - 10) this.ball.vy *= -0.8;
            this.ball.x = Math.max(10, Math.min(this.engine.width - 10, this.ball.x));
            this.ball.y = Math.max(10, Math.min(this.engine.height - 10, this.ball.y));

            // Pickup check
            const allEntities = [this.engine.player, ...this.engine.entities.filter(e => e.type === 'bot' && e.alive)];
            for (const ent of allEntities) {
                if (!ent || !ent.alive) continue;
                if (Math.hypot(this.ball.x - ent.x, this.ball.y - ent.y) < 20) {
                    this.ball.carrier = ent;
                    break;
                }
            }
        }

        return null;
    }

    dropBall(x, y) {
        this.ball.carrier = null;
        this.ball.x = x;
        this.ball.y = y;
        this.ball.vx = (Math.random() - 0.5) * 100;
        this.ball.vy = (Math.random() - 0.5) * 100;
    }

    resetBall() {
        this.ball.carrier = null;
        this.ball.x = this.engine.width / 2;
        this.ball.y = this.engine.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 0;
    }

    getContext() {
        return { modeId: 'cyber_ball', ballPos: { x: this.ball.x, y: this.ball.y } };
    }

    getWinnerOnTimeout() {
        const s0 = this.teams.getTeam(0).score;
        const s1 = this.teams.getTeam(1).score;
        return s0 >= s1 ? 0 : 1;
    }

    draw(ctx) {
        // Goals
        for (const goal of this.goals) {
            ctx.fillStyle = goal.teamId === 0 ? 'rgba(74,158,255,0.2)' : 'rgba(239,68,68,0.2)';
            ctx.fillRect(goal.x, goal.y - goal.height / 2, goal.width, goal.height);
            ctx.strokeStyle = goal.teamId === 0 ? '#4a9eff' : '#ef4444';
            ctx.lineWidth = 2;
            ctx.strokeRect(goal.x, goal.y - goal.height / 2, goal.width, goal.height);
        }

        // Ball
        if (this.ball && !this.ball.carrier) {
            ctx.fillStyle = '#a855f7';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.font = '12px serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚽', this.ball.x, this.ball.y + 4);
        }
    }
}
