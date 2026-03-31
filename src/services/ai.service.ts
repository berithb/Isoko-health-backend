import OpenAI from 'openai';
import type { EasyInputMessage } from 'openai/resources/responses/responses';
import { env } from '../config';
import { ApiError } from '../utils/apiError';

export type AiFeature =
  | 'symptom_checker'
  | 'history_summary'
  | 'chronic_monitoring'
  | 'lab_explainer'
  | 'telemedicine_intake';

type PromptConfig = { system: string; buildUserMessage: (payload: any) => string };

const promptMap: Record<AiFeature, PromptConfig> = {
  symptom_checker: {
    system:
      'You are a medical triage assistant. Based on symptoms, suggest urgency level (emergency/soon/routine) and relevant specialist. Never diagnose; always recommend seeing a doctor.',
    buildUserMessage: (payload) => `Patient symptoms: ${payload?.symptoms ?? ''}`,
  },
  history_summary: {
    system:
      "Summarize this patient's medical history in 5 bullet points highlighting chronic conditions, allergies, and recent issues. Be concise for a doctor's quick review.",
    buildUserMessage: (payload) => String(payload?.history ?? ''),
  },
  chronic_monitoring: {
    system:
      "You are a health monitoring assistant. Analyze the patient's last 7 days of glucose/BP readings and determine if they are in a safe range. Flag anomalies clearly.",
    buildUserMessage: (payload) => `Patient data: ${JSON.stringify(payload?.healthLogs ?? {})}`,
  },
  lab_explainer: {
    system:
      'Explain this lab result to a patient in simple, non-technical language. Mention what is normal vs abnormal and advise them to consult their doctor for next steps.',
    buildUserMessage: (payload) => `Lab result: ${payload?.labResult ?? ''}`,
  },
  telemedicine_intake: {
    system:
      'You are a pre-consultation assistant for MediConnect+. Ask the patient about their main complaint, duration, severity, and any medications they are currently taking. Be empathetic and concise.',
    buildUserMessage: (payload) => String(payload?.prompt ?? "Let's begin."),
  },
};

const getClient = () => {
  if (!env.openaiApiKey) throw new ApiError(500, 'OPENAI_API_KEY is missing');
  return new OpenAI({ apiKey: env.openaiApiKey });
};

export const runFeature = async (feature: AiFeature, payload: any, previewOnly = false) => {
  const config = promptMap[feature];
  if (!config) throw new ApiError(400, 'Unsupported AI feature');

  const userMessage = config.buildUserMessage(payload);
  const base = { feature, system: config.system, userMessage };
  if (previewOnly) return { ...base, reply: undefined };

  const client = getClient();
  const input: EasyInputMessage[] = [
    { role: 'system', content: config.system },
    { role: 'user', content: userMessage },
  ];

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input,
  });

  const text = response.output_text?.trim();
  if (!text) throw new ApiError(502, 'Empty response from OpenAI');

  return { ...base, reply: text };
};
