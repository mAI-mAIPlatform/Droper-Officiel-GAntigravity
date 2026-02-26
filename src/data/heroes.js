/* ============================
   DROPER — Données Héros (v0.0.8)
   ============================ */

export const RARITIES = {
    COMMON: { id: 'common', label: 'Commun', color: '#8b95a8', cssClass: 'badge--common' },
    RARE: { id: 'rare', label: 'Rare', color: '#4a9eff', cssClass: 'badge--rare' },
    EPIC: { id: 'epic', label: 'Épique', color: '#a855f7', cssClass: 'badge--epic' },
    LEGENDARY: { id: 'legendary', label: 'Légendaire', color: '#fbbf24', cssClass: 'badge--legendary' },
};

export const HEROES = [
    {
        id: 'soldier',
        name: 'Soldier',
        emoji: '🔫',
        description: 'Polyvalent et fiable. Le starter parfait.',
        rarity: RARITIES.COMMON,
        stats: { hp: 100, attack: 15, speed: 120, defense: 10 },
        unlocked: true,
        // Design unique
        bodyShape: 'circle',
        bodyColor: '#4a9eff',
        glowColor: '#2563eb',
        trailColor: 'rgba(74, 158, 255, 0.3)',
        bodySize: 11,
        bulletPattern: 'single',
        bulletColor: '#4a9eff',
        bulletSpeed: 240,
        bulletDamage: 14,
        shootRate: 0.8,
    },
    {
        id: 'drone',
        name: 'Drone',
        emoji: '🛸',
        description: 'Ultra rapide mais fragile. Esquive tout.',
        rarity: RARITIES.COMMON,
        stats: { hp: 70, attack: 12, speed: 175, defense: 5 },
        unlocked: true,
        bodyShape: 'diamond',
        bodyColor: '#22d3ee',
        glowColor: '#06b6d4',
        trailColor: 'rgba(34, 211, 238, 0.3)',
        bodySize: 9,
        bulletPattern: 'burst',
        bulletColor: '#22d3ee',
        bulletSpeed: 300,
        bulletDamage: 8,
        shootRate: 0.4,
    },
    {
        id: 'tank',
        name: 'Tank',
        emoji: '🛡️',
        description: 'Mur de fer. Lent mais inarrêtable.',
        rarity: RARITIES.RARE,
        stats: { hp: 280, attack: 8, speed: 85, defense: 30 },
        unlocked: false,
        bodyShape: 'square',
        bodyColor: '#22c55e',
        glowColor: '#16a34a',
        trailColor: 'rgba(34, 197, 94, 0.3)',
        bodySize: 14,
        bulletPattern: 'heavy',
        bulletColor: '#22c55e',
        bulletSpeed: 180,
        bulletDamage: 22,
        shootRate: 1.8,
    },
    {
        id: 'sniper',
        name: 'Sniper',
        emoji: '🎯',
        description: 'Un tir, un kill. Précision mortelle.',
        rarity: RARITIES.RARE,
        stats: { hp: 70, attack: 30, speed: 100, defense: 5 },
        unlocked: false,
        bodyShape: 'triangle',
        bodyColor: '#ef4444',
        glowColor: '#dc2626',
        trailColor: 'rgba(239, 68, 68, 0.3)',
        bodySize: 10,
        bulletPattern: 'snipe',
        bulletColor: '#ef4444',
        bulletSpeed: 350,
        bulletDamage: 28,
        shootRate: 2.5,
    },
    {
        id: 'phantom',
        name: 'Phantom',
        emoji: '👻',
        description: 'Rapide et mortel dans l\'ombre.',
        rarity: RARITIES.EPIC,
        stats: { hp: 80, attack: 28, speed: 145, defense: 8 },
        unlocked: false,
        bodyShape: 'hexagon',
        bodyColor: '#a855f7',
        glowColor: '#9333ea',
        trailColor: 'rgba(168, 85, 247, 0.3)',
        bodySize: 10,
        bulletPattern: 'scatter',
        bulletColor: '#a855f7',
        bulletSpeed: 220,
        bulletDamage: 14,
        shootRate: 0.7,
    },
    {
        id: 'titan',
        name: 'Titan',
        emoji: '⚡',
        description: 'Puissance destructrice ultime.',
        rarity: RARITIES.LEGENDARY,
        stats: { hp: 350, attack: 40, speed: 80, defense: 25 },
        unlocked: false,
        bodyShape: 'star',
        bodyColor: '#fbbf24',
        glowColor: '#f59e0b',
        trailColor: 'rgba(251, 191, 36, 0.3)',
        bodySize: 14,
        bulletPattern: 'wave',
        bulletColor: '#fbbf24',
        bulletSpeed: 160,
        bulletDamage: 30,
        shootRate: 1.5,
    },
    {
        id: 'cyber_ninja',
        name: 'Cyber-Ninja',
        emoji: '🥷',
        description: 'Vitesse extrême. Maître de l\'esquive.',
        rarity: RARITIES.EPIC,
        stats: { hp: 85, attack: 18, speed: 170, defense: 6 },
        unlocked: false,
        bodyShape: 'diamond',
        bodyColor: '#10b981',
        glowColor: '#059669',
        trailColor: 'rgba(16, 185, 129, 0.4)',
        bodySize: 10,
        bulletPattern: 'burst',
        bulletColor: '#10b981',
        bulletSpeed: 280,
        bulletDamage: 8,
        shootRate: 0.5,
        ultimate: {
            id: 'blade_dash',
            name: 'Blade Dash',
            description: 'Fonce à travers les ennemis et inflige des dégâts.',
            chargeRequired: 1000,
            cooldown: 8.0
        }
    },
    {
        id: 'overlord',
        name: 'Overlord',
        emoji: '🧠',
        description: 'Contrôle la gravité et le champ de bataille.',
        rarity: RARITIES.LEGENDARY,
        stats: { hp: 150, attack: 25, speed: 95, defense: 15 },
        unlocked: false,
        bodyShape: 'hexagon',
        bodyColor: '#f43f5e',
        glowColor: '#e11d48',
        trailColor: 'rgba(244, 63, 94, 0.4)',
        bodySize: 13,
        bulletPattern: 'heavy',
        bulletColor: '#f43f5e',
        bulletSpeed: 190,
        bulletDamage: 24,
        shootRate: 1.5,
        ultimate: {
            id: 'graviton_pull',
            name: 'Graviton Pull',
            description: 'Aspire les ennemis proches vers le centre.',
            chargeRequired: 1200,
            cooldown: 12.0
        }
    },
    {
        id: 'volt',
        name: 'Volt',
        emoji: '⚡',
        description: 'L\'énergie pure. Foudroie ses ennemis avant même qu\'ils ne le voient.',
        rarity: RARITIES.LEGENDARY,
        stats: { hp: 110, attack: 32, speed: 180, defense: 12 },
        unlocked: false,
        bodyShape: 'star',
        bodyColor: '#60a5fa',
        glowColor: '#3b82f6',
        trailColor: 'rgba(96, 165, 250, 0.4)',
        bodySize: 11,
        bulletPattern: 'scatter',
        bulletColor: '#60a5fa',
        bulletSpeed: 300,
        bulletDamage: 15,
        shootRate: 0.4,
        ultimate: {
            id: 'chain_lightning',
            name: 'Chaîne d\'Éclairs',
            description: 'Libère une décharge qui rebondit entre les ennemis.',
            chargeRequired: 1100,
            cooldown: 10.0
        }
    },
    {
        id: 'blade',
        name: 'Blade',
        emoji: '🗡️',
        description: 'Expert en combat rapproché. Précis et tranchant.',
        rarity: RARITIES.EPIC,
        stats: { hp: 160, attack: 32, speed: 125, defense: 22 },
        unlocked: false,
        bodyShape: 'triangle',
        bodyColor: '#94a3b8',
        glowColor: '#475569',
        trailColor: 'rgba(148, 163, 184, 0.3)',
        bodySize: 12,
        bulletPattern: 'heavy',
        bulletColor: '#cbd5e1',
        bulletSpeed: 180,
        bulletDamage: 35,
        shootRate: 1.4,
        ultimate: {
            id: 'blade_vortex',
            name: 'Vortex de Lames',
            description: 'Crée un tourbillon tranchant autour de lui.',
            chargeRequired: 1000,
            cooldown: 9.0
        }
    },
    {
        id: 'nova',
        name: 'Nova',
        emoji: '🌟',
        description: 'Énergie cosmique pure. Brille de mille feux.',
        rarity: RARITIES.LEGENDARY,
        stats: { hp: 130, attack: 45, speed: 140, defense: 15 },
        unlocked: false,
        bodyShape: 'star',
        bodyColor: '#fde047',
        glowColor: '#eab308',
        trailColor: 'rgba(253, 224, 71, 0.4)',
        bodySize: 13,
        bulletPattern: 'scatter',
        bulletColor: '#fde047',
        bulletSpeed: 280,
        bulletDamage: 20,
        shootRate: 0.6,
        ultimate: {
            id: 'supernova',
            name: 'Supernova',
            description: 'Libère une explosion d\'énergie aveuglante.',
            chargeRequired: 1500,
            cooldown: 15.0
        }
    },
    {
        id: 'rex',
        name: 'Rex',
        emoji: '🦖',
        description: 'Force primitive. Le roi de l\'arène.',
        rarity: RARITIES.RARE,
        stats: { hp: 220, attack: 35, speed: 100, defense: 25 },
        unlocked: false,
        bodyShape: 'square',
        bodyColor: '#4d7c0f',
        glowColor: '#365314',
        trailColor: 'rgba(77, 124, 15, 0.3)',
        bodySize: 14,
        bulletPattern: 'heavy',
        bulletColor: '#a3e635',
        bulletSpeed: 200,
        bulletDamage: 30,
        shootRate: 1.2,
        ultimate: {
            id: 'primal_roar',
            name: 'Cri Primordial',
            description: 'Étourdit les ennemis proches par la peur.',
            chargeRequired: 1200,
            cooldown: 20.0
        }
    },
    {
        id: 'viper',
        name: 'Viper',
        emoji: '🐍',
        description: 'Venimeux et sournois. Ne laisse aucune chance.',
        rarity: RARITIES.EPIC,
        stats: { hp: 110, attack: 38, speed: 155, defense: 10 },
        unlocked: false,
        bodyShape: 'hexagon',
        bodyColor: '#10b981',
        glowColor: '#059669',
        trailColor: 'rgba(16, 185, 129, 0.3)',
        bodySize: 11,
        bulletPattern: 'burst',
        bulletColor: '#34d399',
        bulletSpeed: 300,
        bulletDamage: 12,
        shootRate: 0.5,
        ultimate: {
            id: 'toxin_cloud',
            name: 'Nuage Toxique',
            description: 'Laisse une traînée de gaz mortel derrière lui.',
            chargeRequired: 1100,
            cooldown: 12.0
        }
    },
    {
        id: 'glitch',
        name: 'Glitch',
        emoji: '👾',
        description: 'Erreur système. Sa présence déforme la réalité.',
        rarity: RARITIES.LEGENDARY,
        stats: { hp: 90, attack: 55, speed: 180, defense: 5 },
        unlocked: false,
        bodyShape: 'diamond',
        bodyColor: '#d946ef',
        glowColor: '#c026d3',
        trailColor: 'rgba(217, 70, 239, 0.4)',
        bodySize: 10,
        bulletPattern: 'wave',
        bulletColor: '#f5d0fe',
        bulletSpeed: 350,
        bulletDamage: 45,
        shootRate: 1.8,
        ultimate: {
            id: 'system_crash',
            name: 'System Crash',
            description: 'Se téléporte aléatoirement en infligeant des dégâts.',
            chargeRequired: 1400,
            cooldown: 18.0
        }
    },
    {
        id: 'solar',
        name: 'Solar',
        emoji: '☀️',
        description: 'Feu solaire. Brûle tout sur son passage.',
        rarity: RARITIES.RARE,
        stats: { hp: 140, attack: 32, speed: 120, defense: 20 },
        unlocked: false,
        bodyShape: 'circle',
        bodyColor: '#f97316',
        glowColor: '#ea580c',
        trailColor: 'rgba(249, 115, 22, 0.3)',
        bodySize: 12,
        bulletPattern: 'scatter',
        bulletColor: '#fb923c',
        bulletSpeed: 220,
        bulletDamage: 18,
        shootRate: 0.8,
        ultimate: {
            id: 'sunbeam',
            name: 'Rayon Solaire',
            description: 'Focalise l\'énergie du soleil en un rayon destructeur.',
            chargeRequired: 1300,
            cooldown: 25.0
        }
    },
];

