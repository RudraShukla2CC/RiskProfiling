'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Target, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-20 text-blue-400/30"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <TrendingUp size={40} />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-32 text-purple-400/30"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <Shield size={35} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-32 text-green-400/30"
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
      >
        <Target size={30} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Investment Advisory
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your{' '}
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Smart
            </motion.span>
            <br />
            Investment{' '}
            <motion.span
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['100%', '0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              Companion
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Experience the future of wealth management with our AI-driven robo advisor. 
          Get personalized investment strategies, risk assessment, and portfolio optimization 
          tailored to your financial goals.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Get Started Free
            </motion.span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { icon: TrendingUp, title: 'Smart Analytics', desc: 'AI-powered market insights' },
            { icon: Shield, title: 'Risk Management', desc: 'Personalized risk profiling' },
            { icon: Target, title: 'Goal Tracking', desc: 'Achieve financial objectives' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}