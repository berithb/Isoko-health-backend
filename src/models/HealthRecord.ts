import { Schema, model, Document, Types } from 'mongoose';

export interface IHealthRecord extends Document {
  userId: Types.ObjectId;
  bloodPressure?: string;
  glucose?: number;
  temperature?: number;
  createdAt?: Date;
}

const healthRecordSchema = new Schema<IHealthRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bloodPressure: String,
    glucose: Number,
    temperature: Number,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const HealthRecord = model<IHealthRecord>('HealthRecord', healthRecordSchema);

