/* ============================
   DROPER — Trade Manager (Échanges Spéciaux)
   ============================ */

import { toast } from '../ui/components/ToastManager.js';

export class TradeManager {
    constructor(saveManager) {
        this.save = saveManager;
        this.activeTrade = null;
        this.requests = [];
    }

    proposeTrade(friendTag, myItem, friendItem) {
        // En multi réel, on enverrait via WebSocket
        // Interface d'échange v1.0.0
        this.requests.push({
            id: 'trd_' + Date.now(),
            from: 'Toi',
            to: friendTag,
            myItem,
            friendItem,
            status: 'pending'
        });

        toast.info('📤 Proposition envoyée ! En attente de réponse...');

        // Bot response simulate
        setTimeout(() => {
            this.handleBotResponse(this.requests[this.requests.length - 1]);
        }, 3000 + Math.random() * 2000);
    }

    handleBotResponse(tradeReq) {
        if (!tradeReq || tradeReq.status !== 'pending') return;

        const accept = Math.random() > 0.3; // 70% chance to accept
        if (accept) {
            tradeReq.status = 'accepted';
            toast.success('🤝 Échange accepté par ' + tradeReq.to + ' !');
            this.executeTradeLocally(tradeReq.myItem, tradeReq.friendItem);
        } else {
            tradeReq.status = 'declined';
            toast.error('❌ ' + tradeReq.to + ' a décliné ton offre.');
        }
    }

    executeTradeLocally(lostItem, gainedItem) {
        // Simulate gaining/losing items (would hook into SkinManager/EmoteManager)
        console.log(`Trade Executed: Lost [${lostItem.id}], Gained [${gainedItem.id}]`);
        toast.success(`Tu as reçu : ${gainedItem.name} !`);
    }
}
