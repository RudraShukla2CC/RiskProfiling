'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
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
}

export default function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  const { tolerance, capacity } = results;
  const [portfolio, setPortfolio] = useState<any>(null);
  
  
  // Initialize with the bucket from tolerance, fallback to 'Moderate' if not available
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
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto text-center mb-12"
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

        {/* Risk Score Cards Component */}
        <RiskScoreCards tolerance={tolerance} capacity={capacity} />

        {/* Risk Category Selector - Only show if no portfolio built yet */}
         (
          <RiskCategorySelector
            selectedCategory={selectedRiskCategory}
            onCategoryChange={handleCategoryChange}
          />
        )

        {/* Portfolio Construction - Only show if no portfolio built yet */}
         (
        <PortfolioAllocation
          selectedRiskCategory={selectedRiskCategory}
          onPortfolioBuilt={handlePortfolioBuilt}
        />
      )

        {/* Portfolio Results - Only show after portfolio is built */}
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