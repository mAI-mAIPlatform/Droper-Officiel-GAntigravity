/* ============================
   DROPER — Theme Manager 🌈
   ============================ */

export const THEMES = {
    SEASON_1: {
        id: 'season_1',
        name: 'L\'Éveil',
        variables: {
            '--color-accent-blue': '#4a9eff',
            '--color-accent-gold': '#fbbf24',
            '--gradient-main': 'linear-gradient(135deg, #0a0e1a 0%, #0d1222 100%)',
            '--color-bg-primary': '#0a0e1a'
        }
    },
    SEASON_2: {
        id: 'season_2',
        name: 'Saison 2 (Coming Soon)',
        variables: {
            '--color-accent-blue': '#ff4a9e', // Pinkish
            '--color-accent-gold': '#24fbbf', // Cyan gold?
            '--gradient-main': 'linear-gradient(135deg, #1a0a0e 0%, #22120d 100%)', // Dark red theme
            '--color-bg-primary': '#1a0a0e'
        }
    }
};

export class ThemeManager {
    constructor() {
        this.currentTheme = 'SEASON_1';
    }

    apply(themeKey) {
        const theme = THEMES[themeKey];
        if (!theme) return;

        this.currentTheme = themeKey;
        const root = document.documentElement;

        Object.entries(theme.variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        console.log(`🎨 Thème appliqué : ${theme.name}`);
    }

    setSeasonalTheme(seasonId) {
        // Logic to automatically set theme based on season ID
        if (seasonId === 'season_2') this.apply('SEASON_2');
        else this.apply('SEASON_1');
    }
}
