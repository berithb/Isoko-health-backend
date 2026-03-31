import { NextFunction, Request, Response } from 'express';
import * as SubscriptionService from '../services/subscription.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
};

export const list = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await SubscriptionService.listSubscriptions();
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.getSubscriptionById(req.params.id);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.updateSubscription(req.params.id, req.body);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await SubscriptionService.deleteSubscription(req.params.id);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};
