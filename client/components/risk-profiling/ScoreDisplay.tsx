'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RiskScores } from '@/types/riskProfiling';
import { TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScoreDisplayProps {
  scores: RiskScores;
}

const getRiskLevel = (score: number) => {
  if (score <= 25) return { level: 'Conservative', color: 'green', icon: Shield };
  if (score <= 50) return { level: 'Moderate', color: 'blue', icon: TrendingUp };
  if (score <= 75) return { level: 'Aggressive', color: 'orange', icon: AlertTriangle };
  return { level: 'Very Aggressive', color: 'red', icon: AlertTriangle };
};

const getScoreDescription = (type: 'tolerance' | 'capacity', score: number) => {
  const level = getRiskLevel(score).level;
  
  if (type === 'tolerance') {
    switch (level) {
      case 'Conservative':
        return 'You prefer stability and are uncomfortable with market volatility. Low-risk investments align with your comfort level.';
      case 'Moderate':
        return 'You can handle some market fluctuations for potentially higher returns. A balanced portfolio suits your risk appetite.';
      case 'Aggressive':
        return 'You are comfortable with significant market volatility for the potential of higher long-term returns.';
      case 'Very Aggressive':
        return 'You embrace high volatility and are willing to accept substantial short-term losses for maximum growth potential.';
      default:
        return '';
    }
  } else {
    switch (level) {
      case 'Conservative':
        return 'Your financial situation suggests a cautious approach. Focus on capital preservation and steady growth.';
      case 'Moderate':
        return 'Your financial capacity allows for moderate risk-taking with a balanced growth strategy.';
      case 'Aggressive':
        return 'Your strong financial position enables you to take on higher risks for potentially greater rewards.';
      case 'Very Aggressive':
        return 'Your excellent financial capacity allows for maximum risk-taking and growth-oriented investments.';
      default:
        return '';
    }
  }
};

export default function ScoreDisplay({ scores }: ScoreDisplayProps) {
  const hasScores = scores.tolerance !== null || scores.capacity !== null;
  
  if (!hasScores) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Risk Profile Results</h2>
        <p className="text-gray-600">Based on your responses, here's your personalized risk assessment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Tolerance Score */}
        {scores.tolerance !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-6 w-6" />
                  Risk Tolerance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-800">{scores.tolerance}</span>
                    <Badge 
                      variant="secondary"
                      className={`${
                        getRiskLevel(scores.tolerance).color === 'green' ? 'bg-green-100 text-green-800' :
                        getRiskLevel(scores.tolerance).color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        getRiskLevel(scores.tolerance).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {getRiskLevel(scores.tolerance).level}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={scores.tolerance} 
                    className="h-3"
                  />
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getScoreDescription('tolerance', scores.tolerance)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Risk Capacity Score */}
        {scores.capacity !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Shield className="h-6 w-6" />
                  Risk Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-800">{scores.capacity}</span>
                    <Badge 
                      variant="secondary"
                      className={`${
                        getRiskLevel(scores.capacity).color === 'green' ? 'bg-green-100 text-green-800' :
                        getRiskLevel(scores.capacity).color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        getRiskLevel(scores.capacity).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {getRiskLevel(scores.capacity).level}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={scores.capacity} 
                    className="h-3"
                  />
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getScoreDescription('capacity', scores.capacity)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Overall Recommendation */}
      {scores.tolerance !== null && scores.capacity !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Investment Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.min(scores.tolerance, scores.capacity)}
                    </div>
                    <div className="text-sm text-gray-600">Recommended Risk Level</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">
                      Your recommended investment strategy should align with the lower of your risk tolerance and capacity scores. 
                      This ensures you're comfortable with the investment approach while staying within your financial means.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800 mb-1">Asset Allocation</div>
                    <div className="text-sm text-blue-600">
                      {Math.min(scores.tolerance, scores.capacity) <= 25 ? '80% Bonds, 20% Stocks' :
                       Math.min(scores.tolerance, scores.capacity) <= 50 ? '60% Bonds, 40% Stocks' :
                       Math.min(scores.tolerance, scores.capacity) <= 75 ? '40% Bonds, 60% Stocks' :
                       '20% Bonds, 80% Stocks'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800 mb-1">Time Horizon</div>
                    <div className="text-sm text-purple-600">
                      {Math.min(scores.tolerance, scores.capacity) <= 25 ? 'Short-term (1-3 years)' :
                       Math.min(scores.tolerance, scores.capacity) <= 50 ? 'Medium-term (3-7 years)' :
                       'Long-term (7+ years)'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800 mb-1">Review Frequency</div>
                    <div className="text-sm text-green-600">
                      {Math.min(scores.tolerance, scores.capacity) <= 50 ? 'Quarterly' : 'Semi-annually'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}