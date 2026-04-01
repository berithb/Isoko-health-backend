import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'caregiver';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // New Optional Fields for Doctors
  specialization?: string;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  consultationFee?: number;
  consultationMethods?: ('Chat' | 'Video')[];
  avatar?: string; // For the "D" or profile image placeholder
  createdAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
  generatePasswordReset(): string;
  clearPasswordReset(): void;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['patient', 'doctor', 'admin', 'caregiver'], 
      default: 'patient' 
    },
    // Added Doctor Specific Fields
    specialization: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    consultationFee: { type: Number },
    consultationMethods: [{ type: String, enum: ['Chat', 'Video'] }],
    avatar: { type: String },
    
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: true } } // Changed updatedAt to true for profile edits
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generatePasswordReset = function generatePasswordReset() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

userSchema.methods.clearPasswordReset = function clearPasswordReset() {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

export const User = model<IUserDocument>('User', userSchema);
