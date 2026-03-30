import { ApiError } from '../utils/apiError';
import { User, IUserDocument, UserRole } from '../models/User';

export const getProfile = async (id: string) => User.findById(id).select('-password');

export const updateProfile = async (id: string, payload: Partial<IUserDocument>) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  if (payload.name) user.name = payload.name;
  await user.save();
  return user;
};

export const listUsers = async () => User.find().select('-password');

export const deleteUser = async (id: string) => User.findByIdAndDelete(id);
