import { ApiError } from '../utils/apiError';
import { HealthRecord } from '../models/HealthRecord';

export const submitVitals = async (payload: { userId: string; bloodPressure?: string; glucose?: number; temperature?: number }) => {
  const record = await HealthRecord.create(payload);
  return record;
};

export const fetchVitals = async (userId: string) => HealthRecord.find({ userId }).sort({ createdAt: -1 });

export const detectAlerts = (record: { bloodPressure?: string; glucose?: number; temperature?: number }) => {
  const alerts: string[] = [];
  if (record.bloodPressure) {
    const [systolicStr, diastolicStr] = record.bloodPressure.split('/').map(Number);
    if (systolicStr > 140 || diastolicStr > 90) alerts.push('High blood pressure');
  }
  if (record.glucose && record.glucose > 180) alerts.push('High glucose');
  if (record.temperature && record.temperature > 38) alerts.push('Fever detected');
  return alerts;
};

