"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message, details: err.details ?? undefined });
};
exports.errorHandler = errorHandler;
