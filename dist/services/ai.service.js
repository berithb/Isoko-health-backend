"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFeature = void 0;
const config_1 = require("../config");
const apiError_1 = require("../utils/apiError");
const generative_ai_1 = require("@google/generative-ai");
const promptMap = {
    symptom_checker: {
        system: 'You are a medical triage assistant. Based on symptoms, suggest urgency level (emergency/soon/routine) and relevant specialist. Never diagnose; always recommend seeing a doctor.',
        buildUserMessage: (payload) => `Patient symptoms: ${payload?.symptoms ?? ''}`,
    },
    history_summary: {
        system: "Summarize this patient's medical history in 5 bullet points highlighting chronic conditions, allergies, and recent issues. Be concise for a doctor's quick review.",
        buildUserMessage: (payload) => String(payload?.history ?? ''),
    },
    chronic_monitoring: {
        system: "You are a health monitoring assistant. Analyze the patient's last 7 days of glucose/BP readings and determine if they are in a safe range. Flag anomalies clearly.",
        buildUserMessage: (payload) => `Patient data: ${JSON.stringify(payload?.healthLogs ?? {})}`,
    },
    lab_explainer: {
        system: 'Explain this lab result to a patient in simple, non-technical language. Mention what is normal vs abnormal and advise them to consult their doctor for next steps.',
        buildUserMessage: (payload) => `Lab result: ${payload?.labResult ?? ''}`,
    },
    telemedicine_intake: {
        system: 'You are a pre-consultation assistant for MediConnect+. Ask the patient about their main complaint, duration, severity, and any medications they are currently taking. Be empathetic and concise.',
        buildUserMessage: (payload) => String(payload?.prompt ?? "Let's begin."),
    },
};
const getClient = () => {
    if (!config_1.env.geminiApiKey)
        throw new apiError_1.ApiError(500, 'GEMINI_API_KEY is missing');
    return new generative_ai_1.GoogleGenerativeAI(config_1.env.geminiApiKey);
};
const runFeature = async (feature, payload, previewOnly = false) => {
    const config = promptMap[feature];
    if (!config)
        throw new apiError_1.ApiError(400, 'Unsupported AI feature');
    const userMessage = config.buildUserMessage(payload);
    const base = { feature, system: config.system, userMessage };
    if (previewOnly)
        return { ...base, reply: undefined };
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${config.system}\n\n${userMessage}`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    if (!text)
        throw new apiError_1.ApiError(502, 'Empty response from Gemini');
    return { ...base, reply: text.trim() };
};
exports.runFeature = runFeature;
