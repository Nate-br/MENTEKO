import { Schema, model, type Document, type Types } from 'mongoose';

export type ScenarioCategory =
  | 'phishing'
  | 'impersonation'
  | 'payment-fraud'
  | 'fake-evidence'
  | 'social-engineering'
  | 'baiting'
  | 'scareware';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ScenarioOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface ScenarioIndicator {
  id: string;
  title: string;
  description: string;
}

export interface ScenarioContent {
  sender?: string;
  subject?: string;
  body: string;
  callToAction?: string;
  fromName?: string;
  fromEmail?: string;
  to?: string;
  sentAt?: string;
  linkDisplay?: string;
  linkActual?: string;
  attachmentLabel?: string;
  meta?: Record<string, string>;
}

export interface IScenario extends Document {
  _id: Types.ObjectId;
  title: string;
  category: ScenarioCategory;
  difficulty: Difficulty;
  format: string;
  context: string;
  content: ScenarioContent;
  indicators: ScenarioIndicator[];
  options: ScenarioOption[];
  explanation: string;
  betterResponse: string;
  isActive: boolean;
  createdAt: Date;
}

const optionSchema = new Schema<ScenarioOption>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false },
);

const indicatorSchema = new Schema<ScenarioIndicator>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const contentSchema = new Schema<ScenarioContent>(
  {
    sender: String,
    subject: String,
    body: { type: String, required: true },
    callToAction: String,
    fromName: String,
    fromEmail: String,
    to: String,
    sentAt: String,
    linkDisplay: String,
    linkActual: String,
    attachmentLabel: String,
    meta: { type: Map, of: String },
  },
  { _id: false },
);

const scenarioSchema = new Schema<IScenario>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
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
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  format: { type: String, required: true, trim: true, maxlength: 60 },
  context: { type: String, required: true, trim: true, maxlength: 500 },
  content: { type: contentSchema, required: true },
  indicators: {
    type: [indicatorSchema],
    validate: [(v: unknown[]) => v.length > 0, 'At least one indicator is required'],
  },
  options: {
    type: [optionSchema],
    validate: [(v: unknown[]) => v.length >= 2, 'At least two options are required'],
  },
  explanation: { type: String, required: true, maxlength: 1000 },
  betterResponse: { type: String, required: true, maxlength: 500 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

scenarioSchema.index({ category: 1, isActive: 1 });

export const Scenario = model<IScenario>('Scenario', scenarioSchema);
