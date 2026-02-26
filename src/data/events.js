/* ============================
   DROPER — Événements Temporaires
   ============================ */

export const TEMP_EVENTS = [
    {
        id: 'boss_robot_coop',
        name: 'Boss Robot — Coop',
        emoji: '🤖',
        type: 'coop',
        teamSize: 5,
        description: '5 joueurs contre un Boss Robot géant ! Travaillez ensemble pour le vaincre.',
        rules: [
            'Le Boss a 10 000 PV',
            'Il change de pattern toutes les 20 secondes',
            'Pas de respawn — survie en équipe',
        ],
        reward: { type: 'item', itemId: 'crate_epic', amount: 2, emoji: '✨' },
        active: false,
        schedule: 'Weekend spécial',
    },
    {
        id: '5v5_weekend',
        name: 'Week-end 5v5',
        emoji: '⚔️',
        type: 'team',
        teamSize: 5,
        description: '5 contre 5 en mode Prime Digitale amélioré !',
        rules: [
            '10 joueurs (5v5)',
            'Map élargie',
            'Records doublés',
        ],
        reward: { type: 'gems', amount: 50, emoji: '💎' },
        active: false,
        schedule: 'Chaque samedi et dimanche',
    },
    {
        id: 'double_records',
        name: 'Double Records',
        emoji: '🎫',
        type: 'bonus',
        teamSize: null,
        description: 'Tous les Records gagnés sont doublés pendant l\'événement !',
        rules: [
            'Valable sur tous les modes',
            'Durée : 24 heures',
        ],
        reward: { type: 'coins', amount: 500, emoji: '🪙' },
        active: true,
        schedule: 'Événement flash',
    },
    {
        id: 'nanopuce_rush',
        name: 'Rush Nanopuces',
        emoji: '💎',
        type: 'event_mode',
        teamSize: 3,
        description: 'Mode Nanopuces avec 20 puces au lieu de 10 et respawn instantané !',
        rules: [
            '20 puces au lieu de 10',
            'Respawn instantané',
            'Timer réduit à 10 secondes',
        ],
        reward: { type: 'item', itemId: 'crate_rare', amount: 1, emoji: '🎁' },
        active: false,
        schedule: 'Événement saisonnier',
    },
];

export function getActiveEvents() {
    return TEMP_EVENTS.filter(e => e.active);
}
