import type { PricingTier } from '@/types/pricingTier';

/**
 * Single source of truth for every application published on the ROHU Solutions
 * marketing web. Adding a new application = add a new entry to the array.
 * The home grid, the dynamic product pages, the lead form selector and the
 * sitemap all read from this registry.
 */

export type ApplicationStatus = 'live' | 'coming_soon' | 'beta';

export interface ApplicationBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ApplicationModule {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface ApplicationFaq {
  id: string;
  question: string;
  answer: string;
}

export interface ApplicationTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  business: string;
}

export interface ApplicationStep {
  number: number;
  title: string;
  description: string;
  hint?: string;
}

export interface ApplicationDemo {
  url: string;
  user: string;
  password: string;
  notice: string;
}

export interface Application {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  status: ApplicationStatus;
  iconName: string;
  accentColor: 'primary' | 'secondary' | 'accent';
  targetAudience: string[];
  audienceClosingLine: string;
  demo?: ApplicationDemo;
  hero: {
    eyebrow: string;
    h1: string;
    subheadline: string;
  };
  benefits: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle?: string;
    cards: ApplicationBenefit[];
  };
  howItWorks: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle?: string;
    steps: ApplicationStep[];
  };
  modules: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle?: string;
    items: ApplicationModule[];
  };
  pricing: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle?: string;
    tiers: PricingTier[];
  };
  socialProof: {
    eyebrow: string;
    sectionTitle: string;
    disclaimer: string;
    testimonials: ApplicationTestimonial[];
  };
  faqs: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle?: string;
    items: ApplicationFaq[];
  };
  ctaFinal: {
    eyebrow: string;
    sectionTitle: string;
    body: string;
  };
  metaTitle: string;
  metaDescription: string;
}

/**
 * ROHU Contable — first live application of the catalog.
 */
