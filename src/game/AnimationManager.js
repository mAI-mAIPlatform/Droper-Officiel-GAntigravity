/* ============================
   DROPER — Animation Manager
   ============================ */

export class AnimationManager {
    constructor(engine) {
        this.engine = engine;
        this.ctx = engine.ctx;
        this.activeAnimations = [];
    }

    triggerIntro(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'game-intro-overlay';
        overlay.innerHTML = `
            <div class="intro-content">
                <div class="intro-title">PRÉPAREZ-VOUS</div>
                <div class="intro-count">3</div>
            </div>
        `;
        document.body.appendChild(overlay);

        const countEl = overlay.querySelector('.intro-count');
        let count = 3;

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countEl.textContent = count;
                countEl.classList.remove('pulse');
                void countEl.offsetWidth; // Force reflow
                countEl.classList.add('pulse');
            } else if (count === 0) {
                countEl.textContent = "GO!";
                countEl.style.color = "var(--color-accent-green)";
            } else {
                clearInterval(interval);
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.remove();
                    if (callback) callback();
                }, 500);
            }
        }, 1000);
    }

    triggerVictory(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'game-end-overlay victory';
        overlay.innerHTML = `
            <div class="end-content">
                <div class="end-title anim-bounce">VICTOIRE !</div>
                <div class="end-subtitle">TOP 1</div>
                <button class="btn btn--accent btn-continue">CONTINUER</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.btn-continue').onclick = () => {
            overlay.remove();
            if (callback) callback();
        };
    }

    triggerDefeat(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'game-end-overlay defeat';
        overlay.innerHTML = `
            <div class="end-content">
                <div class="end-title anim-shake">DÉFAITE</div>
                <div class="end-subtitle">ESSAYE ENCORE</div>
                <button class="btn btn--accent btn-continue">RETOUR</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.btn-continue').onclick = () => {
            overlay.remove();
            if (callback) callback();
        };
    }
}
