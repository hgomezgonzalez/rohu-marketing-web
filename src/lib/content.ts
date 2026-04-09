/**
 * Corporate content for ROHU Solutions (parent company).
 *
 * Every application-specific copy lives in `src/lib/applications.ts` inside
 * the corresponding `Application` entry. This file only holds:
 *   - `siteConfig`: global metadata (name, description, keywords, locale)
 *   - `companyContent`: copy shown on the corporate home (/), Header, Footer,
 *     thank-you page and shared legal snippets.
 *
 * Copy was produced and validated by the conversion-copywriter and
 * legal-compliance agents.
 */

export const siteConfig = {
  name: 'ROHU Solutions',
  legalName: 'ROHU Soluciones',
  brand: 'ROHU',
  description:
    'ROHU Solutions desarrolla aplicaciones SaaS verticales para que mipymes y grandes empresas en Colombia y otras partes del mundo gestionen su negocio con tecnología propia, asequible y especializada por sector.',
  tagline: 'Aplicaciones SaaS verticales para empresas en Colombia y el mundo',
  locale: 'es-CO',
  keywords: [
    'ROHU Solutions',
    'software colombia',
    'SaaS colombia',
    'apps verticales mipymes',
    'software latam',
    'ROHU Contable',
    'soluciones tecnológicas mipymes',
    'software contable',
    'POS colombia',
    'contabilidad PUC',
    'NIIF',
  ],
} as const;

