import { ApiError } from '../utils/apiError';
import { User, IUserDocument, UserRole } from '../models/User';
import { signToken } from '../utils/jwt';
import crypto from 'crypto';

export const register = async (data: { name: string; email: string; password: string }) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new ApiError(409, 'Email already registered');
  const user = await User.create({ ...data, role: 'patient' });
  const token = signToken(user);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');
  const token = signToken(user);
  return { user, token };
};

export const getUserById = async (id: string): Promise<IUserDocument | null> => User.findById(id);

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');
  const token = user.generatePasswordReset();
  await user.save();
  // In production, send email. Here we return token for testing.
  return { resetToken: token, expiresAt: user.passwordResetExpires };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired token');
  user.password = newPassword;
  user.clearPasswordReset();
  await user.save();
  return { user, token: signToken(user) };
};
