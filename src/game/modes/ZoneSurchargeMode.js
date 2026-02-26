/* ============================
   DROPER — Mode Zone de Surcharge ⚡ (3v3)
   ============================ */

export class ZoneSurchargeMode {
    constructor(engine, teamManager) {
        this.engine = engine;
        this.teams = teamManager;
        this.zones = [];
        this.chargeTarget = 100;
        this.charge = { 0: 0, 1: 0 };
    }

    init() {
        this.charge = { 0: 0, 1: 0 };
        this.zones = [
            {
                x: this.engine.width / 2,
                y: this.engine.height / 2,
                radius: 80,
                controlledBy: null,
                progress: 0,
            },
        ];
    }

    update(dt) {
        for (const zone of this.zones) {
            // Count team members in zone
            const inZone = { 0: 0, 1: 0 };
            const allEntities = [
                this.engine.player,
                ...this.engine.entities.filter(e => e.type === 'bot' && e.alive),
            ];

            for (const ent of allEntities) {
                if (!ent || !ent.alive) continue;
                const d = Math.hypot(ent.x - zone.x, ent.y - zone.y);
                if (d < zone.radius && ent.teamId != null) {
                    inZone[ent.teamId]++;
                }
            }

            // Determine control
            if (inZone[0] > 0 && inZone[1] === 0) {
                zone.controlledBy = 0;
                this.charge[0] += dt * 5 * inZone[0];
            } else if (inZone[1] > 0 && inZone[0] === 0) {
                zone.controlledBy = 1;
                this.charge[1] += dt * 5 * inZone[1];
            } else {
                zone.controlledBy = null; // contested
            }
        }

        // Update team scores
        this.teams.teams[0].score = Math.floor(this.charge[0]);
        this.teams.teams[1].score = Math.floor(this.charge[1]);

        // Check win
        for (const teamId of [0, 1]) {
            if (this.charge[teamId] >= this.chargeTarget) {
                return { finished: true, winner: teamId };
            }
        }

        return null;
    }

    getContext() {
        return {
            modeId: 'zone_surcharge',
            zoneCenter: this.zones[0] ? { x: this.zones[0].x, y: this.zones[0].y } : null,
        };
    }

    getWinnerOnTimeout() {
        return this.charge[0] >= this.charge[1] ? 0 : 1;
    }

    draw(ctx) {
        for (const zone of this.zones) {
            // Zone circle
            const color = zone.controlledBy === 0 ? '#4a9eff'
                : zone.controlledBy === 1 ? '#ef4444'
                    : '#555';
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Fill
            ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.fill();

            // Center icon
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', zone.x, zone.y + 6);
        }

        // Charge bars
        const barY = this.engine.height - 25;
        const barW = 150;
        for (const teamId of [0, 1]) {
            const x = teamId === 0 ? 10 : this.engine.width - barW - 10;
            const pct = Math.min(1, this.charge[teamId] / this.chargeTarget);

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(x, barY, barW, 10);
            ctx.fillStyle = teamId === 0 ? '#4a9eff' : '#ef4444';
            ctx.fillRect(x, barY, barW * pct, 10);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.floor(pct * 100)}%`, x + barW / 2, barY + 9);
        }
    }
}
