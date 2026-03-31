import { ApiError } from '../utils/apiError';
import { Subscription, ISubscription } from '../models/Subscription';

export const createSubscription = async (payload: Partial<ISubscription>) => Subscription.create(payload);

export const listSubscriptions = async (filter: Partial<ISubscription> = {}) => Subscription.find(filter);

export const getSubscriptionById = async (id: string) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) throw new ApiError(404, 'Subscription not found');
  return subscription;
};

export const updateSubscription = async (id: string, payload: Partial<ISubscription>) => {
  const subscription = await Subscription.findByIdAndUpdate(id, payload, { new: true });
  if (!subscription) throw new ApiError(404, 'Subscription not found');
  return subscription;
};

export const deleteSubscription = async (id: string) => {
  const subscription = await Subscription.findByIdAndDelete(id);
  if (!subscription) throw new ApiError(404, 'Subscription not found');
  return subscription;
};
