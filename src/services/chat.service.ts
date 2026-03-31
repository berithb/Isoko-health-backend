import OpenAI from 'openai';
import { env } from '../config';
import { ApiError } from '../utils/apiError';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const getClient = () => {
  if (!env.openaiApiKey) throw new ApiError(500, 'OPENAI_API_KEY is missing');
  return new OpenAI({ apiKey: env.openaiApiKey });
};

export const sendChat = async (messages: ChatMessage[], system?: string, previewOnly = false) => {
  if (!messages?.length) throw new ApiError(400, 'messages array is required');

  const input = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  if (previewOnly) {
    return { system, messages, reply: undefined };
  }

  const client = getClient();

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input,
  });

  const reply = response.output?.[0]?.content?.[0]?.text;
  if (!reply) throw new ApiError(502, 'Empty response from OpenAI');

  return { system, messages, reply };
};
