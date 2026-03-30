"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const apiError_1 = require("../utils/apiError");
const authenticate = async (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return next(new apiError_1.ApiError(401, 'Missing token'));
    try {
        const token = header.split(' ')[1];
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await (0, auth_service_1.getUserById)(payload.sub);
        if (!user)
            return next(new apiError_1.ApiError(401, 'Invalid token'));
        req.user = { id: user.id, role: user.role };
        return next();
    }
    catch (err) {
        return next(new apiError_1.ApiError(401, 'Invalid token'));
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => (req, _res, next) => {
    if (!req.user)
        return next(new apiError_1.ApiError(401, 'Unauthorized'));
    if (!roles.includes(req.user.role))
        return next(new apiError_1.ApiError(403, 'Forbidden'));
    return next();
};
exports.authorize = authorize;
