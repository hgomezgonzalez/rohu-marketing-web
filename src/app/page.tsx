import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ModulesGridSection } from '@/components/sections/ModulesGridSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { LandingViewTracker } from '@/components/LandingViewTracker';

export default function LandingPage() {
  return (
    <>
      <LandingViewTracker />
      <HeroSection />
      <BenefitsSection />
      <AudienceSection />
      <HowItWorksSection />
      <ModulesGridSection />
      <PricingSection />
      <SocialProofSection />
      <FaqSection />
      <Suspense fallback={null}>
        <CtaSection />
      </Suspense>
    </>
  );
}
