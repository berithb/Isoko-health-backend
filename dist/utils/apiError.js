"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
const handleApiError = (err) => {
    if (err instanceof ApiError)
        return err;
    return new ApiError(500, 'Internal Server Error');
};
exports.handleApiError = handleApiError;
