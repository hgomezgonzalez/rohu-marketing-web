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
  /**
   * @deprecated Click handling is now done via QuickQuoteModal in
   * PricingSection. The button is no longer an `<a>` so this field is no
   * longer used by the UI. Kept optional for backwards compatibility with any
   * downstream consumer that might still read it.
   */
  ctaHref?: string;
  billingNote: string;
  // Reserved for future payment integration — DO NOT remove
  stripePriceId?: string;
  wompiPlanRef?: string;
  monthlyPriceCOP?: number;
}
