import fetch from 'node-fetch';
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
      'You are a medical triage assistant. Based on symptoms, suggest urgency level (emergency/soon/routine) and relevant specialist. Never diagnose — always recommend seeing a doctor.',
    buildUserMessage: (payload) => `Patient symptoms: ${payload?.symptoms ?? ''}`,
  },
  history_summary: {
    system:
      "Summarize this patient's medical history in 5 bullet points highlighting chronic conditions, allergies, and recent issues. Be concise for a doctor's quick review.",
    buildUserMessage: (payload) => String(payload?.history ?? ''),
  },
  chronic_monitoring: {
    system:
      'You are a health monitoring assistant. Analyze the patient\'s last 7 days of glucose/BP readings and determine if they are in a safe range. Flag anomalies clearly.',
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

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export const runFeature = async (feature: AiFeature, payload: any) => {
  const config = promptMap[feature];
  if (!config) throw new ApiError(400, 'Unsupported AI feature');
  if (!env.anthropicApiKey) throw new ApiError(500, 'Anthropic API key is missing');

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: config.system,
    messages: [{ role: 'user', content: config.buildUserMessage(payload) }],
  };

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.anthropicApiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, `Anthropic request failed: ${errorText}`);
  }

  const data = (await response.json()) as { content?: Array<{ text?: string }> };
  const reply = data.content?.[0]?.text;
  if (!reply) throw new ApiError(502, 'Empty response from AI');

  return { feature, reply };
};
