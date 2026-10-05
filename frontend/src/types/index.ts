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
  /** True if this is the safe / correct course of action */
  isCorrect: boolean;
  outcomeNote?: string;
}

export interface ScenarioIndicator {
  id: string;
  title: string;
  description: string;
}

export interface Scenario {
  _id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: Difficulty;
  /** Short situational framing shown before the simulated content, e.g. "MESSAGE" */
  format: string;
  context: string;
  content: ScenarioContent;
  indicators: ScenarioIndicator[];
  options: ScenarioOption[];
  explanation: string;
  betterResponse: string;
  isActive: boolean;
  createdAt: string;
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

export interface Attempt {
  _id: string;
  user?: string;
  scenario: string;
  selectedOption: string;
  correct: boolean;
  score: number;
  reasoning?: string;
  createdAt: string;
}

export interface CategoryBreakdown {
  category: ScenarioCategory;
  correct: number;
  total: number;
}

export interface Assessment {
  _id: string;
  user?: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  categoryBreakdown: CategoryBreakdown[];
  completedAt: string;
}

export interface LearnTopic {
  id: string;
  title: string;
  category: ScenarioCategory;
  definition: string;
  warningSigns: string[];
  example: string;
  saferBehavior: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
