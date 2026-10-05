import { Schema, model, type Document, type Types } from 'mongoose';
import type { ScenarioCategory } from './Scenario';

export interface CategoryBreakdown {
  category: ScenarioCategory;
  correct: number;
  total: number;
}

export interface IAssessment extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  categoryBreakdown: CategoryBreakdown[];
  completedAt: Date;
}

const breakdownSchema = new Schema<CategoryBreakdown>(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'phishing',
        'impersonation',
        'payment-fraud',
        'fake-evidence',
        'social-engineering',
        'baiting',
        'scareware',
      ],
    },
    correct: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const assessmentSchema = new Schema<IAssessment>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  totalQuestions: { type: Number, required: true, min: 0 },
  correctAnswers: { type: Number, required: true, min: 0 },
  score: { type: Number, required: true, min: 0, max: 100 },
  categoryBreakdown: { type: [breakdownSchema], default: [] },
  completedAt: { type: Date, default: Date.now },
});

export const Assessment = model<IAssessment>('Assessment', assessmentSchema);
