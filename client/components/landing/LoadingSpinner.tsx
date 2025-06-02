'use client';

import { motion } from 'framer-motion';
import { Loader2, TrendingUp } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center max-w-md w-full border border-blue-100"
      >
        {/* Animated Icon */}
        <motion.div
          className="mb-8 relative"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Preparing Your Assessment
          </h2>
          
          <p className="text-gray-600">
            We're loading personalized questions to understand your risk profile...
          </p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div 
          className="flex justify-center space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { step: '1', text: 'Loading risk tolerance questions', completed: true },
            { step: '2', text: 'Loading risk capacity questions', completed: false },
            { step: '3', text: 'Preparing assessment interface', completed: false },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                item.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {item.completed ? '✓' : item.step}
              </div>
              <span className={item.completed ? 'text-green-600' : 'text-gray-600'}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}