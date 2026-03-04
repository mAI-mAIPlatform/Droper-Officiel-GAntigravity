/* ============================
   DROPER — Hero Details Page (v1.0.0)
   ============================ */

import { getHeroById, RARITIES } from '../../data/heroes.js';
import { StatCard } from '../components/StatCard.js';

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

        return `
            <div class="page page--hero-details anim-fade-in" style="padding-bottom: 80px;">
                <div class="page__header row row--between" style="margin-bottom: 20px;">
                    <button class="btn btn--outline" id="btn-back-armory" style="padding: 8px 15px; font-size: 0.7rem;">← ARMURERIE</button>
                    <div class="badge" style="background: ${rarity.color}22; color: ${rarity.color}; border: 1px solid ${rarity.color}; padding: 4px 12px; border-radius: 20px; font-size: 0.65rem; font-weight: 800;">
                        ${rarity.label ? rarity.label.toUpperCase() : 'COMMUN'}
                    </div>
                </div>

                <div class="hero-showcase stack" style="align-items: center; margin-top: 10px;">
                    <div class="hero-image-container" style="position: relative; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle, ${this.hero.bodyColor}33 0%, transparent 70%); border-radius: 50%;"></div>
                        <img src="${this.hero.portrait}" alt="${this.hero.name}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); z-index: 1;" />
                        
                        ${state.masteryTier === 'LÉGENDE' ? `
                            <div class="legend-aura-ui" style="position: absolute; inset: -15px; border: 2px solid var(--color-accent-gold); border-radius: 50%; box-shadow: 0 0 20px var(--color-accent-gold); animation: pulse-gold 2s infinite, rotate 10s linear infinite;"></div>
                        ` : ''}
                    </div>
                    <h1 style="font-size: 2.2rem; font-weight: 900; margin-top: 20px; letter-spacing: -1.5px; text-transform: uppercase;">${this.hero.name}</h1>
                    <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 4px; font-size: 0.7rem; color: var(--color-text-muted); margin-top: 5px;">
                        ${this.hero.class.toUpperCase()} — ${this.hero.description}
                    </div>
                </div>

                <!-- Maîtrise Section -->
                <div class="card" style="margin-top: 30px; border-left: 4px solid ${masteryColor}; background: rgba(255,255,255,0.02);">
                    <div class="row row--between" style="margin-bottom: 12px; align-items: baseline;">
                        <span style="color: ${masteryColor}; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px;">MAÎTRISE : ${state.masteryTier}</span>
                        <span style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">${state.wins || 0} Victoires</span>
                    </div>
                    <div class="progress-bar" style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden;">
                        <div class="progress-bar__fill" style="width: ${this.getMasteryProgress(state.wins)}%; background: ${masteryColor}; box-shadow: 0 0 10px ${masteryColor};"></div>
                    </div>
                    <p style="font-size: 0.6rem; color: var(--color-text-muted); margin-top: 8px;">Gagne des trophées avec ce héros pour débloquer l'aura Légendaire !</p>
                </div>

                <!-- Stats Grid -->
                <div class="grid-2" style="margin-top: 25px; gap: 12px;">
                    ${new StatCard('❤ VIE', this.hero.stats.hp, { color: 'var(--color-accent-red)' }).render()}
                    ${new StatCard('⚔ DÉGÂTS', this.hero.stats.attack, { color: 'var(--color-accent-gold)' }).render()}
                    ${new StatCard('🛡 DÉFENSE', this.hero.stats.defense, { color: 'var(--color-accent-blue)' }).render()}
                    ${new StatCard('⚡ VITESSE', Math.round(this.hero.stats.speed * 100), { color: 'var(--color-accent-green)' }).render()}
                </div>

                <!-- Capacities -->
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

                <!-- Lore / Histoire du Héros -->
                ${this.hero.story ? `
                    <h3 style="font-size: 0.8rem; font-weight: 800; color: var(--color-text-muted); margin-top: 35px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">📖 Histoire</h3>
                    <div class="card" style="padding: 20px; background: rgba(255,255,255,0.02); border-left: 4px solid ${this.hero.bodyColor};">
                        <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.7; font-style: italic;">
                            "${this.hero.story}"
                        </p>
                    </div>
                ` : ''}
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
    }
}
