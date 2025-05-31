'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/risk-assessment');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Risk Tolerance Assessment',
      description: 'Understand your emotional comfort level with market volatility and potential losses.'
    },
    {
      icon: TrendingUp,
      title: 'Risk Capacity Analysis',
      description: 'Evaluate your financial ability to withstand investment risks based on your situation.'
    },
    {
      icon: Target,
      title: 'Personalized Results',
      description: 'Get tailored investment recommendations based on your comprehensive risk profile.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Animated Background Elements - Enhanced Bubbles */}
      <div className="absolute inset-0">
        {/* Large bubbles */}
        <motion.div
          className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-25"
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full opacity-20"
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-25"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
        
        {/* Medium bubbles */}
        <motion.div
          className="absolute top-60 left-1/3 w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 12, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-60 right-1/3 w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-25"
          animate={{
            y: [0, 18, 0],
            x: [0, -8, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
        />
        
        {/* Small bubbles */}
        <motion.div
          className="absolute top-32 right-1/4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-30"
          animate={{
            y: [0, -12, 0],
            x: [0, 6, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-20"
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5
          }}
        />
        <motion.div
          className="absolute top-80 left-20 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-35"
          animate={{
            y: [0, -8, 0],
            x: [0, 4, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header 
          className="py-6 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h1 
              className="text-2xl font-bold text-gray-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Risk <span className="text-blue-600">Profiling</span>
            </motion.h1>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 pt-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div 
                className="space-y-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp} className="space-y-6">
                  <motion.h2 
                    className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                    variants={fadeInUp}
                  >
                    Discover Your
                    <motion.span 
                      className="block text-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text"
                      animate={{ 
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: 'linear' 
                      }}
                    >
                      Risk Profile
                    </motion.span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl text-gray-600 leading-relaxed max-w-lg"
                    variants={fadeInUp}
                  >
                    Make informed investment decisions with our comprehensive risk assessment tool. 
                    Understand both your risk tolerance and capacity for smarter financial planning.
                  </motion.p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Get Started
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Content - Features */}
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className="bg-blue-100 p-3 rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}