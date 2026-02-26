/* ============================
   DROPER — Titres / Niveaux d'Accès
   ============================ */

export const ACCESS_LEVELS = [
    {
        id: 'user',
        name: 'User',
        emoji: '👤',
        color: '#8b95a8',
        winsRequired: 0,
        description: 'Niveau de départ. Bienvenue dans Droper.',
        perks: ['Accès au mode classique', 'Boutique basique'],
    },
    {
        id: 'verified',
        name: 'Verified',
        emoji: '✅',
        color: '#22c55e',
        winsRequired: 5,
        description: 'Joueur vérifié. Tu as prouvé ta valeur.',
        perks: ['Badge Verified', 'Émojis de réaction'],
    },
    {
        id: 'moderator',
        name: 'Moderator',
        emoji: '🛡️',
        color: '#4a9eff',
        winsRequired: 15,
        description: 'Modérateur du réseau. Respect gagné.',
        perks: ['Cadre de profil bleu', 'Accès aux modes team'],
    },
    {
        id: 'admin',
        name: 'Admin',
        emoji: '⚙️',
        color: '#a855f7',
        winsRequired: 35,
        description: 'Administrateur système. Pouvoir et responsabilité.',
        perks: ['Cadre de profil violet', 'Émojis exclusifs', 'Titre visible en jeu'],
    },
    {
        id: 'super_user',
        name: 'Super-User',
        emoji: '🔥',
        color: '#f59e0b',
        winsRequired: 75,
        description: 'Super-Utilisateur. Élite du réseau Droper.',
        perks: ['Cadre doré', 'Effets visuels exclusifs', 'Drops bonus'],
    },
    {
        id: 'root',
        name: 'Root',
        emoji: '👑',
        color: '#dc2626',
        winsRequired: 150,
        description: 'Accès Root. Le plus haut rang. Légende vivante.',
        perks: ['Cadre légendaire animé', 'Avatar avec aura', 'Double Records'],
    },
];

export function getAccessLevel(wins) {
    let currentLevel = ACCESS_LEVELS[0];
    for (const level of ACCESS_LEVELS) {
        if (wins >= level.winsRequired) {
            currentLevel = level;
        }
    }
    return currentLevel;
}

export function getNextAccessLevel(wins) {
    for (const level of ACCESS_LEVELS) {
        if (wins < level.winsRequired) return level;
    }
    return null;
}
