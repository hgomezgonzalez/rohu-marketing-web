/**
 * Single source of truth for all user-facing Spanish copy.
 * Copy was produced and validated by the conversion-copywriter, legal-compliance
 * and support-onboarding agents. Any change must go through the same review cycle.
 */

export const siteConfig = {
  name: 'ROHU Contable',
  brand: 'ROHU',
  description:
    'Software contable colombiano con POS, inventario, contabilidad PUC/NIIF y reportes. Diseñado para ferreterías, tiendas y comercios en Colombia.',
  locale: 'es-CO',
  keywords: [
    'software contable colombia',
    'POS colombia',
    'inventario',
    'contabilidad PUC',
    'NIIF',
    'ferreterías',
    'tiendas',
    'ROHU Contable',
  ],
} as const;

export const content = {
  nav: {
    items: [
      { id: 'benefits', label: 'Beneficios', href: '#benefits' },
      { id: 'modules', label: 'Módulos', href: '#modules' },
      { id: 'pricing', label: 'Planes', href: '#pricing' },
      { id: 'faqs', label: 'Preguntas', href: '#faqs' },
      { id: 'contact', label: 'Contacto', href: '#contact' },
    ],
    cta_primary: 'Probar Demo',
  },

  hero: {
    eyebrow: 'ROHU Contable · SaaS colombiano',
    h1: 'Controla tu negocio y tu contabilidad desde un solo lugar',
    subheadline:
      'Software diseñado para comercios colombianos que quieren orden, claridad y menos papeleo. Funciona online y offline.',
    cta_primary_label: 'Probar Demo',
    cta_secondary_label: 'Solicitar Implementación',
    cta_tertiary_label: 'Chatear por WhatsApp',
    demo_block: {
      title: 'Acceso demo público',
      notice:
        'Acceso público de uso demostrativo: los datos que aparecen son ficticios. No ingreses información real.',
      user_label: 'Usuario',
      password_label: 'Contraseña',
      copy_user: 'Copiar usuario',
      copy_password: 'Copiar contraseña',
      open_demo: 'Entrar al Demo',
      copied_toast: '¡Copiado al portapapeles!',
    },
  },

  benefits: {
    eyebrow: 'Beneficios',
    section_title: 'Todo lo que tu negocio necesita en un solo sistema',
    section_subtitle:
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
        description: 'Balance general, PyG y flujo de caja generados desde tus propias transacciones.',
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

  audience: {
    eyebrow: 'Para quién es',
    section_title: 'Diseñado para comercios como el tuyo',
    chips: [
      'Ferreterías',
      'Tiendas de barrio',
      'Papelerías',
      'Tiendas de ropa',
      'Minimercados',
      'Distribuidoras y negocios similares',
    ],
    closing_line:
      'Si vendes productos y quieres llevar la contabilidad en orden, ROHU Contable es para ti.',
  },

  how_it_works: {
    eyebrow: 'Cómo funciona',
    section_title: 'Empieza en cuatro pasos',
    section_subtitle: 'Un proceso acompañado de principio a fin. Sin sorpresas.',
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

  social_proof: {
    eyebrow: 'Testimonios',
    section_title: 'Lo que dicen negocios como el tuyo',
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
    metrics: [
      { id: 'm1', label: 'Vende en segundos', description: 'POS ágil pensado para el mostrador.' },
      { id: 'm2', label: 'Controla tu stock', description: 'Sin hojas de cálculo, sin sorpresas.' },
      { id: 'm3', label: 'Reportes claros', description: 'Información lista cuando la necesitas.' },
    ],
  },

  cta_final: {
    eyebrow: 'Solicita una implementación',
    section_title: '¿Listo para poner orden en tu negocio?',
    body: 'Cuéntanos sobre tu empresa y te mostramos cómo ROHU Contable se adapta a lo que necesitas. Sin compromisos, sin tecnicismos.',
    submit_label: 'Enviar solicitud',
    submit_loading: 'Enviando...',
    error_banner: {
      title: 'Hubo un problema al enviar tu solicitud',
      body: 'Revisa tu conexión e inténtalo de nuevo. Si el problema persiste, escríbenos directamente por WhatsApp.',
      retry_label: 'Reintentar',
      whatsapp_label: 'Ir a WhatsApp',
    },
  },

  footer: {
    tagline: 'Tecnología contable pensada para el comercio colombiano.',
    description:
      'ROHU es una empresa de soluciones tecnológicas apalancada en conocimientos contables para ayudarte a cumplir la normativa colombiana con tranquilidad.',
    contact_title: 'Contáctanos',
    legal_title: 'Legal',
    links: {
      privacy: 'Política de privacidad',
      terms: 'Términos y condiciones',
      contact: 'Contacto',
    },
    copyright: `© ${new Date().getFullYear()} ROHU Soluciones. Todos los derechos reservados.`,
    disclaimer_dian:
      'ROHU es una herramienta de soporte informativo y no constituye asesoría tributaria, contable ni jurídica. La presentación de declaraciones ante la DIAN, el cálculo de tributos y el cumplimiento de obligaciones fiscales son responsabilidad exclusiva del contribuyente y de su contador público titulado o revisor fiscal.',
  },

  thank_you: {
    h1: 'Recibimos tu solicitud',
    subtitle:
      'Un asesor de ROHU revisará tu información y te escribirá en menos de 24 horas hábiles.',
    body: 'Gracias por tu interés en ROHU Contable. Ya tenemos tus datos y estamos listos para mostrarte cómo ROHU puede ayudarte a llevar tu negocio con orden, sin complicaciones.',
    next_steps: [
      'Revisa tu WhatsApp o correo — te escribiremos para agendar una demo personalizada.',
      'Prepara una lista breve de tus productos o servicios principales. Nos ayuda a personalizar la demo.',
      'Si tienes preguntas urgentes, puedes escribirnos directamente ahora mismo.',
    ],
    cta_home: 'Volver al inicio',
    cta_whatsapp: 'Chatear por WhatsApp ahora',
    micro_note:
      'Para soporte urgente escríbenos al WhatsApp. Atendemos en horario hábil (L-V 8:00-18:00, S 9:00-13:00).',
  },

  legal: {
    habeas_data_checkbox:
      'He leído y acepto la Política de Privacidad de ROHU y autorizo el tratamiento de mis datos personales para las finalidades allí descritas, conforme a la Ley 1581 de 2012.',
    external_link_tooltip:
      'Al hacer clic serás redirigido a una plataforma de terceros. ROHU no controla esos servicios y aplican sus propios términos.',
  },
} as const;
