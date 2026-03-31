"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const app_1 = require("./app");
const config_1 = require("./config");
const app = (0, app_1.createApp)();
const getLanAddresses = () => Object.values(os_1.default.networkInterfaces())
    .flat()
    .filter((details) => Boolean(details && details.family === 'IPv4' && !details.internal))
    .map((details) => details.address);
app.listen(config_1.env.port, config_1.env.host, () => {
    console.log(`IsokoHealth API running on http://${config_1.env.host}:${config_1.env.port}`);
    console.log(`Swagger docs running at http://localhost:${config_1.env.port}/api-docs`);
    for (const address of getLanAddresses()) {
        console.log(`LAN API URL: http://${address}:${config_1.env.port}/api/v1/data`);
        console.log(`LAN Swagger URL: http://${address}:${config_1.env.port}/api-docs`);
    }
});
