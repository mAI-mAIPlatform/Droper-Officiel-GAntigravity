/* ============================
   DROPER — Progression Graph (v0.9.2)
   ============================ */

export class ProgressionGraph {
    constructor(data = [], options = {}) {
        this.data = data; // Array of { label: string, value: number }
        this.width = options.width || 400;
        this.height = options.height || 180;
        this.padding = options.padding || 35;
        this.color = options.color || 'var(--color-accent-cyan)';
        this.label = options.label || 'Performance';
    }

    render() {
        if (!this.data || this.data.length < 2) {
            return `
                <div class="card" style="text-align: center; padding: 30px; border-color: rgba(255,255,255,0.05);">
                    <p style="color: var(--color-text-muted); font-size: 0.8rem;">Pas assez de données pour le graphique.</p>
                </div>
            `;
        }

        const maxVal = Math.max(...this.data.map(d => d.value), 5);
        const points = this.data.map((d, i) => {
            const x = this.padding + (i / (this.data.length - 1)) * (this.width - this.padding * 2);
            const y = (this.height - this.padding) - (d.value / maxVal) * (this.height - this.padding * 2);
            return { x, y };
        });

        // Generate SVG Path
        let pathD = "";
        let areaD = "";

        points.forEach((p, i) => {
            if (i === 0) {
                pathD += `M ${p.x} ${p.y}`;
                areaD += `M ${p.x} ${this.height - this.padding} L ${p.x} ${p.y}`;
            } else {
                pathD += ` L ${p.x} ${p.y}`;
                areaD += ` L ${p.x} ${p.y}`;
            }
        });

        areaD += ` L ${points[points.length - 1].x} ${this.height - this.padding} Z`;

        return `
            <div class="progression-graph anim-fade-in-up">
                <style>
                    .graph-tooltip { position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 100; }
                    .graph-point:hover + .graph-tooltip { opacity: 1; }
                </style>
                
                <h4 style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    📈 ${this.label}
                </h4>
                
                <div style="position: relative;">
                    <svg width="100%" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="none">
                        <!-- Dégradé -->
                        <defs>
                            <linearGradient id="grad-${this.label.replace(' ', '')}" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="${this.color}" stop-opacity="0.3" />
                                <stop offset="100%" stop-color="${this.color}" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        
                        <!-- Grilles horizontales -->
                        <line x1="${this.padding}" y1="${this.padding}" x2="${this.width - this.padding}" y2="${this.padding}" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                        <line x1="${this.padding}" y1="${(this.height - this.padding + this.padding) / 2}" x2="${this.width - this.padding}" y2="${(this.height - this.padding + this.padding) / 2}" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                        <line x1="${this.padding}" y1="${this.height - this.padding}" x2="${this.width - this.padding}" y2="${this.height - this.padding}" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                        
                        <!-- Remplissage -->
                        <path d="${areaD}" fill="url(#grad-${this.label.replace(' ', '')})" />
                        
                        <!-- Ligne de tendance -->
                        <path d="${pathD}" fill="none" stroke="${this.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));" />
                        
                        <!-- Points et Labels -->
                        ${points.map((p, i) => `
                            <circle class="graph-point" cx="${p.x}" cy="${p.y}" r="4" fill="${this.color}" stroke="#0a0e1a" stroke-width="2" />
                            <text x="${p.x}" y="${this.height - 10}" fill="var(--color-text-muted)" font-size="9" text-anchor="middle" font-family="Outfit, sans-serif">
                                ${this.data[i].label}
                            </text>
                            <text x="${this.padding - 10}" y="${p.y}" fill="var(--color-text-muted)" font-size="8" text-anchor="end" font-family="monospace">
                                ${i === 0 || i === points.length - 1 ? this.data[i].value : ''}
                            </text>
                        `).join('')}
                    </svg>
                </div>
            </div>
        `;
    }
}
