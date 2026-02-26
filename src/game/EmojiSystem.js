/* ============================
   DROPER — Emoji Reaction System (In-Game)
   ============================ */

const REACTION_EMOJIS = [
    { key: '1', emoji: '😂', name: 'LOL' },
    { key: '2', emoji: '🔥', name: 'Fire' },
    { key: '3', emoji: '💀', name: 'Mort' },
    { key: '4', emoji: '👑', name: 'GG' },
    { key: '5', emoji: '😡', name: 'Rage' },
];

export class EmojiSystem {
    constructor(engine) {
        this.engine = engine;
        this.emojis = [];
        this.enemyEmojiTimer = 0;
        this.enemyEmojiInterval = 8 + Math.random() * 12;
    }

    playerReaction(keyIndex) {
        const economy = this.engine.app.economyManager;
        if (!economy.spendGems(1)) return false;

        const r = REACTION_EMOJIS[keyIndex];
        if (!r) return false;

        const player = this.engine.player;
        if (!player || !player.alive) return false;

        this.spawnEmoji(player.x, player.y - 30, r.emoji);
        return true;
    }

    enemyRandomReaction(dt) {
        this.enemyEmojiTimer += dt;
        if (this.enemyEmojiTimer < this.enemyEmojiInterval) return;
        this.enemyEmojiTimer = 0;
        this.enemyEmojiInterval = 6 + Math.random() * 10;

        const enemies = this.engine.entities.filter(e => e.type === 'enemy' && e.alive);
        if (enemies.length === 0) return;

        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        const randomEmoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
        this.spawnEmoji(enemy.x, enemy.y - enemy.height / 2 - 10, randomEmoji.emoji);
    }

    spawnEmoji(x, y, emoji) {
        this.emojis.push({
            x, y,
            emoji,
            lifetime: 1.5,
            maxLifetime: 1.5,
            vy: -40,
            scale: 0,
            alive: true,
        });
    }

    update(dt) {
        this.enemyRandomReaction(dt);

        for (const e of this.emojis) {
            if (!e.alive) continue;
            e.lifetime -= dt;
            e.y += e.vy * dt;
            e.vy *= 0.97;

            // Scale animation: pop in then shrink
            const t = 1 - (e.lifetime / e.maxLifetime);
            if (t < 0.15) {
                e.scale = t / 0.15;
            } else if (t > 0.7) {
                e.scale = (1 - t) / 0.3;
            } else {
                e.scale = 1;
            }

            if (e.lifetime <= 0) e.alive = false;
        }

        this.emojis = this.emojis.filter(e => e.alive);
    }

    draw(ctx) {
        for (const e of this.emojis) {
            if (!e.alive || e.scale <= 0) continue;
            const alpha = Math.max(0, e.lifetime / e.maxLifetime);
            const size = 20 * e.scale;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = `${size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e.emoji, e.x, e.y);
            ctx.restore();
        }
    }

    clear() {
        this.emojis = [];
    }
}

export { REACTION_EMOJIS };
