import { ApiError } from '../utils/apiError';
import { DiagnosticTest, IDiagnosticTest } from '../models/DiagnosticTest';

export const requestTest = async (payload: Partial<IDiagnosticTest>) => DiagnosticTest.create(payload);

export const uploadResult = async (id: string, result: string) => {
  const test = await DiagnosticTest.findById(id);
  if (!test) throw new ApiError(404, 'Diagnostic test not found');
  test.result = result;
  test.status = 'completed';
  await test.save();
  return test;
};

export const getResults = async (userId: string) => DiagnosticTest.find({ userId });

