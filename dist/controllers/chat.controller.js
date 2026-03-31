"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const chat_service_1 = require("../services/chat.service");
const chat = async (req, res, next) => {
    try {
        const { messages, system, previewOnly } = req.body;
        const result = await (0, chat_service_1.sendChat)(messages, system, Boolean(previewOnly));
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.chat = chat;
