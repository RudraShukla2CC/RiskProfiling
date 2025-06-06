'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Search } from 'lucide-react';

interface CategoryItem {
  category: string;
  description: string;
}

interface StockSelectorProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onCategoryRemove: (category: string) => void;
  error?: string | null;
}

const CATEGORY_OPTIONS: CategoryItem[] = [
  { category: 'Large Cap', description: 'Large capitalization stocks - established companies with market cap over $10B' },
  { category: 'Mid Cap', description: 'Mid capitalization stocks - growing companies with market cap $2B-$10B' },
  { category: 'Small Cap', description: 'Small capitalization stocks - emerging companies with market cap under $2B' },
  { category: 'Broad U.S. Bond Market', description: 'Diversified bond exposure across U.S. government and corporate bonds' },
  { category: 'Gold', description: 'Precious metals exposure through gold investments' },
  { category: 'Silver', description: 'Precious metals exposure through silver investments' },
  { category: 'REIT ETF', description: 'Real Estate Investment Trusts for property market exposure' },
  { category: 'Multi-Strategy Alternatives', description: 'Alternative investments using multiple strategies' },
  { category: 'Alternative Strategies', description: 'Non-traditional investment approaches and strategies' },
  { category: 'Quantified Alternatives', description: 'Data-driven alternative investment strategies' },
  { category: 'Goldman Sachs Multi-Strategy', description: 'Goldman Sachs managed multi-strategy alternatives' },
  { category: 'Alpha Alternative Assets', description: 'Alpha-focused alternative asset investments' },
  { category: 'First Trust Alternative Opportunities', description: 'First Trust managed alternative opportunities' },
  { category: 'New Alternatives', description: 'Emerging alternative investment opportunities' },
  { category: 'Cryptocurrency', description: 'Digital currency and blockchain-based investments' },
];

export default function StockSelector({ 
  selectedCategories, 
  onCategoryToggle, 
  onCategoryRemove, 
  error 
}: StockSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredCategories = CATEGORY_OPTIONS.filter(item =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchFocus = () => setShowResults(true);
  const handleSearchBlur = () => setTimeout(() => setShowResults(false), 200);

  const handleCategorySelect = (category: string) => {
    onCategoryToggle(category);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="space-y-4 relative z-[9999]">
      <div className="relative overflow-visible">
        <input
          type="text"
          placeholder="Search by category name or description (e.g., Large Cap, Gold, Bonds)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900 placeholder-gray-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

        <AnimatePresence>
          {showResults && filteredCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto mt-1"
            >
              {filteredCategories.map((item, index) => (
                <motion.button
                  key={item.category}
                  type="button"
                  onClick={() => handleCategorySelect(item.category)}
                  className={`w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCategories.includes(item.category) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-sm mb-1">{item.category}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{item.description}</div>
                    </div>
                    {selectedCategories.includes(item.category) && (
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedCategories.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <label className="text-sm font-medium text-gray-700">
              Selected Categories ({selectedCategories.length}/10)
            </label>
          </div>
          <div className="space-y-2">
            {selectedCategories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-blue-900">{category}</span>
                  <div className="text-xs text-blue-700 mt-1">
                    {CATEGORY_OPTIONS.find(item => item.category === category)?.description}
                  </div>
                </div>
                <button
                  onClick={() => onCategoryRemove(category)}
                  className="ml-3 p-1 hover:bg-blue-200 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4 text-blue-700" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
        >
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  );
}