import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  userId: Types.ObjectId;
  specialty: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  consultationFee: string;
  consultationModes: ('chat' | 'video')[];
  languages: string[];
  experienceYears: number;
  availabilityStatus: 'Available' | 'Busy' | 'Offline';
  nextAvailable?: string;
}

const doctorSchema = new Schema<IDoctor>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  specialty: { type: String, required: true },
  bio: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewsCount: { type: Number, default: 0, min: 0 },
  consultationFee: { type: String, required: true },
  consultationModes: [{
    type: String,
    enum: ['chat', 'video']
  }],
  languages: [{
    type: String
  }],
  experienceYears: { type: Number, min: 0 },
  availabilityStatus: { 
    type: String, 
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available'
  },
  nextAvailable: String,
}, { timestamps: true });

export const Doctor = model<IDoctor>('Doctor', doctorSchema);

