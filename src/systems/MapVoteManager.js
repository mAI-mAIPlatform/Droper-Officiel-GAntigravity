/* ============================
   DROPER — Map Vote Manager 🗳️ (v0.9.6)
   Vote de maps pré-match
   ============================ */

import { MAPS } from '../data/maps.js';

export class MapVoteManager {
    constructor() {
        this.candidates = [];
        this.votes = {};
        this.timer = 10;
        this.isVoting = false;
        this.selectedMap = null;
        this.playerVote = null;
    }

    startVote(modeId) {
        this.isVoting = true;
        this.timer = 10;
        this.playerVote = null;
        this.votes = {};

        // Sélectionner 3 maps aléatoires
        const allMapIds = Object.keys(MAPS);
        const shuffled = allMapIds.sort(() => Math.random() - 0.5);
        this.candidates = shuffled.slice(0, 3).map(id => ({
            id,
            map: MAPS[id],
            votes: 0,
        }));

        // Les bots votent aléatoirement
        this.simulateBotVotes(7);
    }

    simulateBotVotes(botCount) {
        for (let i = 0; i < botCount; i++) {
            const idx = Math.floor(Math.random() * this.candidates.length);
            this.candidates[idx].votes++;
        }
    }

    playerVoteFor(mapId) {
        if (this.playerVote) {
            // Retirer le vote précédent
            const prev = this.candidates.find(c => c.id === this.playerVote);
            if (prev) prev.votes--;
        }

        this.playerVote = mapId;
        const candidate = this.candidates.find(c => c.id === mapId);
        if (candidate) candidate.votes++;
    }

    update(dt) {
        if (!this.isVoting) return;

        this.timer -= dt;
        if (this.timer <= 0) {
            this.finishVote();
        }
    }

    finishVote() {
        this.isVoting = false;

        // La map avec le plus de votes gagne
        let winner = this.candidates[0];
        for (const c of this.candidates) {
            if (c.votes > winner.votes) winner = c;
        }
        this.selectedMap = winner.map;
    }

    getSelectedMap() {
        return this.selectedMap;
    }

    renderVoteUI() {
        if (!this.isVoting || this.candidates.length === 0) return '';

        const totalVotes = this.candidates.reduce((sum, c) => sum + c.votes, 0) || 1;

        return `
            <div class="map-vote-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.85); z-index: 100;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                color: white; font-family: 'Outfit', sans-serif;
            ">
                <h2 style="font-size: 1.4rem; font-weight: 900; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">
                    🗳️ VOTE DE MAP
                </h2>
                <div style="font-size: 2rem; font-weight: 900; color: var(--color-accent-cyan); margin-bottom: 25px;">
                    ⏱️ ${Math.ceil(this.timer)}s
                </div>

                <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                    ${this.candidates.map(c => {
            const pct = Math.round((c.votes / totalVotes) * 100);
            const isSelected = this.playerVote === c.id;
            return `
                            <div class="map-vote-card" data-vote-map="${c.id}" style="
                                background: rgba(255,255,255,0.05);
                                border: 2px solid ${isSelected ? 'var(--color-accent-cyan)' : 'rgba(255,255,255,0.1)'};
                                border-radius: 12px; padding: 20px; width: 180px;
                                cursor: pointer; transition: all 0.2s;
                                ${isSelected ? 'box-shadow: 0 0 20px rgba(0, 247, 255, 0.3);' : ''}
                            ">
                                <div style="font-size: 2rem; margin-bottom: 8px;">${c.map.emoji}</div>
                                <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 4px;">${c.map.name}</div>
                                <div style="font-size: 0.65rem; color: var(--color-text-muted); margin-bottom: 12px;">
                                    ${c.map.width}x${c.map.height}
                                </div>
                                <div style="
                                    background: rgba(255,255,255,0.08); border-radius: 6px; height: 6px; overflow: hidden;
                                ">
                                    <div style="
                                        width: ${pct}%; height: 100%;
                                        background: ${isSelected ? 'var(--color-accent-cyan)' : 'var(--color-accent-blue)'};
                                        transition: width 0.3s;
                                    "></div>
                                </div>
                                <div style="font-size: 0.7rem; margin-top: 6px; font-weight: 700;">
                                    ${c.votes} votes (${pct}%)
                                </div>
                                ${isSelected ? '<div style="font-size: 0.6rem; color: var(--color-accent-cyan); margin-top: 4px; font-weight: 700;">✓ TON VOTE</div>' : ''}
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }
}
