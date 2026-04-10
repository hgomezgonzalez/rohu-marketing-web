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
  /**
   * Optional public preview URL. Used when the app has a hosted preview that
   * can be opened without credentials (vs `demo` which exposes credentials).
   * If both are set, `demo` takes precedence in the hero section.
   */
  previewUrl?: string;
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
 * ROHU Connect — second live application in the catalog.
 *
 * Sold B2B white-label: ROHU Solutions licenses the marketplace platform to
 * municipalities, chambers of commerce, cooperatives and federations who want
 * to digitalize on-demand local services in their territory. ROHU does NOT
 * operate the marketplace directly — clients run their own.
 *
 * Source code: /home/hfgomezgo/personal/rohu-connect (pnpm + Turborepo).
 * Stack: Next.js 14 + NestJS + PostgreSQL+PostGIS + Prisma + Redis + Sentry.
 * Public preview: https://rohu-connect-web-staging-7e1e7f374cd0.herokuapp.com/
 */
const rohuConnect: Application = {
  id: 'rohu-connect',
  slug: 'rohu-connect',
  name: 'ROHU Connect',
  shortName: 'Connect',
  tagline: 'Tu marketplace de servicios, en producción en 90 días',
  description:
    'Plataforma white-label que ayuda a alcaldías, cámaras, cooperativas y federaciones a ofrecer un marketplace de servicios locales bajo su propia marca, con control total del territorio. Sin construir tecnología desde cero.',
  status: 'live',
  iconName: 'Handshake',
  accentColor: 'secondary',
  previewUrl: 'https://rohu-connect-web-staging-7e1e7f374cd0.herokuapp.com/',
  targetAudience: [
    'Alcaldías y gobiernos municipales',
    'Cámaras de comercio sectoriales',
    'Cooperativas de servicios',
    'Federaciones y gremios',
    'Conjuntos residenciales y clubes',
    'Operadores turísticos regionales',
  ],
  audienceClosingLine:
    'Si quieres digitalizar los servicios locales de tu territorio con proveedores cercanos verificados por ti, ROHU Connect es tu plataforma.',
  hero: {
    eyebrow: 'ROHU Connect · Plataforma marketplace',
    h1: 'Tu propio marketplace on-demand local, listo en semanas',
    subheadline:
      'La infraestructura tecnológica para conectar a vecinos con proveedores de servicios cercanos en tu territorio. Geolocalización, rankings, reseñas y pagos integrados.',
  },
  benefits: {
    eyebrow: 'Beneficios',
    sectionTitle: 'La infraestructura completa de un marketplace local',
    sectionSubtitle:
      'Todo lo que necesitas para operar un marketplace de servicios on-demand sin construir nada desde cero.',
    cards: [
      {
        id: 'time_to_market',
        title: 'Lanzas en semanas',
        description: 'Configuración por categorías y zonas en tiempo récord, no en años de desarrollo.',
        icon: 'Rocket',
      },
      {
        id: 'geo_matching',
        title: 'Búsqueda por cercanía',
        description: 'Match geoespacial con PostGIS por distancia, calificación y disponibilidad real.',
        icon: 'MapPin',
      },
      {
        id: 'verified_providers',
        title: 'Proveedores con perfil',
        description: 'Cada proveedor pasa por tu proceso de verificación antes de aparecer en la plataforma.',
        icon: 'BadgeCheck',
      },
      {
        id: 'ratings_reviews',
        title: 'Reseñas y calificaciones',
        description: 'Reputación visible para el cliente, retroalimentación para el proveedor.',
        icon: 'Star',
      },
      {
        id: 'commissions',
        title: 'Comisiones configurables',
        description: 'Define tu modelo de cobro y la plataforma calcula comisiones por transacción.',
        icon: 'Percent',
      },
      {
        id: 'notifications',
        title: 'Notificaciones multicanal',
        description: 'Email, SMS y push integrados desde el primer día con plantillas listas.',
        icon: 'Bell',
      },
      {
        id: 'compliance',
        title: 'Cumplimiento local',
        description: 'Trazabilidad, datos cifrados y alineación con la Ley 1581 de Habeas Data.',
        icon: 'ShieldCheck',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'Cómo trabajamos contigo',
    sectionTitle: 'De la idea al lanzamiento en cuatro pasos',
    sectionSubtitle:
      'Acompañamos a tu equipo desde el diagnóstico inicial hasta el primer mes en producción.',
    steps: [
      {
        number: 1,
        title: 'Diagnóstico del territorio',
        description:
          'Entendemos tu sector, las categorías de servicio prioritarias y el volumen esperado de usuarios.',
        hint: 'Sin compromiso, en una sola sesión de descubrimiento.',
      },
      {
        number: 2,
        title: 'Configuración a tu medida',
        description:
          'Configuramos categorías, zonas, comisiones y reglas de matching según tu modelo operativo.',
        hint: 'Tu equipo ve y aprueba cada decisión antes de pasar a producción.',
      },
      {
        number: 3,
        title: 'Capacitación de proveedores piloto',
        description:
          'Ayudamos a registrar y verificar el primer grupo de proveedores con sesiones grupales.',
        hint: 'Empezamos pequeño y crecemos cuando las primeras transacciones validen el modelo.',
      },
      {
        number: 4,
        title: 'Lanzamiento y acompañamiento',
        description:
          'Te acompañamos durante el lanzamiento y los primeros meses con soporte y mejoras continuas.',
        hint: 'Nunca quedas solo con la plataforma encendida.',
      },
    ],
  },
  modules: {
    eyebrow: 'Módulos',
    sectionTitle: 'Doce módulos que componen la plataforma',
    sectionSubtitle:
      'Construidos sobre Next.js, NestJS y PostgreSQL con PostGIS — listos para producción.',
    items: [
      { id: 'identity', label: 'Identidad y acceso', description: 'Registro, login y roles con cifrado de datos sensibles.', icon: 'KeyRound' },
      { id: 'geo_matching', label: 'Búsqueda por cercanía', description: 'Match geoespacial por distancia, rating y disponibilidad.', icon: 'MapPin' },
      { id: 'requests', label: 'Solicitudes', description: 'Flujo completo de pedidos: pendiente, asignado, completado.', icon: 'ClipboardList' },
      { id: 'profiles', label: 'Perfiles y verificación', description: 'Catálogo de proveedores con datos, fotos y validación.', icon: 'BadgeCheck' },
      { id: 'booking', label: 'Reservas y agenda', description: 'Reservas con anti-doble-booking automático en horario.', icon: 'CalendarClock' },
      { id: 'reviews', label: 'Calificaciones', description: 'Reseñas con promedio visible para clientes y proveedores.', icon: 'Star' },
      { id: 'commissions', label: 'Comisiones', description: 'Cálculo automático por transacción según tu modelo.', icon: 'Percent' },
      { id: 'notifications', label: 'Notificaciones', description: 'Email, SMS, push e in-app con cola de reintentos.', icon: 'Bell' },
      { id: 'admin', label: 'Panel administrativo', description: 'Gestión de proveedores, disputas y operación diaria.', icon: 'LayoutDashboard' },
      { id: 'audit', label: 'Trazabilidad', description: 'Registro auditable de cada acción importante en la plataforma.', icon: 'ScrollText' },
      { id: 'i18n', label: 'Multi-idioma', description: 'Interfaz preparada para varios idiomas con next-intl.', icon: 'Languages' },
      { id: 'realtime', label: 'Cola en tiempo real', description: 'Procesamiento asíncrono con Redis y BullMQ.', icon: 'Zap' },
    ],
  },
  pricing: {
    eyebrow: 'Planes y precios',
    sectionTitle: 'Elige el alcance que se ajusta a tu territorio',
    sectionSubtitle:
      'Tres tiers pensados para diferentes tamaños de operación. Todos incluyen acompañamiento de implementación.',
    tiers: [
      {
        id: 'municipio',
        name: 'Municipio',
        tagline: 'Para empezar en una ciudad',
        isPopular: false,
        targetAudience:
          'Ideal para municipios pequeños o cooperativas que quieren validar el modelo en una sola categoría.',
        features: [
          'Hasta 100 proveedores activos',
          '1 categoría de servicio',
          'Hasta 500 transacciones / mes',
          'Comisión fija por transacción',
          '1 zona geográfica',
          'Soporte por email',
          'Capacitación inicial guiada',
        ],
        highlightedFeatures: ['1 categoría', '100 proveedores', 'Soporte por email'],
        ctaLabel: 'Pedir propuesta',
        billingNote: 'Configuración inicial incluida · sin permanencia',
      },
      {
        id: 'metropolitana',
        name: 'Área metropolitana',
        tagline: 'Para territorios en expansión',
        isPopular: true,
        popularLabel: 'Más popular',
        targetAudience:
          'Para alcaldías de ciudades intermedias, cámaras de comercio y federaciones con varios sectores.',
        features: [
          'Hasta 1.000 proveedores activos',
          'Categorías ilimitadas',
          'Hasta 10.000 transacciones / mes',
          'Comisión configurable por categoría',
          'Hasta 3 zonas geográficas',
          'Soporte prioritario por chat',
          'Capacitación extendida y reportes',
        ],
        highlightedFeatures: ['Categorías ilimitadas', '1.000 proveedores', 'Comisión configurable'],
        ctaLabel: 'Pedir propuesta',
        billingNote: 'Implementación guiada de 4 a 8 semanas',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'A la medida de tu organización',
        isPopular: false,
        targetAudience:
          'Para grandes ciudades, redes nacionales y organizaciones que necesitan marca propia e integraciones.',
        features: [
          'Proveedores y transacciones ilimitados',
          'Marca propia (white-label) end-to-end',
          'API de lectura y escritura',
          'Zonas geográficas ilimitadas',
          'Integraciones a la medida',
          'Contacto dedicado y SLA reforzado',
          'Implementación personalizada',
        ],
        highlightedFeatures: ['White-label completo', 'API R+W', 'Contacto dedicado'],
        ctaLabel: 'Pedir propuesta',
        billingNote: 'Condiciones a la medida · alcance regional o nacional',
      },
    ],
  },
  socialProof: {
    eyebrow: 'Testimonios',
    sectionTitle: 'Lo que dicen las organizaciones que ya operan con ROHU Connect',
    disclaimer:
      'Los siguientes testimonios son ilustrativos y no corresponden a clientes reales identificados.',
    testimonials: [
      {
        id: 'ct1',
        quote:
          'Necesitábamos digitalizar los servicios del municipio y pensábamos construirlo desde cero. ROHU Connect nos ahorró meses de desarrollo.',
        name: 'Laura V.',
        role: 'Directora de innovación',
        business: 'Alcaldía municipal · Cundinamarca',
      },
      {
        id: 'ct2',
        quote:
          'La verificación de proveedores la manejamos nosotros directamente desde el panel. Eso nos da control y transparencia para nuestros agremiados.',
        name: 'Andrés B.',
        role: 'Gerente de proyectos',
        business: 'Cámara de comercio sectorial',
      },
      {
        id: 'ct3',
        quote:
          'El equipo de ROHU acompañó cada decisión, desde las categorías hasta el modelo de comisiones. Lanzamos con seguridad.',
        name: 'Marcela T.',
        role: 'Coordinadora operativa',
        business: 'Cooperativa de servicios · Antioquia',
      },
    ],
  },
  faqs: {
    eyebrow: 'Preguntas frecuentes',
    sectionTitle: '¿Listo para entender la plataforma a fondo?',
    sectionSubtitle:
      'Las respuestas que más nos piden las organizaciones interesadas en lanzar su marketplace.',
    items: [
      {
        id: 'vs_build',
        question: '¿Qué diferencia a ROHU Connect de construir nuestro propio marketplace?',
        answer:
          'Tiempo y costo. ROHU Connect ya tiene los componentes complejos resueltos: matching geoespacial, reservas anti-doble-booking, notificaciones y trazabilidad. Tu equipo se concentra en la operación local, no en construir software.',
      },
      {
        id: 'time',
        question: '¿Cuánto tarda la implementación?',
        answer:
          'Entre 4 y 8 semanas, según el tamaño del territorio, la cantidad de categorías y la complejidad de la verificación inicial de proveedores.',
      },
      {
        id: 'categories',
        question: '¿Qué categorías de servicio podemos ofrecer?',
        answer:
          'Las que decidas. La plataforma soporta cualquier servicio local que pueda reservarse: cerrajería, limpieza, manicura, mecánica, mantenimiento del hogar, salud preventiva, entre otros.',
      },
      {
        id: 'verification',
        question: '¿Cómo se verifican los proveedores?',
        answer:
          'Tu equipo define el proceso de verificación. La plataforma te entrega las herramientas (perfiles, documentos, estado de aprobación) y tu organización valida cada proveedor antes de activarlo.',
      },
      {
        id: 'payments',
        question: '¿Cómo se manejan los pagos y las comisiones?',
        answer:
          'En el MVP las comisiones se calculan automáticamente y se reportan. La integración con pasarelas de pago colombianas (Wompi, PayU) está en la hoja de ruta de la versión 1.',
      },
      {
        id: 'territory',
        question: '¿Tenemos control sobre el territorio y las zonas de cobertura?',
        answer:
          'Sí. Tú defines las zonas geográficas, los radios de cobertura por categoría y las reglas de asignación. Todo configurable desde el panel administrativo.',
      },
      {
        id: 'white_label',
        question: '¿Podemos usar nuestra propia marca?',
        answer:
          'Sí, en el plan Enterprise. La plataforma se entrega con tu marca, dominio y colores. Los planes Municipio y Área metropolitana mantienen co-branding con ROHU Connect.',
      },
      {
        id: 'disputes',
        question: '¿Qué pasa con las disputas entre cliente y proveedor?',
        answer:
          'Tu equipo administrativo gestiona las disputas desde el panel de la plataforma. ROHU Solutions provee la infraestructura tecnológica y las herramientas, pero la mediación es responsabilidad de quien opera el marketplace.',
      },
      {
        id: 'mobile',
        question: '¿Hay app móvil nativa?',
        answer:
          'Por ahora la plataforma es una PWA mobile-first instalable desde el navegador. Las apps nativas para iOS y Android están planeadas en la versión 1 del producto.',
      },
      {
        id: 'integrations',
        question: '¿Cómo se integra con nuestros sistemas actuales?',
        answer:
          'Los planes Área metropolitana y Enterprise incluyen acceso a la API. En Enterprise también ofrecemos integraciones a la medida según tus sistemas existentes.',
      },
    ],
  },
  ctaFinal: {
    eyebrow: 'Hablemos de tu marketplace',
    sectionTitle: '¿Listo para lanzar tu plataforma de servicios?',
    body:
      'Cuéntanos sobre tu organización, el territorio que quieres cubrir y las categorías de servicio que tienes en mente. Te respondemos con una propuesta a tu medida.',
  },
  metaTitle: 'ROHU Connect — Plataforma marketplace on-demand white-label',
  metaDescription:
    'Lanza tu propio marketplace on-demand local en semanas. Geolocalización, rankings, reseñas y pagos integrados. Para alcaldías, cámaras de comercio, cooperativas y federaciones.',
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

export const applications: Application[] = [rohuContable, rohuConnect, ...comingSoonApps];

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
