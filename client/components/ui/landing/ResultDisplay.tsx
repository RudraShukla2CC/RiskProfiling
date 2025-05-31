'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Award, 
  Download, 
  RefreshCw, 
  ChevronRight,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ScoreWithCategoryResponse,
  getRiskCategoryColor,
  getRiskCategoryIcon,
  formatRiskDescription
} from '@/lib/riskProfiling';

interface ResultsDisplayProps {
  results: {
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  };
  onRestart: () => void;
}

export default function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  const { tolerance, capacity } = results;

  const getRecommendation = () => {
    const toleranceLevel = tolerance.category.toLowerCase();
    const capacityLevel = capacity.category.toLowerCase();
    
    if (toleranceLevel === 'high' && capacityLevel === 'high') {
      return {
        title: 'Aggressive Growth Strategy',
        description: 'You have both the emotional comfort and financial capacity for high-risk investments.',
        allocation: { stocks: 80, bonds: 15, alternatives: 5 },
        icon: '🚀',
        color: 'text-red-600 bg-red-100'
      };
    } else if (toleranceLevel === 'medium' && capacityLevel === 'medium') {
      return {
        title: 'Balanced Investment Approach',
        description: 'A moderate strategy balancing growth potential with stability.',
        allocation: { stocks: 60, bonds: 35, alternatives: 5 },
        icon: '⚖️',
        color: 'text-yellow-600 bg-yellow-100'
      };
    } else if (toleranceLevel === 'low' || capacityLevel === 'low') {
      return {
        title: 'Conservative Preservation Strategy',
        description: 'Focus on capital preservation with minimal risk exposure.',
        allocation: { stocks: 30, bonds: 65, alternatives: 5 },
        icon: '🛡️',
        color: 'text-green-600 bg-green-100'
      };
    } else {
      return {
        title: 'Moderate Growth Strategy',
        description: 'A balanced approach with slight growth orientation.',
        allocation: { stocks: 50, bonds: 45, alternatives: 5 },
        icon: '📈',
        color: 'text-blue-600 bg-blue-100'
      };
    }
  };

  const recommendation = getRecommendation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleDownloadReport = () => {
    // Create a simple text report
    const report = `
RISK PROFILE ASSESSMENT REPORT
Generated on: ${new Date().toLocaleDateString()}

RISK TOLERANCE: ${tolerance.category}
Score: ${tolerance.totalScore.toFixed(2)}
${formatRiskDescription(tolerance.category)}

RISK CAPACITY: ${capacity.category}
Score: ${capacity.totalScore.toFixed(2)}
${formatRiskDescription(capacity.category)}

RECOMMENDED STRATEGY: ${recommendation.title}
${recommendation.description}

SUGGESTED ALLOCATION:
• Stocks: ${recommendation.allocation.stocks}%
• Bonds: ${recommendation.allocation.bonds}%
• Alternatives: ${recommendation.allocation.alternatives}%

This assessment is for informational purposes only and should not be considered as financial advice.
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'risk-profile-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 min-h-screen py-8 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Award className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Your Risk Profile Results
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your responses, here's your comprehensive risk assessment and personalized investment recommendations.
            </p>
          </motion.div>

          {/* Results Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Risk Tolerance */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Risk Tolerance</h3>
                      <p className="text-sm text-gray-500">Your emotional comfort with risk</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getRiskCategoryColor(tolerance.category)}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="mr-2 text-xl">{getRiskCategoryIcon(tolerance.category)}</span>
                      {tolerance.category} Risk Tolerance
                    </motion.div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {tolerance.totalScore.toFixed(1)}
                      </div>
                      <Progress 
                        value={(tolerance.totalScore / Math.max(...tolerance.perQuestionScores.map(q => q.score))) * 100} 
                        className="h-3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Assessment Breakdown:</h4>
                    {tolerance.perQuestionScores.slice(0, 3).map((score, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1 mr-2">
                          {score.questionText.length > 50 
                            ? `${score.questionText.substring(0, 50)}...` 
                            : score.questionText
                          }
                        </span>
                        <span className="font-semibold text-blue-600">
                          {score.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                    {tolerance.perQuestionScores.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{tolerance.perQuestionScores.length - 3} more questions
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Capacity */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Risk Capacity</h3>
                      <p className="text-sm text-gray-500">Your financial ability to take risk</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getRiskCategoryColor(capacity.category)}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <span className="mr-2 text-xl">{getRiskCategoryIcon(capacity.category)}</span>
                      {capacity.category} Risk Capacity
                    </motion.div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {capacity.totalScore.toFixed(1)}
                      </div>
                      <Progress 
                        value={(capacity.totalScore / Math.max(...capacity.perQuestionScores.map(q => q.score))) * 100} 
                        className="h-3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Assessment Breakdown:</h4>
                    {capacity.perQuestionScores.slice(0, 3).map((score, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1 mr-2">
                          {score.questionText.length > 50 
                            ? `${score.questionText.substring(0, 50)}...` 
                            : score.questionText
                          }
                        </span>
                        <span className="font-semibold text-green-600">
                          {score.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                    {capacity.perQuestionScores.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{capacity.perQuestionScores.length - 3} more questions
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recommendation */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${recommendation.color}`}>
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recommended Investment Strategy</h3>
                    <p className="text-sm text-gray-500">Based on your risk profile assessment</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${recommendation.color}`}>
                      <span className="mr-2 text-xl">{recommendation.icon}</span>
                      {recommendation.title}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {recommendation.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Suggested Asset Allocation:</h4>
                      <div className="space-y-2">
                        {Object.entries(recommendation.allocation).map(([asset, percentage]) => (
                          <div key={asset} className="flex items-center space-x-3">
                            <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                              {asset}:
                            </div>
                            <div className="flex-1">
                              <Progress value={percentage} className="h-2" />
                            </div>
                            <div className="w-12 text-sm font-semibold text-gray-900">
                              {percentage}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Portfolio Visualization</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Expected Return:</span>
                          <span className="font-semibold">
                            {recommendation.allocation.stocks > 60 ? '8-12%' : 
                             recommendation.allocation.stocks > 40 ? '6-10%' : '4-8%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Level:</span>
                          <span className="font-semibold">
                            {recommendation.allocation.stocks > 60 ? 'High' : 
                             recommendation.allocation.stocks > 40 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button
              onClick={handleDownloadReport}
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>
            
            <Button
              onClick={onRestart}
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Take Assessment Again
            </Button>
          </motion.div>

          {/* Disclaimer */}
          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h4>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    This risk profile assessment is for informational and educational purposes only. 
                    It should not be considered as personalized financial advice. Please consult with 
                    a qualified financial advisor before making investment decisions. Past performance 
                    does not guarantee future results, and all investments carry risk of loss.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}