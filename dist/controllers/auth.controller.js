"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoles = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const register = async (req, res, next) => {
    try {
        const { user, token } = await AuthService.register(req.body);
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { user, token } = await AuthService.login(req.body.email, req.body.password);
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const forgotPassword = async (req, res, next) => {
    try {
        const data = await AuthService.requestPasswordReset(req.body.email);
        res.json({ message: 'Reset token generated', ...data });
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { user, token } = await AuthService.resetPassword(req.body.token, req.body.password);
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
const listRoles = (_req, res) => {
    res.json({ roles: ['patient', 'doctor', 'admin', 'caregiver'] });
};
exports.listRoles = listRoles;
