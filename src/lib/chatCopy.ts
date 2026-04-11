/**
 * Centralized Spanish copy for the live chat widget. Keeping all strings
 * here follows the same pattern as src/lib/content.ts so a non-developer
 * can adjust tone without digging through React components.
 */

export const chatCopy = {
  fabLabel: 'Chatea con nosotros',
  fabAriaLabel: 'Abrir chat en vivo con ROHU Solutions',
  headerTitle: 'ROHU Solutions',
  headerSubtitle: 'Soporte en vivo',
  closeAria: 'Cerrar chat',

  greeting:
    '👋 ¡Hola! Soy parte del equipo de ROHU. Cuéntanos qué necesitas y te ayudamos en seguida.',

  inputPlaceholder: 'Escribe tu mensaje…',
  sendLabel: 'Enviar',
  sendingLabel: 'Enviando…',

  privacyLine:
    'Al enviar aceptas nuestro aviso de privacidad. Evita compartir datos sensibles en el chat.',
  privacyLinkLabel: 'aviso de privacidad',

  errorGeneric:
    'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.',
  errorValidation: 'Tu mensaje tiene caracteres no válidos. Revisa e inténtalo de nuevo.',
  errorRateLimited: (seconds: number) =>
    `Has enviado muchos mensajes seguidos. Intenta de nuevo en ${seconds}s.`,
  errorReconnecting: 'Reconectando…',

  idleHintTitle: 'Seguimos aquí.',
  idleHintBody:
    'Si es urgente también puedes escribirnos por WhatsApp y te respondemos al instante.',
  idleHintCta: 'Prefiero WhatsApp',

  restartedTitle: 'Conversación reiniciada por mantenimiento',
  restartedBody:
    'Tu sesión anterior ya no está disponible. Envía un nuevo mensaje y seguimos conversando.',
  restartedCta: 'Iniciar nueva conversación',

  leadCardTitle: '¿Nos compartes tus datos?',
  leadCardBody:
    'Opcional. Nos ayuda a darte seguimiento si la conversación se corta o si prefieres que te contactemos después.',
  leadCardFirstNameLabel: 'Nombre',
  leadCardFirstNamePlaceholder: 'Tu nombre',
  leadCardWhatsappLabel: 'WhatsApp',
  leadCardWhatsappPlaceholder: '300 123 4567',
  leadCardEmailLabel: 'Email',
  leadCardEmailPlaceholder: 'tu@correo.com',
  leadCardSubmitLabel: 'Guardar',
  leadCardDismissLabel: 'Ahora no',
  leadCardSuccess: '¡Listo! Ya tenemos tus datos. Seguimos conversando.',
} as const;
