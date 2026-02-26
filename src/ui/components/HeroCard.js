/* ============================
   DROPER — Composant HeroCard
   ============================ */

export class HeroCard {
    constructor(hero, heroState, options = {}) {
        this.hero = hero;
        this.state = heroState;
        this.onClick = options.onClick || null;
        this.selected = options.selected || false;
    }

    render() {
        const isUnlocked = this.state.unlocked;
        const level = this.state.level || 1;

        return `
      <div class="card card--hero anim-fade-in-up ${this.selected ? 'anim-glow' : ''} ${!isUnlocked ? 'card--locked' : ''}"
           data-hero-id="${this.hero.id}"
           style="${!isUnlocked ? 'opacity: 0.5; pointer-events: none;' : ''}
                  ${this.selected ? 'border-color: var(--color-accent-blue);' : ''}">
        <span class="badge ${this.hero.rarity.cssClass}" 
              style="position: absolute; top: 10px; right: 10px;">
          ${this.hero.rarity.label}
        </span>
        <div class="icon-circle icon-circle--large">
          ${this.hero.emoji}
        </div>
        <strong style="font-size: var(--font-size-lg); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          ${this.hero.name}
        </strong>
        <span style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          ${this.hero.description}
        </span>
        <span class="badge badge--level">Niv. ${level}</span>
      </div>
    `;
    }
}
