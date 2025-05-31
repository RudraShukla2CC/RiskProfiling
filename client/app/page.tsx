'use client';

import { useState } from 'react';
import Hero from '@/components/landing/Hero';
import GetStartedDialog from '@/components/landing/GetStartedDialog';

export default function HomePage() {
  const [showGetStarted, setShowGetStarted] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero onGetStarted={() => setShowGetStarted(true)} />
      
      <GetStartedDialog 
        open={showGetStarted} 
        onOpenChange={setShowGetStarted} 
      />
    </main>
  );
}