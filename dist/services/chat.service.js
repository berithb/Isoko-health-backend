"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChat = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("../config");
const apiError_1 = require("../utils/apiError");
const DEFAULT_SYSTEM_PROMPT = 'You are a fast, friendly triage assistant. The user describes symptoms and you respond in plain language with the top 2–3 likely causes and clear next steps. Keep replies under 120 words and avoid heavy disclaimers.';
const getModel = () => {
    if (!config_1.env.geminiApiKey)
        throw new apiError_1.ApiError(500, 'GEMINI_API_KEY is missing');
    const client = new generative_ai_1.GoogleGenerativeAI(config_1.env.geminiApiKey);
    return client.getGenerativeModel({ model: 'gemini-1.5-flash' });
};
const toGeminiRole = (role) => (role === 'assistant' ? 'model' : 'user');
const sendChat = async (messages, system, previewOnly = false) => {
    if (!messages?.length)
        throw new apiError_1.ApiError(400, 'messages array is required');
    const systemInstruction = system?.trim() || DEFAULT_SYSTEM_PROMPT;
    const contents = messages.map((message) => ({
        role: toGeminiRole(message.role),
        parts: [{ text: message.content }],
    }));
    if (previewOnly) {
        return { system: systemInstruction, messages, reply: undefined };
    }
    const model = getModel();
    const result = await model.generateContent({
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 512,
        },
    });
    const reply = result.response?.text()?.trim();
    if (!reply)
        throw new apiError_1.ApiError(502, 'Empty response from Gemini');
    return { system: systemInstruction, messages, reply };
};
exports.sendChat = sendChat;
