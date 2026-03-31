import { ApiError } from '../utils/apiError';
import { DiagnosticTest, IDiagnosticTest } from '../models/DiagnosticTest';

export const requestTest = async (payload: Partial<IDiagnosticTest>) => DiagnosticTest.create(payload);

export const getTestById = async (id: string) => {
  const test = await DiagnosticTest.findById(id);
  if (!test) throw new ApiError(404, 'Diagnostic test not found');
  return test;
};

export const getTests = async (filter: Partial<IDiagnosticTest>) => DiagnosticTest.find(filter);

export const uploadResult = async (id: string, result: string) => {
  const test = await DiagnosticTest.findById(id);
  if (!test) throw new ApiError(404, 'Diagnostic test not found');
  test.result = result;
  test.status = 'completed';
  await test.save();
  return test;
};

export const getResults = async (userId: string) => DiagnosticTest.find({ userId });

export const updateTest = async (id: string, payload: Partial<IDiagnosticTest>) => {
  const test = await DiagnosticTest.findByIdAndUpdate(id, payload, { new: true });
  if (!test) throw new ApiError(404, 'Diagnostic test not found');
  return test;
};

export const deleteTest = async (id: string) => {
  const test = await DiagnosticTest.findByIdAndDelete(id);
  if (!test) throw new ApiError(404, 'Diagnostic test not found');
  return test;
};

