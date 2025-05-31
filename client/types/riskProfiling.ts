export interface AnswerOption {
  answerText: string;
}

export interface QuestionResponse {
  questionText: string;
  answers: AnswerOption[];
}

export interface QuestionnaireGetResponse {
  type: string;
  questions: QuestionResponse[];
}

export interface UserAnswer {
  questionIndex: number;
  answerIndex: number;
}

export interface QuestionnaireResponse {
  answers: UserAnswer[];
}

export interface ScoreResponse {
  riskScore: number;
}

export type RiskType = 'tolerance' | 'capacity';

export interface RiskScores {
  tolerance: number | null;
  capacity: number | null;
}