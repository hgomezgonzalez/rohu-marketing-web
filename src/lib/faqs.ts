/**
 * FAQs shown on the landing. Content reviewed by the legal-compliance agent
 * (DIAN claim) and the support-onboarding agent (operational answers).
 */
export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export const faqsSection = {
  eyebrow: 'Preguntas frecuentes',
  section_title: '¿Tienes dudas? Aquí te las resolvemos',
  section_subtitle:
    'Respuestas honestas a las preguntas que más recibimos antes de empezar con ROHU Contable.',
};

export const faqs: FaqEntry[] = [
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
      'No. ROHU incluye un módulo de soporte DIAN con información de referencia sobre obligaciones tributarias frecuentes, pero no presenta declaraciones ni reemplaza a tu contador. La responsabilidad del cumplimiento corresponde al contribuyente y su asesor contable. La normativa puede cambiar.',
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
      'Soporte por chat y correo electrónico incluido en todos los planes. El plan Pro tiene atención prioritaria y Enterprise incluye un contacto dedicado. Horario: L-V 8:00-18:00, S 9:00-13:00 (Colombia).',
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
      'Sí, la funcionalidad multi-empresa y multi-sede está disponible en el plan Enterprise. Permite manejar varias empresas o puntos de venta desde una sola cuenta.',
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
      'Sí. Todos los planes incluyen capacitación inicial en los módulos del sistema. Grabamos la sesión para que la puedas repasar. El plan Enterprise ofrece capacitación extendida adaptada al equipo del cliente.',
  },
  {
    id: 'migration',
    question: '¿Puedo migrar mis datos desde Excel u otro sistema?',
    answer:
      'En la mayoría de los casos sí. Revisamos el formato de tus datos y apoyamos el proceso de migración de catálogos, clientes y proveedores. Los tiempos dependen del volumen y calidad de la información.',
  },
];
