/* ============================
   DROPER — Hero Details Page (v1.0.0)
   ============================ */

import { getHeroById, RARITIES } from '../../data/heroes.js';
import { StatCard } from '../components/StatCard.js';
import { MASTERY_REWARDS, getMasteryReward } from '../../data/masteryRewards.js';
import { toast } from '../components/ToastManager.js';

export class HeroDetailsPage {
    constructor(app) {
        this.app = app;
        this.heroId = this.app.playerManager.selectedHeroDetails || 'soldier';
        this.hero = this.app.heroManager.getFullHero(this.heroId);
    }

    render() {
        if (!this.hero) return `<div class="page">Héros introuvable</div>`;

        const state = this.hero.state;
        const rarity = this.hero.rarity || RARITIES.COMMON;
        const masteryColor = this.getMasteryColor(state.masteryTier);

        // Maîtrise Section v1.1.4
        const masteryXp = state.masteryXp || 0;
        const masteryLevel = state.masteryLevel || 1;
        const xpNeeded = 1000; // Constante de la route

        return `
            <div class="page page--hero-details anim-fade-in" style="padding-bottom: 80px;">
                <div class="page__header row row--between" style="margin-bottom: 20px;">
                    <button class="btn btn--outline" id="btn-back-armory" style="padding: 8px 15px; font-size: 0.7rem;">← ARMURERIE</button>
                    <div class="badge" style="background: ${rarity.color}22; color: ${rarity.color}; border: 1px solid ${rarity.color}; padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 800;">
                        ${(rarity?.label || 'COMMUN').toUpperCase()}
                    </div>
                </div>

                <div class="hero-showcase stack" style="align-items: center; margin-top: 10px;">
                    <div class="hero-image-container" style="position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle, ${this.hero.bodyColor}33 0%, transparent 70%); border-radius: 50%;"></div>
                        ${(this.hero.portrait || this.hero.coverImage) ?
                `<img src="${this.hero.portrait || this.hero.coverImage}" alt="${this.hero.name}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); z-index: 1;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />` :
                `<div style="display:none"></div>`
            }
                        <span style="font-size: 5rem; display: ${(this.hero.portrait || this.hero.coverImage) ? 'none' : 'inline-block'}; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));" class="hero-emoji-anim">${this.hero.emoji}</span>
                        
                        ${state.masteryTier === 'LÉGENDE' ? `
                            <div class="legend-aura-ui" style="position: absolute; inset: -15px; border: 2px solid var(--color-accent-gold); border-radius: 50%; box-shadow: 0 0 20px var(--color-accent-gold); animation: pulse-gold 2s infinite, rotate 10s linear infinite;"></div>
                        ` : ''}
                    </div>
                    <h1 style="font-size: 2.2rem; font-weight: 900; margin-top: 20px; letter-spacing: -1.5px; text-transform: uppercase;">${this.hero.name}</h1>
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 700; margin-top: 5px; opacity: 0.8; letter-spacing: 1px;">
                            ${(this.hero.archetype?.label || 'COMMUN').toUpperCase()} — NV.${state.level}
                        </div>
                </div>

