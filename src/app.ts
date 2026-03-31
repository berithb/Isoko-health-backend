import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import appointmentRoutes from './routes/appointment.routes';
import healthRoutes from './routes/healthRecord.routes';
import diagnosticRoutes from './routes/diagnostic.routes';
import adminRoutes from './routes/admin.routes';
import sensorDataRoutes from './routes/sensorData.routes';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './docs/swagger';

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'upgrade-insecure-requests': null,
        },
      },
      crossOriginOpenerPolicy: false,
      originAgentCluster: false,
    }),
  );
  app.use(morgan('dev'));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/health-records', healthRoutes);
  app.use('/api/diagnostics', diagnosticRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/v1/data', sensorDataRoutes);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(errorHandler);

  connectDB().catch((err) => console.error('DB connection failed', err));
  return app;
};

