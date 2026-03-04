/* ============================
   DROPER — Auras Data (v0.9.7-beta)
   Effets visuels autour du joueur
   ============================ */

export const AURAS = [
    {
        id: 'none',
        name: 'Aucune',
        emoji: '❌',
        rarity: 'free',
        seasonTier: 0,
        draw(ctx, x, y, time) { /* rien */ },
    },
    {
        id: 'fire',
        name: 'Flammes',
        emoji: '🔥',
        rarity: 'rare',
        seasonTier: 5,
        draw(ctx, x, y, time) {
            const pulse = 1 + Math.sin(time * 4) * 0.15;
            const r = 28 * pulse;
            const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
            grad.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
            grad.addColorStop(0.5, 'rgba(255, 50, 0, 0.15)');
            grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            // Petites flammes
            for (let i = 0; i < 4; i++) {
                const a = (time * 2 + i * Math.PI / 2) % (Math.PI * 2);
                const fx = x + Math.cos(a) * 18;
                const fy = y + Math.sin(a) * 18 - Math.sin(time * 6 + i) * 5;
                ctx.fillStyle = `rgba(255, ${150 + Math.sin(time * 5 + i) * 100}, 0, 0.6)`;
                ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
            }
        },
    },
    {
        id: 'ice',
        name: 'Cristaux de Glace',
        emoji: '❄️',
        rarity: 'epic',
        seasonTier: 15,
        draw(ctx, x, y, time) {
            const pulse = 1 + Math.sin(time * 3) * 0.1;
            const r = 26 * pulse;
            const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
            grad.addColorStop(0, 'rgba(100, 200, 255, 0.25)');
            grad.addColorStop(1, 'rgba(100, 200, 255, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            // Flocons tournants
            for (let i = 0; i < 6; i++) {
                const a = time * 1.5 + i * (Math.PI / 3);
                const fx = x + Math.cos(a) * 20;
                const fy = y + Math.sin(a) * 20;
                ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
                ctx.font = '6px serif';
                ctx.textAlign = 'center';
                ctx.fillText('❄', fx, fy);
            }
        },
    },
    {
        id: 'neon',
        name: 'Néon Pulse',
        emoji: '💜',
        rarity: 'epic',
        seasonTier: 25,
        draw(ctx, x, y, time) {
            const colors = ['#a855f7', '#ec4899', '#06b6d4'];
            const colorIndex = Math.floor(time * 2) % colors.length;
            const pulse = 1 + Math.sin(time * 5) * 0.2;
            const r = 24 * pulse;
            ctx.strokeStyle = colors[colorIndex];
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6 + Math.sin(time * 4) * 0.3;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
        },
    },
    {
        id: 'stars',
        name: 'Étoiles Dorées',
        emoji: '⭐',
        rarity: 'legendary',
        seasonTier: 40,
        draw(ctx, x, y, time) {
            for (let i = 0; i < 8; i++) {
                const a = time * 1.2 + i * (Math.PI / 4);
                const dist = 22 + Math.sin(time * 3 + i) * 6;
                const sx = x + Math.cos(a) * dist;
                const sy = y + Math.sin(a) * dist;
                const size = 4 + Math.sin(time * 4 + i * 2) * 2;
                ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + Math.sin(time * 3 + i) * 0.3})`;
                ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();
            }
        },
    },
    {
        id: 'shadow',
        name: 'Ombre Noire',
        emoji: '🖤',
        rarity: 'mythic',
        seasonTier: 50,
        draw(ctx, x, y, time) {
            const pulse = 1 + Math.sin(time * 2) * 0.15;
            const r = 30 * pulse;
            const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
            grad.addColorStop(0, 'rgba(30, 0, 50, 0.4)');
            grad.addColorStop(0.6, 'rgba(100, 0, 150, 0.15)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            // Smoke wisps
            for (let i = 0; i < 3; i++) {
                const a = time * 0.8 + i * (Math.PI * 2 / 3);
                const fx = x + Math.cos(a) * 15;
                const fy = y + Math.sin(a) * 15 - Math.sin(time * 2 + i) * 8;
                ctx.fillStyle = `rgba(80, 0, 120, ${0.3 + Math.sin(time * 3 + i) * 0.2})`;
                ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
            }
        },
    },
];

export function getAuraById(id) {
    return AURAS.find(a => a.id === id) || AURAS[0];
}