                <!-- Mastery Road v1.1.4 -->
                <div class="section" style="margin-top: 35px;">
                  <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-text-muted); margin-bottom: 15px; text-transform: uppercase;">🛤️ ROUTE DE MAÎTRISE</h3>
                  <div class="card" style="padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px;">
                    <div class="row row--between" style="margin-bottom: 10px;">
                      <strong style="color: var(--color-accent-gold);">Niveau ${masteryLevel}</strong>
                      <span style="font-size: 0.7rem; color: var(--color-text-muted);">${masteryXp} / ${xpNeeded} XP</span>
                    </div>
                    <div class="progress-bar" style="height: 10px; border-radius: 5px; background: rgba(255,255,255,0.05);">
                        <div class="progress-bar__fill" style="width: ${(masteryXp / xpNeeded) * 100}%; background: linear-gradient(90deg, #f59e0b, #fbbf24); box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);"></div>
                    </div>
                    
                    <div class="row" style="margin-top: 20px; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
                      ${Object.entries(MASTERY_REWARDS).map(([lvl, reward]) => {
                const level = parseInt(lvl);
                const isClaimed = state.claimedMasteryRewards?.includes(level);
                const isUnlocked = masteryLevel >= level;
                const canClaim = isUnlocked && !isClaimed;

                return `
                          <div class="reward-node ${canClaim ? 'reward-node--can-claim' : ''}" 
                               style="flex: 0 0 80px; text-align: center; background: ${isUnlocked ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.02)'}; 
                                      padding: 10px; border-radius: 12px; border: 1px solid ${canClaim ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.05)'}; 
                                      position: relative; cursor: ${canClaim ? 'pointer' : 'default'}"
                               data-level="${level}">
                             <div style="font-size: 0.6rem; color: var(--color-text-muted); margin-bottom: 5px;">NV.${level}</div>
                             <div style="font-size: 1.5rem;">${reward.emoji}</div>
                             ${isClaimed ? '<div style="position: absolute; top:0; right:0; background: var(--color-accent-green); width: 18px; height: 18px; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; z-index: 2;">✓</div>' : ''}
                          </div>
                        `;
            }).join('')}
                    </div>
                  </div>
                </div>

                <!--Stats Grid-->
                <div class="grid-2" style="margin-top: 25px; gap: 12px;">
                    ${new StatCard('❤ VIE', this.hero.stats.hp, '❤️').render()}
                    ${new StatCard('⚔ DÉGÂTS', this.hero.stats.attack, '⚔️').render()}
                    ${new StatCard('🛡 DÉFENSE', this.hero.stats.defense, '🛡️').render()}
                    ${new StatCard('⚡ VITESSE', Math.round(this.hero.stats.speed * 100), '⚡').render()}
                </div>

                <!--Capacities -->
                <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-text-muted); margin-top: 35px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Capacités</h3>
                
                <div class="stack" style="gap: 12px;">
                    <div class="card" style="padding: 15px; background: rgba(255,255,255,0.03);">
                        <div class="row" style="gap: 15px; align-items: center;">
                            <div style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">🎯</div>
                            <div style="flex: 1;">
                                <strong style="font-size: 0.85rem; display: block; margin-bottom: 3px;">Attaque de Base</strong>
                                <p style="font-size: 0.7rem; color: var(--color-text-muted); line-height: 1.4;">Tir principal infligeant ${this.hero.stats.attack} dégâts avec une cadence de tir optimisée.</p>
                            </div>
                        </div>
                    </div>

                    ${this.hero.ultimate ? `
                        <div class="card" style="padding: 15px; border-left: 4px solid var(--color-accent-cyan); background: rgba(0, 247, 255, 0.05);">
                            <div class="row" style="gap: 15px; align-items: center;">
                                <div style="font-size: 1.8rem; background: rgba(0, 247, 255, 0.1); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px;">🔥</div>
                                <div style="flex: 1;">
                                    <strong style="font-size: 0.85rem; display: block; margin-bottom: 3px; color: var(--color-accent-cyan);">Ultime : ${this.hero.ultimate.name}</strong>
                                    <p style="font-size: 0.7rem; color: var(--color-text-muted); line-height: 1.4;">${this.hero.ultimate.description}</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!--Lore / Histoire du Héros-->
            ${this.hero.story ? `
                    <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-text-muted); margin-top: 35px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">📖 Histoire</h3>
                    <div class="card" style="padding: 20px; background: rgba(255,255,255,0.02); border-left: 4px solid ${this.hero.bodyColor};">
                        <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.7; font-style: italic;">
                            "${this.hero.story}"
                        </p>
                    </div>
                ` : ''
            }
            </div>
            `;
    }

    getMasteryColor(tier) {
        if (tier === 'LÉGENDE') return 'var(--color-accent-gold)';
        if (tier === 'MAÎTRE') return 'var(--color-accent-purple)';
        if (tier === 'EXPERT') return 'var(--color-accent-cyan)';
        if (tier === 'APPRENTI') return 'var(--color-accent-green)';
        return '#8b95a8';
    }

    getMasteryProgress(wins) {
        if (wins >= 50) return 100;
        if (wins >= 30) return ((wins - 30) / 20) * 100;
        if (wins >= 15) return ((wins - 15) / 15) * 100;
        if (wins >= 5) return ((wins - 5) / 10) * 100;
        return (wins / 5) * 100;
    }

    afterRender() {
        const btnBack = document.getElementById('btn-back-armory');
        if (btnBack) {
            btnBack.onclick = () => window.location.hash = '#armurerie';
        }

        // Mastery Claim logic
        document.querySelectorAll('[data-level]').forEach(el => {
            el.onclick = () => {
                const level = parseInt(el.dataset.level);
                const res = this.app.heroManager.claimMasteryReward(
                    this.heroId,
                    level,
                    this.app.economyManager,
                    this.app.inventoryManager,
                    this.app.skinManager,
                    this.app.emoteManager
                );
                if (res.success) {
                    this.refresh();
                } else if (res.reason) {
                    toast.error(res.reason);
                }
            };
        });
    }

    refresh() {
        const container = document.getElementById('page-container');
        if (container) {
            container.innerHTML = this.render();
            this.afterRender();
        }
    }
}
