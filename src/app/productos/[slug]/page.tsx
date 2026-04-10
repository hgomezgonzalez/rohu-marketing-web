import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ApplicationHeroSection } from '@/components/sections/ApplicationHeroSection';
import {
  InPageNavigation,
  DEFAULT_APP_NAV_ITEMS,
} from '@/components/sections/InPageNavigation';
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
import { siteConfig, FEATURE_FLAGS } from '@/lib/content';

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

  // Section nodes — built once and reordered per-app below.
  // The funnel-designer agent flagged that B2B complex products (ROHU Connect)
  // need a different reading order than B2B-SMB products (ROHU Contable):
  // visitors must understand the model BEFORE the benefits make sense.
  const sectionAudienceTitle =
    app.id === 'rohu-connect'
      ? 'Diseñado para entidades como la tuya'
      : 'Diseñado para comercios como el tuyo';

  const Benefits = (
    <BenefitsSection
      key="benefits"
      eyebrow={app.benefits.eyebrow}
      title={app.benefits.sectionTitle}
      subtitle={app.benefits.sectionSubtitle}
      cards={app.benefits.cards}
    />
  );
  const Audience = (
    <AudienceSection
      key="audience"
      eyebrow="Para quién es"
      title={sectionAudienceTitle}
      chips={app.targetAudience}
      closingLine={app.audienceClosingLine}
    />
  );
  const HowItWorks = (
    <HowItWorksSection
      key="how"
      eyebrow={app.howItWorks.eyebrow}
      title={app.howItWorks.sectionTitle}
      subtitle={app.howItWorks.sectionSubtitle}
      steps={app.howItWorks.steps}
    />
  );
  const Modules = (
    <ModulesGridSection
      key="modules"
      eyebrow={app.modules.eyebrow}
      title={app.modules.sectionTitle}
      subtitle={app.modules.sectionSubtitle}
      items={app.modules.items}
    />
  );
  const Pricing = (
    <PricingSection
      key="pricing"
      eyebrow={app.pricing.eyebrow}
      title={app.pricing.sectionTitle}
      subtitle={app.pricing.sectionSubtitle}
      tiers={app.pricing.tiers}
      applicationId={app.id}
    />
  );
  const SocialProof = (
    <SocialProofSection
      key="testimonials"
      eyebrow={app.socialProof.eyebrow}
      title={app.socialProof.sectionTitle}
      disclaimer={app.socialProof.disclaimer}
      testimonials={app.socialProof.testimonials}
      pending={!FEATURE_FLAGS.TESTIMONIALS_PUBLISHED}
    />
  );
  const Faq = (
    <FaqSection
      key="faqs"
      eyebrow={app.faqs.eyebrow}
      title={app.faqs.sectionTitle}
      subtitle={app.faqs.sectionSubtitle}
      items={app.faqs.items}
    />
  );

  // ROHU Connect (B2B complex) order: HowItWorks → Audience → Benefits → ...
  // ROHU Contable (B2B SMB) keeps: Benefits → Audience → HowItWorks → ...
  const orderedSections =
    app.id === 'rohu-connect'
      ? [HowItWorks, Audience, Benefits, Modules, Pricing, SocialProof, Faq]
      : [Benefits, Audience, HowItWorks, Modules, Pricing, SocialProof, Faq];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <ApplicationViewTracker applicationId={app.id} />
      <ApplicationHeroSection app={app} />
      <InPageNavigation items={DEFAULT_APP_NAV_ITEMS} applicationId={app.id} />
      {orderedSections}
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