const rohuContable: Application = {
  id: 'rohu-contable',
  slug: 'rohu-contable',
  name: 'ROHU Contable',
  shortName: 'Contable',
  tagline: 'POS, inventario y contabilidad PUC/NIIF en un solo lugar',
  description:
    'Software contable pensado para comercios colombianos que quieren orden, claridad y menos papeleo. Funciona online y offline.',
  status: 'live',
  iconName: 'Calculator',
  accentColor: 'primary',
  targetAudience: [
    'Ferreterías',
    'Tiendas de barrio',
    'Papelerías',
    'Tiendas de ropa',
    'Minimercados',
    'Distribuidoras y negocios similares',
  ],
  audienceClosingLine:
    'Si vendes productos y quieres llevar la contabilidad en orden, ROHU Contable es para ti.',
  demo: {
    url: 'https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/',
    user: 'demo@rohu-contable.com',
    password: 'demo1234',
    notice:
      'Acceso público de uso demostrativo: los datos son ficticios. No ingreses información real.',
  },
  hero: {
    eyebrow: 'ROHU Contable · SaaS colombiano',
    h1: 'Controla tu negocio y tu contabilidad desde un solo lugar',
    subheadline:
      'Software diseñado para comercios colombianos que quieren orden, claridad y menos papeleo. Funciona online y offline.',
  },
  benefits: {
    eyebrow: 'Beneficios',
    sectionTitle: 'Todo lo que tu negocio necesita en un solo sistema',
    sectionSubtitle:
      'Desde el mostrador hasta los estados financieros, cubrimos la operación completa de tu comercio.',
    cards: [
      {
        id: 'pos',
        title: 'POS rápido con QR',
        description: 'Registra ventas en segundos con código QR, sin filas ni errores.',
        icon: 'ScanLine',
      },
      {
        id: 'inventory',
        title: 'Inventario y stock',
        description: 'Conoce en tiempo real cuánto tienes, qué se mueve y qué reponer.',
        icon: 'PackageSearch',
      },
      {
        id: 'purchases',
        title: 'Compras y proveedores',
        description: 'Gestiona órdenes de compra y cuentas por pagar desde un solo módulo.',
        icon: 'Truck',
      },
      {
        id: 'accounting',
        title: 'Contabilidad PUC/NIIF',
        description: 'Registros contables alineados al Plan Único de Cuentas y estándares NIIF.',
        icon: 'BookOpenCheck',
      },
      {
        id: 'financial_statements',
        title: 'Estados financieros',
        description: 'Balance general, estado de resultados y flujo de caja generados desde tus transacciones.',
        icon: 'FileBarChart2',
      },
      {
        id: 'reports',
        title: 'Reportes y alertas',
        description: 'Tablero visual con indicadores clave y alertas para decisiones a tiempo.',
        icon: 'LineChart',
      },
      {
        id: 'offline',
        title: 'Online y offline',
        description: 'Sigue vendiendo sin internet; los datos se sincronizan cuando vuelve la conexión.',
        icon: 'Wifi',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'Cómo funciona',
    sectionTitle: 'Empieza en cuatro pasos',
    sectionSubtitle: 'Un proceso acompañado de principio a fin. Sin sorpresas.',
    steps: [
      {
        number: 1,
        title: 'Prueba la demo',
        description:
          'Explora el sistema con datos ficticios y confirma que se ajusta a tu negocio.',
        hint: 'No necesitas instalar nada ni dar tarjeta de crédito.',
      },
      {
        number: 2,
        title: 'Configuramos tu empresa',
        description:
          'Adaptamos el sistema a tu catálogo, proveedores y estructura contable.',
        hint: 'Si ya tienes un Excel con tu inventario, lo importamos juntos.',
      },
      {
        number: 3,
        title: 'Capacitación rápida',
        description:
          'Te enseñamos a usar cada módulo; sin tecnicismos, sin curvas largas.',
        hint: 'Grabamos la sesión para que la repasen cuando quieran.',
      },
      {
        number: 4,
        title: 'Soporte y actualizaciones',
        description:
          'Acompañamiento continuo y mejoras periódicas incluidas en tu plan.',
        hint: 'Cada mejora llega sola, sin que tengas que hacer nada.',
      },
    ],
  },
  modules: {
    eyebrow: 'Módulos',
    sectionTitle: 'Módulos que trabajan juntos',
    sectionSubtitle:
      'Una sola plataforma para operar, controlar y decidir — sin saltar entre herramientas.',
    items: [
      { id: 'dashboard', label: 'Tablero', description: 'Vista general de ventas, caja y alertas del día.', icon: 'LayoutDashboard' },
      { id: 'pos', label: 'Punto de venta', description: 'Vende rápido con QR, efectivo o transferencia.', icon: 'ShoppingCart' },
      { id: 'inventory', label: 'Inventario', description: 'Control de entradas, salidas y stock mínimo.', icon: 'Boxes' },
      { id: 'purchases', label: 'Compras', description: 'Crea y sigue órdenes de compra a tus proveedores.', icon: 'ClipboardList' },
      { id: 'suppliers', label: 'Proveedores', description: 'Historial, saldos y condiciones por proveedor.', icon: 'Handshake' },
      { id: 'customers', label: 'Clientes', description: 'Base de datos de clientes con historial de compras.', icon: 'Users' },
      { id: 'collections', label: 'Cobro de cartera', description: 'Gestiona cuentas por cobrar y pagos pendientes.', icon: 'Wallet' },
      { id: 'reports', label: 'Reportes', description: 'Exporta ventas, compras y movimientos cuando los necesites.', icon: 'FileText' },
      { id: 'analytics', label: 'Análisis', description: 'Gráficas de tendencias para entender tu negocio.', icon: 'TrendingUp' },
      { id: 'financial', label: 'Estados financieros', description: 'Balance y estado de resultados listos para revisar con tu contador.', icon: 'FileBarChart2' },
      { id: 'dian_support', label: 'Soporte DIAN', description: 'Información de referencia sobre obligaciones tributarias frecuentes.', icon: 'ShieldCheck' },
      { id: 'accounting', label: 'Contabilidad', description: 'Partidas dobles, cuentas PUC y reportes bajo NIIF.', icon: 'Calculator' },
      { id: 'cash_bank', label: 'Caja y bancos', description: 'Concilia movimientos de caja y cuentas bancarias fácilmente.', icon: 'Banknote' },
    ],
  },
  pricing: {
    eyebrow: 'Planes y precios',
    sectionTitle: 'Elige el plan que se adapta a tu negocio',
    sectionSubtitle:
      'Todos los planes incluyen configuración inicial y capacitación. Precios según tamaño y necesidades de tu empresa.',
    tiers: [
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
        ctaLabel: 'Pedir propuesta',
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
        ctaLabel: 'Pedir propuesta',
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
        ctaLabel: 'Pedir propuesta',
        billingNote: 'Condiciones a la medida · implementación guiada',
      },
    ],
  },
  socialProof: {
    eyebrow: 'Testimonios',
    sectionTitle: 'Lo que dicen negocios como el tuyo',
    disclaimer:
      'Los siguientes testimonios son ilustrativos y no corresponden a clientes reales identificados.',
    testimonials: [
      {
        id: 't1',
        quote:
          'Desde que usamos ROHU, el cierre de caja es mucho más rápido y ya no perdemos ventas por no tener señal.',
        name: 'Carlos M.',
        role: 'Propietario',
        business: 'Ferretería El Tornillo · Bogotá',
      },
      {
        id: 't2',
        quote:
          'Mi contador agradece que los estados financieros ya salen del sistema, sin armar todo en Excel.',
        name: 'Adriana P.',
        role: 'Administradora',
        business: 'Papelería La Estrella · Medellín',
      },
      {
        id: 't3',
        quote:
          'El módulo de inventario nos ayudó a detectar productos que se perdían. Ahora tenemos más control.',
        name: 'Jesús R.',
        role: 'Dueño',
        business: 'Minimercado El Vecino · Cali',
      },
    ],
  },
  faqs: {
    eyebrow: 'Preguntas frecuentes',
    sectionTitle: '¿Tienes dudas? Aquí te las resolvemos',
    sectionSubtitle:
      'Respuestas honestas a las preguntas que más recibimos antes de empezar con ROHU Contable.',
    items: [
      {
        id: 'offline',
        question: '¿Funciona sin internet?',
        answer:
          'Sí. ROHU Contable tiene modo offline: puedes registrar ventas e inventario sin conexión. Los datos se sincronizan automáticamente cuando vuelve el internet.',
      },
      {
        id: 'dian',
        question: '¿El sistema presenta mis declaraciones ante la DIAN?',
        answer:
          'No. ROHU incluye un módulo de soporte DIAN con información de referencia, pero no presenta declaraciones ni reemplaza a tu contador. La responsabilidad del cumplimiento corresponde al contribuyente y su asesor contable.',
      },
      {
        id: 'implementation',
        question: '¿Cómo es el proceso de implementación?',
        answer:
          'Nuestro equipo configura el sistema según tu empresa: catálogo, proveedores, cuentas contables y usuarios. El proceso toma entre 3 y 10 días hábiles según la complejidad del negocio.',
      },
      {
        id: 'support',
        question: '¿Qué tipo de soporte ofrecen?',
        answer:
          'Soporte por chat y correo en todos los planes. Pro tiene atención prioritaria y Enterprise un contacto dedicado. Horario: L-V 8:00-18:00, S 9:00-13:00 (Colombia).',
      },
      {
        id: 'data_security',
        question: '¿Mis datos están seguros?',
        answer:
          'La información se almacena en servidores con respaldo periódico. Tratamos los datos personales conforme a la Ley 1581 de 2012 (Habeas Data). Puedes consultar nuestra Política de Privacidad para más detalle.',
      },
      {
        id: 'data_ownership',
        question: '¿Quién es dueño de mis datos y qué pasa si cancelo?',
        answer:
          'Tus datos son tuyos. Si cancelas, te entregamos un export completo de toda tu información en formato estándar. No retenemos ni vendemos tus datos a terceros.',
      },
      {
        id: 'multi_company',
        question: '¿Puedo gestionar varias empresas o sedes?',
        answer:
          'Sí, la funcionalidad multi-empresa y multi-sede está disponible en el plan Enterprise.',
      },
      {
        id: 'simultaneous_users',
        question: '¿Cuántos usuarios pueden trabajar al mismo tiempo?',
        answer:
          'El plan Básico incluye 1 usuario, Pro hasta 5 y Enterprise usuarios ilimitados. Todos los usuarios activos acceden en tiempo real.',
      },
      {
        id: 'training',
        question: '¿Incluye capacitación?',
        answer:
          'Sí. Todos los planes incluyen capacitación inicial grabada. El plan Enterprise ofrece capacitación extendida adaptada al equipo del cliente.',
      },
      {
        id: 'migration',
        question: '¿Puedo migrar mis datos desde Excel u otro sistema?',
        answer:
          'En la mayoría de los casos sí. Revisamos el formato de tus datos y apoyamos el proceso de migración. Los tiempos dependen del volumen y calidad de la información.',
      },
    ],
  },
  ctaFinal: {
    eyebrow: 'Solicita una implementación',
    sectionTitle: '¿Listo para poner orden en tu negocio?',
    body: 'Cuéntanos sobre tu empresa y te mostramos cómo ROHU Contable se adapta a lo que necesitas. Sin compromisos, sin tecnicismos.',
  },
  metaTitle: 'ROHU Contable — Software contable para comercios colombianos',
  metaDescription:
    'POS, inventario, contabilidad PUC/NIIF y reportes en un solo sistema. Diseñado para ferreterías, tiendas y comercios en Colombia. Funciona online y offline.',
};

/**
 * Placeholder apps (coming_soon) — these are visible in the home grid so the
 * visitor sees the catalog vision, but their pages are not generated until
 * status is flipped to 'live' and the content is filled in.
 */
const comingSoonApps: Application[] = [
  {
    id: 'rohu-restaurantes',
    slug: 'rohu-restaurantes',
    name: 'ROHU Restaurantes',
    shortName: 'Restaurantes',
    tagline: 'Gestión integral para restaurantes y cafés',
    description: 'Comandas, inventario de insumos, recetas, mesas y caja en un solo sistema.',
    status: 'coming_soon',
    iconName: 'UtensilsCrossed',
    accentColor: 'secondary',
    targetAudience: ['Restaurantes', 'Cafés', 'Heladerías', 'Pizzerías'],
    audienceClosingLine: '',
    hero: { eyebrow: '', h1: '', subheadline: '' },
    benefits: { eyebrow: '', sectionTitle: '', cards: [] },
    howItWorks: { eyebrow: '', sectionTitle: '', steps: [] },
    modules: { eyebrow: '', sectionTitle: '', items: [] },
    pricing: { eyebrow: '', sectionTitle: '', tiers: [] },
    socialProof: { eyebrow: '', sectionTitle: '', disclaimer: '', testimonials: [] },
    faqs: { eyebrow: '', sectionTitle: '', items: [] },
    ctaFinal: { eyebrow: '', sectionTitle: '', body: '' },
    metaTitle: 'ROHU Restaurantes — Próximamente',
    metaDescription: 'Gestión integral para restaurantes y cafés colombianos. Próximamente.',
  },
  {
    id: 'rohu-inmobiliario',
    slug: 'rohu-inmobiliario',
    name: 'ROHU Inmobiliario',
    shortName: 'Inmobiliario',
    tagline: 'CRM + cartera + contratos para inmobiliarias',
    description: 'Propiedades, clientes, arriendos y ventas con integración contable.',
    status: 'coming_soon',
    iconName: 'Building2',
    accentColor: 'accent',
    targetAudience: ['Inmobiliarias', 'Administradores de propiedad', 'Constructoras'],
    audienceClosingLine: '',
    hero: { eyebrow: '', h1: '', subheadline: '' },
    benefits: { eyebrow: '', sectionTitle: '', cards: [] },
    howItWorks: { eyebrow: '', sectionTitle: '', steps: [] },
    modules: { eyebrow: '', sectionTitle: '', items: [] },
    pricing: { eyebrow: '', sectionTitle: '', tiers: [] },
    socialProof: { eyebrow: '', sectionTitle: '', disclaimer: '', testimonials: [] },
    faqs: { eyebrow: '', sectionTitle: '', items: [] },
    ctaFinal: { eyebrow: '', sectionTitle: '', body: '' },
    metaTitle: 'ROHU Inmobiliario — Próximamente',
    metaDescription: 'CRM e integración contable para inmobiliarias colombianas. Próximamente.',
  },
  {
    id: 'rohu-salud',
    slug: 'rohu-salud',
    name: 'ROHU Salud',
    shortName: 'Salud',
    tagline: 'Agenda, historia clínica y facturación para consultorios',
    description: 'Gestión de pacientes, citas, facturación electrónica e inventario clínico.',
    status: 'coming_soon',
    iconName: 'HeartPulse',
    accentColor: 'secondary',
    targetAudience: ['Consultorios médicos', 'Odontología', 'Fisioterapia', 'Psicología'],
    audienceClosingLine: '',
    hero: { eyebrow: '', h1: '', subheadline: '' },
    benefits: { eyebrow: '', sectionTitle: '', cards: [] },
    howItWorks: { eyebrow: '', sectionTitle: '', steps: [] },
    modules: { eyebrow: '', sectionTitle: '', items: [] },
    pricing: { eyebrow: '', sectionTitle: '', tiers: [] },
    socialProof: { eyebrow: '', sectionTitle: '', disclaimer: '', testimonials: [] },
    faqs: { eyebrow: '', sectionTitle: '', items: [] },
    ctaFinal: { eyebrow: '', sectionTitle: '', body: '' },
    metaTitle: 'ROHU Salud — Próximamente',
    metaDescription: 'Agenda y facturación para consultorios y centros de salud. Próximamente.',
  },
  {
    id: 'rohu-educacion',
    slug: 'rohu-educacion',
    name: 'ROHU Educación',
    shortName: 'Educación',
    tagline: 'Administración académica y cartera para instituciones',
    description: 'Matrículas, pensiones, cartera, notas y comunicación con padres.',
    status: 'coming_soon',
    iconName: 'GraduationCap',
    accentColor: 'accent',
    targetAudience: ['Colegios', 'Institutos', 'Academias', 'Centros de formación'],
    audienceClosingLine: '',
    hero: { eyebrow: '', h1: '', subheadline: '' },
    benefits: { eyebrow: '', sectionTitle: '', cards: [] },
    howItWorks: { eyebrow: '', sectionTitle: '', steps: [] },
    modules: { eyebrow: '', sectionTitle: '', items: [] },
    pricing: { eyebrow: '', sectionTitle: '', tiers: [] },
    socialProof: { eyebrow: '', sectionTitle: '', disclaimer: '', testimonials: [] },
    faqs: { eyebrow: '', sectionTitle: '', items: [] },
    ctaFinal: { eyebrow: '', sectionTitle: '', body: '' },
    metaTitle: 'ROHU Educación — Próximamente',
    metaDescription: 'Administración académica y cartera para instituciones educativas. Próximamente.',
  },
];

export const applications: Application[] = [rohuContable, ...comingSoonApps];

export function getApplicationBySlug(slug: string): Application | undefined {
  return applications.find((a) => a.slug === slug);
}

export function getLiveApplications(): Application[] {
  return applications.filter((a) => a.status === 'live');
}

export function getLiveApplicationSlugs(): string[] {
  return getLiveApplications().map((a) => a.slug);
}

/**
 * Builds the options for the "Aplicación de interés" select in the lead form.
 * Includes all live apps plus a "general advisory" fallback so visitors who
 * don't know which app they want can still convert.
 */
export function buildApplicationOptions(): Array<{ value: string; label: string }> {
  return [
    ...getLiveApplications().map((a) => ({ value: a.slug, label: a.name })),
    ...applications
      .filter((a) => a.status === 'coming_soon')
      .map((a) => ({ value: a.slug, label: `${a.name} (Próximamente)` })),
    { value: 'general', label: 'Asesoría general (no estoy seguro aún)' },
  ];
}

export const GENERAL_ADVISORY_OPTION = 'general';
