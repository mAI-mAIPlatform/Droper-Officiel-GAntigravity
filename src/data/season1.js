/* ============================
   DROPER — Données Saison 1 : L'Éveil (v0.0.4 — lore étendu)
   ============================ */

export const SEASON_1 = {
    id: 'season_1',
    name: "L'Éveil",
    subtitle: 'La première saison de Droper',
    emoji: '🌅',
    banner: {
        title: "SAISON 1 : L'ÉVEIL",
        description: "Une nouvelle ère commence. Explore les mystères de l'Éveil, débloque des héros légendaires et récupère des récompenses exclusives.",
        color: '#d97706',
        gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
    },

    // Quêtes saisonnières
    seasonQuests: [
        {
            id: 'season_kills_500',
            title: 'Éliminateur de l\'Éveil',
            description: 'Élimine 500 ennemis durant la Saison 1.',
            type: 'kills', target: 500,
            reward: { type: 'item', itemId: 'crate_season', amount: 1, emoji: '🌅' },
        },
        {
            id: 'season_wave_15',
            title: 'Vétéran des Vagues',
            description: 'Atteins la vague 15 en une seule partie.',
            type: 'wave', target: 15,
            reward: { type: 'item', itemId: 'key_season', amount: 1, emoji: '🗝️' },
        },
        {
            id: 'season_games_50',
            title: 'Combattant Assidu',
            description: 'Joue 50 parties durant la Saison 1.',
            type: 'games', target: 50,
            reward: { type: 'gems', amount: 100, emoji: '💎' },
        },
        {
            id: 'season_score_5000',
            title: 'Maître du Score',
            description: 'Accumule 5000 points de score au total.',
            type: 'score', target: 5000,
            reward: { type: 'item', itemId: 'crate_epic', amount: 2, emoji: '✨' },
        },
        {
            id: 'season_boss_10',
            title: 'Chasseur de Boss',
            description: 'Défais 10 boss durant la Saison 1.',
            type: 'boss_kills', target: 10,
            reward: { type: 'item', itemId: 'fragment_season', amount: 10, emoji: '🌟' },
        },
    ],

    // Événements spéciaux
    events: [
        {
            id: 'event_double_xp',
            name: 'Week-end Double XP',
            emoji: '⚡',
            description: 'Tout l\'XP est doublé ce week-end !',
            active: true,
        },
        {
            id: 'event_boss_rush',
            name: 'Rush des Boss',
            emoji: '💀',
            description: 'Les boss apparaissent toutes les 3 vagues.',
            active: false,
        },
        {
            id: 'event_golden_hour',
            name: 'Heure Dorée',
            emoji: '🪙',
            description: 'Les pièces sont triplées pendant 1 heure.',
            active: false,
        },
    ],

    // Lore étendu — 10 chapitres
    lore: [
        {
            chapter: 1,
            title: 'Le Signal',
            text: "Un signal inconnu traverse la galaxie. Les capteurs de toutes les stations Droper s'affolent. Quelque chose vient de se réveiller aux confins de l'espace connu.",
        },
        {
            chapter: 2,
            title: 'Les Premiers Signes',
            text: "Les ennemis commencent à se comporter différemment. Leurs schémas d'attaque changent, comme s'ils étaient guidés par une intelligence supérieure. Les pilotes les plus expérimentés remarquent des anomalies dans les vagues.",
        },
        {
            chapter: 3,
            title: 'L\'Ancienne Énergie',
            text: "Des fragments de cristal apparaissent sur les champs de bataille. Ils émettent une lueur dorée pulsante, une énergie jamais vue auparavant. Les scientifiques les appellent « Fragments de l'Éveil ».",
        },
        {
            chapter: 4,
            title: 'Le Soldier Originel',
            text: "Le premier pilote Droper, le Soldier, ressent l'appel de cette énergie. Ses armes brillent d'un éclat nouveau. Il comprend que l'Éveil n'est pas une menace — c'est une opportunité.",
        },
        {
            chapter: 5,
            title: 'L\'Arrivée du Tank',
            text: "Un guerrier blindé émerge des profondeurs d'une station abandonnée. Le Tank, forgé par l'énergie de l'Éveil, rejoint les rangs des Dropers. Sa résistance est sans égale.",
        },
        {
            chapter: 6,
            title: 'La Chasse au Sniper',
            text: "Dans les ombres des nébuleuses, le Sniper observe. Ses tirs sont d'une précision chirurgicale. On dit qu'il peut toucher une cible à travers un champ d'astéroïdes. L'Éveil a aiguisé ses sens.",
        },
        {
            chapter: 7,
            title: 'Le Phantom',
            text: "Personne ne l'a vu venir. Le Phantom se matérialise là où on ne l'attend pas. L'énergie de l'Éveil lui permet de traverser les dimensions. Les ennemis tremblent face à l'invisible.",
        },
        {
            chapter: 8,
            title: 'La Menace Grandit',
            text: "Les boss deviennent plus puissants. Leurs stratégies évoluent. Ils ne foncent plus aveuglément — ils tirent, esquivent, encerclent. La guerre a changé de nature. Seuls les plus forts survivront.",
        },
        {
            chapter: 9,
            title: 'Les Caisses Mystérieuses',
            text: "Des caisses mystérieuses commencent à apparaître après chaque combat. Elles contiennent des trésors de l'ancien monde. Certaines nécessitent des clés dorées forgées dans le cœur des boss.",
        },
        {
            chapter: 10,
            title: 'L\'Éveil du Titan',
            text: "Au sommet du 50ème palier, une légende attend. Le Titan, arme ultime de l'Éveil, est le fruit de millénaires d'énergie accumulée. Celui qui l'éveille détiendra une puissance destructrice cataclysmique. L'histoire ne fait que commencer...",
        },
    ],
};
