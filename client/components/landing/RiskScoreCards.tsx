'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScoreWithCategoryResponse } from '@/lib/riskProfiling/risk';

interface RiskScoreCardsProps {
  tolerance: ScoreWithCategoryResponse;
  capacity: ScoreWithCategoryResponse;
}

export default function RiskScoreCards({ tolerance, capacity }: RiskScoreCardsProps) {
  return (
    <div className="grid gap-8 max-w-6xl mx-auto mb-12 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Risk Tolerance</h3>
                <p className="text-sm text-gray-500">Your emotional comfort with risk</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {tolerance.totalScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Category: {tolerance.category}
                </div>
              </div>
              <Progress
                value={(tolerance.totalScore / 16) * 100 }
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Risk Capacity</h3>
                <p className="text-sm text-gray-500">Your financial ability to take risk</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {capacity.totalScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Category: {capacity.category || 'Moderate'}
                </div>
              </div>
              <Progress
                value={(capacity.totalScore / 12) * 100}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}