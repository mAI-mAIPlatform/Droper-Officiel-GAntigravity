/* ============================
   DROPER — Serveur WebSocket Backend
   ============================ */

import { WebSocketServer } from 'ws';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

// État du serveur
const rooms = new Map(); // roomId -> { players: Map, modeId }
const players = new Map(); // ws -> { playerId, roomId }

console.log(`🚀 Serveur Droper démarré sur le port ${PORT}`);

wss.on('connection', (ws) => {
    console.log('👤 Nouveau joueur connecté');

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            handleMessage(ws, msg);
        } catch (e) {
            console.error('❌ Erreur message:', e);
        }
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });
});

function handleMessage(ws, msg) {
    switch (msg.type) {
        case 'search_match':
            handleSearchMatch(ws, msg);
            break;
        case 'position':
        case 'shoot':
        case 'damage':
            broadcastInRoom(ws, msg);
            break;
        case 'chat_message':
            handleChat(ws, msg);
            break;
        case 'cancel_search':
            handleCancelSearch(ws);
            break;
    }
}

function handleSearchMatch(ws, { modeId, playerId }) {
    console.log(`🔍 Recherche match: ${playerId} pour ${modeId}`);

    // Simple matchmaking: trouver une salle libre pour ce mode
    let targetRoom = null;
    for (const [id, room] of rooms) {
        if (room.modeId === modeId && room.players.size < 6) {
            targetRoom = room;
            targetRoom.id = id;
            break;
        }
    }

    if (!targetRoom) {
        const roomId = 'room_' + Math.random().toString(36).slice(2, 9);
        targetRoom = { id: roomId, modeId, players: new Map() };
        rooms.set(roomId, targetRoom);
        console.log(`🏠 Nouvelle salle créée: ${roomId}`);
    }

    targetRoom.players.set(ws, { playerId });
    players.set(ws, { playerId, roomId: targetRoom.id });

    // Informer le joueur
    send(ws, { type: 'searching' });

    // Si on a assez de monde (ou simulation de match trouvé)
    if (targetRoom.players.size >= 2) {
        const playerList = Array.from(targetRoom.players.values());
        broadcastToRoom(targetRoom.id, {
            type: 'match_found',
            roomId: targetRoom.id,
            players: playerList
        });
    }
}

function handleCancelSearch(ws) {
    const p = players.get(ws);
    if (p && p.roomId) {
        const room = rooms.get(p.roomId);
        if (room) {
            room.players.delete(ws);
            if (room.players.size === 0) rooms.delete(p.roomId);
        }
        players.delete(ws);
    }
}

function handleDisconnect(ws) {
    const p = players.get(ws);
    if (p) {
        const room = rooms.get(p.roomId);
        if (room) {
            room.players.delete(ws);
            broadcastToRoom(p.roomId, { type: 'player_left', playerId: p.playerId });
            if (room.players.size === 0) rooms.delete(p.roomId);
        }
        players.delete(ws);
    }
    console.log('🔌 Joueur déconnecté');
}

function handleChat(ws, msg) {
    // Relais simple
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(msg));
        }
    });
}

function broadcastInRoom(ws, msg) {
    const p = players.get(ws);
    if (p && p.roomId) {
        const room = rooms.get(p.roomId);
        if (room) {
            room.players.forEach((data, client) => {
                if (client !== ws && client.readyState === 1) {
                    client.send(JSON.stringify({ ...msg, senderId: p.playerId }));
                }
            });
        }
    }
}

function broadcastToRoom(roomId, msg) {
    const room = rooms.get(roomId);
    if (room) {
        room.players.forEach((data, client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(msg));
            }
        });
    }
}

function send(ws, msg) {
    if (ws.readyState === 1) {
        ws.send(JSON.stringify(msg));
    }
}
