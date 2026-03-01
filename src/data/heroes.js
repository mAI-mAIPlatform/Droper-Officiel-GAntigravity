/* ============================
   DROPER — Données Héros (v0.0.8)
   ============================ */

export const RARITIES = {
    COMMON: { id: 'common', label: 'Commun', color: '#8b95a8', cssClass: 'badge--common', value: 1 },
    RARE: { id: 'rare', label: 'Rare', color: '#4a9eff', cssClass: 'badge--rare', value: 2 },
    EPIC: { id: 'epic', label: 'Épique', color: '#a855f7', cssClass: 'badge--epic', value: 3 },
    MYTHIC: { id: 'mythic', label: 'Mythique', color: '#ec4899', cssClass: 'badge--mythic', value: 4 },
    LEGENDARY: { id: 'legendary', label: 'Légendaire', color: '#fbbf24', cssClass: 'badge--legendary', value: 5 },
    ULTRA: { id: 'ultra', label: 'Ultra', color: '#f87171', cssClass: 'badge--ultra', value: 6 },
};

export const ARCHETYPES = {
    SNIPER: { id: 'sniper', label: 'Sniper', icon: '🎯' },
    SUPPORT: { id: 'support', label: 'Soutien', icon: '❤️' },
    ASSASSIN: { id: 'assassin', label: 'Assassin', icon: '🗡️' },
    FLASH: { id: 'flash', label: 'Flash', icon: '⚡' },
    TANK: { id: 'tank', label: 'Tank', icon: '🛡️' }
};

