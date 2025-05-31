'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuestionResponse } from '@/types/riskProfiling';

interface QuestionCardProps {
  question: QuestionResponse;
  questionIndex: number;
  selectedAnswer: number | undefined;
  onAnswerSelect: (answerIndex: number) => void;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  onAnswerSelect,
  totalQuestions
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-600">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <CardTitle className="text-xl text-gray-800 leading-relaxed">
            {question.questionText}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => onAnswerSelect(parseInt(value))}
            className="space-y-4"
          >
            {question.answers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-blue-50 ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onAnswerSelect(index)}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`answer-${index}`}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`answer-${index}`}
                  className="text-gray-700 leading-relaxed cursor-pointer flex-1"
                >
                  {answer.answerText}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}