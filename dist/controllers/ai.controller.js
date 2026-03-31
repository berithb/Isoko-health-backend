"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAi = void 0;
const ai_service_1 = require("../services/ai.service");
const handleAi = async (req, res, next) => {
    try {
        const { feature, payload, previewOnly } = req.body;
        if (!feature) {
            return res.status(400).json({ message: 'feature is required' });
        }
        const result = await (0, ai_service_1.runFeature)(feature, payload, Boolean(previewOnly));
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.handleAi = handleAi;
