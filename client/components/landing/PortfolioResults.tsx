'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PortfolioResultsProps {
  portfolio: {
    name: string;
    riskBucket: string | number;
    expectedReturn: number;
    expectedRisk: number;
    allocations: { ticker: string; percentage: number }[];
  };
  onRestart: () => void;
}

const COLORS = ['#4f46e5', '#16a34a', '#f59e0b', '#dc2626', '#2563eb', '#db2777', '#d97706', '#059669'];

export default function PortfolioResults({ portfolio, onRestart }: PortfolioResultsProps) {
  const handleDownloadPDF = () => {
    const report = `
Portfolio Analysis Report
Generated: ${new Date().toLocaleDateString()}

Portfolio Name: ${portfolio.name}
Risk Bucket: ${portfolio.riskBucket}
Expected Return: ${(portfolio.expectedReturn * 100).toFixed(2)}%
Expected Risk: ${(portfolio.expectedRisk * 100).toFixed(2)}%

Allocations:
${portfolio.allocations.map(a => `- ${a.ticker}: ${(a.percentage * 100).toFixed(2)}%`).join('\n')}

Disclaimer: This analysis is for informational purposes only.
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto overflow-hidden"
    >
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Portfolio Construction</h3>
              <p className="text-sm text-gray-500">Your optimized investment portfolio</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Portfolio Stats */}
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="text-sm text-blue-600 font-medium mb-1">Portfolio Name</div>
                  <div className="text-lg font-bold text-blue-900">{portfolio.name}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="text-sm text-purple-600 font-medium mb-1">Risk Bucket</div>
                  <div className="text-lg font-bold text-purple-900">{portfolio.riskBucket}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="text-sm text-green-600 font-medium mb-1">Expected Return (Per Annum)</div>
                  <div className="text-lg font-bold text-green-900">
                    {(portfolio.expectedReturn * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="text-sm text-orange-600 font-medium mb-1">Expected Risk (Per Annum)</div>
                  <div className="text-lg font-bold text-orange-900">
                    {(portfolio.expectedRisk * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Allocation List */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Asset Allocation</h4>
                <div className="space-y-2">
                  {portfolio.allocations.map(({ ticker, percentage }, index) => (
                    <div key={ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{ticker}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {(percentage * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Visualization</h4>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={portfolio.allocations}
                      dataKey="percentage"
                      nameKey="ticker"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={40}
                      paddingAngle={2}
                      label={({ ticker, percent }) => `${ticker}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolio.allocations.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Allocation']}
                      labelFormatter={(label: string) => `${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="px-6 py-3 font-medium border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={onRestart}
              className="px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Take Assessment Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}