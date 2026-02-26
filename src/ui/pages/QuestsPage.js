/* ============================
   DROPER — Page Quêtes & Défis
   ============================ */

import { QuestItem } from '../components/QuestItem.js';
import { SearchBar } from '../components/SearchBar.js';
import { QUEST_DAILY_COMPLETION_REWARD } from '../../data/quests.js';

export class QuestsPage {
  constructor(app) {
    this.app = app;
  }

  render() {
    const questManager = this.app.questManager;
    const dailyQuests = questManager.getDailyQuests();
    const weeklyQuests = questManager.getWeeklyQuests();
    const monthlyQuests = questManager.getMonthlyQuests();
    const resetTime = questManager.getFormattedResetTime();
    const dailyReward = QUEST_DAILY_COMPLETION_REWARD;

    return `
      <div class="page">
        <div class="page__header">
          <h1 class="section-title">
            <span class="section-title__prefix">///</span> QUÊTES & DÉFIS
          </h1>
        </div>

        ${new SearchBar('Rechercher une quête...').render()}

        <!-- Quêtes du Jour -->
        <div class="section">
          <div class="quest-group anim-fade-in-up">
            <div class="quest-group__header">
              <div class="quest-group__title">
                📋 QUÊTES DU JOUR
                <span class="quest-group__timer">Reset: ${resetTime}</span>
              </div>
              <div class="quest-group__reward">
                🔄 ${dailyReward.gems} ${dailyReward.emoji}
              </div>
            </div>
            <div id="daily-quests">
              ${dailyQuests.map(q => new QuestItem(q).render()).join('')}
            </div>
          </div>
        </div>

        <!-- Défis Mensuels (NOUVEAU) -->
        <div class="section">
          <div class="quest-group anim-fade-in-up anim-delay-1" style="border-color: var(--color-accent-purple);">
            <div class="quest-group__header">
              <div class="quest-group__title">
                🗓️ DÉFIS MENSUELS (Elite)
              </div>
            </div>
            <div id="monthly-quests" class="stack" style="gap: 10px;">
              ${monthlyQuests.map(q => `
                <div class="quest-item-container">
                  ${!q.unlocked ? `
                    <div class="quest-lock-overlay">
                      <button class="btn btn--accent btn-buy-quest" data-id="${q.id}">DÉBLOQUER (${q.cost} 🪙)</button>
                    </div>
                  ` : ''}
                  ${new QuestItem(q).render()}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Défis Hebdomadaires -->
        ${weeklyQuests.length > 0 ? `
          <div class="section">
            <div class="quest-group anim-fade-in-up anim-delay-2">
              <div class="quest-group__header">
                <div class="quest-group__title">
                  🏆 DÉFIS HEBDOMADAIRES
                </div>
              </div>
              <div id="weekly-quests">
                ${weeklyQuests.map(q => new QuestItem(q).render()).join('')}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  afterRender() {
    // Recherche de quêtes
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.quest-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }
  }
}
