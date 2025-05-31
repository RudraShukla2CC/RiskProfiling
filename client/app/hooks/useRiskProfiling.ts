import { useState, useCallback } from 'react';
import { riskProfilingAPI } from '@/lib/riskProfiling';
import { QuestionnaireGetResponse, UserAnswer, RiskType, RiskScores } from '@/types/riskProfiling';

export const useRiskProfiling = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionnaireGetResponse | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<RiskScores>({ tolerance: null, capacity: null });
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (riskType: RiskType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await riskProfilingAPI.getQuestions(riskType);
      setQuestions(data);
      setAnswers([]);
      setCurrentQuestion(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionIndex === questionIndex);
      if (existing) {
        return prev.map(a => 
          a.questionIndex === questionIndex 
            ? { ...a, answerIndex } 
            : a
        );
      }
      return [...prev, { questionIndex, answerIndex }];
    });
  }, []);

  const submitAssessment = useCallback(async (riskType: RiskType) => {
    if (!questions || answers.length !== questions.questions.length) {
      setError('Please answer all questions');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await riskProfilingAPI.submitScore(riskType, { answers });
      setScores(prev => ({ ...prev, [riskType]: result.riskScore }));
      return result.riskScore;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [questions, answers]);

  const nextQuestion = useCallback(() => {
    if (questions && currentQuestion < questions.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [questions, currentQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const reset = useCallback(() => {
    setQuestions(null);
    setAnswers([]);
    setCurrentQuestion(0);
    setError(null);
  }, []);

  return {
    loading,
    questions,
    answers,
    currentQuestion,
    scores,
    error,
    fetchQuestions,
    submitAnswer,
    submitAssessment,
    nextQuestion,
    previousQuestion,
    reset
  };
};