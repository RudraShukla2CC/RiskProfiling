'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  PieChart, 
  BarChart3, 
  LineChart,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GetStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const services = [
  {
    id: 1,
    title: 'Risk Profiling',
    description: 'Assess your risk tolerance and capacity to create personalized investment strategies',
    icon: Shield,
    available: true,
    route: '/RiskProfiling'
  },
  {
    id: 2,
    title: 'Portfolio Analysis',
    description: 'Advanced portfolio optimization and performance analytics',
    icon: PieChart,
    available: false,
    route: ''
  },
  {
    id: 3,
    title: 'Investment Recommendations',
    description: 'AI-powered investment suggestions based on your profile',
    icon: TrendingUp,
    available: false,
    route: ''
  },
  {
    id: 4,
    title: 'Market Insights',
    description: 'Real-time market analysis and trends',
    icon: BarChart3,
    available: false,
    route: ''
  },
  {
    id: 5,
    title: 'Goal Planning',
    description: 'Financial goal setting and tracking tools',
    icon: Target,
    available: false,
    route: ''
  },
  {
    id: 6,
    title: 'Performance Tracking',
    description: 'Monitor your investment performance over time',
    icon: LineChart,
    available: false,
    route: ''
  }
];

export default function GetStartedDialog({ open, onOpenChange }: GetStartedDialogProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Mounted flag to avoid hydration mismatch with animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.available && service.route) {  // safe check on route
      setSelectedService(service.id);
      setTimeout(() => {
        onOpenChange(false);
        router.push(service.route);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto relative">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Investment Journey
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select a service to get started with your personalized investment experience
          </DialogDescription>
        </DialogHeader>

        {/* Only render animations on client */}
        {mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <AnimatePresence>
              {services.map((service, index) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={service.available ? { scale: 1.02 } : {}}
                    whileTap={service.available ? { scale: 0.98 } : {}}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 h-full ${
                        service.available 
                          ? 'hover:shadow-lg border-blue-200 hover:border-blue-300' 
                          : 'opacity-60 cursor-not-allowed'
                      } ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleServiceClick(service)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${
                            service.available ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              service.available ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                          {service.available ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                          {service.description}
                        </CardDescription>

                        {service.available && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4"
                          >
                            <Button 
                              size="sm" 
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              Get Started
                            </Button>
                          </motion.div>
                        )}

                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-lg"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5, loop: Infinity }}
                              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                            />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          // Optionally a fallback on SSR during hydration
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className={`opacity-50 cursor-not-allowed p-4 border rounded`}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6 text-gray-400" />
                    <p className="font-semibold text-gray-500">{service.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}