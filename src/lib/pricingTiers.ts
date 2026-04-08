/**
 * Pricing tiers shown in the landing.
 * v1 does NOT integrate a real payment provider; CTAs lead to the lead form
 * with the selected plan pre-tagged via URL hash. The `stripePriceId`,
 * `wompiPlanRef` and `monthlyPriceCOP` fields are reserved for the
 * future checkout integration (see payments-billing-engineer notes).
 */
export interface PricingTier {
  id: 'basic' | 'pro' | 'enterprise';
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

export const pricingSection = {
  eyebrow: 'Planes y precios',
  section_title: 'Elige el plan que se adapta a tu negocio',
  section_subtitle:
    'Todos los planes incluyen configuración inicial y capacitación. Precios según tamaño y necesidades de tu empresa.',
};

export const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Básico',
    tagline: 'Lo esencial para empezar',
    isPopular: false,
    targetAudience: 'Ideal para negocios unipersonales o con un solo punto de venta.',
    features: [
      'POS con QR',
      'Inventario y stock básico',
      'Reportes de ventas',
      '1 usuario · 1 sede',
      'Modo offline',
      'Soporte por email',
    ],
    highlightedFeatures: ['POS con QR', '1 usuario', 'Modo offline'],
    ctaLabel: 'Cotizar ahora',
    ctaHref: '#contact?plan=basic',
    billingNote: 'Configuración inicial incluida · sin permanencia',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'El balance perfecto para crecer',
    isPopular: true,
    popularLabel: 'Más popular',
    targetAudience:
      'Para negocios con equipo, varios módulos y necesidad de contabilidad formal.',
    features: [
      'Todo lo del plan Básico',
      'Contabilidad PUC/NIIF',
      'Estados financieros',
      'Compras y proveedores',
      'Cobro de cartera',
      'Hasta 5 usuarios · 3 sedes',
      'Soporte prioritario por chat',
    ],
    highlightedFeatures: ['Contabilidad PUC/NIIF', 'Hasta 5 usuarios', 'Soporte prioritario'],
    ctaLabel: 'Cotizar ahora',
    ctaHref: '#contact?plan=pro',
    billingNote: 'Configuración + capacitación guiada incluidas',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Escala sin límites',
    isPopular: false,
    targetAudience:
      'Para empresas con múltiples sedes, usuarios ilimitados o requerimientos especiales.',
    features: [
      'Todo lo del plan Pro',
      'Multi-empresa',
      'Usuarios ilimitados',
      'Sedes ilimitadas',
      'Implementación personalizada',
      'Capacitación extendida in-situ',
      'Contacto dedicado de soporte',
    ],
    highlightedFeatures: ['Multi-empresa', 'Usuarios ilimitados', 'Contacto dedicado'],
    ctaLabel: 'Cotizar ahora',
    ctaHref: '#contact?plan=enterprise',
    billingNote: 'Condiciones a la medida · implementación guiada',
  },
];
