const { Server } = require('socket.io');

const userSockets = new Map();

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5000', // allow frontend
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('⚡ New client connected');

        socket.on('register', (agentId) => {
            console.log(`✅ Agent ${agentId} registered`);
            userSockets.set(agentId, socket);
        });

        socket.on('disconnect', () => {
            for (const [agentId, sock] of userSockets.entries()) {
                if (sock === socket) {
                    userSockets.delete(agentId);
                    console.log(`❌ Agent ${agentId} disconnected`);
                    break;
                }
            }
        });
    });

    return { io, userSockets };
}

module.exports = setupSocket;
