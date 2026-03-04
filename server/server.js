const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// État global des joueurs
// Map: socket.id -> { id, x, y, angle, hp, maxHp, alive, color }
const players = new Map();

io.on('connection', (socket) => {
    console.log(`[INFO] Nouveau joueur connecté : ${socket.id}`);

    // Quand le joueur rejoint la partie
    socket.on('join_game', (playerData) => {
        players.set(socket.id, {
            id: socket.id,
            ...playerData,
            lastUpdate: Date.now()
        });

        // Envoyer à tout le monde le nouveau joueur
        socket.broadcast.emit('player_joined', players.get(socket.id));

        // Envoyer au joueur l'état actuel de tous les autres
        const otherPlayers = Array.from(players.values()).filter(p => p.id !== socket.id);
        socket.emit('game_state', otherPlayers);
    });

    // Quand le joueur se déplace
    socket.on('player_move', (data) => {
        const p = players.get(socket.id);
        if (p) {
            p.x = data.x;
            p.y = data.y;
            p.angle = data.angle;
            p.hp = data.hp;
            p.lastUpdate = Date.now();

            // Relayer aux autres
            socket.broadcast.emit('player_moved', {
                id: socket.id,
                x: data.x,
                y: data.y,
                angle: data.angle,
                hp: data.hp,
                alive: data.alive
            });
        }
    });

    // Quand le joueur se déconnecte
    socket.on('disconnect', () => {
        console.log(`[INFO] Joueur déconnecté : ${socket.id}`);
        players.delete(socket.id);
        io.emit('player_left', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur WebSocket Droper démarré sur le port ${PORT}`);
});
