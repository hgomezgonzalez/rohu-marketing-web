/**
 * Shared PricingTier interface used by any application in the registry.
 * Keep the optional `stripePriceId`, `wompiPlanRef`, `monthlyPriceCOP` fields
 * reserved for the future payment integration.
 */
export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  isPopular: boolean;
  popularLabel?: string;
  targetAudience: string;
  features: string[];
  highlightedFeatures: string[];
  ctaLabel: string;
  ctaHref: string;
  billingNote: string;
  // Reserved for future payment integration — DO NOT remove
  stripePriceId?: string;
  wompiPlanRef?: string;
  monthlyPriceCOP?: number;
}
