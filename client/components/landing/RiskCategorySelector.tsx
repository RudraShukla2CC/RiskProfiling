'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

interface RiskCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RISK_CATEGORIES = [
  { value: 'Conservative', label: 'Conservative', color: 'from-green-500 to-green-600' },
  { value: 'Moderate', label: 'Moderate', color: 'from-blue-500 to-blue-600' },
  { value: 'Growth', label: 'Growth', color: 'from-orange-500 to-orange-600' },
  { value: 'Aggressive Growth', label: 'Aggressive Growth', color: 'from-red-500 to-red-600' },
];

export default function RiskCategorySelector({ selectedCategory, onCategoryChange }: RiskCategorySelectorProps) {
  const currentIndex = RISK_CATEGORIES.findIndex(cat => cat.value === selectedCategory);
  const selectedCategoryData = RISK_CATEGORIES[currentIndex] || RISK_CATEGORIES[1];

  const handleSliderChange = (value: number[]) => {
    const newIndex = value[0];
    onCategoryChange(RISK_CATEGORIES[newIndex].value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="max-w-6xl mx-auto mb-8"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Risk Category</h3>
            <p className="text-gray-600">Adjust your investment risk preference</p>
          </div>

          <div className="space-y-8">
            {/* Current Selection Display */}
            <div className="text-center">
              <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${selectedCategoryData.color} text-white rounded-xl font-semibold text-lg shadow-lg`}>
                {selectedCategory}
              </div>
            </div>

            {/* Slider */}
            <div className="px-4">
              <Slider
                value={[currentIndex]}
                onValueChange={handleSliderChange}
                max={RISK_CATEGORIES.length - 1}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Category Labels */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {RISK_CATEGORIES.map((category, index) => (
                <motion.button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    selectedCategory === category.value
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="font-medium text-gray-900 text-sm">
                    {category.label}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Risk Level Descriptions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-600 leading-relaxed">
                {selectedCategory === 'Conservative' && (
                  <p><strong>Conservative:</strong> Prioritizes capital preservation with lower volatility. Suitable for investors seeking steady, predictable returns with minimal risk.</p>
                )}
                {selectedCategory === 'Moderate' && (
                  <p><strong>Moderate:</strong> Balanced approach between growth and stability. Ideal for investors comfortable with some market fluctuations for moderate returns.</p>
                )}
                {selectedCategory === 'Growth' && (
                  <p><strong>Growth:</strong> Focuses on capital appreciation with higher potential returns. Suitable for investors willing to accept increased volatility.</p>
                )}
                {selectedCategory === 'Aggressive Growth' && (
                  <p><strong>Aggressive Growth:</strong> Maximum growth potential with highest risk tolerance. Best for investors comfortable with significant market volatility.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}