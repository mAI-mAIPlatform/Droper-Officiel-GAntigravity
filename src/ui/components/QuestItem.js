/* ============================
   DROPER — Composant QuestItem
   ============================ */

export class QuestItem {
    constructor(quest) {
        this.quest = quest;
    }

    getProgressPercent() {
        if (this.quest.target <= 0) return 100;
        return Math.min((this.quest.progress / this.quest.target) * 100, 100);
    }

    isComplete() {
        return this.quest.progress >= this.quest.target;
    }

    render() {
        const percent = this.getProgressPercent();
        const complete = this.isComplete();

        return `
      <div class="quest-item" style="
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--color-border-card);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
        ${complete ? 'opacity: 0.6;' : ''}
      " data-quest-id="${this.quest.id}">
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: var(--font-size-md); margin-bottom: 6px;">
            ${this.quest.title}
          </div>
          <div class="progress-bar">
            <div class="progress-bar__fill ${complete ? 'progress-bar__fill--gold' : ''}" 
                 style="width: ${percent}%"></div>
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 4px; text-align: right;">
            ${this.quest.progress}/${this.quest.target}
          </div>
        </div>
        <div style="
          color: ${complete ? 'var(--color-accent-gold)' : 'var(--color-accent-orange)'};
          font-weight: 700;
          font-size: var(--font-size-sm);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          +${this.quest.reward.amount} ${this.quest.reward.emoji}
        </div>
      </div>
    `;
    }
}
