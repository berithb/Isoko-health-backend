"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const healthRecord_routes_1 = __importDefault(require("./routes/healthRecord.routes"));
const diagnostic_routes_1 = __importDefault(require("./routes/diagnostic.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const sensorData_routes_1 = __importDefault(require("./routes/sensorData.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const plan_routes_1 = __importDefault(require("./routes/plan.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_1 = require("./docs/swagger");
const createApp = () => {
    const app = (0, express_1.default)();
    // Determine allowed origins based on environment
    const isProduction = config_1.env.nodeEnv === 'production';
    const defaultOrigins = isProduction ? [] : ['http://localhost:8081', 'http://localhost:3000'];
    const envOrigins = config_1.env.corsOrigin === '*'
        ? ['*']
        : config_1.env.corsOrigin
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean);
    // Block wildcard in production
    if (isProduction && envOrigins.includes('*')) {
        throw new Error('CORS_ORIGIN cannot be "*" in production. Specify explicit allowed origins.');
    }
    const mergedOrigins = envOrigins.includes('*')
        ? '*'
        : Array.from(new Set([...defaultOrigins, ...envOrigins]));
    app.use((0, cors_1.default)({
        origin: mergedOrigins,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'upgrade-insecure-requests': null,
            },
        },
        crossOriginOpenerPolicy: false,
        originAgentCluster: false,
    }));
    app.use((0, morgan_1.default)(isProduction ? 'combined' : 'dev'));
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
        const dbStatus = (0, config_1.getDbStatus)();
        res.json({
            status: dbStatus.connected ? 'ok' : 'degraded',
            service: 'IsokoHealth API',
            docs: '/api-docs',
            environment: config_1.env.nodeEnv,
            database: dbStatus,
            sensorData: {
                post: '/api/v1/data',
                latest: '/api/v1/data/latest',
                history: '/api/v1/data/history',
                memoryFallbackEnabled: config_1.env.allowSensorMemoryFallback,
            },
            websocket: {
                namespace: '/',
                events: ['initial-data', 'new-data'],
            },
        });
    });
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/users', user_routes_1.default);
    app.use('/api/appointments', appointment_routes_1.default);
    app.use('/api/health-records', healthRecord_routes_1.default);
    app.use('/api/diagnostics', diagnostic_routes_1.default);
    app.use('/api/admin', admin_routes_1.default);
    app.use('/api/ai', ai_routes_1.default);
    app.use('/api/chat', chat_routes_1.default);
    app.use('/api/v1/data', sensorData_routes_1.default);
    app.use('/api/subscriptions', subscription_routes_1.default);
    app.use('/api/dashboard', dashboard_routes_1.default);
    app.use('/api/doctors', doctor_routes_1.default);
    app.use('/api/plans', plan_routes_1.default);
    app.get('/api-docs.json', (_req, res) => {
        res.json(swagger_1.swaggerSpec);
    });
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            operationsSorter: 'alpha',
            tagsSorter: 'alpha',
        },
    }));
    app.use(error_middleware_1.errorHandler);
    (0, config_1.connectDB)().catch((err) => console.error('DB connection failed', err));
    return app;
};
exports.createApp = createApp;
