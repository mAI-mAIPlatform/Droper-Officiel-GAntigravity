/* ============================
   DROPER — Données Tournois Communautaires
   ============================ */

export const TOURNAMENTS = [
    {
        id: 'tournament_mars_2026',
        name: 'Tournoi de Mars 2026',
        emoji: '🏆',
        month: 3,
        year: 2026,
        mode: 'prime_digitale',
        teamSize: 3,
        maxTeams: 8,
        status: 'upcoming',
        startDate: '01/03/2026',
        endDate: '31/03/2026',
        description: 'Tournoi mensuel en Prime Digitale. 8 équipes, bracket à élimination directe !',
        rounds: ['Quarts de finale', 'Demi-finales', 'Finale'],
        rewards: {
            first: { coins: 5000, gems: 200, emoji: '🥇', label: '🥇 1er — 5000 🪙 + 200 💎' },
            second: { coins: 2500, gems: 100, emoji: '🥈', label: '🥈 2ème — 2500 🪙 + 100 💎' },
            third: { coins: 1000, gems: 50, emoji: '🥉', label: '🥉 3ème — 1000 🪙 + 50 💎' },
            participation: { coins: 200, gems: 10, emoji: '🎫', label: '🎫 Participation — 200 🪙 + 10 💎' },
        },
        bracket: [],
    },
    {
        id: 'tournament_avril_2026',
        name: 'Tournoi d\'Avril 2026',
        emoji: '⚡',
        month: 4,
        year: 2026,
        mode: 'zone_surcharge',
        teamSize: 3,
        maxTeams: 8,
        status: 'upcoming',
        startDate: '01/04/2026',
        endDate: '30/04/2026',
        description: 'Tournoi stratégique en Zone de Surcharge !',
        rounds: ['Quarts de finale', 'Demi-finales', 'Finale'],
        rewards: {
            first: { coins: 5000, gems: 200, emoji: '🥇', label: '🥇 1er' },
            second: { coins: 2500, gems: 100, emoji: '🥈', label: '🥈 2ème' },
            third: { coins: 1000, gems: 50, emoji: '🥉', label: '🥉 3ème' },
            participation: { coins: 200, gems: 10, emoji: '🎫', label: '🎫 Participation' },
        },
        bracket: [],
    },
];

export function getCurrentTournament() {
    const now = new Date();
    return TOURNAMENTS.find(t =>
        t.month === now.getMonth() + 1 && t.year === now.getFullYear()
    ) || TOURNAMENTS[0];
}

export function getUpcomingTournaments() {
    return TOURNAMENTS.filter(t => t.status === 'upcoming' || t.status === 'active');
}