// Dessiner la forme du héros
export function drawHeroBody(ctx, x, y, hero, scale = 1) {
    const s = (hero.bodySize || 11) * scale;
    ctx.fillStyle = hero.bodyColor;
    ctx.strokeStyle = hero.glowColor;
    ctx.lineWidth = 1.5;

    switch (hero.bodyShape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s * 0.7, y);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x - s * 0.7, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'square':
            ctx.fillRect(x - s, y - s, s * 2, s * 2);
            ctx.strokeRect(x - s, y - s, s * 2, s * 2);
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s, y + s * 0.7);
            ctx.lineTo(x - s, y + s * 0.7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'hexagon':
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const px = x + s * Math.cos(angle);
                const py = y + s * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'star':
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI / 5) * i - Math.PI / 2;
                const r = i % 2 === 0 ? s : s * 0.5;
                const px = x + r * Math.cos(angle);
                const py = y + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        default:
            ctx.beginPath();
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
    }

    // Glow
    ctx.shadowColor = hero.glowColor;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

export function getHeroById(id) {
    return HEROES.find(h => h.id === id);
}

export function getHeroesByRarity(rarityId) {
    return HEROES.filter(h => h.rarity.id === rarityId);
}

export function getRandomHero() {
    return HEROES[Math.floor(Math.random() * HEROES.length)];
}
