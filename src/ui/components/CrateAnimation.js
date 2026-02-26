/* ============================
   DROPER — Crate Opening Animation
   ============================ */

import { toast } from './ToastManager.js';

export class CrateAnimation {
    static show(rewards, onClose) {
        const overlay = document.createElement('div');
        overlay.className = 'crate-overlay';
        overlay.innerHTML = `
      <div class="crate-scene" id="crate-scene">
        <div class="crate-box" id="crate-box">
          <span class="crate-box__emoji">📦</span>
          <div class="crate-box__glow"></div>
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

        // Phase 1 — Shake on click
        box.addEventListener('click', () => {
            if (opened) return;
            opened = true;

            box.classList.add('crate-box--shaking');
            text.textContent = '✨ Ouverture...';

            // Phase 2 — Explode after shake
            setTimeout(() => {
                box.classList.remove('crate-box--shaking');
                box.classList.add('crate-box--explode');

                // Spawn particles
                CrateAnimation.spawnParticles(overlay);

                // Phase 3 — Show rewards
                setTimeout(() => {
                    box.style.display = 'none';
                    text.style.display = 'none';

                    rewardsEl.style.display = 'flex';
                    rewardsEl.innerHTML = `
            <div class="crate-rewards__title">🎉 Récompenses !</div>
            <div class="crate-rewards__grid">
              ${rewards.map(r => {
                        const emoji = r.type === 'coins' ? '🪙' : r.type === 'gems' ? '💎' : '🎁';
                        const label = r.type === 'coins' ? `${r.amount} Pièces`
                            : r.type === 'gems' ? `${r.amount} Gemmes`
                                : r.itemId ? `x${r.amount}` : `${r.amount}`;
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
            }, 800);
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

    static spawnParticles(overlay) {
        const colors = ['#fbbf24', '#4a9eff', '#a855f7', '#22c55e', '#ef4444', '#ffffff'];
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
