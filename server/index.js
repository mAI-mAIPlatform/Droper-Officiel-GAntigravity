/* ============================
   DROPER — Serveur WebSocket Backend (v0.8.0 — Sécurité)
   ============================ */

import { WebSocketServer } from 'ws';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

// État du serveur
const rooms = new Map(); // roomId -> { players: Map, modeId }
const players = new Map(); // ws -> { playerId, roomId, lastPos, lastShoot, chatTimestamps }

// 🔒 Constantes de validation
const MAX_MOVE_DISTANCE = 500;   // Distance max par update
const MIN_SHOOT_INTERVAL = 100;  // ms entre deux tirs
const CHAT_RATE_LIMIT = 5;       // messages max
const CHAT_RATE_WINDOW = 3000;   // dans cette fenêtre (ms)
const MAX_CHAT_LENGTH = 200;     // longueur max d'un message

console.log(`🚀 Serveur Droper v0.8.0 démarré sur le port ${PORT}`);

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
            if (validatePosition(ws, msg)) broadcastInRoom(ws, msg);
            break;
        case 'shoot':
            if (validateShoot(ws, msg)) broadcastInRoom(ws, msg);
            break;
        case 'damage':
            if (validateDamage(ws, msg)) broadcastInRoom(ws, msg);
            break;
        case 'chat_message':
            handleChat(ws, msg);
            break;
        case 'match_result':
            handleMatchResult(ws, msg);
            break;
        case 'cancel_search':
            handleCancelSearch(ws);
            break;
    }
}

// 🔒 Anti-Cheat: Validation des scores de fin de partie
function handleMatchResult(ws, msg) {
    const p = players.get(ws);
    if (!p) return;

    const { score, kills, duration, modeId } = msg;

    // 1. Validation de base des types
    if (typeof score !== 'number' || typeof kills !== 'number' || typeof duration !== 'number') {
        console.warn(`🛑 Anti-Cheat: Types invalides pour ${p.playerId}`);
        return;
    }

    // 2. Calcul de plausibilité
    // On estime un score max théorique : (kills * 500) + (temporel: 20 pts/sec) + marge
    const maxTheoreticScore = (kills * 500) + (duration * 30) + 1000;

    let isSuspect = false;
    let reason = "";

    if (score > maxTheoreticScore) {
        isSuspect = true;
        reason = "Score trop élevé pour la durée";
    }

    if (kills > 10) { // Max théorique pour un mini-match court
        isSuspect = true;
        reason = "Nombre de kills impossible";
    }

    if (duration < 5 && score > 100) {
        isSuspect = true;
        reason = "Score instantané détecté";
    }

    if (isSuspect) {
        console.error(`🚨 Anti-Cheat ACTIVÉ: Joueur ${p.playerId} suspecté de triche (${reason}). Score: ${score}, Kills: ${kills}, Durée: ${duration}s`);
        send(ws, { type: 'cheat_detected', message: "Résultat non validé par le serveur." });
    } else {
        console.log(`✅ Match validé pour ${p.playerId}: Score ${score}`);
        send(ws, { type: 'result_validated' });
    }
}

// 🔒 Validation des positions (anti-téléportation)
function validatePosition(ws, msg) {
    const p = players.get(ws);
    if (!p) return false;

    if (p.lastPos) {
        const dx = (msg.x || 0) - p.lastPos.x;
        const dy = (msg.y || 0) - p.lastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_MOVE_DISTANCE) {
            console.warn(`⚠️ Téléportation détectée: ${p.playerId} (dist=${dist.toFixed(0)})`);
            return false;
        }
    }
    p.lastPos = { x: msg.x || 0, y: msg.y || 0 };
    return true;
}

// 🔒 Validation de la cadence de tir
function validateShoot(ws, msg) {
    const p = players.get(ws);
    if (!p) return false;

    const now = Date.now();
    if (p.lastShoot && (now - p.lastShoot) < MIN_SHOOT_INTERVAL) {
        console.warn(`⚠️ Tir trop rapide: ${p.playerId}`);
        return false;
    }
    p.lastShoot = now;
    return true;
}

// 🔒 Validation des dégâts (range basique)
function validateDamage(ws, msg) {
    const p = players.get(ws);
    if (!p) return false;
    // Rejeter les dégâts négatifs ou aberrants
    if (typeof msg.damage !== 'number' || msg.damage < 0 || msg.damage > 500) {
        console.warn(`⚠️ Dégâts suspects: ${p.playerId} (dmg=${msg.damage})`);
        return false;
    }
    return true;
}

function handleSearchMatch(ws, { modeId, playerId }) {
    console.log(`🔍 Recherche match: ${playerId} pour ${modeId}`);

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
    players.set(ws, { playerId, roomId: targetRoom.id, lastPos: null, lastShoot: 0, chatTimestamps: [] });

    send(ws, { type: 'searching' });

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

// 🔒 Chat isolé par room + rate limiting
function handleChat(ws, msg) {
    const p = players.get(ws);
    if (!p || !p.roomId) return; // Pas de room = pas de chat

    // Rate limiting
    const now = Date.now();
    p.chatTimestamps = (p.chatTimestamps || []).filter(t => now - t < CHAT_RATE_WINDOW);
    if (p.chatTimestamps.length >= CHAT_RATE_LIMIT) {
        send(ws, { type: 'chat_error', message: 'Trop de messages. Attendez un moment.' });
        return;
    }
    p.chatTimestamps.push(now);

    // Troncature du message
    if (msg.text && msg.text.length > MAX_CHAT_LENGTH) {
        msg.text = msg.text.substring(0, MAX_CHAT_LENGTH);
    }

    // 🔒 Broadcast uniquement dans la room du joueur
    broadcastInRoom(ws, { ...msg, senderId: p.playerId });
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

