"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
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
const sensorData_routes_1 = __importDefault(require("./routes/sensorData.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_1 = require("./docs/swagger");
const createApp = () => {
    const app = (0, express_1.default)();
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
    app.use((0, morgan_1.default)('dev'));
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/users', user_routes_1.default);
    app.use('/api/appointments', appointment_routes_1.default);
    app.use('/api/health-records', healthRecord_routes_1.default);
    app.use('/api/diagnostics', diagnostic_routes_1.default);
    app.use('/api/admin', admin_routes_1.default);
    app.use('/api/v1/data', sensorData_routes_1.default);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.use(error_middleware_1.errorHandler);
    (0, config_1.connectDB)().catch((err) => console.error('DB connection failed', err));
    return app;
};
exports.createApp = createApp;
