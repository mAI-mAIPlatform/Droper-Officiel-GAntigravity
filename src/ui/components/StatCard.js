/* ============================
   DROPER — Composant StatCard
   ============================ */

export class StatCard {
    constructor(label, value, emoji) {
        this.label = label;
        this.value = value;
        this.emoji = emoji;
    }

    render() {
        return `
      <div class="card card--stat anim-fade-in-up">
        <div class="icon-circle">
          ${this.emoji}
        </div>
        <span style="
          font-size: var(--font-size-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-secondary);
        ">${this.label}</span>
        <strong style="font-size: var(--font-size-2xl); font-weight: 800;">
          ${this.value}
        </strong>
      </div>
    `;
    }
}
