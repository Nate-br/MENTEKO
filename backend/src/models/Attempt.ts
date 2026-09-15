import { Schema, model, type Document, type Types } from 'mongoose';

export interface IAttempt extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  scenario: Types.ObjectId;
  selectedOption: string;
  correct: boolean;
  score: number;
  reasoning?: string;
  createdAt: Date;
}

const attemptSchema = new Schema<IAttempt>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  scenario: { type: Schema.Types.ObjectId, ref: 'Scenario', required: true },
  selectedOption: { type: String, required: true },
  correct: { type: Boolean, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  reasoning: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

attemptSchema.index({ scenario: 1, createdAt: -1 });

export const Attempt = model<IAttempt>('Attempt', attemptSchema);
