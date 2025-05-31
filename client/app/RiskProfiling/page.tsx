'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import QuestionCard from '@/components/risk-profiling/QuestionCard';
import ScoreDisplay from '@/components/risk-profiling/ScoreDisplay';
import { useRiskProfiling } from '../hooks/useRiskProfiling';
import { RiskType } from '@/types/riskProfiling';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function RiskProfilingPage() {
  const router = useRouter();
  const {
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
  } = useRiskProfiling();

  const [currentRiskType, setCurrentRiskType] = useState<RiskType | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleRiskTypeSelection = async (riskType: RiskType) => {
    setCurrentRiskType(riskType);
    setShowResults(false);
    await fetchQuestions(riskType);
  };

  const handleAnswerSelection = (answerIndex: number) => {
    if (questions) {
      submitAnswer(currentQuestion, answerIndex);
    }
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestion < questions.questions.length - 1) {
      nextQuestion();
    } else {
      // Last question, submit assessment
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    if (currentRiskType && questions) {
      const score = await submitAssessment(currentRiskType);
      if (score !== null) {
        setShowResults(true);
      }
    }
  };

  const handleStartOver = () => {
    reset();
    setCurrentRiskType(null);
    setShowResults(false);
  };

  const getCurrentAnswer = () => {
    return answers.find((a: { questionIndex: any; }) => a.questionIndex === currentQuestion)?.answerIndex;
  };

  const isCurrentQuestionAnswered = () => {
    return getCurrentAnswer() !== undefined;
  };

  const getCompletedAssessments = () => {
    const completed = [];
    if (scores.tolerance !== null) completed.push('tolerance');
    if (scores.capacity !== null) completed.push('capacity');
    return completed;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center gap-2"
            >
              Start New Assessment
            </Button>
          </div>

          <ScoreDisplay scores={scores} />

          <div className="mt-8 text-center">
            <Button
              onClick={handleStartOver}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions && currentRiskType) {
    const currentQuestionData = questions.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Selection
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {currentRiskType} Assessment
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.questions.length}
              </p>
            </div>
            <div className="w-24" /> {/* Spacer */}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion}
              question={currentQuestionData}
              questionIndex={currentQuestion}
              selectedAnswer={getCurrentAnswer()}
              onAnswerSelect={handleAnswerSelection}
              totalQuestions={questions.questions.length}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={!isCurrentQuestionAnswered() || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentQuestion === questions.questions.length - 1 ? (
                <>
                  Submit Assessment
                  <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Risk Type Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="absolute top-6 left-6 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Risk Profiling Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete both assessments to get a comprehensive understanding of your investment risk profile
            </p>
          </motion.div>
        </div>

        {/* Completed Assessments */}
        {getCompletedAssessments().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Completed: {getCompletedAssessments().map(type => 
                  type.charAt(0).toUpperCase() + type.slice(1)
                ).join(', ')}
                {getCompletedAssessments().length === 2 && (
                  <Button
                    variant="link"
                    onClick={() => setShowResults(true)}
                    className="ml-4 text-green-700 underline p-0 h-auto"
                  >
                    View Results
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Risk Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-800">Risk Tolerance</CardTitle>
                    {scores.tolerance !== null && (
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-gray-700 leading-relaxed mb-6">
                  Measures your emotional comfort level with investment volatility and potential losses. 
                  This assessment helps determine how much risk you're psychologically prepared to handle.
                </CardDescription>
                <Button
                  onClick={() => handleRiskTypeSelection('tolerance')}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {scores.tolerance !== null ? 'Retake Assessment' : 'Start Assessment'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-purple-800">Risk Capacity</CardTitle>
                    {scores.capacity !== null && (
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-gray-700 leading-relaxed mb-6">
                  Evaluates your financial ability to take risks based on your income, expenses, time horizon, 
                  and financial goals. This determines how much risk you can actually afford to take.
                </CardDescription>
                <Button
                  onClick={() => handleRiskTypeSelection('capacity')}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {scores.capacity !== null ? 'Retake Assessment' : 'Start Assessment'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-gray-800">
                Why Both Assessments Matter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Risk Tolerance</h3>
                  <p className="text-sm text-gray-600">
                    Your psychological comfort with risk - how you feel about potential losses
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Risk Capacity</h3>
                  <p className="text-sm text-gray-600">
                    Your financial ability to take risk - what you can afford to lose
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
              <p className="text-center text-gray-700">
                Your optimal investment strategy will be based on the lower of these two scores, 
                ensuring you're both comfortable and financially secure with your investment approach.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}