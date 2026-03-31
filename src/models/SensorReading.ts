import { Document, Schema, model } from 'mongoose';

interface SensorValues {
  temperature: number;
  humidity: number;
  distance: number;
  motion: number;
}

interface AlertValues {
  fall_detected: boolean;
  fever_detected: boolean;
  emergency: boolean;
}

export interface ISensorReading extends Document {
  device_id: string;
  timestamp: Date;
  sensors: SensorValues;
  alerts: AlertValues;
  createdAt?: Date;
  updatedAt?: Date;
}

const sensorReadingSchema = new Schema<ISensorReading>(
  {
    device_id: { type: String, required: true, trim: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    sensors: {
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      distance: { type: Number, required: true },
      motion: { type: Number, required: true },
    },
    alerts: {
      fall_detected: { type: Boolean, required: true },
      fever_detected: { type: Boolean, required: true },
      emergency: { type: Boolean, required: true },
    },
  },
  { timestamps: true },
);

export const SensorReading = model<ISensorReading>('SensorReading', sensorReadingSchema);
