'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScoreWithCategoryResponse } from '@/lib/riskProfiling/risk';
import RiskScoreCards from './RiskScoreCards';
import RiskCategorySelector from './RiskCategorySelector';
import PortfolioAllocation from './PortfolioAllocation';
import PortfolioResults from './PortfolioResults';

interface ResultsDisplayProps {
  results: {
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  };
  onRestart: () => void;
  annualIncome: number;
  recommendedInvestmentRange: string;
}

export default function ResultsDisplay({ results, onRestart, annualIncome, recommendedInvestmentRange }: ResultsDisplayProps) {
  const { tolerance, capacity } = results;
  const [portfolio, setPortfolio] = useState<any>(null);
  
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>(
    tolerance.bucket || 'Moderate'
  );

  const handlePortfolioBuilt = (portfolioData: any) => {
    setPortfolio(portfolioData);
  };

  const handleRestart = () => {
    setPortfolio(null);
    onRestart();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedRiskCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden py-8 px-6">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 mx-auto shadow-lg">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Risk Profile Results</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your assessment, here are your risk scores and personalized portfolio construction tool.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recommended Investment Amount
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {recommendedInvestmentRange}
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on your annual income of ${annualIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <RiskScoreCards tolerance={tolerance} capacity={capacity} />

        <RiskCategorySelector
          selectedCategory={selectedRiskCategory}
          onCategoryChange={handleCategoryChange}
        />

        <PortfolioAllocation
          selectedRiskCategory={selectedRiskCategory}
          onPortfolioBuilt={handlePortfolioBuilt}
        />

        {portfolio && (
          <PortfolioResults
            portfolio={portfolio}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}