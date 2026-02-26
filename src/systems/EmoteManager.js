/* ============================
   DROPER — Emote Manager 😎
   ============================ */

import { EMOTES, getEmoteByKey } from '../data/emotes.js';

export class EmoteManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.data = null;
        this.activeEmote = null;
        this.emoteTimer = 0;
    }

    load() {
        this.data = this.save.get('emotes') || {
            owned: ['emote_gg', 'emote_rage', 'emote_laugh', 'emote_thumbsup', 'emote_rip'],
            equipped: [1, 2, 3, 4, 5].map(key => EMOTES.find(e => e.key === key)?.id || null),
        };
    }

    persist() {
        this.save.set('emotes', this.data);
    }

    isOwned(emoteId) {
        return this.data.owned.includes(emoteId);
    }

    triggerByKey(key) {
        const emoteId = this.data.equipped[key - 1];
        if (!emoteId) return null;
        const emote = EMOTES.find(e => e.id === emoteId);
        if (!emote) return null;
        this.activeEmote = emote;
        this.emoteTimer = 2.0;
        return emote;
    }

    update(dt) {
        if (this.emoteTimer > 0) {
            this.emoteTimer -= dt;
            if (this.emoteTimer <= 0) {
                this.activeEmote = null;
            }
        }
    }

    draw(ctx, x, y) {
        if (!this.activeEmote || this.emoteTimer <= 0) return;

        const alpha = Math.min(1, this.emoteTimer);
        const float = (2 - this.emoteTimer) * 15;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.activeEmote.emoji, x, y - 25 - float);

        ctx.font = 'bold 8px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(this.activeEmote.label, x, y - 12 - float);
        ctx.restore();
    }

    equipSlot(slotIndex, emoteId) {
        if (!this.isOwned(emoteId)) return false;
        this.data.equipped[slotIndex] = emoteId;
        this.persist();
        return true;
    }

    getEquipped() {
        return this.data.equipped.map(id => EMOTES.find(e => e.id === id) || null);
    }
}