export const HEROES = [
    {
        id: 'soldier',
        name: 'Soldier',
        emoji: '🔫',
        description: 'Polyvalent et fiable. Le starter parfait.',
        story: 'Ancien soldat d\'élite de la Brigade Cyber, Soldier a été le premier à répondre à l\'appel quand les portails dimensionnels se sont ouverts. Son instinct militaire et sa discipline font de lui un combattant équilibré, capable de s\'adapter à toute situation. Il n\'a jamais perdu un coéquipier — et il compte bien garder ce record.',
        rarity: RARITIES.COMMON,
        archetype: ARCHETYPES.SUPPORT,
        stats: { hp: 100, attack: 15, speed: 72, defense: 10 },
        unlocked: true,
        coverImage: '/assets/heroes/soldat.png', // v0.5.0
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
        story: 'Prototype expérimental de la Division Tech, Drone est une IA autonome qui a développé une conscience propre. Construit pour la reconnaissance, il a choisi de devenir un combattant. Sa vitesse vertigineuse le rend presque impossible à toucher, mais sa structure légère est son talon d\'Achille.',
        rarity: RARITIES.COMMON,
        archetype: ARCHETYPES.FLASH,
        stats: { hp: 70, attack: 12, speed: 105, defense: 5 },
        unlocked: true,
        coverImage: '/assets/heroes/drone_portrait.png',
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
        story: 'Forgé dans les usines souterraines de la Cité Blindée, Tank est une machine de guerre vivante. Son armure a été trempée dans du plasma stellaire, ce qui la rend quasi indestructible. Il avance lentement, mais chacun de ses pas fait trembler le sol. Ses alliés se sentent en sécurité derrière lui.',
        rarity: RARITIES.RARE,
        archetype: ARCHETYPES.TANK,
        stats: { hp: 280, attack: 8, speed: 51, defense: 30 },
        unlocked: false,
        coverImage: '/assets/heroes/goliath.png', // v0.5.0
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
        story: 'Personne ne connaît le vrai nom de Sniper. On sait seulement qu\'il a quitté les Forces Spéciales après avoir réalisé que ses talents étaient gaspillés. Aujourd\'hui, il opère seul. Son œil cybernétique calcule la trajectoire parfaite en une fraction de seconde. Quand tu vois son laser rouge, il est déjà trop tard.',
        rarity: RARITIES.RARE,
        archetype: ARCHETYPES.SNIPER,
        stats: { hp: 70, attack: 30, speed: 60, defense: 5 },
        unlocked: false,
        coverImage: '/assets/heroes/sniper_portrait.png',
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
        story: 'Né d\'une anomalie dimensionnelle, Phantom existe entre deux réalités. Son corps se déphase constamment, le rendant aussi insaisissable qu\'un fantôme. Certains disent qu\'il n\'est pas réellement vivant, mais une simple projection. Peu importe — ses lames, elles, sont bien réelles.',
        rarity: RARITIES.EPIC,
        archetype: ARCHETYPES.ASSASSIN,
        stats: { hp: 80, attack: 28, speed: 145, defense: 8 },
        unlocked: false,
        coverImage: '/assets/heroes/phantom_portrait.png',
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
        story: 'Titan est le dernier survivant d\'une race de géants cosmiques anéantie par les Ères Sombres. Portant en lui la puissance d\'une étoile mourante, il cherche la rédemption en protégeant les plus faibles. Chacun de ses coups porte la force d\'un cataclysme, et sa simple présence galvanise ses alliés.',
        rarity: RARITIES.LEGENDARY,
        archetype: ARCHETYPES.TANK,
        stats: { hp: 350, attack: 40, speed: 80, defense: 25 },
        unlocked: false,
        coverImage: '/assets/heroes/titan_portrait.png',
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
        archetype: ARCHETYPES.ASSASSIN,
        stats: { hp: 85, attack: 18, speed: 170, defense: 6 },
        unlocked: false,
        coverImage: '/assets/heroes/ninja.png', // v0.5.0
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
        archetype: ARCHETYPES.SUPPORT,
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
        archetype: ARCHETYPES.FLASH,
        stats: { hp: 110, attack: 32, speed: 180, defense: 12 },
        unlocked: false,
        coverImage: '/assets/heroes/volt_portrait.png',
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
        id: 'brave',
        name: 'Brave',
        emoji: '🗡️',
        description: 'Expert en combat rapproché. Courageux et tranchant.',
        story: 'Autrefois connu sous le nom de Blade, Brave a renoncé à sa vie d\'assassin pour protéger les innocents. Sa lame légendaire, forgée dans le Noyau Primordial, tranche aussi bien l\'acier que les ténèbres. Il porte les cicatrices de mille batailles, mais chacune raconte une vie sauvée.',
        rarity: RARITIES.EPIC,
        archetype: ARCHETYPES.ASSASSIN,
        stats: { hp: 160, attack: 32, speed: 125, defense: 22 },
        unlocked: false,
        coverImage: '/assets/heroes/brave_portrait.png',
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
            id: 'brave_vortex',
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
        archetype: ARCHETYPES.SUPPORT,
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
        archetype: ARCHETYPES.TANK,
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
        archetype: ARCHETYPES.ASSASSIN,
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
        archetype: ARCHETYPES.FLASH,
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
        archetype: ARCHETYPES.SUPPORT,
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
    {
        id: 'astro',
        name: 'Astro',
        emoji: '🚀',
        description: 'Explorateur des confins de l\'univers. Précision stellaire.',
        rarity: RARITIES.ULTRA,
        archetype: ARCHETYPES.SNIPER,
        stats: { hp: 110, attack: 42, speed: 110, defense: 12 },
        unlocked: false,
        coverImage: '/assets/heroes/astro_portrait.png',
        bodyShape: 'star',
        bodyColor: '#ffffff',
        glowColor: '#3b82f6',
        trailColor: 'rgba(59, 130, 246, 0.4)',
        bodySize: 11,
        bulletPattern: 'snipe',
        bulletColor: '#3b82f6',
        bulletSpeed: 400,
        bulletDamage: 45,
        shootRate: 2.2,
        ultimate: {
            id: 'orbital_strike',
            name: 'Frappe Orbitale',
            description: 'De l\'espace avec amour : un faisceau d\'énergie pure tombe sur vos ennemis.',
            chargeRequired: 1400,
            cooldown: 20.0
        }
    },
    {
        id: 'glacier',
        name: 'Glacier',
        emoji: '❄️',
        description: 'Maître du froid absolu. Ralentit le temps et les ennemis.',
        rarity: RARITIES.MYTHIC,
        archetype: ARCHETYPES.SUPPORT,
        stats: { hp: 180, attack: 22, speed: 85, defense: 25 },
        unlocked: false,
        coverImage: '/assets/heroes/glacier_portrait.png',
        bodyShape: 'hexagon',
        bodyColor: '#bae6fd',
        glowColor: '#0ea5e9',
        trailColor: 'rgba(186, 230, 253, 0.4)',
        bodySize: 13,
        bulletPattern: 'burst',
        bulletColor: '#7dd3fc',
        bulletSpeed: 220,
        bulletDamage: 12,
        shootRate: 0.6,
        ultimate: {
            id: 'absolute_zero',
            name: 'Zéro Absolu',
            description: 'Gèle tous les ennemis à l\'écran pendant 3 secondes.',
            chargeRequired: 1500,
            cooldown: 30.0
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
