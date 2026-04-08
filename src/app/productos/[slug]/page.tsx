import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ApplicationHeroSection } from '@/components/sections/ApplicationHeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ModulesGridSection } from '@/components/sections/ModulesGridSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ApplicationViewTracker } from '@/components/ApplicationViewTracker';
import {
  applications,
  getApplicationBySlug,
  getLiveApplicationSlugs,
} from '@/lib/applications';
import { siteConfig } from '@/lib/content';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return getLiveApplicationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const app = getApplicationBySlug(params.slug);
  if (!app || app.status !== 'live') {
    return { title: 'Aplicación no encontrada' };
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const canonical = `${baseUrl}/productos/${app.slug}`;
  return {
    title: app.name,
    description: app.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: app.metaTitle,
      description: app.metaDescription,
      url: canonical,
      type: 'website',
      locale: 'es_CO',
    },
    twitter: {
      card: 'summary_large_image',
      title: app.metaTitle,
      description: app.metaDescription,
    },
  };
}

export default function ApplicationPage({ params }: Params) {
  const app = getApplicationBySlug(params.slug);
  if (!app || app.status !== 'live') {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Windows, Android',
    description: app.metaDescription,
    url: `${baseUrl}/productos/${app.slug}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'COP',
      lowPrice: '0',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <ApplicationViewTracker applicationId={app.id} />
      <ApplicationHeroSection app={app} />
      <BenefitsSection
        eyebrow={app.benefits.eyebrow}
        title={app.benefits.sectionTitle}
        subtitle={app.benefits.sectionSubtitle}
        cards={app.benefits.cards}
      />
      <AudienceSection
        eyebrow="Para quién es"
        title="Diseñado para comercios como el tuyo"
        chips={app.targetAudience}
        closingLine={app.audienceClosingLine}
      />
      <HowItWorksSection
        eyebrow={app.howItWorks.eyebrow}
        title={app.howItWorks.sectionTitle}
        subtitle={app.howItWorks.sectionSubtitle}
        steps={app.howItWorks.steps}
      />
      <ModulesGridSection
        eyebrow={app.modules.eyebrow}
        title={app.modules.sectionTitle}
        subtitle={app.modules.sectionSubtitle}
        items={app.modules.items}
      />
      <PricingSection
        eyebrow={app.pricing.eyebrow}
        title={app.pricing.sectionTitle}
        subtitle={app.pricing.sectionSubtitle}
        tiers={app.pricing.tiers}
        applicationId={app.id}
      />
      <SocialProofSection
        eyebrow={app.socialProof.eyebrow}
        title={app.socialProof.sectionTitle}
        disclaimer={app.socialProof.disclaimer}
        testimonials={app.socialProof.testimonials}
      />
      <FaqSection
        eyebrow={app.faqs.eyebrow}
        title={app.faqs.sectionTitle}
        subtitle={app.faqs.sectionSubtitle}
        items={app.faqs.items}
      />
      <Suspense fallback={null}>
        <CtaSection
          eyebrow={app.ctaFinal.eyebrow}
          title={app.ctaFinal.sectionTitle}
          body={app.ctaFinal.body}
          preselectedApp={app.slug}
        />
      </Suspense>
    </>
  );
}

// Ensure static generation
export const dynamicParams = false;
// Reference to avoid unused import warning when applications list changes
void applications;
