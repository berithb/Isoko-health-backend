import { Server } from 'socket.io';
import * as SensorDataService from '../services/sensorData.service';

let io: Server | null = null;

export const registerSocketServer = (socketServer: Server) => {
  io = socketServer;

  io.on('connection', async (socket) => {
    console.log(`React client connected: ${socket.id}`);

    try {
      const latest = await SensorDataService.fetchLatestSensorReading();
      socket.emit('initial-data', latest);
    } catch (error) {
      console.error('Failed to load initial sensor data for socket client', error);
      socket.emit('initial-data', null);
    }
  });
};

export const emitSensorData = (payload: unknown) => {
  io?.emit('new-data', payload);
};
