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
exports.updateRole = exports.analytics = exports.manageSubscription = exports.manageUsers = void 0;
const UserService = __importStar(require("../services/user.service"));
const AdminService = __importStar(require("../services/admin.service"));
const manageUsers = async (_req, res, next) => {
    try {
        const users = await UserService.listUsers();
        res.json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.manageUsers = manageUsers;
const manageSubscription = async (req, res, next) => {
    try {
        const subscription = await AdminService.manageSubscription(req.params.userId, req.body.plan, req.body.status);
        res.json(subscription);
    }
    catch (err) {
        next(err);
    }
};
exports.manageSubscription = manageSubscription;
const analytics = async (_req, res, next) => {
    try {
        const data = await AdminService.getAnalytics();
        res.json(data);
    }
    catch (err) {
        next(err);
    }
};
exports.analytics = analytics;
const updateRole = async (req, res, next) => {
    try {
        const user = await AdminService.updateUserRole(req.params.userId, req.body.role);
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.updateRole = updateRole;
