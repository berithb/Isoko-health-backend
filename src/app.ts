import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { connectDB, env, getDbStatus } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import appointmentRoutes from './routes/appointment.routes';
import healthRoutes from './routes/healthRecord.routes';
import diagnosticRoutes from './routes/diagnostic.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import chatRoutes from './routes/chat.routes';
import sensorDataRoutes from './routes/sensorData.routes';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './docs/swagger';

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));

  app.get('/', (_req, res) => {
    res.type('html').send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>IsokoHealth API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: linear-gradient(135deg, #f3f7fb, #e5eef6);
              color: #16324f;
            }
            main {
              width: min(720px, calc(100vw - 32px));
              background: white;
              border-radius: 16px;
              padding: 32px;
              box-shadow: 0 20px 50px rgba(22, 50, 79, 0.12);
            }
            h1 { margin-top: 0; }
            a {
              color: #0b6bcb;
              text-decoration: none;
              font-weight: 600;
            }
            ul {
              line-height: 1.8;
              padding-left: 20px;
            }
            code {
              background: #eef5fb;
              padding: 2px 6px;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <main>
            <h1>IsokoHealth API is running</h1>
            <p>This backend is live and ready for mobile, web, and IoT requests.</p>
            <ul>
              <li><a href="/api-docs">Open Swagger Docs</a></li>
              <li><a href="/health">Open Health Check</a></li>
              <li>ESP32/Wokwi POST endpoint: <code>/api/v1/data</code></li>
              <li>Latest sensor data: <code>/api/v1/data/latest</code></li>
              <li>Sensor history: <code>/api/v1/data/history</code></li>
            </ul>
          </main>
        </body>
      </html>
    `);
  });

  app.get('/health', (_req, res) => {
    const dbStatus = getDbStatus();

    res.json({
      status: dbStatus.connected ? 'ok' : 'degraded',
      service: 'IsokoHealth API',
      docs: '/api-docs',
      environment: env.nodeEnv,
      database: dbStatus,
      sensorData: {
        post: '/api/v1/data',
        latest: '/api/v1/data/latest',
        history: '/api/v1/data/history',
        memoryFallbackEnabled: env.allowSensorMemoryFallback,
      },
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/health-records', healthRoutes);
  app.use('/api/diagnostics', diagnosticRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/chat', chatRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(errorHandler);

  connectDB().catch((err) => console.error('DB connection failed', err));
  return app;
};
