import { Schema, model, Document, Types } from 'mongoose';

export type DiagnosticStatus = 'requested' | 'in-progress' | 'completed';

export interface IDiagnosticTest extends Document {
  userId: Types.ObjectId;
  type: string;
  result?: string;
  status: DiagnosticStatus;
}

const diagnosticSchema = new Schema<IDiagnosticTest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    result: String,
    status: { type: String, enum: ['requested', 'in-progress', 'completed'], default: 'requested' },
  },
  { timestamps: true },
);

diagnosticSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const DiagnosticTest = model<IDiagnosticTest>('DiagnosticTest', diagnosticSchema);