export const companyContent = {
  nav: {
    items: [
      { id: 'applications', label: 'Aplicaciones', href: '#applications' },
      { id: 'about', label: 'Sobre nosotros', href: '#about' },
      { id: 'process', label: 'Proceso', href: '#process' },
      { id: 'faqs', label: 'Preguntas', href: '#faqs' },
      { id: 'contact', label: 'Contacto', href: '#contact' },
    ],
    cta_primary: 'Hablar con un asesor',
  },

  hero: {
    eyebrow: 'ROHU Solutions · Colombia',
    h1: 'Aplicaciones SaaS que conectan tu operación con las exigencias del comercio colombiano',
    subheadline:
      'Software vertical hecho en Colombia, al alcance de mipymes y grandes empresas. Atendemos en todo el país y remotamente a clientes en otras partes del mundo.',
    cta_primary_label: 'Explora nuestras apps',
    cta_secondary_label: 'Habla con un asesor',
  },

  applicationsSection: {
    eyebrow: 'Nuestras aplicaciones',
    section_title: 'Un catálogo que crece con tu negocio',
    section_subtitle:
      'Cada aplicación está pensada para un sector y una necesidad específica. Todas comparten el mismo rigor contable y el mismo acompañamiento.',
    cta_live: 'Ver detalles',
    cta_coming_soon: 'Recibir aviso',
    cta_beta: 'Probar beta',
    badge_live: 'Disponible',
    badge_coming_soon: 'Próximamente',
    badge_beta: 'Beta',
  },

  about: {
    eyebrow: 'Sobre ROHU Solutions',
    section_title: 'Apps verticales hechas en Colombia para cada tipo de negocio',
    paragraph:
      'ROHU Solutions es una empresa colombiana que desarrolla aplicaciones SaaS especializadas por sector. En lugar de un ERP genérico con módulos desactivados, cada app se piensa desde cero para una vertical: contabilidad, restaurantes, salud, educación, inmobiliario. Atendemos a mipymes y grandes empresas en Colombia y, de forma remota, a clientes en otras partes del mundo. Combinamos tecnología moderna con conocimiento contable y operacional del mercado local para que crecer sea simple.',
    values: [
      {
        id: 'rigor',
        title: 'Verticalización real',
        description: 'Cada app está diseñada desde cero para un sector, no es un ERP genérico con módulos desactivados.',
      },
      {
        id: 'tech',
        title: 'Precio y soporte colombiano',
        description: 'Precios en COP, facturación electrónica DIAN incluida y un equipo que entiende la operación local.',
      },
      {
        id: 'support',
        title: 'Ecosistema escalable',
        description: 'Adopta una app y suma otras del catálogo sin cambiar de proveedor ni perder tus datos.',
      },
    ],
    closing: 'Queremos ser el equipo tecnológico de confianza de cientos de empresas en Colombia y otras partes del mundo.',
  },

  process: {
    eyebrow: 'Cómo trabajamos',
    section_title: 'Un proceso claro de principio a fin',
    section_subtitle: 'Así es cómo acompañamos a cada cliente desde la primera conversación hasta la operación diaria.',
    steps: [
      {
        number: 1,
        title: 'Descubrimiento',
        description: 'Escuchamos tu operación, entendemos tu sector y confirmamos qué aplicación te calza mejor.',
        hint: 'Sin compromiso y sin costo.',
      },
      {
        number: 2,
        title: 'Propuesta a la medida',
        description: 'Te entregamos una propuesta con alcance, plan y tiempos claros, sin sorpresas.',
        hint: 'Tú decides cuándo avanzar.',
      },
      {
        number: 3,
        title: 'Implementación',
        description: 'Configuramos la aplicación con tus datos y capacitamos a tu equipo en sesiones cortas.',
        hint: 'Nos aseguramos de que todos sepan usarla antes de salir a producción.',
      },
      {
        number: 4,
        title: 'Soporte y evolución',
        description: 'Te acompañamos con soporte humano, actualizaciones continuas y mejoras según tu crecimiento.',
        hint: 'Nunca quedas solo con el sistema.',
      },
    ],
  },

  socialProof: {
    eyebrow: 'Testimonios',
    section_title: 'Lo que dicen nuestros clientes',
    disclaimer:
      'Los siguientes testimonios son ilustrativos y no corresponden a clientes reales identificados.',
    testimonials: [
      {
        id: 'ct1',
        quote:
          'Buscábamos una empresa que entendiera de tecnología Y de contabilidad colombiana. ROHU Solutions tiene ambas.',
        name: 'Mariana T.',
        role: 'Gerente general',
        business: 'Distribuidora familiar · Bucaramanga',
      },
      {
        id: 'ct2',
        quote:
          'La implementación fue guiada paso a paso y nuestro equipo aprendió rápido. Excelente acompañamiento.',
        name: 'Andrés L.',
        role: 'Administrador',
        business: 'Cadena de minimercados · Cali',
      },
      {
        id: 'ct3',
        quote:
          'Tener un proveedor local que responde rápido hace toda la diferencia. Nos sentimos respaldados.',
        name: 'Paola H.',
        role: 'Contadora externa',
        business: 'Consultora contable · Medellín',
      },
    ],
  },

  faqs: {
    eyebrow: 'Preguntas frecuentes',
    section_title: 'Preguntas frecuentes sobre ROHU Solutions',
    section_subtitle: 'Lo que más nos preguntan antes de empezar a trabajar juntos.',
    items: [
      {
        id: 'who',
        question: '¿Quiénes son ROHU Solutions?',
        answer:
          'Somos una empresa colombiana dedicada a desarrollar aplicaciones SaaS verticales para mipymes y grandes empresas. Combinamos tecnología moderna con conocimiento contable y operacional del mercado local.',
      },
      {
        id: 'location',
        question: '¿Dónde están ubicados y a dónde llegan?',
        answer:
          'Operamos desde Colombia. Atendemos de forma remota a clientes en todo el país y también a clientes en otras partes del mundo. Para implementaciones in-situ coordinamos visitas según la ubicación y la necesidad del proyecto.',
      },
      {
        id: 'cost',
        question: '¿Cuánto cuesta trabajar con ustedes?',
        answer:
          'Los costos dependen del tamaño de tu empresa y la aplicación que elijas. Nuestros planes se presentan como cotización personalizada tras una conversación de diagnóstico sin compromiso.',
      },
      {
        id: 'time',
        question: '¿Cuánto tarda una implementación típica?',
        answer:
          'Una implementación estándar toma entre 3 y 10 días hábiles. Proyectos con más sedes o migraciones complejas pueden tomar más tiempo; lo estimamos en la propuesta.',
      },
      {
        id: 'custom',
        question: '¿Qué pasa si necesito una app que no tienen en el catálogo?',
        answer:
          'Cuéntanos tu caso. Evaluamos si encaja en nuestra línea de producto y, si lo hace, lo incluimos en nuestra hoja de ruta. En algunos casos hacemos desarrollos a la medida.',
      },
      {
        id: 'security',
        question: '¿Mis datos y los de mis clientes están seguros?',
        answer:
          'Todos nuestros sistemas usan servidores con respaldo periódico y tratamos los datos personales conforme a la Ley 1581 de 2012 (Habeas Data). Consulta nuestra Política de Privacidad.',
      },
      {
        id: 'support_after',
        question: '¿Ofrecen soporte después de la implementación?',
        answer:
          'Sí. Cada aplicación incluye un plan de soporte continuo con canales de atención, actualizaciones y mejoras periódicas según tu plan.',
      },
      {
        id: 'demo',
        question: '¿Puedo pedir una demo antes de decidirme?',
        answer:
          'Por supuesto. Cada aplicación con demo pública tiene credenciales de prueba visibles en su página. Además, podemos agendar una demo guiada por videollamada.',
      },
    ],
  },

  ctaFinal: {
    eyebrow: 'Hablemos',
    section_title: '¿Listo para dar el siguiente paso?',
    body: 'Cuéntanos sobre tu negocio y te ayudamos a elegir la aplicación adecuada. Si aún no sabes cuál te calza, elige "Asesoría general" y te orientamos sin compromiso.',
  },

  footer: {
    tagline: 'Soluciones tecnológicas hechas en Colombia, al servicio del mundo.',
    description:
      'ROHU Solutions desarrolla aplicaciones SaaS apalancadas en conocimientos contables y operacionales para cumplir las políticas colombianas. Atendemos mipymes y grandes empresas en Colombia y, de forma remota, a clientes en otras partes del mundo.',
    applications_title: 'Aplicaciones',
    contact_title: 'Contáctanos',
    legal_title: 'Legal',
    company_title: 'Empresa',
    links: {
      privacy: 'Política de privacidad',
      terms: 'Términos y condiciones',
      contact: 'Contacto',
      about: 'Sobre nosotros',
      process: 'Cómo trabajamos',
    },
    copyright: `© ${new Date().getFullYear()} ROHU Soluciones. Todos los derechos reservados.`,
    disclaimer_dian:
      'ROHU Solutions ofrece herramientas de soporte informativo que no constituyen asesoría tributaria, contable ni jurídica. La presentación de declaraciones ante la DIAN, el cálculo de tributos y el cumplimiento de obligaciones fiscales son responsabilidad exclusiva del contribuyente y de su contador público titulado o revisor fiscal.',
  },
} as const;

