"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChat = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const apiError_1 = require("../utils/apiError");
const getClient = () => {
    if (!config_1.env.openaiApiKey)
        throw new apiError_1.ApiError(500, 'OPENAI_API_KEY is missing');
    return new openai_1.default({ apiKey: config_1.env.openaiApiKey });
};
const sendChat = async (messages, system, previewOnly = false) => {
    if (!messages?.length)
        throw new apiError_1.ApiError(400, 'messages array is required');
    const input = [
        ...(system ? [{ role: 'system', content: system }] : []),
        ...messages.map((message) => ({
            role: message.role,
            content: message.content,
        })),
    ];
    if (previewOnly) {
        return { system, messages, reply: undefined };
    }
    const client = getClient();
    const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input,
    });
    const reply = response.output_text?.trim();
    if (!reply)
        throw new apiError_1.ApiError(502, 'Empty response from OpenAI');
    return { system, messages, reply };
};
exports.sendChat = sendChat;
