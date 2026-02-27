/* ============================
   DROPER — Crate Opening Animation
   ============================ */

import { toast } from './ToastManager.js';
import { getItemById } from '../../data/inventory.js';

export class CrateAnimation {
  static show(rewards, onClose, safeRarity = 1) {
    const rarityColors = {
      1: '#8b95a8', // Common
      2: '#4a9eff', // Rare
      3: '#a855f7', // Epic
      4: '#a855f7', // Mythique (Violet)
      5: '#eab308', // Légendaire (Jaune)
      6: '#06b6d4'  // Ultra (Cyan)
    };
    const glowColor = rarityColors[safeRarity] || rarityColors[1];

    const overlay = document.createElement('div');
    overlay.className = 'crate-overlay';
    overlay.innerHTML = `
      <div class="crate-scene" id="crate-scene">
        <div class="crate-box" id="crate-box">
          <span class="crate-box__emoji">📦</span>
          <div class="crate-box__glow" style="background: radial-gradient(circle, ${glowColor} 0%, transparent 70%); opacity: 0.6;"></div>
        </div>
        <div class="crate-text" id="crate-text">Clique pour ouvrir !</div>
        <div class="crate-rewards" id="crate-rewards" style="display: none;"></div>
        <button class="btn btn--accent crate-close" id="crate-close" style="display: none;">
          ✓ Récupérer
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    let opened = false;
    const box = overlay.querySelector('#crate-box');
    const text = overlay.querySelector('#crate-text');
    const rewardsEl = overlay.querySelector('#crate-rewards');
    const closeBtn = overlay.querySelector('#crate-close');

    // Phase 1 — Multi-click upgrade mechanic
    let clickCount = 0;
    const targetClicks = 5;

    box.addEventListener('click', () => {
      if (opened) return;

      clickCount++;

      // Visual feedback for each click
      box.classList.add('crate-box--shaking');
      setTimeout(() => box.classList.remove('crate-box--shaking'), 200);

      // Upgrade simulation
      const currentLevel = Math.min(safeRarity + Math.floor(clickCount / 1.5), 6);
      const currentColor = rarityColors[currentLevel] || glowColor;
      box.querySelector('.crate-box__glow').style.background = `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`;

      if (clickCount < targetClicks) {
        text.textContent = `⚡ Énergie : ${clickCount}/${targetClicks}`;
        if (window.app && window.app.audioManager) {
          window.app.audioManager.playSound('click');
        }
        return;
      }

      opened = true;
      text.textContent = '✨ Explosion !';

      // Phase 2 — Explode after last click
      setTimeout(() => {
        box.classList.add('crate-box--explode');

        // Play impact sound based on rarity
        if (window.app && window.app.audioManager) {
          for (let s = 0; s < Math.min(currentLevel, 4); s++) {
            setTimeout(() => window.app.audioManager.playPurchase(), s * 100);
          }
        }

        // Spawn particles with current color
        CrateAnimation.spawnParticles(overlay, currentColor);

        // Phase 3 — Show rewards
        setTimeout(() => {
          box.style.display = 'none';
          text.style.display = 'none';

          rewardsEl.style.display = 'flex';
          rewardsEl.innerHTML = `
            <div class="crate-rewards__title">🎉 Récompenses !</div>
            <div class="crate-rewards__grid">
              ${rewards.map(r => {
            let emoji = r.type === 'coins' ? '🪙' : r.type === 'gems' ? '💎' : r.type === 'skin' ? '👕' : r.type === 'emote' ? '💬' : '🎁';
            let label = r.type === 'coins' ? `${r.amount} Pièces`
              : r.type === 'gems' ? `${r.amount} Gemmes`
                : r.type === 'skin' ? `${r.name}`
                  : r.type === 'emote' ? `${r.emoji} ${r.name}`
                    : r.itemId ? `x${r.amount}` : `${r.amount}`;

            // Si c'est un vrai item d'inventaire
            if (r.type === 'item') {
              const def = getItemById(r.itemId);
              if (def) {
                emoji = def.emoji;
                label = `${def.name} x${r.amount}`;
              }
            }

            return `
                  <div class="crate-reward-item anim-fade-in-up">
                    <span style="font-size: 2rem;">${emoji}</span>
                    <span style="font-size: var(--font-size-sm); font-weight: 700;">${label}</span>
                  </div>
                `;
          }).join('')}
            </div>
          `;

          closeBtn.style.display = 'block';
        }, 600);
      }, 300);
    });

    // Close handler
    closeBtn.addEventListener('click', () => {
      overlay.classList.add('crate-overlay--exit');
      setTimeout(() => {
        overlay.remove();
        if (onClose) onClose();
      }, 300);
    });
  }

  static spawnParticles(overlay, baseColor) {
    const colors = [baseColor, '#ffffff', '#fbbf24', baseColor];
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'crate-particle';
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 4 + Math.random() * 6;

      particle.style.cssText = `
        position: absolute; top: 50%; left: 50%;
        width: ${size}px; height: ${size}px;
        background: ${color}; border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: crate-particle-fly 0.6s ease-out forwards;
        --dx: ${dx}px; --dy: ${dy}px;
      `;
      overlay.querySelector('#crate-scene').appendChild(particle);
    }
  }
}