/**
 * Content shared across any page: lead form, thank-you, legal snippets.
 */
export const commonContent = {
  leadForm: {
    application_label: 'Aplicación de interés',
    application_helper:
      'Elige la aplicación sobre la que quieres conversar. Si no estás seguro, selecciona "Asesoría general".',
    submit_label: 'Enviar solicitud',
    submit_loading: 'Enviando...',
    error_banner: {
      title: 'Hubo un problema al enviar tu solicitud',
      body: 'Revisa tu conexión e inténtalo de nuevo. Si el problema persiste, escríbenos directamente por WhatsApp.',
      retry_label: 'Reintentar',
      whatsapp_label: 'Ir a WhatsApp',
    },
  },

  thank_you: {
    h1: 'Recibimos tu solicitud',
    subtitle:
      'Un asesor de ROHU Solutions revisará tu información y te escribirá en menos de 24 horas hábiles.',
    body: 'Gracias por tu interés en ROHU Solutions. Ya tenemos tus datos y estamos listos para conversar sobre cómo podemos ayudarte con tu negocio.',
    next_steps: [
      'Revisa tu WhatsApp o correo — te escribiremos para coordinar una demo personalizada.',
      'Si ya tienes información de tu empresa o del sector, tenla a mano para agilizar la conversación.',
      'Si tienes preguntas urgentes, puedes escribirnos directamente ahora mismo.',
    ],
    cta_home: 'Volver al inicio',
    cta_whatsapp: 'Chatear por WhatsApp ahora',
    micro_note:
      'Para soporte urgente escríbenos al WhatsApp. Atendemos en horario hábil (L-V 8:00-18:00, S 9:00-13:00).',
  },

  legal: {
    habeas_data_checkbox:
      'He leído y acepto la Política de Privacidad de ROHU Solutions y autorizo el tratamiento de mis datos personales para las finalidades allí descritas, conforme a la Ley 1581 de 2012.',
    external_link_tooltip:
      'Al hacer clic serás redirigido a una plataforma de terceros. ROHU no controla esos servicios y aplican sus propios términos.',
  },
} as const;

/**
 * Feature flags for gradual rollouts. Flip a flag and redeploy to enable.
 */
export const FEATURE_FLAGS = {
  /**
   * Set to true only when at least one real customer has authorized the
   * publication of their testimonial in writing. While false, the
   * SocialProofSection renders a "recopilando testimonios" placeholder
   * instead of the mock cards (which stay in the registry, unused).
   */
  TESTIMONIALS_PUBLISHED: false,
} as const;

/**
 * Minimalist copy shown by SocialProofSection while TESTIMONIALS_PUBLISHED is
 * false. Intentionally short and without a CTA — the funnel-designer agent
 * flagged that a secondary CTA here would compete with the final contact form
 * which sits one section below. Low visual surface, zero fake content.
 *
 * Wording approved by the legal-compliance agent: "autorización escrita,
 * previa e informada" is the exact phrasing required by Art. 9 of Ley
 * 1581/2012 (Habeas Data) — the previous "autorización expresa" was
 * insufficient because it did not specify channel or form of consent.
 */
export const pendingTestimonialsCopy = {
  eyebrow: 'Testimonios',
  title: 'Estamos recopilando casos reales',
  body: 'Publicaremos aquí experiencias de clientes únicamente con autorización escrita, previa e informada de cada titular, conforme a la Ley 1581 de 2012.',
} as const;
