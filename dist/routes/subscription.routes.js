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
const express_1 = require("express");
const zod_1 = require("zod");
const SubscriptionController = __importStar(require("../controllers/subscription.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
const baseSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
        plan: zod_1.z.string(),
        status: zod_1.z.enum(['active', 'inactive', 'cancelled']).optional(),
    }),
});
const updateSchema = zod_1.z.object({
    body: zod_1.z.object({
        plan: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive', 'cancelled']).optional(),
    }),
    params: zod_1.z.object({ id: zod_1.z.string() }),
});
const idSchema = zod_1.z.object({ params: zod_1.z.object({ id: zod_1.z.string() }) });
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), (0, validation_middleware_1.validate)(baseSchema), SubscriptionController.create);
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), SubscriptionController.list);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), (0, validation_middleware_1.validate)(idSchema), SubscriptionController.getOne);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), (0, validation_middleware_1.validate)(updateSchema), SubscriptionController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), (0, validation_middleware_1.validate)(idSchema), SubscriptionController.remove);
exports.default = router;
