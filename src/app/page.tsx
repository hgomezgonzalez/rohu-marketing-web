import { Suspense } from 'react';
import { CompanyHeroSection } from '@/components/sections/CompanyHeroSection';
import { ApplicationsGridSection } from '@/components/sections/ApplicationsGridSection';
import { AboutCompanySection } from '@/components/sections/AboutCompanySection';
import { CompanyProcessSection } from '@/components/sections/CompanyProcessSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { CompanyViewTracker } from '@/components/CompanyViewTracker';
import { companyContent, FEATURE_FLAGS } from '@/lib/content';

export default function CompanyHomePage() {
  return (
    <>
      <CompanyViewTracker />
      <CompanyHeroSection />
      <ApplicationsGridSection />
      <AboutCompanySection />
      <CompanyProcessSection />
      <SocialProofSection
        eyebrow={companyContent.socialProof.eyebrow}
        title={companyContent.socialProof.section_title}
        disclaimer={companyContent.socialProof.disclaimer}
        testimonials={companyContent.socialProof.testimonials}
        pending={!FEATURE_FLAGS.TESTIMONIALS_PUBLISHED}
      />
      <FaqSection
        eyebrow={companyContent.faqs.eyebrow}
        title={companyContent.faqs.section_title}
        subtitle={companyContent.faqs.section_subtitle}
        items={companyContent.faqs.items}
      />
      <Suspense fallback={null}>
        <CtaSection
          eyebrow={companyContent.ctaFinal.eyebrow}
          title={companyContent.ctaFinal.section_title}
          body={companyContent.ctaFinal.body}
        />
      </Suspense>
    </>
  );
}
