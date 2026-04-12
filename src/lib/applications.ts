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
    url: 'https://rohu-accountant-42a1913f511f.herokuapp.com/',
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
 * Consumer-facing service marketplace operated directly by ROHU Solutions.
 * Two roles:
 *   - Customer: finds and books nearby service providers.
 *   - Provider: creates a profile, manages their schedule, receives bookings.
 *
 * Revenue model:
 *   - Providers pay a monthly subscription to be listed.
 *   - Customers pay a small commission per completed service.
 *
 * Source code: /home/hfgomezgo/personal/rohu-connect (pnpm + Turborepo).
 * Stack: Next.js 14 + NestJS + PostgreSQL+PostGIS + Prisma + Redis + Sentry.
 * Production: https://rohu-connect-web-8cd298835155.herokuapp.com
 */
const rohuConnect: Application = {
  id: 'rohu-connect',
  slug: 'rohu-connect',
  name: 'ROHU Connect',
  shortName: 'Connect',
  tagline: 'Encuentra servicios cerca de ti y reserva al instante',
  description:
    'Marketplace de servicios locales donde los consumidores encuentran proveedores cercanos verificados y los reservan en segundos. Prestadores gestionan su agenda, reciben clientes y construyen su reputación — todo desde una sola app.',
  status: 'live',
  iconName: 'Handshake',
  accentColor: 'secondary',
  previewUrl: 'https://rohu-connect-web-8cd298835155.herokuapp.com/',
  targetAudience: [
    'Personas que buscan servicios confiables cerca (limpieza, plomería, belleza, mascotas, tutorías y más)',
    'Profesionales independientes que quieren más clientes sin pagar publicidad',
    'Prestadores de servicios a domicilio que necesitan organizar su agenda',
    'Negocios de servicios (peluquerías, talleres, consultorios) que quieren reservas online',
    'Freelancers especializados que ofrecen servicios presenciales',
    'Cualquier persona con un oficio que quiera ser encontrada fácilmente',
  ],
  audienceClosingLine:
    '¿Buscas un servicio confiable cerca de ti, o eres prestador y quieres que más clientes te encuentren? ROHU Connect te conecta.',
  hero: {
    eyebrow: 'ROHU Connect · Marketplace de servicios',
    h1: 'El servicio que necesitas, cerca de ti y listo para reservar',
    subheadline:
      'Encuentra al profesional indicado por cercanía, reseñas y disponibilidad real. Reserva en segundos, sin llamadas. Y si eres prestador, recibe clientes nuevos todos los días.',
  },
  benefits: {
    eyebrow: 'Beneficios',
    sectionTitle: 'Todo lo que necesitas para encontrar o prestar servicios',
    sectionSubtitle:
      'Ya sea que busques un servicio o que quieras ofrecer el tuyo, ROHU Connect simplifica la conexión.',
    cards: [
      {
        id: 'geo_matching',
        title: 'Búsqueda por cercanía',
        description: 'Encuentra proveedores cerca de ti ordenados por distancia, calificación y disponibilidad real.',
        icon: 'MapPin',
      },
      {
        id: 'instant_booking',
        title: 'Reserva al instante',
        description: 'Agenda el servicio que necesitas en segundos, sin llamadas ni WhatsApp de ida y vuelta.',
        icon: 'CalendarClock',
      },
      {
        id: 'verified_providers',
        title: 'Proveedores verificados',
        description: 'Cada prestador pasa por un proceso de verificación antes de aparecer en la plataforma.',
        icon: 'BadgeCheck',
      },
      {
        id: 'ratings_reviews',
        title: 'Reseñas reales',
        description: 'Ve lo que otros clientes opinan antes de reservar. Cada calificación viene de un servicio completado.',
        icon: 'Star',
      },
      {
        id: 'provider_agenda',
        title: 'Agenda inteligente para prestadores',
        description: 'Los proveedores gestionan su disponibilidad y horarios. Anti-doble-booking automático.',
        icon: 'Clock',
      },
      {
        id: 'notifications',
        title: 'Notificaciones en tiempo real',
        description: 'Confirmaciones, recordatorios y actualizaciones por push, email y SMS — para clientes y prestadores.',
        icon: 'Bell',
      },
      {
        id: 'compliance',
        title: 'Datos protegidos',
        description: 'Trazabilidad completa, cifrado de datos sensibles y alineación con la Ley 1581 de Habeas Data.',
        icon: 'ShieldCheck',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'Cómo funciona',
    sectionTitle: 'Así de fácil es usar ROHU Connect',
    sectionSubtitle:
      'Ya seas cliente buscando un servicio o prestador ofreciendo el tuyo, el proceso es simple.',
    steps: [
      {
        number: 1,
        title: 'Busca o regístrate',
        description:
          'Como cliente: busca el servicio que necesitas por categoría y ubicación. Como prestador: crea tu perfil profesional con servicios, fotos y horarios.',
        hint: 'Regístrate gratis en menos de 2 minutos.',
      },
      {
        number: 2,
        title: 'Compara y elige',
        description:
          'Ve los proveedores más cercanos con sus calificaciones, precios y disponibilidad real. Elige el que mejor se ajuste a lo que necesitas.',
        hint: 'Filtros por distancia, precio, calificación y horario.',
      },
      {
        number: 3,
        title: 'Reserva y confirma',
        description:
          'Agenda el servicio en la franja horaria que te sirva. El prestador recibe la solicitud y confirma en minutos.',
        hint: 'Sin llamadas, sin WhatsApp, sin esperas innecesarias.',
      },
      {
        number: 4,
        title: 'Recibe, califica y repite',
        description:
          'Disfruta el servicio, califica al prestador y ayuda a la comunidad. El prestador construye su reputación con cada trabajo bien hecho.',
        hint: 'Tu calificación ayuda a otros clientes a elegir mejor.',
      },
    ],
  },
  modules: {
    eyebrow: 'Funcionalidades',
    sectionTitle: 'Todo lo que hace posible la conexión',
    sectionSubtitle:
      'Tecnología construida para conectar clientes y prestadores con la menor fricción posible.',
    items: [
      { id: 'identity', label: 'Registro y acceso', description: 'Crea tu cuenta como cliente o prestador con datos cifrados.', icon: 'KeyRound' },
      { id: 'geo_matching', label: 'Búsqueda geoespacial', description: 'Encuentra proveedores cercanos por distancia, rating y disponibilidad.', icon: 'MapPin' },
      { id: 'requests', label: 'Solicitudes de servicio', description: 'Flujo completo: solicitud, asignación, ejecución y cierre.', icon: 'ClipboardList' },
      { id: 'profiles', label: 'Perfiles de prestador', description: 'Portafolio profesional con servicios, fotos, precios y verificación.', icon: 'BadgeCheck' },
      { id: 'booking', label: 'Reservas y agenda', description: 'Agendamiento con anti-doble-booking automático en el horario del prestador.', icon: 'CalendarClock' },
      { id: 'reviews', label: 'Calificaciones', description: 'Reseñas de clientes reales con promedio visible para todos.', icon: 'Star' },
      { id: 'commissions', label: 'Comisiones y cobros', description: 'Cálculo automático de comisión por servicio completado.', icon: 'Percent' },
      { id: 'notifications', label: 'Notificaciones', description: 'Push, email, SMS e in-app para confirmaciones, recordatorios y actualizaciones.', icon: 'Bell' },
      { id: 'admin', label: 'Panel de operación', description: 'Gestión de proveedores, verificación, disputas y métricas del marketplace.', icon: 'LayoutDashboard' },
      { id: 'audit', label: 'Trazabilidad', description: 'Registro auditable de cada reserva, pago y acción en la plataforma.', icon: 'ScrollText' },
      { id: 'i18n', label: 'Multi-idioma', description: 'Interfaz lista para varios idiomas y expansión regional.', icon: 'Languages' },
      { id: 'realtime', label: 'Procesamiento en tiempo real', description: 'Confirmaciones instantáneas y actualizaciones de estado en vivo.', icon: 'Zap' },
    ],
  },
  pricing: {
    eyebrow: 'Planes y precios',
    sectionTitle: 'Un modelo justo para clientes y prestadores',
    sectionSubtitle:
      'Los clientes buscan y reservan gratis. Los prestadores eligen el plan que se ajusta a su volumen. ROHU cobra una comisión mínima por cada servicio completado.',
    tiers: [
      {
        id: 'starter',
        name: 'Inicial',
        tagline: 'Para prestadores que empiezan',
        isPopular: false,
        targetAudience:
          'Ideal para profesionales independientes que quieren probar la plataforma y recibir sus primeros clientes.',
        features: [
          'Perfil profesional verificado',
          'Hasta 3 categorías de servicio',
          'Agenda con anti-doble-booking',
          'Hasta 20 reservas / mes',
          'Reseñas y calificaciones',
          'Notificaciones push y email',
          'Soporte por email',
        ],
        highlightedFeatures: ['Perfil verificado', '20 reservas/mes', 'Gratis para empezar'],
        ctaLabel: 'Empezar gratis',
        billingNote: 'Gratis el primer mes · luego $29.900/mes + comisión por servicio',
      },
      {
        id: 'profesional',
        name: 'Profesional',
        tagline: 'Para prestadores con flujo constante',
        isPopular: true,
        popularLabel: 'Más popular',
        targetAudience:
          'Para profesionales y negocios que ya tienen clientes y quieren crecer con más visibilidad y herramientas.',
        features: [
          'Categorías de servicio ilimitadas',
          'Reservas ilimitadas',
          'Prioridad en resultados de búsqueda',
          'Panel de métricas y rendimiento',
          'Fotos y portafolio extendido',
          'Soporte prioritario por chat',
          'Insignia "Profesional" en perfil',
        ],
        highlightedFeatures: ['Reservas ilimitadas', 'Prioridad en búsqueda', 'Panel de métricas'],
        ctaLabel: 'Elegir Profesional',
        billingNote: '$59.900/mes + comisión por servicio · sin permanencia',
      },
      {
        id: 'negocio',
        name: 'Negocio',
        tagline: 'Para negocios con equipo',
        isPopular: false,
        targetAudience:
          'Para peluquerías, talleres, consultorios y negocios de servicios que tienen múltiples empleados atendiendo.',
        features: [
          'Todo lo del plan Profesional',
          'Múltiples prestadores bajo una misma cuenta',
          'Agendas individuales por empleado',
          'Reportes consolidados del negocio',
          'Comisión reducida por volumen',
          'Contacto dedicado de soporte',
          'Personalización de perfil del negocio',
        ],
        highlightedFeatures: ['Equipo multi-prestador', 'Comisión reducida', 'Contacto dedicado'],
        ctaLabel: 'Cotizar para mi negocio',
        billingNote: 'Desde $99.900/mes · precio según número de empleados',
      },
    ],
  },
  socialProof: {
    eyebrow: 'Testimonios',
    sectionTitle: 'Lo que dicen quienes ya usan ROHU Connect',
    disclaimer:
      'Los siguientes testimonios son ilustrativos y no corresponden a usuarios reales identificados.',
    testimonials: [
      {
        id: 'ct1',
        quote:
          'Antes pasaba horas en WhatsApp buscando quién me arreglara una llave. Ahora abro Connect, veo quién está cerca y disponible, y reservo en un minuto.',
        name: 'Carolina M.',
        role: 'Cliente frecuente',
        business: 'Bogotá',
      },
      {
        id: 'ct2',
        quote:
          'Desde que estoy en ROHU Connect me llegan clientes nuevos todas las semanas sin gastar en publicidad. La agenda me organiza el día y las reseñas me dan credibilidad.',
        name: 'Jorge L.',
        role: 'Electricista independiente',
        business: 'Medellín',
      },
      {
        id: 'ct3',
        quote:
          'En mi peluquería teníamos una libreta para las citas. Ahora los clientes reservan directo y cada estilista ve su propia agenda. Menos líos y más tiempo para trabajar.',
        name: 'Sandra P.',
        role: 'Dueña de peluquería',
        business: 'Cali',
      },
    ],
  },
  faqs: {
    eyebrow: 'Preguntas frecuentes',
    sectionTitle: '¿Cómo funciona ROHU Connect?',
    sectionSubtitle:
      'Las respuestas que más nos hacen clientes y prestadores.',
    items: [
      {
        id: 'what_is',
        question: '¿Qué es ROHU Connect?',
        answer:
          'Es un marketplace de servicios locales donde los consumidores encuentran proveedores cercanos verificados (limpieza, plomería, belleza, mascotas, tutorías y más) y reservan directamente desde la app. Para los prestadores, es un canal de clientes nuevos con agenda integrada.',
      },
      {
        id: 'cost_customer',
        question: '¿Cuánto cuesta usar ROHU Connect como cliente?',
        answer:
          'Buscar, comparar y reservar es gratis. Solo se cobra una comisión pequeña al completarse cada servicio, que ayuda a mantener la plataforma, las verificaciones y el soporte.',
      },
      {
        id: 'cost_provider',
        question: '¿Cuánto cuesta para un prestador?',
        answer:
          'El primer mes es gratis para que pruebes sin compromiso. Después, eliges un plan mensual según tu volumen (desde $29.900/mes). Además hay una comisión por cada servicio completado. Sin permanencia: puedes cancelar cuando quieras.',
      },
      {
        id: 'categories',
        question: '¿Qué servicios puedo encontrar o ofrecer?',
        answer:
          'Cualquier servicio local que pueda reservarse: limpieza del hogar, cerrajería, plomería, electricidad, manicura, peluquería, cuidado de mascotas, clases particulares, mecánica, mantenimiento, y muchos más.',
      },
      {
        id: 'verification',
        question: '¿Cómo sé que un prestador es confiable?',
        answer:
          'Cada prestador pasa por un proceso de verificación de identidad y documentos antes de aparecer en la plataforma. Además, las reseñas son de clientes reales que efectivamente recibieron el servicio.',
      },
      {
        id: 'booking',
        question: '¿Cómo funciona la reserva?',
        answer:
          'Buscas el servicio, eliges al prestador que prefieres según cercanía, precio y reseñas, y seleccionas la franja horaria disponible. El prestador confirma en minutos. Sin llamadas.',
      },
      {
        id: 'cancellations',
        question: '¿Qué pasa si necesito cancelar una reserva?',
        answer:
          'Puedes cancelar sin costo si lo haces con más de 24 horas de anticipación. Las cancelaciones tardías pueden generar un cargo mínimo para proteger al prestador que ya reservó su tiempo.',
      },
      {
        id: 'disputes',
        question: '¿Qué pasa si hay un problema con el servicio?',
        answer:
          'Puedes reportar el problema desde la app. Nuestro equipo de soporte media entre cliente y prestador para encontrar una solución justa. La trazabilidad de la reserva ayuda a resolver disputas rápidamente.',
      },
      {
        id: 'mobile',
        question: '¿Hay app móvil?',
        answer:
          'Por ahora ROHU Connect es una app web progresiva (PWA) que se instala desde el navegador y funciona como app nativa. Las apps para iOS y Android están en desarrollo.',
      },
      {
        id: 'coverage',
        question: '¿En qué ciudades está disponible?',
        answer:
          'Estamos empezando en las principales ciudades de Colombia y expandiendo cobertura cada mes. Si no hay prestadores en tu zona aún, regístrate como prestador y sé el primero.',
      },
    ],
  },
  ctaFinal: {
    eyebrow: '¿Listo para conectar?',
    sectionTitle: 'Encuentra servicios o consigue más clientes hoy',
    body:
      'Si buscas un servicio confiable cerca de ti, entra y reserva. Si eres prestador y quieres que más personas te encuentren, crea tu perfil en minutos. ROHU Connect te conecta con quien necesitas.',
  },
  metaTitle: 'ROHU Connect — Encuentra servicios cerca de ti y reserva al instante',
  metaDescription:
    'Marketplace de servicios locales. Encuentra proveedores verificados por cercanía, reseñas y disponibilidad. Reserva limpieza, plomería, belleza, mascotas y más en segundos. Prestadores: recibe clientes nuevos con agenda integrada.',
};

/**
 * ROHU Learn English — third live application in the catalog.
 *
 * AI-powered English tutoring platform for Spanish speakers. Conversational
 * practice with "Ms. Emma" (Groq LLaMA 3.1 8B), vocab & listening quizzes,
 * verb conjugation tables, TTS/STT pronunciation, and a gamified XP/level
 * progression system (7 levels, daily streaks).
 *
 * Source code: /home/hfgomezgo/personal/learn-english
 * Stack: Next.js 16 + React 19 + TypeScript + Tailwind 4 + Groq SDK.
 * Production: https://rohu-learn-english-618631350630.herokuapp.com
 */
const rohuLearnEnglish: Application = {
  id: 'rohu-learn-english',
  slug: 'rohu-learn-english',
  name: 'ROHU Learn English',
  shortName: 'Learn English',
  tagline: 'Aprende inglés conversando con una tutora IA',
  description:
    'Plataforma de aprendizaje de inglés para hispanohablantes con tutora IA conversacional, quizzes de vocabulario y listening, conjugaciones, pronunciación y un sistema de niveles con XP y rachas diarias. Sin libros, sin clases aburridas.',
  status: 'live',
  iconName: 'GraduationCap',
  accentColor: 'accent',
  previewUrl: 'https://rohu-learn-english-618631350630.herokuapp.com/',
  targetAudience: [
    'Hispanohablantes que quieren mejorar su inglés conversando',
    'Estudiantes de colegio o universidad que necesitan practicar',
    'Profesionales que requieren inglés para su trabajo',
    'Viajeros preparándose para un viaje al exterior',
    'Personas autodidactas que prefieren aprender a su ritmo',
    'Padres que buscan una herramienta práctica para sus hijos',
  ],
  audienceClosingLine:
    'Si hablas español y quieres mejorar tu inglés con práctica real y feedback inmediato, ROHU Learn English es para ti.',
  hero: {
    eyebrow: 'ROHU Learn English · Tutor IA',
    h1: 'Aprende inglés conversando con Ms. Emma, tu tutora de inteligencia artificial',
    subheadline:
      'Practica inglés hablando con una IA que te corrige en tiempo real, te hace quizzes y te sube de nivel. Sin libros, sin horarios, sin presión. Desde tu celular o computador.',
  },
  benefits: {
    eyebrow: 'Beneficios',
    sectionTitle: 'Todo lo que necesitas para aprender inglés de verdad',
    sectionSubtitle:
      'No es una app de memoria. Es práctica conversacional real con una tutora que te corrige, te reta y te motiva.',
    cards: [
      {
        id: 'ai_chat',
        title: 'Conversación con IA',
        description: 'Chatea en inglés con Ms. Emma. Ella te responde, te corrige la gramática y te sugiere frases para practicar.',
        icon: 'MessageCircle',
      },
      {
        id: 'grammar_feedback',
        title: 'Corrección gramatical instantánea',
        description: 'Cada mensaje que envías recibe feedback: puntaje por gramática correcta y señalamiento de errores con explicación.',
        icon: 'CheckCircle',
      },
      {
        id: 'vocab_quiz',
        title: 'Quizzes de vocabulario',
        description: 'Tres niveles de dificultad (fácil, medio, difícil). Responde escribiendo o hablando — ganas más puntos con voz.',
        icon: 'Brain',
      },
      {
        id: 'listening',
        title: 'Comprensión auditiva',
        description: 'Escucha frases y responde preguntas. 10 preguntas por sesión con bonificación por pronunciación.',
        icon: 'Headphones',
      },
      {
        id: 'pronunciation',
        title: 'Pronunciación con voz real',
        description: 'El sistema lee en voz alta y tú respondes hablando. Reconocimiento de voz integrado en el navegador.',
        icon: 'Mic',
      },
      {
        id: 'conjugations',
        title: 'Conjugaciones de verbos',
        description: 'Panel interactivo con conjugaciones por tiempo verbal y pronombre. Busca cualquier verbo y ve todas sus formas.',
        icon: 'BookOpen',
      },
      {
        id: 'gamification',
        title: 'XP, niveles y rachas diarias',
        description: '7 niveles de Beginner a Master. Ganas XP por cada mensaje, quiz y palabra buscada. Mantén tu racha diaria.',
        icon: 'Trophy',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'Cómo funciona',
    sectionTitle: 'Así de simple es empezar a practicar',
    sectionSubtitle:
      'No necesitas saber inglés perfecto para empezar. Ms. Emma se adapta a tu nivel.',
    steps: [
      {
        number: 1,
        title: 'Crea tu cuenta',
        description:
          'Regístrate en menos de un minuto. No necesitas tarjeta de crédito ni descargar nada.',
        hint: 'Funciona directo desde el navegador de tu celular o computador.',
      },
      {
        number: 2,
        title: 'Conversa con Ms. Emma',
        description:
          'Escríbele en inglés (o en español si necesitas ayuda) y ella te responde con correcciones y sugerencias.',
        hint: 'La IA se adapta a tu nivel. Si eres principiante, te guía paso a paso.',
      },
      {
        number: 3,
        title: 'Practica con quizzes',
        description:
          'Pon a prueba tu vocabulario y comprensión auditiva con quizzes interactivos. Puedes responder escribiendo o hablando.',
        hint: '+10 XP por respuesta correcta escrita, +15 XP si la dices con voz.',
      },
      {
        number: 4,
        title: 'Sube de nivel',
        description:
          'Acumula XP, sube de nivel (de Beginner a Master) y mantén tu racha diaria. Cada día que practiques cuenta.',
        hint: '7 niveles, 2.000+ XP para llegar a Master. ¿Cuánto te tardas?',
      },
    ],
  },
  modules: {
    eyebrow: 'Funcionalidades',
    sectionTitle: 'Ocho herramientas para aprender de verdad',
    sectionSubtitle:
      'Cada módulo está diseñado para practicar una habilidad diferente del inglés.',
    items: [
      { id: 'ai_tutor', label: 'Chat con Ms. Emma', description: 'Conversación IA con feedback gramatical y sugerencias contextuales.', icon: 'MessageCircle' },
      { id: 'vocab_quiz', label: 'Quiz de vocabulario', description: 'Preguntas generadas por IA en 3 niveles de dificultad.', icon: 'Brain' },
      { id: 'listening_quiz', label: 'Quiz de listening', description: '10 preguntas de comprensión auditiva por sesión.', icon: 'Headphones' },
      { id: 'conjugations', label: 'Conjugaciones', description: 'Panel interactivo de verbos por tiempo y pronombre.', icon: 'BookOpen' },
      { id: 'dictionary', label: 'Diccionario', description: 'Busca palabras con definición, pistas en español y pronunciación.', icon: 'Search' },
      { id: 'tts', label: 'Texto a voz', description: 'Escucha la pronunciación correcta de cualquier frase.', icon: 'Volume2' },
      { id: 'stt', label: 'Voz a texto', description: 'Responde hablando. El sistema reconoce tu voz y valida tu pronunciación.', icon: 'Mic' },
      { id: 'progression', label: 'Progresión y niveles', description: 'XP, 7 niveles, rachas diarias e historial de 30 días.', icon: 'Trophy' },
    ],
  },
  pricing: {
    eyebrow: 'Planes y precios',
    sectionTitle: 'Empieza gratis y avanza a tu ritmo',
    sectionSubtitle:
      'No necesitas pagar para empezar a practicar. Cuando quieras más, elige el plan que se ajuste a ti.',
    tiers: [
      {
        id: 'free',
        name: 'Gratis',
        tagline: 'Para probar sin compromiso',
        isPopular: false,
        targetAudience:
          'Ideal para quien quiere conocer la plataforma y hacer sus primeras conversaciones con Ms. Emma.',
        features: [
          'Chat con Ms. Emma (10 mensajes/día)',
          '1 quiz de vocabulario diario',
          'Diccionario y conjugaciones ilimitados',
          'Texto a voz incluido',
          'Progresión y niveles',
          'Racha diaria',
        ],
        highlightedFeatures: ['10 mensajes/día', 'Quiz diario', 'Gratis por siempre'],
        ctaLabel: 'Empezar gratis',
        billingNote: 'Sin tarjeta de crédito · sin límite de tiempo',
      },
      {
        id: 'premium',
        name: 'Premium',
        tagline: 'Para quien quiere aprender en serio',
        isPopular: true,
        popularLabel: 'Más popular',
        targetAudience:
          'Para estudiantes y profesionales que quieren práctica ilimitada y acceso a todos los módulos.',
        features: [
          'Chat ilimitado con Ms. Emma',
          'Quizzes de vocabulario y listening ilimitados',
          'Reconocimiento de voz (STT)',
          'Todos los niveles de dificultad',
          'Historial completo de progreso',
          'Soporte prioritario',
          'Sin publicidad',
        ],
        highlightedFeatures: ['Chat ilimitado', 'Listening + STT', 'Sin publicidad'],
        ctaLabel: 'Elegir Premium',
        billingNote: '$29.900/mes · cancela cuando quieras',
      },
      {
        id: 'familiar',
        name: 'Familiar',
        tagline: 'Para toda la familia',
        isPopular: false,
        targetAudience:
          'Para familias que quieren que todos practiquen. Hasta 5 perfiles independientes con progreso separado.',
        features: [
          'Todo lo del plan Premium',
          'Hasta 5 perfiles independientes',
          'Progreso separado por persona',
          'Control parental para menores',
          'Reportes de avance por perfil',
          'Precio por familia, no por persona',
        ],
        highlightedFeatures: ['5 perfiles', 'Control parental', 'Progreso individual'],
        ctaLabel: 'Elegir Familiar',
        billingNote: '$49.900/mes · hasta 5 personas',
      },
    ],
  },
  socialProof: {
    eyebrow: 'Testimonios',
    sectionTitle: 'Lo que dicen quienes ya practican con Ms. Emma',
    disclaimer:
      'Los siguientes testimonios son ilustrativos y no corresponden a usuarios reales identificados.',
    testimonials: [
      {
        id: 'let1',
        quote:
          'Llevo tres semanas hablando con Ms. Emma todos los días. Me corrige sin hacerme sentir mal y cada día entiendo más. Ya voy en nivel Pre-Intermediate.',
        name: 'Daniela R.',
        role: 'Estudiante universitaria',
        business: 'Bogotá',
      },
      {
        id: 'let2',
        quote:
          'En mi trabajo necesito leer emails en inglés y responder rápido. Desde que uso ROHU Learn English me siento más seguro escribiendo — Ms. Emma me enseñó estructuras que no encontré en ningún curso.',
        name: 'Carlos M.',
        role: 'Analista de comercio exterior',
        business: 'Medellín',
      },
      {
        id: 'let3',
        quote:
          'Mis hijos no querían tomar clases de inglés. Con Ms. Emma practican solos, les gustan los quizzes y compiten por quién tiene más XP. Ahora practican sin que les toque rogarles.',
        name: 'Patricia G.',
        role: 'Madre de familia',
        business: 'Cali',
      },
    ],
  },
  faqs: {
    eyebrow: 'Preguntas frecuentes',
    sectionTitle: '¿Cómo funciona ROHU Learn English?',
    sectionSubtitle:
      'Las respuestas que más nos hacen los usuarios antes de empezar.',
    items: [
      {
        id: 'what_is',
        question: '¿Qué es ROHU Learn English?',
        answer:
          'Es una plataforma web donde practicas inglés conversando con Ms. Emma, una tutora de inteligencia artificial. Ella te corrige la gramática, te sugiere frases y te hace quizzes de vocabulario y comprensión auditiva.',
      },
      {
        id: 'level',
        question: '¿Necesito saber inglés para empezar?',
        answer:
          'No. Ms. Emma se adapta a tu nivel. Si eres principiante, te guía paso a paso con pistas en español. Si ya tienes base, sube la dificultad automáticamente.',
      },
      {
        id: 'free',
        question: '¿Es gratis?',
        answer:
          'Sí, puedes usar el plan Gratis sin límite de tiempo: 10 mensajes al día, un quiz diario, diccionario y conjugaciones ilimitados. Para práctica ilimitada, el plan Premium cuesta $29.900/mes.',
      },
      {
        id: 'mobile',
        question: '¿Funciona en el celular?',
        answer:
          'Sí. ROHU Learn English es una app web que funciona directo desde el navegador de tu celular o computador. No necesitas descargar nada.',
      },
      {
        id: 'voice',
        question: '¿Puedo practicar hablando?',
        answer:
          'Sí. El sistema tiene reconocimiento de voz: puedes responder los quizzes hablando en vez de escribiendo y ganas más puntos. También puedes escuchar la pronunciación correcta de cualquier frase.',
      },
      {
        id: 'progress',
        question: '¿Cómo funciona el sistema de niveles?',
        answer:
          'Hay 7 niveles, de Beginner a Master. Ganas XP por cada mensaje, quiz y palabra que busques. Tu nivel sube automáticamente al acumular suficientes puntos. También hay rachas diarias para motivarte.',
      },
      {
        id: 'internet',
        question: '¿Necesito internet para usarlo?',
        answer:
          'Sí, la tutora IA necesita conexión a internet para responder. El diccionario y las conjugaciones también requieren conexión.',
      },
      {
        id: 'privacy',
        question: '¿Mis conversaciones son privadas?',
        answer:
          'Sí. Tus conversaciones con Ms. Emma no se comparten con nadie. Los datos de progreso se guardan localmente en tu navegador. ROHU Solutions cumple con la Ley 1581 de Habeas Data.',
      },
    ],
  },
  ctaFinal: {
    eyebrow: '¿Listo para practicar?',
    sectionTitle: 'Tu primera conversación en inglés empieza hoy',
    body:
      'No importa tu nivel. Ms. Emma te espera para conversar, corregirte y ayudarte a mejorar. Crea tu cuenta gratis y empieza a hablar inglés ahora.',
  },
  metaTitle: 'ROHU Learn English — Aprende inglés con tutora IA conversacional',
  metaDescription:
    'Practica inglés conversando con Ms. Emma, una tutora de inteligencia artificial. Quizzes de vocabulario y listening, conjugaciones, pronunciación con voz y sistema de niveles. Para hispanohablantes. Gratis para empezar.',
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

export const applications: Application[] = [rohuContable, rohuConnect, rohuLearnEnglish, ...comingSoonApps];

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
