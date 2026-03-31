import http from 'http';
import os from 'os';
import { Server } from 'socket.io';
import { createApp } from './app';
import { env } from './config';
import { registerSocketServer } from './realtime/socket';

const app = createApp();
const server = http.createServer(app);
const socketOrigins = env.corsOrigin === '*' ? '*' : env.corsOrigin.split(',').map((origin) => origin.trim());
const io = new Server(server, {
  cors: {
    origin: socketOrigins,
    methods: ['GET', 'POST'],
  },
});

registerSocketServer(io);

const getLanAddresses = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter((details): details is NonNullable<typeof details> =>
      Boolean(details && details.family === 'IPv4' && !details.internal),
    )
    .map((details) => details.address);

server.listen(env.port, env.host, () => {
  console.log(`IsokoHealth API running on http://${env.host}:${env.port}`);
  console.log(`Swagger docs running at http://localhost:${env.port}/api-docs`);
  console.log(`Socket.IO live updates ready at http://localhost:${env.port}`);

  for (const address of getLanAddresses()) {
    console.log(`LAN API URL: http://${address}:${env.port}/api/v1/data`);
    console.log(`LAN Swagger URL: http://${address}:${env.port}/api-docs`);
    console.log(`LAN Socket URL: http://${address}:${env.port}`);
  }
});

