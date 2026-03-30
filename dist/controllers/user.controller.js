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
exports.deleteUser = exports.listUsers = exports.updateProfile = exports.getProfile = void 0;
const UserService = __importStar(require("../services/user.service"));
const getProfile = async (req, res, next) => {
    try {
        const profile = await UserService.getProfile(req.user.id);
        res.json(profile);
    }
    catch (err) {
        next(err);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const updated = await UserService.updateProfile(req.user.id, req.body);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
const listUsers = async (_req, res, next) => {
    try {
        const users = await UserService.listUsers();
        res.json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.listUsers = listUsers;
const deleteUser = async (req, res, next) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
