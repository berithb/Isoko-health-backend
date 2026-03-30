import { Schema, model, Document, Types } from 'mongoose';

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled';

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  plan: string;
  status: SubscriptionStatus;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  },
  { timestamps: true },
);

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

