/* ============================
   DROPER — Toast Manager
   ============================ */

let containerEl = null;

function ensureContainer() {
    if (containerEl && document.body.contains(containerEl)) return containerEl;
    containerEl = document.createElement('div');
    containerEl.className = 'toast-container';
    document.body.appendChild(containerEl);
    return containerEl;
}

const ICONS = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warn: '⚠️',
    reward: '🎁',
    unlock: '🔓',
    lock: '🔒',
};

export function showToast(message, type = 'info', duration = 3000) {
    const container = ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
    <span class="toast__icon">${ICONS[type] || ICONS.info}</span>
    <span class="toast__text">${message}</span>
  `;

    container.appendChild(toast);

    // Animation d'entrée
    requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        toast.classList.add('toast--exit');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Raccourcis
export const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warn: (msg, dur) => showToast(msg, 'warn', dur),
    reward: (msg, dur) => showToast(msg, 'reward', dur),
    unlock: (msg, dur) => showToast(msg, 'unlock', dur),
    lock: (msg, dur) => showToast(msg, 'lock', dur),
};
