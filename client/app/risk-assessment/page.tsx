'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  riskProfilingAPI, 
  QuestionnaireGetResponse, 
  UserAnswer, 
  ScoreWithCategoryResponse,
  validateAnswers,
} from '@/lib/riskProfiling/risk';
import LoadingSpinner from '@/components/landing/LoadingSpinner';
import ResultsDisplay from '@/components/landing/ResultDisplay';

interface AssessmentState {
  toleranceQuestions: QuestionnaireGetResponse | null;
  capacityQuestions: QuestionnaireGetResponse | null;
  toleranceAnswers: UserAnswer[];
  capacityAnswers: UserAnswer[];
  annualIncome: number;
  recommendedInvestmentRange: string;
  currentStep: 'loading' | 'tolerance' | 'capacity' | 'income' | 'results';
  currentQuestionIndex: number;
  results: {
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  } | null;
  loading: boolean;
  error: string | null;
}

const incomeBrackets = [
  { range: [0, 24999], percentage: 0.184 },
  { range: [25000, 49999], percentage: 0.182 },
  { range: [50000, 74999], percentage: 0.222 },
  { range: [75000, 99999], percentage: 0.352 },
  { range: [100000, Infinity], percentage: 0.351 },
];

const getInvestmentRange = (annualIncome: number): string => {
  // Find the appropriate bracket
  const bracket = incomeBrackets.find(
    b => annualIncome >= b.range[0] && annualIncome <= b.range[1]
  );
  
  if (!bracket) return "Unable to calculate investment range";
  
  // Calculate base investment amount
  const baseInvestment = annualIncome * bracket.percentage;
  
  // Rounding logic based on income size
  let rounded: number;
  let rangeWidth: number;
  
  if (annualIncome >= 1000000) {
    rounded = Math.round(baseInvestment / 50000) * 50000;
    rangeWidth = 50000;
  } else if (annualIncome >= 250000) {
    rounded = Math.round(baseInvestment / 10000) * 10000;
    rangeWidth = 10000;
  } else {
    rounded = Math.round(baseInvestment / 5000) * 5000;
    rangeWidth = 5000;
  }
  
  // Construct investment range
  const lowerBound = Math.max(0, rounded - rangeWidth);
  const upperBound = rounded + rangeWidth;
  
  return `Based on your income, people typically start investing around $${lowerBound.toLocaleString()} to $${upperBound.toLocaleString()}`;
};

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState>({
    toleranceQuestions: null,
    capacityQuestions: null,
    toleranceAnswers: [],
    capacityAnswers: [],
    annualIncome: 50000,
    recommendedInvestmentRange: getInvestmentRange(50000),
    currentStep: 'loading',
    currentQuestionIndex: 0,
    results: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { tolerance, capacity } = await riskProfilingAPI.getAllQuestions();
      
      setState(prev => ({
        ...prev,
        toleranceQuestions: tolerance,
        capacityQuestions: capacity,
        toleranceAnswers: new Array(tolerance.questions.length).fill(null).map((_, index) => ({
          questionIndex: index,
          answerIndex: -1
        })),
        capacityAnswers: new Array(capacity.questions.length).fill(null).map((_, index) => ({
          questionIndex: index,
          answerIndex: -1
        })),
        currentStep: 'tolerance',
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load questions',
        loading: false,
      }));
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setState(prev => {
      const isToleranceStep = prev.currentStep === 'tolerance';
      const answers = isToleranceStep ? [...prev.toleranceAnswers] : [...prev.capacityAnswers];
      
      answers[prev.currentQuestionIndex] = {
        questionIndex: prev.currentQuestionIndex,
        answerIndex,
      };

      return {
        ...prev,
        toleranceAnswers: isToleranceStep ? answers : prev.toleranceAnswers,
        capacityAnswers: isToleranceStep ? prev.capacityAnswers : answers,
      };
    });
  };

  const handleIncomeChange = (value: number[]) => {
    const income = value[0];
    const investmentRange = getInvestmentRange(income);
    
    setState(prev => ({
      ...prev,
      annualIncome: income,
      recommendedInvestmentRange: investmentRange,
    }));
  };

  const getCurrentQuestions = () => {
    return state.currentStep === 'tolerance' ? state.toleranceQuestions : state.capacityQuestions;
  };

  const getCurrentAnswers = () => {
    return state.currentStep === 'tolerance' ? state.toleranceAnswers : state.capacityAnswers;
  };

  const canProceed = () => {
    if (state.currentStep === 'income') return true;
    const currentAnswers = getCurrentAnswers();
    return currentAnswers[state.currentQuestionIndex]?.answerIndex >= 0;
  };

  const handleNext = () => {
    const currentQuestions = getCurrentQuestions();
    if (state.currentStep === 'income') {
      submitAllAnswers();
      return;
    }
    if (!currentQuestions) return;

    if (state.currentQuestionIndex < currentQuestions.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else if (state.currentStep === 'tolerance') {
      setState(prev => ({
        ...prev,
        currentStep: 'capacity',
        currentQuestionIndex: 0,
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentStep: 'income',
        currentQuestionIndex: 0,
      }));
    }
  };

  const handlePrevious = () => {
    if (state.currentStep === 'income') {
      setState(prev => ({
        ...prev,
        currentStep: 'capacity',
        currentQuestionIndex: state.capacityQuestions!.questions.length - 1,
      }));
      return;
    }
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    } else if (state.currentStep === 'capacity') {
      setState(prev => ({
        ...prev,
        currentStep: 'tolerance',
        currentQuestionIndex: state.toleranceQuestions!.questions.length - 1,
      }));
    }
  };

  const submitAllAnswers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const toleranceValidation = validateAnswers(
        state.toleranceAnswers, 
        state.toleranceQuestions!.questions.length
      );
      const capacityValidation = validateAnswers(
        state.capacityAnswers, 
        state.capacityQuestions!.questions.length
      );

      if (!toleranceValidation.isValid || !capacityValidation.isValid) {
        throw new Error('Please answer all questions before submitting.');
      }

      const results = await riskProfilingAPI.submitAllAnswers({
        toleranceAnswers: state.toleranceAnswers,
        capacityAnswers: state.capacityAnswers,
      });

      setState(prev => ({
        ...prev,
        results,
        currentStep: 'results',
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to submit assessment',
        loading: false,
      }));
    }
  };

  const getProgress = () => {
    const toleranceTotal = state.toleranceQuestions?.questions.length || 0;
    const capacityTotal = state.capacityQuestions?.questions.length || 0;
    const totalQuestions = toleranceTotal + capacityTotal + 1;
    
    if (totalQuestions === 0) return 0;
    
    let answeredQuestions = 0;
    
    if (state.currentStep === 'tolerance') {
      answeredQuestions = state.currentQuestionIndex;
    } else if (state.currentStep === 'capacity') {
      answeredQuestions = toleranceTotal + state.currentQuestionIndex;
    } else if (state.currentStep === 'income') {
      answeredQuestions = toleranceTotal + capacityTotal;
    } else if (state.currentStep === 'results') {
      answeredQuestions = totalQuestions;
    }
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getStepTitle = () => {
    switch (state.currentStep) {
      case 'tolerance':
        return 'Risk Tolerance Assessment';
      case 'capacity':
        return 'Risk Capacity Assessment';
      case 'income':
        return 'Income Assessment';
      case 'results':
        return 'Your Risk Profile Results';
      default:
        return 'Loading Assessment';
    }
  };

  if (state.currentStep === 'loading' || state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <div className="flex gap-3">
            <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
              Go Back
            </Button>
            <Button onClick={loadQuestions} className="flex-1">
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state.currentStep === 'results' && state.results) {
    return <ResultsDisplay 
      results={state.results} 
      onRestart={() => router.push('/')}
      annualIncome={state.annualIncome}
      recommendedInvestmentRange={state.recommendedInvestmentRange}
    />;
  }

  const currentQuestions = getCurrentQuestions();
  const currentAnswers = getCurrentAnswers();
  
  if (state.currentStep === 'income') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-auto">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <motion.header 
            className="py-6 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="text-center">
                <h1 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h1>
                <p className="text-sm text-gray-500">
                  Income Assessment
                </p>
              </div>
              
              <div className="w-24 text-right">
                <span className="text-sm font-medium text-blue-600">{getProgress()}%</span>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto mt-4">
              <Progress value={getProgress()} className="h-2" />
            </div>
          </motion.header>

          <main className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="max-w-3xl w-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <motion.div 
                          className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          💵 Annual Income
                        </motion.div>
                        
                        <motion.h2 
                          className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          What is your annual income?
                        </motion.h2>
                      </div>

                      <div className="space-y-6">
                        <Slider
                          value={[state.annualIncome]}
                          onValueChange={handleIncomeChange}
                          min={0}
                          max={200000}
                          step={1000}
                          className="w-full"
                        />
                        <div className="text-center">
                          <p className="text-lg text-gray-600">
                            Selected Income: ${state.annualIncome.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {state.recommendedInvestmentRange}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-6">
                        <Button
                          onClick={handlePrevious}
                          variant="outline"
                          className="px-6"
                        >
                          Previous
                        </Button>
                        
                        <Button
                          onClick={handleNext}
                          className="px-6 bg-blue-600 hover:bg-blue-700"
                        >
                          Complete Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!currentQuestions) return null;

  const currentQuestion = currentQuestions.questions[state.currentQuestionIndex];
  const selectedAnswerIndex = currentAnswers[state.currentQuestionIndex]?.answerIndex ?? -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-auto">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header 
          className="py-6 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h1>
              <p className="text-sm text-gray-500">
                Question {state.currentQuestionIndex + 1} of {currentQuestions.questions.length}
              </p>
            </div>
            
            <div className="w-24 text-right">
              <span className="text-sm font-medium text-blue-600">{getProgress()}%</span>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-4">
            <Progress value={getProgress()} className="h-2" />
          </div>
        </motion.header>

        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${state.currentStep}-${state.currentQuestionIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <motion.div 
                          className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {state.currentStep === 'tolerance' ? '🛡️ Risk Tolerance' : '💰 Risk Capacity'}
                        </motion.div>
                        
                        <motion.h2 
                          className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentQuestion.questionText}
                        </motion.h2>
                      </div>

                      <div className="space-y-3">
                        {currentQuestion.answers.map((answer, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                              selectedAnswerIndex === index
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswerIndex === index
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAnswerIndex === index && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-white rounded-full"
                                  />
                                )}
                              </div>
                              <span className="text-gray-800 font-medium">
                                {answer.answerText}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex justify-between pt-6">
                        <Button
                          onClick={handlePrevious}
                          variant="outline"
                          disabled={state.currentStep === 'tolerance' && state.currentQuestionIndex === 0}
                          className="px-6"
                        >
                          Previous
                        </Button>
                        
                        <Button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className="px-6 bg-blue-600 hover:bg-blue-700"
                        >
                          {state.currentStep === 'capacity' && 
                           state.currentQuestionIndex === currentQuestions.questions.length - 1
                            ? 'Next'
                            : 'Next'
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}