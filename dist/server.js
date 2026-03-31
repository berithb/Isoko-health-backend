"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const config_1 = require("./config");
const socket_1 = require("./realtime/socket");
const app = (0, app_1.createApp)();
const server = http_1.default.createServer(app);
const socketOrigins = config_1.env.corsOrigin === '*' ? '*' : config_1.env.corsOrigin.split(',').map((origin) => origin.trim());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: socketOrigins,
        methods: ['GET', 'POST'],
    },
});
(0, socket_1.registerSocketServer)(io);
const getLanAddresses = () => Object.values(os_1.default.networkInterfaces())
    .flat()
    .filter((details) => Boolean(details && details.family === 'IPv4' && !details.internal))
    .map((details) => details.address);
server.listen(config_1.env.port, config_1.env.host, () => {
    console.log(`IsokoHealth API running on http://${config_1.env.host}:${config_1.env.port}`);
    console.log(`Swagger docs running at http://localhost:${config_1.env.port}/api-docs`);
    console.log(`Socket.IO live updates ready at http://localhost:${config_1.env.port}`);
    for (const address of getLanAddresses()) {
        console.log(`LAN API URL: http://${address}:${config_1.env.port}/api/v1/data`);
        console.log(`LAN Swagger URL: http://${address}:${config_1.env.port}/api-docs`);
        console.log(`LAN Socket URL: http://${address}:${config_1.env.port}`);
    }
});
