import { User } from '../models/User';
import { Subscription, SubscriptionStatus } from '../models/Subscription';
import { ApiError } from '../utils/apiError';

export const manageSubscription = async (userId: string, plan: string, status: SubscriptionStatus) =>
  Subscription.findOneAndUpdate({ userId }, { plan, status }, { upsert: true, new: true });

export const getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const activeSubs = await Subscription.countDocuments({ status: 'active' });
  return { totalUsers, activeSubs };
};

export const updateUserRole = async (userId: string, role: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  user.role = role as any;
  await user.save();
  return user;
};
