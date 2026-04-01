import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config';
import { ApiError } from '../utils/apiError';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const DEFAULT_SYSTEM_PROMPT =
  'You are a fast, friendly triage assistant. The user describes symptoms and you respond in plain language with the top 2–3 likely causes and clear next steps. Keep replies under 120 words and avoid heavy disclaimers.';

const getModel = () => {
  if (!env.geminiApiKey) throw new ApiError(500, 'GEMINI_API_KEY is missing');
  const client = new GoogleGenerativeAI(env.geminiApiKey);
  return client.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const toGeminiRole = (role: ChatMessage['role']) => (role === 'assistant' ? 'model' : 'user');

export const sendChat = async (messages: ChatMessage[], system?: string, previewOnly = false) => {
  if (!messages?.length) throw new ApiError(400, 'messages array is required');

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
  if (!reply) throw new ApiError(502, 'Empty response from Gemini');

  return { system: systemInstruction, messages, reply };
};
