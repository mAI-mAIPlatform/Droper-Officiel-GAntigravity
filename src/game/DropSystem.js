/* ============================
   DROPER — Drop System (In-Game)
   ============================ */

export class DropSystem {
    constructor(engine) {
        this.engine = engine;
        this.drops = [];
        this.dropTable = [
            { itemId: 'crate_basic', chance: 0.08, emoji: '📦' },
            { itemId: 'crate_rare', chance: 0.03, emoji: '🎁' },
            { itemId: 'fragment_hero', chance: 0.12, emoji: '🧩' },
            { itemId: 'crate_season', chance: 0.01, emoji: '🌅' },
        ];
    }

    onEnemyKilled(enemy) {
        // Les boss drop toujours
        if (enemy.typeId === 'boss') {
            this.spawnDrop(enemy.x, enemy.y, 'crate_rare', '🎁');
            if (Math.random() < 0.3) {
                this.spawnDrop(enemy.x + 20, enemy.y, 'key_gold', '🔑');
            }
            return;
        }

        // Roll aléatoire pour les autres
        for (const drop of this.dropTable) {
            if (Math.random() < drop.chance) {
                this.spawnDrop(enemy.x, enemy.y, drop.itemId, drop.emoji);
                break; // Un seul drop par ennemi
            }
        }
    }

    spawnDrop(x, y, itemId, emoji) {
        this.drops.push({
            x, y,
            itemId,
            emoji,
            alive: true,
            lifetime: 8.0,
            bobTimer: Math.random() * Math.PI * 2,
            size: 20,
            collected: false,
        });
    }

    update(dt) {
        const player = this.engine.player;
        if (!player || !player.alive) return;

        for (const drop of this.drops) {
            if (!drop.alive) continue;

            drop.lifetime -= dt;
            drop.bobTimer += dt * 3;

            if (drop.lifetime <= 0) {
                drop.alive = false;
                continue;
            }

            // Attraction magnétique si proche
            const dx = player.x - drop.x;
            const dy = player.y - drop.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
                const speed = 200 * (1 - dist / 80);
                drop.x += (dx / dist) * speed * dt;
                drop.y += (dy / dist) * speed * dt;
            }

            // Collecte
            if (dist < 20) {
                drop.alive = false;
                drop.collected = true;

                const inventory = this.engine.app.inventoryManager;
                if (inventory) {
                    inventory.addItem(drop.itemId);
                }

                // Particule
                if (this.engine.particles) {
                    this.engine.particles.spawnImpact(drop.x, drop.y, '#fbbf24');
                }
                if (this.engine.audioManager) {
                    this.engine.audioManager.playPurchase();
                }
            }
        }

        this.drops = this.drops.filter(d => d.alive);
    }

    draw(ctx) {
        for (const drop of this.drops) {
            if (!drop.alive) continue;

            const bobY = Math.sin(drop.bobTimer) * 4;
            const alpha = drop.lifetime < 2 ? drop.lifetime / 2 : 1;

            ctx.save();
            ctx.globalAlpha = alpha;

            // Glow
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;

            // Background circle
            ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
            ctx.beginPath();
            ctx.arc(drop.x, drop.y + bobY, drop.size / 2 + 4, 0, Math.PI * 2);
            ctx.fill();

            // Emoji
            ctx.shadowBlur = 0;
            ctx.font = `${drop.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(drop.emoji, drop.x, drop.y + bobY);

            ctx.restore();
        }
    }

    clear() {
        this.drops = [];
    }
}
