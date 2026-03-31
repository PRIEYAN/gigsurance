"use strict";
// import { createServer } from 'http';
// import app from './app.js';
// import SocketService from './services/socket.service.js';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const PORT = process.env.PORT || 3000;
// // Create HTTP server
// const httpServer = createServer(app);
// // Initialize Socket.IO service
// const socketService = new SocketService(httpServer);
// // Make socket service globally available for use in controllers
// (global as any).socketService = socketService;
// // Start server
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
//   console.log(`🔌 WebSocket service initialized`);
//   console.log(`📡 Ready for real-time connections`);
// });
const http_1 = __importDefault(require("http"));
const app_js_1 = __importDefault(require("./app.js"));
const port = Number(process.env.PORT);
// Create HTTP server using Express app
const server = http_1.default.createServer(app_js_1.default);
// Start listening
server.listen(port, () => {
    console.log(`-> Server is running on port ${port}`);
});
// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use.`);
        console.error(`💡 Try one of the following:`);
        console.error(`   1. Kill the process using port ${port}: lsof -ti:${port} | xargs kill -9`);
        console.error(`   2. Use a different port by setting PORT environment variable`);
        console.error(`   3. Find and stop the other instance of this server`);
        process.exit(1);
    }
    else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});
