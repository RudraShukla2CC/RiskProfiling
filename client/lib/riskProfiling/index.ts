import axios from 'axios';
import { QuestionnaireGetResponse, QuestionnaireResponse, ScoreResponse, RiskType } from '@/types/riskProfiling';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const riskProfilingAPI = {
  async getQuestions(riskType: RiskType): Promise<QuestionnaireGetResponse> {
    try {
      const response = await axios.get<QuestionnaireGetResponse>(
        `${API_BASE_URL}/questions/${riskType}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${riskType} questions:`, error);
      throw new Error(`Failed to fetch ${riskType} questions`);
    }
  },

  async submitScore(riskType: RiskType, answers: QuestionnaireResponse): Promise<ScoreResponse> {
    try {
      // Capitalize first letter to match API pattern
      const capitalizedType = riskType.charAt(0).toUpperCase() + riskType.slice(1);
      
      const response = await axios.post<ScoreResponse>(
        `${API_BASE_URL}/score/${capitalizedType}`,
        answers
      );
      return response.data;
    } catch (error) {
      console.error(`Error submitting ${riskType} score:`, error);
      throw new Error(`Failed to submit ${riskType} assessment`);
    }
  }
};