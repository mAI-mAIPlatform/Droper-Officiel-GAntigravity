/* ============================
   DROPER — Composant ShopCard
   ============================ */

export class ShopCard {
    constructor(offer, canAfford = true) {
        this.offer = offer;
        this.canAfford = canAfford;
    }

    getCostLabel() {
        const { cost } = this.offer;
        if (cost.type === 'free') return 'GRATUIT';
        if (cost.type === 'gems') return `${cost.amount} 💎`;
        if (cost.type === 'coins') return `${cost.amount} 🪙`;
        return `${cost.amount}`;
    }

    getCostBtnClass() {
        if (this.offer.cost.type === 'free') return 'btn--green';
        return 'btn--purple';
    }

    getRewardLabel() {
        const { reward } = this.offer;
        if (reward.type === 'coins') return `+${reward.amount} 🪙`;
        if (reward.type === 'gems') return `+${reward.amount} 💎`;
        if (reward.type === 'mixed') {
            const parts = [];
            if (reward.coins) parts.push(`+${reward.coins} 🪙`);
            if (reward.gems) parts.push(`+${reward.gems} 💎`);
            return parts.join(' ');
        }
        if (reward.type === 'boost') return `XP x${reward.multiplier}`;
        return '';
    }

    render() {
        return `
      <div class="card card--shop anim-fade-in-up" data-offer-id="${this.offer.id}">
        <div class="icon-circle icon-circle--large">
          ${this.offer.emoji}
        </div>
        <strong style="font-size: var(--font-size-md); font-weight: 700;">
          ${this.offer.name}
        </strong>
        <span style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          ${this.getRewardLabel()}
        </span>
        <button class="btn ${this.getCostBtnClass()}" 
                data-buy-id="${this.offer.id}"
                ${!this.canAfford && this.offer.cost.type !== 'free' ? 'disabled style="opacity:0.5"' : ''}>
          ${this.getCostLabel()}
        </button>
      </div>
    `;
    }
}
