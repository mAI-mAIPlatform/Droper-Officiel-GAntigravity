/* ============================
   DROPER — LeaderboardWidget 🏆 (v0.9.6)
   Composant réutilisable de classement
   ============================ */

export class LeaderboardWidget {
    constructor(title, entries = [], options = {}) {
        this.title = title;
        this.entries = entries; // Array of { name, value, emoji, color, isHighlighted }
        this.maxEntries = options.maxEntries || 10;
        this.valueLabel = options.valueLabel || '';
        this.highlightColor = options.highlightColor || 'var(--color-accent-cyan)';
        this.emptyMessage = options.emptyMessage || 'Aucune donnée disponible';
    }

    render() {
        const sorted = [...this.entries].sort((a, b) => b.value - a.value).slice(0, this.maxEntries);
        const maxVal = sorted.length > 0 ? sorted[0].value : 1;

        if (sorted.length === 0) {
            return `
                <div class="card" style="padding: 20px; text-align: center;">
                    <p style="color: var(--color-text-muted); font-size: 0.75rem;">${this.emptyMessage}</p>
                </div>
            `;
        }

        return `
            <div class="card leaderboard-widget anim-fade-in-up" style="padding: 0; overflow: hidden;">
                <div style="
                    padding: 12px 15px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex; align-items: center; justify-content: space-between;
                ">
                    <h4 style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); margin: 0;">
                        🏆 ${this.title}
                    </h4>
                    ${this.valueLabel ? `<span style="font-size: 0.6rem; color: var(--color-text-muted); text-transform: uppercase;">${this.valueLabel}</span>` : ''}
                </div>
                <div style="padding: 8px 0;">
                    ${sorted.map((entry, i) => this.renderEntry(entry, i, maxVal)).join('')}
                </div>
            </div>
        `;
    }

    renderEntry(entry, index, maxVal) {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = index < 3 ? medals[index] : `<span style="font-size: 0.7rem; color: var(--color-text-muted); width: 20px; display: inline-block; text-align: center;">${index + 1}</span>`;
        const barPct = maxVal > 0 ? (entry.value / maxVal) * 100 : 0;
        const isHighlighted = entry.isHighlighted;
        const entryColor = entry.color || (isHighlighted ? this.highlightColor : 'var(--color-text-secondary)');

        return `
            <div class="leaderboard-entry" style="
                padding: 8px 15px;
                display: flex; align-items: center; gap: 10px;
                ${isHighlighted ? `background: rgba(0, 247, 255, 0.04); border-left: 3px solid ${this.highlightColor};` : 'border-left: 3px solid transparent;'}
                transition: background 0.2s;
            ">
                <div style="min-width: 24px; text-align: center; font-size: 0.9rem;">${medal}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
                        <span style="
                            font-size: 0.75rem; font-weight: ${isHighlighted ? '800' : '600'};
                            color: ${isHighlighted ? entryColor : 'inherit'};
                            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                        ">
                            ${entry.emoji ? `<span style="margin-right: 4px;">${entry.emoji}</span>` : ''}
                            ${entry.name}
                        </span>
                        <span style="
                            font-size: 0.8rem; font-weight: 900;
                            color: ${entryColor};
                            margin-left: 8px; white-space: nowrap;
                        ">
                            ${entry.value.toLocaleString('fr-FR')}
                        </span>
                    </div>
                    <div style="
                        height: 3px; border-radius: 2px;
                        background: rgba(255,255,255,0.06);
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${barPct}%; height: 100%;
                            background: ${entryColor};
                            border-radius: 2px;
                            transition: width 0.5s ease;
                        "></div>
                    </div>
                </div>
            </div>
        `;
    }
}
