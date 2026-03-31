import { Response, NextFunction } from 'express';
import * as DiagnosticService from '../services/diagnostic.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const requestTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const test = await DiagnosticService.requestTest({ ...req.body, userId: req.user!.id });
    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
};

export const uploadResult = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const test = await DiagnosticService.uploadResult(req.params.id, req.body.result);
    res.json(test);
  } catch (err) {
    next(err);
  }
};

export const getResults = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const results = await DiagnosticService.getResults(req.user!.id);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const test = await DiagnosticService.getTestById(req.params.id);
    res.json(test);
  } catch (err) {
    next(err);
  }
};

export const list = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tests = await DiagnosticService.getTests({});
    res.json(tests);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const test = await DiagnosticService.updateTest(req.params.id, req.body);
    res.json(test);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const test = await DiagnosticService.deleteTest(req.params.id);
    res.json(test);
  } catch (err) {
    next(err);
  }
};

