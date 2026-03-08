/* ============================
   DROPER — Données Événements (v1.1.1)
   ============================ */

export const DAILY_MODIFIERS = [
    {
        id: 'speed_day',
        name: 'SPEED DAY',
        emoji: '🌪️',
        description: 'Tout le monde se déplace 50% plus vite.',
        modifiers: { playerSpeedMult: 1.5, enemySpeedMult: 1.5 }
    },
    {
        id: 'tiny_drop',
        name: 'TINY DROP',
        emoji: '🤏',
        description: 'Tous les personnages sont minuscules. Hitbox réduite, chaos garanti.',
        modifiers: { scale: 0.5 }
    },
    {
        id: 'lights_out',
        name: 'LIGHTS OUT',
        emoji: '🌑',
        description: 'La map est dans le noir. Seul un petit cercle autour de toi est visible.',
        modifiers: { darkAmbient: true, visionRadius: 150 }
    },
    {
        id: 'one_hp',
        name: 'ONE HP',
        emoji: '⚖️',
        description: 'Tout le monde a 1 seul point de vie. Un coup = mort.',
        modifiers: { forceOneHp: true }
    },
    {
        id: 'mirror_map',
        name: 'MIRROR MAP',
        emoji: '🔀',
        description: 'La map est retournée horizontalement. Tes repères sont foutus.',
        modifiers: { mirrorX: true }
    },
    {
        id: 'magnet',
        name: 'MAGNET',
        emoji: '🧲',
        description: 'Les joueurs sont attirés les uns vers les autres en permanence.',
        modifiers: { magnetism: true }
    },
    {
        id: 'slow_motion',
        name: 'SLOW MOTION',
        emoji: '🐌',
        description: 'Tout est ralenti à 60% de la vitesse normale. Chaque mouvement compte.',
        modifiers: { globalSpeedMult: 0.6 }
    },
    {
        id: 'explosif',
        name: 'EXPLOSIF',
        emoji: '💥',
        description: 'Chaque élimination déclenche une explosion qui peut toucher les voisins.',
        modifiers: { explodeOnDeath: true }
    }
];

export const TEMPORARY_EVENTS = [
    {
        id: 'rush_hour',
        name: 'RUSH HOUR',
        emoji: '🔥',
        durationDays: 2,
        description: 'Mode frénétique : les parties durent 60 secondes max, tout s’accélère.',
        objectives: [
            { id: 'rush_1', type: 'games', target: 5, label: 'Jouer 5 parties', reward: { type: 'cosmetic', cosmType: 'color', cosmId: 'neon', name: 'Néon' } },
            { id: 'rush_2', type: 'top3', target: 3, label: 'Finir Top 3 × 3 fois', reward: { type: 'coins', amount: 150 } },
            { id: 'rush_3', type: 'win_streak', target: 5, label: 'Gagner 5 parties d’affilée', reward: { type: 'title', value: 'Speed Demon' } }
        ],
        bonus: { id: 'rush_bonus', label: 'Badge animé limité', requirement: 'all_objectives' }
    },
    {
        id: 'survival_night',
        name: 'SURVIVAL NIGHT',
        emoji: '💀',
        durationDays: 3,
        description: 'Pas de respawn. Une vie. Une chance.',
        objectives: [
            { id: 'surv_1', type: 'survive', target: 3, label: 'Survivre 3 parties', reward: { type: 'cosmetic', cosmType: 'effect', cosmId: 'ghost', name: 'Effet Fantôme' } },
            { id: 'surv_2', type: 'kills', target: 10, label: 'Éliminer 10 joueurs total', reward: { type: 'emote', emoteId: 'devil', name: 'Emote 😈' } },
            { id: 'surv_3', type: 'win_no_damage', target: 1, label: 'Gagner sans prendre de dégâts', reward: { type: 'skin', skinId: 'shadow_drop', name: 'Shadow Drop' } }
        ],
        bonus: { id: 'surv_bonus', label: 'Monnaie premium x200', requirement: 'top1_no_kill' }
    },
    {
        id: 'drop_tournament',
        name: 'DROP TOURNAMENT',
        emoji: '🏆',
        durationDays: 3,
        description: 'Classement live, tout le monde se bat pour le podium.',
        isTournament: true,
        ranks: [
            { id: 'tourn_25', pct: 25, label: 'Top 25%', reward: { type: 'pack', name: 'Pack cosmétique standard' } },
            { id: 'tourn_10', score: 500, label: 'Top 10%', reward: { type: 'border', name: 'Bordure dorée' } },
            { id: 'tourn_1', label: 'Top 1%', reward: { type: 'skin', skinId: 'crown_drop', name: 'Crown Drop' } }
        ]
    },
    {
        id: 'chaos_mode',
        name: 'CHAOS MODE',
        emoji: '🌀',
        durationDays: 2,
        description: 'Les règles changent toutes les heures (gravité inversée, map réduite, speed x2…)',
        objectives: [
            { id: 'chaos_1', type: 'rules_played', target: 3, label: 'Jouer sous 3 règles différentes', reward: { type: 'sticker', name: 'Sticker profil' } },
            { id: 'chaos_2', type: 'wins_diff_modes', target: 2, label: 'Gagner dans 2 modes différents', reward: { type: 'cosmetic', cosmType: 'color_name', cosmId: 'animated', name: 'Pseudo Animé' } },
            { id: 'chaos_3', type: 'win_all_modes', target: 1, label: 'Gagner dans TOUS les modes actifs', reward: { type: 'bundle', name: 'Chaos Bundle' } }
        ]
    }
];
