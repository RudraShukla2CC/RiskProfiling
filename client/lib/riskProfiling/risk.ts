// Types
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

export interface QuestionScore {
  questionText: string;
  score: number;
}

export interface ScoreWithCategoryResponse {
  totalScore: number;
  perQuestionScores: QuestionScore[];
  category: 'Low' | 'Medium' | 'High';
  bucket?: string; 
}

export type RiskType = 'tolerance' | 'capacity';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/risk';


class RiskProfilingAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getQuestions(riskType: RiskType): Promise<QuestionnaireGetResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/questions/${riskType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<QuestionnaireGetResponse>(response);
    } catch (error) {
      console.error(`Error fetching ${riskType} questions:`, error);
      throw new Error(`Failed to fetch ${riskType} questions. Please try again.`);
    }
  }

  async submitAnswers(
    riskType: RiskType, 
    answers: UserAnswer[]
  ): Promise<ScoreWithCategoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/score/${riskType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      return this.handleResponse<ScoreWithCategoryResponse>(response);
    } catch (error) {
      console.error(`Error submitting ${riskType} answers:`, error);
      throw new Error(`Failed to submit ${riskType} answers. Please try again.`);
    }
  }

  async getAllQuestions(): Promise<{
    tolerance: QuestionnaireGetResponse;
    capacity: QuestionnaireGetResponse;
  }> {
    try {
      const [tolerance, capacity] = await Promise.all([
        this.getQuestions('tolerance'),
        this.getQuestions('capacity'),
      ]);

      return { tolerance, capacity };
    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw new Error('Failed to fetch assessment questions. Please try again.');
    }
  }


  async submitAllAnswers(data: {
    toleranceAnswers: UserAnswer[];
    capacityAnswers: UserAnswer[];
  }): Promise<{
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  }> {
    try {
      const [tolerance, capacity] = await Promise.all([
        this.submitAnswers('tolerance', data.toleranceAnswers),
        this.submitAnswers('capacity', data.capacityAnswers),
      ]);

      return { tolerance, capacity };
    } catch (error) {
      console.error('Error submitting all answers:', error);
      throw new Error('Failed to submit assessment answers. Please try again.');
    }
  }
}

export const riskProfilingAPI = new RiskProfilingAPI();

export interface UseQuestionsResult {
  data: QuestionnaireGetResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAllQuestionsResult {
  data: {
    tolerance: QuestionnaireGetResponse;
    capacity: QuestionnaireGetResponse;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseSubmitAnswersResult {
  submitAnswers: (riskType: RiskType, answers: UserAnswer[]) => Promise<ScoreWithCategoryResponse>;
  submitting: boolean;
  error: string | null;
}

export interface UseSubmitAllAnswersResult {
  submitAllAnswers: (data: {
    toleranceAnswers: UserAnswer[];
    capacityAnswers: UserAnswer[];
  }) => Promise<{
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  }>;
  submitting: boolean;
  error: string | null;
}

export const getRiskCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getRiskCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'low':
      return '🛡️';
    case 'medium':
      return '⚖️';
    case 'high':
      return '🚀';
    default:
      return '❓';
  }
};

export const formatRiskDescription = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'low':
      return 'Conservative approach with focus on capital preservation';
    case 'medium':
      return 'Balanced approach with moderate risk and return expectations';
    case 'high':
      return 'Aggressive approach with higher risk tolerance for potential gains';
    default:
      return 'Risk profile assessment needed';
  }
};

// Validation helpers
export const validateAnswers = (
  answers: UserAnswer[], 
  totalQuestions: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (answers.length !== totalQuestions) {
    errors.push(`Expected ${totalQuestions} answers, but received ${answers.length}`);
  }

  answers.forEach((answer, index) => {
    if (answer.questionIndex < 0 || answer.questionIndex >= totalQuestions) {
      errors.push(`Invalid question index ${answer.questionIndex} at position ${index}`);
    }
    if (answer.answerIndex < 0) {
      errors.push(`Invalid answer index ${answer.answerIndex} at position ${index}`);
    }
  });

  const questionIndices = answers.map(a => a.questionIndex);
  const uniqueIndices = new Set(questionIndices);
  if (uniqueIndices.size !== questionIndices.length) {
    errors.push('Duplicate question indices found');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default riskProfilingAPI;