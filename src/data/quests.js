/* ============================
   DROPER — Données Quêtes Pool (+200 quêtes)
   ============================ */

const QUEST_TYPES = [
    { type: 'xp', title: 'Gagner X XP', desc: 'Accumule de l\'expérience.', icon: '⚡' },
    { type: 'kills', title: 'Éliminer N ennemis', desc: 'Montre ta puissance.', icon: '⚔️' },
    { type: 'wave', title: 'Atteindre la vague N', desc: 'Survis le plus longtemps.', icon: '🌊' },
    { type: 'games', title: 'Jouer N parties', desc: 'La régularité paie.', icon: '🎮' },
    { type: 'score', title: 'Obtenir S points', desc: 'Vise le sommet !', icon: '⭐' },
    { type: 'drops', title: 'Récupérer D drops', desc: 'Ramasse des items.', icon: '📦' },
    { type: 'boss_kills', title: 'Vaincre B boss', desc: 'Chasseur de boss.', icon: '💀' }
];

const REWARDS = [
    { type: 'coins', amount: [50, 100, 150, 200, 300, 500], emoji: '🪙' },
    { type: 'gems', amount: [2, 5, 10, 15, 20], emoji: '💎' },
    { type: 'item', items: ['crate_basic', 'crate_rare', 'key_gold'], emoji: '🎁' }
];

function generateQuestPool(count) {
    const pool = [];
    for (let i = 0; i < count; i++) {
        const qType = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];
        const target = Math.floor(Math.random() * 50) + 10;
        const rewardType = REWARDS[Math.floor(Math.random() * REWARDS.length)];

        let reward = {};
        if (rewardType.type === 'item') {
            reward = { type: 'item', itemId: rewardType.items[Math.floor(Math.random() * rewardType.items.length)], amount: 1, emoji: rewardType.emoji };
        } else {
            reward = { type: rewardType.type, amount: rewardType.amount[Math.floor(Math.random() * rewardType.amount.length)], emoji: rewardType.emoji };
        }

        pool.push({
            id: `q_auto_${i}`,
            title: qType.title.replace('X', target * 10).replace('N', target).replace('S', target * 100).replace('D', Math.floor(target / 5)).replace('B', Math.floor(target / 10) || 1),
            description: qType.desc,
            type: qType.type,
            target: qType.type === 'xp' ? target * 10 : (qType.type === 'score' ? target * 100 : target),
            reward: reward
        });
    }
    return pool;
}

export const QUEST_POOL = generateQuestPool(220);

// Sélectionner 5 quêtes aléatoires pour le jour
export function getRandomDailyQuests(count = 5) {
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export const WEEKLY_CHALLENGES = [
    {
        id: 'weekly_kills_200',
        title: 'Éliminer 200 ennemis',
        description: 'Défi de la semaine.',
        type: 'kills', target: 200,
        reward: { type: 'gems', amount: 25, emoji: '💎' },
    },
    {
        id: 'weekly_event_1',
        title: 'Éveil de la saison (Survie)',
        description: 'Atteindre la vague 30 pour l\'événement.',
        type: 'wave', target: 30,
        reward: { type: 'eventTokens', amount: 100, emoji: '🎟️' },
    },
    {
        id: 'weekly_event_2',
        title: 'Éveil de la saison (Boss)',
        description: 'Éliminer 10 Boss.',
        type: 'boss_kills', target: 10,
        reward: { type: 'eventTokens', amount: 150, emoji: '🎟️' },
    }
];

// NOUVEAU v0.2.6 : Quêtes Mensuelles
export const MONTHLY_QUESTS = [
    {
        id: 'monthly_free_1',
        title: 'Maître Galactique (Mensuel)',
        description: 'Éliminer 1000 ennemis ce mois-ci.',
        type: 'kills', target: 1000,
        reward: { type: 'gems', amount: 100, emoji: '💎' },
        cost: 0
    },
    {
        id: 'monthly_paid_1',
        title: 'Collectionneur d\'Or (Elite)',
        description: 'Obtenir 50 000 points de score.',
        type: 'score', target: 50000,
        reward: { type: 'coins', amount: 5000, emoji: '🪙' },
        cost: 200
    },
    {
        id: 'monthly_paid_2',
        title: 'Survivant Ultime (Elite)',
        description: 'Vaincre 50 Boss.',
        type: 'boss_kills', target: 50,
        reward: { type: 'item', itemId: 'crate_epic', amount: 1, emoji: '🎁' },
        cost: 200
    }
];

export const QUEST_DAILY_COMPLETION_REWARD = {
    gems: 15,
    emoji: '💎',
};

export function generateDailyResetTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
}

export function formatTimeRemaining(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}
